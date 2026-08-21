export type EntityType = 'sop' | 'product' | 'project' | 'term' | 'synthesis' | 'guide';

export type LayoutMode = 'craft_doc' | 'enterprise_hub';

export type TabType =
  | 'overview'
  | 'console'
  | 'obsidian'
  | 'realtime'
  | 'clipper'
  | 'drive'
  | 'raw'
  | 'wiki'
  | 'graph'
  | 'search'
  | 'lint'
  | 'bot'
  | 'schema'
  | 'planning'
  | 'intelligence';

export type IndustryArchetype = 'software_dev' | 'media_creative' | 'general_enterprise';

export interface Frontmatter {
  title: string;
  type: EntityType;
  created_at: string;
  updated_at: string;
  sources: string[];
  tags: string[];
  aliases?: string[];
  status: 'active' | 'deprecated' | 'draft';
}

export interface WikiPage {
  id: string;
  path: string; // e.g. "wiki/sops/travel-reimbursement.md"
  fileName: string;
  frontmatter: Frontmatter;
  content: string;
  rawMarkdown: string;
  outgoingLinks: string[]; // extracted [[wiki/...]] links
  wordCount: number;
}

export interface ParsedTableData {
  title: string;
  sheetName?: string;
  headers: string[];
  rows: string[][];
  summary?: string;
}

export interface DocumentParserMeta {
  pageCount?: number;
  sheetCount?: number;
  tableCount?: number;
  ocrApplied?: boolean;
  ocrConfidence?: number; // e.g. 0.98
  wordCount?: number;
  originalFormat?: 'pdf' | 'xlsx' | 'xls' | 'docx' | 'doc' | 'pptx' | 'csv' | 'wps' | 'md' | 'txt';
  layoutMode?: 'multi_column' | 'tabular' | 'hierarchical' | 'slide_deck' | 'standard';
  parsingLatencyMs?: number;
  extractionPipeline?: string[]; // e.g. ['LayoutLMv3', 'TableTransformer', 'PaddleOCR', 'MarkdownWeaver']
}

export interface RawDocument {
  id: string;
  fileName: string;
  path: string; // e.g. "raw/2026-08-10_travel-policy.md"
  title: string;
  sourceType: 'pdf' | 'excel' | 'word' | 'pptx' | 'csv' | 'wps' | 'feishu' | 'dingtalk' | 'meeting' | 'manual' | 'shared_drive';
  uploadedAt: string;
  size: string;
  content: string;
  compiledPagesCount: number;
  compiledPagePaths: string[];
  sourceDevice?: string;
  sourceCategory?: string;
  parserMeta?: DocumentParserMeta;
  parsedTables?: ParsedTableData[];
}

export interface QmdSearchResult {
  page: WikiPage;
  bm25Score: number;
  vectorScore: number;
  hybridScore: number;
  matchedSnippets: string[];
  matchType: 'exact_keyword' | 'semantic_vector' | 'hybrid';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action:
    | 'INGEST'
    | 'QUERY_SYNTHESIS'
    | 'LINT_FIX'
    | 'MANUAL_EDIT'
    | 'QMD_UPDATE'
    | 'WIKI_MANUAL_EDIT'
    | 'LINT_AUTO_HEAL'
    | 'SHARED_DRIVE_SYNC'
    | 'OBSIDIAN_REST_API'
    | 'OBSIDIAN_CANVAS_SYNC'
    | 'REALTIME_REFRESH'
    | 'MCP_AGENT_CALL';
  source: string;
  targetPages: string[];
  description: string;
}

export interface LintIssue {
  id: string;
  type: 'dangling_link' | 'orphan_node' | 'contradiction' | 'schema_error' | 'deprecated_reference';
  severity: 'high' | 'medium' | 'low';
  sourcePath: string;
  targetRef?: string;
  message: string;
  suggestedFix: string;
  autoFixable: boolean;
  fixed?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType | 'raw' | 'dangling' | 'drive_node' | 'obsidian_vault';
  path: string;
  connectionsCount: number;
  isOrphan?: boolean;
  isDangling?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
  qmdScores?: { path: string; score: number }[];
  synthesisCandidate?: {
    suggestedTitle: string;
    suggestedPath: string;
    summary: string;
  };
}

