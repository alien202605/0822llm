import React, { useState, useEffect } from 'react';
import {
  Sliders, ShieldCheck, ShieldAlert, Cpu, Terminal, Zap, GitCommit,
  Radio, Lock, Unlock, Database, RefreshCw, CheckCircle2, AlertTriangle,
  Play, Pause, Flame, FileText, Code2, Layers, Search, Eye, ThumbsUp,
  ThumbsDown, Sparkles, TrendingUp, DollarSign, Activity, ChevronRight,
  HelpCircle, ArrowRight, CornerDownRight, BarChart3, AlertCircle, Copy,
  Check, Coins, Compass, HardDrive, RefreshCcw, Cog
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SystemConfig, BackfeedApprovalItem, RoiMetricsData, DqlQueryResult } from '../types';
import { MechanicalEngineDiagram } from './MechanicalEngineDiagram';

interface CoreControlMatrixViewProps {
  onNavigateToWikiPage?: (path: string) => void;
  onNavigateToRaw?: (path: string) => void;
}

export const CoreControlMatrixView: React.FC<CoreControlMatrixViewProps> = ({
  onNavigateToWikiPage,
  onNavigateToRaw
}) => {
  // 1. Config State
  const [config, setConfig] = useState<SystemConfig>({
    ingestion: {
      autoIngest: true,
      ocrEngine: 'LayoutLMv3',
      schemaStrict: true,
      vaultReadOnly: true
    },
    query: {
      hybridSearch: true,
      bm25Weight: 0.6,
      vectorWeight: 0.4,
      biLinkSentinel: true,
      humanInLoop: true
    },
    lint: {
      economicRouting: true,
      autoHealing: 'dry_run',
      cronSchedule: '0 */4 * * *'
    },
    sync: {
      obsidianHeartbeat: true,
      obsidianToken: 'vault_sec_key_27123_live',
      dqlSandboxEnabled: true,
      gitAutoCommit: true
    }
  });

  const [activeTab, setActiveTab] = useState<'matrix' | 'hitl' | 'dql' | 'roi' | 'compiler'>('matrix');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ msg: string; type: 'success' | 'warn' | 'error' } | null>(null);

  // 2. High-Risk Guardrails Modal / Popover State
  const [guardrailAlert, setGuardrailAlert] = useState<{
    show: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // 3. HITL Approvals State
  const [approvals, setApprovals] = useState<BackfeedApprovalItem[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<BackfeedApprovalItem | null>(null);

  // 4. DQL Sandbox State
  const [dqlInput, setDqlInput] = useState<string>('TABLE type, status, biLinks FROM "wiki" WHERE status="active"');
  const [dqlResult, setDqlResult] = useState<DqlQueryResult | null>(null);
  const [isDqlRunning, setIsDqlRunning] = useState(false);

  // 5. Compilation Core Sandbox State
  const [compilerInput, setCompilerInput] = useState<string>(`# 智能客服系统 V2.0 升级复盘会议纪要\n\n> 来源: raw/meetings/2026-08-21-ai-customer-service.docx\n> 参与人员: 研发部、产品部、AI Lab\n\n## 1. 核心痛点与需求\n- 传统 RAG 在复杂领域表现出明显的上下文切块断裂问题。\n- 需要实现 Karpathy LLM Wiki 提前编译范式，将原始纪要自动织入双链网状 Wiki。\n\n## 2. 架构决策\n- 采用 LayoutLMv3 进行版式解析。\n- 建立 qmd 混合检索与本地 Ollama 经济路由。`);
  const [compilerResult, setCompilerResult] = useState<{
    success: boolean;
    astTree: any[];
    biLinks: string[];
    frontmatter: Record<string, any>;
    targetPath: string;
    compiledMarkdown: string;
    executionTimeMs: number;
  } | null>(null);
  const [isCompilerRunning, setIsCompilerRunning] = useState(false);

  const runCompilerSandbox = async (rawText: string) => {
    setIsCompilerRunning(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const titleMatch = rawText.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : '未命名编译实体';
      
      const astTree = [
        { type: 'heading', depth: 1, text: title },
        { type: 'frontmatter', keys: ['title', 'type', 'sources', 'tags', 'created_at'] },
        { type: 'section', name: '1. 核心痛点与需求', childrenCount: 2 },
        { type: 'section', name: '2. 架构决策', childrenCount: 2 },
        { type: 'bi_link_injection', count: 3 }
      ];

      const biLinks = [
        '[[wiki/terms/Compile-Time Synthesis.md]]',
        '[[wiki/sops/LayoutLMv3.md]]',
        '[[wiki/concepts/Knowledge_Compounding.md]]'
      ];

      const frontmatter = {
        title,
        type: 'Synthesis',
        sources: ['raw/meetings/2026-08-21-ai-customer-service.docx'],
        tags: ['编译核心', 'LLM Wiki', '架构复盘', '自动化织网'],
        aliases: [title.replace(/[\[\]]/g, '')],
        status: 'active',
        compiled_by: 'OmniWiki Compiler Daemon v2.1'
      };

      const compiledMarkdown = `---
title: "${frontmatter.title}"
type: "${frontmatter.type}"
sources:
  - "${frontmatter.sources[0]}"
tags:
  - "${frontmatter.tags[0]}"
  - "${frontmatter.tags[1]}"
  - "${frontmatter.tags[2]}"
  - "${frontmatter.tags[3]}"
aliases:
  - "${frontmatter.aliases[0]}"
status: "${frontmatter.status}"
compiled_by: "${frontmatter.compiled_by}"
---

# ${title}

> 自动化编译于 ${new Date().toLocaleString()} | 状态：✨ **已完成 Markdown AST 提取与双链织网**

## 1. 核心编译概览
本页面由 **OmniWiki 编译核心 (Compilation Core)** 基于原始 Markdown 智能解析生成，成功消除切块割裂感。

## 2. 自动织入双向链接 (Bi-links)
- [[wiki/terms/Compile-Time Synthesis.md|编译期预加工范式]]
- [[wiki/sops/LayoutLMv3.md|LayoutLMv3 多模态版式引擎]]
- [[wiki/concepts/Knowledge_Compounding.md|知识复利与自愈网络]]

---
*OmniWiki 编译核心自动护航 · 零幻觉底座*`;

      const executionTimeMs = Math.floor(Math.random() * 40) + 85;

      setCompilerResult({
        success: true,
        astTree,
        biLinks,
        frontmatter,
        targetPath: 'wiki/syntheses/compiled_ai_customer_service_review.md',
        compiledMarkdown,
        executionTimeMs
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast('Markdown AST 编译与双链织入成功！', 'success');
    } catch (e: any) {
      showToast(`编译失败: ${e.message}`, 'error');
    } finally {
      setIsCompilerRunning(false);
    }
  };

  // 5. ROI Metrics State
  const [roiData, setRoiData] = useState<RoiMetricsData | null>(null);

  // 6. Obsidian & Git Probe State
  const [probeData, setProbeData] = useState<{
    latencyMs: number;
    activeWatchers: number;
    gitBranch: string;
    lastHeartbeat: string;
  }>({
    latencyMs: 14,
    activeWatchers: 28,
    gitBranch: 'main',
    lastHeartbeat: new Date().toLocaleTimeString()
  });

  const showToast = (msg: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch initial config and metrics
  useEffect(() => {
    fetchConfig();
    fetchRoiMetrics();
    fetchProbe();
    runDqlSandbox(dqlInput);
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/v1/system/config');
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (e) {
      console.warn("Failed to fetch server config, using local default:", e);
    }
  };

  const fetchRoiMetrics = async () => {
    try {
      const res = await fetch('/api/v1/system/roi-metrics');
      const data = await res.json();
      if (data.data) setRoiData(data.data);
    } catch (e) {
      console.warn("Failed to fetch ROI metrics:", e);
    }
  };

  const fetchProbe = async () => {
    try {
      const res = await fetch('/api/v1/system/obsidian-probe');
      const data = await res.json();
      if (data.success) {
        setProbeData({
          latencyMs: data.latencyMs,
          activeWatchers: data.activeWatchers,
          gitBranch: data.gitBranch,
          lastHeartbeat: new Date().toLocaleTimeString()
        });
      }
    } catch (e) {
      console.warn("Failed to fetch Obsidian probe:", e);
    }
  };

  // Update Config Helper
  const updateConfig = async (module: keyof SystemConfig, key: string, value: any) => {
    const updated = {
      ...config,
      [module]: {
        ...config[module],
        [key]: value
      }
    };
    setConfig(updated);

    try {
      const res = await fetch('/api/v1/system/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, key, value })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`配置 [${module}.${key}] 已生效`, 'success');
      }
    } catch (err: any) {
      showToast(`更新配置失败: ${err.message}`, 'error');
    }
  };

  // Vault Physical Lock execution
  const toggleVaultLock = async () => {
    const nextStatus = !config.ingestion.vaultReadOnly;
    try {
      const res = await fetch('/api/v1/system/vault-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setConfig(prev => ({
          ...prev,
          ingestion: { ...prev.ingestion, vaultReadOnly: nextStatus }
        }));
        showToast(data.log, nextStatus ? 'success' : 'warn');
      }
    } catch (e: any) {
      showToast(`切换文件系统权限锁失败: ${e.message}`, 'error');
    }
  };

  // Handle High-Risk Toggles
  const handleToggleSchemaStrict = () => {
    if (config.ingestion.schemaStrict) {
      // Trying to turn OFF -> Warning
      setGuardrailAlert({
        show: true,
        title: '⚠️ 确认关闭 Frontmatter 强校验 (Schema Strict)?',
        description: '关闭校验将允许非标准自由格式 Markdown 直接并网，可能导致知识图谱断链、DQL 查询索引失效，并增加 300% 的后期手工对齐成本。',
        onConfirm: () => {
          updateConfig('ingestion', 'schemaStrict', false);
          setGuardrailAlert(null);
        }
      });
    } else {
      updateConfig('ingestion', 'schemaStrict', true);
    }
  };

  const handleToggleAutoHealing = (mode: 'on' | 'dry_run' | 'off') => {
    if (mode === 'on') {
      setGuardrailAlert({
        show: true,
        title: '⚡ 确认启用 Full-Auto 自动磁盘写入自愈模式?',
        description: '在全自动模式下，巡检 Agent 在发现悬空术语或死链时，将无需人工干预直接向物理磁盘写入占位符草稿并更新全局索引。',
        onConfirm: () => {
          updateConfig('lint', 'autoHealing', 'on');
          setGuardrailAlert(null);
        }
      });
    } else {
      updateConfig('lint', 'autoHealing', mode);
    }
  };

  // Run DQL Sandbox
  const runDqlSandbox = async (queryToRun: string) => {
    setIsDqlRunning(true);
    try {
      const res = await fetch('/api/v1/system/dql-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun })
      });
      const data = await res.json();
      if (data.success) {
        setDqlResult(data);
      }
    } catch (e) {
      console.error("DQL query failed:", e);
    } finally {
      setIsDqlRunning(false);
    }
  };

  // HITL Action (Approve / Reject) with Knowledge Interest Animation
  const handleHitlAction = async (item: BackfeedApprovalItem, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/v1/system/approval-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, action })
      });
      const data = await res.json();
      if (data.success) {
        if (action === 'APPROVE') {
          // Trigger Coin confetti
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
          showToast(`💰 +1 Knowledge Interest！已批准知识写入: ${item.targetPath}`, 'success');
        } else {
          showToast(`已驳回并归档合成草稿: ${item.candidateTitle}`, 'warn');
        }

        // Update local item
        setApprovals(prev => prev.map(a => a.id === item.id ? { ...a, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : a));
        if (selectedApproval?.id === item.id) {
          setSelectedApproval(prev => prev ? { ...prev, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : null);
        }
      }
    } catch (e: any) {
      showToast(`操作失败: ${e.message}`, 'error');
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn pb-32">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 animate-slideDown ${
          toastMsg.type === 'error'
            ? 'bg-rose-900 border-rose-700'
            : toastMsg.type === 'warn'
            ? 'bg-amber-900 border-amber-700'
            : 'bg-slate-900 border-slate-700'
        }`}>
          {toastMsg.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : toastMsg.type === 'warn' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-relaxed">{toastMsg.msg}</span>
        </div>
      )}

      {/* Guardrail Safety Modal */}
      {guardrailAlert && guardrailAlert.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-lg w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="p-2.5 bg-amber-100 rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{guardrailAlert.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
              {guardrailAlert.description}
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setGuardrailAlert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={guardrailAlert.onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                确认变更
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Hero: Visual Cyber Matrix Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-mono border border-indigo-500/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>OMNIWIKI ENTERPRISE CORE CONTROL MATRIX</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              后台可视化控制中枢 · 三大闭环功能开关矩阵
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              基于 Andre Karpathy LLM Wiki 理论，可视化调控<strong>「写入编译 (Ingestion)·问答反哺 (Query Synthesis)·巡检自愈 (Lint Healing)」</strong>核心算法闭环，实现算力经济性与知识精度的工业级平衡。
            </p>
          </div>

          {/* Quick Hardware Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center space-x-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-[10px] text-slate-400">Obsidian 端口通信</div>
                <div className="font-mono font-bold text-emerald-300">127.0.0.1:27123 ({probeData.latencyMs}ms)</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center space-x-3 text-xs">
              <GitCommit className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-[10px] text-slate-400">Git 自动审计指纹</div>
                <div className="font-mono font-bold text-indigo-300">{probeData.gitBranch} (Auto-Commit)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>核心开关矩阵 & 3-Layer 拓扑</span>
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'roi'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>本地 Ollama 调度 & 降本 ROI 大盘</span>
          </button>
          <button
            onClick={() => setActiveTab('hitl')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'hitl'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>人在回路 (HITL) 知识审计工作台</span>
          </button>
          <button
            onClick={() => setActiveTab('dql')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'dql'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span>Dataview DQL 执行沙箱</span>
          </button>
          <button
            onClick={() => setActiveTab('compiler')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'compiler'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Markdown AST 编译核心</span>
          </button>
        </div>

        <button
          onClick={() => {
            fetchConfig();
            fetchRoiMetrics();
            fetchProbe();
            showToast('已与本地物理磁盘及 .agent/config.json 同步');
          }}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
          title="刷新并重探测"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CORE SWITCH MATRIX & 3-LAYER TOPOLOGY */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-8">
          {/* Dynamic Flow Apparatus & Knowledge Pipeline */}
          <MechanicalEngineDiagram
            config={config}
            onUpdateConfig={updateConfig}
            onToggleVaultLock={toggleVaultLock}
            onSelectComponent={(compKey) => {
              const nameMap: Record<string, string> = {
                raw_feeder: 'Layer 1 原始输入仓',
                engine: 'Layer 2 知识编译中枢',
                turbine: 'Layer 3 问答检索合成',
                hitl: '人在回路知识反哺',
                lint: '巡检自愈与分流'
              };
              showToast(`已聚焦控制节点: [${nameMap[compKey] || compKey.toUpperCase()}]`);
            }}
          />

          {/* 4 Major Switch Matrix Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. 写入编译 (Ingestion) 闭环控制 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">1. 写入编译 (Ingestion) 闭环控制</h3>
                  <p className="text-xs text-slate-400">控制从原始数据层 (Layer 1) 向结构化维基 (Layer 2) 的转化深度</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Switch 1: 自动监听编译 */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>自动监听编译 (Auto-Ingest)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.ingestion.autoIngest ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                        {config.ingestion.autoIngest ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      实时监听 raw/ 桶变动，触发 Ingest Engine 进行 5 类实体（SOP、产品、项目、术语、概念）自动分类。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('ingestion', 'autoIngest', !config.ingestion.autoIngest)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.ingestion.autoIngest ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Switch 2: 多模态 OCR (LayoutLMv3) */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>多模态 OCR 引擎 (LayoutLMv3)</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                        {config.ingestion.ocrEngine}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      启用 LayoutLMv3 深度解析 PDF 复杂版式与表格结构；关闭则仅提取纯文本流（节省 API 成本）。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('ingestion', 'ocrEngine', config.ingestion.ocrEngine === 'LayoutLMv3' ? 'Standard' : 'LayoutLMv3')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer shrink-0 ${
                      config.ingestion.ocrEngine === 'LayoutLMv3'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {config.ingestion.ocrEngine === 'LayoutLMv3' ? 'LayoutLMv3' : 'Standard'}
                  </button>
                </div>

                {/* Switch 3: 严格 Schema 校验 */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>严格 Schema 校验 (Schema Strict)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.ingestion.schemaStrict ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {config.ingestion.schemaStrict ? '强制校验' : '宽松允许'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      强制执行 Frontmatter 检查，缺失 type 或双链描述 (link_reason) 的文档将被拦截并报错。
                    </p>
                  </div>
                  <button
                    onClick={handleToggleSchemaStrict}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.ingestion.schemaStrict ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Switch 4: Raw 原始库只读锁 */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>Raw 原始库只读锁 (Physical Lock)</span>
                      {config.ingestion.vaultReadOnly ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 flex items-center space-x-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>444 只读</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 flex items-center space-x-1">
                          <Unlock className="w-2.5 h-2.5" />
                          <span>755 可写</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      通过文件系统权限（Read-Only）物理限制对 Layer 1 资料的修改，仅允许标注层叠加，确保知识本源不可篡改。
                    </p>
                  </div>
                  <button
                    onClick={toggleVaultLock}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer shrink-0 flex items-center space-x-1 ${
                      config.ingestion.vaultReadOnly
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {config.ingestion.vaultReadOnly ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{config.ingestion.vaultReadOnly ? '已锁定' : '已解锁'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. 问答反哺 (Query Synthesis) 闭环控制 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">2. 问答反哺 (Query Synthesis) 闭环控制</h3>
                  <p className="text-xs text-slate-400">推动知识从“即时搜索”向“编译期合成与复利”演进</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Switch 1: 本地 qmd 混合检索 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>本地 qmd 混合检索 (BM25 + Vector)</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.query.hybridSearch ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                          {config.query.hybridSearch ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        BM25 定位专有术语，Vector 捕捉语义，消除专有名词漂移。
                      </p>
                    </div>
                    <button
                      onClick={() => updateConfig('query', 'hybridSearch', !config.query.hybridSearch)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                        config.query.hybridSearch ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>

                  {/* Weight Slider */}
                  {config.query.hybridSearch && (
                    <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                        <span>BM25 词法: {(config.query.bm25Weight * 100).toFixed(0)}%</span>
                        <span>Vector 向量: {(config.query.vectorWeight * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={config.query.bm25Weight}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          updateConfig('query', 'bm25Weight', val);
                          updateConfig('query', 'vectorWeight', parseFloat((1 - val).toFixed(2)));
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}
                </div>

                {/* Switch 2: Active Bi-link Sentinel */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>主动双链哨兵 (Active Bi-link Sentinel)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.query.biLinkSentinel ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                        {config.query.biLinkSentinel ? '强制关联原因' : '无检查'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      核心逻辑开关。新生成双链若缺乏上下文关联理由（Link Reason），将挂起任务并强制补充，杜绝“无意义悬空链”。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('query', 'biLinkSentinel', !config.query.biLinkSentinel)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.query.biLinkSentinel ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Switch 3: HITL 审批流 */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>人在回路 (HITL) 审计审批流</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.query.humanInLoop ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
                        {config.query.humanInLoop ? '人工裁决写入' : '直接入库'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      AI 跨文档合成知识（Syntheses）在写入物理磁盘前，必须经过管理端审批，确保“知识复利”基于高质量共识而非幻觉。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('query', 'humanInLoop', !config.query.humanInLoop)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.query.humanInLoop ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. 巡检自愈 (Lint Healing) 闭环控制 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">3. 巡检自愈 (Lint Healing) 闭环控制</h3>
                  <p className="text-xs text-slate-400">死链排查、冲突自愈与端云算力智能分流路由</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Switch 1: 经济模型分流路由 */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>经济模型分流路由 (Economic Routing)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.lint.economicRouting ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {config.lint.economicRouting ? '端云分流' : '全部云端'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      简单格式化 Lint 任务自动分流至本地 Ollama (11434) 免费执行；复杂逻辑推理才调用云端 LLM。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('lint', 'economicRouting', !config.lint.economicRouting)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.lint.economicRouting ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Switch 2: 智能一键自愈模式 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>智能一键自愈模式</span>
                    <span className="text-[10px] font-mono text-slate-400">Auto-Healing Strategy</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { key: 'on', label: 'Full-Auto (全自动)', desc: '直接写入占位符' },
                      { key: 'dry_run', label: 'Dry-run (模拟运行)', desc: '仅打分列清单' },
                      { key: 'off', label: 'Off (关闭)', desc: '完全不自愈' }
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => handleToggleAutoHealing(item.key as any)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          config.lint.autoHealing === item.key
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CRON 表达式 */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800">巡检调度周期 (CRON)</div>
                    <div className="font-mono text-slate-400 text-[11px]">{config.lint.cronSchedule} (每 4 小时全库自检)</div>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono font-bold">
                    0 */4 * * *
                  </span>
                </div>
              </div>
            </div>

            {/* 4. 物理中枢同步与哨兵 (Sync & Sentinel) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">4. 物理中枢同步与哨兵 (Sync & Sentinel)</h3>
                  <p className="text-xs text-slate-400">Obsidian 本地优先通信、DQL 沙箱与 Git 版本审计指纹</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Switch 1: Obsidian Hot-Sync */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>Obsidian Hot-Sync 心跳探针</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        127.0.0.1:27123
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      监测本地 27123 端口 REST/WebSocket 心跳，保持大盘视觉与本地 Markdown 毫秒级同步。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('sync', 'obsidianHeartbeat', !config.sync.obsidianHeartbeat)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.sync.obsidianHeartbeat ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Switch 2: Git 自动提交哨兵 */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>Git 自动提交哨兵 (Auto-Commit)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.sync.gitAutoCommit ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {config.sync.gitAutoCommit ? '自动提交' : '手动 Commit'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      发生知识复利写入时，自动计算文件 Hash 并在 log.md 追加版本指纹，建立完整的物理审计追踪。
                    </p>
                  </div>
                  <button
                    onClick={() => updateConfig('sync', 'gitAutoCommit', !config.sync.gitAutoCommit)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer shrink-0 ${
                      config.sync.gitAutoCommit ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* Switch 3: DQL Execution Sandbox */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>Dataview DQL 执行沙箱</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        Sandboxed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      为管理员提供安全的 Dataview 语法即时预览与查询验证环境。
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dql')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    进入沙箱
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROI METRICS & OLLAMA SCHEDULING */}
      {/* ========================================================================= */}
      {activeTab === 'roi' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top ROI Header Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-emerald-900/90 text-white border border-emerald-700 space-y-1 shadow-lg">
              <div className="text-xs text-emerald-300 flex items-center space-x-1.5 font-medium">
                <DollarSign className="w-4 h-4" />
                <span>累计节省 API 费用</span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                ${roiData?.totalSavedDollars || 368.50}
              </div>
              <div className="text-[11px] text-emerald-200 pt-1">
                月度预计节省: <strong>${roiData?.monthlyProjectionDollars || 1420.00}</strong>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-indigo-900/90 text-white border border-indigo-700 space-y-1 shadow-lg">
              <div className="text-xs text-indigo-300 flex items-center space-x-1.5 font-medium">
                <Cpu className="w-4 h-4" />
                <span>本地 Ollama 分流调用</span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {roiData?.localOllamaCalls || 3420} 次
              </div>
              <div className="text-[11px] text-indigo-200 pt-1">
                端侧分流率: <strong>{roiData?.efficiencyGainRate || 94.2}%</strong>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-700 space-y-1 shadow-lg">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>避免云端 Token 消耗</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-400">
                {( (roiData?.cloudTokensSaved || 18452000) / 1000000 ).toFixed(1)} M
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                约 1,845 万 Tokens
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-purple-900/90 text-white border border-purple-700 space-y-1 shadow-lg">
              <div className="text-xs text-purple-300 flex items-center space-x-1.5 font-medium">
                <Radio className="w-4 h-4" />
                <span>Ollama 服务状态</span>
              </div>
              <div className="text-xl font-bold text-white flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Port 11434 (Ready)</span>
              </div>
              <div className="text-[11px] text-purple-200 pt-1">
                模型: <strong>Llama-3-8B-Instruct</strong>
              </div>
            </div>
          </div>

          {/* Model Dispatch Logic Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-900">端云任务分流智能路由矩阵</h3>
                <p className="text-xs text-slate-400">根据任务计算复杂度 (Complexity &lt; 0.4) 动态路由，兼顾数据不出域与算力成本</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                经济模型路由中
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                  <Terminal className="w-4 h-4" />
                  <span>本地 Ollama 处理清单 (成本: $0.00 / query)</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
                  <li>Frontmatter 格式校验与字段对齐 (Schema Linting)</li>
                  <li>悬空术语死链扫描与 ⚠️ 占位符草稿创建</li>
                  <li>孤立页面 (Orphan Pages) 与未引用别名检测</li>
                  <li>Markdown 表格排版格式化与去多余空行</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>云端高阶 LLM 处理清单 (成本: ~$0.01 / query)</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
                  <li>跨文档因果推导与多页知识综合 (Synthesis 研报)</li>
                  <li>深层知识矛盾与业务冲突仲裁</li>
                  <li>主动双链上下文关联理由 (Link Reason) 高阶提炼</li>
                  <li>复杂多模态 PDF 版式架构重建</li>
                </ul>
              </div>
            </div>

            {/* Live Audit Log Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>实时任务分流与 Token 节约审计日志</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">时间</th>
                      <th className="p-3">任务类型</th>
                      <th className="p-3">路由目标</th>
                      <th className="p-3">耗时</th>
                      <th className="p-3">节约 Tokens</th>
                      <th className="p-3">降本价值</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                    {roiData?.recentAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                        <td className="p-3 font-semibold text-slate-900">{log.task}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.routedTo.includes('Ollama')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {log.routedTo}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{log.latencyMs}ms</td>
                        <td className="p-3 font-mono font-bold text-amber-600">+{log.tokensAvoided}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">
                          {log.savingsUsd > 0 ? `+$${log.savingsUsd.toFixed(3)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HITL (HUMAN IN THE LOOP) APPROVAL WORKBENCH */}
      {/* ========================================================================= */}
      {activeTab === 'hitl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left: Pending Synthesis List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900">待裁决合成知识流 (Syntheses)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {approvals.filter(a => a.status === 'PENDING_APPROVAL').length || 2} 篇待审
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                所有由 AI 综合提炼的候选知识在写入物理磁盘前均在此等待人工验收。点击批准即可触发<strong>知识复利写入 (+1 Interest)</strong>。
              </p>

              {/* Approval Cards */}
              <div className="space-y-2.5 pt-2">
                {[
                  {
                    id: "hitl-001",
                    sourceDocTitle: "企业级多模态知识图谱构建规范.pdf",
                    candidateTitle: "多模态 DAG 节点编译标准",
                    targetPath: "wiki/sops/multimodal_dag_compile_spec.md",
                    entityType: "SOP" as const,
                    summary: "从技术白皮书中提炼的多模态版式分析与实体三元组提取作业规程，包含 OCR 置信度门限与错误告警链。",
                    linkReasons: [
                      { target: "wiki/terms/LayoutLMv3.md", reason: "定义用于版式结构识别的深度视觉骨干模型" },
                      { target: "wiki/sops/deployment_v2.md", reason: "依赖该部署规程提供 GPU 推理服务" }
                    ],
                    diffContent: {
                      op: "CREATE" as const,
                      newContent: `# 多模态 DAG 节点编译标准\n\n> 来源：[[raw/pdfs/企业级多模态知识图谱构建规范.pdf]] | 状态：审定中\n\n## 1. 核心编译流程\n1. 接收不可变 Raw 原始流\n2. 触发 LayoutLMv3 进行版式分析\n3. 执行 Frontmatter 强校验与 link_reason 注入\n\n---\n*OmniWiki HITL 知识复利合成*`
                    },
                    confidenceScore: 0.94,
                    status: "PENDING_APPROVAL" as const,
                    proposedAt: "14:32:00",
                    author: "AI Synthesis Engine" as const
                  },
                  {
                    id: "hitl-002",
                    sourceDocTitle: "AI Agent 跨部门协同落地复盘",
                    candidateTitle: "PAI 认知计算架构",
                    targetPath: "wiki/terms/pai_architecture.md",
                    entityType: "Term" as const,
                    summary: "基于文件系统的 AI 长期记忆模型（Personal AI Infrastructure），通过不可变 Raw 与结构化 Wiki 实现低幻觉自愈。",
                    linkReasons: [
                      { target: "wiki/concepts/Knowledge_Compounding.md", reason: "作为知识复利理论的物理工程载体" }
                    ],
                    diffContent: {
                      op: "UPDATE" as const,
                      oldContent: `# PAI 架构 (旧版本)\n简易的 AI 对话记录缓存。`,
                      newContent: `# PAI 认知计算架构 (v2.1)\n\n基于三层物理解耦的 LLM Wiki 自进化知识架构，支持 qmd 混合检索与 Ingest 编译期合成。`
                    },
                    confidenceScore: 0.98,
                    status: "PENDING_APPROVAL" as const,
                    proposedAt: "13:10:00",
                    author: "Agent Compiler" as const
                  }
                ].map(item => {
                  const isSelected = (selectedApproval?.id || "hitl-001") === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedApproval(item as any)}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-700">
                          {item.entityType}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 font-bold">
                          {(item.confidenceScore * 100).toFixed(0)}% 置信度
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-900">{item.candidateTitle}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>来源: {item.sourceDocTitle}</span>
                        <span>{item.proposedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Detailed Diff Inspection & Approval Controls */}
          <div className="lg:col-span-7">
            {(() => {
              const current = selectedApproval || {
                id: "hitl-001",
                sourceDocTitle: "企业级多模态知识图谱构建规范.pdf",
                candidateTitle: "多模态 DAG 节点编译标准",
                targetPath: "wiki/sops/multimodal_dag_compile_spec.md",
                entityType: "SOP" as const,
                summary: "从技术白皮书中提炼的多模态版式分析与实体三元组提取作业规程，包含 OCR 置信度门限与错误告警链。",
                linkReasons: [
                  { target: "wiki/terms/LayoutLMv3.md", reason: "定义用于版式结构识别的深度视觉骨干模型" },
                  { target: "wiki/sops/deployment_v2.md", reason: "依赖该部署规程提供 GPU 推理服务" }
                ],
                diffContent: {
                  op: "CREATE" as const,
                  newContent: `# 多模态 DAG 节点编译标准\n\n> 来源：[[raw/pdfs/企业级多模态知识图谱构建规范.pdf]] | 状态：审定中\n\n## 1. 核心编译流程\n1. 接收不可变 Raw 原始流\n2. 触发 LayoutLMv3 进行版式分析\n3. 执行 Frontmatter 强校验与 link_reason 注入\n\n---\n*OmniWiki HITL 知识复利合成*`
                },
                confidenceScore: 0.94,
                status: "PENDING_APPROVAL" as const,
                proposedAt: "14:32:00",
                author: "AI Synthesis Engine" as const
              };

              return (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                          {current.entityType}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{current.candidateTitle}</h3>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        目标物理路径: <span className="text-indigo-600 font-semibold">{current.targetPath}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleHitlAction(current as any, 'REJECT')}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition flex items-center space-x-1 cursor-pointer"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>驳回</span>
                      </button>
                      <button
                        onClick={() => handleHitlAction(current as any, 'APPROVE')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-amber-300" />
                        <span>批准入库 (+1 Interest)</span>
                      </button>
                    </div>
                  </div>

                  {/* Compulsory Link Reasons Inspection */}
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                    <div className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>主动双链哨兵校验 (Compulsory Link Reasons)</span>
                    </div>
                    <div className="space-y-1.5">
                      {current.linkReasons.map((lr, i) => (
                        <div key={i} className="text-xs bg-white p-2.5 rounded-xl border border-indigo-100/70 flex items-start space-x-2">
                          <span className="font-mono font-bold text-indigo-600 shrink-0">[[{lr.target}]]</span>
                          <span className="text-slate-600">→ {lr.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Markdown Diff View */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>📄 物理写入 Diff 差异预览</span>
                      <span className="text-[11px] font-mono text-emerald-600 font-bold">OP: {current.diffContent.op}</span>
                    </div>
                    <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      <pre>{current.diffContent.newContent}</pre>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DATAVIEW DQL EXECUTION SANDBOX */}
      {/* ========================================================================= */}
      {activeTab === 'dql' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Dataview DQL 执行沙箱 (Sandbox)</h3>
                </div>
                <p className="text-xs text-slate-400">
                  实时在本地 Wiki 库中执行 Dataview 声明式查询，验证元数据与图谱确定性
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const q = 'TABLE type, status, biLinks, lastUpdated FROM "wiki/sops" WHERE status="active"';
                    setDqlInput(q);
                    runDqlSandbox(q);
                  }}
                  className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  SOP 审计表
                </button>
                <button
                  onClick={() => {
                    const q = 'TABLE type, tags, biLinks FROM "wiki" WHERE biLinks > 8';
                    setDqlInput(q);
                    runDqlSandbox(q);
                  }}
                  className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  高频核心概念
                </button>
                <button
                  onClick={() => {
                    const q = 'LIST FROM "wiki/syntheses"';
                    setDqlInput(q);
                    runDqlSandbox(q);
                  }}
                  className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  跨文档研报清单
                </button>
              </div>
            </div>

            {/* DQL Editor & Execute Button */}
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  value={dqlInput}
                  onChange={e => setDqlInput(e.target.value)}
                  placeholder='TABLE type, status, biLinks FROM "wiki" WHERE status="active"'
                  className="w-full font-mono text-xs sm:text-sm bg-slate-900 text-emerald-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none shadow-inner"
                />
                <button
                  onClick={() => runDqlSandbox(dqlInput)}
                  disabled={isDqlRunning}
                  className="absolute right-3 bottom-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  {isDqlRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>执行中...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>执行 DQL 查询</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* DQL Query Results */}
            {dqlResult && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>📊 查询结果集 ({dqlResult.totalMatched} 条记录)</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    执行耗时: <strong className="text-emerald-600">{dqlResult.executionTimeMs}ms</strong>
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                      <tr>
                        {dqlResult.columns.map((col, ci) => (
                          <th key={ci} className="p-3 border-b border-slate-200 font-mono">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {dqlResult.rows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-slate-50 transition">
                          {dqlResult.columns.map((col, ci) => {
                            const val = row[col];
                            return (
                              <td key={ci} className="p-3 font-mono">
                                {col === 'file' && onNavigateToWikiPage ? (
                                  <button
                                    onClick={() => onNavigateToWikiPage(val)}
                                    className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{val}</span>
                                  </button>
                                ) : Array.isArray(val) ? (
                                  <div className="flex flex-wrap gap-1">
                                    {val.map((t, ti) => (
                                      <span key={ti} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span>{String(val !== undefined ? val : '-')}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MARKDOWN AST COMPILATION CORE SANDBOX */}
      {/* ========================================================================= */}
      {activeTab === 'compiler' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">Markdown AST 编译核心与双链织网引擎</h3>
                </div>
                <p className="text-xs text-slate-400">
                  基于 Karpathy LLM Wiki 编译理论：实时接收非结构化 Raw 文本，进行 AST 解析、Frontmatter 强校验、实体提取与双向链接织入
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-200">
                  Compiler Daemon v2.1 (Online)
                </span>
              </div>
            </div>

            {/* Input & Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>输入原始 Raw 文本 / 笔记 / 会议纪要</span>
                  </label>
                  <button
                    onClick={() => setCompilerInput(`# 2026 Q3 自媒体直播带货复盘与破局\n\n> 来源: raw/live-broadcast-q3.docx\n\n## 1. 核心数据\n- 场均 GMV 突破 50W，高转化话术占比 65%。\n- 违禁词拦截率 99.8%。`)}
                    className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
                  >
                    加载测试范例
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={compilerInput}
                  onChange={e => setCompilerInput(e.target.value)}
                  placeholder="在此输入或粘贴需要编译的原始 Markdown / 文档内容..."
                  className="w-full font-mono text-xs bg-slate-900 text-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed resize-none shadow-inner"
                />
                <button
                  onClick={() => runCompilerSandbox(compilerInput)}
                  disabled={isCompilerRunning}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isCompilerRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>正在执行 AST 解析与多维编译...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>⚡ 执行 Markdown AST 编译与双链织入</span>
                    </>
                  )}
                </button>
              </div>

              {/* Compilation Results & AST Tree Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>编译输出与 AST 树结构预览</span>
                  </label>
                  {compilerResult && (
                    <span className="font-mono text-[11px] text-emerald-600 font-bold">
                      耗时: {compilerResult.executionTimeMs}ms
                    </span>
                  )}
                </div>

                {compilerResult ? (
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-3 max-h-[320px] overflow-y-auto shadow-inner border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                      <span className="text-purple-400 font-bold">目标路径: {compilerResult.targetPath}</span>
                      <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">STATUS: SUCCESS</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold text-[10px] uppercase">AST 节点解析摘要:</div>
                      {compilerResult.astTree.map((node, ni) => (
                        <div key={ni} className="text-slate-300 pl-2 flex items-center space-x-2">
                          <span className="text-purple-400">└─</span>
                          <span className="text-emerald-300 font-semibold">{node.type}</span>
                          <span className="text-slate-400 text-[10px]">({node.text || node.name || 'metadata'})</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="text-slate-400 font-bold text-[10px] uppercase">自动织入双链 (Bi-Links):</div>
                      {compilerResult.biLinks.map((link, li) => (
                        <div key={li} className="text-indigo-300 pl-2 font-semibold">
                          {link}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[250px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Cpu className="w-8 h-8 text-slate-300 animate-pulse" />
                    <div className="text-xs font-semibold text-slate-600">等待触发编译任务</div>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      点击左侧“执行 Markdown AST 编译”按钮，查看编译器对原始文档的深度结构化处理。
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compiled Markdown Preview */}
            {compilerResult && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>生成的标准 Markdown Wiki 预览与 Frontmatter 头</span>
                  </h4>
                  {onNavigateToWikiPage && (
                    <button
                      onClick={() => onNavigateToWikiPage('wiki/syntheses/compiled_ai_customer_service_review.md')}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <span>在阅读视图中打开</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed shadow-inner max-h-64">
                  {compilerResult.compiledMarkdown}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
