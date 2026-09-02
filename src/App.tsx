import React, { useState } from 'react';
import { AgentAlienSidebar } from './components/AgentAlienSidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { RawRepositoryView } from './components/RawRepositoryView';
import { WikiNetworkView } from './components/WikiNetworkView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { Graph3DView } from './components/Graph3DView';
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
import { CommandDashboard } from './components/CommandDashboard';
import { CraftDocLayoutView } from './components/CraftDocLayoutView';
import { AdminView } from './components/AdminView';
import { WorkbenchIntegrationsView } from './components/WorkbenchIntegrationsView';
import { AgentAutoTasksView } from './components/AgentAutoTasksView';

import {
  INITIAL_RAW_DOCS,
  INITIAL_WIKI_PAGES,
  INITIAL_LOGS,
  INITIAL_LINT_ISSUES,
  INITIAL_INDEX_MD
} from './data/initialData';
import { ALL_COLLECTION_WIKI_PAGES } from './data/collectionDocs';
import { OBS_CODEX_WIKI_PAGES, OBS_CODEX_RAW_DOCS } from './data/obsCodexData';
import { TabType, RawDocument, WikiPage, LogEntry, LintIssue } from './types';
import { calculateHealthScore } from './utils/lintEngine';
import { api } from './api/client';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('console');
  const [layoutMode, setLayoutMode] = useState<'craft_doc' | 'enterprise_hub'>('enterprise_hub');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Central Application State
  const [rawDocs, setRawDocs] = useState<RawDocument[]>(() => {
    // 合并初始数据和 obs-codex 数据
    return [...INITIAL_RAW_DOCS, ...OBS_CODEX_RAW_DOCS];
  });
  const [wikiPages, setWikiPages] = useState<WikiPage[]>(() => {
    // 合并所有来源的 Wiki 页面
    const combined = [...INITIAL_WIKI_PAGES, ...ALL_COLLECTION_WIKI_PAGES, ...OBS_CODEX_WIKI_PAGES];
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

  React.useEffect(() => {
    let cancelled = false;
    api
      .getUnifiedWikiPages({ page: 1, pageSize: 500 })
      .then((res: any) => {
        if (cancelled || !res?.pages) return;
        const livePages: WikiPage[] = res.pages.map((page: any, index: number) => ({
          id: page.id || `live-${index}`,
          path: page.path,
          fileName: String(page.path || '').split('/').pop() || '',
          frontmatter: {
            title: page.title || page.path,
            type: (page.category || 'guide') as WikiPage['frontmatter']['type'],
            created_at: page.updated_at || '',
            updated_at: page.updated_at || '',
            sources: Array.isArray(page.sources) ? page.sources : [],
            tags: Array.isArray(page.tags) ? page.tags : [],
            status: 'active'
          },
          content: page.content || '',
          rawMarkdown: '',
          outgoingLinks: [],
          wordCount: String(page.content || '').split(/\s+/).filter(Boolean).length
        }));
        setWikiPages(prev => {
          const map = new Map<string, WikiPage>();
          prev.forEach(item => map.set(item.path, item));
          livePages.forEach(item => map.set(item.path, item));
          return Array.from(map.values());
        });
      })
      .catch(err => console.warn('[Live Knowledge] Failed to load unified wiki pages:', err.message));
    return () => {
      cancelled = true;
    };
  }, []);

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
    setRawDocs(prev => prev.map(r => (r.id === updatedRaw.id ? updatedRaw : r)));
    setWikiPages(prev => {
      const map = new Map<string, WikiPage>();
      prev.forEach(p => map.set(p.path, p));
      newOrUpdatedWikiPages.forEach(p => map.set(p.path, p));
      return Array.from(map.values());
    });
    setLogs(prev => [newLog, ...prev]);
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

  // Add synthesis page
  const handleAddSynthesisPage = (newPage: WikiPage) => {
    setWikiPages(prev => [newPage, ...prev]);
    const log: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      action: 'QMD_UPDATE',
      source: 'Qmd Synthesis Engine',
      targetPages: [newPage.path],
      description: `生成综合页面: ${newPage.frontmatter.title}`
    };
    setLogs(prev => [log, ...prev]);
    setIndexMdContent(prev => prev + '\n' + `- [[${newPage.path}]]: ${newPage.frontmatter.title} (${newPage.frontmatter.type})`);
  };

  const handleExecuteAutoHeal = () => {
    const fixed = lintIssues.filter(i => i.autoFixable && !i.fixed);
    const newIssues = lintIssues.map(issue =>
      issue.autoFixable && !issue.fixed ? { ...issue, fixed: true } : issue
    );
    setLintIssues(newIssues);
    const log: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      action: 'LINT_AUTO_HEAL',
      source: 'Auto Heal Daemon',
      targetPages: fixed.map(i => i.sourcePath),
      description: `自动修复 ${fixed.length} 个问题`
    };
    setLogs(prev => [log, ...prev]);
  };

  const handleNavigateToWikiPage = (path: string) => {
    setTargetWikiPagePath(path);
    setCurrentTab('wiki');
  };

  const handleNavigateToRaw = (path: string) => {
    setCurrentTab('raw');
  };

  // Enterprise Hub Layout with Sidebar + Dashboard
  if (layoutMode === 'enterprise_hub') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <div className="flex h-screen overflow-hidden relative">
          {/* Left Sidebar */}
          <aside className={`flex-shrink-0 h-screen overflow-hidden sticky top-0 transition-all duration-300 ${sidebarCollapsed ? 'w-10' : 'w-56'}`}>
            {!sidebarCollapsed && (
              <AgentAlienSidebar
                activeTab={currentTab}
                onNavigate={setCurrentTab}
                healthScore={healthScore}
                onCollapse={() => setSidebarCollapsed(true)}
              />
            )}
          </aside>
          {/* Expand Button - shows when sidebar is collapsed */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="absolute top-3 left-2 z-50 w-8 h-8 rounded-full bg-transparent border border-slate-600/50 text-slate-400 hover:text-blue-400 hover:border-blue-400/50 flex items-center justify-center transition-all duration-300"
              title="展开左侧边栏"
            >
              <span className="text-sm font-bold">&gt;</span>
            </button>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto min-h-0">
            {/* Console / Matrix Rain Dashboard */}
            {currentTab === 'console' && (
              <CommandDashboard
                onNavigateTab={setCurrentTab}
                wikiCount={wikiPages.length}
                healthScore={healthScore}
                rawDocs={rawDocs}
                wikiPages={wikiPages}
                logs={logs}
              />
            )}

            {/* Overview Dashboard */}
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

            {/* Raw Repository */}
            {currentTab === 'raw' && (
              <RawRepositoryView
                rawDocs={rawDocs}
                onAddRawDoc={handleAddRawDoc}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {/* Wiki Network */}
            {currentTab === 'wiki' && (
              <WikiNetworkView
                wikiPages={wikiPages}
                logs={logs}
                indexMdContent={indexMdContent}
                onUpdateWikiPage={handleUpdateWikiPage}
                onNavigateToRaw={handleNavigateToRaw}
              />
            )}

            {/* Knowledge Graph */}
            {currentTab === 'graph' && (
              <Graph3DView
                wikiPages={wikiPages}
                rawDocs={rawDocs}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {/* QMD Search */}
            {currentTab === 'search' && (
              <QmdSearchAndQueryView
                wikiPages={wikiPages}
                onAddSynthesisPage={handleAddSynthesisPage}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {/* Lint Health */}
            {currentTab === 'lint' && (
              <LintHealthView
                wikiPages={wikiPages}
                lintIssues={lintIssues}
                healthScore={healthScore}
                onExecuteAutoHeal={handleExecuteAutoHeal}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {/* IM Bot */}
            {currentTab === 'bot' && <ImBotSimulatorModal />}

            {/* Schema Governance */}
            {currentTab === 'schema' && <SchemaGovernanceView />}

            {/* Page Planning */}
            {currentTab === 'planning' && (
              <PagePlanningView onNavigateTab={setCurrentTab} />
            )}

            {/* Intelligence Explorer */}
            {currentTab === 'intelligence' && <IntelligenceExplorerView />}

            {/* Shared Drive */}
            {currentTab === 'drive' && (
              <SharedDriveSyncView
                onIngestComplete={handleIngestComplete}
                onNavigateToWikiPage={handleNavigateToWikiPage}
                onNavigateToRaw={handleNavigateToRaw}
              />
            )}

            {/* Feishu Clipper */}
            {currentTab === 'clipper' && (
              <WebClipperFeishuIngestView
                onAddRawDoc={handleAddRawDoc}
                onNavigateToRaw={handleNavigateToRaw}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {/* Obsidian */}
            {currentTab === 'obsidian' && (
              <ObsidianAgentEngineView
                wikiPages={wikiPages}
                onNavigateToWikiPage={handleNavigateToWikiPage}
              />
            )}

            {/* Realtime Knowledge */}
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

            {/* LLM Admin */}
            {currentTab === 'admin' && <AdminView />}

            {/* Workbench Integrations */}
            {currentTab === 'integrations' && <WorkbenchIntegrationsView />}

            {/* Agent Auto Tasks */}
            {currentTab === 'agent-tasks' && (
              <AgentAutoTasksView
                wikiPages={wikiPages}
                logs={logs}
                onAddLog={(log) => setLogs(prev => [log, ...prev])}
              />
            )}
          </main>
        </div>
      </div>
    );
  }

  // Craft Doc Layout (Light Theme)
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <CraftDocLayoutView
        wikiPages={wikiPages}
        rawDocs={rawDocs}
        onSwitchLayoutMode={setLayoutMode}
        onAddRawDoc={handleAddRawDoc}
        onNavigateToWikiPage={handleNavigateToWikiPage}
        onNavigateToRaw={handleNavigateToRaw}
      />
    </div>
  );
}
