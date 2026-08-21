import { SharedDriveDevice, SharedAssetItem, IndustryArchetype } from '../types';

export const PRESET_SHARED_DEVICES: SharedDriveDevice[] = [
  // New Media Creative Workstations
  {
    id: 'dev-media-1',
    name: '编导小美-短视频剪辑工作站',
    ownerName: '林小美 (资深视频编导)',
    department: '短视频运营部',
    os: 'macOS',
    ipAddress: '192.168.1.108',
    localMountPath: '~/CompanyShare/01_短视频脚本与分镜',
    status: 'online',
    lastSyncTime: '2026-08-18 18:42',
    pendingFilesCount: 2,
    totalSyncedFiles: 28,
    bandwidthSpeed: '45.2 MB/s (局域网直连)',
    autoIngestToWiki: true,
    industry: 'media_creative'
  },
  {
    id: 'dev-media-2',
    name: '文案阿强-爆款文案创意工位',
    ownerName: '陈阿强 (首席文案策划)',
    department: '内容创意中心',
    os: 'Windows',
    ipAddress: '192.168.1.115',
    localMountPath: 'D:\\OmniShare\\02_小红书与公众号爆文',
    status: 'syncing',
    lastSyncTime: '2026-08-18 18:50',
    pendingFilesCount: 4,
    totalSyncedFiles: 42,
    bandwidthSpeed: '32.8 MB/s',
    autoIngestToWiki: true,
    industry: 'media_creative'
  },
  {
    id: 'dev-media-3',
    name: '新媒体视觉设计组 NAS 主盘',
    ownerName: '设计组共享节点 (NAS-01)',
    department: '视觉传达部',
    os: 'NAS',
    ipAddress: '192.168.1.200',
    localMountPath: 'smb://192.168.1.200/MediaAssets/BrandVI',
    status: 'idle',
    lastSyncTime: '2026-08-18 17:30',
    pendingFilesCount: 0,
    totalSyncedFiles: 116,
    bandwidthSpeed: '112.0 MB/s (万兆内网)',
    autoIngestToWiki: true,
    industry: 'media_creative'
  },

  // Software Company Workstations
  {
    id: 'dev-soft-1',
    name: '王工-核心架构组 MacBook Pro',
    ownerName: '王建国 (首席架构师)',
    department: '基础架构部',
    os: 'macOS',
    ipAddress: '192.168.2.45',
    localMountPath: '~/Workspace/OmniShare/RFCs_Architecture',
    status: 'online',
    lastSyncTime: '2026-08-18 18:48',
    pendingFilesCount: 1,
    totalSyncedFiles: 35,
    bandwidthSpeed: '58.0 MB/s',
    autoIngestToWiki: true,
    industry: 'software_dev'
  },
  {
    id: 'dev-soft-2',
    name: '刘前端-组件库与设计系统工位',
    ownerName: '刘雨萱 (前端技术专家)',
    department: '终端研发部',
    os: 'Windows',
    ipAddress: '192.168.2.88',
    localMountPath: 'E:\\TeamShare\\DesignSystem_APIs',
    status: 'idle',
    lastSyncTime: '2026-08-18 18:15',
    pendingFilesCount: 0,
    totalSyncedFiles: 19,
    bandwidthSpeed: '28.4 MB/s',
    autoIngestToWiki: true,
    industry: 'software_dev'
  },
  {
    id: 'dev-soft-3',
    name: '李运维-微服务与稳定性管理机',
    ownerName: '李明轩 (SRE稳定性负责人)',
    department: '运维保障中心',
    os: 'Linux',
    ipAddress: '192.168.2.12',
    localMountPath: '/mnt/corp_shared/sops_postmortems',
    status: 'online',
    lastSyncTime: '2026-08-18 18:35',
    pendingFilesCount: 3,
    totalSyncedFiles: 52,
    bandwidthSpeed: '94.6 MB/s',
    autoIngestToWiki: true,
    industry: 'software_dev'
  }
];

