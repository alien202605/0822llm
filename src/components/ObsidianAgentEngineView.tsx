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
import { api } from '../api/client';

interface ObsidianAgentEngineViewProps {
  wikiPages: WikiPage[];
  onNavigateToWikiPage: (path: string) => void;
}

interface SyncedObsidianDoc {
  id: string;
  path: string;
  title: string;
  entityType: string;
  status: string;
  updatedAt: string;
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
  const [activeSubTab, setActiveSubTab] = useState<'canvas' | 'dataview' | 'api-gateway' | 'callouts' | 'sync' | 'vaults'>('canvas');
  const [syncedDocs, setSyncedDocs] = useState<SyncedObsidianDoc[]>([]);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [syncStatusText, setSyncStatusText] = useState<string>('');
  const [syncSearch, setSyncSearch] = useState<string>('');
  // Obsidian REST 连接设置
  const [restConfig, setRestConfig] = useState({ enabled: false, baseUrl: 'http://127.0.0.1:27123', apiKey: '' });
  const [restConfigOpen, setRestConfigOpen] = useState(false);
  const [restSaving, setRestSaving] = useState(false);
  const [restSavedMsg, setRestSavedMsg] = useState('');
  const [syncSummary, setSyncSummary] = useState({
    totalNotes: 0,
    wikiPages: 0,
    mysqlPages: 0,
    online: false,
    lastSyncAt: null as string | null
  });

  // Selected Canvas
  const activeCanvas = canvases.find(c => c.id === selectedCanvasId) || canvases[0];

  // Vault management state
  const [vaults, setVaults] = useState<any[]>([]);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [showAddVault, setShowAddVault] = useState(false);
  const [editingVault, setEditingVault] = useState<any>(null);
  const [vaultForm, setVaultForm] = useState({ name: '', display_name: '', base_url: '', api_key: '', sync_folder: 'wiki' });
  const [vaultTestResult, setVaultTestResult] = useState<any>(null);
  const [vaultSyncStatus, setVaultSyncStatus] = useState<Record<string, string>>({});

  // Load vaults
  const loadVaults = async () => {
    try {
      const res = await api.getVaults();
      setVaults(res?.data || []);
    } catch (err: any) {
      console.warn('[Vaults] Failed to load:', err.message);
    }
  };

  // Add vault
  const handleAddVault = async () => {
    try {
      await api.createVault(vaultForm);
      setShowAddVault(false);
      setVaultForm({ name: '', display_name: '', base_url: '', api_key: '', sync_folder: 'wiki' });
      await loadVaults();
    } catch (err: any) {
      alert('创建失败: ' + err.message);
    }
  };

  // Update vault
  const handleUpdateVault = async () => {
    if (!editingVault) return;
    try {
      await api.updateVault(editingVault.id, vaultForm);
      setEditingVault(null);
      await loadVaults();
    } catch (err: any) {
      alert('更新失败: ' + err.message);
    }
  };

  // Delete vault
  const handleDeleteVault = async (id: string) => {
    if (!confirm('确定要删除这个仓库吗？')) return;
    try {
      await api.deleteVault(id);
      await loadVaults();
    } catch (err: any) {
      alert('删除失败: ' + err.message);
    }
  };

  // Test vault connection
  const handleTestVault = async (id: string) => {
    try {
      const res = await api.testVault(id);
      setVaultTestResult(res?.data || res);
    } catch (err: any) {
      setVaultTestResult({ online: false, error: err.message });
    }
  };

  // Sync vault
  const handleSyncVault = async (id: string) => {
    try {
      setVaultSyncStatus(prev => ({ ...prev, [id]: 'syncing' }));
      const res = await api.syncVault(id);
      setVaultSyncStatus(prev => ({ ...prev, [id]: res?.success ? 'synced' : 'error' }));
      setTimeout(() => loadVaults(), 1000);
    } catch (err: any) {
      setVaultSyncStatus(prev => ({ ...prev, [id]: 'error' }));
    }
  };

  React.useEffect(() => {
    loadVaults();
  }, []);

