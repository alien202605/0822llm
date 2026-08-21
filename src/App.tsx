import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { RawRepositoryView } from './components/RawRepositoryView';
import { WikiNetworkView } from './components/WikiNetworkView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { QmdSearchAndQueryView } from './components/QmdSearchAndQueryView';
import { LintHealthView } from './components/LintHealthView';
import { ImBotSimulatorModal } from './components/ImBotSimulatorModal';
import { SchemaGovernanceView } from './components/SchemaGovernanceView';
import { PagePlanningView } from './components/PagePlanningView';
import { SharedDriveSyncView } from './components/SharedDriveSyncView';
import { ObsidianAgentEngineView } from './components/ObsidianAgentEngineView';
import { RealtimeKnowledgeEngineView } from './components/RealtimeKnowledgeEngineView';
import { IntelligenceExplorerView } from './components/IntelligenceExplorerView';
import { WebClipperFeishuIngestView } from './components/WebClipperFeishuIngestView';
import { CoreControlMatrixView } from './components/CoreControlMatrixView';
import { CraftDocLayoutView } from './components/CraftDocLayoutView';

import {
  INITIAL_RAW_DOCS,
  INITIAL_WIKI_PAGES,
  INITIAL_LOGS,
  INITIAL_LINT_ISSUES,
  INITIAL_INDEX_MD
} from './data/initialData';
import { ALL_COLLECTION_WIKI_PAGES } from './data/collectionDocs';
import { TabType, LayoutMode, RawDocument, WikiPage, LogEntry, LintIssue } from './types';
import { Language } from './i18n/translations';
import { calculateHealthScore } from './utils/lintEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('craft_doc');
  const [language, setLanguage] = useState<Language>('zh');

  // Central Application State
  const [rawDocs, setRawDocs] = useState<RawDocument[]>(INITIAL_RAW_DOCS);
  const [wikiPages, setWikiPages] = useState<WikiPage[]>(() => {
    const combined = [...INITIAL_WIKI_PAGES, ...ALL_COLLECTION_WIKI_PAGES];
    const map = new Map<string, WikiPage>();
    combined.forEach((p, idx) => {
      const uniqueId = p.id ? `${p.id}-${idx}` : `wiki-${idx}-${Date.now()}`;
      map.set(p.path, { ...p, id: uniqueId });
    });
    return Array.from(map.values());
  });
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [lintIssues, setLintIssues] = useState<LintIssue[]>(INITIAL_LINT_ISSUES);
  const [indexMdContent, setIndexMdContent] = useState<string>(INITIAL_INDEX_MD);

  // Search Dialog state
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  // Target navigation states
  const [targetWikiPagePath, setTargetWikiPagePath] = useState<string>('');

  const { score: healthScore } = calculateHealthScore(wikiPages.length, lintIssues);

  // Add raw doc handler
  const handleAddRawDoc = (newDoc: RawDocument, newPages: WikiPage[]) => {
    setRawDocs(prev => [newDoc, ...prev]);
    setWikiPages(prev => [...newPages, ...prev]);
    const newIndexLines = newPages.map(
      p => `- [[${p.path}]]: ${p.frontmatter.title} (${p.frontmatter.type})`
    );
    setIndexMdContent(prev => prev + '\n' + newIndexLines.join('\n'));
  };

  // Ingest handler
  const handleIngestComplete = (
    updatedRaw: RawDocument,
    newOrUpdatedWikiPages: WikiPage[],
    newLog: LogEntry
  ) => {
    // Update raw doc status
    setRawDocs(prev => prev.map(r => (r.id === updatedRaw.id ? updatedRaw : r)));

    // Merge or add wiki pages
    setWikiPages(prev => {
      const map = new Map<string, WikiPage>();
      prev.forEach(p => map.set(p.path, p));
      newOrUpdatedWikiPages.forEach(p => map.set(p.path, p));
      return Array.from(map.values());
    });

    // Append log
    setLogs(prev => [newLog, ...prev]);

    // Update index.md
    const newIndexLines = newOrUpdatedWikiPages.map(
      p => `- [[${p.path}]]: ${p.frontmatter.title} (${p.frontmatter.type})`
    );
    setIndexMdContent(prev => prev + '\n' + newIndexLines.join('\n'));
  };

  // Update single Wiki page
  const handleUpdateWikiPage = (updatedPage: WikiPage) => {
    setWikiPages(prev => prev.map(p => (p.id === updatedPage.id ? updatedPage : p)));
    const log: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      action: 'WIKI_MANUAL_EDIT',
      source: 'Human Editor',
      targetPages: [updatedPage.path],
      description: `手动更新页面 ${updatedPage.fileName} 并同步双链引用`
    };
    setLogs(prev => [log, ...prev]);
  };

  // Add synthesis page (from Query Two-Output backfeed)
  const handleAddSynthesisPage = (newPage: WikiPage, log: LogEntry) => {
    setWikiPages(prev => [newPage, ...prev]);
    setLogs(prev => [log, ...prev]);
    setIndexMdContent(prev => prev + `\n- [[${newPage.path}]]: ${newPage.frontmatter.title} (synthesis)`);
  };

  // Auto Heal execution
  const handleExecuteAutoHeal = (fixedIssues: LintIssue[], newlyCreatedPages: WikiPage[]) => {
    setLintIssues(fixedIssues);
    if (newlyCreatedPages.length > 0) {
      setWikiPages(prev => [...newlyCreatedPages, ...prev]);
      const newLines = newlyCreatedPages.map(p => `- [[${p.path}]]: ${p.frontmatter.title} (${p.frontmatter.type})`);
      setIndexMdContent(prev => prev + '\n' + newLines.join('\n'));
    }
    const log: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      action: 'LINT_AUTO_HEAL',
      source: 'Lint Engine (Cron Self-Healing)',
      targetPages: newlyCreatedPages.map(p => p.path),
      description: `自动修复 ${fixedIssues.filter(i => i.fixed).length} 个体检异常，补全 ${newlyCreatedPages.length} 篇术语占位页`
    };
    setLogs(prev => [log, ...prev]);
  };

  // Cross-view Navigation handlers
  const handleNavigateToWikiPage = (path: string) => {
    setTargetWikiPagePath(path);
    setCurrentTab('wiki');
  };

  const handleNavigateToRaw = (path: string) => {
    setCurrentTab('raw');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {layoutMode === 'craft_doc' ? (
        <CraftDocLayoutView
          wikiPages={wikiPages}
          rawDocs={rawDocs}
          language={language}
          onLanguageChange={setLanguage}
          onUpdateWikiPage={handleUpdateWikiPage}
          onNavigateToRaw={handleNavigateToRaw}
          onSwitchLayoutMode={setLayoutMode}
          onAddRawDoc={handleAddRawDoc}
          onOpenSearch={() => {
            setLayoutMode('enterprise_hub');
            setCurrentTab('search');
          }}
          onOpenIngest={() => {
            setLayoutMode('enterprise_hub');
            setCurrentTab('raw');
          }}
        />
      ) : (
        <>
          {/* Top Universal Navbar */}
          <Navbar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            healthScore={healthScore}
            rawCount={rawDocs.length}
            wikiCount={wikiPages.length}
            layoutMode={layoutMode}
            onSwitchLayoutMode={setLayoutMode}
            onOpenSearch={() => {
              setCurrentTab('search');
            }}
            onOpenIngest={() => {
              setCurrentTab('raw');
            }}
          />

          {/* Main Content Body */}
          <main className="flex-1 pb-16">
            {currentTab === 'overview' && (
              <OverviewDashboard
                rawDocs={rawDocs}
                wikiPages={wikiPages}
                logs={logs}
                lintIssues={lintIssues}
                healthScore={healthScore}
                onNavigateTab={setCurrentTab}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'console' && (
              <CoreControlMatrixView
                onNavigateToWikiPage={handleNavigateToWikiPage}
                onNavigateToRaw={handleNavigateToRaw}
              />
            )}

            {currentTab === 'obsidian' && (
              <ObsidianAgentEngineView
                wikiPages={wikiPages}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'realtime' && (
              <RealtimeKnowledgeEngineView
                onNavigateToWiki={handleNavigateToWikiPage}
                onAddLog={(action, details) => {
                  const newLog: LogEntry = {
                    id: `log-${Date.now()}`,
                    timestamp: new Date().toLocaleTimeString(),
                    action,
                    source: '实时活知识库引擎 (Real-time Pipeline)',
                    targetPages: ['wiki/company-info/strategic-notice-2026.md'],
                    description: details
                  };
                  setLogs(prev => [newLog, ...prev]);
                }}
              />
            )}

            {currentTab === 'drive' && (
              <SharedDriveSyncView
                onIngestComplete={handleIngestComplete}
                onNavigateToWikiPage={handleNavigateToWikiPage}
                onNavigateToRaw={handleNavigateToRaw}
              />
            )}

            {currentTab === 'clipper' && (
              <WebClipperFeishuIngestView
                onAddRawDoc={handleAddRawDoc}
                onNavigateToRaw={handleNavigateToRaw}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'raw' && (
              <RawRepositoryView
                rawDocs={rawDocs}
                onAddRawDoc={handleAddRawDoc}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'wiki' && (
              <WikiNetworkView
                wikiPages={wikiPages}
                logs={logs}
                indexMdContent={indexMdContent}
                onUpdateWikiPage={handleUpdateWikiPage}
                onNavigateToRaw={handleNavigateToRaw}
              />
            )}

            {currentTab === 'graph' && (
              <KnowledgeGraphView
                wikiPages={wikiPages}
                rawDocs={rawDocs}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'search' && (
              <QmdSearchAndQueryView
                wikiPages={wikiPages}
                onAddSynthesisPage={handleAddSynthesisPage}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'lint' && (
              <LintHealthView
                wikiPages={wikiPages}
                lintIssues={lintIssues}
                healthScore={healthScore}
                onExecuteAutoHeal={handleExecuteAutoHeal}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {currentTab === 'bot' && <ImBotSimulatorModal />}

            {currentTab === 'schema' && <SchemaGovernanceView />}

            {currentTab === 'planning' && (
              <PagePlanningView onNavigateTab={setCurrentTab} />
            )}

            {currentTab === 'intelligence' && <IntelligenceExplorerView />}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-2 font-mono">
              <span className="font-bold text-slate-700">agent alien 知识库</span>
              <span>·</span>
              <span>Git File System + Agent Compilation + qmd Hybrid Retrieval</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLayoutMode('craft_doc')}
                className="text-indigo-600 font-bold hover:underline transition flex items-center space-x-1"
              >
                <span>📑 切换为现代文档排版</span>
              </button>
              <button
                onClick={() => setCurrentTab('planning')}
                className="hover:text-indigo-600 font-medium transition"
              >
                系统规划方案 (PRD)
              </button>
              <button
                onClick={() => setCurrentTab('schema')}
                className="hover:text-indigo-600 font-medium transition"
              >
                .agent/schema.md 规范
              </button>
              <button
                onClick={() => setCurrentTab('overview')}
                className="hover:text-indigo-600 font-medium transition"
              >
                系统拓扑大盘
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
