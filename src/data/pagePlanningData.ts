import { PagePlanItem } from '../types';

export const PAGE_PLANNING_ITEMS: PagePlanItem[] = [
  {
    id: 'page-clipper',
    title: '网页剪藏与飞书自动化导入中枢 (Web Clipper & Feishu OpenAPI Ingestion Hub)',
    path: '/workbench/web-feishu-clipper',
    category: '客户端交互层',
    priority: 'P0 核心必备',
    description: '通过开源项目 obsidianmd/obsidian-clipper 与 hx23840/feishu-docs-to-obsidian，无缝打通飞书云文档 (Docx/Wiki)、浏览器剪藏插件与公开互联网 URL。自动降噪清洗正文、转存高清图表附件、注入 YAML Frontmatter 并毫秒级存入 Obsidian Vault 与并网 Wiki。',
    userPersonas: ['全员知识创作者', '产研与行业研究员', '企业知识库管理员', '飞书协同重度办公人员'],
    coreFunctions: [
      '飞书云文档 OpenAPI/Docx/Wiki 无损提取 (保留分栏、Callouts、表格并转存附件图片)',
      'Obsidian 官方 Web Clipper 跨浏览器插件模板与属性变量导出 ({{title}}, {{content}}, {{url}})',
      '全网公开 URL 一键 Jina Reader & Readability 降噪正文与 Markdown AST 生成',
      '企业飞书群聊 / Webhook 自动监听与消息智能归档 (Feishu Inbox Daemon)',
      '自动化注入 Frontmatter 与自动触发 Agent 双向链接 [[wiki/...]] 编织',
      'Obsidian Local REST API (Port 27123) 毫秒级写入本地 Vault'
    ],
    uiComponents: [
      'UniversalUrlExtractorForm (多源链接一键提取器与 5 步动画流水线)',
      'ClippedJobStreamFeed (已剪藏文档库、字符统计与附件转存清单)',
      'OfficialWebClipperTemplateStudio (官方 Web Clipper 模板定义与 JSON 导出器)',
      'OpenSourcePluginEcosystemGrid (GitHub 开源插件生态与 Webhook 配置卡片)'
    ],
    apiEndpoints: [
      'POST /api/clipper/extract-url',
      'POST /api/clipper/feishu/import-docx',
      'GET /api/clipper/templates',
      'POST /api/clipper/webhook/feishu-inbox'
    ],
    wireframeLayout: '顶部自动化指标 + 中部一键提取器与实测案例 + 底部 Clean Markdown 预览与官方插件模板配置'
  },
  {
    id: 'page-realtime',
    title: '企业实时活知识库引擎与动态情报更新流 (Real-time Living Knowledge Engine & Continuous Refresh Stream)',
    path: '/workbench/realtime-intelligence',
    category: '引擎中枢层',
    priority: 'P0 核心必备',
    description: '针对企业知识“瞬息万变、上传即落后”的根本矛盾，打破传统静态 RAG 模式，构建“多源异构采集 -> 降噪清洗 -> AI 分类 -> 事件抽取 -> 动态入库 -> 增量 Embedding -> MCP 实时调用”的 8 步持续刷新流水线，打造企业 AI Agent 实时数据底座。',
    userPersonas: ['企业架构师 & CTO', '知识工程算法负责人', '全员业务决策者与研究员', 'AI Agent 工作流编排者'],
    coreFunctions: [
      '7 类异构数据流持续监听（官网动态、IR财报公告、GitHub Commits、招聘变动、行业新政、专利申请与科技媒体）',
      '8 步动态 Refresh 流水线调度（毫秒级增量更新，拒绝耗时全库重算）',
      '事件与时间线自动抽取引擎 (Living Chronology & Entity Resolution)',
      'Model Context Protocol (MCP) 实时数据探针与双向事件长连接',
      '静态 RAG 与实时活知识库时效性与置信度双盲对比评测',
      'Obsidian Vault 与 qmd 倒排索引秒级增量并网'
    ],
    uiComponents: [
      'PipelineThroughputHealthCard (流水线吞吐与时延健康看板)',
      'LiveIntelligenceStreamTable (实时异构情报流卡片阵列)',
      'LivingChronologyVisualizer (企业动态演化时间线)',
      'McpAgentDualProbeStudio (静态 RAG vs 实时活知识库对比探针)'
    ],
    apiEndpoints: [
      'GET /api/realtime/stream-metrics',
      'POST /api/realtime/trigger-crawler',
      'POST /api/realtime/extract-events',
      'POST /api/realtime/mcp/query-probe'
    ],
    wireframeLayout: '顶部 8 步流水线全景态势 + 中部实时情报捕获流与事件抽取结果 + 底部 MCP Agent 实时问答对比探针'
  },
  {
    id: 'page-obsidian',
    title: 'Obsidian 知识库底层驱动与 Agent 智能体管理中枢 (Obsidian Engine & Agent Backend)',
    path: '/workbench/obsidian-driver',
    category: '引擎中枢层',
    priority: 'P0 核心必备',
    description: '以后端 Agent 智能体深度调用 Obsidian Vault API / Local REST API 为驱动核心，赋予系统 Obsidian 笔记生命周期管理、Dataview DQL 结构化抽取、Canvas 多维白板编排与 Git 自动同步能力，前端作为企业员工高效交互门户。',
    userPersonas: ['企业知识库管理员', 'Agent 算法工程师', 'Obsidian 重度用户与业务研究员', '全员知识创作者'],
    coreFunctions: [
      'Obsidian Local REST API (Port 27123) 毫秒级网关调用与心跳探活',
      'Agent 自动编排 Obsidian Canvas (.canvas) 视觉白板与多维流转关系连线',
      'Obsidian Dataview DQL 引擎执行器 (类 SQL 语法秒级抽取 Frontmatter 结构化数据)',
      'Obsidian 原生 Callouts 规范生成 (> [!NOTE], > [!WARNING], > [!TIP], > [!EXAMPLE])',
      'obsidian:// 协议桌面端与移动端客户端秒级一键双向联动唤醒',
      'Agent 自动触发 Obsidian-Git 增量 commit 与版本历史归档'
    ],
    uiComponents: [
      'ObsidianVaultStatusWidget (Vault 连通状态卡片)',
      'DataviewLiveQueryStudio (DQL 交互查询与表格渲染区)',
      'CanvasInteractiveVisualizer (Canvas 拓扑白板浏览器)',
      'AgentRestApiGatewayLogStream (Agent 实时调用网关审计流)'
    ],
    apiEndpoints: [
      'GET /api/obsidian/vault-status',
      'POST /api/obsidian/dataview/query',
      'POST /api/obsidian/canvas/generate',
      'POST /api/obsidian/notes/sync-vault'
    ],
    wireframeLayout: '顶部 Obsidian Vault 状态看板 + 中部 Canvas 白板与 Dataview DQL 执行器 + 底部 Agent REST API 实时调用流水与 Callouts 语法呈现'
  },
  {
    id: 'page-00',
    title: '电脑工作共享盘挂载与分布式素材汇聚中心 (Workstation Shared Drive Sync Hub)',
    path: '/workbench/shared-drive-sync',
    category: '客户端交互层',
    priority: 'P0 核心必备',
    description: '打通软件研发公司（代码/RFC/API契约）与新媒体创意公司（爆款视频脚本/文案/视觉VI）每台员工电脑与工位共享盘 (Z:\\ 盘 / SMB / Sync Daemon)，随手保存的文件即时秒级汇聚并由 Agent 自动织网并入企业 Wiki。',
    userPersonas: ['各业务部门员工 (研发/编导/文案/策划/设计)', '部门技术负责人', '知识库运维工程师'],
    coreFunctions: [
      '局域网 SMB / WebDAV / Sync Daemon 轻量代理分布式工位挂载配置',
      '跨行业形态即时适配（新媒体创意公司模式 vs 软件研发技术公司模式）',
      '工位电脑与剪辑机工作共享盘实时状态监听 (在线状态、传输速率、同步队列)',
      '散落素材智能识别、OCR文本分词提取与一键全量并网编织 (Batch Multi-Touch Ingest)',
      '素材出处与生成 Wiki 页面反向追踪链'
    ],
    uiComponents: [
      'DeviceWorkstationFleetGrid (工位电脑节点卡片阵列)',
      'ScatteredMaterialHubTable (散落素材自动流与分拣列表)',
      'IndustryArchetypeSwitchBar (行业业务模式切换器)',
      'MountProtocolSetupGuide (Windows/Mac/Linux 挂载指引)'
    ],
    apiEndpoints: [
      'GET /api/shared-drive/devices',
      'POST /api/shared-drive/devices/register',
      'GET /api/shared-drive/materials/pending',
      'POST /api/shared-drive/materials/batch-ingest'
    ],
    wireframeLayout: '顶部行业形态切换与全员一键并网栏 + 中部工位节点状态网格 + 下部散落素材流与提取摘要 + 底部原生挂载配置指南'
  },
  {
    id: 'page-01',
    title: '系统概览与架构拓扑态势 (System Overview & Topology)',
    path: '/dashboard/overview',
    category: '客户端交互层',
    priority: 'P0 核心必备',
    description: '企业知识库的总体运行仪表盘，展示 Layer 1-3 存储与三大引擎的实时数据流动、系统健康分与吞吐量。',
    userPersonas: ['知识库管理员', 'CTO / 架构师', '业务主管'],
    coreFunctions: [
      '3层存储（Raw / qmd / Wiki）与三大引擎（Ingest / Query / Lint）动态数据流可视化拓扑',
      '关键运行指标看板（Raw 收集量、Wiki 编译节点数、双链密度、qmd 索引延迟、健康自愈分）',
      '最近 Ingest 编译事件与 Query 反哺流动态态势卡片',
      '一键触发快速 Ingest、即席 qmd 检索与全库 Lint 巡检入口'
    ],
    uiComponents: [
      'TopologyFlowCanvas (交互式拓扑图)',
      'MetricsBentoGrid (数据指标网格)',
      'LiveEventTimeline (实时操作流水)',
      'QuickActionLauncher (快捷动作栏)'
    ],
    apiEndpoints: [
      'GET /api/system/topology-status',
      'GET /api/system/metrics',
      'GET /api/logs/recent'
    ],
    wireframeLayout: '顶部指标栏 + 中部交互式架构拓扑动效区 + 底部最近活动与系统引擎健康卡片'
  },
  {
    id: 'page-02',
    title: 'Raw 原始资料库与 Ingest 编译工作台 (Raw Sources & Ingest Engine)',
    path: '/workbench/raw-ingest',
    category: '存储层与工具',
    priority: 'P0 核心必备',
    description: '企业多源散乱资料的不可变存储管理，以及 LLM 驱动的“1 份资料 -> 5-15 页网状 Wiki”多页编织编译中心。',
    userPersonas: ['知识运营人员', '业务文档提交者', '部门主管'],
    coreFunctions: [
      'Raw 文件多格式上传（PDF / Word / Markdown / 飞书妙记 / 钉钉闪记同步模拟）',
      '不可变只读防护机制（确保 Layer 1 不被修改与篡改）',
      'LLM Multi-Touch Ingest 编译可视化模拟器（逐步展示抽取概念、生成 SOP/Product/Project/Term、更新 index.md 与触发 qmd update）',
      '编译溯源链查看（点击任意 Raw 文件可反查其编译生成的所有 Wiki 页面路径）'
    ],
    uiComponents: [
      'RawFileListTable (不可变文件清单)',
      'MultiSourceDropzone (多源拖拽上传组件)',
      'IngestCompilationModal (多页编译执行器与进度追踪)',
      'ProvenanceGraphTree (资料出处溯源树)'
    ],
    apiEndpoints: [
      'POST /api/raw/upload',
      'GET /api/raw/list',
      'POST /api/engine/ingest',
      'GET /api/raw/:id/compiled-pages'
    ],
    wireframeLayout: '左侧 Raw 文件分类树与上传区 + 中间原始 Markdown 只读预览 + 右侧编译衍生 Wiki 页面网络与编译日志'
  },
  {
    id: 'page-03',
    title: 'Wiki 知识网络管理与 Markdown 双链编辑器 (Wiki Network & Editor)',
    path: '/workbench/wiki-network',
    category: '存储层与工具',
    priority: 'P0 核心必备',
    description: '标准化 5 类企业 Wiki 实体（SOP / Product / Project / Term / Synthesis）的浏览、维护、双链跳转与全局单行索引。',
    userPersonas: ['知识维护专家', '全员员工', '内容审计员'],
    coreFunctions: [
      '5 大实体分类树（wiki/sops/, products/, projects/, terms/, syntheses/）',
      '标准 YAML Frontmatter 自动校验与可视化元数据面板',
      '双链自动感知与反向链接 (Backlinks) 引用计数列表',
      'wiki/index.md（全局一句话索引）与 wiki/log.md（操作审计日志）专属维护视图',
      '富文本 / Markdown 双模预览与源码编辑'
    ],
    uiComponents: [
      'EntityCategoryTabs (5大实体切换卡)',
      'MarkdownEditorWithPreview (支持 [[wiki/...]] 语法高亮的编辑器)',
      'FrontmatterInspector (元数据检查栏)',
      'BacklinksDrawer (反向引用抽屉)',
      'IndexLogViewer (核心全局文件查看器)'
    ],
    apiEndpoints: [
      'GET /api/wiki/pages',
      'GET /api/wiki/page/:id',
      'PUT /api/wiki/page/:id',
      'GET /api/wiki/backlinks/:path',
      'GET /api/wiki/index-log'
    ],
    wireframeLayout: '左侧 5 分类实体树 + 中间 Markdown 实时阅读/编辑区 + 右侧 Frontmatter 与反向引用网络侧边栏'
  },
  {
    id: 'page-04',
    title: 'Obsidian 风格企业双链知识图谱 (Interactive Knowledge Graph)',
    path: '/views/knowledge-graph',
    category: '客户端交互层',
    priority: 'P1 生产就绪',
    description: '全景可视化企业知识网络拓扑，直观呈现各实体间的交叉引用密度、孤立节点与断链悬空点。',
    userPersonas: ['架构师', '知识管理者', '探索式阅读员工'],
    coreFunctions: [
      '基于物理力导向的企业 Wiki 关系图谱，节点颜色按 5 大实体类型区分',
      '节点引力/排斥力调节与实体类型过滤筛选（可隐藏/显示 Term、SOP 等）',
      '悬空断链 (Dangling Nodes) 与孤立孤岛 (Orphan Nodes) 高亮警示',
      '点击节点即刻展开侧边栏页面速览与跳转'
    ],
    uiComponents: [
      'ForceGraphCanvas (交互式 Canvas 知识图谱)',
      'GraphFilterToolbar (类型与连通度过滤条)',
      'NodeQuickPreviewPanel (节点速览卡片)',
      'GraphPhysicsControl (力导向参数调节盘)'
    ],
    apiEndpoints: [
      'GET /api/graph/nodes-and-edges',
      'GET /api/graph/cluster-stats'
    ],
    wireframeLayout: '全屏自适应 Canvas 知识图谱 + 左上角控制浮窗 + 右侧选中节点详情浮动面板'
  },
  {
    id: 'page-05',
    title: '`qmd` 混合检索与智能问答中枢 (qmd Hybrid Search & Query Q&A)',
    path: '/engine/query-hub',
    category: '引擎中枢层',
    priority: 'P0 核心必备',
    description: '企业核心查询引擎，融合 qmd 毫秒级 BM25 精确匹配与本地向量语义，提供忠实溯源回答与 Two-Output 知识反哺写回。',
    userPersonas: ['全体企业员工', '售前咨询师', '客服坐席'],
    coreFunctions: [
      'qmd 混合检索调试面板（输入关键词，查看 BM25 词法分 + 向量语义分 + 最终混合加权分）',
      '严格基于召回 Wiki 页面（Top-3~5）的忠实问答，杜绝模型幻觉并附带 [[wiki/...]] 引用来源',
      '**Two-Output 知识反哺写回机制**：将高价值跨文档对比/总结一键反哺写入 `wiki/syntheses/` 并自动触发 `qmd update`',
      '检索召回性能监控（命中率、分词耗时、向量余弦相似度分布）'
    ],
    uiComponents: [
      'QmdHybridSearchTester (qmd 混合检索评分测试台)',
      'RAGContextChatBubble (带上下文装载的会话气泡)',
      'SourceCitationChips (引用的 Wiki 来源标签)',
      'SynthesisBackfeedModal (反哺存为 Synthesis 综述弹窗)'
    ],
    apiEndpoints: [
      'POST /api/qmd/search',
      'POST /api/qmd/update',
      'POST /api/engine/query',
      'POST /api/engine/backfeed-synthesis'
    ],
    wireframeLayout: '左侧 qmd 混合检索评分命中分析栏 + 右侧大模型忠实问答与一键反哺写回对话流'
  },
  {
    id: 'page-06',
    title: '企业 IM 机器人多端交互模拟终端 (IM Bot Simulation Terminal)',
    path: '/clients/im-bots',
    category: '客户端交互层',
    priority: 'P1 生产就绪',
    description: '模拟飞书、钉钉、企业微信机器人集成场景，支持员工在 IM 群内丢文档自动 Ingest 与单聊/群聊智能问答。',
    userPersonas: ['一线办公员工', 'IM 运维工程师'],
    coreFunctions: [
      '飞书 (Feishu) / 钉钉 (DingTalk) / 企业微信 (WeCom) 主题界面一键切换',
      '在聊天对话中直接发送 Raw 附件触发后台 Ingest 编译流程',
      '在群聊中 @机器人 进行自然语言提问与即时卡片式回复',
      'IM Webhook 与回调鉴权配置参数指引'
    ],
    uiComponents: [
      'IMPlatformSelector (飞书/钉钉/企微皮肤切换器)',
      'InteractiveIMChatWindow (高仿 IM 对话窗)',
      'BotWebhookConfigCard (Webhook 接入配置卡)'
    ],
    apiEndpoints: [
      'POST /api/webhook/feishu',
      'POST /api/webhook/dingtalk',
      'POST /api/webhook/wecom'
    ],
    wireframeLayout: '左侧 IM 平台配置与场景选择 + 中间逼真的移动端/桌面端 IM 聊天模拟界面 + 右侧交互事件日志'
  },
  {
    id: 'page-07',
    title: '知识库健康体检与自愈中心 (Lint Engine & Auto-Healing)',
    path: '/engine/lint-health',
    category: '引擎中枢层',
    priority: 'P0 核心必备',
    description: '定时与手动触发全库巡检，扫描悬空断链、孤立节点与过时/矛盾条款，一键自愈修复并输出健康周报。',
    userPersonas: ['知识治理管理员', '质检工程师', '合规负责人'],
    coreFunctions: [
      '全库 Lint 巡检扫描（悬空双链 `[[...]]`、孤立节点、YAML 缺失、矛盾/过时政策）',
      '一键智能自愈（对高频断链自动在 `wiki/terms/` 生成待补全草稿页；为旧条款添加 `[⚠️ 疑似冲突]` 标签）',
      '全库健康评分计算与趋势图（健康分 = 满分 - 断链惩罚 - 孤立惩罚 - 矛盾惩罚）',
      '《知识库健康体检与自愈周报》一键导出与邮件/IM 广播'
    ],
    uiComponents: [
      'HealthScoreRadial (健康分仪表盘)',
      'LintIssuesDataGrid (待修复问题清单)',
      'AutoHealActionPanel (一键自愈操作条)',
      'WeeklyReportExporter (周报预览与导出模态框)'
    ],
    apiEndpoints: [
      'POST /api/engine/lint/scan',
      'POST /api/engine/lint/auto-heal',
      'GET /api/engine/lint/report'
    ],
    wireframeLayout: '顶部健康度得分与三类核心问题卡片 + 中部问题排查修复列表 + 底部自动化巡检 Cron 配置与周报导出'
  },
  {
    id: 'page-08',
    title: '系统治理规范与 Schema 模板中心 (Governance & Schema Studio)',
    path: '/governance/schema-studio',
    category: '系统治理与运维',
    priority: 'P1 生产就绪',
    description: '`.agent/schema.md` 规则的可视化配置与 5 大实体（SOP/Product/Project/Term/Synthesis）Markdown 模板管理。',
    userPersonas: ['系统架构师', '知识治理委员会'],
    coreFunctions: [
      '`.agent/schema.md` 规则源文件查看与语法高亮',
      '5 大实体结构规范可视化约束查看（核心字段、必填章节、适用场景）',
      '新建 Wiki 页面时的 Schema 实时合规性校验器',
      'Agent 提示词与治理行为准则导出'
    ],
    uiComponents: [
      'SchemaRulesViewer (治理规则阅读器)',
      'EntityTemplateGallery (实体模板库)',
      'SchemaComplianceChecker (合规检测器)'
    ],
    apiEndpoints: [
      'GET /api/governance/schema',
      'PUT /api/governance/schema',
      'POST /api/governance/validate-page'
    ],
    wireframeLayout: '左侧 5 类实体 Schema 标准规范面板 + 中间 schema.md Markdown 查看与编辑 + 右侧模板快速复制区'
  },
  {
    id: 'page-09',
    title: 'Git 变更审计与操作流水日志 (Git Audit & wiki/log.md)',
    path: '/governance/git-audit-log',
    category: '系统治理与运维',
    priority: 'P1 生产就绪',
    description: '基于 Git 文件系统的全量不可变审计日志，记录每次 Ingest 编译、Query 反哺与 Lint 自愈动作。',
    userPersonas: ['安全审计员', '知识管理员', '运维开发'],
    coreFunctions: [
      '`wiki/log.md` 追加式流水实时解析展示',
      'Git Commit 历史时间线（支持按 Ingest/Query/Lint/Edit 类型筛选）',
      '单次编译影响面对比（Diff 视图展示关联修改的 5-15 个页面）',
      '知识库版本一键回滚与安全审计导出'
    ],
    uiComponents: [
      'GitCommitTimeline (Git 提交时间轴)',
      'LogMdRawViewer (wiki/log.md 原生查看器)',
      'DiffImpactInspector (多页 Diff 影响面分析卡)'
    ],
    apiEndpoints: [
      'GET /api/git/commits',
      'GET /api/git/log-md',
      'GET /api/git/diff/:commitId'
    ],
    wireframeLayout: '左侧操作日志时间轴与过滤栏 + 右侧单条操作关联 Wiki 影响面与 Diff 详情'
  },
  {
    id: 'page-10',
    title: '`qmd` 本地引擎配置与 MCP 开发者终端 (qmd CLI & MCP Terminal)',
    path: '/developer/qmd-mcp',
    category: '存储层与工具',
    priority: 'P2 增强体验',
    description: '本地轻量级搜索引擎 `qmd` 的命令行交互模拟、MCP (Model Context Protocol) 服务配置与系统 API 调试。',
    userPersonas: ['后端工程师', 'LLM 应用开发者', 'DevOps'],
    coreFunctions: [
      '模拟交互式终端执行 `qmd search "<query>"`、`qmd update` 与 `qmd status`',
      'MCP Server 配置文件 (`mcp.json`) 一键生成与与 Claude Code / Cursor / Codex 联动指引',
      '本地 SQLite + BM25 词表与 Embedding 向量缓存状态检查',
      'REST API & Webhook 调试沙箱'
    ],
    uiComponents: [
      'InteractiveCliTerminal (交互式 CLI 终端)',
      'McpJsonConfigGenerator (MCP 配置生成器)',
      'IndexCacheInspector (索引缓存统计卡)'
    ],
    apiEndpoints: [
      'POST /api/qmd/exec-command',
      'GET /api/developer/mcp-config'
    ],
    wireframeLayout: '左侧 CLI 终端模拟器 + 右侧 MCP 配置代码块与集成教程'
  }
];

