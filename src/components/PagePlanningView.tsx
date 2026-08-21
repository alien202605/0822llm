import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  GitBranch,
  Terminal,
  MessageSquare,
  Share2,
  Activity,
  FolderGit2,
  Code2
} from 'lucide-react';
import { PAGE_PLANNING_ITEMS, ARCHITECTURE_TIERS, CORE_ENGINES, ENTITY_SCHEMAS_META } from '../data/pagePlanningData';
import { PagePlanItem } from '../types';

interface PagePlanningViewProps {
  onNavigateToTab: (tabId: any) => void;
}

export const PagePlanningView: React.FC<PagePlanningViewProps> = ({ onNavigateToTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<PagePlanItem>(PAGE_PLANNING_ITEMS[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['全部', '客户端交互层', '引擎中枢层', '存储层与工具', '系统治理与运维'];

  const filteredPages = PAGE_PLANNING_ITEMS.filter(item => {
    const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coreFunctions.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleCopyPRD = () => {
    const prdText = `# 企业级 LLM Wiki 知识库系统 页面规划与 PRD 架构说明书

## 1. 架构总览
- Layer 1 (raw/): 不可变原始资料层 (PDF/Word/飞书/会议纪要)
- Engine Core (qmd): 本地混合搜索引擎 (BM25 + 向量语义)
- Layer 2 (wiki/): Agent 编译多页网络 (5类实体: sops, products, projects, terms, syntheses)

## 2. 页面规划清单 (共 10 个核心页面)
${PAGE_PLANNING_ITEMS.map((p, idx) => `
### ${idx + 1}. ${p.title} (${p.path})
- **分类**: ${p.category} | **优先级**: ${p.priority}
- **功能描述**: ${p.description}
- **核心功能**:
${p.coreFunctions.map(f => `  - ${f}`).join('\n')}
- **UI 组件**: ${p.uiComponents.join(', ')}
- **API 接口**: ${p.apiEndpoints.join(', ')}
- **布局设计**: ${p.wireframeLayout}
`).join('\n')}
`;
    navigator.clipboard.writeText(prdText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PAGE_PLANNING_ITEMS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `agent_alien_知识库_Page_Planning_Spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Banner & Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OmniWiki Enterprise Architecture Plan · 终极落地规划</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              企业级 LLM Wiki 知识库系统 · 全局页面规划与架构说明
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              基于 <strong className="text-emerald-400">Git 文件存储</strong> + <strong className="text-blue-400">Agent 自动编译引擎</strong> + <strong className="text-indigo-400">`qmd` 本地混合检索</strong> 构建。
              包含 3 层存储、3 大引擎与 2 类交互终端，支持从数篇到数千篇规模无缝扩展的企业“活字典”。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyPRD}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制 PRD 规划书' : '复制完整 PRD 说明书'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>导出 JSON 契约</span>
            </button>
          </div>
        </div>

        {/* 3 Storage Tiers & 3 Engines Quick Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          {ARCHITECTURE_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-indigo-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">{tier.tierName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {tier.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{tier.description}</p>
              <div className="text-[11px] font-mono text-indigo-400">Path: {tier.dir}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Page Plan Directory & Detail Wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Page List & Filters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>页面规划导航清单 ({filteredPages.length})</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">10 核心页面</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索页面名称、功能或接口..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Page Cards List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredPages.map(page => {
              const isSelected = selectedPage.id === page.id;
              return (
                <div
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">{page.title}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                        <span>{page.path}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                        page.priority.includes('P0')
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {page.priority.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {page.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400">{page.category}</span>
                    <span className="text-indigo-600 font-medium flex items-center space-x-0.5">
                      <span>查看详情</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Page Specification & Wireframe Blueprint (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPage && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedPage.category} · {selectedPage.priority}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">{selectedPage.path}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedPage.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{selectedPage.description}</p>
              </div>

              {/* Body Details */}
              <div className="p-6 space-y-6 text-slate-800">
                {/* User Personas */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <span>Target User Personas (适用用户角色)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPage.userPersonas.map((persona, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium border border-slate-200"
                      >
                        👤 {persona}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Functions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Core Functional Requirements (核心功能清单)
                  </h4>
                  <div className="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                    {selectedPage.coreFunctions.map((fn, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{fn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wireframe Layout Blueprint Visualizer */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    UI/UX Wireframe Blueprint (线框布局规划)
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
                    <div className="text-indigo-400 font-bold"># 页面线框结构拓扑:</div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                      {selectedPage.wireframeLayout}
                    </div>
                  </div>
                </div>

                {/* UI Components Tree */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    UI Component Hierarchy (前端组件树)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPage.uiComponents.map((comp, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200"
                      >
                        &lt;{comp} /&gt;
                      </span>
                    ))}
                  </div>
                </div>

                {/* API Endpoints Contract */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    API Endpoints & Data Contracts (后端接口定义)
                  </h4>
                  <div className="space-y-1.5 font-mono text-xs">
                    {selectedPage.apiEndpoints.map((api, idx) => {
                      const [method, route] = api.split(' ');
                      return (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-200"
                        >
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              method === 'GET'
                                ? 'bg-emerald-100 text-emerald-700'
                                : method === 'POST'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {method}
                          </span>
                          <span className="text-slate-700">{route}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5 Entity Schema Blueprint Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-indigo-600" />
              <span>企业 5 类核心 Wiki 实体结构标准与目录约定</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              定义于 <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">.agent/schema.md</code>，确保知识库标准化、可自愈
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('schema')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>打开 Schema 治理中心</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {ENTITY_SCHEMAS_META.map((meta, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:bg-white hover:border-indigo-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{meta.name}</span>
              </div>
              <div className="text-[11px] font-mono text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded">
                {meta.path}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{meta.purpose}</p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                <strong className="text-slate-600">核心字段:</strong> {meta.coreFields}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agile 3-Phase Implementation Roadmap */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <span>敏捷落地与推进路线图 (3 阶段里程碑)</span>
          </h3>
          <p className="text-xs text-slate-400">
            从种子库冷启动到全自主演进与企业 IM 全员赋能的落地路径
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">Phase 1 (1~2 周)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                种子库与规范
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">种子库与规范建立</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>收集 30–50 篇常用高频文档 (规章/产品SOP/术语表)</li>
              <li>初始化 Git 仓库与 <code className="text-indigo-300">.agent/schema.md</code></li>
              <li>跑通 LLM Ingest 流程，生成初始 <code className="text-indigo-300">wiki/</code></li>
            </ul>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 font-mono">Phase 2 (2~3 周)</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                检索增强与IM
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">检索增强与 IM 机器人接入</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>部署轻量级 <code className="text-blue-300">qmd</code> 本地混合搜索引擎</li>
              <li>配置 Agent 的 MCP / CLI 工具接口</li>
              <li>接入飞书/钉钉/企微机器人，开通问答与丢文件 Ingest</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 font-mono">Phase 3 (第 2 个月起)</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                自动化体检
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">自动化体检与自主演进</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>上线 Lint 定时任务，每周自动生成《自愈报告》</li>
              <li>启用 Two-Output 提问反哺写回 Synthesis</li>
              <li>企业知识资产复利沉淀与跨部门协作协同</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