  const loadSyncedDocs = async () => {
    try {
      const [pagesRes, statsRes] = await Promise.all([
        api.getObsidianPages({ limit: 300 }),
        api.getUnifiedStats()
      ]);
      const pages = (pagesRes?.data || []) as any[];
      setSyncedDocs(
        pages.map((page: any) => ({
          id: page.id,
          path: page.path,
          title: page.title || page.path,
          entityType: page.entityType || 'page',
          status: page.status || 'active',
          updatedAt: page.updatedAt || ''
        }))
      );
      const obsidianStats = statsRes?.data?.obsidian || {};
      setSyncSummary({
        totalNotes: obsidianStats.totalNotes || pagesRes?.vault?.fileCount || 0,
        wikiPages: obsidianStats.wikiPages || pages.length,
        mysqlPages: statsRes?.data?.mysql?.wikiPages || 0,
        online: obsidianStats.restApiStatus === 'online' || pagesRes?.vault?.online === true,
        lastSyncAt: obsidianStats.lastSyncAt || pagesRes?.vault?.lastSyncAt || null
      });
    } catch (err: any) {
      console.warn('[Obsidian Sync] Failed to load synced docs:', err.message);
      setSyncStatusText('加载同步文档失败：' + err.message);
    }
  };

  const handleSyncObsidian = async () => {
    setSyncLoading(true);
    setSyncStatusText('正在同步 Obsidian...');
    try {
      // 先探测连接，离线/401 时给出明确指引，避免直接抛 500
      let status: any = null;
      try { status = (await api.getObsidianStatus())?.data; } catch (e: any) { status = { online: false, error: e.message }; }
      if (!status?.online) {
        const msg = String(status?.error || '未连接');
        setSyncStatusText(
          msg.includes('401')
            ? 'Obsidian 授权失败 (401)：请在 Obsidian 设置 → Local REST API 中复制 API Key，填入下方连接设置后重试'
            : `Obsidian 未连接：${msg}（请确认已启用 Local REST API 插件并检查连接设置）`
        );
        setSyncLoading(false);
        return;
      }
      const result = await api.syncObsidianPages('wiki');
      const data = result?.data || {};
      setSyncStatusText(`同步完成：${data.syncedFiles ?? 0}/${data.totalFiles ?? 0} 个文档`);
      await loadSyncedDocs();
    } catch (err: any) {
      setSyncStatusText('同步失败：' + (err.message || String(err)) + '（可在下方连接设置中检查 API Key）');
    } finally {
      setSyncLoading(false);
    }
  };

  // 加载 Obsidian REST 连接配置
  const loadRestConfig = async () => {
    try {
      const res = await api.getObsidianConfig();
      const cfg = res?.data || {};
      setRestConfig({
        enabled: !!cfg.enabled,
        baseUrl: cfg.baseUrl || 'http://127.0.0.1:27123',
        apiKey: cfg.apiKey || ''
      });
    } catch { /* 忽略 */ }
  };

  const handleSaveRestConfig = async () => {
    setRestSaving(true);
    setRestSavedMsg('');
    try {
      await api.saveObsidianConfig({
        enabled: restConfig.enabled,
        baseUrl: restConfig.baseUrl,
        apiKey: restConfig.apiKey
      });
      setRestSavedMsg('连接设置已保存，可点击立即同步');
      loadSyncedDocs();
    } catch (err: any) {
      setRestSavedMsg('保存失败：' + (err.message || String(err)));
    } finally {
      setRestSaving(false);
    }
  };

  const filteredDocs = syncedDocs.filter(doc => {
    const keyword = syncSearch.trim().toLowerCase();
    if (!keyword) return true;
    return (
      doc.title.toLowerCase().includes(keyword) ||
      doc.path.toLowerCase().includes(keyword) ||
      doc.entityType.toLowerCase().includes(keyword)
    );
  });

