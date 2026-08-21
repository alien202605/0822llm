import { RealtimeIntelligenceItem, RealtimePipelineMetric } from '../types';

export const INITIAL_PIPELINE_METRIC: RealtimePipelineMetric = {
  activeWatchers: 24,
  dailyIngestedEvents: 148,
  averageRefreshLatencyMs: 820,
  autoChronologyGenerated: 92,
  mcpQueryCount: 1840,
  staleRiskMitigatedRate: 98.7
};

export interface PipelineStageInfo {
  stepNumber: number;
  id: string;
  name: string;
  nameEn: string;
  description: string;
  throughput: string;
  latency: string;
  status: 'active' | 'optimizing' | 'ready';
  icon: string;
}

export const REALTIME_PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    stepNumber: 1,
    id: 'source-listening',
    name: '1. 多源异构公开数据监听',
    nameEn: 'Multi-Source Live Ingest',
    description: '持续监听企业官网、IR公告、招聘变动、GitHub Commits、行业新闻、专利公开及政策法规等 7 类动态数据流。',
    throughput: '320 req/min',
    latency: '50ms',
    status: 'active',
    icon: 'Radio'
  },
  {
    stepNumber: 2,
    id: 'content-cleaning',
    name: '2. 正文提取与降噪清洗',
    nameEn: 'Boilerplate Stripping & Cleaning',
    description: '剥离导航栏、页脚广告等噪音，抽取高质量正文，生成标准 Clean Markdown AST 与结构化元数据。',
    throughput: '180 doc/min',
    latency: '120ms',
    status: 'active',
    icon: 'Sparkles'
  },
  {
    stepNumber: 3,
    id: 'ai-classification',
    name: '3. AI 语义多维分类与打标',
    nameEn: 'AI Categorization & Tagging',
    description: '通过 LLM 对清洗后的内容进行行业领域分类、业务关联度评级与主体实体对齐。',
    throughput: '240 item/min',
    latency: '260ms',
    status: 'active',
    icon: 'Layers'
  },
  {
    stepNumber: 4,
    id: 'event-extraction',
    name: '4. 事件抽取与时间线识别',
    nameEn: 'Event & Timeline Extraction',
    description: '识别关键时间点、事件主体、因果关系与经营异动，构建企业动态演化画像 (Living Chronology)。',
    throughput: '150 event/min',
    latency: '340ms',
    status: 'active',
    icon: 'CalendarClock'
  },
  {
    stepNumber: 5,
    id: 'wiki-weaving',
    name: '5. 知识动态入库与图谱织网',
    nameEn: 'Wiki Ingest & Link Weaving',
    description: '自动对已有 Wiki 实体文档进行增量追加更新，生成 [[wiki/...]] 双向链接与 Obsidian 节点拓扑。',
    throughput: '95 page/min',
    latency: '180ms',
    status: 'active',
    icon: 'GitMerge'
  },
  {
    stepNumber: 6,
    id: 'incremental-embed',
    name: '6. 增量 Embedding 与向量更新',
    nameEn: 'Incremental Embedding Refresh',
    description: '仅针对增量变更片段执行 Embedding 计算，避免全库重算的巨大算力与时间开销。',
    throughput: '450 chunk/min',
    latency: '90ms',
    status: 'active',
    icon: 'Cpu'
  },
  {
    stepNumber: 7,
    id: 'qmd-refresh',
    name: '7. qmd 倒排索引即席刷新',
    nameEn: 'qmd Index Instant Refresh',
    description: '局部更新 BM25 词频倒排表与前向索引，保证全局检索在毫秒级内感知最新知识变动。',
    throughput: '12,000 qps',
    latency: '< 15ms',
    status: 'active',
    icon: 'Search'
  },
  {
    stepNumber: 8,
    id: 'mcp-agent-call',
    name: '8. Agent 实时调用与 MCP 接口',
    nameEn: 'Agent MCP Probe & Decision Hub',
    description: '通过 Model Context Protocol (MCP) 接口为全员 Agent 提供高置信度、零滞后的实时事实上下文。',
    throughput: '2,400 call/min',
    latency: '< 40ms',
    status: 'active',
    icon: 'Bot'
  }
];