export const ARCHITECTURE_TIERS = [
  {
    tierName: 'Layer 1: Raw 不可变只读层',
    dir: 'raw/',
    badge: '🔒 只读保护',
    color: 'emerald',
    description: '企业原始资料汇聚池，包括 PDF/Word 规章制度、飞书妙记、钉钉闪记、会议记录。严禁 Agent 修改或删除，作为一切知识溯源的根基。'
  },
  {
    tierName: 'Engine Core: qmd 混合搜索引擎',
    dir: 'qmd (CLI & MCP)',
    badge: '⚡ 毫秒级检索',
    color: 'indigo',
    description: '本地轻量级双模检索：结合 BM25 词法精确匹配与本地向量语义匹配。极小内存占用，支持增量 update，专为 Markdown 双链网络优化。'
  },
  {
    tierName: 'Layer 2: Wiki 编译网络层',
    dir: 'wiki/',
    badge: '🤖 Agent 全权托管',
    color: 'blue',
    description: '由 Agent 自动维护的企业“活字典”，包含 5 类标准化实体（SOP/Product/Project/Term/Synthesis）、全局单行索引 index.md 与操作日志 log.md。'
  }
];

export const CORE_ENGINES = [
  {
    name: 'Ingest Engine (摄入编译引擎)',
    flow: '新文件入 raw/ -> LLM 多页编织 -> 修改 5-15 个 Wiki 页 -> 执行 qmd update',
    summary: '解决传统知识库生硬单文件切片痛点，将单份文档自动解构并编织进整个企业双链网络。'
  },
  {
    name: 'Query Engine (查询与反哺引擎)',
    flow: '用户提问 -> qmd 混合检索召回 Top-3~5 -> LLM 忠实回答 -> Two-Output 反哺存为 Synthesis',
    summary: '分层精准检索，杜绝全库上下文溢出；将高质量跨文档深度分析沉淀为新知识，实现复利增长。'
  },
  {
    name: 'Lint Engine (健康巡检自愈引擎)',
    flow: '定时/手动触发 -> 扫描悬空死链与孤立节点 -> 语义排查矛盾条款 -> 自动修复并出具周报',
    summary: '保证知识库历久弥新，彻底解决传统企业 Wiki 随时间推移必然过时、冲突、混乱的顽疾。'
  }
];

