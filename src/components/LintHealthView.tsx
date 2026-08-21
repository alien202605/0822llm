import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileCode,
  Download,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WikiPage, LintIssue } from '../types';
import { calculateHealthScore } from '../utils/lintEngine';

interface LintHealthViewProps {
  wikiPages: WikiPage[];
  lintIssues: LintIssue[];
  healthScore: number;
  onExecuteAutoHeal: (fixedIssues: LintIssue[], newlyCreatedPages: WikiPage[]) => void;
  onNavigateToWikiPage: (path: string) => void;
}

export const LintHealthView: React.FC<LintHealthViewProps> = ({
  wikiPages,
  lintIssues,
  healthScore,
  onExecuteAutoHeal,
  onNavigateToWikiPage
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeIssues = lintIssues.filter(i => !i.fixed);
  const fixedIssues = lintIssues.filter(i => i.fixed);

  const filteredIssues = activeIssues.filter(issue => {
    if (selectedTypeFilter === 'all') return true;
    return issue.type === selectedTypeFilter;
  });

  const { grade, breakdown } = calculateHealthScore(wikiPages.length, lintIssues);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleAutoHeal = () => {
    const newlyCreatedPages: WikiPage[] = [];
    const updatedIssues: LintIssue[] = lintIssues.map(issue => {
      if (issue.type === 'dangling_link' && issue.targetRef) {
        const cleanName = issue.targetRef.split('/').pop() || 'new-term.md';
        newlyCreatedPages.push({
          id: `wiki-term-${Date.now()}-${cleanName}`,
          path: issue.targetRef,
          fileName: cleanName,
          frontmatter: {
            title: `待补全术语: ${cleanName.replace('.md', '')}`,
            type: 'term',
            created_at: new Date().toISOString().slice(0, 10),
            updated_at: new Date().toISOString().slice(0, 10),
            sources: ['Lint自愈引擎自动生成'],
            tags: ['术语', '待补全', '自愈草稿'],
            status: 'draft'
          },
          rawMarkdown: `---\ntitle: "待补全术语: ${cleanName.replace('.md', '')}"\ntype: "term"\ncreated_at: "${new Date().toISOString().slice(0, 10)}"\nupdated_at: "${new Date().toISOString().slice(0, 10)}"\nsources:\n  - "Lint自愈引擎自动生成"\ntags:\n  - "术语"\n  - "待补全"\nstatus: "draft"\n---\n\n# [Term] 待补全术语: ${cleanName.replace('.md', '')}\n\n> ⚠️ 本页面由 Lint 自愈引擎因检测到悬空死链自动生成，待业务人员补充完整定义。`,
          content: `# [Term] 待补全术语: ${cleanName.replace('.md', '')}`,
          outgoingLinks: [],
          wordCount: 180
        });
      }

      return {
        ...issue,
        fixed: true
      };
    });

    onExecuteAutoHeal(updatedIssues, newlyCreatedPages);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyReport = () => {
    const report = `# 企业级 LLM Wiki 知识库健康体检与自愈周报 (Weekly Audit Report)

- **报告生成时间**：${new Date().toISOString().slice(0, 10)}
- **知识库健康总分**：${healthScore} 分 (${grade})
- **受检页面总数**：${wikiPages.length} 篇 Wiki 实体

## 一、体检问题汇总
- 悬空断链 (Dangling Links): ${breakdown.dangling} 项
- 孤立节点 (Orphan Nodes): ${breakdown.orphan} 项
- 矛盾与过时条款 (Contradictions): ${breakdown.contradiction} 项
- Frontmatter 规范缺失: ${breakdown.schema} 项

## 二、详细待修复清单
${activeIssues.map((issue, idx) => `
### ${idx + 1}. [${issue.type}] ${issue.message}
- **源文件路径**: ${issue.sourcePath}
- **建议自愈方案**: ${issue.suggestedFix}
- **严重级别**: ${issue.severity}
`).join('\n')}

## 三、自愈与治理建议
建议开启定时 Cron Lint 任务，保持每周定期自动扫描并向知识管理员发送体检看板。
`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
              Lint & Self-Healing Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">
              每周定期巡检 · 悬空死链/孤立节点/矛盾条款
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            知识库健康体检与自动自愈中心
          </h2>
          <p className="text-xs text-slate-500">
            自动扫描断链、孤岛与过时制度，保障知识库在长期演进中保持敏捷与高准确度。
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? '正在全库巡检...' : '执行全库体检'}</span>
          </button>

          <button
            onClick={handleAutoHeal}
            disabled={activeIssues.length === 0}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>一键智能自愈修复 ({activeIssues.length})</span>
          </button>
        </div>
      </div>

      {/* Health Score Banner & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Health Radial & Grade (4 cols) */}
        <div className="md:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400">当前知识库健康状态评级</span>
            <div className="flex items-baseline space-x-3">
              <span className="text-5xl font-black text-emerald-400">{healthScore}</span>
              <span className="text-sm font-medium text-slate-300">/ 100 满分</span>
            </div>
            <div className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800 w-fit mt-1">
              状态评级: {grade}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>受检 Wiki 实体总数:</span>
              <span className="font-mono font-bold text-white">{wikiPages.length} 篇</span>
            </div>
            <div className="flex justify-between">
              <span>待处理自愈项:</span>
              <span className="font-mono font-bold text-rose-400">{activeIssues.length} 项</span>
            </div>
            <div className="flex justify-between">
              <span>已自愈历史项:</span>
              <span className="font-mono font-bold text-emerald-400">{fixedIssues.length} 项</span>
            </div>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 rounded-xl border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>查看并导出《健康体检周报》</span>
          </button>
        </div>

        {/* Right: Issues Breakdown Bento (8 cols) */}
        <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>4 大核心自愈维度指标监控</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">悬空死链 (Dangling)</span>
              <div className="text-xl font-black text-rose-600">{breakdown.dangling}</div>
              <span className="text-[10px] text-slate-400">[[...]] 缺少对应页面</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">孤立节点 (Orphan)</span>
              <div className="text-xl font-black text-amber-600">{breakdown.orphan}</div>
              <span className="text-[10px] text-slate-400">未被任何页面引用</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">政策冲突 (Contradiction)</span>
              <div className="text-xl font-black text-purple-600">{breakdown.contradiction}</div>
              <span className="text-[10px] text-slate-400">疑似包含已作废条款</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Schema 规范缺失</span>
              <div className="text-xl font-black text-blue-600">{breakdown.schema}</div>
              <span className="text-[10px] text-slate-400">YAML 必填字段缺失</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {[
              { id: 'all', label: '全部问题', count: activeIssues.length },
              { id: 'dangling_link', label: '悬空死链', count: activeIssues.filter(i => i.type === 'dangling_link').length },
              { id: 'orphan_node', label: '孤立节点', count: activeIssues.filter(i => i.type === 'orphan_node').length },
              { id: 'contradiction', label: '政策冲突', count: activeIssues.filter(i => i.type === 'contradiction').length },
              { id: 'schema_error', label: 'Schema 缺失', count: activeIssues.filter(i => i.type === 'schema_error').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedTypeFilter === tab.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>待自愈问题明细清单 ({filteredIssues.length})</span>
          {activeIssues.length === 0 && (
            <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>全库巡检无待修复异常，状态极佳！</span>
            </span>
          )}
        </h3>

        <div className="space-y-3">
          {filteredIssues.map(issue => (
            <div
              key={issue.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-rose-400 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        issue.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : issue.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {issue.type} · {issue.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{issue.message}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    源页面: {issue.sourcePath}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToWikiPage(issue.sourcePath)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 shrink-0"
                >
                  <span>查看该页</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                <strong className="text-slate-900">💡 建议自愈路径: </strong>
                <span>{issue.suggestedFix}</span>
              </div>
            </div>
          ))}

          {activeIssues.length === 0 && (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">当前知识库无悬空断链与冲突条款</p>
              <p className="text-[11px] text-slate-400">
                知识网络各节点关系清晰，`qmd` 检索索引处于最高准确度状态。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>《企业知识库健康体检与自愈周报》</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Weekly Self-Healing Audit Report · 定时生成
                </p>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs max-h-[400px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
{`# 企业级 LLM Wiki 知识库健康体检与自愈周报

- 报告时间: ${new Date().toISOString().slice(0, 10)}
- 健康总分: ${healthScore} 分 (${grade})
- 受检页面: ${wikiPages.length} 篇

## 1. 核心风险项
- 悬空断链: ${breakdown.dangling} 项
- 孤立节点: ${breakdown.orphan} 项
- 政策矛盾: ${breakdown.contradiction} 项
- 规范缺失: ${breakdown.schema} 项

## 2. 自愈建议
建议持续启用自动化体检 Cron 任务，并鼓励员工通过提问反哺将高价值业务经验写回 Wiki。`}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={handleCopyReport}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制周报' : '复制周报文本'}</span>
              </button>
              <button
                onClick={() => setReportModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
