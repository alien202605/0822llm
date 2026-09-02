import React, { useState, useMemo } from 'react';
import {
  Activity,
  Radio,
  Sparkles,
  Layers,
  CalendarClock,
  GitMerge,
  Cpu,
  Search,
  Bot,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Play,
  FileText,
  Filter,
  Check,
  Zap,
  ChevronRight,
  Copy,
  Sliders,
  Database,
  Eye,
  HelpCircle,
  Network
} from 'lucide-react';
import { RealtimeIntelligenceItem, RealtimePipelineMetric } from '../types';
import {
  INITIAL_PIPELINE_METRIC,
  REALTIME_PIPELINE_STAGES,
  INITIAL_REALTIME_INTELLIGENCE,
  REALTIME_SIMULATED_PROMPTS,
  RealtimeSimulatedPrompt,
  PipelineStageInfo
} from '../data/realtimeData';

interface RealtimeKnowledgeEngineViewProps {
  onNavigateToWiki?: (path: string) => void;
  onAddLog?: (action: any, details: string) => void;
}

export const RealtimeKnowledgeEngineView: React.FC<RealtimeKnowledgeEngineViewProps> = ({
  onNavigateToWiki,
  onAddLog
}) => {
  const [metrics, setMetrics] = useState<RealtimePipelineMetric>(INITIAL_PIPELINE_METRIC);
  const [selectedStage, setSelectedStage] = useState<PipelineStageInfo>(REALTIME_PIPELINE_STAGES[0]);
  const [intelligenceList, setIntelligenceList] = useState<RealtimeIntelligenceItem[]>(INITIAL_REALTIME_INTELLIGENCE);
  const [selectedIntel, setSelectedIntel] = useState<RealtimeIntelligenceItem>(INITIAL_REALTIME_INTELLIGENCE[0]);
  const [activeTab, setActiveTab] = useState<'stream' | 'pipeline' | 'mcp_probe' | 'comparison'>('stream');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [customSimUrl, setCustomSimUrl] = useState<string>('https://tech-intel.internal/news/q3-patent-approved');
  const [customSimTitle, setCustomSimTitle] = useState<string>('Acme 智库「反向倒排与增量图谱毫秒级 Refresh 引擎」核心发明专利获国家知识产权局正式授权');
  
  // MCP Probe State
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const filteredIntelligence = useMemo(() => {
    return intelligenceList.filter(item => {
      if (sourceFilter !== 'all' && item.sourceType !== sourceFilter) return false;
      if (importanceFilter !== 'all' && item.importance !== importanceFilter) return false;
      return true;
    });
  }, [intelligenceList, sourceFilter, importanceFilter]);

  const activePrompt: RealtimeSimulatedPrompt = REALTIME_SIMULATED_PROMPTS[selectedPromptIndex];

  // Simulation of Live Ingest
  const handleTriggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);

    const stepInterval = setInterval(() => {
      setSimulationStep(prev => {
        if (prev >= 8) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          // Add new simulated intelligence item
          const newItem: RealtimeIntelligenceItem = {
            id: `intel-sim-${Date.now()}`,
            sourceType: 'patent_filing',
            sourceName: '国家知识产权局 (CNIPA) 官方公报',
            sourceUrl: customSimUrl,
            title: customSimTitle,
            capturedAt: '刚刚 (Live Ingested)',
            summary: '国家知识产权局正式下发授权公告，确立毫秒级增量 Refresh 与倒排索引局部重构技术自主知识产权。',
            cleanTextPreview: '发明名称：一种基于反向倒排索引与语义事件抽取的高并发企业活知识库毫秒级 Refresh 方法及系统。摘要：本发明公开了在企业异构数据流接入时，通过 AST 增量分析与局部 Embedding 编排，使企业 Agent 在 820ms 内获取最新事实...',
            detectedEvents: [
              '获国家知识产权局核心发明专利授权 (ZL 2026 1 0429812.X)',
              '为全员 Wiki 和 Agent 决策建立独家合规与技术壁垒',
              '自动并入 wiki/company-info/company-overview.md 研发资产章节'
            ],
            affectedEntities: [
              'wiki/company-info/company-overview.md',
              'wiki/company-info/why-enterprises-need-knowledge-base.md'
            ],
            targetWikiPath: 'wiki/company-info/company-overview.md',
            status: 'agent_ready',
            importance: 'critical',
            refreshLatencyMs: 680
          };
          setIntelligenceList(prevList => [newItem, ...prevList]);
          setSelectedIntel(newItem);
          setMetrics(prevM => ({
            ...prevM,
            dailyIngestedEvents: prevM.dailyIngestedEvents + 1,
            autoChronologyGenerated: prevM.autoChronologyGenerated + 1,
            mcpQueryCount: prevM.mcpQueryCount + 12
          }));
          if (onAddLog) {
            onAddLog('REALTIME_REFRESH', `实时情报流自动捕获并完成 8 步 Refresh 链路: ${newItem.title}`);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  const getSourceTypeBadge = (type: string) => {
    switch (type) {
      case 'corporate_web':
        return <span className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">🏢 企业官网/通告</span>;
      case 'regulation':
        return <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-300 border border-red-500/40">⚖️ 政策法规/合规</span>;
      case 'github_repo':
        return <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">🐙 GitHub / 协议</span>;
      case 'ir_announcement':
        return <span className="px-2 py-0.5 text-xs rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">📊 IR 财报/公告</span>;
      case 'hiring_shift':
        return <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">💼 招聘/组织动向</span>;
      case 'patent_filing':
        return <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">📜 专利/技术成果</span>;
      default:
        return <span className="px-2 py-0.5 text-xs rounded bg-slate-700 text-slate-300">🌐 公开情报流</span>;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <span className="px-1.5 py-0.5 text-xs rounded font-medium bg-red-900/60 text-red-200 border border-red-700/60 flex items-center gap-1"><Flame className="w-3 h-3 text-red-400" /> P0 极重度</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 text-xs rounded font-medium bg-amber-900/60 text-amber-200 border border-amber-700/60 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-amber-400" /> P1 重要</span>;
      default:
        return <span className="px-1.5 py-0.5 text-xs rounded font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-slate-400" /> P2 常规</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* 1. Header Banner & Key SLA Dashboard */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                <Radio className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">企业实时活知识库引擎 (Real-time Living Knowledge)</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    8/8 流水线在线
                  </span>
                </div>
                <p className="text-sm text-indigo-200/80 mt-1 max-w-3xl">
                  打破传统静态 RAG「上传即过时」的致命短板，通过 8 步动态 Refresh 流水线持续监听内外部异构数据流，实时抽取事件时间线并动态并网，为全员 AI Agent 打造零时差的数据底座。
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleTriggerSimulation}
              disabled={isSimulating}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow flex items-center gap-2 ${
                isSimulating
                  ? 'bg-amber-600/50 text-white cursor-not-allowed animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
              }`}
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? `正在执行第 ${simulationStep}/8 步流水线...` : '模拟实时情报入库'}
            </button>
          </div>
        </div>

        {/* 6 Key SLA Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-indigo-500/20">
          <div className="bg-slate-900/60 backdrop-blur rounded-lg p-3 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              持续监听源
            </div>
            <div className="text-xl font-bold text-white mt-1">{metrics.activeWatchers} <span className="text-xs text-indigo-400 font-normal">个节点</span></div>
            <div className="text-[11px] text-emerald-400 mt-0.5">官网/IR/GitHub/法规</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-lg p-3 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              今日入库事件
            </div>
            <div className="text-xl font-bold text-white mt-1">{metrics.dailyIngestedEvents} <span className="text-xs text-indigo-400 font-normal">条</span></div>
            <div className="text-[11px] text-indigo-300 mt-0.5">+18% 环比昨日</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-lg p-3 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              平均 Refresh 时延
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{metrics.averageRefreshLatencyMs} <span className="text-xs text-indigo-400 font-normal">ms</span></div>
            <div className="text-[11px] text-emerald-400 mt-0.5">SLA &lt; 1,200ms 达标</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-lg p-3 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-indigo-400" />
              自动时间线生成
            </div>
            <div className="text-xl font-bold text-white mt-1">{metrics.autoChronologyGenerated} <span className="text-xs text-indigo-400 font-normal">个节点</span></div>
            <div className="text-[11px] text-indigo-300 mt-0.5">实体生命周期追踪</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-lg p-3 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              Agent/MCP 实时调用
            </div>
            <div className="text-xl font-bold text-purple-300 mt-1">{metrics.mcpQueryCount.toLocaleString()} <span className="text-xs text-indigo-400 font-normal">次</span></div>
            <div className="text-[11px] text-purple-400 mt-0.5">零幻觉事实基座</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur rounded-lg p-3 border border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              陈旧信息规避率
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{metrics.staleRiskMitigatedRate}%</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">绝无陈旧政策误导</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'stream'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            实时情报流捕获阵列 ({filteredIntelligence.length})
          </button>
          
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            8 步动态 Refresh 流水线全景
          </button>

          <button
            onClick={() => setActiveTab('mcp_probe')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'mcp_probe'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            MCP Agent 实时探针与对比实测
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'comparison'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            静态 RAG vs 实时活知识架构矩阵
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Daemon: Port 27123 / WebSocket Ingestion Active
        </div>
      </div>

      {/* Tab 1: Live Intelligence Stream */}
      {activeTab === 'stream' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Intelligence Feed */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">情报筛选：</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  aria-label="筛选情报来源分类"
                  className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">全部分类 (All Sources)</option>
                  <option value="corporate_web">企业官网/通告</option>
                  <option value="regulation">政策法规/合规</option>
                  <option value="github_repo">GitHub / 开源规范</option>
                  <option value="ir_announcement">IR 财报/公告</option>
                  <option value="hiring_shift">招聘动向/组织</option>
                  <option value="patent_filing">专利技术成果</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={importanceFilter}
                  onChange={(e) => setImportanceFilter(e.target.value)}
                  aria-label="筛选情报优先级"
                  className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">全部优先级</option>
                  <option value="critical">P0 极重度</option>
                  <option value="high">P1 重要</option>
                  <option value="normal">P2 常规</option>
                </select>
              </div>
            </div>

            {/* Stream List */}
            <div className="space-y-3 overflow-hidden" style={{ maxHeight: '700px' }}>
              <div className="animate-ticker-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...filteredIntelligence, ...filteredIntelligence].map((item, idx) => {
                  const isSelected = selectedIntel.id === item.id;
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => setSelectedIntel(item)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getSourceTypeBadge(item.sourceType)}
                          {getImportanceBadge(item.importance)}
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {item.capturedAt}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-2.5 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                          <span className="font-mono text-[11px] text-indigo-500 dark:text-indigo-400 truncate">
                            {item.sourceName}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ⚡ {item.refreshLatencyMs}ms Refresh
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: In-Depth Event Extraction & Living Chronicle Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
              {/* Header Info */}
              <div className="space-y-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {getSourceTypeBadge(selectedIntel.sourceType)}
                    {getImportanceBadge(selectedIntel.importance)}
                    <span className="text-xs font-mono text-slate-500">ID: {selectedIntel.id}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    已自动编织并网 (Agent Ready)
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedIntel.title}
                </h2>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span>情报捕获时间: <strong className="text-slate-700 dark:text-slate-300">{selectedIntel.capturedAt}</strong></span>
                  <span>来源中枢: <strong className="text-indigo-600 dark:text-indigo-400">{selectedIntel.sourceName}</strong></span>
                  <span>端到端 Refresh 时延: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedIntel.refreshLatencyMs}ms</strong></span>
                </div>
              </div>

              {/* 1. Event Timeline Extraction */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-indigo-500" />
                  AI 抽取之关键事实与事件时间线 (Living Events)
                </h4>
                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-lg p-4 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  {selectedIntel.detectedEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{evt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Target Wiki Integration & Obsidian Bi-directional Links */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GitMerge className="w-4 h-4 text-indigo-500" />
                  影响实体与 Obsidian 双链并网目标 (Affected Wiki Pages)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIntel.affectedEntities.map((entityPath, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigateToWiki && onNavigateToWiki(entityPath)}
                      className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="text-xs font-mono text-indigo-900 dark:text-indigo-200 truncate group-hover:underline">
                          [[{entityPath}]]
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Clean Text AST Preview */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    正文降噪提取与结构化 Markdown (Clean Text AST)
                  </h4>
                  <button
                    onClick={() => handleCopyText(selectedIntel.cleanTextPreview, selectedIntel.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {copiedStatus === selectedIntel.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        已复制 AST
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        复制提取正文
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 rounded-lg p-4 font-mono text-xs leading-relaxed border border-slate-800 max-h-48 overflow-y-auto">
                  {selectedIntel.cleanTextPreview}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <a
                  href={selectedIntel.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  溯源原始公开链接 ({selectedIntel.sourceUrl.substring(0, 36)}...)
                </a>

                {onNavigateToWiki && (
                  <button
                    onClick={() => onNavigateToWiki(selectedIntel.targetWikiPath)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    查看并网 Wiki 页面
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 8-Stage Pipeline Visualization */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Interactive 8-Stage Flow */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                企业实时活知识库 8 步动态 Refresh 流水线全景
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                点击下方任意流水线阶段，查看该节点的微服务吞吐指标、AST 转换逻辑与毫秒级时延监控。
              </p>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {REALTIME_PIPELINE_STAGES.map((stage) => {
                const isSelected = selectedStage.id === stage.id;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStage(stage)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/60 dark:to-indigo-900/30 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {stage.stepNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {stage.latency}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {stage.name}
                    </h3>
                    <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {stage.nameEn}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {stage.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">吞吐量:</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{stage.throughput}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Stage Inspector */}
            <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                    {selectedStage.stepNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedStage.name} ({selectedStage.nameEn})
                    </h3>
                    <p className="text-xs text-slate-500">
                      节点状态: <span className="text-emerald-500 font-semibold">健康运行 (Green SLA)</span> · 目标时延: <span className="font-mono text-indigo-500">{selectedStage.latency}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-mono">
                    峰值吞吐: {selectedStage.throughput}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedStage.description}
              </p>

              {/* Technical Code/AST Transformation Spec */}
              <div className="bg-slate-900 text-slate-200 rounded-lg p-4 font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-indigo-400 font-bold">// 阶段 {selectedStage.stepNumber} 核心执行引擎配置与 Schema 流转定义</div>
                <div className="text-slate-400">
                  {selectedStage.stepNumber === 1 && `daemon.listenStream(["corporate_web", "ir_sec", "github_commits", "std_regulations"], {\n  pollingStrategy: "hybrid_webhook_rss",\n  jitterMs: 50,\n  dedupFingerprint: "sha256(rawBody)"\n});`}
                  {selectedStage.stepNumber === 2 && `cleanAst = stripBoilerplate(rawHtml, {\n  preserveHeadings: true,\n  removeAds: true,\n  outputFormat: "github-flavored-markdown-ast"\n});`}
                  {selectedStage.stepNumber === 3 && `categorizedEntity = await llm.classify(cleanAst, {\n  taxonomySchema: ".agent/schema.md",\n  temperature: 0.0,\n  confidenceThreshold: 0.92\n});`}
                  {selectedStage.stepNumber === 4 && `timelineEvents = extractChronology(cleanAst, {\n  actorResolution: true,\n  temporalAnchor: new Date().toISOString(),\n  causalityChains: true\n});`}
                  {selectedStage.stepNumber === 5 && `obsidianVault.weaveWikiDiff({\n  targetPages: ["wiki/company-info/strategic-notice-2026.md"],\n  injectBiLinks: true,\n  calloutFormat: "> [!NOTE] 实时动态更新"\n});`}
                  {selectedStage.stepNumber === 6 && `vectorEngine.incrementalEmbed(changedChunks, {\n  model: "text-embedding-3-small",\n  avoidFullReindex: true,\n  latencyTargetMs: 100\n});`}
                  {selectedStage.stepNumber === 7 && `qmdIndex.patchInvertedIndex(termDeltas, {\n  bm25_k1: 1.2,\n  bm25_b: 0.75,\n  syncLock: "lock-free-atomic"\n});`}
                  {selectedStage.stepNumber === 8 && `mcpServer.publishLiveFact({\n  protocol: "modelcontextprotocol/2.0",\n  channel: "enterprise-knowledge-stream",\n  qos: 1\n});`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MCP Agent Dual-Probe Studio (Side-by-Side Prompt Tester) */}
      {activeTab === 'mcp_probe' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Model Context Protocol (MCP) 实时探针实测：静态 RAG vs 实时活知识库
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                选择或输入具体的企业业务问答，直观对比「基于 3 个月前上传的静态 PDF RAG」与「基于 8 步 Refresh 流水线的企业实时活知识库」在回答时效性与准确度上的代差。
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">选择实测典型案例：</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {REALTIME_SIMULATED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPromptIndex(idx)}
                    className={`p-3 rounded-lg text-left border transition-all ${
                      selectedPromptIndex === idx
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 font-medium">
                      {prompt.category}
                    </span>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-2 line-clamp-2">
                      {prompt.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Question Box */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-white">
                “{activePrompt.query}”
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                {activePrompt.freshnessGap}
              </span>
            </div>

            {/* Dual Comparison Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Traditional Static RAG */}
              <div className="bg-red-50/40 dark:bg-red-950/20 rounded-xl p-5 border border-red-200 dark:border-red-900/40 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-red-200 dark:border-red-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
                      传统静态 RAG (基于 3 个月前上传文件)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-red-600 dark:text-red-400">
                    ❌ 存在陈旧信息误导
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg border border-red-100 dark:border-red-900/30 min-h-[140px]">
                  {activePrompt.staticRagAnswer}
                </div>

                <div className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span><strong>痛点根因</strong>：系统无法感知今天新发生的政策与通告，给出了过时的错误答案。</span>
                </div>
              </div>

              {/* Right: Real-time Living Knowledge Base */}
              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-5 border border-emerald-300 dark:border-emerald-800/40 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      企业实时活知识库 (8 步 Refresh + MCP 探针)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    ⚡ 820ms 最新事实召回
                  </span>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/30 min-h-[140px]">
                  {activePrompt.realtimeLivingAnswer}
                </div>

                <div className="text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span><strong>核心优势</strong>：{activePrompt.keyDifference}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Comparison Matrix */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                从静态 RAG 到企业实时知识库：核心技术范式对比矩阵
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                “模型决定 AI 的能力上限，而持续知识更新能力决定 AI 的实际表现。”
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                    <th className="py-3 px-4 font-bold">评估维度</th>
                    <th className="py-3 px-4 font-bold text-red-600 dark:text-red-400">传统静态 RAG 模式</th>
                    <th className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">企业实时活知识库 (Living Knowledge Engine)</th>
                    <th className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">业务价值与影响</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">1. 数据形态</td>
                    <td className="py-3.5 px-4 text-slate-500">静态快照（上传时刻的文件与离线 PDF）</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">动态数据流（持续监听、即时清洗、事件抽取）</td>
                    <td className="py-3.5 px-4">知识永葆新鲜，杜绝信息过时</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">2. 更新机制</td>
                    <td className="py-3.5 px-4 text-slate-500">人工手动下载 -&gt; 重传 -&gt; 重建索引（滞后数周）</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">Webhook/Daemon 自动感知 -&gt; 820ms 增量 Refresh</td>
                    <td className="py-3.5 px-4">节省 95% 人工知识维护工时</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">3. 数据组织结构</td>
                    <td className="py-3.5 px-4 text-slate-500">孤立的碎片化 Chunk 文本段</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">结构化实体画像、事件时间线 (Living Chronology) 与双向链接</td>
                    <td className="py-3.5 px-4">脉络清晰，因果关联完整</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">4. Agent 调用协议</td>
                    <td className="py-3.5 px-4 text-slate-500">简单的向量相似度余弦召回 (Top-K)</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">结构化事实底座 + Model Context Protocol (MCP) 实时探针</td>
                    <td className="py-3.5 px-4">支持双向数据订阅与流式事件</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">5. 事实准确与置信度</td>
                    <td className="py-3.5 px-4 text-slate-500">易产生时效性幻觉，无法回答最新突发事件</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">实时反映当天甚至几秒钟前的最新经营与政策动态</td>
                    <td className="py-3.5 px-4">高价值战略决策底座</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