export const ENTITY_SCHEMAS_META = [
  {
    type: 'sop',
    name: 'SOP 业务流程',
    path: 'wiki/sops/',
    color: 'emerald',
    purpose: '报销流程、系统部署、离职办理、客服异常应急等标准化作业规范',
    coreFields: '适用对象、前置条件、逐步步骤、常见报错与排查路径、关联术语'
  },
  {
    type: 'product',
    name: 'Product 产品定义',
    path: 'wiki/products/',
    color: 'blue',
    purpose: '产品功能定义、定价策略、版本记录、售前/售后高频 FAQ',
    coreFields: '产品定位、核心功能规格、售前问答 (FAQ)、关联项目与 SOP'
  },
  {
    type: 'project',
    name: 'Project 项目复盘',
    path: 'wiki/projects/',
    color: 'purple',
    purpose: '项目背景、架构设计、技术选型历程、复盘总结与经验教训',
    coreFields: '项目目标、关键里程碑决策、架构技术路径、踩坑复盘与遗留项'
  },
  {
    type: 'term',
    name: 'Term 术语黑话',
    path: 'wiki/terms/',
    color: 'amber',
    purpose: '公司内部缩写、业务黑话、技术专有名词、统一语言表',
    coreFields: '标准定义、企业内部应用场景、易混淆概念对比、同义别名'
  },
  {
    type: 'synthesis',
    name: 'Synthesis 综合综述',
    path: 'wiki/syntheses/',
    color: 'rose',
    purpose: '横向对比表格、季度/跨部门总结、Query 反哺沉淀的高价值专题分析',
    coreFields: '核心结论摘要、多维度横向对比表、论证数据支撑、关联落地 SOP'
  }
];
