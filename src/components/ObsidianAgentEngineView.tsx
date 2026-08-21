import React, { useState } from 'react';
import {
  Layers,
  Database,
  Cpu,
  Terminal,
  Play,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  FileCode2,
  Table,
  Eye,
  GitBranch,
  Settings,
  Shield,
  Zap,
  Box,
  Share2,
  Compass,
  FileText,
  Copy,
  Check,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ObsidianVaultConfig,
  ObsidianCanvasFile,
  ObsidianDataviewQueryPreset,
  ObsidianApiCallLog,
  WikiPage
} from '../types';
import {
  DEFAULT_OBSIDIAN_CONFIG,
  PRESET_OBSIDIAN_CANVASES,
  PRESET_DATAVIEW_QUERIES,
  PRESET_OBSIDIAN_API_LOGS
} from '../data/obsidianData';

interface ObsidianAgentEngineViewProps {
  wikiPages: WikiPage[];
  onNavigateToWikiPage: (path: string) => void;
}

export const ObsidianAgentEngineView: React.FC<ObsidianAgentEngineViewProps> = ({
  wikiPages,
  onNavigateToWikiPage
}) => {
  const [config, setConfig] = useState<ObsidianVaultConfig>(DEFAULT_OBSIDIAN_CONFIG);
  const [canvases, setCanvases] = useState<ObsidianCanvasFile[]>(PRESET_OBSIDIAN_CANVASES);
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>(PRESET_OBSIDIAN_CANVASES[0].id);
  const [apiLogs, setApiLogs] = useState<ObsidianApiCallLog[]>(PRESET_OBSIDIAN_API_LOGS);

  // Dataview Engine state
  const [selectedQueryId, setSelectedQueryId] = useState<string>(PRESET_DATAVIEW_QUERIES[0].id);
  const [customDql, setCustomDql] = useState<string>(PRESET_DATAVIEW_QUERIES[0].dql);
  const [queryResultRows, setQueryResultRows] = useState<any[]>([]);
  const [isExecutingDql, setIsExecutingDql] = useState<boolean>(false);
  const [isPingingApi, setIsPingingApi] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'canvas' | 'dataview' | 'api-gateway' | 'callouts'>('canvas');

  // Selected Canvas
  const activeCanvas = canvases.find(c => c.id === selectedCanvasId) || canvases[0];

  // Run Dataview Query
  const handleExecuteDataview = (queryText?: string) => {
    const dqlToRun = queryText || customDql;
    setIsExecutingDql(true);

    setTimeout(() => {
      let filtered = wikiPages;
      if (dqlToRun.includes('sops')) {
        filtered = wikiPages.filter(p => p.frontmatter.type === 'sop');
      } else if (dqlToRun.includes('新媒体') || dqlToRun.includes('视觉设计')) {
        filtered = wikiPages.filter(p =>
          p.frontmatter.tags.some(t => t.includes('新媒体') || t.includes('视觉') || t.includes('视频'))
        );
      } else if (dqlToRun.includes('projects') || dqlToRun.includes('微服务')) {
        filtered = wikiPages.filter(p =>
          p.frontmatter.type === 'project' || p.frontmatter.tags.some(t => t.includes('架构') || t.includes('微服务'))
        );
      }

      setQueryResultRows(
        filtered.map(p => ({
          name: p.frontmatter.title,
          path: p.path,
          type: p.frontmatter.type.toUpperCase(),
          status: p.frontmatter.status === 'active' ? '✅ 活跃有效' : '草稿',
          updated_at: p.frontmatter.updated_at,
          sources: p.frontmatter.sources.join(', ') || '直接创建',
          tags: p.frontmatter.tags.map(t => `#${t}`).join(' ')
        }))
      );
      setIsExecutingDql(false);

      // Append API log
      const newLog: ObsidianApiCallLog = {
        id: `api-log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'POST',
        endpoint: '/dataview/query',
        agentTask: `执行 Dataview DQL: ${dqlToRun.slice(0, 40)}...`,
        status: 200,
        latencyMs: Math.floor(Math.random() * 12 + 6),
        responsePayloadSummary: `{ "resultsCount": ${filtered.length}, "executionEngine": "Obsidian Dataview Plugin" }`
      };
      setApiLogs(prev => [newLog, ...prev]);
    }, 280);
  };

  // Run on mount once
  React.useEffect(() => {
    handleExecuteDataview(PRESET_DATAVIEW_QUERIES[0].dql);
  }, []);

  // Ping REST API test
  const handlePingRestApi = () => {
    setIsPingingApi(true);
    setTimeout(() => {
      setIsPingingApi(false);
      const newLog: ObsidianApiCallLog = {
        id: `api-log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: 'GET',
        endpoint: '/vault',
        agentTask: '智能体探活检测: Obsidian Local REST API Ping',
        status: 200,
        latencyMs: 11,
        responsePayloadSummary: `{ "vault": "${config.vaultName}", "authenticated": true, "pluginVersion": "2.1.2" }`
      };
      setApiLogs(prev => [newLog, ...prev]);
    }, 400);
  };

  // Open in Obsidian protocol
  const handleOpenObsidianApp = (fileParam?: string) => {
    const uri = fileParam
      ? `obsidian://open?vault=${encodeURIComponent(config.vaultName)}&file=${encodeURIComponent(fileParam)}`
      : `obsidian://open?vault=${encodeURIComponent(config.vaultName)}`;

    // Copy to clipboard or trigger
    navigator.clipboard.writeText(uri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);

    // Attempt to open protocol in desktop if supported
    window.location.href = uri;
  };

  // Agent Generate new Canvas
  const handleAgentGenerateCanvas = () => {
    const newCanvas: ObsidianCanvasFile = {
      id: `canvas-${Date.now()}`,
      name: `enterprise-auto-synthesis-${Date.now().toString().slice(-4)}.canvas`,
      path: `wiki/canvases/enterprise-auto-synthesis-${Date.now().toString().slice(-4)}.canvas`,
      title: 'Agent 自动提炼的全域知识流转白板 (Obsidian Canvas)',
      updatedAt: '刚刚生成',
      nodes: [
        {
          id: 'gen-node-1',
          type: 'group',
          label: '业务输入与工位共享盘',
          x: 40,
          y: 40,
          width: 320,
          height: 200,
          color: '#10B981'
        },
        {
          id: 'gen-node-2',
          type: 'text',
          text: '### 🧠 Agent 知识推理中枢\n- 自动抽取实体\n- 生成 Obsidian Callouts\n- 组装 Canvas 拓扑',
          x: 420,
          y: 80,
          width: 260,
          height: 140,
          color: '#6366F1'
        },
        {
          id: 'gen-node-3',
          type: 'file',
          filePath: 'wiki/sops/short-video-3s-hook-library.md',
          x: 740,
          y: 60,
          width: 280,
          height: 130,
          color: '#F43F5E'
        }
      ],
      edges: [
        {
          id: 'gen-edge-1',
          fromNode: 'gen-node-1',
          toNode: 'gen-node-2',
          fromSide: 'right',
          toSide: 'left',
          label: '自动采集'
        },
        {
          id: 'gen-edge-2',
          fromNode: 'gen-node-2',
          toNode: 'gen-node-3',
          fromSide: 'right',
          toSide: 'left',
          label: '写入 Obsidian'
        }
      ]
    };

    setCanvases(prev => [newCanvas, ...prev]);
    setSelectedCanvasId(newCanvas.id);

    const newLog: ObsidianApiCallLog = {
      id: `api-log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint: `/vault/${newCanvas.path}`,
      agentTask: `Agent 生成 Obsidian Canvas 视觉白板: ${newCanvas.name}`,
      status: 201,
      latencyMs: 24,
      responsePayloadSummary: `{ "status": "created", "canvas": "${newCanvas.name}", "nodes": 3, "edges": 2 }`
    };
    setApiLogs(prev => [newLog, ...prev]);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner: Obsidian Vault & Agent Driver Integration */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-purple-800/40 text-white shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center space-x-1">
                <Box className="w-3.5 h-3.5" />
                <span>Obsidian Engine & Agent Backend</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Obsidian Vault API · Dataview 查询 · Canvas 白板 · Agent 智能体驱动
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Obsidian 知识库底层驱动与 Agent 智能体管理中枢
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              系统后端深度打通 <strong>Obsidian 知识库引擎</strong> 与 <strong>Agent 智能体</strong>。
              智能体全权负责 Obsidian Vault 的笔记生命周期管理、双链编译、Dataview 结构化抽取、Canvas 视觉流转图生成与 Git/Sync 同步，
              前端提供企业员工一体化的协作工作台与 Obsidian 客户端无缝双向连通。
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePingRestApi}
              disabled={isPingingApi}
              className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPingingApi ? 'animate-spin text-purple-400' : ''}`} />
              <span>{isPingingApi ? '正在测试 API...' : '测试 Obsidian REST API 连通'}</span>
            </button>

            <button
              onClick={() => handleOpenObsidianApp()}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition shadow-purple-950"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{copiedLink ? '已复制 obsidian:// 链接' : '在本地 Obsidian 中打开知识库'}</span>
            </button>
          </div>
        </div>

        {/* Live Obsidian Vault Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-purple-900/60 text-xs font-mono">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">Obsidian 知识库 (Vault)</span>
            <span className="font-bold text-purple-300 text-xs truncate block" title={config.vaultName}>
              {config.vaultName}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">Local REST API 网关</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 font-bold text-xs truncate">127.0.0.1:27123 (活跃)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">已加载 Obsidian 插件生态</span>
            <span className="text-slate-200 font-bold text-xs">
              {config.activePlugins.length} 个 (Dataview/Canvas/Git)
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">本地与移动端同步协议</span>
            <span className="text-indigo-300 font-bold text-xs truncate">{config.syncEngine}</span>
          </div>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('canvas')}
          className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-bold transition ${
            activeSubTab === 'canvas'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Obsidian Canvas 可视化白板 ({canvases.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dataview')}
          className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-bold transition ${
            activeSubTab === 'dataview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Dataview DQL 智能结构化抽取</span>
        </button>

        <button
          onClick={() => setActiveSubTab('api-gateway')}
          className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-bold transition ${
            activeSubTab === 'api-gateway'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Agent → Obsidian REST API 实时调用流水 ({apiLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('callouts')}
          className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-bold transition ${
            activeSubTab === 'callouts'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Obsidian 原生 Callouts & 双链语法</span>
        </button>
      </div>

      {/* View 1: Obsidian Canvas Interactive Studio */}
      {activeSubTab === 'canvas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Box className="w-5 h-5 text-purple-600" />
                <span>Obsidian Canvas (`.canvas`) 多维知识流转白板</span>
              </h3>
              <p className="text-xs text-slate-500">
                Agent 会自动将复杂的跨部门 Wiki 实体与原始素材组装成 Obsidian 原生的 Canvas 白板文件，支持卡片拖拽与关系连线。
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleAgentGenerateCanvas}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>智能体生成新 Canvas 白板</span>
              </button>

              <button
                onClick={() => handleOpenObsidianApp(activeCanvas.path)}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>在 Obsidian 中打开白板</span>
              </button>
            </div>
          </div>

          {/* Canvas Selector */}
          <div className="flex flex-wrap gap-2">
            {canvases.map(canvas => (
              <button
                key={canvas.id}
                onClick={() => setSelectedCanvasId(canvas.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-mono font-bold transition flex items-center space-x-1.5 ${
                  selectedCanvasId === canvas.id
                    ? 'bg-purple-900 text-purple-100 shadow-sm border border-purple-700'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-purple-400" />
                <span>{canvas.name}</span>
              </button>
            ))}
          </div>

          {/* Visual Canvas Canvas Mock / Interactive Board */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 min-h-[420px] relative overflow-hidden flex flex-col justify-between">
            {/* Canvas Header Info */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-4 border-b border-slate-800/80">
              <span className="text-purple-300 font-bold">{activeCanvas.title}</span>
              <span>节点数: {activeCanvas.nodes.length} · 连线数: {activeCanvas.edges.length} · {activeCanvas.updatedAt}</span>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 relative z-10">
              {activeCanvas.nodes.map(node => (
                <div
                  key={node.id}
                  style={{ borderColor: node.color || '#6366F1' }}
                  className="bg-slate-900/90 rounded-xl p-4 border-2 shadow-xl space-y-3 relative group hover:scale-[1.02] transition"
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{ backgroundColor: `${node.color}25`, color: node.color }}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-current"
                    >
                      {node.type === 'file' ? 'Obsidian Note' : node.type === 'group' ? 'Node Group' : 'Text Card'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">id: {node.id}</span>
                  </div>

                  {node.filePath && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-purple-300 font-bold truncate">
                        📄 {node.filePath}
                      </div>
                      <button
                        onClick={() => onNavigateToWikiPage(node.filePath!)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-sans"
                      >
                        <span>查看 Wiki 全文</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  )}

                  {node.text && (
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {node.text}
                    </pre>
                  )}

                  {node.label && (
                    <div className="text-xs font-bold text-emerald-400">
                      📁 {node.label}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Canvas Footer Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800/80">
              <span>Obsidian Canvas 规范 JSON 已同步写入本地 `.obsidian/canvases/`</span>
              <span className="text-purple-400">⚡ Agent 动态图谱与坐标算法已就绪</span>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Obsidian Dataview DQL Engine */}
      {activeSubTab === 'dataview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Table className="w-5 h-5 text-purple-600" />
              <span>Obsidian Dataview DQL 智能结构化抽取查询器</span>
            </h3>
            <p className="text-xs text-slate-500">
              无缝支持 Obsidian 社区最强大的 Dataview 查询语言 (DQL)。员工可通过标准 SQL 语法，秒级从全库 Markdown 的 Frontmatter 元数据中抽取结构化知识表格。
            </p>
          </div>

          {/* DQL Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESET_DATAVIEW_QUERIES.map(q => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQueryId(q.id);
                  setCustomDql(q.dql);
                  handleExecuteDataview(q.dql);
                }}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition ${
                  selectedQueryId === q.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {q.title}
              </button>
            ))}
          </div>

          {/* DQL Editor Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Dataview Query Language (DQL):</span>
              <button
                onClick={() => handleExecuteDataview()}
                disabled={isExecutingDql}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isExecutingDql ? 'animate-spin' : ''}`} />
                <span>{isExecutingDql ? '正在执行查询...' : '运行 DQL 查询 (Run)'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={customDql}
              onChange={e => setCustomDql(e.target.value)}
              className="w-full font-mono text-xs p-3.5 bg-slate-900 text-emerald-300 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-inner"
            />
          </div>

          {/* Dataview Dynamic Result Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-700">
                📊 Dataview 渲染结果 (返回 {queryResultRows.length} 行记录)：
              </span>
              <span className="font-mono text-[11px] text-purple-600">已由 Obsidian Dataview API 格式化</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">知识实体标题 (file.name)</th>
                    <th className="py-3 px-4">实体类型</th>
                    <th className="py-3 px-4">状态</th>
                    <th className="py-3 px-4">最近更新</th>
                    <th className="py-3 px-4">标签 (tags)</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {queryResultRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">{row.name}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-medium">{row.status}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{row.updated_at}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{row.tags}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onNavigateToWikiPage(row.path)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Agent -> Obsidian REST API Live Gateway Stream */}
      {activeSubTab === 'api-gateway' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-purple-600" />
                <span>智能体 (Agent) → Obsidian REST API 实时调用网关</span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                智能体在后台自动调用 Obsidian Local REST API 执行 CRUD、Canvas 组装与 Git 同步的毫秒级审计流水。
              </p>
            </div>
            <button
              onClick={handlePingRestApi}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>刷新流水</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiLogs.map(log => (
              <div
                key={log.id}
                className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">{log.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        log.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-300'
                          : log.method === 'POST'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {log.method}
                    </span>
                    <span className="text-purple-300">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">HTTP {log.status}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{log.latencyMs} ms</span>
                  </div>
                </div>

                <div className="text-slate-300 font-sans text-xs">
                  <strong className="text-white font-mono font-bold">Agent 任务：</strong>
                  {log.agentTask}
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg text-slate-400 text-[11px] truncate">
                  Response: <code className="text-emerald-400">{log.responsePayloadSummary}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Obsidian Callouts & Markdown Syntax Spec */}
      {activeSubTab === 'callouts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Obsidian 原生 Callout 提示块与高级语法呈现</span>
            </h3>
            <p className="text-xs text-slate-500">
              Agent 在生成 Wiki 笔记时，会自动注入标准 Obsidian Callout 标记（`&gt; [!NOTE]`, `&gt; [!WARNING]` 等），确保在 Obsidian 客户端与 Web 端均具备极高辨识度与优雅排版。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Note Callout */}
            <div className="border-l-4 border-blue-500 bg-blue-50/70 p-4 rounded-r-xl space-y-1">
              <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
                <span>ℹ️ [!NOTE] 核心业务备忘</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                全员适用的基础制度与常规说明，所有 Wiki 实体均由 Agent 自动遵循此语法规范。
              </p>
            </div>

            {/* Warning Callout */}
            <div className="border-l-4 border-amber-500 bg-amber-50/70 p-4 rounded-r-xl space-y-1">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                <span>⚠️ [!WARNING] 政策冲突与废止预警</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                当 Lint 引擎排查到疑似新旧条款冲突时，自动注入醒目预警并在自愈后打上废止标记。
              </p>
            </div>

            {/* Tip Callout */}
            <div className="border-l-4 border-emerald-500 bg-emerald-50/70 p-4 rounded-r-xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <span>💡 [!TIP] 提效与最佳实践建议</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                例如短视频黄金前 3 秒留存公式、微服务高并发限流最佳滑动窗口配置。
              </p>
            </div>

            {/* Example Callout */}
            <div className="border-l-4 border-purple-500 bg-purple-50/70 p-4 rounded-r-xl space-y-1">
              <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
                <span>📖 [!EXAMPLE] 实战案例文档参考</span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                关联引用 [[wiki/projects/ai-customer-service-2.md]] 等真实业务复盘纪要。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
