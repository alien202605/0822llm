import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileCode,
  Clock,
  HardDrive,
  Eye,
  Plus,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Table,
  FileSpreadsheet,
  Cpu,
  Layers,
  Copy,
  Check,
  Search,
  Zap,
  Sliders,
  ExternalLink,
  BookOpen,
  File
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RawDocument, WikiPage, ParsedTableData } from '../types';

interface RawRepositoryViewProps {
  rawDocs: RawDocument[];
  onAddRawDoc: (newDoc: RawDocument, newPages: WikiPage[]) => void;
  onNavigateToWikiPage: (path: string) => void;
}

export const RawRepositoryView: React.FC<RawRepositoryViewProps> = ({
  rawDocs,
  onAddRawDoc,
  onNavigateToWikiPage
}) => {
  const [selectedDoc, setSelectedDoc] = useState<RawDocument>(rawDocs[0] || null);
  const [activeDetailTab, setActiveDetailTab] = useState<'markdown' | 'tables' | 'parser_meta' | 'raw_source'>('markdown');
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [formatFilter, setFormatFilter] = useState<'all' | 'pdf' | 'excel' | 'word' | 'cloud'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Ingest modal & parser states
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSourceType, setNewSourceType] = useState<RawDocument['sourceType']>('pdf');
  const [selectedSampleType, setSelectedSampleType] = useState<string>('pdf_finance');
  
  // Ingest simulation state
  const [ingestStep, setIngestStep] = useState<number>(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResults, setCompiledResults] = useState<{ newPages: WikiPage[]; summary: string } | null>(null);

  // Copy helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(label);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  // Pre-fill sample presets
  const handlePreFillSample = (sampleKey: 'pdf_finance' | 'excel_revenue' | 'word_arch' | 'ppt_strategy' | 'hr_policy') => {
    setSelectedSampleType(sampleKey);
    if (sampleKey === 'pdf_finance') {
      setNewTitle('2026年半年度集团财务审计与经营损益分析报告.pdf');
      setNewSourceType('pdf');
      setNewContent(`# 2026年半年度集团财务审计与经营损益分析报告 (PDF 复杂表格与版面提取)

> [!NOTE]
> 经 **PDF 版面分析与跨页表格还原引擎** 解析自 24 页财务报告。已自动消除跨页页眉页脚，表格结构完整保留。

## 一、集团合并营收与各事业部构成
2026 年上半年，集团实现合并营业收入 **1.68 亿元**，同比增长 **76.4%**。

| 业务板块 / BU | H1 营收 (万元) | 同比增长 | 综合毛利率 | 研发投入占比 |
| :--- | :--- | :--- | :--- | :--- |
| **OmniWiki 知识云** | 3,240.0 | +192.5% | 82.0% | 34.5% |
| **AI 智能客服系统** | 4,890.0 | +85.2% | 71.5% | 28.0% |
| **企业算力基础设施** | 6,520.0 | +42.0% | 46.0% | 15.2% |
| **工位知识共享盘** | 2,150.0 | +280.0% | 86.0% | 41.0% |

## 二、差旅与日常运营费用合规
- 严格遵循 [[wiki/sops/travel-reimbursement.md]] 与 [[wiki/terms/per-diem.md]] 差旅标准，单均报销核销周期优化至 1.2 天。
- 采用私有化知识库后，外部云服务 SaaS 订阅费用年化降低 82 万元。`);
    } else if (sampleKey === 'excel_revenue') {
      setNewTitle('2026年度各产品线营收测算与成本分摊模型.xlsx');
      setNewSourceType('excel');
      setNewContent(`# 2026年度各产品线营收测算与成本分摊模型 (Excel 多工作表提取)

> [!TIP]
> 经 **Excel 智能表格与公式解析引擎** 提取自 3 个 Sheet。已计算公式单元格数值并转化为标准 Markdown 矩阵。

## Sheet 1: SaaS 单元经济模型 (Unit Economics)
| 产品矩阵 | 客单价 (ACV) | 获客成本 (CAC) | LTV 价值 | LTV/CAC 比率 |
| :--- | :--- | :--- | :--- | :--- |
| **OmniWiki 标准版** | ¥98,000 | ¥18,500 | ¥372,400 | **20.1x** |
| **OmniWiki 旗舰版** | ¥258,000 | ¥42,000 | ¥1,161,000 | **27.6x** |
| **企业工位网关** | ¥58,000 | ¥7,200 | ¥185,600 | **25.8x** |

## Sheet 2: 存储与检索架构降本效益
采用 [[wiki/terms/qmd.md]] 嵌入式混合搜索引擎替代云端 Milvus 向量数据库与 ElasticSearch 集群：
- 月度云资源开销从 **7.2 万元/月** 骤降至 **3,500 元/月**，年化降本 **95.1%**。`);
    } else if (sampleKey === 'word_arch') {
      setNewTitle('企业知识引擎多层架构演进与私有化白皮书.docx');
      setNewSourceType('word');
      setNewContent(`# 企业知识引擎多层架构演进与私有化白皮书 (Word 层级大纲提取)

## 一、三层存储设计架构
1. **Layer 1: raw/ (不可变原始凭据库)**：汇聚员工工位共享盘、PDF、Excel 与会议资料，采用 Git 只读保护。
2. **Layer 2: wiki/ (可读可写可自愈)**：经 Agent 编译的多页维基实体网，支撑双链与单调累加。
3. **Layer 3: system/ (轻量索引核心)**：由 \`qmd\` 驱动的本地 BM25 与向量混合检索。

## 二、文档解析规范
支持复杂 PDF 多栏识别、Excel 表格还原与 Word 标题大纲映射，杜绝传统 RAG 检索期切块粗暴丢失上下文的问题。`);
    } else if (sampleKey === 'ppt_strategy') {
      setNewTitle('2026年Q3集团核心战略规划与OKR对齐.pptx');
      setNewSourceType('pptx');
      setNewContent(`# 2026年Q3集团核心战略规划与OKR对齐 (PPT 幻灯片大纲提取)

## Slide 1: 愿景与核心战略定力
打造全员无感并网的企业级“活字典”知识库，实现企业知识资产复利与跨部门协同。

## Slide 2: Q3 关键业务线 OKR
- **O1: 知识库全员渗透率突破 90%**
  - KR1: 完成研发、设计与运营等 50+ 工位共享盘接入。
  - KR2: 知识健康巡检综合分维持在 95 分以上。
- **O2: 客户服务与售前效率倍增**
  - KR1: 售前通过 [[wiki/products/omniwiki-enterprise.md]] 响应提效 60%。
  - KR2: 智能客服转人工率降至 8% 以下。`);
    } else {
      setNewTitle('2026年员工年假与弹性休假管理规定.pdf');
      setNewSourceType('pdf');
      setNewContent(`# 2026年员工年假与弹性休假管理规定 (生效日期: 2026-08-18)

## 一、适用对象
全体与集团签署正式劳动合同的员工。

## 二、年假计提标准与折算 (PTO)
1. 工龄满 1 年不满 10 年者，每年法定年假 5 天，额外赠予“弹性福利假” 3 天，合计 8 天。
2. 工龄满 10 年不满 20 年者合计 13 天；20 年以上者 18 天。

## 三、审批流程 (SOP)
员工在 HR 系统提报 [[wiki/terms/leave-req.md]]，3 天以内主管审批，3 天以上分管 VP 终审。`);
    }
  };

  // Filter documents
  const filteredDocs = rawDocs.filter(doc => {
    // Format filter
    if (formatFilter === 'pdf' && doc.sourceType !== 'pdf') return false;
    if (formatFilter === 'excel' && doc.sourceType !== 'excel' && doc.sourceType !== 'csv') return false;
    if (formatFilter === 'word' && doc.sourceType !== 'word' && doc.sourceType !== 'pptx' && doc.sourceType !== 'wps') return false;
    if (formatFilter === 'cloud' && (doc.sourceType === 'pdf' || doc.sourceType === 'excel' || doc.sourceType === 'word')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchPath = doc.path.toLowerCase().includes(q);
      const matchContent = doc.content.toLowerCase().includes(q);
      return matchTitle || matchPath || matchContent;
    }
    return true;
  });

  // Start Ingest Simulation
  const handleStartIngest = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsCompiling(true);
    setIngestStep(1); // Step 1: Layout & Format Parsing

    setTimeout(() => {
      setIngestStep(2); // Step 2: Table Matrix & OCR Vision Recovery
    }, 800);

    setTimeout(() => {
      setIngestStep(3); // Step 3: Multi-Touch Synthesis (Wiki entities)
    }, 1800);

    setTimeout(() => {
      setIngestStep(4); // Step 4: wiki/index.md & log.md append
    }, 2800);

    setTimeout(() => {
      setIngestStep(5); // Step 5: qmd update index
      
      const cleanFileName = `2026-08-18_${newTitle.replace(/[\s\/\\:*?"<>|]/g, '_')}`;
      const rawDocPath = `raw/${cleanFileName}.md`;

      const isFinance = newTitle.includes('财务') || newTitle.includes('损益');
      const isExcel = newTitle.includes('测算') || newTitle.includes('模型') || newSourceType === 'excel';

      const newPages: WikiPage[] = isFinance ? [
        {
          id: `wiki-synthesis-${Date.now()}`,
          path: 'wiki/syntheses/financial-audit-2026-q2.md',
          fileName: 'financial-audit-2026-q2.md',
          frontmatter: {
            title: '2026年半年度集团财务损益与业务线毛利分析综述',
            type: 'synthesis',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: [rawDocPath],
            tags: ['财务', '审计', '毛利率', '综述'],
            status: 'active'
          },
          rawMarkdown: `---\ntitle: "2026年半年度集团财务损益与业务线毛利分析综述"\ntype: "synthesis"\ncreated_at: "2026-08-18"\nupdated_at: "2026-08-18"\nsources:\n  - "${rawDocPath}"\ntags:\n  - "财务"\n  - "审计"\nstatus: "active"\n---\n\n# 2026年半年度集团财务损益与业务线毛利分析综述\n\n## 1. 营收与毛利总结\n基于 PDF 提取表格数据，集团合并营收突破 1.68 亿元，各 BU 综合毛利率维持在 46%~86%。\n\n## 2. 关联出处\n* [[wiki/sops/travel-reimbursement.md]]\n* [[wiki/terms/per-diem.md]]`,
          content: `# 2026年半年度集团财务损益与业务线毛利分析综述...`,
          outgoingLinks: ['wiki/sops/travel-reimbursement.md', 'wiki/terms/per-diem.md'],
          wordCount: 520
        },
        {
          id: `wiki-sop-${Date.now()}`,
          path: 'wiki/sops/financial-audit-compliance.md',
          fileName: 'financial-audit-compliance.md',
          frontmatter: {
            title: '集团财务审计与运营费用报销合规 SOP',
            type: 'sop',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: [rawDocPath],
            tags: ['财务', 'SOP', '合规'],
            status: 'active'
          },
          rawMarkdown: `---\ntitle: "集团财务审计与运营费用报销合规 SOP"\ntype: "sop"\ncreated_at: "2026-08-18"\nupdated_at: "2026-08-18"\nsources:\n  - "${rawDocPath}"\ntags:\n  - "财务"\n  - "SOP"\nstatus: "active"\n---\n\n# 集团财务审计与运营费用报销合规 SOP\n\n规范报销审核周期与 Per Diem 补贴标准执行路径。`,
          content: `# 集团财务审计与运营费用报销合规 SOP...`,
          outgoingLinks: ['wiki/terms/per-diem.md'],
          wordCount: 420
        }
      ] : [
        {
          id: `wiki-product-${Date.now()}`,
          path: 'wiki/products/enterprise-product-matrix.md',
          fileName: 'enterprise-product-matrix.md',
          frontmatter: {
            title: `${newTitle.slice(0, 12)} 产品模型与业务矩阵`,
            type: 'product',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: [rawDocPath],
            tags: ['产品', '测算'],
            status: 'active'
          },
          rawMarkdown: `---\ntitle: "${newTitle.slice(0, 12)} 产品模型与业务矩阵"\ntype: "product"\ncreated_at: "2026-08-18"\nupdated_at: "2026-08-18"\nsources:\n  - "${rawDocPath}"\ntags:\n  - "产品"\nstatus: "active"\n---\n\n# ${newTitle.slice(0, 12)} 产品模型与业务矩阵\n\n从原始数据提取的产品架构与经济指标定义。`,
          content: `# ${newTitle.slice(0, 12)} 产品模型与业务矩阵...`,
          outgoingLinks: ['wiki/terms/qmd.md'],
          wordCount: 480
        },
        {
          id: `wiki-term-${Date.now()}`,
          path: 'wiki/terms/infra-cost-model.md',
          fileName: 'infra-cost-model.md',
          frontmatter: {
            title: '轻量化基础设施成本模型 (Infra Cost Model)',
            type: 'term',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: [rawDocPath],
            tags: ['术语', '成本', 'qmd'],
            status: 'active'
          },
          rawMarkdown: `---\ntitle: "轻量化基础设施成本模型 (Infra Cost Model)"\ntype: "term"\ncreated_at: "2026-08-18"\nupdated_at: "2026-08-18"\nsources:\n  - "${rawDocPath}"\ntags:\n  - "术语"\nstatus: "active"\n---\n\n# 轻量化基础设施成本模型\n\n基于 qmd 与 Git 纯文本替代云端向量数据库的架构模型。`,
          content: `# 轻量化基础设施成本模型...`,
          outgoingLinks: ['wiki/terms/qmd.md'],
          wordCount: 310
        }
      ];

      // Simulated parsed tables for newly ingested file
      const simulatedTables: ParsedTableData[] = isFinance ? [
        {
          title: 'H1 核心业务营收与毛利率表 (提取自 PDF 第 3 页)',
          sheetName: 'Page 3 - Table 1',
          headers: ['业务板块', 'H1 实际营收', '同比增速', '毛利率', '研发投入比'],
          rows: [
            ['OmniWiki 知识云', '3,240.0 万元', '+192.5%', '82.0%', '34.5%'],
            ['AI 智能客服系统', '4,890.0 万元', '+85.2%', '71.5%', '28.0%'],
            ['企业算力调度', '6,520.0 万元', '+42.0%', '46.0%', '15.2%'],
            ['工位知识共享盘', '2,150.0 万元', '+280.0%', '86.0%', '41.0%']
          ],
          summary: 'PDF 多栏版面解析完毕，跨页表头自动对齐，置信度 99.4%。'
        }
      ] : isExcel ? [
        {
          title: 'Sheet 1: SaaS 单元经济模型 (Unit Economics)',
          sheetName: 'Sheet1 - LTV_CAC',
          headers: ['产品矩阵', '客单价 (ACV)', '获客成本 (CAC)', 'LTV 价值', 'LTV/CAC 比率'],
          rows: [
            ['OmniWiki 标准版', '¥98,000', '¥18,500', '¥372,400', '20.1x'],
            ['OmniWiki 旗舰版', '¥258,000', '¥42,000', '¥1,161,000', '27.6x'],
            ['企业工位网关', '¥58,000', '¥7,200', '¥185,600', '25.8x']
          ],
          summary: 'Excel 多 Sheet 与计算公式提取完毕，已转化为标准矩阵。'
        }
      ] : undefined;

      const newRawDoc: RawDocument = {
        id: `raw-${Date.now()}`,
        fileName: `${cleanFileName}.md`,
        path: rawDocPath,
        title: newTitle,
        sourceType: newSourceType,
        uploadedAt: '2026-08-18 19:50',
        size: `${(newContent.length / 1024).toFixed(1)} KB (已结构化)`,
        content: newContent,
        compiledPagesCount: newPages.length,
        compiledPagePaths: newPages.map(p => p.path),
        parserMeta: {
          pageCount: isFinance ? 24 : isExcel ? 3 : 10,
          tableCount: simulatedTables ? simulatedTables.length : 1,
          ocrApplied: newSourceType === 'pdf',
          ocrConfidence: 0.994,
          wordCount: Math.round(newContent.length * 1.5),
          originalFormat: newSourceType as any,
          layoutMode: newSourceType === 'pdf' ? 'multi_column' : newSourceType === 'excel' ? 'tabular' : 'hierarchical',
          parsingLatencyMs: 280,
          extractionPipeline: [
            newSourceType === 'pdf' ? 'LayoutLMv3 (双栏版面解构)' : newSourceType === 'excel' ? 'Sheet2Matrix (工作表矩阵提取)' : 'DocxHierarchicalParser',
            'TableTransformer (表格矩阵还原)',
            'PaddleOCR 3.0 (多模态视觉兜底)',
            'MarkdownWeaver (结构化编织)'
          ]
        },
        parsedTables: simulatedTables
      };

      setCompiledResults({
        newPages,
        summary: `成功深度解析复杂文档与表格，Multi-Touch 编织编译生成 ${newPages.length} 个标准 Wiki 实体，已写入 index.md 并通过 qmd update 构建倒排与向量混合索引。`
      });

      onAddRawDoc(newRawDoc, newPages);
      setSelectedDoc(newRawDoc);
      setIsCompiling(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 3800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Multi-Format Parser & Ingest Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 p-6 rounded-2xl border border-slate-800 text-white shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Layer 1: raw/ 不可变原始库
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>只读不可篡改 · 凭证级审计追溯</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>多源异构办公文档与复杂表格解析引擎</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              支持企业大量散落的 <strong>复杂多栏 PDF、跨页表格、Excel/CSV 多工作表、Word (.docx/.doc) 大纲与 PPT 幻灯片</strong> 自动提取还原，转化为高保真 Markdown 并由 Agent 编织并网。
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                handlePreFillSample('pdf_finance');
                setIsIngestModalOpen(true);
                setIngestStep(0);
                setCompiledResults(null);
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition shadow-emerald-950"
            >
              <Upload className="w-4 h-4" />
              <span>上传/解析新办公文档</span>
            </button>
          </div>
        </div>

        {/* 4 Engine Capability Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-bold flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>复杂 PDF 解析</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                OCR 99.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              LayoutLMv3 双栏版面解构、剔除页眉页脚与跨页表格对齐
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-bold flex items-center space-x-1">
                <Table className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel / CSV 矩阵</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                多 Sheet 支持
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              多工作表自动遍历、公式计算还原与 Markdown 数据表格转化
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-300 font-bold flex items-center space-x-1">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Word (.docx/.doc)</span>
              </span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-800">
                H1-H6 映射
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              精确保持长篇文档标题大纲、引用框 Callout 与图文混合排版
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-bold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Multi-Touch 并网</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-1.5 py-0.2 rounded border border-purple-800">
                5~15 维基页
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              提取完成后自动编织生成多篇 Wiki 实体并追加 qmd 索引
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw Document Repository List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>原始资料库 (raw/) 索引清单</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">{filteredDocs.length} 份文件</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索原始文件、标题、格式或正文关键词..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Format Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'all', label: '全部格式' },
                { id: 'pdf', label: '📄 PDF 文档' },
                { id: 'excel', label: '📊 Excel 表格' },
                { id: 'word', label: '📝 Word 文档' },
                { id: 'cloud', label: '☁️ 会议/云端' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormatFilter(f.id as any)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    formatFilter === f.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Document Cards Scrollable */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredDocs.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;
              const isPdf = doc.sourceType === 'pdf';
              const isExcel = doc.sourceType === 'excel' || doc.sourceType === 'csv';
              const isWord = doc.sourceType === 'word' || doc.sourceType === 'pptx' || doc.sourceType === 'wps';

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setActiveSheetIndex(0);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono line-clamp-1">{doc.path}</div>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                        isPdf
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : isExcel
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isWord
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {doc.sourceType}
                    </span>
                  </div>

                  {/* Document Parser Metadata Highlights */}
                  {doc.parserMeta && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-600 bg-white/80 p-1.5 rounded-lg border border-slate-200/80">
                      {doc.parserMeta.pageCount && (
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                          {doc.parserMeta.pageCount} 页
                        </span>
                      )}
                      {doc.parserMeta.sheetCount && (
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                          {doc.parserMeta.sheetCount} 个工作表 (Sheets)
                        </span>
                      )}
                      {doc.parserMeta.tableCount && (
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {doc.parserMeta.tableCount} 张表格
                        </span>
                      )}
                      {doc.parserMeta.ocrApplied && (
                        <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                          OCR 矫正
                        </span>
                      )}
                      {doc.parserMeta.parsingLatencyMs && (
                        <span className="text-slate-400">
                          {doc.parserMeta.parsingLatencyMs}ms
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.uploadedAt}</span>
                    </span>
                    <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      编译衍生 {doc.compiledPagesCount} 个 Wiki 实体
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Document Inspector & Table Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
              {/* Header */}
              <div className="p-6 bg-slate-900 text-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Layer 1: {selectedDoc.path}</span>
                  </span>
                  <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                    <span>{selectedDoc.size}</span>
                    <span>·</span>
                    <span>{selectedDoc.uploadedAt}</span>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {selectedDoc.title}
                </h3>

                {/* 4 Detail Sub-Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveDetailTab('markdown')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      activeDetailTab === 'markdown'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>结构化 Markdown 预览</span>
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('tables')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      activeDetailTab === 'tables'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>
                      表格与工作表矩阵 ({selectedDoc.parsedTables?.length || (selectedDoc.content.includes('|') ? 1 : 0)})
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('parser_meta')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      activeDetailTab === 'parser_meta'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>解析管线与 OCR 透视</span>
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('raw_source')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      activeDetailTab === 'raw_source'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>不可变原始源码</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Structured Markdown Preview */}
              {activeDetailTab === 'markdown' && (
                <div className="p-6 space-y-6">
                  {/* Compiled Provenance Network Box */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                      <GitBranch className="w-4 h-4 text-emerald-600" />
                      <span>知识编译衍生网络 (Compiled Wiki Network · 追溯出处)</span>
                    </h4>
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        该原始办公文档通过 LLM Multi-Touch Ingest 编织编译生成了以下 Wiki 页面，点击可直接跳转阅读：
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedDoc.compiledPagePaths.map((path, idx) => (
                          <button
                            key={idx}
                            onClick={() => onNavigateToWikiPage(path)}
                            className="text-xs font-mono bg-white hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-300 font-medium transition flex items-center space-x-1.5 shadow-xs"
                          >
                            <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{path}</span>
                            <ArrowRight className="w-3 h-3 text-emerald-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clean Markdown Viewer */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        结构化 Markdown 提取内容
                      </h4>
                      <button
                        onClick={() => handleCopyText(selectedDoc.content, 'markdown')}
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-medium"
                      >
                        {copiedStatus === 'markdown' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>复制 Markdown</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap">
                      {selectedDoc.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Table Matrix & Sheets Inspector */}
              {activeDetailTab === 'tables' && (
                <div className="p-6 space-y-6">
                  {selectedDoc.parsedTables && selectedDoc.parsedTables.length > 0 ? (
                    <div className="space-y-4">
                      {/* Sheet Switcher Tabs */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-700">工作表 / 表格切换:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedDoc.parsedTables.map((tbl, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveSheetIndex(i)}
                                className={`text-xs px-3 py-1 rounded-lg font-mono transition ${
                                  activeSheetIndex === i
                                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {tbl.sheetName || `Table ${i + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>

                        <span className="text-xs font-mono text-slate-500">
                          共 {selectedDoc.parsedTables.length} 张结构化数据表格
                        </span>
                      </div>

                      {/* Active Table Rendering */}
                      {selectedDoc.parsedTables[activeSheetIndex] && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                              <Table className="w-4 h-4 text-emerald-600" />
                              <span>{selectedDoc.parsedTables[activeSheetIndex].title}</span>
                            </h4>
                            <button
                              onClick={() => {
                                const currentTbl = selectedDoc.parsedTables![activeSheetIndex];
                                const mdTbl = `| ${currentTbl.headers.join(' | ')} |\n| ${currentTbl.headers.map(() => ':---').join(' | ')} |\n${currentTbl.rows.map(r => `| ${r.join(' | ')} |`).join('\n')}`;
                                handleCopyText(mdTbl, 'table_md');
                              }}
                              className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center space-x-1 font-medium"
                            >
                              {copiedStatus === 'table_md' ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>已复制表格 Markdown</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>复制为 Markdown 表格</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Data Grid */}
                          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="p-3 text-center text-slate-400 font-mono w-10">#</th>
                                  {selectedDoc.parsedTables[activeSheetIndex].headers.map((h, idx) => (
                                    <th key={idx} className="p-3 whitespace-nowrap">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                                {selectedDoc.parsedTables[activeSheetIndex].rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50/80 transition">
                                    <td className="p-3 text-center text-slate-400 text-[11px]">{rIdx + 1}</td>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-3 whitespace-nowrap">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {selectedDoc.parsedTables[activeSheetIndex].summary && (
                            <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              💡 提取备注: {selectedDoc.parsedTables[activeSheetIndex].summary}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-200">
                      <Table className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="text-xs font-bold text-slate-700">该文档内嵌数据表格已直接编织至 Markdown 正文</h4>
                      <p className="text-xs text-slate-500">
                        可在「结构化 Markdown 预览」标签页中直接查看或复制表格。
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Extraction Pipeline & OCR Telemetry */}
              {activeDetailTab === 'parser_meta' && (
                <div className="p-6 space-y-6">
                  {selectedDoc.parserMeta ? (
                    <div className="space-y-6">
                      {/* Metric Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-slate-400 text-xs">原始格式</span>
                          <div className="text-sm font-bold font-mono text-slate-900 uppercase">
                            .{selectedDoc.parserMeta.originalFormat || selectedDoc.sourceType}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-slate-400 text-xs">版面解构模式</span>
                          <div className="text-xs font-bold font-mono text-indigo-700">
                            {selectedDoc.parserMeta.layoutMode || '标准文档流'}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-slate-400 text-xs">OCR 视觉置信度</span>
                          <div className="text-sm font-bold font-mono text-emerald-600">
                            {selectedDoc.parserMeta.ocrConfidence ? `${(selectedDoc.parserMeta.ocrConfidence * 100).toFixed(1)}%` : '原生矢量文本'}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-slate-400 text-xs">解析引擎耗时</span>
                          <div className="text-sm font-bold font-mono text-slate-900">
                            {selectedDoc.parserMeta.parsingLatencyMs || 240} ms
                          </div>
                        </div>
                      </div>

                      {/* Pipeline Stepper Visualization */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span>执行解析管道 (Extraction Pipeline Steps)</span>
                        </h4>
                        <div className="space-y-2">
                          {selectedDoc.parserMeta.extractionPipeline?.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                            >
                              <div className="flex items-center space-x-2.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </span>
                                <span className="font-mono font-bold text-slate-800">{step}</span>
                              </div>
                              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                提取成功 ✓
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      该文档为在线协同文档或纯文本，已由标准轻量解析器处理。
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Raw Source & Git Hash */}
              {activeDetailTab === 'raw_source' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                    <span className="font-mono">只读 Git 哈希: blob sha256:{selectedDoc.id.replace('raw-', '')}98f...</span>
                    <span className="text-emerald-700 font-bold">不可变锁定中</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap border border-slate-800">
                    {selectedDoc.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              请在左侧选择一份 Raw 原始资料
            </div>
          )}
        </div>
      </div>

      {/* Complex Document Upload & Ingest Simulation Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>复杂办公文档/表格解析与 Multi-Touch 编译工作台</span>
                </h3>
                <p className="text-xs text-slate-500">
                  支持 PDF、Excel 表格、Word 文档与工位共享文件一键解析，自动编织为 Wiki 实体并更新 qmd 索引
                </p>
              </div>
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
              >
                ✕ 关闭
              </button>
            </div>

            {/* Quick Sample Presets */}
            {!isCompiling && !compiledResults && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">选择企业复杂文档测试预设:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePreFillSample('pdf_finance')}
                      className={`text-xs p-2.5 rounded-xl border text-left transition ${
                        selectedSampleType === 'pdf_finance'
                          ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">📄 财务审计与损益</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">18页 PDF + 跨页表格</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePreFillSample('excel_revenue')}
                      className={`text-xs p-2.5 rounded-xl border text-left transition ${
                        selectedSampleType === 'excel_revenue'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">📊 营收预测与模型</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Excel 3 工作表计算</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePreFillSample('word_arch')}
                      className={`text-xs p-2.5 rounded-xl border text-left transition ${
                        selectedSampleType === 'word_arch'
                          ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">📝 架构安全白皮书</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Word (.docx) 大纲</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePreFillSample('ppt_strategy')}
                      className={`text-xs p-2.5 rounded-xl border text-left transition ${
                        selectedSampleType === 'ppt_strategy'
                          ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">🎯 Q3 战略与 OKR</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">PPT 幻灯片大纲</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">文档名称 / 原始文件名</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="例如: 2026年半年度集团财务审计与经营损益分析报告.pdf"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">文档格式解析器</label>
                      <select
                        value={newSourceType}
                        onChange={e => setNewSourceType(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none bg-white font-medium"
                      >
                        <option value="pdf">📄 PDF 复杂版面与表格识别 (LayoutLM+OCR)</option>
                        <option value="excel">📊 Excel / CSV 多工作表矩阵还原</option>
                        <option value="word">📝 Word (.docx/.doc) 层级大纲映射</option>
                        <option value="pptx">🎯 PPT 幻灯片要点与备注提取</option>
                        <option value="feishu">☁️ 飞书/钉钉云文档 API 同步</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">工位汇聚来源</label>
                      <input
                        type="text"
                        disabled
                        value="工位共享盘 (Z:\ 盘自动并网)"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">提取内容预览 (Markdown + 表格)</label>
                    <textarea
                      rows={6}
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      placeholder="解析提取出的结构化 Markdown 文本..."
                      className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ingest Progress Stepper */}
            {(isCompiling || compiledResults) && (
              <div className="space-y-4 py-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        ingestStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      1
                    </div>
                    <span className={ingestStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      文档格式嗅探、版面解构与多栏分块 (LayoutLMv3)
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        ingestStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      2
                    </div>
                    <span className={ingestStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      表格矩阵恢复与 OCR 视觉文字矫正 (PaddleOCR & TableTransformer)
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        ingestStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      3
                    </div>
                    <span className={ingestStep >= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Agent 执行 Multi-Touch 多页编织编译 (生成 SOP/Product/Synthesis)
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        ingestStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      4
                    </div>
                    <span className={ingestStep >= 4 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      更新 wiki/index.md 单行全局索引与追加 wiki/log.md 操作日志
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        ingestStep >= 5 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      5
                    </div>
                    <span className={ingestStep >= 5 ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      执行 CLI `qmd update` 增量构建 BM25 词表与本地向量倒排索引
                    </span>
                  </div>
                </div>

                {compiledResults && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 mt-4">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>解析与编译入库全部完成！</span>
                    </div>
                    <p className="text-xs text-emerald-800">{compiledResults.summary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              {!isCompiling && !compiledResults ? (
                <>
                  <button
                    onClick={() => setIsIngestModalOpen(false)}
                    className="text-xs text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl"
                  >
                    取消
                  </button>
                  <button
                    disabled={!newTitle || !newContent}
                    onClick={handleStartIngest}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>开始解析并 Ingest 编译</span>
                  </button>
                </>
              ) : compiledResults ? (
                <button
                  onClick={() => setIsIngestModalOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md transition"
                >
                  查看已编译文件
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-emerald-700 font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Agent 正在执行复杂文档解析、表格抽取与 qmd 索引同步...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