export const PRESET_SHARED_ASSETS: SharedAssetItem[] = [
  // New Media Company Materials
  {
    id: 'asset-media-1',
    deviceId: 'dev-media-1',
    deviceName: '编导小美-短视频剪辑工作站',
    department: '短视频运营部',
    fileName: '2026短视频爆款黄金3秒开头脚本库_SOP.docx',
    relativePath: '01_短视频脚本与分镜/2026短视频爆款黄金3秒开头脚本库_SOP.docx',
    size: '184.5 KB',
    category: '短视频脚本与拍摄SOP',
    fileType: 'script',
    modifiedAt: '2026-08-18 18:30',
    syncState: 'pending_ingest',
    extractedEntitiesCount: 0,
    generatedWikiPaths: [],
    snippetPreview: '短视频完播率核心取决于前3秒留存率。提炼5类万能黄金开头公式：痛点悬念型、反常识冲突型、情绪共鸣型、权威背书型、沉浸感开箱型。每类配分镜机位与BGM节奏。',
    industry: 'media_creative'
  },
  {
    id: 'asset-media-2',
    deviceId: 'dev-media-2',
    deviceName: '文案阿强-爆款文案创意工位',
    department: '内容创意中心',
    fileName: '小红书千赞爆文排版与封面设计拆解指南.pdf',
    relativePath: '02_小红书与公众号爆文/小红书千赞爆文排版与封面设计拆解指南.pdf',
    size: '1.2 MB',
    category: '社媒文案与排版规范',
    fileType: 'pdf',
    modifiedAt: '2026-08-18 17:45',
    syncState: 'pending_ingest',
    extractedEntitiesCount: 0,
    generatedWikiPaths: [],
    snippetPreview: '小红书封面的三要素法则：高饱和度主视觉、大字号核心利益点（字数不超过10字）、右下角权威或数据背书Tag。正文段落控制在3行以内，合理使用Emoji引导视线。',
    industry: 'media_creative'
  },
  {
    id: 'asset-media-3',
    deviceId: 'dev-media-3',
    deviceName: '新媒体视觉设计组 NAS 主盘',
    department: '视觉传达部',
    fileName: '2026年度新媒体全渠道VI规范与封面色彩基准.md',
    relativePath: 'BrandVI/2026年度新媒体全渠道VI规范与封面色彩基准.md',
    size: '48.2 KB',
    category: '品牌VI与视觉规范',
    fileType: 'design',
    modifiedAt: '2026-08-18 16:20',
    syncState: 'synced_to_raw',
    extractedEntitiesCount: 3,
    generatedWikiPaths: [
      'wiki/products/brand-visual-guidelines-2026.md',
      'wiki/terms/cover-aspect-ratios.md',
      'wiki/sops/video-export-color-matrix.md'
    ],
    snippetPreview: '品牌全域主色为极光蓝 (#2563EB) 与活力橙 (#F97316)。各平台导出比例基准：抖音/视频号统一 9:16 (1080x1920)，B站 16:9 (3840x2160)，小红书 3:4 (1242x1660)。',
    industry: 'media_creative'
  },

  // Software Company Materials
  {
    id: 'asset-soft-1',
    deviceId: 'dev-soft-1',
    deviceName: '王工-核心架构组 MacBook Pro',
    department: '基础架构部',
    fileName: '微服务网关限流降级与分布式鉴权设计_RFC-089.md',
    relativePath: 'RFCs_Architecture/微服务网关限流降级与分布式鉴权设计_RFC-089.md',
    size: '96.4 KB',
    category: '技术架构与RFC设计',
    fileType: 'doc',
    modifiedAt: '2026-08-18 18:40',
    syncState: 'pending_ingest',
    extractedEntitiesCount: 0,
    generatedWikiPaths: [],
    snippetPreview: '面对日均10亿次API请求，网关层采用分布式令牌桶限流（Redis+Lua），结合本地滑动窗口进行二次熔断。鉴权统一签发双Token（Access 15m + Refresh 7d）结合Ed25519非对称验签。',
    industry: 'software_dev'
  },
  {
    id: 'asset-soft-2',
    deviceId: 'dev-soft-2',
    deviceName: '刘前端-组件库与设计系统工位',
    department: '终端研发部',
    fileName: '企业级React组件库无障碍访问(A11y)与主题规范.md',
    relativePath: 'DesignSystem_APIs/企业级React组件库无障碍访问(A11y)与主题规范.md',
    size: '62.0 KB',
    category: '代码契约与设计系统',
    fileType: 'code',
    modifiedAt: '2026-08-18 18:10',
    syncState: 'synced_to_raw',
    extractedEntitiesCount: 2,
    generatedWikiPaths: [
      'wiki/sops/ui-component-review-checklist.md',
      'wiki/terms/design-tokens-v2.md'
    ],
    snippetPreview: '所有基础交互组件必须严格通过 WCAG 2.1 AA 级对比度检测，键盘焦点环采用 2px 高对比度 Outline。Design Tokens 统一采用 CSS 变量解耦暗黑模式与主题定制。',
    industry: 'software_dev'
  },
  {
    id: 'asset-soft-3',
    deviceId: 'dev-soft-3',
    deviceName: '李运维-微服务与稳定性管理机',
    department: '运维保障中心',
    fileName: '生产环境P0级故障应急响应与自愈接管_SOP-2026.md',
    relativePath: 'sops_postmortems/生产环境P0级故障应急响应与自愈接管_SOP-2026.md',
    size: '78.5 KB',
    category: '运维应急与稳定性SOP',
    fileType: 'doc',
    modifiedAt: '2026-08-18 18:25',
    syncState: 'pending_ingest',
    extractedEntitiesCount: 0,
    generatedWikiPaths: [],
    snippetPreview: '故障定级标准：影响核心交易流超过3分钟即触发P0告警。值班SRE需在90秒内完成On-Call签到，启动多机房流量调度一键旁路，并将排查过程实时同步至飞书作战群。',
    industry: 'software_dev'
  }
];