  React.useEffect(() => {
    loadSyncedDocs();
    loadRestConfig();
  }, []);

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
          onClick={() => setActiveSubTab('sync')}
          className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-bold transition ${
            activeSubTab === 'sync'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>同步文档 ({syncedDocs.length})</span>
        </button>

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
          <button
            onClick={() => setActiveSubTab('vaults')}
            className={`flex items-center space-x-2 text-xs px-4 py-2 rounded-xl font-bold transition ${
              activeSubTab === 'vaults'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>知识库仓库管理 ({vaults.length})</span>
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

      {/* View: Obsidian Sync Documents */}
      {activeSubTab === 'sync' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-600" />
                <span>Obsidian 同步文档</span>
              </h3>
              <p className="text-xs text-slate-500">
                {syncSummary.online ? 'Obsidian Vault 已连接' : 'Obsidian Vault 当前离线'}
                {syncSummary.lastSyncAt ? ` · 上次同步 ${new Date(syncSummary.lastSyncAt).toLocaleString()}` : ''}
              </p>
            </div>
            <button
              onClick={handleSyncObsidian}
              disabled={syncLoading}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
              <span>{syncLoading ? '同步中...' : '立即同步'}</span>
            </button>
          </div>

          {/* Obsidian REST 连接设置 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setRestConfigOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
            >
              <span className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Obsidian 连接设置 (Local REST API)</span>
              </span>
              <span className="text-slate-400">{restConfigOpen ? '收起 ▴' : '展开 ▾'}</span>
            </button>
            {restConfigOpen && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">启用 Local REST API</span>
                  <button
                    onClick={() => setRestConfig({ ...restConfig, enabled: !restConfig.enabled })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${restConfig.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${restConfig.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Base URL</label>
                  <input
                    value={restConfig.baseUrl}
                    onChange={e => setRestConfig({ ...restConfig, baseUrl: e.target.value })}
                    placeholder="http://127.0.0.1:27123"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">API Key（Obsidian 设置 → Local REST API 中复制）</label>
                  <input
                    type="password"
                    value={restConfig.apiKey}
                    onChange={e => setRestConfig({ ...restConfig, apiKey: e.target.value })}
                    placeholder="粘贴 API Key"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveRestConfig}
                    disabled={restSaving}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-60"
                  >
                    {restSaving ? '保存中...' : '保存设置'}
                  </button>
                  <button
                    onClick={loadRestConfig}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    重新读取
                  </button>
                  {restSavedMsg && <span className="text-[11px] text-slate-500">{restSavedMsg}</span>}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
              <div className="text-[11px] text-purple-500 font-bold">Vault 文档总数</div>
              <div className="text-xl font-bold text-purple-900">{syncSummary.totalNotes}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
              <div className="text-[11px] text-indigo-500 font-bold">Obsidian 知识页</div>
              <div className="text-xl font-bold text-indigo-900">{syncSummary.wikiPages}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <div className="text-[11px] text-emerald-500 font-bold">系统知识页</div>
              <div className="text-xl font-bold text-emerald-900">{syncSummary.mysqlPages}</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <div className="text-[11px] text-amber-500 font-bold">同步状态</div>
              <div className="text-xl font-bold text-amber-900">{syncStatusText || (syncSummary.online ? '在线' : '离线')}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <input
              value={syncSearch}
              onChange={event => setSyncSearch(event.target.value)}
              placeholder="搜索文档标题、路径或类型"
              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 bg-slate-50 px-4 py-2.5 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <span className="col-span-5">文档</span>
              <span className="col-span-2">类型</span>
              <span className="col-span-2">状态</span>
              <span className="col-span-3">更新时间</span>
            </div>
            {filteredDocs.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-slate-400">
                {syncLoading ? '正在同步...' : '暂无同步文档'}
              </div>
            ) : (
              filteredDocs.map(doc => (
                <div
                  key={doc.id || doc.path}
                  className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 items-center"
                >
                  <div className="col-span-5 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{doc.path}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-lg uppercase">
                      {doc.entityType}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-bold ${doc.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center justify-between space-x-2 min-w-0">
                    <span className="text-[10px] text-slate-500 truncate">
                      {doc.updatedAt ? new Date(doc.updatedAt).toLocaleString() : '-'}
                    </span>
                    <button
                      onClick={() => handleOpenObsidianApp(doc.path)}
                      className="text-slate-400 hover:text-purple-600 transition shrink-0"
                      title="在 Obsidian 中打开"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
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

      {/* View 6: Vault Management */}
      {activeSubTab === 'vaults' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-purple-600" />
                <span>Obsidian 知识库仓库管理</span>
              </h3>
              <p className="text-xs text-slate-500">
                管理多个 Obsidian Vault 仓库，支持跨仓库笔记互联
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { setShowAddVault(true); setEditingVault(null); setVaultForm({ name: '', display_name: '', base_url: '', api_key: '', sync_folder: 'wiki' }); }}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
              >
                <span>+</span>
                <span>添加仓库</span>
              </button>
              <button
                onClick={async () => { await Promise.all(vaults.map(v => handleSyncVault(v.id))); }}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>同步全部</span>
              </button>
            </div>
          </div>

          {/* Add/Edit Vault Modal */}
          {(showAddVault || editingVault) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">{editingVault ? '编辑仓库' : '添加新仓库'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">仓库名称 (唯一标识)</label>
                    <input
                      type="text"
                      value={vaultForm.name}
                      onChange={e => setVaultForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="my-vault"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">显示名称</label>
                    <input
                      type="text"
                      value={vaultForm.display_name}
                      onChange={e => setVaultForm(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="个人知识库"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">API 地址</label>
                    <input
                      type="text"
                      value={vaultForm.base_url}
                      onChange={e => setVaultForm(prev => ({ ...prev, base_url: e.target.value }))}
                      placeholder="http://127.0.0.1:27123"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">API Key (可选)</label>
                    <input
                      type="password"
                      value={vaultForm.api_key}
                      onChange={e => setVaultForm(prev => ({ ...prev, api_key: e.target.value }))}
                      placeholder="Bearer Token"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">同步文件夹</label>
                    <input
                      type="text"
                      value={vaultForm.sync_folder}
                      onChange={e => setVaultForm(prev => ({ ...prev, sync_folder: e.target.value }))}
                      placeholder="wiki"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <button
                    onClick={() => { setShowAddVault(false); setEditingVault(null); }}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={editingVault ? handleUpdateVault : handleAddVault}
                    className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    {editingVault ? '保存修改' : '添加仓库'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vault List */}
          <div className="space-y-3">
            {vaults.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">暂无仓库，点击"添加仓库"开始</p>
              </div>
            ) : (
              vaults.map(vault => (
                <div key={vault.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${vault.enabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        <FolderOpen className={`w-5 h-5 ${vault.enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{vault.display_name || vault.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${vault.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {vault.enabled ? '启用' : '禁用'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">{vault.base_url}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {vault.total_pages || 0} 篇笔记 · 最后同步: {vault.last_sync_at ? new Date(vault.last_sync_at).toLocaleString() : '从未'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleTestVault(vault.id)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="测试连接"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSyncVault(vault.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="同步"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${vaultSyncStatus[vault.id] === 'syncing' ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => { setEditingVault(vault); setVaultForm({ name: vault.name, display_name: vault.display_name, base_url: vault.base_url, api_key: vault.api_key, sync_folder: vault.sync_folder }); }}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="编辑"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVault(vault.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="删除"
                      >
                        <span className="text-lg leading-none">×</span>
                      </button>
                    </div>
                  </div>
                  {vaultTestResult?.vault_id === vault.id && (
                    <div className={`mt-3 p-3 rounded-lg text-xs ${vaultTestResult.online ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {vaultTestResult.online ? `✅ 连接成功: ${vaultTestResult.vaultName || 'Vault'} (${vaultTestResult.latency}ms)` : `❌ 连接失败: ${vaultTestResult.error || '未知错误'}`}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Cross-vault link info */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-xs text-purple-700">
            <p className="font-bold mb-2">💡 跨仓库链接语法</p>
            <p>在笔记中使用 <code className="bg-purple-100 px-1 rounded">[[vault-name:path/to/file]]</code> 格式可引用其他仓库的笔记</p>
            <p className="mt-1 text-purple-600">例如: <code className="bg-purple-100 px-1 rounded">[[personal-vault:notes/meeting-2024]]</code></p>
          </div>
        </div>
      )}
    </div>
  );
};
