export type Language = 'zh' | 'en';

export interface Translations {
  // Sidebar
  home: string;
  search: string;
  starred: string;
  templates: string;
  drafts: string;
  collections: string;
  archive: string;
  trash: string;
  settings: string;
  invitePeople: string;
  newCollection: string;
  newDoc: string;
  share: string;
  copiedLink: string;
  
  // Collections & Categories
  companyInfo: string;
  companyProfile: string;
  companyNotices: string;
  meetingRecords: string;
  engineering: string;
  brandDesign: string;
  design: string;
  marketing: string;
  research: string;
  support: string;
  documentation: string;
  coreConcepts: string;
  backend: string;
  frontend: string;
  
  // Document Canvas
  contents: string;
  updatedTime: string;
  viewedCount: string;
  editDoc: string;
  previewDoc: string;
  saveDoc: string;
  cancel: string;
  confirm: string;
  delete: string;
  restore: string;
  emptyTrash: string;
  createFromTemplate: string;
  publishDraft: string;
  layoutCraft: string;
  layoutEnterprise: string;
  provenance: string;
  sourceRaw: string;
  tags: string;
  syncObsidian: string;
  
  // Views / Modals
  homeTitle: string;
  homeSubtitle: string;
  recentDocs: string;
  myStarredDocs: string;
  quickStats: string;
  totalDocs: string;
  totalCategories: string;
  draftsCount: string;
  archivedCount: string;
  templateLibrary: string;
  templateDesc: string;
  useTemplate: string;
  draftsTitle: string;
  draftsSubtitle: string;
  archiveTitle: string;
  archiveSubtitle: string;
  trashTitle: string;
  trashSubtitle: string;
  inviteTitle: string;
  inviteSubtitle: string;
  inviteEmailPlaceholder: string;
  inviteRole: string;
  roleAdmin: string;
  roleEditor: string;
  roleViewer: string;
  sendInvite: string;
  newCollectionTitle: string;
  newCollectionName: string;
  newCollectionIcon: string;
  createCollectionBtn: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  tabGeneral: string;
  tabLanguage: string;
  tabAppearance: string;
  tabCollaboration: string;
  tabObsidian: string;
  tabLlm: string;
  tabAbout: string;
  langSelectTitle: string;
  langSelectDesc: string;
  chineseName: string;
  englishName: string;
  themeTitle: string;
  themeDesc: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  multiplayerTitle: string;
  multiplayerDesc: string;
  obsidianApiTitle: string;
  obsidianApiDesc: string;
  llmTitle: string;
  llmDesc: string;
  llmBaseUrl: string;
  llmBaseUrlPlaceholder: string;
  llmApiKey: string;
  llmApiKeyPlaceholder: string;
  llmModel: string;
  llmModelPlaceholder: string;
  llmSaveKeyBtn: string;
  llmTestConnection: string;
  llmTestResultOk: string;
  llmTestResultErr: string;
  llmSystemPrompt: string;
  llmSystemPromptPlaceholder: string;
  llmTemperature: string;
  llmMaxTokens: string;
  llmTopP: string;
  llmStopSequences: string;
  llmStopSequencesPlaceholder: string;
  llmEnvVars: string;
  llmEnvVarsDesc: string;
  llmEnvVarName: string;
  llmEnvVarValue: string;
  llmAddEnvVar: string;
  llmRemoveEnvVar: string;
  llmAddModel: string;
  llmFetchUpstream: string;
  llmFetching: string;
  llmFetchUpstreamSuccess: string;
  llmFetchUpstreamErrNoCredentials: string;
  llmFetchUpstreamErrEmpty: string;
  llmFetchUpstreamErrAllExist: string;
  llmFetchUpstreamErr: string;
  llmSetDefault: string;
  llmSelect: string;
  llmSelected: string;
  saveSettings: string;
  settingsSaved: string;

  // Data Acquisition
  dataAcquisition: string;
  dataAcquisitionDesc: string;
  dataLocalFile: string;
  dataLocalFileDesc: string;
  dataWebScrape: string;
  dataWebScrapeDesc: string;
  dataDatabase: string;
  dataDatabaseDesc: string;
  dataMediaTranscribe: string;
  dataMediaTranscribeDesc: string;
  dataUploadFile: string;
  dataDragOrClick: string;
  dataSupportedFormats: string;
  dataEnterUrl: string;
  dataUrlPlaceholder: string;
  dataStartScrape: string;
  dataConnectionString: string;
  dataConnectionStringPlaceholder: string;
  dataQuery: string;
  dataQueryPlaceholder: string;
  dataStartQuery: string;
  dataSelectMedia: string;
  dataSupportedMedia: string;
  dataStartTranscribe: string;
  dataCopyText: string;
  dataCopyTextDesc: string;
  dataCopyTextPlaceholder: string;
  dataCopyTextInsert: string;
  dataAutoTasks: string;
  dataAutoTasksDesc: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    // Sidebar
    home: '总览',
    search: '搜索',
    starred: '已收藏',
    templates: '模板库',
    drafts: '草稿箱',
    collections: '分类集合',
    archive: '归档库',
    trash: '回收站',
    settings: '系统设置',
    invitePeople: '邀请成员...',
    newCollection: '新建集合...',
    newDoc: '新建文档',
    share: '分享',
    copiedLink: '已复制链接',