export const INITIAL_REALTIME_INTELLIGENCE: RealtimeIntelligenceItem[] = [
  {
    id: 'intel-01',
    sourceType: 'corporate_web',
    sourceName: 'Acme 官方动态与执委会通告',
    sourceUrl: 'https://acme-corp.internal/news/2026-strategy-update',
    title: 'Acme 集团发布 2026 下半年「Agentic First 知识工程」全员战略升级白皮书',
    capturedAt: '2 分钟前 (21:18:24)',
    summary: '执委会正式通告下半年启动 Agentic 知识中枢与 Obsidian 本地网关融合方案，全面升级混合办公设备补贴。',
    cleanTextPreview: '全体 Acme 同仁：随着大模型技术在企业知识管理领域的突破性进展，执委会决定全面部署 Obsidian Local REST API 私有化节点与 qmd 即席混合检索引擎，实现从“被动撰写”到“智能体主动编译与自愈”的范式跃迁...',
    detectedEvents: [
      '全面接入 Obsidian Local REST API (Port 27123)',
      '启动混合办公 3+2 优化政策与每月设备补贴',
      '发布 2026 年度秋季职级晋升与股权激励窗口'
    ],
    affectedEntities: [
      'wiki/company-info/strategic-notice-2026.md',
      'wiki/company-info/company-overview.md',
      'wiki/company-info/employee-handbook-2026.md'
    ],
    targetWikiPath: 'wiki/company-info/strategic-notice-2026.md',
    status: 'agent_ready',
    importance: 'critical',
    refreshLatencyMs: 740
  },
  {
    id: 'intel-02',
    sourceType: 'regulation',
    sourceName: '国家标准化管理委员会 & 工信部',
    sourceUrl: 'https://std.samr.gov.cn/gb/search/gbDetailed?id=2026-AI-SEC-01',
    title: '《生成式人工智能企业级知识库安全治理与数据合规规范 (GB/T 43697-2026)》正式颁布',
    capturedAt: '15 分钟前 (21:05:12)',
    summary: '明确要求企业知识库在接入大模型 Agent 时必须支持敏感 PII 数据实时过滤、本地私有化数据隔离与审计日志不可篡改。',
    cleanTextPreview: '规范第七条明确指出：企业部署智能体知识增强系统（RAG 及 Living Knowledge Base）时，应具备密钥生命周期管理、本地数据防泄漏（DLP）与变更存证机制，杜绝未清洗的敏感资产上传至不可信公共网络...',
    detectedEvents: [
      '强制要求企业大模型知识中枢具备本地隔离合规能力',
      '要求定期轮转 REST API 密钥并建立审计日志',
      '禁止将客户 PII 数据无授权透传给第三方公有云模型'
    ],
    affectedEntities: [
      'wiki/company-info/employee-handbook-2026.md',
      'wiki/engineering/README.md'
    ],
    targetWikiPath: 'wiki/company-info/employee-handbook-2026.md',
    status: 'agent_ready',
    importance: 'high',
    refreshLatencyMs: 810
  },
  {
    id: 'intel-03',
    sourceType: 'github_repo',
    sourceName: 'modelcontextprotocol / specification (GitHub)',
    sourceUrl: 'https://github.com/modelcontextprotocol/specification/commit/7a29e4',
    title: 'MCP 协议 2.0 正式发布：新增实时活知识库双向订阅 (Live Knowledge Streaming Event)',
    capturedAt: '42 分钟前 (20:38:00)',
    summary: '官方规范新增实时事件管道，支持 Agent 直接订阅知识库的增量更新事件，无需轮询即可秒级接收新事实。',
    cleanTextPreview: 'Commit: feat(spec): add Live Knowledge Streaming Event specification. Agents can now establish dynamic bidirectional subscriptions to Obsidian Vault changes and qmd inverted index delta streams...',
    detectedEvents: [
      'MCP 协议正式支持知识库变更事件双向长连接流',
      '支持从 Obsidian Vault 中实时推送变更 Diff 给 Agent',
      '降低 Agent 定时全量轮询对系统的算力开销'
    ],
    affectedEntities: [
      'wiki/company-info/realtime-living-knowledge-paradigm.md',
      'wiki/engineering/README.md'
    ],
    targetWikiPath: 'wiki/company-info/realtime-living-knowledge-paradigm.md',
    status: 'agent_ready',
    importance: 'high',
    refreshLatencyMs: 650
  },
  {
    id: 'intel-04',
    sourceType: 'ir_announcement',
    sourceName: '行业智能中枢领军企业财报公告 (SEC Filing)',
    sourceUrl: 'https://sec.gov/edgar/data/000184/q2-2026-report',
    title: '行业头部 AI 企业 Q2 财报披露：全面转向企业实时情报与活知识库体系',
    capturedAt: '1 小时前 (20:19:10)',
    summary: '报告指出单纯基于静态文档上传的 RAG 续费率下降 34%，而搭载实时采集与持续 Refresh 的活知识库客户留存率超过 94%。',
    cleanTextPreview: 'Management Discussion & Analysis: Enterprise clients increasingly demand real-time data freshness over static document uploads. Our investment in dynamic web crawlers, real-time entity resolution, and MCP integrations has delivered a 180% increase in Agent-assisted task completion rates...',
    detectedEvents: [
      '市场对实时活知识库的需求增速显著超越静态 RAG',
      '证实数据 Refresh 机制是企业 AI 持续产生商业价值的关键壁垒'
    ],
    affectedEntities: [
      'wiki/company-info/why-enterprises-need-knowledge-base.md',
      'wiki/company-info/realtime-living-knowledge-paradigm.md'
    ],
    targetWikiPath: 'wiki/company-info/why-enterprises-need-knowledge-base.md',
    status: 'agent_ready',
    importance: 'normal',
    refreshLatencyMs: 920
  },
  {
    id: 'intel-05',
    sourceType: 'hiring_shift',
    sourceName: '全球头部科技公司招聘中枢与 LinkedIn 信号',
    sourceUrl: 'https://careers.global-tech.com/search?q=knowledge+engineer',
    title: '硅谷与亚太顶级大厂密集设立「实时知识工程 (Living Knowledge Engineering)」岗位',
    capturedAt: '3 小时前 (18:20:00)',
    summary: '招聘岗位要求具备 Obsidian API 编排、实时数据流清洗、图谱增量更新与 Agent MCP 工具开发经验。',
    cleanTextPreview: 'Job Description: Lead Knowledge Engineer (Real-Time Intelligence). Responsible for designing automated ingestion pipelines for unstructured corporate data, maintaining high-density bi-directional link graphs, and optimizing inverted index refresh latency for autonomous agents...',
    detectedEvents: [
      '实时知识工程成为 Agentic AI 时代的核心紧缺岗位',
      'Obsidian 本地优先与 Markdown 结构化处理成为关键硬技能'
    ],
    affectedEntities: [
      'wiki/company-info/company-overview.md'
    ],
    targetWikiPath: 'wiki/company-info/company-overview.md',
    status: 'agent_ready',
    importance: 'normal',
    refreshLatencyMs: 980
  }
];