// Shared Workstation Drive Sync Models
export interface SharedDriveDevice {
  id: string;
  name: string;
  ownerName: string;
  department: string;
  os: 'macOS' | 'Windows' | 'Linux' | 'NAS';
  ipAddress: string;
  localMountPath: string;
  status: 'online' | 'syncing' | 'idle' | 'offline';
  lastSyncTime: string;
  pendingFilesCount: number;
  totalSyncedFiles: number;
  bandwidthSpeed: string;
  autoIngestToWiki: boolean;
  industry: IndustryArchetype;
}

export interface SharedAssetItem {
  id: string;
  deviceId: string;
  deviceName: string;
  department: string;
  fileName: string;
  relativePath: string;
  size: string;
  category: string;
  fileType: 'doc' | 'code' | 'script' | 'design' | 'video_raw' | 'pdf' | 'audio';
  modifiedAt: string;
  syncState: 'synced_to_raw' | 'compiling_wiki' | 'indexed_qmd' | 'pending_ingest';
  extractedEntitiesCount: number;
  generatedWikiPaths: string[];
  snippetPreview: string;
  industry: IndustryArchetype;
}

// Obsidian Agent & Vault Models
export interface ObsidianVaultConfig {
  vaultName: string;
  vaultLocalPath: string;
  restApiEndpoint: string;
  restApiStatus: 'connected' | 'connecting' | 'idle';
  apiKey: string;
  syncEngine: 'Obsidian Local REST API' | 'Git Vault Sync' | 'Agent Native Daemon';
  activePlugins: string[];
  totalNotes: number;
  totalCanvasFiles: number;
  totalAttachments: number;
  lastSyncTime: string;
}

export interface ObsidianCanvasCard {
  id: string;
  type: 'file' | 'text' | 'group';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  text?: string;
  filePath?: string;
  label?: string;
}

export interface ObsidianCanvasEdgeItem {
  id: string;
  fromNode: string;
  toNode: string;
  fromSide: 'left' | 'right' | 'top' | 'bottom';
  toSide: 'left' | 'right' | 'top' | 'bottom';
  label?: string;
}

export interface ObsidianCanvasFile {
  id: string;
  name: string;
  path: string; // e.g. "wiki/canvases/enterprise-architecture-2026.canvas"
  title: string;
  nodes: ObsidianCanvasCard[];
  edges: ObsidianCanvasEdgeItem[];
  updatedAt: string;
}

export interface ObsidianDataviewQueryPreset {
  id: string;
  title: string;
  dql: string;
  description: string;
  targetFolder: string;
}

export interface ObsidianApiCallLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  agentTask: string;
  status: number;
  latencyMs: number;
  responsePayloadSummary: string;
}

export interface PagePlanItem {
  id: string;
  title: string;
  path: string;
  category: '客户端交互层' | '引擎中枢层' | '存储层与工具' | '系统治理与运维';
  priority: 'P0 核心必备' | 'P1 生产就绪' | 'P2 增强体验';
  description: string;
  userPersonas: string[];
  coreFunctions: string[];
  uiComponents: string[];
  apiEndpoints: string[];
  wireframeLayout: string;
}

export interface RealtimeIntelligenceItem {
  id: string;
  sourceType: 'corporate_web' | 'ir_announcement' | 'github_repo' | 'tech_blog' | 'hiring_shift' | 'patent_filing' | 'regulation';
  sourceName: string;
  sourceUrl: string;
  title: string;
  capturedAt: string;
  summary: string;
  cleanTextPreview: string;
  detectedEvents: string[];
  affectedEntities: string[];
  targetWikiPath: string;
  status: 'captured' | 'cleaned' | 'classified' | 'event_extracted' | 'indexed' | 'agent_ready';
  importance: 'critical' | 'high' | 'normal';
  refreshLatencyMs: number;
}

export interface RealtimePipelineMetric {
  activeWatchers: number;
  dailyIngestedEvents: number;
  averageRefreshLatencyMs: number;
  autoChronologyGenerated: number;
  mcpQueryCount: number;
  staleRiskMitigatedRate: number; // percentage e.g. 98.4%
}

export interface ClipperTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  targetFolder: string;
  properties: Record<string, string>;
  contentTemplate: string;
  triggers: string[];
}

export interface ClipperJob {
  id: string;
  sourceType: 'feishu_doc' | 'browser_clipper' | 'public_url' | 'feishu_webhook';
  sourceTitle: string;
  sourceUrl: string;
  author?: string;
  importedAt: string;
  status: 'pending' | 'scraping' | 'cleaning' | 'frontmatter_injected' | 'vault_synced' | 'completed';
  extractedWordCount: number;
  imagesCount: number;
  calloutsCount: number;
  targetRawPath: string;
  targetWikiPath: string;
  contentPreview: string;
  autoGeneratedTags: string[];
  cleanMarkdown: string;
}