    // Collections & Categories
    companyInfo: '公司资料',
    companyProfile: '公司介绍',
    companyNotices: '公司通知',
    meetingRecords: '会议资料',
    engineering: '研发工程',
    brandDesign: '品牌设计',
    design: '体验设计',
    marketing: '市场营销',
    research: '前沿研究',
    support: '客户支持',
    documentation: '文档规范',
    coreConcepts: '核心概念',
    backend: '后端架构',
    frontend: '前端工程',

    // Document Canvas
    contents: '目录大纲',
    updatedTime: '更新于 12 分钟前',
    viewedCount: '6 位成员已阅读',
    editDoc: '编辑正文',
    previewDoc: '预览文档',
    saveDoc: '保存更新并同步 Vault',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    restore: '还原',
    emptyTrash: '清空回收站',
    createFromTemplate: '从模板创建文档',
    publishDraft: '发布为正式 Wiki',
    layoutCraft: '📑 现代文档风格',
    layoutEnterprise: '🎛️ 工程大盘风格',
    provenance: '出处与元数据',
    sourceRaw: '源原始文档：',
    tags: '标签：',
    syncObsidian: 'Obsidian Vault 同步',

    // Views / Modals
    homeTitle: '企业知识中心概览',
    homeSubtitle: '欢迎回来，Jenn。查看最近更新的企业 Wiki、已收藏条目与协同动态。',
    recentDocs: '最近浏览与更新',
    myStarredDocs: '已收藏重点条目',
    quickStats: '知识库全局指标',
    totalDocs: '编译 Wiki 实体',
    totalCategories: '分类集合',
    draftsCount: '待发布草稿',
    archivedCount: '归档条目',
    templateLibrary: '标准 Wiki 结构化模板库',
    templateDesc: '基于 Karpathy 理论体系与标准 SOP 规范，一键初始化高质量知识页面。',
    useTemplate: '采用此模板新建',
    draftsTitle: '个人与团队草稿箱',
    draftsSubtitle: '正在撰写或等待 AI 协同编织的多源内容草稿。',
    archiveTitle: '知识归档库',
    archiveSubtitle: '已封存的往期版本、已结项项目文档与已废止流程规范。',
    trashTitle: '文档回收站',
    trashSubtitle: '30 天内删除的文档保留于此，支持一键恢复或永久清除。',
    inviteTitle: '邀请新成员加入团队知识库',
    inviteSubtitle: '赋予团队成员实时阅读、在线撰写或知识审核管理权限。',
    inviteEmailPlaceholder: '输入企业邮箱 (如: alex@company.com)...',
    inviteRole: '成员权限等级',
    roleAdmin: '管理员 (全权管理与审批)',
    roleEditor: '编辑者 (可撰写与修改 Wiki)',
    roleViewer: '只读成员 (仅检索与查阅)',
    sendInvite: '发送邀请链接',
    newCollectionTitle: '新建分类集合 (Collection)',
    newCollectionName: '集合名称',
    newCollectionIcon: '选择集合图标与主题色',
    createCollectionBtn: '立即创建集合',

