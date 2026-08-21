import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Search, Star, Layers, Edit3, Palette, Feather, Code2, BookOpen,
  FlaskConical, Lightbulb, Plus, Archive, Trash2, Settings, UserPlus,
  Share2, MoreHorizontal, Menu, ChevronDown, ChevronRight, Sparkles, Lock,
  FileText, Check, Clock, Eye, ExternalLink, Keyboard, Sliders, Table,
  Cpu, GitBranch, Bot, Copy, Globe, Sun, Moon, Users, X, FolderPlus,
  RefreshCw, Folder, ArrowRight, ArrowUp, Mic, CheckCircle2, FileCode,
  Shield, Zap, Building2, Info, Key, Plug, Server, Trash, Download, Upload, Database
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WikiPage, RawDocument, LayoutMode, LogEntry, LintIssue } from '../types';
import { Language, translations } from '../i18n/translations';
import { COLLECTION_DOCS } from '../data/collectionDocs';
import {
  INITIAL_TEMPLATES, INITIAL_DRAFTS, INITIAL_ARCHIVED_DOCS, INITIAL_TRASH_DOCS,
  DocTemplate, DraftDoc, ArchivedDoc, TrashDoc, CustomCollection
} from '../data/sidebarData';
import { INITIAL_LOGS, INITIAL_LINT_ISSUES } from '../data/initialData';
import { INITIAL_INDEX_MD } from '../data/initialData';
import { calculateHealthScore } from '../utils/lintEngine';
import { OverviewDashboard } from './OverviewDashboard';
import { RawRepositoryView } from './RawRepositoryView';
import { WikiNetworkView } from './WikiNetworkView';
import { KnowledgeGraphView } from './KnowledgeGraphView';
import { LintHealthView } from './LintHealthView';
import { QmdSearchAndQueryView } from './QmdSearchAndQueryView';
import { ObsidianAgentEngineView } from './ObsidianAgentEngineView';
import { SharedDriveSyncView } from './SharedDriveSyncView';
import { AutoIngestionTasksView } from './AutoIngestionTasksView';
import { CoreControlMatrixView } from './CoreControlMatrixView';
import { QmdSimpleSearchView } from './QmdSimpleSearchView';

