import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Cpu,
  MessageSquare,
  Send,
  HelpCircle,
  FileCode,
  Link as LinkIcon,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WikiPage, QmdSearchResult, ChatMessage, LogEntry } from '../types';
import { searchQmd } from '../utils/qmdEngine';

interface QmdSearchAndQueryViewProps {
  wikiPages: WikiPage[];
  onAddSynthesisPage: (newPage: WikiPage, log: LogEntry) => void;
  onNavigateToWikiPage: (path: string) => void;
}

export const QmdSearchAndQueryView: React.FC<QmdSearchAndQueryViewProps> = ({
  wikiPages,
  onAddSynthesisPage,
  onNavigateToWikiPage
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [searchResults, setSearchResults] = useState<QmdSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content: `您好！我是企业 LLM Wiki 智能问答助理。我的回答严格基于 **\`qmd\` 本地混合检索** 召回的 Wiki 页面，杜绝虚构幻觉。

您可以尝试提问：
1. **差旅补贴**：2026年最新差旅补贴是多少？与2024年旧版有什么区别？
2. **技术选型**：智能客服 2.0 为什么选择 qmd 混合检索？
3. **产品定价**：OmniWiki 企业版与传统 RAG 相比优势是什么？`,
      timestamp: '18:40'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Synthesis backfeed modal
  const [synthesisModalOpen, setSynthesisModalOpen] = useState(false);
  const [synthesisDraftTitle, setSynthesisDraftTitle] = useState('');
  const [synthesisDraftContent, setSynthesisDraftContent] = useState('');
  const [synthesisDraftSources, setSynthesisDraftSources] = useState<string[]>([]);

  // Trigger qmd search
  const handlePerformSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    setQueryInput(term);
    const results = searchQmd(term, wikiPages, 5);
    setSearchResults(results);
    setHasSearched(true);
  };

  // Handle Ask in Chat
  const handleSendMessage = (userText?: string) => {
    const text = (userText || chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsThinking(true);

    // Call qmd to recall Top-3 pages
    const recalled = searchQmd(text, wikiPages, 3);
    const recalledPaths = recalled.map(r => r.page.path);

    setTimeout(() => {
      let answer = '';
      let isSynthesisCandidate = false;
      let suggestedTitle = '';

      if (text.includes('差旅') || text.includes('补贴') || text.includes('报销')) {
        answer = `根据 [[wiki/sops/travel-reimbursement.md]] 与 [[wiki/terms/per-diem.md]]：

1. **2026 最新标准**：
   - **一线城市（北上广深、杭州、成都）**：[[wiki/terms/per-diem.md]] 差旅生活补贴上调为 **220 元/人/天**（2024旧版为 150 元/天，涨幅 46.6%）；住宿标准上限提升至 **550 元/天**。
   - **二线及其他城市**：每日生活补贴为 **160 元/人/天**；住宿标准上限为 **380 元/天**。
2. **流程规范 (SOP)**：
   - 出差前必须在 OA 系统完成 [[wiki/terms/biz-trip-req.md]] 事前审批流。
   - 差旅结束后 7 日内完成发票验真提交，审批终审后 3 个工作日内打入薪资账户。
3. **合规提示**：严禁虚开“会议费”顶替餐费，旧版 120 元/天标准已废止。`;
        isSynthesisCandidate = true;
        suggestedTitle = '2026年最新差旅生活补贴标准与报销合规要点问答综述';
      } else if (text.includes('智能客服') || text.includes('客服') || text.includes('选型')) {
        answer = `根据 [[wiki/projects/ai-customer-service-2.md]] 与 [[wiki/products/smart-support-agent.md]]：

1. **技术选型原因**：
   - 放弃传统重型向量数据库，采用轻量级本地混合搜索引擎 [[wiki/terms/qmd.md]]（BM25 词法 + 本地向量），零运维、极低延迟。
   - 大模型算力选用 Qwen2.5-72B-Instruct + DeepSeek-R1 混合推理。
2. **业务成效**：
   - 问答准确率从 62% 大幅提升至 **91.8%**，人工接管率降至 **8.2%**，月度基础设施开销降低 **74%**。
3. **应急规范**：如遇大模型超时，按 [[wiki/sops/customer-service-incident-response.md]] 一键降级至冷备份规则。`;
        isSynthesisCandidate = true;
        suggestedTitle = 'AI智能客服 2.0 架构重构与选型成效综述';
      } else if (text.includes('RAG') || text.includes('OmniWiki') || text.includes('优势') || text.includes('定价')) {
        answer = `根据 [[wiki/products/omniwiki-enterprise.md]] 与 [[wiki/syntheses/rag-vs-llm-wiki-comparison.md]]：

1. **核心差异 (RAG vs LLM Wiki)**：
   - **传统 RAG**：将文档切片为无意义碎片块（Chunks），不可读、黑盒、难校对，随时间容易产生过期脏块。
   - **LLM Wiki + qmd**：以干净 Markdown 结构化托管于 Git，Agent 自动执行多页编织 ([[wiki/terms/multi-touch-ingest.md]])，支持定期 Lint 自愈。
2. **定价版本**：
   - **标准版**：年费 9.8 万元（500用户，2000篇 Wiki）。
   - **企业旗舰版**：年费 25.8 万元（无限用户，内置 \`qmd\` 混合引擎与定时自愈 Lint 模块）。`;
        isSynthesisCandidate = true;
        suggestedTitle = '企业知识库选型：传统RAG与LLM Wiki架构对比总结';
      } else {
        answer = `根据当前知识库中 [[wiki/terms/qmd.md]] 与关联文档检索：

已为您检索到 ${recalled.length} 个相关页面。本知识库支持对 SOP 流程、产品定义、项目复盘、企业术语黑话及专题综述的全面检索与自动问答。`;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        sender: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: recalledPaths,
        qmdScores: recalled.map(r => ({ path: r.page.path, score: r.hybridScore })),
        synthesisCandidate: isSynthesisCandidate
          ? {
              suggestedTitle,
              suggestedPath: `wiki/syntheses/${new Date().toISOString().slice(0, 10)}_${suggestedTitle.slice(0, 12)}.md`,
              summary: answer
            }
          : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 1100);
  };

  // Open Synthesis backfeed modal
  const handleOpenBackfeedModal = (candidate: NonNullable<ChatMessage['synthesisCandidate']>, sources: string[] = []) => {
    setSynthesisDraftTitle(candidate.suggestedTitle);
    setSynthesisDraftSources(sources);
    const markdownTemplate = `---
title: "${candidate.suggestedTitle}"
type: "synthesis"
created_at: "${new Date().toISOString().slice(0, 10)}"
updated_at: "${new Date().toISOString().slice(0, 10)}"
sources:
  - "Query反哺写回"
tags:
  - "综述"
  - "知识反哺"
  - "高价值问答"
status: "active"
---

# [Synthesis] ${candidate.suggestedTitle}

## 1. 核心结论摘要
${candidate.summary}

## 2. 知识复利说明
本篇综述通过员工在企业智能问答中提出的深度问题，经 Agent 自动综合后，依据 Two-Output 规则沉淀为全员共享的知识资产。
`;
    setSynthesisDraftContent(markdownTemplate);
    setSynthesisModalOpen(true);
  };

  // Save synthesis back to wiki/
  const handleConfirmSaveSynthesis = () => {
    const cleanFileName = `${new Date().toISOString().slice(0, 10)}_${synthesisDraftTitle.slice(0, 10)}.md`;
    const fullPath = `wiki/syntheses/${cleanFileName}`;

    const newSynthesisPage: WikiPage = {
      id: `wiki-syn-${Date.now()}`,
      path: fullPath,
      fileName: cleanFileName,
      frontmatter: {
        title: synthesisDraftTitle,
        type: 'synthesis',
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString().slice(0, 10),
        sources: synthesisDraftSources.length > 0 ? synthesisDraftSources : ['Query反哺写回'],
        tags: ['综述', '知识反哺', '高价值问答'],
        status: 'active'
      },
      rawMarkdown: synthesisDraftContent,
      content: synthesisDraftContent.replace(/---[\s\S]*?---/, '').trim(),
      outgoingLinks: ['wiki/terms/per-diem.md', 'wiki/sops/travel-reimbursement.md'],
      wordCount: synthesisDraftContent.length
    };

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      action: 'QUERY_SYNTHESIS',
      source: 'Query Engine (Two-Output Rule)',
      targetPages: [fullPath, 'wiki/index.md', 'qmd.idx'],
      description: `执行知识反哺写回，生成综述页面 ${cleanFileName} 并触发 qmd update`
    };

    onAddSynthesisPage(newSynthesisPage, newLog);
    setSynthesisModalOpen(false);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const [activeViewMode, setActiveViewMode] = useState<'tester' | 'planning' | 'cli'>('tester');
  const [cliCommandInput, setCliCommandInput] = useState('qmd search "差旅补贴" --hybrid --top 3');
  const [cliOutputLogs, setCliOutputLogs] = useState<string[]>([
    'qmd v2.1.0 (Embedded Rust/Node Hybrid Engine)',
    'Index Status: 1,420 Wiki pages indexed (sqlite-vec + BM25 inverted index)',
    'Type "qmd --help" or click sample commands below for quick testing.'
  ]);

  // Handle CLI execution with real backend API calls
  const handleExecuteCli = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    const newLogs = [...cliOutputLogs, `$ ${trimmed}`];
    setCliOutputLogs(newLogs);
    
    try {
      if (trimmed.includes('search')) {
        const queryMatch = trimmed.match(/["']([^"']+)["']/);
        const searchQuery = queryMatch ? queryMatch[1] : '差旅';
        const res = await fetch('/api/v1/qmd/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, topK: 3 })
        });
        const data = await res.json();
        if (data.success) {
          const apiLogs = [
            `[INFO] Executing Query Expansion (Qwen3 1.7B + HyDE) for "${searchQuery}"...`,
            `[INFO] Dispatching Parallel Search: Vector Index + BM25 Inverted Index...`,
            `[INFO] Reciprocal Rank Fusion (RRF) & Local Reranking completed in ${data.latencyMs}ms.`,
            `=== QMD HYBRID SEARCH RESULTS (Total Indexed: ${data.totalIndexed}) ===`
          ];
          data.results.forEach((r: any, idx: number) => {
            apiLogs.push(`${idx + 1}. ${r.path} [Hybrid Score: ${r.hybridScore}] (BM25: ${r.bm25Score}, Vec: ${r.vectorScore})`);
            apiLogs.push(`   Title: ${r.title}`);
            apiLogs.push(`   Snippet: "${r.snippet}"`);
          });
          setCliOutputLogs(prev => [...prev, ...apiLogs]);
        }
      } else if (trimmed.includes('update')) {
        const res = await fetch('/api/v1/qmd/update', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setCliOutputLogs(prev => [
            ...prev,
            `[INFO] Scanning Git repository for modified Raw files...`,
            `[INFO] Incremental compilation: ${data.newlyParsed} files parsed, AST generated.`,
            data.log,
            `[STATS] Total Indexed Pages: ${data.indexedPages} | SQLite-Vec: ${data.sqliteVecSizeMb} MB`
          ]);
        }
      } else if (trimmed.includes('stats')) {
        const res = await fetch('/api/v1/qmd/stats');
        const data = await res.json();
        if (data.success) {
          setCliOutputLogs(prev => [
            ...prev,
            `=== QMD ENGINE STATS (${data.indexEngine}) ===`,
            `Indexed Pages: ${data.indexedPages} | Total Tokens: ${data.totalTokens}`,
            `BM25 Index Size: ${data.storage.bm25Index} | Vector DB (sqlite-vec): ${data.storage.sqliteVec}`,
            `Average Latency: ${data.averageLatencyMs}ms`
          ]);
        }
      } else {
        setCliOutputLogs(prev => [...prev, `Command executed: ${trimmed}. Type "qmd search", "qmd update", or "qmd stats".`]);
      }
    } catch (err: any) {
      setCliOutputLogs(prev => [...prev, `[ERROR] Failed to execute CLI command: ${err.message}`]);
    }
    
    setCliCommandInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & View Mode Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                qmd Hybrid Core
              </span>
              <span className="text-xs text-slate-500 font-mono">
                BM25 精确词法 + 本地向量语义双模召回 (针对 &gt;1000 规模 Wiki 优化)
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              `qmd` 混合检索、架构规划与 AI 命令行调用中枢
            </h2>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono font-medium flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>检索耗时: ~16ms | 容量: 1,420 篇 Wiki</span>
          </span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex border-b border-slate-100 pt-2 space-x-4">
          <button
            onClick={() => setActiveViewMode('tester')}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 cursor-pointer border-b-2 ${
              activeViewMode === 'tester'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>🔍 混合检索测试台 & Grounded 问答</span>
          </button>
          <button
            onClick={() => setActiveViewMode('planning')}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 cursor-pointer border-b-2 ${
              activeViewMode === 'planning'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>📋 QMD 四阶段架构与检索规划白皮书</span>
          </button>
          <button
            onClick={() => setActiveViewMode('cli')}
            className={`pb-3 text-xs font-bold transition flex items-center space-x-2 cursor-pointer border-b-2 ${
              activeViewMode === 'cli'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>💻 CLI 命令行交互与 AI 调用仿真</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SEARCH TESTER & CHAT */}
      {activeViewMode === 'tester' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: qmd Hybrid Search Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>`qmd search` 混合加权召回测试台</span>
              </h3>
              <p className="text-xs text-slate-500">
                输入查询词，直观查看 BM25 词法分、向量语义分与最终混合得分
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePerformSearch(queryInput)}
                  placeholder="例如: 差旅补贴标准 / AI客服选型..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => handlePerformSearch(queryInput)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
              >
                搜索
              </button>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['差旅补贴', '智能客服', 'qmd原理', 'SaaS定价', 'RAG对比'].map(kw => (
                <button
                  key={kw}
                  onClick={() => handlePerformSearch(kw)}
                  className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-md transition"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results List */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm space-y-3 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {result.page.frontmatter.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      {result.page.path}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {result.hybridScore}
                  </span>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400">BM25 词法: </span>
                    <span className="font-bold text-slate-700">{result.bm25Score}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">向量语义: </span>
                    <span className="font-bold text-indigo-700">{result.vectorScore}</span>
                  </div>
                </div>

                {/* Snippets */}
                {result.matchedSnippets.length > 0 && (
                  <div className="text-[11px] text-slate-600 bg-slate-50/50 p-2 rounded border border-slate-100 line-clamp-2 leading-relaxed">
                    "{result.matchedSnippets[0]}"
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => onNavigateToWikiPage(result.page.path)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                  >
                    <span>在 Wiki 中查看</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {hasSearched && searchResults.length === 0 && (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
                未检索到匹配的 Wiki 实体，请尝试其他关键词
              </div>
            )}
          </div>
        </div>

        {/* Right: Grounded AI Q&A Chat & Backfeed Center (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">企业通用知识库智能问答 (Grounded Q&A)</h4>
                <p className="text-[10px] text-slate-400">两级召回 · 忠实溯源 · Two-Output 反哺写回</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[92%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Sources chips */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        参考来源 (Grounded Sources):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => onNavigateToWikiPage(src)}
                            className="text-[10px] font-mono bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 flex items-center space-x-1 transition"
                          >
                            <LinkIcon className="w-2.5 h-2.5" />
                            <span>{src.split('/').pop()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Two-Output Backfeed Banner */}
                  {msg.synthesisCandidate && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                      <div className="flex items-center space-x-1.5 text-purple-900 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Two-Output Rule: 知识沉淀与反哺建议</span>
                      </div>
                      <p className="text-[11px] text-purple-700">
                        该回答包含了跨文档横向对比与深度提炼。建议将其反哺写回为新的 Synthesis 综述！
                      </p>
                      <button
                        onClick={() => handleOpenBackfeedModal(msg.synthesisCandidate!, msg.sources)}
                        className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>一键反哺存为 Synthesis 综述 (wiki/syntheses/)</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 px-1 font-mono">{msg.timestamp}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center space-x-2 text-xs text-indigo-600 font-mono bg-white p-3 rounded-xl border border-slate-200 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>qmd 正在执行混合检索并组装忠实回答...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入任何业务问题，例如: 差旅补贴标准 / AI客服架构选型..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!chatInput.trim() || isThinking}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发送</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* VIEW MODE 2: QMD ARCHITECTURE PLANNING & PIPELINE WHITEBOOK */}
      {activeViewMode === 'planning' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8 animate-fadeIn">
          <div className="border-b border-slate-100 pb-5 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-xs font-bold rounded border border-indigo-200">
                Andrej Karpathy & QMD Architecture
              </span>
              <span className="text-xs text-slate-400">Scale: &gt; 1,000 Wiki Pages Hybrid Indexing Strategy</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              QMD 本地混合检索与四阶段流水线详细规划白皮书
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              当企业知识库 Wiki 页面突破 1,000 篇时，传统的基于目录树或 index 页面的全量浏览和 naive RAG 检索面临严重的 Token 限制、上下文碎片化和延迟剧增问题。本规划引入专业本地搜索引擎 <code className="text-indigo-600 font-bold">qmd</code>，实现 BM25 词法与本地向量的双模混合召回，并支持 AI 通过 CLI 直接调用。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Query Expansion (查询扩展)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                利用 Qwen3 1.7B + LoRA 模型，将用户简短查询进行领域同义词扩展、HyDE（假设性文档摘要生成）、Dense 稠密语义与 Lexical 关键词提取。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Parallel Search (并行多路召回)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                多路并行触发：向量语义检索（捕捉深层概念意图）与 BM25 倒排索引检索（精准匹配专业代码、产品代号与法规条文）。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center text-xs">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Result Fusion & Reranking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                通过 Reciprocal Rank Fusion (RRF) 倒数排位算法将多路分值归一化合并，再由本地 LLM Reranker 交叉编码器精细打分降噪。
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                04
              </div>
              <h4 className="font-bold text-slate-900 text-sm">CLI & Tool Execution</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                编译为单文件轻量二进制，提供标准 CLI 接口（<code className="text-emerald-700 font-mono">qmd search</code> / <code className="text-emerald-700 font-mono">qmd update</code>），供 AI 代理直接无缝调用。
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 space-y-4 font-mono text-xs">
            <div className="text-indigo-400 font-bold flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>QMD 架构落地路线图与性能指标 (Target vs Current)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
              <div className="bg-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px] block">索引存储引擎</span>
                <span className="text-emerald-400 font-bold text-sm">SQLite-Vec + BM25 倒排文件</span>
                <p className="text-[10px] text-slate-400">零额外数据库守护进程，随 Git 仓库直接版本化。</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px] block">平均查询延迟</span>
                <span className="text-indigo-400 font-bold text-sm">&lt; 20ms (10,000 篇)</span>
                <p className="text-[10px] text-slate-400">得益于 Rust 高性能内存倒排与向量索引。</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px] block">AI 工具调用成本</span>
                <span className="text-purple-400 font-bold text-sm">0.00 元 (完全本地私有)</span>
                <p className="text-[10px] text-slate-400">避免云端托管向量库高昂月租与数据外泄风险。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: CLI TERMINAL SIMULATOR */}
      {activeViewMode === 'cli' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <span>QMD 命令行 CLI 交互与 AI 工具调用仿真台</span>
              </h3>
              <p className="text-xs text-slate-400">
                模拟 AI 代理直接通过命令行调用本地 qmd 工具进行混合检索、索引更新与状态诊断。
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExecuteCli('qmd search "差旅补贴" --hybrid --top 3')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-mono cursor-pointer"
              >
                qmd search "差旅补贴"
              </button>
              <button
                onClick={() => handleExecuteCli('qmd update')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-mono cursor-pointer"
              >
                qmd update
              </button>
              <button
                onClick={() => handleExecuteCli('qmd stats')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-mono cursor-pointer"
              >
                qmd stats
              </button>
            </div>
          </div>

          {/* Terminal Screen */}
          <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs space-y-2 h-[420px] overflow-y-auto shadow-inner border border-slate-800">
            {cliOutputLogs.map((log, li) => (
              <div key={li} className={`${log.startsWith('$') ? 'text-indigo-300 font-bold pt-1' : log.includes('SUCCESS') ? 'text-emerald-300 font-bold' : log.includes('===') ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                {log}
              </div>
            ))}
          </div>

          {/* Terminal Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 font-mono text-xs text-indigo-400 font-bold">$</span>
              <input
                type="text"
                value={cliCommandInput}
                onChange={e => setCliCommandInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecuteCli(cliCommandInput)}
                placeholder="输入 qmd 命令 (例如: qmd search '智能客服' / qmd update / qmd stats)..."
                className="w-full pl-7 pr-3 py-2.5 text-xs bg-slate-900 text-slate-200 border border-slate-800 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => handleExecuteCli(cliCommandInput)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              执行命令
            </button>
          </div>
        </div>
      )}

      {/* Synthesis Backfeed Modal */}
      {synthesisModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>知识反哺写回 · 确认存为 Synthesis 综述</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  写入 wiki/syntheses/ 目录，更新 index.md 并自动执行 qmd update
                </p>
              </div>
              <button
                onClick={() => setSynthesisModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">综述页面标题</label>
                <input
                  type="text"
                  value={synthesisDraftTitle}
                  onChange={e => setSynthesisDraftTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Markdown 预览与 Frontmatter</label>
                <textarea
                  rows={8}
                  value={synthesisDraftContent}
                  onChange={e => setSynthesisDraftContent(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 focus:outline-none bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSynthesisModalOpen(false)}
                className="text-xs text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSaveSynthesis}
                className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认反哺写回并更新 qmd 索引</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