    // Settings
    settingsTitle: '知识库全局偏好与设置',
    settingsSubtitle: '自定义界面语言、显示主题、多人实时协同光标及 Obsidian 本地连接。',
    tabGeneral: '通用设置',
    tabLanguage: '界面语言',
    tabAppearance: '外观主题',
    tabCollaboration: '协同光标',
    tabObsidian: 'Obsidian API',
    tabLlm: 'LLM 配置',
    tabAbout: '关于系统',
    langSelectTitle: '系统显示语言 (Language)',
    langSelectDesc: '切换系统的全界面显示语言。默认为简体中文。',
    chineseName: '简体中文 (默认)',
    englishName: 'English (US)',
    themeTitle: '界面排版与外观主题',
    themeDesc: '选择偏好的界面视觉对比度。',
    themeLight: '清新浅色 (Light)',
    themeDark: '极客深色 (Dark)',
    themeSystem: '跟随系统 (Auto)',
    multiplayerTitle: '多人实时协同光标',
    multiplayerDesc: '在同一篇 Wiki 被多位团队成员浏览或编辑时，实时显示带名字的彩色光标气泡。',
    obsidianApiTitle: 'Obsidian Local REST API 连接状态',
    obsidianApiDesc: '前端直接对接本地 Obsidian Vault 端口 (http://127.0.0.1:27123)。',
    llmTitle: '大模型配置',
    llmDesc: '配置大模型 Base URL、API Key、系统提示词及环境变量。',
    llmBaseUrl: 'Base URL',
    llmBaseUrlPlaceholder: 'https://api.openai.com/v1',
    llmApiKey: 'API Key',
    llmApiKeyPlaceholder: 'sk-...',
    llmModel: '模型名称',
    llmModelPlaceholder: 'gpt-4o / qwen-max / gemini-2.5-pro',
    llmSaveKeyBtn: '保存密钥',
    llmTestConnection: '测试连接',
    llmTestResultOk: '连接成功 ✓',
    llmTestResultErr: '连接失败，请检查配置',
    llmSystemPrompt: '系统提示词 (System Prompt)',
    llmSystemPromptPlaceholder: '你是一位专业的企业知识库智能体助手，擅长... ',
    llmTemperature: 'Temperature (创造性 0~2)',
    llmMaxTokens: 'Max Tokens',
    llmTopP: 'Top-P',
    llmStopSequences: '停止序列 (逗号分隔)',
    llmStopSequencesPlaceholder: '人类：, 助手：',
    llmEnvVars: '环境变量',
    llmEnvVarsDesc: '自定义环境变量，将注入到模型请求上下文中。',
    llmEnvVarName: '变量名',
    llmEnvVarValue: '变量值',
    llmAddEnvVar: '+ 添加变量',
    llmRemoveEnvVar: '删除',
    llmAddModel: '添加模型',
    llmFetchUpstream: '从上游获取',
    llmFetching: '获取中...',
    llmFetchUpstreamSuccess: '成功获取模型',
    llmFetchUpstreamErrNoCredentials: '请先填写 Base URL 和 API Key',
    llmFetchUpstreamErrEmpty: '上游返回的模型列表为空，请检查凭据是否正确',
    llmFetchUpstreamErrAllExist: '所有模型均已存在，无需重复添加',
    llmFetchUpstreamErr: '从上游获取失败',
    llmSetDefault: '设为默认',
    llmSelect: '选择',
    llmSelected: '已选',
    saveSettings: '保存设置',
    settingsSaved: '设置已成功保存！',