export const WORKSTATION_MOUNT_PROTOCOLS = [
  {
    id: 'smb',
    name: '局域网 SMB 共享映射 (Windows/Mac/Linux 原生挂载)',
    protocol: 'smb://omniwiki.corp/shared-assets',
    description: '无需安装客户端，员工在电脑资源管理器中将企业共享盘直接映射为本地磁盘 (如 Z:\\ 盘或 Finder 共享位置)，随手保存的文件即时并入知识库。',
    setupSteps: [
      'Windows：右键“此电脑” → 选择“映射网络驱动器” → 驱动器选择 Z: → 文件夹输入 \\\\omniwiki.corp\\shared-assets',
      'macOS：访达 (Finder) → 顶部菜单“前往” → “连接服务器” → 输入 smb://omniwiki.corp/shared-assets',
      '员工日常工作产出的文档、分镜、设计稿直接另存至 Z: 盘对应部门目录即可自动同步。'
    ]
  },
  {
    id: 'daemon',
    name: '企业工作共享盘轻量 Sync Daemon (CLI / 桌面托盘代理)',
    protocol: 'omniwiki-sync-daemon v2.4',
    description: '面向研发与高频创作者，监听本地指定目录变动 (inotify/fsevents)，支持智能去重、敏感信息过滤与增量上传。',
    setupSteps: [
      '终端运行一键挂载：curl -sSL https://omniwiki.corp/install.sh | bash',
      '配置本地监听目录：omniwiki sync --bind ~/Workspace/MyDocs --category "架构RFC"',
      '后台静默监听，检测到新文件保存时自动完成 OCR/文本提取并触发 Agent 编织。'
    ]
  },
  {
    id: 'webdav',
    name: 'WebDAV / 飞书云文档 / 阿里云盘 / NAS 网关双向挂载',
    protocol: 'WebDAV over TLS',
    description: '打通云端与本地 NAS 存储，支持部门公共网盘素材批量挂载入库。',
    setupSteps: [
      '在设置中填入企业 NAS 或云盘 WebDAV 接入端点与令牌密钥',
      '选择要挂载的部门公共资料夹（如 /Design_Assets, /PRD_Releases）',
      '系统按设定周期（或 Webhook）自动拉取新素材并增量编织为标准 Wiki。'
    ]
  }
];