export interface RealtimeSimulatedPrompt {
  id: string;
  query: string;
  category: string;
  staticRagAnswer: string;
  realtimeLivingAnswer: string;
  keyDifference: string;
  freshnessGap: string;
}

export const REALTIME_SIMULATED_PROMPTS: RealtimeSimulatedPrompt[] = [
  {
    id: 'sim-01',
    query: '请问我们公司最新的办公政策、设备补贴以及下半年的核心战略技术栈是什么？',
    category: '企业行政与战略',
    staticRagAnswer: '根据 3 个月前上传的《员工入职指引 v2026.1》：公司目前采用全员驻场办公模式，设备由 IT 部门统一集中发放，未提及针对远程网络的额外补贴；战略方向主要为常规微服务架构。',
    realtimeLivingAnswer: '【实时活知识库 + MCP 毫秒级最新召回】\n根据 2 分钟前刚刚捕获并并网的《2026 年度企业重大战略升级与全员行政通告》(ACME-ADMIN-2026-042)：\n1. 办公政策已升级为「混合办公 3+2」(周二/四集中评审，其余弹性远程)；\n2. 公司为混合与全远程员工提供每月专属远程办公与网络补贴；\n3. 下半年核心战略为「Agentic First 知识工程」，全面接入 Obsidian Local REST API (Port 27123) 与 qmd 混合检索引擎！',
    keyDifference: '静态 RAG 遗漏了刚刚生效的混合办公补贴与 Obsidian 战略路线，实时知识库即时给出了 2 分钟前发布的通报事实。',
    freshnessGap: '时效性差距：3 个月 vs 2 分钟前最新事实'
  },
  {
    id: 'sim-02',
    query: '国家对于企业大模型知识库的数据安全与合规有哪些最新硬性标准？',
    category: '法规与安全合规',
    staticRagAnswer: '根据历史法律归档：需遵守《网络安全法》与《个人信息保护法》的一般性原则，未查询到专门针对 Agent 知识库的详细实施指南。',
    realtimeLivingAnswer: '【实时活知识库 + MCP 毫秒级最新召回】\n根据 15 分钟前工信部最新颁布的《生成式人工智能企业级知识库安全治理与数据合规规范 (GB/T 43697-2026)》：\n1. 强制要求企业大模型知识中枢具备本地私有化隔离能力（如本地 Obsidian Vault 加密）；\n2. 严禁将客户 PII 数据未经脱敏上传至公共外部模型；\n3. 必须对 REST API 网关密钥实施季度轮转，并建立不可篡改的存证审计日志。',
    keyDifference: '静态 RAG 无法回答今天刚刚颁布的国家新标准，而实时系统通过政务数据流抓取已自动完成知识入库。',
    freshnessGap: '时效性差距：历史通用法规 vs 15 分钟前国家新规'
  },
  {
    id: 'sim-03',
    query: '为什么我们团队需要放弃传统上传 PDF 做 RAG，转向实时活知识库？',
    category: '技术方法论',
    staticRagAnswer: '传统 RAG 通过向量数据库能较好匹配相似文本，但在大型文档上可能存在切分 Chunk 精度不足的问题。',
    realtimeLivingAnswer: '【实时活知识库 + MCP 毫秒级最新召回】\n基于系统刚沉淀的《从静态 RAG 到企业实时知识库：活知识架构与数据底座》方法论：\n1. **企业知识是活知识**：官网、公告、财报与代码更新极快，上传即过时；\n2. **瓶颈在 Refresh 而非 Retrieval**：传统方式需要繁重的人工重传与全量重建索引，无法长期维系；\n3. **Agent 需要结构化事实底座**：通过 8 步动态流水线（采集->清洗->分类->事件提取->增量Embedding->MCP），为 Agent 提供持续演化的最新事实。',
    keyDifference: '实时知识库直接调用系统最新沉淀的 CLIENT INTEL 架构实践素材，逻辑严密且紧扣 Agent 演进范式。',
    freshnessGap: '深度与认知维度代差'
  }
];