    // Data Acquisition
    dataAcquisition: '获取信息',
    dataAcquisitionDesc: '从多种外部来源与 GitHub 开源自动化管道持续获取信息至知识库',
    dataLocalFile: '本地文件',
    dataLocalFileDesc: '上传文档、表格、PDF 等本地文件',
    dataWebScrape: '网页抓取',
    dataWebScrapeDesc: '输入 URL 抓取网页内容',
    dataDatabase: '数据库',
    dataDatabaseDesc: '连接数据库并执行查询导入',
    dataMediaTranscribe: '音视频转文字',
    dataMediaTranscribeDesc: '上传音频或视频文件自动转录',
    dataUploadFile: '上传文件',
    dataDragOrClick: '拖拽文件到此处，或点击选择文件',
    dataSupportedFormats: '支持 PDF、DOCX、TXT、MD、CSV、XLSX 格式',
    dataEnterUrl: '输入网页地址',
    dataUrlPlaceholder: 'https://example.com/article',
    dataStartScrape: '开始抓取',
    dataConnectionString: '数据库连接字符串',
    dataConnectionStringPlaceholder: 'postgresql://user:pass@host:5432/dbname',
    dataQuery: 'SQL 查询语句',
    dataQueryPlaceholder: 'SELECT * FROM documents WHERE ...',
    dataStartQuery: '执行查询',
    dataSelectMedia: '选择媒体文件',
    dataSupportedMedia: '支持 MP3、WAV、MP4、MOV 格式',
    dataStartTranscribe: '开始转录',
    dataCopyText: '复制的文本',
    dataCopyTextDesc: '粘贴复制的文字内容作为知识来源',
    dataCopyTextPlaceholder: '在此粘贴文字...',
    dataCopyTextInsert: '插入',
    dataAutoTasks: '自动任务',
    dataAutoTasksDesc: '基于 GitHub 开源软件 (RSSHub / 今日热榜 / AkShare / 微信) 自动化收集与驱动'
  },
  en: {
    // Sidebar
    home: 'Home',
    search: 'Search',
    starred: 'Starred',
    templates: 'Templates',
    drafts: 'Drafts',
    collections: 'COLLECTIONS',
    archive: 'Archive',
    trash: 'Trash',
    settings: 'Settings',
    invitePeople: 'Invite people...',
    newCollection: 'New collection...',
    newDoc: 'New doc',
    share: 'Share',
    copiedLink: 'Link Copied',

    // Collections & Categories
    companyInfo: 'Company Info',
    companyProfile: 'Company Profile',
    companyNotices: 'Company Notices',
    meetingRecords: 'Meeting Records',
    engineering: 'Engineering',
    brandDesign: 'Brand Design',
    design: 'Design',
    marketing: 'Marketing',
    research: 'Research',
    support: 'Support',
    documentation: 'Documentation',
    coreConcepts: 'Core Concepts',
    backend: 'Backend',
    frontend: 'Frontend',

    // Document Canvas
    contents: 'CONTENTS',
    updatedTime: 'Updated 12 mins ago',
    viewedCount: 'Viewed by 6 people',
    editDoc: 'Edit doc',
    previewDoc: 'Preview doc',
    saveDoc: 'Save & Sync Vault',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    restore: 'Restore',
    emptyTrash: 'Empty Trash',
    createFromTemplate: 'Create from Template',
    publishDraft: 'Publish to Wiki',
    layoutCraft: '📑 Craft Doc Layout',
    layoutEnterprise: '🎛️ Enterprise Hub',
    provenance: 'PROVENANCE & METADATA',
    sourceRaw: 'Source Raw Document:',
    tags: 'Tags:',
    syncObsidian: 'Obsidian Vault Synced',

    // Views / Modals
    homeTitle: 'Knowledge Base Overview',
    homeSubtitle: 'Welcome back, Jenn. Explore recently updated enterprise Wikis, starred entries, and live collaboration.',
    recentDocs: 'Recently Viewed & Updated',
    myStarredDocs: 'Starred Entries',
    quickStats: 'Global Metrics',
    totalDocs: 'Compiled Wiki Entities',
    totalCategories: 'Collections',
    draftsCount: 'Pending Drafts',
    archivedCount: 'Archived Items',
    templateLibrary: 'Standard Wiki Templates',
    templateDesc: 'Pre-structured templates based on Karpathy methodology and standard SOP guidelines.',
    useTemplate: 'Use this template',
    draftsTitle: 'Drafts & Working Scratchpad',
    draftsSubtitle: 'In-progress drafts and multi-source inputs awaiting Agent compilation.',
    archiveTitle: 'Archived Documents',
    archiveSubtitle: 'Historical versions, completed projects, and deprecated SOP specifications.',
    trashTitle: 'Trash Bin',
    trashSubtitle: 'Items deleted within 30 days are retained here. Restore anytime or permanently delete.',
    inviteTitle: 'Invite Team Members',
    inviteSubtitle: 'Grant team members permissions to read, edit, or manage knowledge base entries.',
    inviteEmailPlaceholder: 'Enter corporate email (e.g. alex@company.com)...',
    inviteRole: 'Permission Role',
    roleAdmin: 'Administrator (Full Access & Approvals)',
    roleEditor: 'Editor (Create & Edit Wiki Pages)',
    roleViewer: 'Viewer (Read-Only & Search)',
    sendInvite: 'Send Invite Link',
    newCollectionTitle: 'Create New Collection',
    newCollectionName: 'Collection Name',
    newCollectionIcon: 'Choose Icon & Color',
    createCollectionBtn: 'Create Collection',

    // Settings
    settingsTitle: 'Knowledge Base Preferences',
    settingsSubtitle: 'Customize language, appearance, multiplayer live cursors, and local Obsidian integration.',
    tabGeneral: 'General',
    tabLanguage: 'Language',
    tabAppearance: 'Appearance',
    tabCollaboration: 'Collaboration',
    tabObsidian: 'Obsidian API',
    tabLlm: 'LLM Config',
    tabAbout: 'About',
    langSelectTitle: 'Display Language',
    langSelectDesc: 'Switch the system display language across all views. Defaults to Simplified Chinese.',
    chineseName: '简体中文 (Default)',
    englishName: 'English (US)',
    themeTitle: 'Theme & Contrast',
    themeDesc: 'Select your preferred visual appearance.',
    themeLight: 'Clean Light',
    themeDark: 'Dark Mode',
    themeSystem: 'Match System',
    multiplayerTitle: 'Multiplayer Live Cursors',
    multiplayerDesc: 'Display real-time labeled avatar cursor chips when other teammates are viewing or editing.',
    obsidianApiTitle: 'Obsidian Local REST API Connection',
    obsidianApiDesc: 'Direct integration with local Obsidian Vault at http://127.0.0.1:27123.',
    llmTitle: 'LLM Configuration',
    llmDesc: 'Configure Base URL, API Key, system prompt, and environment variables for the LLM provider.',
    llmBaseUrl: 'Base URL',
    llmBaseUrlPlaceholder: 'https://api.openai.com/v1',
    llmApiKey: 'API Key',
    llmApiKeyPlaceholder: 'sk-...',
    llmModel: 'Model Name',
    llmModelPlaceholder: 'gpt-4o / qwen-max / gemini-2.5-pro',
    llmSaveKeyBtn: 'Save Key',
    llmTestConnection: 'Test Connection',
    llmTestResultOk: 'Connection successful ✓',
    llmTestResultErr: 'Connection failed, please check config',
    llmSystemPrompt: 'System Prompt (System Prompt)',
    llmSystemPromptPlaceholder: 'You are a professional enterprise knowledge base AI assistant...',
    llmTemperature: 'Temperature (0~2)',
    llmMaxTokens: 'Max Tokens',
    llmTopP: 'Top-P',
    llmStopSequences: 'Stop Sequences (comma separated)',
    llmStopSequencesPlaceholder: 'Human:, Assistant:',
    llmEnvVars: 'Environment Variables',
    llmEnvVarsDesc: 'Custom env vars injected into model request context.',
    llmEnvVarName: 'Name',
    llmEnvVarValue: 'Value',
    llmAddEnvVar: '+ Add Variable',
    llmRemoveEnvVar: 'Remove',
    llmAddModel: 'Add Model',
    llmFetchUpstream: 'Fetch from Upstream',
    llmFetching: 'Fetching...',
    llmFetchUpstreamSuccess: 'Successfully fetched models',
    llmFetchUpstreamErrNoCredentials: 'Please fill in Base URL and API Key first',
    llmFetchUpstreamErrEmpty: 'Upstream returned an empty model list, please check credentials',
    llmFetchUpstreamErrAllExist: 'All models already exist, no need to add again',
    llmFetchUpstreamErr: 'Failed to fetch from upstream',
    llmSetDefault: 'Set Default',
    llmSelect: 'Select',
    llmSelected: 'Selected',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully!',

    // Data Acquisition
    dataAcquisition: 'Information Acquisition',
    dataAcquisitionDesc: 'Import information and open-source automated intelligence into your knowledge base',
    dataLocalFile: 'Local Files',
    dataLocalFileDesc: 'Upload documents, spreadsheets, PDFs and other local files',
    dataWebScrape: 'Web Scraping',
    dataWebScrapeDesc: 'Enter a URL to scrape web page content',
    dataDatabase: 'Database',
    dataDatabaseDesc: 'Connect to a database and import query results',
    dataMediaTranscribe: 'Audio/Video Transcription',
    dataMediaTranscribeDesc: 'Upload audio or video files for automatic transcription',
    dataUploadFile: 'Upload File',
    dataDragOrClick: 'Drag and drop files here, or click to select',
    dataSupportedFormats: 'Supports PDF, DOCX, TXT, MD, CSV, XLSX formats',
    dataEnterUrl: 'Enter Web Address',
    dataUrlPlaceholder: 'https://example.com/article',
    dataStartScrape: 'Start Scraping',
    dataConnectionString: 'Database Connection String',
    dataConnectionStringPlaceholder: 'postgresql://user:pass@host:5432/dbname',
    dataQuery: 'SQL Query',
    dataQueryPlaceholder: 'SELECT * FROM documents WHERE ...',
    dataStartQuery: 'Execute Query',
    dataSelectMedia: 'Select Media File',
    dataSupportedMedia: 'Supports MP3, WAV, MP4, MOV formats',
    dataStartTranscribe: 'Start Transcription',
    dataCopyText: 'Copied Text',
    dataCopyTextDesc: 'Paste copied text content as a knowledge source',
    dataCopyTextPlaceholder: 'Paste your text here...',
    dataCopyTextInsert: 'Insert',
    dataAutoTasks: 'Automated Tasks',
    dataAutoTasksDesc: 'Automated ingestion pipelines driven by GitHub Chinese open-source tools (RSSHub / DailyHot / AkShare / Wechat)'
  }
};
