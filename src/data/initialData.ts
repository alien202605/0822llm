import { RawDocument, WikiPage, LogEntry } from '../types';

export const INITIAL_RAW_DOCUMENTS: RawDocument[] = [
  {
    id: 'raw-1',
    fileName: '2026-08-10_最新差旅报销与合规制度.pdf.md',
    path: 'raw/2026-08-10_最新差旅报销与合规制度.pdf.md',
    title: '集团2026年最新差旅报销与合规管理细则',
    sourceType: 'pdf',
    uploadedAt: '2026-08-10 09:30',
    size: '42.8 KB',
    content: `# 集团2026年最新差旅报销与合规管理细则 (发布日期: 2026-08-10)

## 一、适用范围
本制度适用于集团全体全职员工、外派顾问及项目临时借调人员。

## 二、差旅补贴 (Per Diem) 标准
1. **一线城市（北上广深、杭州、成都）**：每日生活补贴由 150 元上调为 220 元/天；住宿标准上限为 550 元/天。
2. **二线及其他城市**：每日生活补贴 160 元/天；住宿标准上限为 380 元/天。
3. **特别说明**：2026年8月15日起旧版《2024差旅管理办法》中 120 元/天的标准即刻废止。

## 三、审批与报销流转 (SOP)
1. 差旅前必须在 OA 系统提报《出差事前申请单》（Code: BIZ-TRIP-REQ），需直属主管及财务审核通过。
2. 差旅结束后 7 个自然日内完成电子发票验真与贴票。
3. 报销款项将在审批终审后 3 个工作日内打入薪资卡账户。

## 四、常见合规违规与处罚
严禁虚开“会议费”、“办公用品”顶替餐费；打车需提供行程单。违者追回款项并记入信用档案。`,
    compiledPagesCount: 4,
    compiledPagePaths: [
      'wiki/sops/travel-reimbursement.md',
      'wiki/terms/per-diem.md',
      'wiki/terms/biz-trip-req.md',
      'wiki/syntheses/travel-policy-2026-comparison.md'
    ]
  },
  {
    id: 'raw-2',
    fileName: '2026-08-12_AI智能客服项目复盘与架构选型.md',
    path: 'raw/2026-08-12_AI智能客服项目复盘与架构选型.md',
    title: '智能客服 2.0 项目技术选型与上线复盘纪要',
    sourceType: 'meeting',
    uploadedAt: '2026-08-12 16:45',
    size: '31.2 KB',
    content: `# 智能客服 2.0 项目技术选型与上线复盘纪要

- **时间**：2026年8月12日
- **主持人**：架构师 李雷
- **参会方**：算法组、前端组、业务支持组

## 1. 业务背景
原旧版客服基于简单规则匹配，识别准确率仅 62%，坐席转人工率高达 35%，造成高峰期客服排队等待严重。

## 2. 核心架构与模型选型
- **LLM 算力**：接入 Qwen2.5-72B-Instruct 私有化部署 + DeepSeek-R1 作为复杂问题推理引擎。
- **本地混合检索**：放弃重型 ElasticSearch，全面采用轻量级嵌入式搜索引擎 **\`qmd\`**。
  - 理由：支持本地 SQLite/向量双模检索，毫秒级 BM25 精确匹配与嵌入向量打分，零运维成本。
- **降本增效**：月度基础设施成本下降 74%，问答准确率提升至 91.8%，人工接管率降至 8.2%。

## 3. 遗留问题与 SOP
- 知识库断链问题：需要接入定时 Lint 巡检引擎。
- 上线应急回退 SOP 已同步至财务及运维团队。`,
    compiledPagesCount: 4,
    compiledPagePaths: [
      'wiki/projects/ai-customer-service-2.md',
      'wiki/products/smart-support-agent.md',
      'wiki/terms/qmd.md',
      'wiki/sops/customer-service-incident-response.md'
    ]
  },
  {
    id: 'raw-3',
    fileName: '2026-08-15_新一代企业级SaaS产品定价与售前问答.md',
    path: 'raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md',
    title: '智汇知识引擎 (OmniWiki Enterprise) 产品定价与售前 FAQ',
    sourceType: 'feishu',
    uploadedAt: '2026-08-15 11:20',
    size: '25.6 KB',
    content: `# 智汇知识引擎 (OmniWiki Enterprise) 产品定价与售前 FAQ

## 1. 定位
专为千人以上中大型企业打造的“活字典”通用知识库系统，解决企业文档散乱、离职交接断层与大模型幻觉问题。

## 2. 版本与收费标准
- **标准版 (Standard)**：年费 9.8 万元，支持 500 用户，单知识库 2,000 篇 Wiki。
- **企业旗舰版 (Enterprise)**：年费 25.8 万元，无限用户，私有化部署支持，内置 \`qmd\` 混合引擎与定时自愈 Lint 模块。

## 3. 核心售前问答
- **Q: 相比传统 RAG 向量数据库有何优势？**
  - A: 传统 RAG 是黑盒切块，缺少网状结构；OmniWiki 采用“Agent 编译多页维基 + qmd 混合检索”，所有知识以干净 Markdown 沉淀在 Git 仓库中，透明可控。
- **Q: 数据安全性如何保障？**
  - A: 支持企业私有化部署，Layer 1 Raw 目录严禁修改，完全依托企业本地 Git 鉴权体系。`,
    compiledPagesCount: 3,
    compiledPagePaths: [
      'wiki/products/omniwiki-enterprise.md',
      'wiki/terms/multi-touch-ingest.md',
      'wiki/syntheses/rag-vs-llm-wiki-comparison.md'
    ]
  },
  {
    id: 'raw-karpathy',
    fileName: '2026-04-12_andrej-karpathy-llm-wiki-concept.md',
    path: 'raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md',
    title: 'Andrej Karpathy: LLM Wiki 理论体系与知识编译范式 (Gist: 442a6bf555914893e9891c11519de94f)',
    sourceType: 'manual',
    uploadedAt: '2026-04-12 10:00',
    size: '48.5 KB',
    content: `# Andrej Karpathy: LLM Wiki 知识工程理论与范式革新 (GitHub Gist 442a6bf555914893e9891c11519de94f)

## 1. 传统 RAG 的根本缺陷 (The Fundamental Limits of Naive RAG)
- **检索期临时拼接 (Query-time Search & Jam)**：传统 RAG 在用户提问瞬间才去向量检索切割的 500-token 碎片，丢失了全局跨文档深层语义关联。
- **无记忆沉淀 (Zero Memory Compounding)**：每次问答结束后模型失去记忆，下次问同样或更宏观的全局问题（如“总结过去一年所有项目的踩坑教训”）仍然必须从头切片计算。
- **高幻觉与算力浪费**：在推理时强行让 LLM 上下文容纳大量混乱的原始文档，不仅上下文窗口浪费严重，而且容易引发事实混淆。

## 2. LLM Wiki 范式：编译期预加工 (Compile-Time Synthesis)
- **知识提前编译**：当原始资料（PDF、会议纪要、代码规范、工位文件）进入系统时，由 Agent 在后台**提前编译**为互相链接的标准 Markdown Wiki 页面网络。
- **单调累加与知识复利 (Monotonic Knowledge Compounding)**：随着新资料不断流入和高质量问答写回，知识库的连接密度不断提高、冗余被合并、矛盾被消除，越用越聪明。

## 3. Karpathy 提出的三大闭环 (The 3 Loops of LLM Knowledge Architecture)
1. **Loop 1: Ingestion Loop (多页编织写入环)**：1 份原始资料触发 Agent 跨目录更新 5-15 篇相关 Wiki 实体并维护全局索引。
2. **Loop 2: Query Synthesis Loop (问答反哺写回环)**：用户提问涉及未总结领域时，LLM 检索并回答后，主动将提炼内容以新 Wiki 综述页形式沉淀回库。
3. **Loop 3: Background Linting & Healing Loop (自愈巡检环)**：AI 守护进程定期巡检死链、孤岛与矛盾事实，实现知识库自愈。`,
    compiledPagesCount: 4,
    compiledPagePaths: [
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/terms/knowledge-compounding-monotonicity.md',
      'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ]
  },
  {
    id: 'raw-acmerfight',
    fileName: '2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md',
    path: 'raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md',
    title: 'acmerfight: Karpathy LLM Wiki 理论深度剖析与企业落地解构 (Gist: 1c26b29ef39c0acc20f2e6f1f84e025f)',
    sourceType: 'manual',
    uploadedAt: '2026-04-15 14:30',
    size: '42.1 KB',
    content: `# acmerfight: Karpathy LLM Wiki 企业级落地工程深度解析 (GitHub Gist 1c26b29ef39c0acc20f2e6f1f84e025f)

## 1. 企业级适配的核心工程挑战与突破
- **多源异构素材汇聚**：企业员工电脑、工位共享盘 (Z:盘/SMB)、群聊与设计稿如何无感并网？必须建立自动同步守护进程与 OCR/文本提取管道。
- **轻量级混合检索基座 (\`qmd\`)**：抛弃笨重易崩的分布式向量数据库，采用嵌入式本地混合搜索（BM25 关键词精确匹配 + 稠密向量语义打分），达到微秒级检索响应与零运维。
- **Obsidian 生产力工具链深度融合**：利用 Obsidian 作为人类员工可视化的 Second Brain，后端由 Agent 操纵 Local REST API 完成 Frontmatter 元数据注入、Canvas 拓扑图生成与 Git 协同。

## 2. 知识工程 Schema 刚性约束
- 制定严密的 \`.agent/schema.md\` 元数据标准（type, status, sources, tags, outgoingLinks），杜绝 Agent 生成无序混乱文本。
- 采用不可变 Layer 1 (raw/) 保证企业原始凭证与审计合规绝对安全。`,
    compiledPagesCount: 3,
    compiledPagePaths: [
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ]
  },
  {
    id: 'raw-pdf-finance',
    fileName: '2026-Q2_集团各事业部财务审计与损益多维分析.pdf',
    path: 'raw/2026-Q2_集团各事业部财务审计与损益多维分析.pdf',
    title: '2026年第二季度集团各业务线财务审计、毛利与费用损益多维报表 (PDF 解析已完成)',
    sourceType: 'pdf',
    uploadedAt: '2026-08-16 10:15',
    size: '1.8 MB (PDF矢量 + OCR)',
    parserMeta: {
      pageCount: 18,
      tableCount: 6,
      ocrApplied: true,
      ocrConfidence: 0.994,
      wordCount: 4820,
      originalFormat: 'pdf',
      layoutMode: 'multi_column',
      parsingLatencyMs: 340,
      extractionPipeline: ['LayoutLMv3 (双栏版面识别)', 'TableTransformer (跨页表格还原)', 'PaddleOCR 3.0', 'MarkdownWeaver']
    },
    parsedTables: [
      {
        title: '表 2.1: 2026 Q2 核心业务线收入与毛利率构成 (单位: 万元)',
        sheetName: 'Page 4 - Table 1',
        headers: ['业务板块 / BU', 'Q2 实际营收', '同比增长 (YoY)', '营业成本', '综合毛利率', '预算达成率'],
        rows: [
          ['OmniWiki 知识云', '1,420.5', '+184.2%', '284.1', '80.0%', '118.4%'],
          ['AI 智能客服 2.0', '2,150.0', '+92.6%', '645.0', '70.0%', '107.5%'],
          ['企业私有算力调度', '3,890.2', '+45.1%', '2,139.6', '45.0%', '98.2%'],
          ['企业工位共享网关', '860.0', '+310.5%', '129.0', '85.0%', '143.3%'],
          ['集团总计 / 合并报表', '8,320.7', '+88.9%', '3,197.7', '61.6%', '112.1%']
        ],
        summary: '各业务线毛利率均保持在 45%~85% 之间，软件与知识库订阅毛利最高。'
      },
      {
        title: '表 4.3: 差旅与研发费用合规审计分摊 (单位: 万元)',
        sheetName: 'Page 8 - Table 2',
        headers: ['费用科目', 'Q2 报销总额', 'Per Diem 补贴', '打车/差旅发票', '合规核销率', '异常预警数'],
        rows: [
          ['产研团队', '64.2', '18.4', '45.8', '99.2%', '0 起'],
          ['售前咨询与交付', '128.5', '42.0', '86.5', '98.5%', '1 起 (已更正)'],
          ['KA 大客户拓展', '192.0', '58.6', '133.4', '97.8%', '2 起 (已追回)'],
          ['合计', '384.7', '119.0', '265.7', '98.5%', '3 起']
        ],
        summary: '严格执行 2026 差旅新标准，整体合规核销率达到 98.5%。'
      }
    ],
    content: `# 2026年第二季度集团各业务线财务审计、毛利与费用损益多维报表

> [!NOTE]
> 本文件由 **PDF 复杂版面与表格解析引擎** 自动提取自 18 页扫描与矢量混合 PDF。识别耗时 340ms，置信度 99.4%。

## 一、宏观业绩综述
2026 年第二季度，集团整体合并营收突破 **8,320.7 万元**，同比增长 **88.9%**，预算达成率为 **112.1%**。

## 二、业务线毛利矩阵 (自动提取表格)
| 业务板块 / BU | Q2 实际营收 | 同比增长 (YoY) | 营业成本 | 综合毛利率 | 预算达成率 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OmniWiki 知识云** | 1,420.5 万元 | +184.2% | 284.1 万元 | 80.0% | 118.4% |
| **AI 智能客服 2.0** | 2,150.0 万元 | +92.6% | 645.0 万元 | 70.0% | 107.5% |
| **企业私有算力调度** | 3,890.2 万元 | +45.1% | 2,139.6 万元 | 45.0% | 98.2% |
| **企业工位共享网关** | 860.0 万元 | +310.5% | 129.0 万元 | 85.0% | 143.3% |
| **集团总计 / 合并报表** | **8,320.7 万元** | **+88.9%** | **3,197.7 万元** | **61.6%** | **112.1%** |

## 三、差旅与合规报销审计要点
1. 2026年 8月新规落地后，各 BU 严格遵循 [[wiki/terms/per-diem.md]] 差旅标准，单均报销审批时长由 4.2 天缩短至 1.1 天。
2. 报销流转遵照 [[wiki/sops/travel-reimbursement.md]] 标准，全季度未发生重大违规虚开事项。`,
    compiledPagesCount: 3,
    compiledPagePaths: [
      'wiki/sops/travel-reimbursement.md',
      'wiki/terms/per-diem.md',
      'wiki/syntheses/travel-policy-2026-comparison.md'
    ]
  },
  {
    id: 'raw-excel-model',
    fileName: '2026-年度全产品线营收测算与成本模型.xlsx',
    path: 'raw/2026-年度全产品线营收测算与成本模型.xlsx',
    title: '2026年年度全产品线营收预测、LTV/CAC 测算与服务器成本模型 (Excel 多工作表)',
    sourceType: 'excel',
    uploadedAt: '2026-08-17 14:20',
    size: '840 KB (多Sheet表格)',
    parserMeta: {
      sheetCount: 3,
      tableCount: 3,
      wordCount: 3120,
      originalFormat: 'xlsx',
      layoutMode: 'tabular',
      parsingLatencyMs: 180,
      extractionPipeline: ['OpenPyXL / Sheet2Matrix', 'FormulaEvaluator', 'TypeInference', 'MarkdownTableFormatter']
    },
    parsedTables: [
      {
        title: 'Sheet1: SaaS 单元经济模型 (Unit Economics & LTV/CAC)',
        sheetName: 'Sheet1 - LTV_CAC',
        headers: ['产品版本', '客单价 (ACV)', '获客成本 (CAC)', '用户生命周期', '客户生命周期价值 (LTV)', 'LTV/CAC 比率', '回本周期 (月)'],
        rows: [
          ['OmniWiki 标准版', '¥98,000', '¥18,500', '3.8 年', '¥372,400', '20.1x', '2.3 个月'],
          ['OmniWiki 旗舰版', '¥258,000', '¥42,000', '4.5 年', '¥1,161,000', '27.6x', '2.0 个月'],
          ['智能客服私有化', '¥450,000', '¥85,000', '4.2 年', '¥1,890,000', '22.2x', '2.3 个月'],
          ['企业工位共享盘网关', '¥58,000', '¥7,200', '3.2 年', '¥185,600', '25.8x', '1.5 个月']
        ],
        summary: '全产品线 LTV/CAC 均高于 20x，回本周期在 2.5 个月以内，具备极强的自我造血扩张能力。'
      },
      {
        title: 'Sheet2: 混合引擎与基础设施成本分摊 (Infrastructure Cost Matrix)',
        sheetName: 'Sheet2 - Infra_Cost',
        headers: ['组件 / 模块', '部署模式', '原方案月费用', 'qmd+本地Git月费用', '月度节省额', '降本百分比'],
        rows: [
          ['向量索引与存储', '嵌入式 qmd 本地向量', '¥42,000 (云Milvus)', '¥1,200 (本地SSD)', '¥40,800', '-97.1%'],
          ['倒排关键词检索', 'qmd 内置 SQLite FTS5', '¥18,000 (ElasticSearch)', '¥800 (内存映射)', '¥17,200', '-95.6%'],
          ['版本控制与审计', '本地自建 Git 服务', '¥12,000 (云端 SaaS)', '¥1,500 (自建节点)', '¥10,500', '-87.5%'],
          ['总计 / 月度', '全链路轻量化架构', '¥72,000 / 月', '¥3,500 / 月', '¥68,500 / 月', '-95.1%']
        ],
        summary: '采用 qmd 与 Git 纯文本替代云端重型数据库后，月度基础设施开销从 7.2 万元暴降至 3500 元。'
      }
    ],
    content: `# 2026年年度全产品线营收预测、LTV/CAC 测算与服务器成本模型

> [!TIP]
> 本文件由 **Excel 多工作表智能解析引擎** 自动提取自 \`2026-年度全产品线营收测算与成本模型.xlsx\` (含 3 个 Sheet 与嵌套计算公式)。

## 1. SaaS 单元经济模型 (Sheet 1)
| 产品版本 | 客单价 (ACV) | 获客成本 (CAC) | 用户生命周期 | LTV 价值 | LTV/CAC 比率 | 回本周期 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OmniWiki 标准版** | ¥98,000 | ¥18,500 | 3.8 年 | ¥372,400 | **20.1x** | 2.3 个月 |
| **OmniWiki 旗舰版** | ¥258,000 | ¥42,000 | 4.5 年 | ¥1,161,000 | **27.6x** | 2.0 个月 |
| **智能客服私有化** | ¥450,000 | ¥85,000 | 4.2 年 | ¥1,890,000 | **22.2x** | 2.3 个月 |

## 2. 混合引擎与基础设施成本对比 (Sheet 2)
采用 [[wiki/terms/qmd.md]] 替代传统重型向量数据库与 ElasticSearch 后：
- **原云端数据库月成本**：7.2 万元/月
- **qmd 本地混合检索架构月成本**：仅 3,500 元/月
- **年化开销节省**：超过 **82.2 万元/年**，降本幅度达 **95.1%**。`,
    compiledPagesCount: 2,
    compiledPagePaths: [
      'wiki/products/omniwiki-enterprise.md',
      'wiki/terms/qmd.md'
    ]
  },
  {
    id: 'raw-word-whitepaper',
    fileName: '2026-企业知识引擎架构与安全隔离规范.docx',
    path: 'raw/2026-企业知识引擎架构与安全隔离规范.docx',
    title: '企业知识引擎架构演进、私有化隔离与权限安全白皮书 (Word .docx 规范文档)',
    sourceType: 'word',
    uploadedAt: '2026-08-18 09:40',
    size: '620 KB (Docx富文本)',
    parserMeta: {
      pageCount: 12,
      wordCount: 3650,
      originalFormat: 'docx',
      layoutMode: 'hierarchical',
      parsingLatencyMs: 120,
      extractionPipeline: ['Mammoth DocxParser', 'HeadingDetector (H1-H6)', 'CalloutExtractor', 'CleanMarkdownFormatter']
    },
    content: `# 企业知识引擎架构演进、私有化隔离与权限安全白皮书 (Word 自动编译)

## 一、文档解析与多源异构汇聚
企业日常办公中充斥着复杂的 **PDF、Excel 表格、Word 方案说明与 PPT 演示文档**。知识库必须具备强大的文档版面分析、表格矩阵还原与 OCR 兜底提取能力：
1. **PDF 复杂版面识别**：自动剔除页眉页脚、解析多栏排版与跨页表格。
2. **Excel 表格多 Sheet 还原**：自动抽取公式与单元格对齐，转化为结构化 Markdown 表格。
3. **Word (.docx/.doc) 层级映射**：精确提取 H1~H6 标题大纲与引用 Callout 提示框。

## 二、三层存储架构与不可变合规
- **Layer 1: raw/ (只读不可变)**：任何上传的文件在解析为 Markdown 后原样保存，严禁覆盖篡改。
- **Layer 2: wiki/ (可读可写可自愈)**：由 Agent 智能体编织为标准 Wiki 实体，支持双向链接与单调累加。
- **Layer 3: system/ (索引引擎)**：\`qmd\` 本地混合索引与 SQLite 词表。`,
    compiledPagesCount: 2,
    compiledPagePaths: [
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ]
  }
];

export const INITIAL_WIKI_PAGES: WikiPage[] = [
  // 1. SOPs
  {
    id: 'wiki-sop-1',
    path: 'wiki/sops/travel-reimbursement.md',
    fileName: 'travel-reimbursement.md',
    frontmatter: {
      title: '差旅费用报销与补贴申领标准 SOP',
      type: 'sop',
      created_at: '2026-08-10',
      updated_at: '2026-08-10',
      sources: ['raw/2026-08-10_最新差旅报销与合规制度.pdf.md'],
      tags: ['财务', '报销', '差旅', '补贴'],
      aliases: ['差旅报销流程', '出差报销规范'],
      status: 'active'
    },
    rawMarkdown: `---
title: "差旅费用报销与补贴申领标准 SOP"
type: "sop"
created_at: "2026-08-10"
updated_at: "2026-08-10"
sources:
  - "raw/2026-08-10_最新差旅报销与合规制度.pdf.md"
tags:
  - "财务"
  - "报销"
  - "差旅"
  - "补贴"
aliases:
  - "差旅报销流程"
  - "出差报销规范"
status: "active"
---

# [SOP] 差旅费用报销与补贴申领标准 SOP

## 1. 流程概述
本 SOP 规定了集团全员在因公出差前的事前审批、事中消费合规及事后报销与 [[wiki/terms/per-diem.md]] 差旅补贴申领的标准执行路径。

## 2. 前置条件与准备
1. 具备 OA 协同系统账号与《财务报销模块》操作权限。
2. 提前发起并完成审批通过的 [[wiki/terms/biz-trip-req.md]] 流程。
3. 取得合规的增值税电子普通/专用发票并完成税务抬头校验。

## 3. 详细执行步骤
1. **事前申请**：在出差前至少 3 个工作日提交 [[wiki/terms/biz-trip-req.md]]，明确行程城市、预估费用与业务目的。
2. **凭证收集**：保存差旅期间机酒行程单、火车票报销凭证与打车发票。
3. **填报审核**：差旅结束 7 日内登录报销系统，导入发票，系统将根据城市自动计算 [[wiki/terms/per-diem.md]] 每日补贴额度。
4. **财务打款**：终审通过后，款项将于 3 个工作日内打入薪资账户。

## 4. 常见报错与异常处理
| 报错/异常现象 | 可能原因 | 解决办法/排查路径 |
| :--- | :--- | :--- |
| 发票校验提示“已被报销” | 发票代码重复上传或被其他同事提交 | 登录国税查验平台核对发票原始凭证 |
| 补贴金额不匹配 | 出差城市级别选择错误 | 检查是否选错一线/二线城市分级配置 |
| 超过7天未提交被系统锁定 | 逾期提交触发风控机制 | 联系部门总监进行线下审批特批申请 |

## 5. 关联文档与术语
* [[wiki/terms/per-diem.md]]
* [[wiki/terms/biz-trip-req.md]]
* [[wiki/syntheses/travel-policy-2026-comparison.md]]
`,
    content: `# [SOP] 差旅费用报销与补贴申领标准 SOP\n\n## 1. 流程概述\n本 SOP 规定了集团全员在因公出差前的事前审批、事中消费合规及事后报销与 [[wiki/terms/per-diem.md]] 差旅补贴申领的标准执行路径...`,
    outgoingLinks: [
      'wiki/terms/per-diem.md',
      'wiki/terms/biz-trip-req.md',
      'wiki/syntheses/travel-policy-2026-comparison.md'
    ],
    wordCount: 840
  },
  {
    id: 'wiki-sop-2',
    path: 'wiki/sops/customer-service-incident-response.md',
    fileName: 'customer-service-incident-response.md',
    frontmatter: {
      title: 'AI智能客服异常与降级接管应急 SOP',
      type: 'sop',
      created_at: '2026-08-12',
      updated_at: '2026-08-12',
      sources: ['raw/2026-08-12_AI智能客服项目复盘与架构选型.md'],
      tags: ['客服', '运维', '应急预案', 'AI'],
      status: 'active'
    },
    rawMarkdown: `---
title: "AI智能客服异常与降级接管应急 SOP"
type: "sop"
created_at: "2026-08-12"
updated_at: "2026-08-12"
sources:
  - "raw/2026-08-12_AI智能客服项目复盘与架构选型.md"
tags:
  - "客服"
  - "运维"
  - "应急预案"
  - "AI"
status: "active"
---

# [SOP] AI智能客服异常与降级接管应急 SOP

## 1. 流程概述
当 [[wiki/products/smart-support-agent.md]] 遭遇大模型服务超时或 [[wiki/terms/qmd.md]] 检索索引损坏时，值班工程师与客服组长的降级接管指引。

## 2. 前置条件与准备
1. 具备 Grafana 告警通道通知接收权限。
2. 拥有 Apollo / Nacos 配置中心降级开关推送权限。

## 3. 详细执行步骤
1. **告警触发**：P99 延迟超过 2500ms 或人工接管率瞬时跃升 >25%。
2. **一键降级**：在控制台切换至规则冷备份模式，调用本地轻量提示词。
3. **索引修复**：执行 \`qmd update\` 重新构建 BM25 与向量倒排索引。

## 4. 关联文档与术语
* [[wiki/products/smart-support-agent.md]]
* [[wiki/terms/qmd.md]]
* [[wiki/projects/ai-customer-service-2.md]]
`,
    content: `# [SOP] AI智能客服异常与降级接管应急 SOP...`,
    outgoingLinks: [
      'wiki/products/smart-support-agent.md',
      'wiki/terms/qmd.md',
      'wiki/projects/ai-customer-service-2.md'
    ],
    wordCount: 520
  },

  // 2. Products
  {
    id: 'wiki-product-1',
    path: 'wiki/products/smart-support-agent.md',
    fileName: 'smart-support-agent.md',
    frontmatter: {
      title: '企业智能客服 Agent 2.0 (SmartSupport)',
      type: 'product',
      created_at: '2026-08-12',
      updated_at: '2026-08-14',
      sources: ['raw/2026-08-12_AI智能客服项目复盘与架构选型.md'],
      tags: ['产品定义', 'AI客服', 'LLM', '智能体'],
      aliases: ['SmartSupport', '智能坐席助手'],
      status: 'active'
    },
    rawMarkdown: `---
title: "企业智能客服 Agent 2.0 (SmartSupport)"
type: "product"
created_at: "2026-08-12"
updated_at: "2026-08-14"
sources:
  - "raw/2026-08-12_AI智能客服项目复盘与架构选型.md"
tags:
  - "产品定义"
  - "AI客服"
  - "LLM"
  - "智能体"
aliases:
  - "SmartSupport"
  - "智能坐席助手"
status: "active"
---

# [Product] 企业智能客服 Agent 2.0 (SmartSupport)

## 1. 产品定位与目标客群
面向企业售前与售后咨询场景，基于企业内部 Wiki 知识网络和 [[wiki/terms/qmd.md]] 混合检索技术，提供全天候 7×24 小时高准确率智能应答服务。

## 2. 核心功能与规格
- **双引擎混合检索**：基于 [[wiki/terms/qmd.md]] 的毫秒级 BM25 与向量混合匹配。
- **多轮会话记忆**：精准理解上下文意图，自动关联 [[wiki/products/omniwiki-enterprise.md]] 知识库。
- **坐席协同模式**：提供“AI 独立回复”与“AI 草拟+人工审核”双重模式。

## 3. 常见客户问答 (FAQ)
* **Q: 遇到知识库不存在的冷僻问题如何处理？**
  * A: Agent 会主动转接人工坐席，并自动将对话记录生成待归档工单，供后续 Ingest 编译更新。
* **Q: 系统部署需要哪些依赖？**
  * A: 参考 [[wiki/projects/ai-customer-service-2.md]] 的架构选型说明，支持纯本地部署。

## 4. 关联项目与 SOP
* [[wiki/projects/ai-customer-service-2.md]]
* [[wiki/sops/customer-service-incident-response.md]]
* [[wiki/terms/qmd.md]]
`,
    content: `# [Product] 企业智能客服 Agent 2.0 (SmartSupport)...`,
    outgoingLinks: [
      'wiki/terms/qmd.md',
      'wiki/products/omniwiki-enterprise.md',
      'wiki/projects/ai-customer-service-2.md',
      'wiki/sops/customer-service-incident-response.md'
    ],
    wordCount: 680
  },
  {
    id: 'wiki-product-2',
    path: 'wiki/products/omniwiki-enterprise.md',
    fileName: 'omniwiki-enterprise.md',
    frontmatter: {
      title: '智汇知识引擎 (OmniWiki Enterprise)',
      type: 'product',
      created_at: '2026-08-15',
      updated_at: '2026-08-15',
      sources: ['raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md'],
      tags: ['知识库', '企业SaaS', 'Wiki', 'LLM'],
      aliases: ['OmniWiki', '企业活字典'],
      status: 'active'
    },
    rawMarkdown: `---
title: "智汇知识引擎 (OmniWiki Enterprise)"
type: "product"
created_at: "2026-08-15"
updated_at: "2026-08-15"
sources:
  - "raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md"
tags:
  - "知识库"
  - "企业SaaS"
  - "Wiki"
  - "LLM"
aliases:
  - "OmniWiki"
  - "企业活字典"
status: "active"
---

# [Product] 智汇知识引擎 (OmniWiki Enterprise)

## 1. 产品定位与目标客群
专为追求无基础设施负担、自动编译与可持续演进的企业设计的 LLM 驱动通用知识库系统。基于三层架构设计（Layer 1 Raw 不可变、Layer 2 Wiki 全权编译、[[wiki/terms/qmd.md]] 混合检索）。

## 2. 核心功能与规格
- **自动多页编译**：单份 Raw 资料自动编织 5-15 个 Wiki 页面（[[wiki/terms/multi-touch-ingest.md]]）。
- **知识自愈 Lint 引擎**：每周自动巡检断链、孤立节点与事实冲突。
- **反哺写回机制 (Two-Output Rule)**：跨文档深度提问自动沉淀为 Synthesis 综述。

## 3. 关联文档与对比
* [[wiki/syntheses/rag-vs-llm-wiki-comparison.md]]
* [[wiki/terms/multi-touch-ingest.md]]
* [[wiki/terms/qmd.md]]
`,
    content: `# [Product] 智汇知识引擎 (OmniWiki Enterprise)...`,
    outgoingLinks: [
      'wiki/terms/qmd.md',
      'wiki/terms/multi-touch-ingest.md',
      'wiki/syntheses/rag-vs-llm-wiki-comparison.md'
    ],
    wordCount: 610
  },

  // 3. Projects
  {
    id: 'wiki-project-1',
    path: 'wiki/projects/ai-customer-service-2.md',
    fileName: 'ai-customer-service-2.md',
    frontmatter: {
      title: 'AI智能客服 2.0 架构升级与上线复盘',
      type: 'project',
      created_at: '2026-08-12',
      updated_at: '2026-08-13',
      sources: ['raw/2026-08-12_AI智能客服项目复盘与架构选型.md'],
      tags: ['项目复盘', '技术选型', '客服系统', '架构设计'],
      status: 'active'
    },
    rawMarkdown: `---
title: "AI智能客服 2.0 架构升级与上线复盘"
type: "project"
created_at: "2026-08-12"
updated_at: "2026-08-13"
sources:
  - "raw/2026-08-12_AI智能客服项目复盘与架构选型.md"
tags:
  - "项目复盘"
  - "技术选型"
  - "客服系统"
  - "架构设计"
status: "active"
---

# [Project] AI智能客服 2.0 架构升级与上线复盘

## 1. 项目背景与目标
针对客服排队严重、准确率仅 62% 的痛点，技术团队于 2026 年 Q2 发起 2.0 架构重构，目标将问答准确率提升至 90% 以上并降低 50% 基础设施开销。

## 2. 关键里程碑与决策
* **[2026-06-01]** 项目立项，确认放弃传统重型向量数据库方案。
* **[2026-07-15]** 引入轻量级本地混合搜索引擎 [[wiki/terms/qmd.md]]，完成与 Node.js 服务端的集成。
* **[2026-08-10]** 全量灰度切流至 [[wiki/products/smart-support-agent.md]]，问答准确率达成 91.8%。

## 3. 架构设计与技术路径
1. **数据源层**：以 Markdown 托管于 Git 仓库，与 [[wiki/products/omniwiki-enterprise.md]] 同源。
2. **检索中枢**：通过 \`qmd search\` 获得 Top-3 相关 Wiki 页面，组装 Prompt 送入 Qwen2.5-72B 推理。

## 4. 经验复盘与遗留问题
* 成功经验：[[wiki/terms/qmd.md]] 零运维，极低延迟。
* 遗留问题：部分过时政策需要定期 Lint 巡检排查。

## 5. 关联文档
* [[wiki/products/smart-support-agent.md]]
* [[wiki/sops/customer-service-incident-response.md]]
* [[wiki/terms/qmd.md]]
`,
    content: `# [Project] AI智能客服 2.0 架构升级与上线复盘...`,
    outgoingLinks: [
      'wiki/terms/qmd.md',
      'wiki/products/smart-support-agent.md',
      'wiki/products/omniwiki-enterprise.md',
      'wiki/sops/customer-service-incident-response.md'
    ],
    wordCount: 750
  },

  // 4. Terms
  {
    id: 'wiki-term-1',
    path: 'wiki/terms/per-diem.md',
    fileName: 'per-diem.md',
    frontmatter: {
      title: '差旅津贴 / 每日生活补助 (Per Diem)',
      type: 'term',
      created_at: '2026-08-10',
      updated_at: '2026-08-10',
      sources: ['raw/2026-08-10_最新差旅报销与合规制度.pdf.md'],
      tags: ['术语', '财务', '补贴'],
      aliases: ['Per Diem', '出差生活补助', '差补'],
      status: 'active'
    },
    rawMarkdown: `---
title: "差旅津贴 / 每日生活补助 (Per Diem)"
type: "term"
created_at: "2026-08-10"
updated_at: "2026-08-10"
sources:
  - "raw/2026-08-10_最新差旅报销与合规制度.pdf.md"
tags:
  - "术语"
  - "财务"
  - "补贴"
aliases:
  - "Per Diem"
  - "出差生活补助"
  - "差补"
status: "active"
---

# [Term] 差旅津贴 / 每日生活补助 (Per Diem)

## 1. 标准定义
**Per Diem**（源自拉丁语“按日计算”），指公司按出差自然天数定额发放给员工的餐饮与市内交通综合补贴，无需提供发票对账。

## 2. 企业内部应用场景
根据 2026 最新标准，公司内部执行分级差补：
- **一线城市**：220 元/人/天
- **二线及其他城市**：160 元/人/天
具体报销发起请参照 [[wiki/sops/travel-reimbursement.md]]。

## 3. 易混淆概念对比
* **与差旅住宿费的区别**：住宿费需实报实销并严格提供机打发票；Per Diem 为免发票定额包干。
`,
    content: `# [Term] 差旅津贴 / 每日生活补助 (Per Diem)...`,
    outgoingLinks: [
      'wiki/sops/travel-reimbursement.md'
    ],
    wordCount: 420
  },
  {
    id: 'wiki-term-2',
    path: 'wiki/terms/biz-trip-req.md',
    fileName: 'biz-trip-req.md',
    frontmatter: {
      title: '出差事前申请单 (BIZ-TRIP-REQ)',
      type: 'term',
      created_at: '2026-08-10',
      updated_at: '2026-08-10',
      sources: ['raw/2026-08-10_最新差旅报销与合规制度.pdf.md'],
      tags: ['术语', '行政', '审批流'],
      aliases: ['事前申请', '出差申请'],
      status: 'active'
    },
    rawMarkdown: `---
title: "出差事前申请单 (BIZ-TRIP-REQ)"
type: "term"
created_at: "2026-08-10"
updated_at: "2026-08-10"
sources:
  - "raw/2026-08-10_最新差旅报销与合规制度.pdf.md"
tags:
  - "术语"
  - "行政"
  - "审批流"
aliases:
  - "事前申请"
  - "出差申请"
status: "active"
---

# [Term] 出差事前申请单 (BIZ-TRIP-REQ)

## 1. 标准定义
OA 系统中用于登记员工出差行程、预估预算与业务依据的必备前置审批表单。

## 2. 企业内部应用场景
未填写或审批未通过前发生的差旅费用，财务系统将禁止报销流转。详见 [[wiki/sops/travel-reimbursement.md]]。
`,
    content: `# [Term] 出差事前申请单 (BIZ-TRIP-REQ)...`,
    outgoingLinks: [
      'wiki/sops/travel-reimbursement.md'
    ],
    wordCount: 310
  },
  {
    id: 'wiki-term-3',
    path: 'wiki/terms/qmd.md',
    fileName: 'qmd.md',
    frontmatter: {
      title: '轻量级本地混合搜索引擎 (qmd)',
      type: 'term',
      created_at: '2026-08-12',
      updated_at: '2026-08-15',
      sources: [
        'raw/2026-08-12_AI智能客服项目复盘与架构选型.md',
        'raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md'
      ],
      tags: ['术语', '搜索', '架构', '向量检索'],
      aliases: ['qmd engine', '混合检索'],
      status: 'active'
    },
    rawMarkdown: `---
title: "轻量级本地混合搜索引擎 (qmd)"
type: "term"
created_at: "2026-08-12"
updated_at: "2026-08-15"
sources:
  - "raw/2026-08-12_AI智能客服项目复盘与架构选型.md"
  - "raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md"
tags:
  - "术语"
  - "搜索"
  - "架构"
  - "向量检索"
aliases:
  - "qmd engine"
  - "混合检索"
status: "active"
---

# [Term] 轻量级本地混合搜索引擎 (qmd)

## 1. 标准定义
**\`qmd\`** 是一款专为 Markdown 知识网络优化的轻量级本地搜索引擎。它融合了 **BM25 词法精确匹配** 与 **本地 Embedding 语义向量检索**，以纯命令行 (CLI) / MCP Server 方式运行，具备极小内存占用与秒级增量更新特性。

## 2. 企业内部应用场景
作为企业通用知识库（LLM Wiki）的核心召回引擎：
- 在 [[wiki/products/omniwiki-enterprise.md]] 中提供 Top-K 高精准度上下文检索。
- 支撑 [[wiki/projects/ai-customer-service-2.md]] 的毫秒级语义问答。
- 在 Ingest/Lint 流程中通过 \`qmd update\` 与 \`qmd search\` 实现即时索引自愈。

## 3. 核心优势
1. **零服务端依赖**：单二进制文件运行，无需维持重量级分布式向量集群。
2. **混合加权**：兼顾专有名词精确命中（如错误码、人名）与自然语言模糊意图理解。
`,
    content: `# [Term] 轻量级本地混合搜索引擎 (qmd)...`,
    outgoingLinks: [
      'wiki/products/omniwiki-enterprise.md',
      'wiki/projects/ai-customer-service-2.md'
    ],
    wordCount: 560
  },
  {
    id: 'wiki-term-4',
    path: 'wiki/terms/multi-touch-ingest.md',
    fileName: 'multi-touch-ingest.md',
    frontmatter: {
      title: '多页编织摄入机制 (Multi-Touch Ingest)',
      type: 'term',
      created_at: '2026-08-15',
      updated_at: '2026-08-15',
      sources: ['raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md'],
      tags: ['术语', '编译', '知识工程'],
      aliases: ['网状编译', '多点摄入'],
      status: 'active'
    },
    rawMarkdown: `---
title: "多页编织摄入机制 (Multi-Touch Ingest)"
type: "term"
created_at: "2026-08-15"
updated_at: "2026-08-15"
sources:
  - "raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md"
tags:
  - "术语"
  - "编译"
  - "知识工程"
aliases:
  - "网状编译"
  - "多点摄入"
status: "active"
---

# [Term] 多页编织摄入机制 (Multi-Touch Ingest)

## 1. 标准定义
指企业级 LLM Wiki 引擎在读取一份原始资料时，拒绝仅生成单份生硬摘要，而是由 Agent 智能体理解上下文后，同时创建与修改 5-15 个具有交叉引用双链的 Wiki 概念页、术语页与 SOP 页面。

## 2. 运作价值
彻底打破传统知识孤岛，使知识在产生的第一刻便织入企业“活字典”网络。应用在 [[wiki/products/omniwiki-enterprise.md]] 核心能力中。
`,
    content: `# [Term] 多页编织摄入机制 (Multi-Touch Ingest)...`,
    outgoingLinks: [
      'wiki/products/omniwiki-enterprise.md'
    ],
    wordCount: 390
  },

  // 5. Syntheses
  {
    id: 'wiki-syn-1',
    path: 'wiki/syntheses/travel-policy-2026-comparison.md',
    fileName: 'travel-policy-2026-comparison.md',
    frontmatter: {
      title: '2024 vs 2026 集团差旅标准与补贴政策演进横向综述',
      type: 'synthesis',
      created_at: '2026-08-10',
      updated_at: '2026-08-10',
      sources: ['raw/2026-08-10_最新差旅报销与合规制度.pdf.md'],
      tags: ['综述', '政策对比', '财务演进'],
      aliases: ['差旅政策对比', '2026差旅变化分析'],
      status: 'active'
    },
    rawMarkdown: `---
title: "2024 vs 2026 集团差旅标准与补贴政策演进横向综述"
type: "synthesis"
created_at: "2026-08-10"
updated_at: "2026-08-10"
sources:
  - "raw/2026-08-10_最新差旅报销与合规制度.pdf.md"
tags:
  - "综述"
  - "政策对比"
  - "财务演进"
aliases:
  - "差旅政策对比"
  - "2026差旅变化分析"
status: "active"
---

# [Synthesis] 2024 vs 2026 集团差旅标准与补贴政策演进横向综述

## 1. 核心结论摘要
1. **补贴普遍上浮**：一线城市 [[wiki/terms/per-diem.md]] 补贴由 150 元涨至 220 元/天（涨幅 46.6%）。
2. **严管审批与合规**：全面强制 [[wiki/terms/biz-trip-req.md]] 事前审批流，取消事后补票特权。
3. **数字化提速**：电子发票验真直连，打款周期由 10 个工作日提速至 3 个工作日。

## 2. 多维度对比分析
| 比较维度 | 2024 旧版规范 | 2026 最新规范 | 影响评估 |
| :--- | :--- | :--- | :--- |
| 一线城市生活补贴 | 150 元/天 | **220 元/天** | 显著提升出差员工生活保障 |
| 一线城市住宿上限 | 450 元/天 | **550 元/天** | 适配主流商务酒店价格变动 |
| 二线城市生活补贴 | 120 元/天 | **160 元/天** | 标准统一，覆盖二线新核心城市 |
| 报销凭证时限 | 30 天内提交 | **7 天内提交** | 降低跨期财务对账成本 |

## 3. 关联落地 SOP
* [[wiki/sops/travel-reimbursement.md]]
* [[wiki/terms/per-diem.md]]
* [[wiki/terms/biz-trip-req.md]]
`,
    content: `# [Synthesis] 2024 vs 2026 集团差旅标准与补贴政策演进横向综述...`,
    outgoingLinks: [
      'wiki/terms/per-diem.md',
      'wiki/terms/biz-trip-req.md',
      'wiki/sops/travel-reimbursement.md'
    ],
    wordCount: 680
  },
  {
    id: 'wiki-syn-2',
    path: 'wiki/syntheses/rag-vs-llm-wiki-comparison.md',
    fileName: 'rag-vs-llm-wiki-comparison.md',
    frontmatter: {
      title: '传统黑盒 RAG 与企业级 LLM Wiki 架构深度选型评估',
      type: 'synthesis',
      created_at: '2026-08-15',
      updated_at: '2026-08-15',
      sources: [
        'raw/2026-08-12_AI智能客服项目复盘与架构选型.md',
        'raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md'
      ],
      tags: ['综述', '技术选型', 'RAG对比', '知识库架构'],
      status: 'active'
    },
    rawMarkdown: `---
title: "传统黑盒 RAG 与企业级 LLM Wiki 架构深度选型评估"
type: "synthesis"
created_at: "2026-08-15"
updated_at: "2026-08-15"
sources:
  - "raw/2026-08-12_AI智能客服项目复盘与架构选型.md"
  - "raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md"
tags:
  - "综述"
  - "技术选型"
  - "RAG对比"
  - "知识库架构"
status: "active"
---

# [Synthesis] 传统黑盒 RAG 与企业级 LLM Wiki 架构深度选型评估

## 1. 核心结论摘要
1. **存储可解释性**：传统 RAG 将文档切片为无意义碎片块（Chunks），难以被人类校对；LLM Wiki 沉淀为结构化 Markdown 页面与语义双链网络。
2. **检索精度与运维**：结合 [[wiki/terms/qmd.md]] 的本地 BM25 + 向量检索，无须高昂的分布式向量数据库运维费用。
3. **知识复利与自愈**：通过 Ingest 编译、Query 反哺写回与 Lint 自动体检，实现知识库持续自主演进。

## 2. 核心维度技术对比表
| 对比维度 | 传统 Naive/Advanced RAG | 企业级 LLM Wiki + qmd |
| :--- | :--- | :--- |
| **底层存储介质** | 向量数据库 (Milvus/Pinecone) + 切片数据库 | 本地 Git 仓库 (Markdown 文件 + YAML Frontmatter) |
| **人类可读性** | 极低（碎片化 Chunk，无法直接浏览阅读） | **极高（结构化标准 Wiki 页面，双链导航）** |
| **更新成本** | 重算全量 Embedding，容易产生过期脏块 | **多页增量编织，单行 index.md 维护** |
| **检索工具** | 纯向量近似相似度 (容易丢失关键数字/专有名词) | **[[wiki/terms/qmd.md]] 混合匹配（BM25 + 语义向量）** |
| **演进自愈** | 无自愈机制，死链与矛盾越积越多 | **定期 Lint 巡检悬空死链与冲突事实** |

## 3. 关联产品与技术
* [[wiki/products/omniwiki-enterprise.md]]
* [[wiki/terms/qmd.md]]
* [[wiki/terms/multi-touch-ingest.md]]
`,
    content: `# [Synthesis] 传统黑盒 RAG 与企业级 LLM Wiki 架构深度选型评估...`,
    outgoingLinks: [
      'wiki/terms/qmd.md',
      'wiki/products/omniwiki-enterprise.md',
      'wiki/terms/multi-touch-ingest.md'
    ],
    wordCount: 790
  },
  {
    id: 'wiki-sop-karpathy-3loop',
    path: 'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
    fileName: 'karpathy-3-loop-knowledge-lifecycle-sop.md',
    frontmatter: {
      title: 'Karpathy 三环知识生命周期标准作业程序 (3-Loop Lifecycle SOP)',
      type: 'sop',
      created_at: '2026-04-12',
      updated_at: '2026-04-15',
      sources: [
        'raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md',
        'raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md'
      ],
      tags: ['SOP', '知识工程', 'Karpathy理论', '生命周期', 'Agent三环'],
      aliases: ['3-Loop 架构流程', 'LLM Wiki 三大闭环'],
      status: 'active'
    },
    rawMarkdown: `---
title: "Karpathy 三环知识生命周期标准作业程序 (3-Loop Lifecycle SOP)"
type: "sop"
created_at: "2026-04-12"
updated_at: "2026-04-15"
sources:
  - "raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md"
  - "raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md"
tags:
  - "SOP"
  - "知识工程"
  - "Karpathy理论"
  - "生命周期"
  - "Agent三环"
aliases:
  - "3-Loop 架构流程"
  - "LLM Wiki 三大闭环"
status: "active"
---

# [SOP] Karpathy 三环知识生命周期标准作业程序 (3-Loop Lifecycle SOP)

> [!NOTE]
> 本流程严格遵循 Andrej Karpathy 在 GitHub Gist (442a6bf555914893e9891c11519de94f) 中定义的知识库演进范式，是企业活字典实现 [[wiki/terms/knowledge-compounding-monotonicity.md]] 知识复利的核心机制。

## 1. 核心流程三环拆解

### 环一：Ingestion Loop (多页编织写入环)
1. **原始文件捕获**：员工保存工位共享盘文件或上传 PDF/会议纪要至 \`raw/\` 目录（不可变只读）。
2. **多点触达编织 (Multi-Touch)**：Agent 自动抽取概念，跨目录创建或增量更新 5-15 篇实体，注入 YAML Frontmatter 与 \`[[wiki/...]]\` 双链。
3. **单行索引维护**：向 \`wiki/index.md\` 与 \`wiki/log.md\` 写入摘要与出处审计。

### 环二：Query Synthesis Loop (问答反哺写回环)
1. **即席混合检索**：通过 [[wiki/terms/qmd.md]] 执行 BM25 关键词与嵌入向量联合召回。
2. **高阶综述推理**：针对跨多篇 Wiki 的全局总结问题，LLM 在给出答案的同时生成综述候选卡片。
3. **沉淀回库**：经人类确认或置信度达标后，自动生成 \`wiki/syntheses/...\` 页面写回知识库。

### 环三：Background Linting & Healing Loop (自愈巡检环)
1. **死链与孤岛探测**：定时扫描未定义引用与零入链页面。
2. **事实冲突消歧**：对比新旧政策有效性，自动注入 \`> [!WARNING]\` 预警或修正建议。

## 2. 关联理论与技术实体
* [[wiki/terms/compile-time-synthesis-vs-rag.md]]
* [[wiki/terms/knowledge-compounding-monotonicity.md]]
* [[wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md]]
`,
    content: `# [SOP] Karpathy 三环知识生命周期标准作业程序...`,
    outgoingLinks: [
      'wiki/terms/knowledge-compounding-monotonicity.md',
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/terms/qmd.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ],
    wordCount: 920
  },
  {
    id: 'wiki-term-compile-time-synthesis',
    path: 'wiki/terms/compile-time-synthesis-vs-rag.md',
    fileName: 'compile-time-synthesis-vs-rag.md',
    frontmatter: {
      title: '编译期预加工 vs 检索期组装 (Compile-Time Synthesis vs Naive RAG)',
      type: 'term',
      created_at: '2026-04-12',
      updated_at: '2026-04-15',
      sources: [
        'raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md',
        'raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md'
      ],
      tags: ['术语', '架构理论', 'RAG对比', '编译范式', 'Karpathy理论'],
      aliases: ['Compile-Time Synthesis', '提前编译范式'],
      status: 'active'
    },
    rawMarkdown: `---
title: "编译期预加工 vs 检索期组装 (Compile-Time Synthesis vs Naive RAG)"
type: "term"
created_at: "2026-04-12"
updated_at: "2026-04-15"
sources:
  - "raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md"
  - "raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md"
tags:
  - "术语"
  - "架构理论"
  - "RAG对比"
  - "编译范式"
  - "Karpathy理论"
aliases:
  - "Compile-Time Synthesis"
  - "提前编译范式"
status: "active"
---

# [Term] 编译期预加工 vs 检索期组装 (Compile-Time Synthesis vs Naive RAG)

> [!TIP]
> **核心区别一句话**：传统 RAG 是在**读数据时临时翻箱倒柜**，而 LLM Wiki 是在**写数据时由智能体提前精心归档编目**。

## 1. 概念定义
* **传统 Naive RAG (Query-Time Chunk & Jam)**：在提问时通过向量相似度检索 500-token 片段拼接为 Context。缺点是割裂了长程上下文、无跨文档推理能力。
* **LLM Wiki (Compile-Time Synthesis)**：写入 raw 文件时，由后台 Agent 进行 Multi-Touch 编译，抽取出规范的 SOP、Product、Term、Synthesis 实体并织入网状双链。

## 2. 关联理论与文档
* [[wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md]]
* [[wiki/terms/knowledge-compounding-monotonicity.md]]
* [[wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md]]
`,
    content: `# [Term] 编译期预加工 vs 检索期组装 (Compile-Time Synthesis vs Naive RAG)...`,
    outgoingLinks: [
      'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
      'wiki/terms/knowledge-compounding-monotonicity.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ],
    wordCount: 650
  },
  {
    id: 'wiki-term-monotonic-compounding',
    path: 'wiki/terms/knowledge-compounding-monotonicity.md',
    fileName: 'knowledge-compounding-monotonicity.md',
    frontmatter: {
      title: '知识单调累加性与网络复利效应 (Monotonic Knowledge Compounding)',
      type: 'term',
      created_at: '2026-04-12',
      updated_at: '2026-04-15',
      sources: ['raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md'],
      tags: ['术语', '知识复利', '单调递增', 'Karpathy理论'],
      aliases: ['Monotonic Compounding', '知识复利'],
      status: 'active'
    },
    rawMarkdown: `---
title: "知识单调累加性与网络复利效应 (Monotonic Knowledge Compounding)"
type: "term"
created_at: "2026-04-12"
updated_at: "2026-04-15"
sources:
  - "raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md"
tags:
  - "术语"
  - "知识复利"
  - "单调递增"
  - "Karpathy理论"
aliases:
  - "Monotonic Compounding"
  - "知识复利"
status: "active"
---

# [Term] 知识单调累加性与网络复利效应 (Monotonic Knowledge Compounding)

> [!SUCCESS]
> **梅特卡夫定律在知识库中的体现**：知识网络的价值与节点数和连接数的平方成正比。

## 1. 核心理论原理
在 Andrej Karpathy 的 LLM Wiki 模型中，知识库的质量随时间呈现**单调递增 (Monotonic)** 趋势：
1. **连接密度递增**：每新增一个页面，都会与已有 5-10 个相关实体建立语义双向锚点。
2. **矛盾持续消歧**：Lint 引擎和 Ingest 引擎会持续用最新事实修正过期陈述。
3. **高频问答沉淀为资产**：好问题通过 Query-Synthesis 反哺转化为固定页面，避免重复计算。

## 2. 关联技术实践
* [[wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md]]
* [[wiki/terms/compile-time-synthesis-vs-rag.md]]
* [[wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md]]
`,
    content: `# [Term] 知识单调累加性与网络复利效应...`,
    outgoingLinks: [
      'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ],
    wordCount: 580
  },
  {
    id: 'wiki-synthesis-theoretical-foundations',
    path: 'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md',
    fileName: 'enterprise-llm-wiki-theoretical-foundations.md',
    frontmatter: {
      title: '企业级 LLM Wiki 理论体系与落地综述 (Karpathy & acmerfight 方案解构)',
      type: 'synthesis',
      created_at: '2026-04-15',
      updated_at: '2026-04-15',
      sources: [
        'raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md',
        'raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md'
      ],
      tags: ['综述', '理论体系', 'Karpathy', 'acmerfight', '架构白皮书'],
      aliases: ['LLM Wiki 理论白皮书', '企业知识库架构理论'],
      status: 'active'
    },
    rawMarkdown: `---
title: "企业级 LLM Wiki 理论体系与落地综述 (Karpathy & acmerfight 方案解构)"
type: "synthesis"
created_at: "2026-04-15"
updated_at: "2026-04-15"
sources:
  - "raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md"
  - "raw/2026-04-15_acmerfight-llm-wiki-enterprise-analysis.md"
tags:
  - "综述"
  - "理论体系"
  - "Karpathy"
  - "acmerfight"
  - "架构白皮书"
aliases:
  - "LLM Wiki 理论白皮书"
  - "企业知识库架构理论"
status: "active"
---

# [Synthesis] 企业级 LLM Wiki 理论体系与落地综述 (Karpathy & acmerfight 方案解构)

> [!EXAMPLE]
> 本综述系统性梳理了 Andrej Karpathy (Gist 442a6bf555914893e9891c11519de94f) 与 acmerfight (Gist 1c26b29ef39c0acc20f2e6f1f84e025f) 提出的 LLM Wiki 理论思想在企业工程中的完整映射。

## 1. 理论演进与工程映射矩阵

| Karpathy 原创理论概念 | acmerfight 企业落地剖析 | OmniWiki 系统工程落地实现 |
| :--- | :--- | :--- |
| **Compile-Time Synthesis** | 避免检索期黑盒切片与高幻觉 | **Agent Ingest 多页编织引擎 (1源→5-15页)** |
| **Monotonic Compounding** | 知识库越用越聪明、连接越来越密 | **双链网络、反向链接与单行 index.md 沉淀** |
| **Loop 1: Ingestion Loop** | 异构素材与共享盘无感接入 | **工位工作共享盘 (Z:盘) + Raw 不可变层** |
| **Loop 2: Query Synthesis** | 问答不再是单次消耗，而是反哺写入 | **qmd 混合问答 + 一键生成 Synthesis 候选页** |
| **Loop 3: Self-Healing** | 周期性死链与矛盾自动排查 | **Lint 健康巡检引擎 + 规则自愈补丁** |
| **Obsidian Plaintext Tooling** | 零厂商锁定，Git 版本控制 | **Obsidian Vault API + Dataview + Canvas** |

## 2. 结论
企业知识库的终极形态，不再是静态的文档网盘，也不再是简单切片的 RAG 向量库，而是由 Agent 智能体驱动、基于 Git 与 Obsidian 的**自愈型、网络状企业活字典**。

## 3. 关联理论与规范
* [[wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md]]
* [[wiki/terms/compile-time-synthesis-vs-rag.md]]
* [[wiki/terms/knowledge-compounding-monotonicity.md]]
* [[wiki/terms/qmd.md]]
* [[wiki/terms/multi-touch-ingest.md]]
`,
    content: `# [Synthesis] 企业级 LLM Wiki 理论体系与落地综述...`,
    outgoingLinks: [
      'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/terms/knowledge-compounding-monotonicity.md',
      'wiki/terms/qmd.md',
      'wiki/terms/multi-touch-ingest.md'
    ],
    wordCount: 1120
  }
];

export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  {
    id: 'log-theory',
    timestamp: '2026-04-15 15:00',
    action: 'INGEST',
    source: 'raw/2026-04-12_andrej-karpathy-llm-wiki-concept.md',
    targetPages: [
      'wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md',
      'wiki/terms/compile-time-synthesis-vs-rag.md',
      'wiki/terms/knowledge-compounding-monotonicity.md',
      'wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md'
    ],
    description: '完成 Andrej Karpathy (Gist 442a6bf555914893e9891c11519de94f) 与 acmerfight 理论白皮书编译，建立 3 环知识生命周期与单调复利模型'
  },
  {
    id: 'log-1',
    timestamp: '2026-08-10 09:35',
    action: 'INGEST',
    source: 'raw/2026-08-10_最新差旅报销与合规制度.pdf.md',
    targetPages: [
      'wiki/sops/travel-reimbursement.md',
      'wiki/terms/per-diem.md',
      'wiki/terms/biz-trip-req.md',
      'wiki/syntheses/travel-policy-2026-comparison.md'
    ],
    description: '完成差旅报销新制度的 4 页网状编译，已更新 wiki/index.md'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-10 09:36',
    action: 'QMD_UPDATE',
    source: 'system/qmd-cli',
    targetPages: ['qmd.idx'],
    description: '执行 qmd update，完成 4 个新页面的 BM25 词表与本地向量倒排索引构建 (耗时 18ms)'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-12 16:50',
    action: 'INGEST',
    source: 'raw/2026-08-12_AI智能客服项目复盘与架构选型.md',
    targetPages: [
      'wiki/projects/ai-customer-service-2.md',
      'wiki/products/smart-support-agent.md',
      'wiki/terms/qmd.md',
      'wiki/sops/customer-service-incident-response.md'
    ],
    description: '完成智能客服2.0复盘纪要编译，生成架构选型与应急SOP'
  },
  {
    id: 'log-4',
    timestamp: '2026-08-12 16:51',
    action: 'QMD_UPDATE',
    source: 'system/qmd-cli',
    targetPages: ['qmd.idx'],
    description: '增量更新 qmd 索引，当前库已包含 8 个活跃页面'
  },
  {
    id: 'log-5',
    timestamp: '2026-08-15 11:25',
    action: 'INGEST',
    source: 'raw/2026-08-15_新一代企业级SaaS产品定价与售前问答.md',
    targetPages: [
      'wiki/products/omniwiki-enterprise.md',
      'wiki/terms/multi-touch-ingest.md',
      'wiki/syntheses/rag-vs-llm-wiki-comparison.md'
    ],
    description: '完成 OmniWiki 企业版售前资料编译，建立 RAG 选型对比综述'
  },
  {
    id: 'log-6',
    timestamp: '2026-08-15 11:26',
    action: 'QMD_UPDATE',
    source: 'system/qmd-cli',
    targetPages: ['qmd.idx'],
    description: '增量同步 qmd 索引，全库双链交叉引用关系构建完毕'
  }
];

export const INITIAL_INDEX_MD_CONTENT = `# 企业全局知识单行索引 (wiki/index.md)
* [[wiki/syntheses/enterprise-llm-wiki-theoretical-foundations.md]] - 企业级 LLM Wiki 理论体系与落地综述 (Karpathy & acmerfight 方案解构). tags: #综述 #理论体系 #Karpathy #架构白皮书
* [[wiki/sops/karpathy-3-loop-knowledge-lifecycle-sop.md]] - Karpathy 三环知识生命周期标准作业程序 (3-Loop Lifecycle SOP). tags: #SOP #知识工程 #生命周期 #Agent三环
* [[wiki/terms/compile-time-synthesis-vs-rag.md]] - 编译期预加工 vs 检索期组装 (Compile-Time Synthesis vs Naive RAG). tags: #术语 #架构理论 #RAG对比 #编译范式
* [[wiki/terms/knowledge-compounding-monotonicity.md]] - 知识单调累加性与网络复利效应 (Monotonic Knowledge Compounding). tags: #术语 #知识复利 #单调递增
* [[wiki/sops/travel-reimbursement.md]] - 差旅费用报销与补贴申领标准 SOP (全员适用). tags: #财务 #报销 #差旅 #补贴
* [[wiki/sops/customer-service-incident-response.md]] - AI智能客服异常与降级接管应急 SOP. tags: #客服 #运维 #应急预案 #AI
* [[wiki/products/smart-support-agent.md]] - 企业智能客服 Agent 2.0 (SmartSupport) 产品说明. tags: #产品定义 #AI客服 #LLM
* [[wiki/products/omniwiki-enterprise.md]] - 智汇知识引擎 (OmniWiki Enterprise) 架构与定价. tags: #知识库 #企业SaaS #Wiki
* [[wiki/projects/ai-customer-service-2.md]] - AI智能客服 2.0 架构升级与上线复盘. tags: #项目复盘 #技术选型 #客服系统
* [[wiki/terms/per-diem.md]] - 差旅津贴 / 每日生活补助 (Per Diem) 2026标准. tags: #术语 #财务 #补贴
* [[wiki/terms/biz-trip-req.md]] - 出差事前申请单 (BIZ-TRIP-REQ) 审批流. tags: #术语 #行政 #审批流
* [[wiki/terms/qmd.md]] - 轻量级本地混合搜索引擎 (qmd) 原理与接入. tags: #术语 #搜索 #架构 #向量检索
* [[wiki/terms/multi-touch-ingest.md]] - 多页编织摄入机制 (Multi-Touch Ingest) 规范. tags: #术语 #编译 #知识工程
* [[wiki/syntheses/travel-policy-2026-comparison.md]] - 2024 vs 2026 集团差旅标准横向对比. tags: #综述 #政策对比 #财务演进
* [[wiki/syntheses/rag-vs-llm-wiki-comparison.md]] - 传统黑盒 RAG 与企业级 LLM Wiki 架构深度选型评估. tags: #综述 #技术选型 #RAG对比
`;

// Export Aliases for Application-wide consumption
export const INITIAL_RAW_DOCS = INITIAL_RAW_DOCUMENTS;
export const INITIAL_LOGS = INITIAL_LOG_ENTRIES;
export const INITIAL_INDEX_MD = INITIAL_INDEX_MD_CONTENT;
export const INITIAL_LINT_ISSUES = [
  {
    id: 'lint-issue-1',
    type: 'dangling_link' as const,
    severity: 'high' as const,
    sourcePath: 'wiki/sops/travel-reimbursement.md',
    targetRef: 'wiki/terms/finance-audit-matrix.md',
    message: '悬空死链：引用的目标页面 [[wiki/terms/finance-audit-matrix.md]] 尚未创建',
    suggestedFix: '在 wiki/terms/ 目录下创建财务审批矩阵标准草稿页',
    autoFixable: true,
    fixed: false
  },
  {
    id: 'lint-issue-2',
    type: 'contradiction' as const,
    severity: 'medium' as const,
    sourcePath: 'wiki/syntheses/travel-policy-2026-comparison.md',
    message: '疑似政策冲突：正文引用了已废止的 120 元/天旧标准',
    suggestedFix: '标注 [已更正废止] 提示并统一更新为 220/160 元最新标准',
    autoFixable: true,
    fixed: false
  },
  {
    id: 'lint-issue-3',
    type: 'orphan_node' as const,
    severity: 'low' as const,
    sourcePath: 'wiki/terms/multi-touch-ingest.md',
    message: '孤岛节点：该术语页面当前入链数较少',
    suggestedFix: '在 wiki/index.md 与相关 SOP 中增加双链引用',
    autoFixable: true,
    fixed: false
  }
];