interface CraftDocLayoutViewProps {
  wikiPages: WikiPage[];
  rawDocs: RawDocument[];
  onUpdateWikiPage: (updatedPage: WikiPage) => void;
  onNavigateToRaw: (path: string) => void;
  onSwitchLayoutMode: (mode: LayoutMode) => void;
  onOpenSearch: () => void;
  onOpenIngest: () => void;
  onAddRawDoc?: (doc: RawDocument, wikiPages: WikiPage[]) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

type MainViewMode =
  | 'doc'
  | 'home'
  | 'console'
  | 'starred'
  | 'templates'
  | 'drafts'
  | 'archive'
  | 'trash'
  | 'ai_agent'
  | 'new_knowledge'
  | 'data_acquisition'
  | 'raw'
  | 'wiki_network'
  | 'knowledge_graph'
  | 'lint_health'
  | 'qmd_search'
  | 'obsidian'
  | 'shared_drive'
  | 'search_qmd';

export const CraftDocLayoutView: React.FC<CraftDocLayoutViewProps> = ({
  wikiPages,
  rawDocs,
  onUpdateWikiPage,
  onNavigateToRaw,
  onSwitchLayoutMode,
  onOpenSearch,
  onOpenIngest,
  onAddRawDoc,
  language: propLanguage,
  onLanguageChange
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(propLanguage || 'zh');
  const t = translations[currentLang];
  const setLanguage = (newLang: Language) => {
    setCurrentLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };
  const [mainView, setMainView] = useState<MainViewMode>('home');
  const [viewMode, setViewMode] = useState<'modern' | 'dashboard'>('modern');
  const [selectedPageId, setSelectedPageId] = useState<string>(wikiPages[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>('');
  const [starredDocIds, setStarredDocIds] = useState<Set<string>>(
    new Set([wikiPages[0]?.id, wikiPages[1]?.id].filter(Boolean))
  );
  const [activeTocSection, setActiveTocSection] = useState<string>('sec-0');
  const [isTocVisible, setIsTocVisible] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [showMultiplayerCursors, setShowMultiplayerCursors] = useState<boolean>(true);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<
    'language' | 'appearance' | 'collaboration' | 'obsidian' | 'about' | 'llm'
  >('language');
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const [newCollectionOpen, setNewCollectionOpen] = useState<boolean>(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([
    { id: 'coll-custom-1', name: '战略创新与出海', iconName: 'Zap', colorClass: 'text-amber-500', docIds: [wikiPages[0]?.id].filter(Boolean) }
  ]);
  const [newCollName, setNewCollName] = useState('');
  const [newCollColor, setNewCollColor] = useState('text-indigo-500');
  const [templates] = useState<DocTemplate[]>(INITIAL_TEMPLATES);
  const [drafts, setDrafts] = useState<DraftDoc[]>(INITIAL_DRAFTS);
  const [archivedDocs, setArchivedDocs] = useState<ArchivedDoc[]>(INITIAL_ARCHIVED_DOCS);
  const [trashDocs, setTrashDocs] = useState<TrashDoc[]>(INITIAL_TRASH_DOCS);
  const [collectionDocsState, setCollectionDocsState] = useState(COLLECTION_DOCS);
  const [logs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [lintIssues] = useState<LintIssue[]>(INITIAL_LINT_ISSUES);
  const { score: healthScore } = calculateHealthScore(wikiPages.length, lintIssues);
  const [selectedAgent, setSelectedAgent] = useState('compiler');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; sources?: string[] }>>([
    { role: 'assistant', content: '您好！我是您的企业智能体助手。', sources: [] }
  ]);
  const [isAgentGenerating, setIsAgentGenerating] = useState(false);
  const [attachedContexts, setAttachedContexts] = useState<Array<{ type: 'folder' | 'doc'; id: string; name: string }>>([
    { type: 'doc', id: 'wiki-eng-llm-wiki-case-study', name: '[深度案例] LLM Wiki 架构实战' }
  ]);
  const [isContextPickerOpen, setIsContextPickerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4o']);
  const [isAccessModeOpen, setIsAccessModeOpen] = useState(false);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isAgentModelPickerOpen, setIsAgentModelPickerOpen] = useState(false);
  const [accessMode, setAccessMode] = useState<'full' | 'selected'>('selected');
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({
    companyInfo: true, liveCommerceMarketing: true, shortVideoMarketing: true,
    brandDesign: false, design: false, engineering: true,
    documentation: true, marketing: false, research: false, support: false
  });
  const [llmBaseUrl, setLlmBaseUrl] = useState<string>('https://api.openai.com/v1');
  const [llmApiKey, setLlmApiKey] = useState<string>('');
  const [llmDefaultModel, setLlmDefaultModel] = useState<string>('gpt-4o');
  const [llmSystemPrompt, setLlmSystemPrompt] = useState<string>(
    '你是一位专业的企业知识库智能体助手，擅长检索、编译和分析知识文档。'
  );
  const [llmTemperature, setLlmTemperature] = useState<number>(0.7);
  const [llmMaxTokens, setLlmMaxTokens] = useState<number>(2048);
  const [llmTopP, setLlmTopP] = useState<number>(0.9);
  const [llmStopSequences, setLlmStopSequences] = useState<string>('');
  const [llmEnvVars, setLlmEnvVars] = useState<Array<{ name: string; value: string }>>([]);
  const [llmTestResult, setLlmTestResult] = useState<'ok' | 'err' | null>(null);
  const [llmKeyVisible, setLlmKeyVisible] = useState<boolean>(false);
  const [llmModels, setLlmModels] = useState<Array<{ id: string; name: string; apiUrl: string; apiKey: string; isDefault: boolean }>>([
    { id: '1', name: 'gpt-4o', apiUrl: 'https://api.openai.com/v1', apiKey: '', isDefault: true }
  ]);
  const [showAddModel, setShowAddModel] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelApiUrl, setNewModelApiUrl] = useState('');
  const [newModelApiKey, setNewModelApiKey] = useState('');
  const [dataAcquisitionOpen, setDataAcquisitionOpen] = useState<boolean>(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const [webScrapeUrl, setWebScrapeUrl] = useState<string>('');
  const [dbConnectionString, setDbConnectionString] = useState<string>('');
  const [dbQuery, setDbQuery] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [copiedText, setCopiedText] = useState<string>('');

  useEffect(() => { setSelectedModel(llmDefaultModel); }, [llmDefaultModel]);
  const modelPickerRef = useRef<HTMLDivElement>(null);
  const agentModelPickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelPickerOpenRef.current && !modelPickerRef.current?.contains(e.target as Node)) setIsModelPickerOpen(false);
      if (agentModelPickerOpenRef.current && !agentModelPickerRef.current?.contains(e.target as Node)) setIsAgentModelPickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const modelPickerOpenRef = useRef(isModelPickerOpen);
  modelPickerOpenRef.current = isModelPickerOpen;
  const agentModelPickerOpenRef = useRef(isAgentModelPickerOpen);
  agentModelPickerOpenRef.current = isAgentModelPickerOpen;

  const agentQuickPrompts: Record<string, string[]> = {
    compiler: ['请对当前挂载的知识库目录进行 Markdown AST 编译与双链规范检查', '生成知识图谱摘要并输出核心实体关系与未链接文件清单'],
    compliance: ['2026 最新差旅费用报销标准与补贴申领 SOP 是什么？', '企业出差事前审批、消费合规红线与财务审计注意事项有哪些？'],
    onboarding: ['新员工入职需要配置哪些开发环境、权限与知识库工具？', '请为新入职的研发工程师生成一份 7 天速通指南与导师交办清单'],
    analyst: ['总结当前全自动情报采集与事件抽取的最新行业洞察与竞品动态', '分析 Karpathy LLM Wiki 方法论对企业知识管理的颠覆性演进趋势']
  };

  const handleSendAgentPrompt = (textToSubmit?: string) => {
    const promptText = textToSubmit !== undefined ? textToSubmit : agentPrompt;
    if (!promptText.trim() || isAgentGenerating) return;
    setAgentPrompt('');
    const userSources = attachedContexts.map(c => c.name);
    const newMsgs = [...chatMessages, { role: 'user', content: promptText, sources: userSources }];
    setChatMessages(newMsgs);
    setIsAgentGenerating(true);

    const modelEntry = llmModels.find(m => m.name === selectedModel) || llmModels[0];
    const apiUrl = modelEntry?.apiUrl || llmBaseUrl;
    const apiKey = modelEntry?.apiKey || llmApiKey;

    if (!apiUrl || !apiKey) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ 请先在「大模型配置」中设置 API 地址和 API Key，然后重新发送。',
          sources: userSources
        }]);
        setIsAgentGenerating(false);
      }, 500);
      return;
    }

    const baseUrl = apiUrl.replace(/\/+$/, '');
    const messages = [
      { role: 'system', content: llmSystemPrompt },
      ...chatMessages.slice(-6).map(msg => ({ role: msg.role, content: msg.content }))
    ];

    fetch(baseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        temperature: llmTemperature,
        max_tokens: llmMaxTokens,
        top_p: llmTopP,
        stop: llmStopSequences ? llmStopSequences.split(',').map(s => s.trim()) : undefined
      })
    })
    .then(async res => {
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error('API 错误 (' + res.status + '): ' + errText.slice(0, 200));
      }
      return res.json();
    })
    .then(data => {
      const content = data.choices?.[0]?.message?.content || '（模型未返回有效内容）';
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: content,
        sources: userSources
      }]);
    })
    .catch(err => {
      console.error('[LLM Request Error]', err);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ 请求失败：' + (err.message || String(err)) + '\n\n请检查 Base URL 和 API Key 是否正确，并确保目标服务支持 ' + selectedModel + ' 模型。',
        sources: userSources
      }]);
    })
    .finally(() => {
      setIsAgentGenerating(false);
    });
  };

  const getModelShortName = (model: string) => {
    if (!model) return '模型';
    if (model.includes('gpt-4o')) return 'GPT-4o';
    if (model.includes('gpt-4o-mini')) return 'GPT-4o-mini';
    if (model.includes('claude')) return 'Claude';
    if (model.includes('qwen-max')) return 'Qwen-Max';
    if (model.includes('qwen-plus')) return 'Qwen-Plus';
    return model.split('/').pop()?.slice(0, 12) || model;
  };

  const allCollectionDocs = collectionDocsState.flatMap(col => [col.readmeDoc, ...col.exampleDocs]);
  const activePage = wikiPages.find(p => p.id === selectedPageId) || allCollectionDocs.find(d => d.id === selectedPageId) || drafts.find(d => d.id === selectedPageId) || templates.find(tm => tm.id === selectedPageId) || archivedDocs.find(a => a.id === selectedPageId) || trashDocs.find(tr => tr.id === selectedPageId) || wikiPages[0];
  useEffect(() => {
    if (activePage) setEditContent(activePage.content || activePage.rawMarkdown || '');
  }, [selectedPageId, activePage]);

  const handleOpenDoc = (doc: WikiPage) => {
    const existing = wikiPages.find(p => p.id === doc.id || p.path === doc.path);
    if (existing) setSelectedPageId(existing.id);
    else { onUpdateWikiPage(doc); setSelectedPageId(doc.id); }
    setMainView('doc'); setIsEditing(false); setMobileSidebarOpen(false);
  };
  const toggleCollection = (key: string) => setExpandedCollections(prev => ({ ...prev, [key]: !prev[key] }));

  // Render component
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col transition-transform duration-200`}>
        {/* User Profile */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">A</div>
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center space-x-1">
                <span>Acme, Inc</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[11px] text-slate-500">JENN SMITH</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* 获取数据 - Expandable Section */}
          <div className="mb-1">
            <button onClick={() => setDataAcquisitionOpen(v => !v)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'data_acquisition' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-500'}`}>
              <div className="flex items-center space-x-2.5"><Download className="w-4 h-4" /><span className="text-xs font-semibold">{t.dataAcquisition}</span></div>
              {dataAcquisitionOpen ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
            </button>
            {dataAcquisitionOpen && (
              <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-2">
                {[
                  { id: 'local_file', icon: Upload, label: t.dataLocalFile, desc: t.dataLocalFileDesc },
                  { id: 'web_scrape', icon: Globe, label: t.dataWebScrape, desc: t.dataWebScrapeDesc },
                  { id: 'database', icon: Database, label: t.dataDatabase, desc: t.dataDatabaseDesc },
                  { id: 'media_transcribe', icon: Mic, label: t.dataMediaTranscribe, desc: t.dataMediaTranscribeDesc },
                  { id: 'copy_text', icon: Copy, label: t.dataCopyText, desc: t.dataCopyTextDesc },
                  { id: 'auto_tasks', icon: Bot, label: t.dataAutoTasks, desc: t.dataAutoTasksDesc, badge: '开源自动化' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { setSelectedDataSource(opt.id); setMainView('data_acquisition'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition flex items-center justify-between ${selectedDataSource === opt.id && mainView === 'data_acquisition' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                    <div className="flex items-center space-x-2 truncate">
                      <opt.icon className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {opt.badge && (
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">
                        {opt.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 新知识 Button */}
          <button onClick={() => { setMainView('new_knowledge'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${mainView === 'new_knowledge' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
            <div className="flex items-center space-x-2.5"><Sparkles className="w-4 h-4 text-amber-500" /><span className="font-semibold text-sm">新知识</span></div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">+ New</span>
          </button>

          {/* Main Navigation Items */}
          <button onClick={() => { setMainView('home'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'home' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-3"><Home className="w-4 h-4" /><span className="text-sm">总览</span></div>
          </button>

          <button onClick={() => { setMainView('search_qmd'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'search_qmd' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-3"><Search className="w-4 h-4 text-indigo-600" /><span className="text-sm">搜索</span></div>
            <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">qmd</span>
          </button>

          <button onClick={() => { setMainView('starred'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'starred' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-3"><Star className="w-4 h-4 text-amber-500" /><span className="text-sm">已收藏</span></div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">2</span>
          </button>

          <button onClick={() => { setMainView('ai_agent'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'ai_agent' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-3"><Bot className="w-4 h-4 text-indigo-500" /><span className="text-sm">AI 智能体工坊</span></div>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Agent</span>
          </button>

          <button onClick={() => { setMainView('templates'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'templates' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-3"><Layers className="w-4 h-4 text-emerald-500" /><span className="text-sm">模板库</span></div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">5</span>
          </button>

          <button onClick={() => { setMainView('drafts'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'drafts' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-3"><Edit3 className="w-4 h-4 text-slate-500" /><span className="text-sm">草稿箱</span></div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">3</span>
          </button>

          {/* Divider */}
          <div className="pt-3 pb-2 px-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>分类集合</span>
              <button className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Collection Items */}
          {collectionDocsState.map(col => (
            <div key={col.id} className="mb-1">
              <button onClick={() => toggleCollection(col.id)} className="w-full flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-slate-50 text-slate-600 text-xs">
                <div className="flex items-center space-x-2">
                  <Folder className={`w-3.5 h-3.5 ${col.colorClass || 'text-blue-500'}`} />
                  <span className="font-medium">{col.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.2 rounded-full">{col.exampleDocs.length}</span>
                  {expandedCollections[col.id] ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                </div>
              </button>
              {expandedCollections[col.id] && (
                <div className="ml-4 space-y-0.5 border-l border-slate-100 pl-1.5">
                  {col.readmeDoc && (
                    <button key={col.readmeDoc.id} onClick={() => handleOpenDoc(col.readmeDoc as WikiPage)} className="w-full text-left px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50/50 rounded-md transition flex items-center space-x-2 font-medium">
                      <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{col.readmeDoc.frontmatter?.title || col.readmeDoc.fileName}</span>
                    </button>
                  )}
                  {col.exampleDocs.map(doc => (
                    <button key={doc.id} onClick={() => handleOpenDoc(doc as WikiPage)} className="w-full text-left px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md transition flex items-center space-x-2">
                      <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.frontmatter?.title || doc.fileName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Settings Footer */}
        <div className="p-3 border-t border-slate-100 space-y-0.5">
          <button onClick={() => { setMainView('console'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'console' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-2.5"><Sliders className="w-4 h-4 text-indigo-500" /><span className="text-xs">控制中枢 (Matrix)</span></div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">开关</span>
          </button>
          <button onClick={() => { setMainView('archive'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'archive' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-2.5"><Archive className="w-4 h-4" /><span className="text-xs">归档库</span></div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">2</span>
          </button>
          <button onClick={() => { setMainView('trash'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${mainView === 'trash' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center space-x-2.5"><Trash2 className="w-4 h-4" /><span className="text-xs">回收站</span></div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">1</span>
          </button>
          <button onClick={() => { setSettingsOpen(true); setMobileSidebarOpen(false); }} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-xs transition">
            <Settings className="w-4 h-4" /><span>系统设置</span>
          </button>
          <button onClick={() => { setInviteOpen(true); setMobileSidebarOpen(false); }} className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-xs transition">
            <UserPlus className="w-4 h-4" /><span>邀请成员...</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* VIEW: HOME */}
        {mainView === 'home' && (
          <OverviewDashboard
            rawDocs={rawDocs}
            wikiPages={wikiPages}
            logs={logs}
            lintIssues={lintIssues}
            healthScore={healthScore}
            onNavigateTab={(tab) => {
              if (tab === 'raw') { setMainView('raw'); }
              else if (tab === 'wiki') { setMainView('wiki_network'); }
              else if (tab === 'graph') { setMainView('knowledge_graph'); }
              else if (tab === 'lint') { setMainView('lint_health'); }
              else if (tab === 'search') { setMainView('qmd_search'); }
              else if (tab === 'planning') { setMainView('home'); }
              else if (tab === 'obsidian') { setMainView('obsidian'); }
              else if (tab === 'drive') { setMainView('shared_drive'); }
              else if (tab === 'console') { setMainView('console'); }
            }}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) {
                setSelectedPageId(page.id);
                setMainView('doc');
              }
            }}
          />
        )}

        {/* VIEW: CORE CONTROL MATRIX */}
        {mainView === 'console' && (
          <CoreControlMatrixView
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) {
                setSelectedPageId(page.id);
                setMainView('doc');
              }
            }}
            onNavigateToRaw={onNavigateToRaw}
          />
        )}

        {/* VIEW: NEW KNOWLEDGE */}
        {mainView === 'new_knowledge' && (
          <div className="flex flex-col h-full">
            {/* Top Header Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Code2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">研发工程</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-medium text-slate-700">文档规范</span>
              </div>
              <div className="flex items-center space-x-3">
                {/* User Avatars */}
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">A</div>
                  <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">P</div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">J</div>
                </div>
                <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享</span>
                </button>
                <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-sm">
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建文档</span>
                </button>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('modern')} className={`px-3 py-1.5 text-xs font-medium transition ${viewMode === 'modern' ? 'text-slate-700 bg-white' : 'text-slate-500 bg-slate-50 hover:bg-slate-100'}`}>现代文档风格</button>
                  <button onClick={() => setViewMode('dashboard')} className={`px-3 py-1.5 text-xs font-medium transition ${viewMode === 'dashboard' ? 'text-slate-700 bg-white' : 'text-slate-500 bg-slate-50 hover:bg-slate-100'}`}>工程大盘风格</button>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {viewMode === 'modern' ? (
              <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center py-12 px-6">
                <div className="max-w-3xl w-full space-y-8 text-center animate-fadeIn">
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>agent alien 第二大脑与情报探索中心</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">有什么可以帮您的？</h1>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto">随心输入问题或 Prompt，即时挂载知识库目录、单个或多个文档，驱动企业智能体为您实时洞察。</p>
                  </div>
                  <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-xl rounded-3xl p-3 sm:p-4 space-y-3 relative text-left mx-auto">
                    {attachedContexts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                        {attachedContexts.map((ctx, ci) => (
                          <span key={ci} className="inline-flex items-center space-x-1.5 text-xs font-medium bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                            {ctx.type === 'folder' ? <Folder className="w-3.5 h-3.5 text-blue-500" /> : <FileText className="w-3.5 h-3.5 text-emerald-500" />}
                            <span>{ctx.name}</span>
                            <button onClick={() => setAttachedContexts(prev => prev.filter((_, i) => i !== ci))} className="text-slate-400 hover:text-slate-700 ml-1"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                        <button onClick={() => setAttachedContexts([])} className="text-[11px] text-slate-400 hover:text-red-600 px-1.5 py-0.5">清空全部</button>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 px-2">
                      <button onClick={() => setIsContextPickerOpen(true)} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shadow-xs shrink-0" title="挂载知识库目录或文档"><Plus className="w-5 h-5" /></button>
                      <textarea rows={2} value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { handleSendAgentPrompt(); setMainView('ai_agent'); } }} placeholder="有问题，随便问..." className="w-full text-sm text-slate-800 focus:outline-none resize-none leading-relaxed placeholder:text-slate-400 bg-transparent pt-1" />
                      <div className="flex items-center space-x-2 shrink-0">
                        <button onClick={() => {}} className="hidden sm:flex items-center space-x-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition font-medium" title="深度思考推理模式"><Cpu className="w-3.5 h-3.5 text-indigo-600" /><span>思考</span></button>
                        <button onClick={() => {}} className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition" title="语音输入"><Mic className="w-4 h-4" /></button>
                        <button onClick={() => { if (agentPrompt.trim()) { handleSendAgentPrompt(); setMainView('ai_agent'); } }} className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${agentPrompt.trim() ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-400 text-white opacity-80'}`} title="发送问题"><ArrowUp className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl text-left mx-auto">
                    {[
                      { title: '行业情报摘要', desc: '总结当前全自动情报采集与...', prompt: '总结当前全自动情报采集与事件抽取的最新行业洞察', icon: Zap, agent: 'analyst', iconColor: 'text-amber-500 bg-amber-50' },
                      { title: '编纂企业 SOP', desc: '请对当前挂载的知识库目录...', prompt: '请对当前挂载的知识库目录进行 Markdown AST 编译与双链规范检查', icon: Sparkles, agent: 'compiler', iconColor: 'text-indigo-500 bg-indigo-50' },
                      { title: '查询差旅标准', desc: '2026 最新差旅费用报销标...', prompt: '2026 最新差旅费用报销标准与补贴申领 SOP 是什么？', icon: Shield, agent: 'compliance', iconColor: 'text-blue-500 bg-blue-50' },
                      { title: '新员工入职导师', desc: '请为新入职的研发工程师生...', prompt: '请为新入职的研发工程师生成一份 7 天速通指南', icon: Users, agent: 'onboarding', iconColor: 'text-emerald-500 bg-emerald-50' }
                    ].map((card, ci) => {
                      const IconComponent = card.icon;
                      return (
                        <div key={ci} onClick={() => { setSelectedAgent(card.agent); handleSendAgentPrompt(card.prompt); setMainView('ai_agent'); }}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md cursor-pointer transition space-y-3 group">
                          <div className={`p-2 rounded-xl w-fit ${card.iconColor} group-hover:scale-110 transition`}><IconComponent className="w-4 h-4" /></div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{card.title}</div>
                            <div className="text-xs text-slate-500 mt-1 line-clamp-1">{card.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <OverviewDashboard
                  rawDocs={rawDocs}
                  wikiPages={wikiPages}
                  logs={logs}
                  lintIssues={lintIssues}
                  healthScore={healthScore}
                  onNavigateTab={(tab) => {
                    if (tab === 'raw') { setMainView('raw'); }
                    else if (tab === 'wiki') { setMainView('wiki_network'); }
                    else if (tab === 'graph') { setMainView('knowledge_graph'); }
                    else if (tab === 'lint') { setMainView('lint_health'); }
                    else if (tab === 'search') { setMainView('qmd_search'); }
                    else if (tab === 'planning') { setViewMode('dashboard'); }
                    else if (tab === 'obsidian') { setMainView('obsidian'); }
                    else if (tab === 'drive') { setMainView('shared_drive'); }
                  }}
                  onNavigateToWikiPage={(path) => {
                    const page = wikiPages.find(p => p.path === path);
                    if (page) {
                      setSelectedPageId(page.id);
                      setMainView('doc');
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW: STARRED */}
        {mainView === 'starred' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-100"><Star className="w-4 h-4" /><span>starred documents</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">已收藏</h1>
              <p className="text-amber-100 text-xs sm:text-sm">快速访问您收藏的重点文档。</p>
            </div>
            <div className="space-y-3">
              {wikiPages.filter(p => starredDocIds.has(p.id)).map(page => (
                <div key={page.id} onClick={() => { setSelectedPageId(page.id); setMainView('doc'); }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md cursor-pointer transition flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0"><Star className="w-5 h-5 text-amber-500" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{page.frontmatter?.title || page.fileName}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{page.path}</div>
                    {page.frontmatter?.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {page.frontmatter.tags.map((tag, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setStarredDocIds(prev => { const next = new Set(prev); next.delete(page.id); return next; }); }}
                    className="text-amber-400 hover:text-amber-600 transition shrink-0"><Star className="w-4 h-4 fill-amber-400" /></button>
                </div>
              ))}
              {wikiPages.filter(p => starredDocIds.has(p.id)).length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">暂无收藏文档</div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: TEMPLATES */}
        {mainView === 'templates' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-100"><Layers className="w-4 h-4" /><span>template library</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">模板库</h1>
              <p className="text-emerald-100 text-xs sm:text-sm">基于标准 SOP 规范，一键初始化高质量知识页面。</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map(tpl => (
                <div key={tpl.id} onClick={() => { setSelectedPageId(tpl.id); setMainView('doc'); }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md cursor-pointer transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center"><Layers className="w-5 h-5 text-emerald-600" /></div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold">{tpl.category}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{tpl.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{tpl.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DRAFTS */}
        {mainView === 'drafts' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300"><Edit3 className="w-4 h-4" /><span>drafts</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">草稿箱</h1>
              <p className="text-slate-300 text-xs sm:text-sm">正在撰写或等待协同编辑的多源内容草稿。</p>
            </div>
            <div className="space-y-3">
              {drafts.map(draft => (
                <div key={draft.id} onClick={() => { setSelectedPageId(draft.id); setMainView('doc'); }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md cursor-pointer transition flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0"><Edit3 className="w-5 h-5 text-slate-500" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{draft.title}</div>
                    <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-400">
                      <span>{draft.category}</span>
                      <span>·</span>
                      <span>{draft.author}</span>
                      <span>·</span>
                      <span>{draft.updatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: SEARCH */}
        {mainView === 'new_knowledge' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-indigo-100"><Search className="w-4 h-4" /><span>global search</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">搜索</h1>
              <p className="text-indigo-100 text-xs sm:text-sm">在所有文档、Wiki 页面与原始资料中全文检索。</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={currentLang === 'en' ? 'Search documents, wiki pages, raw files...' : '搜索文档、Wiki 页面、原始资料...'}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
              </div>
              {searchQuery.trim() && (
                <div className="space-y-2">
                  {wikiPages.filter(p =>
                    p.frontmatter?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.frontmatter?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).map(page => (
                    <div key={page.id} onClick={() => { setSelectedPageId(page.id); setMainView('doc'); }}
                      className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200">
                      <div className="text-sm font-bold text-slate-900">{page.frontmatter?.title || page.fileName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{page.path}</div>
                    </div>
                  ))}
                  {wikiPages.filter(p =>
                    p.frontmatter?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.frontmatter?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">未找到匹配结果</div>
                  )}
                </div>
              )}
              {!searchQuery.trim() && (
                <div className="text-center py-8 text-slate-400 text-sm">输入关键词开始搜索</div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: ARCHIVE */}
        {mainView === 'archive' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-slate-600 to-slate-800 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300"><Archive className="w-4 h-4" /><span>archive</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">归档库</h1>
              <p className="text-slate-300 text-xs sm:text-sm">已封存的往期版本、已结项项目文档与已废止流程规范。</p>
            </div>
            <div className="space-y-3">
              {archivedDocs.map(doc => (
                <div key={doc.id} onClick={() => { setSelectedPageId(doc.id); setMainView('doc'); }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md cursor-pointer transition flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0"><Archive className="w-5 h-5 text-slate-500" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{doc.title}</div>
                    <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-400">
                      <span>{doc.category}</span>
                      <span>·</span>
                      <span>归档于 {doc.archivedAt}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{doc.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: TRASH */}
        {mainView === 'trash' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-red-100"><Trash2 className="w-4 h-4" /><span>trash</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">回收站</h1>
              <p className="text-red-100 text-xs sm:text-sm">30 天内删除的文档保留于此，支持一键恢复或永久清除。</p>
            </div>
            <div className="space-y-3">
              {trashDocs.map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0"><Trash2 className="w-5 h-5 text-red-500" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{doc.title}</div>
                    <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-400">
                      <span>删除于 {doc.deletedAt}</span>
                      <span>·</span>
                      <span className="font-mono">{doc.originalPath}</span>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition shrink-0">还原</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: DOCUMENT */}
        {mainView === 'doc' && activePage && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <button onClick={() => setMainView('home')} className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition">
              <ArrowRight className="w-3 h-3 rotate-180" /><span>{currentLang === 'en' ? 'Back to overview' : '返回概览'}</span>
            </button>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 space-y-2">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{(activePage as any).path || (activePage as any).category || 'document'}</span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {(activePage as any).frontmatter?.title || (activePage as any).title || (activePage as any).fileName || 'Untitled'}
                </h1>
                <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-400">
                  {(activePage as any).frontmatter?.author && <span>By {(activePage as any).frontmatter.author}</span>}
                  {(activePage as any).wordCount && <span>{(activePage as any).wordCount} words</span>}
                  {(activePage as any).frontmatter?.tags && (
                    <div className="flex items-center space-x-1">
                      <span>Tags:</span>
                      {(activePage as any).frontmatter.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                  {activePage.content || (activePage as any).rawMarkdown || (activePage as any).description || 'No content available.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: AI AGENT STUDIO */}
        {mainView === 'ai_agent' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-indigo-300"><Bot className="w-4 h-4 text-indigo-400" /><span>agent alien Enterprise AI Agent Studio</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">{currentLang === 'en' ? 'AI Agent & Prompt Engine' : 'AI 智能体工坊与提示词引擎'}</h1>
              <p className="text-slate-300 text-xs sm:text-sm">{currentLang === 'en' ? 'Prompt input with instant knowledge base folder/document context attachment.' : '支持在提示词输入框中即时调用与挂载知识库中的任意目录、单个或多个文档。'}</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{currentLang === 'en' ? 'Select AI Agent Application' : '选择企业智能体应用'}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'compiler', name: '知识库编纂助手', desc: '自动整理、编译与结构化文档', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                  { id: 'compliance', name: '合规与政策专员', desc: '精准回答差旅、HR与制度规范', icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  { id: 'onboarding', name: '新员工入职导师', desc: '协助新人快速通晓业务与SOP', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { id: 'analyst', name: '行业情报分析师', desc: '事件抽取、竞品与趋势洞察', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' }
                ].map(app => {
                  const isSelected = selectedAgent === app.id;
                  const IconComponent = app.icon;
                  return (
                    <div key={app.id} onClick={() => setSelectedAgent(app.id)} className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${isSelected ? 'ring-2 ring-indigo-600 bg-white shadow-sm border-indigo-300' : 'bg-white/80 border-slate-200 hover:bg-white'}`}>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between"><span className={`p-1.5 rounded-lg ${app.color}`}><IconComponent className="w-4 h-4" /></span>{isSelected && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Active</span>}</div>
                        <div className="text-xs font-bold text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-2">{app.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-semibold text-slate-400">快捷引导 Prompt:</span>
                {(agentQuickPrompts[selectedAgent] || []).map((promptText, pi) => (
                  <button key={pi} onClick={() => handleSendAgentPrompt(promptText)} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200/80 transition flex items-center space-x-1 font-medium shadow-2xs"><span>⚡ {promptText}</span></button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 min-h-[320px] max-h-[500px] overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">AI</div>}
                  <div className={`space-y-2 max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {msg.sources.map((s, si) => <span key={si} className="inline-flex items-center space-x-1 text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100"><Folder className="w-3 h-3" /><span>{s}</span></span>)}
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-wrap'}`}>
                      {msg.content}
                    </div>
                  </div>
                  {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">我</div>}
                </div>
              ))}
              {isAgentGenerating && (
                <div className="flex items-center space-x-3 text-slate-400 text-xs italic"><div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse">AI</div><span>智能体正在联网检索知识库并深度推理中...</span></div>
              )}
            </div>
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 space-y-3 relative">
              {attachedContexts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                  {attachedContexts.map((ctx, ci) => (
                    <span key={ci} className="inline-flex items-center space-x-1.5 text-xs font-medium bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 group">
                      {ctx.type === 'folder' ? <Folder className="w-3.5 h-3.5 text-blue-500" /> : <FileText className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{ctx.name}</span>
                      <button onClick={() => setAttachedContexts(prev => prev.filter((_, i) => i !== ci))} className="text-slate-400 hover:text-slate-700 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <button onClick={() => setAttachedContexts([])} className="text-[11px] text-slate-400 hover:text-red-600 px-1.5 py-0.5">清空全部</button>
                </div>
              )}
              <textarea rows={3} value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendAgentPrompt(); }} placeholder={currentLang === 'en' ? 'Ask anything or prompt your agent... (Ctrl+Enter to send)' : '随心输入 Prompt 或提问，可即时调用知识库目录与文档... (Ctrl + Enter 发送)'} className="w-full text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed placeholder:text-slate-400" />
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <button onClick={() => setIsContextPickerOpen(true)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shadow-xs" title="挂载知识库目录或文档"><Plus className="w-4 h-4" /></button>
                  <div className="relative">
                    <button onClick={() => setIsAgentModelPickerOpen(v => !v)} className="hidden sm:flex items-center space-x-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition font-medium" title="切换大模型"><Bot className="w-3.5 h-3.5 text-indigo-600" /><span>{selectedModels.length > 0 ? getModelShortName(selectedModel) + ' × ' + selectedModels.length : getModelShortName(selectedModel)}</span><ChevronDown className="w-3 h-3 text-slate-400" /></button>
                    {isAgentModelPickerOpen && (
                      <div ref={agentModelPickerRef} className="absolute bottom-10 left-0 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50 w-52 space-y-0.5 animate-fadeIn">
                        {llmModels.length > 0 ? llmModels.map(m => (
                          <div key={m.id} onClick={() => { setSelectedModel(m.name); setSelectedModels(prev => prev.includes(m.name) ? prev.filter(n => n !== m.name) : [...prev, m.name]); setIsAgentModelPickerOpen(false); }} className={`px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-semibold transition flex items-center space-x-2 ${selectedModels.includes(m.name) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                            <span>{getModelShortName(m.name)}</span>
                            {m.isDefault && <span className="text-[10px] px-1 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">默认</span>}
                            {selectedModels.includes(m.name) && <span className="text-[10px] text-emerald-600 ml-auto">✓</span>}
                          </div>
                        )) : <div className="px-2.5 py-1.5 text-[11px] text-slate-400 italic">请在「大模型配置」中添加模型</div>}
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button onClick={() => { setIsAgentModelPickerOpen(false); setSettingsTab('llm'); }} className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-indigo-600 hover:bg-indigo-50 font-semibold">⚙️ 去配置页管理模型...</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={handleSendAgentPrompt} disabled={!agentPrompt.trim() || isAgentGenerating} className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${agentPrompt.trim() && !isAgentGenerating ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`} title="发送 Prompt"><ArrowUp className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DATA ACQUISITION */}
        {mainView === 'data_acquisition' && (
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-6 animate-fadeIn pb-32">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-300"><Download className="w-4 h-4 text-emerald-400" /><span>data acquisition module</span></div>
              <h1 className="text-2xl font-extrabold tracking-tight">{t.dataAcquisition}</h1>
              <p className="text-slate-300 text-xs sm:text-sm">{t.dataAcquisitionDesc}</p>
            </div>

            {/* 6 Data Source Cards */}
            {!selectedDataSource && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'local_file', icon: Upload, label: t.dataLocalFile, desc: t.dataLocalFileDesc, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  { id: 'web_scrape', icon: Globe, label: t.dataWebScrape, desc: t.dataWebScrapeDesc, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { id: 'database', icon: Database, label: t.dataDatabase, desc: t.dataDatabaseDesc, color: 'text-violet-600 bg-violet-50 border-violet-200' },
                  { id: 'media_transcribe', icon: Mic, label: t.dataMediaTranscribe, desc: t.dataMediaTranscribeDesc, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                  { id: 'copy_text', icon: Copy, label: t.dataCopyText, desc: t.dataCopyTextDesc, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                  { id: 'auto_tasks', icon: Bot, label: t.dataAutoTasks, desc: t.dataAutoTasksDesc, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', highlight: 'GitHub 中文开源生态' },
                ].map(src => (
                  <div key={src.id} onClick={() => setSelectedDataSource(src.id)}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition shadow-sm hover:shadow-md flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
                    {src.highlight && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        {src.highlight}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${src.color}`}><src.icon className="w-6 h-6" /></div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">{src.label}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{src.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-panels */}
            {selectedDataSource && (
              <div className="space-y-4">
                <button onClick={() => setSelectedDataSource(null)} className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition">
                  <ArrowRight className="w-3 h-3 rotate-180" /><span>{currentLang === 'en' ? 'Back to all sources' : '返回所有来源'}</span>
                </button>

                {/* Auto Tasks */}
                {selectedDataSource === 'auto_tasks' && (
                  <AutoIngestionTasksView
                    onAddRawDoc={(doc, pages) => {
                      if (onAddRawDoc) onAddRawDoc(doc, pages);
                      if (pages.length > 0) {
                        setCollectionDocsState(prev => {
                          const targetIdx = prev.findIndex(c => c.name.includes('情报') || c.name.includes('开源') || c.name.includes('热搜') || c.name.includes('营销'));
                          const idx = targetIdx >= 0 ? targetIdx : 0;
                          const updated = [...prev];
                          updated[idx] = {
                            ...updated[idx],
                            exampleDocs: [...pages, ...updated[idx].exampleDocs]
                          };
                          return updated;
                        });
                      }
                    }}
                    onNavigateToWikiPage={(path) => {
                      const page = wikiPages.find(p => p.path === path);
                      if (page) {
                        setSelectedPageId(page.id);
                        setMainView('doc');
                      }
                    }}
                    onNavigateToRaw={(path) => {
                      onNavigateToRaw(path);
                    }}
                  />
                )}

                {/* Local File */}
                {selectedDataSource === 'local_file' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2"><Upload className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-slate-900">{t.dataLocalFile}</h3></div>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3 hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer">
                      <Upload className="w-10 h-10 text-slate-300 mx-auto" />
                      <div className="text-sm font-medium text-slate-600">{t.dataDragOrClick}</div>
                      <div className="text-[11px] text-slate-400">{t.dataSupportedFormats}</div>
                      <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">{t.dataUploadFile}</button>
                    </div>
                  </div>
                )}

                {/* Web Scrape */}
                {selectedDataSource === 'web_scrape' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2"><Globe className="w-5 h-5 text-emerald-600" /><h3 className="font-bold text-slate-900">{t.dataWebScrape}</h3></div>
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-600">{t.dataEnterUrl}</label>
                      <input type="url" value={webScrapeUrl} onChange={e => setWebScrapeUrl(e.target.value)} placeholder={t.dataUrlPlaceholder} className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white" />
                      <button disabled={!webScrapeUrl.trim()} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition ${webScrapeUrl.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{t.dataStartScrape}</button>
                    </div>
                  </div>
                )}

                {/* Database */}
                {selectedDataSource === 'database' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2"><Database className="w-5 h-5 text-violet-600" /><h3 className="font-bold text-slate-900">{t.dataDatabase}</h3></div>
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-600">{t.dataConnectionString}</label>
                      <input type="text" value={dbConnectionString} onChange={e => setDbConnectionString(e.target.value)} placeholder={t.dataConnectionStringPlaceholder} className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white font-mono text-xs" />
                      <label className="text-xs font-semibold text-slate-600">{t.dataQuery}</label>
                      <textarea rows={3} value={dbQuery} onChange={e => setDbQuery(e.target.value)} placeholder={t.dataQueryPlaceholder} className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white font-mono text-xs resize-none" />
                      <button disabled={!dbConnectionString.trim() || !dbQuery.trim()} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition ${dbConnectionString.trim() && dbQuery.trim() ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>{t.dataStartQuery}</button>
                    </div>
                  </div>
                )}

                {/* Media Transcribe */}
                {selectedDataSource === 'media_transcribe' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2"><Mic className="w-5 h-5 text-amber-600" /><h3 className="font-bold text-slate-900">{t.dataMediaTranscribe}</h3></div>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3 hover:border-amber-400 hover:bg-amber-50/30 transition cursor-pointer">
                      <Mic className="w-10 h-10 text-slate-300 mx-auto" />
                      <div className="text-sm font-medium text-slate-600">{t.dataSelectMedia}</div>
                      <div className="text-[11px] text-slate-400">{t.dataSupportedMedia}</div>
                      <button className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition">{t.dataStartTranscribe}</button>
                    </div>
                  </div>
                )}

                {/* Copied Text */}
                {selectedDataSource === 'copy_text' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2"><Copy className="w-5 h-5 text-rose-600" /><h3 className="font-bold text-slate-900">{t.dataCopyText}</h3></div>
                    <p className="text-xs text-slate-500">{t.dataCopyTextDesc}</p>
                    <textarea rows={10} value={copiedText} onChange={e => setCopiedText(e.target.value)} placeholder={t.dataCopyTextPlaceholder} className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white resize-none leading-relaxed placeholder:text-slate-400" />
                    <div className="flex justify-end space-x-2">
                      <button
                        disabled={!copiedText.trim()}
                        onClick={() => {
                          if (!copiedText.trim()) return;
                          const title = copiedText.trim().split('\n')[0].slice(0, 30) || '粘贴文本采集';
                          const docId = `raw-copied-${Date.now()}`;
                          const wikiId = `wiki-copied-${Date.now()}`;
                          const rawDoc: RawDocument = {
                            id: docId,
                            title: title,
                            fileName: `${title}.md`,
                            path: `raw/clipboard/${title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')}.md`,
                            sourceType: 'manual',
                            uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
                            size: `${(copiedText.length / 1024).toFixed(1)} KB`,
                            content: copiedText,
                            compiledPagesCount: 1,
                            compiledPagePaths: [`wiki/clipboard/${title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')}.md`],
                            sourceCategory: '剪贴板'
                          };
                          const wikiContent = `# ${title}\n\n> 来源：剪贴板快速录入 | 归档路径：\`${rawDoc.path}\`\n\n## 📝 正文提取\n\n${copiedText}\n\n---\n*自动生成并编织入 Obsidian 知识库*`;
                          const wikiPage: WikiPage = {
                            id: wikiId,
                            fileName: `${title}.md`,
                            path: `wiki/clipboard/${title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')}.md`,
                            frontmatter: {
                              title: title,
                              type: 'guide',
                              created_at: new Date().toISOString().slice(0, 10),
                              updated_at: new Date().toISOString().slice(0, 10),
                              sources: [rawDoc.path],
                              tags: ['剪贴板', '快速收集', '知识提取'],
                              status: 'active'
                            },
                            content: wikiContent,
                            rawMarkdown: wikiContent,
                            outgoingLinks: [],
                            wordCount: copiedText.length
                          };
                          if (onAddRawDoc) {
                            onAddRawDoc(rawDoc, [wikiPage]);
                          }
                          setCopiedText('');
                          setSelectedPageId(wikiPage.id);
                          setMainView('doc');
                          confetti({ particleCount: 30, spread: 50 });
                        }}
                        className={`px-6 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${copiedText.trim() ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        {t.dataCopyTextInsert}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW: RAW REPOSITORY */}
        {mainView === 'raw' && (
          <RawRepositoryView
            rawDocs={rawDocs}
            onAddRawDoc={(newDoc, newPages) => { /* handled internally */ }}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
          />
        )}

        {/* VIEW: WIKI NETWORK */}
        {mainView === 'wiki_network' && (
          <WikiNetworkView
            wikiPages={wikiPages}
            logs={logs}
            indexMdContent={INITIAL_INDEX_MD}
            onUpdateWikiPage={onUpdateWikiPage}
            onNavigateToRaw={onNavigateToRaw}
          />
        )}

        {/* VIEW: KNOWLEDGE GRAPH */}
        {mainView === 'knowledge_graph' && (
          <KnowledgeGraphView
            wikiPages={wikiPages}
            rawDocs={rawDocs}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
          />
        )}

        {/* VIEW: LINT HEALTH */}
        {mainView === 'lint_health' && (
          <LintHealthView
            wikiPages={wikiPages}
            lintIssues={lintIssues}
            healthScore={healthScore}
            onExecuteAutoHeal={(fixedIssues, newPages) => { /* handled internally */ }}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
          />
        )}

        {/* VIEW: QMD SEARCH */}
        {mainView === 'qmd_search' && (
          <QmdSearchAndQueryView
            wikiPages={wikiPages}
            onAddSynthesisPage={(page, log) => { /* handled internally */ }}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
          />
        )}

        {/* VIEW: SEARCH QMD (Sidebar Search) */}
        {mainView === 'search_qmd' && (
          <QmdSimpleSearchView
            wikiPages={wikiPages}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
          />
        )}

        {/* VIEW: OBSIDIAN */}
        {mainView === 'obsidian' && (
          <ObsidianAgentEngineView
            wikiPages={wikiPages}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
          />
        )}

        {/* VIEW: SHARED DRIVE */}
        {mainView === 'shared_drive' && (
          <SharedDriveSyncView
            onIngestComplete={(updatedRaw, newPages, newLog) => { /* handled internally */ }}
            onNavigateToWikiPage={(path) => {
              const page = wikiPages.find(p => p.path === path);
              if (page) { setSelectedPageId(page.id); setMainView('doc'); }
            }}
            onNavigateToRaw={onNavigateToRaw}
          />
        )}

        {/* SETTINGS MODAL */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2.5"><div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center"><Settings className="w-4 h-4" /></div><div><h3 className="font-bold text-slate-900 text-base">{t.settingsTitle}</h3><p className="text-xs text-slate-500">{t.settingsSubtitle}</p></div></div>
                <button onClick={() => setSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex border-b border-slate-200 px-5 text-xs font-semibold text-slate-600 gap-4 bg-slate-50/30">
                {[
                  { id: 'language' as const, label: t.tabLanguage, icon: Globe },
                  { id: 'appearance' as const, label: t.tabAppearance, icon: Palette },
                  { id: 'collaboration' as const, label: t.tabCollaboration, icon: Users },
                  { id: 'obsidian' as const, label: t.tabObsidian, icon: GitBranch },
                  { id: 'llm' as const, label: t.tabLlm, icon: Server }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setSettingsTab(tab.id)} className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${settingsTab === tab.id ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-900'}`}>
                    <tab.icon className="w-3.5 h-3.5" /><span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
                {settingsTab === 'language' && (
                  <div className="space-y-4">
                    <div><h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2"><Globe className="w-4 h-4 text-blue-600" /><span>{t.langSelectTitle}</span></h4><p className="text-xs text-slate-500 mt-0.5">{t.langSelectDesc}</p></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div onClick={() => setLanguage('zh')} className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${currentLang === 'zh' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="space-y-1"><div className="font-bold text-slate-900 flex items-center space-x-1.5"><span>🇨🇳</span><span>{t.chineseName}</span></div><div className="text-xs text-slate-500">所有侧边栏、目录、设置与按钮默认以中文呈现。</div></div>
                        {currentLang === 'zh' && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                      </div>
                      <div onClick={() => setLanguage('en')} className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${currentLang === 'en' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="space-y-1"><div className="font-bold text-slate-900 flex items-center space-x-1.5"><span>🇺🇸</span><span>{t.englishName}</span></div><div className="text-xs text-slate-500">English interface labels for international teams.</div></div>
                        {currentLang === 'en' && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                      </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'appearance' && (
                  <div className="space-y-4">
                    <div><h4 className="font-bold text-slate-900 text-sm">{t.themeTitle}</h4><p className="text-xs text-slate-500 mt-0.5">{t.themeDesc}</p></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl border-2 border-blue-600 bg-blue-50/40 text-center space-y-1.5 cursor-pointer"><Sun className="w-5 h-5 text-amber-500 mx-auto" /><div className="text-xs font-bold text-slate-900">{t.themeLight}</div></div>
                      <div className="p-3 rounded-xl border border-slate-200 text-center space-y-1.5 cursor-pointer hover:bg-slate-50"><Moon className="w-5 h-5 text-slate-600 mx-auto" /><div className="text-xs font-medium text-slate-700">{t.themeDark}</div></div>
                      <div className="p-3 rounded-xl border border-slate-200 text-center space-y-1.5 cursor-pointer hover:bg-slate-50"><Sparkles className="w-5 h-5 text-indigo-500 mx-auto" /><div className="text-xs font-medium text-slate-700">{t.themeSystem}</div></div>
                    </div>
                  </div>
                )}
                {settingsTab === 'collaboration' && (
                  <div className="space-y-4">
                    <div><h4 className="font-bold text-slate-900 text-sm">{t.multiplayerTitle}</h4><p className="text-xs text-slate-500 mt-0.5">{t.multiplayerDesc}</p></div>
                    <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5"><div className="font-bold text-slate-900 text-xs">启用实时协同光标显示</div><div className="text-[11px] text-slate-500">Alex, Phoebe, Jenn 协同光标气泡</div></div>
                      <button onClick={() => setShowMultiplayerCursors(!showMultiplayerCursors)} className={`w-11 h-6 rounded-full transition-colors relative ${showMultiplayerCursors ? 'bg-blue-600' : 'bg-slate-300'}`}><span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${showMultiplayerCursors ? 'right-1' : 'left-1'}`} /></button>
                    </div>
                  </div>
                )}
                {settingsTab === 'obsidian' && (
                  <div className="space-y-4">
                    <div><h4 className="font-bold text-slate-900 text-sm">{t.obsidianApiTitle}</h4><p className="text-xs text-slate-500 mt-0.5">{t.obsidianApiDesc}</p></div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-slate-500">API Endpoint:</span><span className="text-slate-900 font-bold">http://127.0.0.1:27123</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="text-emerald-600 font-bold flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>ACTIVE (REST API & Canvas Ready)</span></span></div>
                    </div>
                  </div>
                )}
                {settingsTab === 'llm' && (
                  <div className="space-y-6">
                    <div><h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2"><Server className="w-4 h-4 text-indigo-600" /><span>{t.llmTitle}</span></h4><p className="text-xs text-slate-500 mt-0.5">{t.llmDesc}</p></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700">{t.llmBaseUrl}</label><input type="text" value={llmBaseUrl} onChange={e => setLlmBaseUrl(e.target.value)} placeholder={t.llmBaseUrlPlaceholder} className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-slate-900" /></div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5"><Key className="w-3.5 h-3.5 text-indigo-500" /><span>{t.llmApiKey}</span></label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <input type={llmKeyVisible ? 'text' : 'password'} value={llmApiKey} onChange={e => setLlmApiKey(e.target.value)} placeholder={t.llmApiKeyPlaceholder} className="w-full text-sm px-3 py-2 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-slate-900 font-mono" />
                          <button onClick={() => setLlmKeyVisible(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" title="显示/隐藏">{llmKeyVisible ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
</button>
                        </div>
                        <button onClick={() => { setLlmTestResult('ok'); }} className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition whitespace-nowrap">{t.llmSaveKeyBtn}</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">{t.llmModel}</label>
                        <div className="flex space-x-2">
                          <button onClick={() => setShowAddModel(v => !v)} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-0.5 rounded border border-indigo-200 hover:bg-indigo-50 transition">+ {t.llmAddModel}</button>
                          <button onClick={async (e) => {
                              if (!llmBaseUrl.trim() || !llmApiKey.trim()) { alert('请先填写 Base URL 和 API Key'); return; }
                              const btn = e.currentTarget as HTMLButtonElement;
                              const orig = btn.innerHTML;
                              btn.disabled = true;
                              btn.innerHTML = '<span class="inline-flex items-center space-x-1"><svg class="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>获取中...</span></span>';
                              try {
                                const baseUrl = llmBaseUrl.replace(/\/+$/, '');
                                const resp = await fetch(baseUrl + '/models', { headers: { Authorization: 'Bearer ' + llmApiKey } });
                                if (!resp.ok) throw new Error('HTTP ' + resp.status + ' ' + resp.statusText);
                                const data = await resp.json() as any;
                                const ids = (data.data || []).map((m: any) => m.id);
                                if (ids.length === 0) { alert('上游返回的模型列表为空，请检查凭据是否正确'); return; }
                                let added = 0;
                                setLlmModels(prev => {
                                  const existing = new Set(prev.map(pm => pm.name));
                                  const next = [...prev];
                                  for (const id of ids) {
                                    if (!existing.has(id)) { next.push({ id: Date.now() + '-' + id, name: id, apiUrl: baseUrl, apiKey: llmApiKey, isDefault: false }); existing.add(id); added++; }
                                  }
                                  return next;
                                });
                                alert('成功获取 ' + added + ' 个新模型');
                              } catch (err: any) {
                                console.error('[llm-fetch] error:', err);
                                alert('从上游获取失败: ' + (err?.message || String(err)));
                              } finally {
                                btn.disabled = false;
                                btn.innerHTML = orig;
                              }
                            }} className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-50 transition">🔄 {t.llmFetchUpstream}</button>
                        </div>
                      </div>
                      {showAddModel && (
                        <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 space-y-2">
                          <input type="text" value={newModelName} onChange={e => setNewModelName(e.target.value)} placeholder="模型名称 (如: gpt-4o)" className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                          <input type="text" value={newModelApiUrl} onChange={e => setNewModelApiUrl(e.target.value)} placeholder="API URL (如: https://api.openai.com/v1)" className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                          <input type="password" value={newModelApiKey} onChange={e => setNewModelApiKey(e.target.value)} placeholder="API Key" className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-300 font-mono" />
                          <div className="flex space-x-2">
                            <button onClick={() => { if (newModelName.trim()) { setLlmModels(prev => [...prev, { id: `${Date.now()}`, name: newModelName.trim(), apiUrl: newModelApiUrl.trim() || llmBaseUrl, apiKey: newModelApiKey, isDefault: false }]); setNewModelName(''); setNewModelApiUrl(''); setNewModelApiKey(''); setShowAddModel(false); } }} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition">{t.confirm}</button>
                            <button onClick={() => setShowAddModel(false)} className="text-xs text-slate-500 px-3 py-1 hover:bg-slate-100 rounded-lg transition">{t.cancel}</button>
                          </div>
                        </div>
                      )}
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {llmModels.map((model) => (
                          <div key={model.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs group hover:border-indigo-300 transition">
                            <div className="flex-1 min-w-0 space-y-0.5 mr-3">
                              <div className="flex items-center space-x-2"><span className="font-semibold text-slate-900">{model.name}</span>{model.isDefault && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">默认</span>}</div>
                              <div className="text-[10px] text-slate-500 font-mono truncate">{model.apiUrl || '—'}</div>
                            </div>
                            <div className="flex items-center space-x-1.5 shrink-0">
                              <button onClick={() => { setLlmModels(prev => prev.map(m => ({ ...m, isDefault: m.name === model.name }))); setLlmDefaultModel(model.name); }} className={`px-2 py-1 rounded text-[10px] font-semibold transition ${model.isDefault ? 'bg-indigo-600 text-white cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`}>{model.isDefault ? '✓ 已设为默认' : t.llmSetDefault}</button>
                              <button onClick={() => { setSelectedModels(prev => prev.includes(model.name) ? prev.filter(n => n !== model.name) : [...prev, model.name]); }} className={`px-2 py-1 rounded text-[10px] font-semibold transition ${selectedModels.includes(model.name) ? 'bg-emerald-600 text-white cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>{selectedModels.includes(model.name) ? '✓ 已选' : '选择'}</button>
                              <button onClick={() => setLlmModels(prev => prev.filter(m => m.id !== model.id))} className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition" title="删除"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                        {llmModels.length === 0 && <div className="text-xs text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-lg">暂无模型，请添加或从上游获取</div>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3"><button onClick={() => { setLlmTestResult(null); setTimeout(() => setLlmTestResult('ok'), 800); }} className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"><Plug className="w-3.5 h-3.5" /><span>{t.llmTestConnection}</span></button>{llmTestResult === 'ok' && <span className="text-xs text-emerald-600 font-semibold">{t.llmTestResultOk}</span>}{llmTestResult === 'err' && <span className="text-xs text-red-500 font-semibold">{t.llmTestResultErr}</span>}</div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5"><Bot className="w-3.5 h-3.5 text-indigo-500" /><span>{t.llmSystemPrompt}</span></label><textarea value={llmSystemPrompt} onChange={e => setLlmSystemPrompt(e.target.value)} rows={4} placeholder={t.llmSystemPromptPlaceholder} className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-slate-800 resize-none" /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700">{t.llmTemperature}</label><input type="number" step="0.1" min="0" max="2" value={llmTemperature} onChange={e => setLlmTemperature(parseFloat(e.target.value))} className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700">{t.llmMaxTokens}</label><input type="number" min="1" value={llmMaxTokens} onChange={e => setLlmMaxTokens(parseInt(e.target.value))} className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700">{t.llmTopP}</label><input type="number" step="0.05" min="0" max="1" value={llmTopP} onChange={e => setLlmTopP(parseFloat(e.target.value))} className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" /></div>
                      <div className="space-y-1.5"><label className="text-xs font-semibold text-slate-700">{t.llmStopSequences}</label><input type="text" value={llmStopSequences} onChange={e => setLlmStopSequences(e.target.value)} placeholder={t.llmStopSequencesPlaceholder} className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" /></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between"><h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5"><Plug className="w-3.5 h-3.5 text-indigo-500" /><span>{t.llmEnvVars}</span></h4><button onClick={() => setLlmEnvVars(prev => [...prev, { name: '', value: '' }])} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold">{t.llmAddEnvVar}</button></div>
                      <p className="text-[11px] text-slate-500">{t.llmEnvVarsDesc}</p>
                      {llmEnvVars.length === 0 && <div className="text-xs text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-lg">暂无自定义环境变量</div>}
                      {llmEnvVars.map((env, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input type="text" value={env.name} onChange={e => { const next = [...llmEnvVars]; next[idx] = { ...next[idx], name: e.target.value }; setLlmEnvVars(next); }} placeholder={t.llmEnvVarName} className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white" />
                          <input type="text" value={env.value} onChange={e => { const next = [...llmEnvVars]; next[idx] = { ...next[idx], value: e.target.value }; setLlmEnvVars(next); }} placeholder={t.llmEnvVarValue} className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white" />
                          <button onClick={() => setLlmEnvVars(prev => prev.filter((_, i) => i !== idx))} className="p-1.5 text-slate-400 hover:text-red-500 transition" title={t.llmRemoveEnvVar}><Trash className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
                <button onClick={() => setSettingsOpen(false)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">{t.confirm}</button>
              </div>
            </div>
          </div>
        )}

      {/* Context Picker Modal */}
      {isContextPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">挂载知识库目录或文档</h3>
              </div>
              <button onClick={() => setIsContextPickerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">知识库分类 / 目录</div>
              {collectionDocsState.map(col => {
                const isAttached = attachedContexts.some(c => c.id === col.id);
                return (
                  <div key={col.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-slate-100 transition">
                    <div className="flex items-center space-x-2.5">
                      <Folder className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{col.title}</div>
                        <div className="text-[10px] text-slate-400">{col.items?.length || 0} 个文档</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!isAttached) {
                          setAttachedContexts(prev => [...prev, { type: 'folder', id: col.id, name: col.title }]);
                        } else {
                          setAttachedContexts(prev => prev.filter(c => c.id !== col.id));
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${isAttached ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    >
                      {isAttached ? '✓ 已挂载' : '+ 挂载'}
                    </button>
                  </div>
                );
              })}

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">Wiki 页面文档</div>
              {wikiPages.map(page => {
                const isAttached = attachedContexts.some(c => c.id === page.id);
                const title = page.frontmatter?.title || page.fileName;
                return (
                  <div key={page.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-slate-100 transition">
                    <div className="flex items-center space-x-2.5 min-w-0 mr-2">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{title}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{page.path}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!isAttached) {
                          setAttachedContexts(prev => [...prev, { type: 'doc', id: page.id, name: title }]);
                        } else {
                          setAttachedContexts(prev => prev.filter(c => c.id !== page.id));
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition ${isAttached ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    >
                      {isAttached ? '✓ 已挂载' : '+ 挂载'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50">
              <button onClick={() => setIsContextPickerOpen(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
                确定 ({attachedContexts.length} 已挂载)
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};