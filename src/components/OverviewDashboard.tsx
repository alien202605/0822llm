import React from 'react';
import {
  FileText,
  BookOpen,
  Search,
  Activity,
  Layers,
  Sparkles,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
  Cpu,
  Database,
  Terminal,
  Cog
} from 'lucide-react';
import { RawDocument, WikiPage, LogEntry, LintIssue, TabType } from '../types';

interface OverviewDashboardProps {
  rawDocs: RawDocument[];
  wikiPages: WikiPage[];
  logs: LogEntry[];
  lintIssues: LintIssue[];
  healthScore: number;
  onNavigateTab: (tab: TabType) => void;
  onNavigateToWikiPage: (path: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  rawDocs,
  wikiPages,
  logs,
  lintIssues,
  healthScore,
  onNavigateTab,
  onNavigateToWikiPage
}) => {
  // Count total cross links
  const totalLinks = wikiPages.reduce((acc, p) => acc + p.outgoingLinks.length, 0);
  const totalWords = wikiPages.reduce((acc, p) => acc + p.wordCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Production Cluster
            </span>
            <span className="text-xs text-slate-400">| 本地 Git 仓库状态: Clean</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">企业级 LLM Wiki 知识拓扑与运行总览</h2>
          <p className="text-xs text-slate-300">
            无基础设施负担、自动多页编织编译、支持数千篇规模扩展的企业“活字典”
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('raw')}
            className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-2 rounded-xl shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>执行 Ingest 编译</span>
          </button>
          <button
            onClick={() => onNavigateTab('search')}
            className="flex items-center space-x-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-2 rounded-xl shadow-md transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>`qmd` 混合问答</span>
          </button>
          <button
            onClick={() => onNavigateTab('lint')}
            className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>Lint 自愈体检</span>
          </button>
        </div>
      </div>

      {/* 4 Core Vital Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Raw Layer */}
        <div
          onClick={() => onNavigateTab('raw')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              Layer 1: raw/
            </span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{rawDocs.length}</span>
            <span className="text-xs text-slate-400">份原始文件</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>不可变事实库</span>
            <span className="text-emerald-600 font-medium flex items-center">
              查看 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Stat 2: Wiki Entities */}
        <div
          onClick={() => onNavigateTab('wiki')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
              Layer 2: wiki/
            </span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{wikiPages.length}</span>
            <span className="text-xs text-slate-400">篇标准实体</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>5大结构化实体分类</span>
            <span className="text-blue-600 font-medium flex items-center">
              浏览 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Stat 3: Graph Cross-links */}
        <div
          onClick={() => onNavigateTab('graph')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-sm space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
              Obsidian Graph
            </span>
            <GitBranch className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{totalLinks}</span>
            <span className="text-xs text-slate-400">条双向链接</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>双链密度: {(totalLinks / (wikiPages.length || 1)).toFixed(1)}/篇</span>
            <span className="text-indigo-600 font-medium flex items-center">
              图谱 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Stat 4: System Health Score */}
        <div
          onClick={() => onNavigateTab('lint')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-400 shadow-sm space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
              Engine 3: Lint
            </span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600">{healthScore}</span>
            <span className="text-xs text-slate-400">/ 100 综合分</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-slate-600">待自愈问题: {lintIssues.filter(i => !i.fixed).length} 项</span>
            <span className="text-rose-600 font-medium flex items-center">
              自愈 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* System Topology Blueprint Canvas */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>3 层存储 × 3 大引擎 × 2 类交互终端 架构拓扑</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              点击下方任一引擎或层级，可直达对应执行与交互工作台
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg border border-slate-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>qmd Hybrid 引擎在线 (BM25+Vector)</span>
            </span>
          </div>
        </div>

        {/* System Ingestion Bridge Banner for Core Control Matrix */}
        <div
          onClick={() => onNavigateTab('console')}
          className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 hover:border-amber-500/60 border border-indigo-500/50 rounded-2xl p-4 cursor-pointer transition flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/50 group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition">
              <Cog className="w-5 h-5 animate-spin [animation-duration:10s]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">
                  知识动力总成 · 机械化管线与齿轮发动机控制中枢 (Control Matrix)
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  高压液压管线 + 活塞齿轮组 + 物理权限锁
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                以机械装备发动机的形式，实时可视化调控 <strong>不可变输入仓 · 多模态编织引擎 · 问答反哺涡轮 · HITL熔铸室 · 自愈泵</strong> 算法流水线
              </p>
            </div>
          </div>

          <button className="text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl transition shrink-0 flex items-center space-x-1 shadow-md">
            <span>启动机械中枢</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* System Ingestion Bridge Banner for Obsidian Vault & Agent Driver */}
        <div
          onClick={() => onNavigateTab('obsidian')}
          className="bg-purple-950/60 hover:bg-purple-950/80 border border-purple-500/40 rounded-2xl p-4 cursor-pointer transition flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">
                  Obsidian 知识库底层驱动 (Obsidian Local REST API & Agent 引擎)
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                  Dataview + Canvas 已就绪
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                前端作为企业用户操作界面，后端由 Agent 智能体驱动 Obsidian Vault 笔记 CRUD、Dataview DQL 抽取与 Canvas 拓扑白板
              </p>
            </div>
          </div>

          <button className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition shrink-0 flex items-center space-x-1">
            <span>进入 Obsidian 驱动工作台</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* System Ingestion Bridge Banner for Workstation Shared Drive */}
        <div
          onClick={() => onNavigateTab('drive')}
          className="bg-indigo-950/60 hover:bg-indigo-950/80 border border-indigo-500/40 rounded-2xl p-4 cursor-pointer transition flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">
                  企业全员工位工作共享盘 (Z: 盘 / SMB / Sync Daemon) 已接入
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  局域网自动同步中
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                支持软件公司（架构RFC、代码规范、API契约）与新媒体公司（爆款视频脚本、文案拆解、视觉VI）散落素材随手保存、自动汇聚并网
              </p>
            </div>
          </div>

          <button className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shrink-0 flex items-center space-x-1">
            <span>进入工作共享盘中心</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Topology Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Node 1: Ingest Pipeline */}
          <div
            onClick={() => onNavigateTab('raw')}
            className="group relative bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 p-5 rounded-2xl space-y-4 cursor-pointer transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold">
                01
              </div>
              <span className="text-[11px] text-emerald-300 font-mono px-2 py-0.5 bg-emerald-950 rounded border border-emerald-800">
                Layer 1 → Ingest
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                Ingest 摄入编译引擎
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                新文档入 <code className="text-emerald-300">raw/</code> → LLM 读取多页编织 → 生成/修改 5-15 个 Wiki 页 → 自动触发 <code className="text-indigo-300">qmd update</code>。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400">
              <span>当前汇聚 {rawDocs.length} 份原始文件</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Node 2: Query & Synthesis Pipeline */}
          <div
            onClick={() => onNavigateTab('search')}
            className="group relative bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-400 p-5 rounded-2xl space-y-4 cursor-pointer transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold">
                02
              </div>
              <span className="text-[11px] text-indigo-300 font-mono px-2 py-0.5 bg-indigo-950 rounded border border-indigo-800">
                qmd → Query & Backfeed
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                Query 检索与知识反哺
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                自然语言提问 → <code className="text-indigo-300">qmd search</code> 混合召回 Top-K → 忠实溯源回答 → <strong>Two-Output 反哺写回 Synthesis</strong>。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400">
              <span>BM25 + 向量毫秒级召回</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Node 3: Lint & Self-Healing Pipeline */}
          <div
            onClick={() => onNavigateTab('lint')}
            className="group relative bg-slate-950/80 border border-rose-500/30 hover:border-rose-400 p-5 rounded-2xl space-y-4 cursor-pointer transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold">
                03
              </div>
              <span className="text-[11px] text-rose-300 font-mono px-2 py-0.5 bg-rose-950 rounded border border-rose-800">
                Lint → Auto-Heal
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition">
                Lint 巡检与自愈引擎
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                定时扫描悬空断链与孤立节点 → 语义比对排查政策冲突 → 一键自愈补全并生成《知识库健康周报》。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400">
              <span>健康分 {healthScore} 分 ({healthScore >= 85 ? '优秀' : '需维护'})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* Bottom Micro Architecture Summary */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>存储底层: Git + Markdown | 检索核心: qmd (C/Rust 轻量二进制) | 规范约束: .agent/schema.md</span>
          </div>
          <button
            onClick={() => onNavigateTab('planning')}
            className="text-indigo-400 hover:text-indigo-300 underline flex items-center space-x-1"
          >
            <span>查看完整 PRD 系统设计与页面规划</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Theoretical Foundations & Karpathy LLM Wiki Architecture Matrix */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 rounded-2xl p-6 border border-indigo-500/30 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                理论基石与方法论 (Theoretical Foundations)
              </span>
              <span className="text-xs text-slate-400">
                源自 Andrej Karpathy (Gist 442a6bf) & acmerfight (Gist 1c26b29)
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>LLM Wiki 核心理论能力提炼与企业级落地工程映射</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onNavigateToWikiPage('wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md')}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-xl transition shadow-sm flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>阅读理论白皮书</span>
            </button>
          </div>
        </div>

        {/* 4 Theoretical Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                01. 编译期预加工
              </span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">
              Compile-Time Synthesis vs Naive RAG
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              抛弃传统 RAG 检索时粗暴切块（Search & Jam）的低效黑盒，在写入时由 Agent 提前编织结构化 Markdown 页面与语义双链。
            </p>
            <div className="pt-2 border-t border-slate-800/60">
              <span
                onClick={() => onNavigateToWikiPage('wiki/terms/compile-time-synthesis-vs-rag.md')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center space-x-1 font-medium"
              >
                <span>查看术语定义</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                02. 知识复利效应
              </span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">
              Monotonic Knowledge Compounding
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              知识库质量随时间单调递增，连接密度越来越密；高频深度问答自动沉淀为新 Wiki 页面，实现企业知识资产复利。
            </p>
            <div className="pt-2 border-t border-slate-800/60">
              <span
                onClick={() => onNavigateToWikiPage('wiki/terms/knowledge-compounding-monotonicity.md')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center space-x-1 font-medium"
              >
                <span>查看单调复利模型</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-purple-500/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                03. Karpathy 三环闭环
              </span>
              <GitBranch className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">
              The 3-Loop Knowledge Lifecycle
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ingest 写入多页编织环 + Query 检索反哺写回环 + Lint 后台自愈体检环，构筑知识库全自动化生命周期。
            </p>
            <div className="pt-2 border-t border-slate-800/60">
              <span
                onClick={() => onNavigateToWikiPage('wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md')}
                className="text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer flex items-center space-x-1 font-medium"
              >
                <span>查看 3-Loop SOP</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                04. 纯文本生态底座
              </span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-100">
              Obsidian + Git + qmd 引擎
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              基于人类可读的 Markdown 文件、Git 历史审计、Obsidian Canvas 视觉白板与微秒级本地 qmd 混合搜索引擎，零云端绑定。
            </p>
            <div className="pt-2 border-t border-slate-800/60">
              <span
                onClick={() => onNavigateTab('obsidian')}
                className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer flex items-center space-x-1 font-medium"
              >
                <span>查看 Obsidian 驱动</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Recent Logs & 5-Entity Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Entity Categorization Hub (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>5 大标准实体类别库 (Layer 2: wiki/)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('wiki')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <span>查看全部 {wikiPages.length} 篇</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                type: 'sop',
                name: 'SOP 业务流程',
                count: wikiPages.filter(p => p.frontmatter.type === 'sop').length,
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                desc: '报销流程、故障排查、发布指南'
              },
              {
                type: 'product',
                name: 'Product 产品功能',
                count: wikiPages.filter(p => p.frontmatter.type === 'product').length,
                color: 'text-blue-700 bg-blue-50 border-blue-200',
                desc: '产品定位、价格阶梯、售前售后 FAQ'
              },
              {
                type: 'project',
                name: 'Project 项目复盘',
                count: wikiPages.filter(p => p.frontmatter.type === 'project').length,
                color: 'text-purple-700 bg-purple-50 border-purple-200',
                desc: '技术选型、架构演进、踩坑记录'
              },
              {
                type: 'term',
                name: 'Term 术语与黑话',
                count: wikiPages.filter(p => p.frontmatter.type === 'term').length,
                color: 'text-amber-700 bg-amber-50 border-amber-200',
                desc: '企业缩写词、专有名词、新员工字典'
              },
              {
                type: 'synthesis',
                name: 'Synthesis 专题综述',
                count: wikiPages.filter(p => p.frontmatter.type === 'synthesis').length,
                color: 'text-rose-700 bg-rose-50 border-rose-200',
                desc: '横向对比、高价值问答反哺写回沉淀'
              }
            ].map(item => (
              <div
                key={item.type}
                onClick={() => onNavigateTab('wiki')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${item.color}`}>
                    {item.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">{item.count} 篇</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Operational Log Stream (wiki/log.md) (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>知识库操作日志流 (wiki/log.md)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Append-Only 审计</span>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-indigo-600">[{log.timestamp}]</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed line-clamp-2">{log.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {log.targetPages.map((page, i) => (
                    <span
                      key={i}
                      onClick={() => onNavigateToWikiPage(page)}
                      className="text-[10px] font-mono bg-white text-indigo-600 hover:underline px-1.5 py-0.5 rounded border border-slate-200 cursor-pointer"
                    >
                      {page}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