export interface ClipperDaemonMetric {
  browserExtensionInstalled: boolean;
  feishuWebhookActive: boolean;
  totalClippedToday: number;
  averageExtractLatencyMs: number;
  obsidianVaultAutoSave: boolean;
  autoWeaveEnabled: boolean;
}

// Open-source Chinese Information Ingestion Ecosystem Models
export interface OpenSourceConnector {
  id: string;
  name: string;
  repo: string;
  stars: string;
  category: 'rss_feed' | 'hot_topics' | 'finance' | 'social_media' | 'web_crawler' | 'archiver';
  description: string;
  features: string[];
  sampleEndpoint: string;
  setupGuide: string;
  docsUrl: string;
  supportedSources: string[];
  badgeColor: string;
}

export interface AutoIngestTask {
  id: string;
  name: string;
  category: string;
  connectorId: string;
  connectorName: string;
  icon: string;
  status: 'active' | 'paused' | 'running' | 'error';
  cronSchedule: string;
  cronExpression?: string;
  lastRunTime: string;
  nextRunTime: string;
  totalFetchedItems: number;
  totalCompiledWiki: number;
  targetEndpoint: string;
  keywordsFilter: string[];
  aiSummaryPrompt: string;
  autoCompileToWiki: boolean;
  targetRawFolder: string;
  targetWikiFolder: string;
  latestLogs: string[];
  sampleRecentArticles: Array<{
    title: string;
    source: string;
    pubDate: string;
    snippet: string;
    url: string;
    aiTags: string[];
    compiledWikiPath?: string;
  }>;
}

// OmniWiki Enterprise Core Console & Switch Matrix Models
export interface SystemConfig {
  ingestion: {
    autoIngest: boolean; // 自动编译监听
    ocrEngine: 'LayoutLMv3' | 'Standard'; // OCR 引擎选择
    schemaStrict: boolean; // Frontmatter 强校验
    vaultReadOnly: boolean; // Layer 1 物理写锁 (chmod 444/555)
  };
  query: {
    hybridSearch: boolean; // BM25 + Vector 混合检索
    bm25Weight: number; // 词法权重 (0.0 - 1.0)
    vectorWeight: number; // 语义权重 (0.0 - 1.0)
    biLinkSentinel: boolean; // 主动双链哨兵 (关联原因校验)
    humanInLoop: boolean; // 人在回路审批流
  };
  lint: {
    economicRouting: boolean; // 经济模型路由开关 (本地 Ollama vs 云端 LLM)
    autoHealing: 'on' | 'dry_run' | 'off'; // 自愈模式
    cronSchedule: string; // 巡检周期
  };
  sync: {
    obsidianHeartbeat: boolean; // 27123 端口探测
    obsidianToken: string; // 本地 API 鉴权令牌
    dqlSandboxEnabled: boolean; // DQL 执行沙箱开关
    gitAutoCommit: boolean; // Git 版本审计哨兵
  };
}

export interface BackfeedApprovalItem {
  id: string;
  sourceDocId: string;
  sourceDocTitle: string;
  candidateTitle: string;
  targetPath: string;
  entityType: EntityType;
  summary: string;
  linkReasons: Array<{ target: string; reason: string }>;
  diffContent: {
    op: 'CREATE' | 'UPDATE';
    oldContent?: string;
    newContent: string;
  };
  confidenceScore: number;
  status: 'PROPOSED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  proposedAt: string;
  author: 'AI Synthesis Engine' | 'Agent Compiler' | 'Lint Healer';
}

export interface RoiMetricsData {
  cloudTokensSaved: number;
  localOllamaCalls: number;
  cloudLlmCalls: number;
  totalSavedDollars: number;
  monthlyProjectionDollars: number;
  efficiencyGainRate: number;
  recentAuditLogs: Array<{
    id: string;
    timestamp: string;
    task: string;
    routedTo: 'Local Ollama (Port 11434)' | 'Cloud Gemini Flash / GPT-4o';
    latencyMs: number;
    tokensAvoided: number;
    savingsUsd: number;
  }>;
}

export interface DqlQueryResult {
  columns: string[];
  rows: Array<Record<string, any>>;
  executionTimeMs: number;
  totalMatched: number;
  compiledQuery: string;
}



