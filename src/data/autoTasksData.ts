import { OpenSourceConnector, AutoIngestTask } from '../types';

export const OPEN_SOURCE_CONNECTORS: OpenSourceConnector[] = [
  {
    id: 'rsshub',
    name: 'RSSHub (万物皆可 RSS)',
    repo: 'DIYgod/RSSHub',
    stars: '34.5k',
    category: 'rss_feed',
    description: '知名开源 RSS 生成器，可将微信公众号、知乎、B站、36氪、微博、各大门户与政务网站一键转为标准 RSS/JSON 订阅流。',
    features: ['支持 1000+ 中文内容路由', '内置反爬与 Puppeteer 浏览器渲染', '支持私有化 Docker 一键部署', '支持 JSON/Atom/RSS 2.0 输出'],
    sampleEndpoint: 'https://rsshub.app/36kr/newsflashes',
    setupGuide: 'docker run -d --name rsshub -p 1200:1200 diygod/rsshub:latest',
    docsUrl: 'https://docs.rsshub.app/zh/',
    supportedSources: ['36氪', '虎嗅网', '微信公众号', '知乎热榜', 'B站UP主动态', 'GitHub Trending', '财新网', '华尔街见闻'],
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    id: 'dailyhot-api',
    name: 'TodayDailyHot (今日热榜 API)',
    repo: 'imsyy/dailyhot-api',
    stars: '13.8k',
    category: 'hot_topics',
    description: '聚合全网热搜热榜的开源 Node.js API 服务，覆盖百度热搜、知乎热榜、微博热搜、抖音热点、V2EX、少数派等 30+ 平台。',
    features: ['单接口毫秒级聚合', '结构化 JSON 返回排名/标题/热度', '支持定时缓存与自动刷新', '自带轻量 Web 管理界面'],
    sampleEndpoint: 'https://api.pearktrue.cn/api/dailyhot/?title=zhihu',
    setupGuide: 'git clone https://github.com/imsyy/dailyhot-api && npm install && npm run start',
    docsUrl: 'https://github.com/imsyy/dailyhot-api',
    supportedSources: ['知乎热榜', '微博热搜', '百度热搜', '抖音热点', '少数派热榜', '掘金热榜', 'V2EX', '36氪热榜'],
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'akshare',
    name: 'AkShare (金融行情与研报开源库)',
    repo: 'akfamily/akshare',
    stars: '16.2k',
    category: 'finance',
    description: '专为中国人量身定制的开源财经数据接口库，秒级抓取 A 股行情、券商研报、宏观经济指数、外汇期货与央行政策快讯。',
    features: ['纯开源无调用限制', '覆盖宏观经济、行业研报、上市公司公告', '支持 Pandas 数据清洗与 Markdown 导出', '高频自动更新维护'],
    sampleEndpoint: 'http://localhost:8080/api/public/stock_news_em',
    setupGuide: 'pip install akshare --upgrade',
    docsUrl: 'https://akshare.akfamily.xyz/',
    supportedSources: ['东方财富快讯', '新浪财经', '巨潮资讯公告', '中国人民银行政策', '券商行业研报', '同花顺热点'],
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'wechat-feeds',
    name: 'Wechat-Feeds (微信公众号深度订阅)',
    repo: 'chyroc/wechat-feeds',
    stars: '8.9k',
    category: 'social_media',
    description: '自动化监控微信优质公众号更新，自动提取富文本、正文 Markdown、作者信息与配图，并生成更新时间线。',
    features: ['无侵入式自动同步', '导出高保真清洗 Markdown', '支持 Webhook 实时通知', '支持按作者/历史文章库导出'],
    sampleEndpoint: 'https://wechat-feeds.app/feed/gh_tech_ai.xml',
    setupGuide: 'docker run -d --name wechat-feeds -p 8080:8080 chyroc/wechat-feeds',
    docsUrl: 'https://github.com/chyroc/wechat-feeds',
    supportedSources: ['机器之心', '量子位', '智东西', '极客公园', '晚点LatePost', '雷锋网', '新智元'],
    badgeColor: 'bg-green-50 text-green-700 border-green-200'
  },
  {
    id: 'crawl4ai',
    name: 'Crawl4AI (LLM 友好型网页爬虫)',
    repo: 'unclecode/crawl4ai',
    stars: '26.4k',
    category: 'web_crawler',
    description: '开源异步网页抓取与结构化抽取引擎，专为 LLM 知识库设计，自动过滤广告与杂质，输出高保真 Markdown 与语义树。',
    features: ['极速异步渲染 (Playwright)', '智能提取正文无废话', '自动提炼关键词与表格', '支持自定义 CSS/XPath 抽取规则'],
    sampleEndpoint: 'http://localhost:11235/crawl?url=https://36kr.com/p/123456',
    setupGuide: 'pip install crawl4ai && crawl4ai-setup',
    docsUrl: 'https://crawl4ai.com/',
    supportedSources: ['深度行业报告', '技术博客专栏', '政府公文公告', '企业新闻通稿', '海外中英双语技术文章'],
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'bilibili-api',
    name: 'Bilibili-API-Collect (B站知识提取)',
    repo: 'SocialSisterYi/bilibili-API-collect',
    stars: '15.1k',
    category: 'social_media',
    description: 'B站全能接口解析工具，支持自动抓取科技/知识区 UP 主动态、技术视频文稿字幕与高频热评，转为结构化文本。',
    features: ['一键提取视频 CC 字幕', 'UP 主发布动态即时监听', '支持按关键词检索高赞科普视频', '输出结构化知识点'],
    sampleEndpoint: 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=36',
    setupGuide: 'npm install bilibili-api-collect',
    docsUrl: 'https://github.com/SocialSisterYi/bilibili-API-collect',
    supportedSources: ['科技区硬核科普', '计算机技术精讲', '经济商业分析', '发布会速记字幕'],
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    id: 'weibo-spider',
    name: 'Weibo-Spider (微博舆情与线索监控)',
    repo: 'dataabc/weibo-spider',
    stars: '6.7k',
    category: 'social_media',
    description: '持续追踪新浪微博博主动态、关键词超话以及行业突发舆情事件，自动清洗文本与时间线并归档。',
    features: ['指定博主增量抓取', '支持关键词实时监控', '自动去除表情符号与短链', '生成 CSV 与 Markdown'],
    sampleEndpoint: 'http://localhost:5000/api/weibo/search?keyword=人工智能',
    setupGuide: 'pip install weibo-spider',
    docsUrl: 'https://github.com/dataabc/weibo-spider',
    supportedSources: ['行业KOL博主', 'AI领域突发话题', '产品发布会实时舆情', '品牌公关监测'],
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'archivebox',
    name: 'ArchiveBox (中文网页永久存证)',
    repo: 'ArchiveBox/ArchiveBox',
    stars: '22.3k',
    category: 'archiver',
    description: '开源自建网页存档系统，自动抓取 HTML、PDF、截图及纯文本，永久保存原始来源证据，防止网页被删或 404 失效。',
    features: ['多格式离线持久化', '生成时间戳与 SHA-256 存证', '全文索引搜索支持', '与 Raw 知识库无缝打通'],
    sampleEndpoint: 'http://localhost:8000/api/v1/core/snapshot/',
    setupGuide: 'docker run -v ~/data:/data -p 8000:8000 archivebox/archivebox',
    docsUrl: 'https://archivebox.io/',
    supportedSources: ['易失效的新闻线索', '行业关键调研源网页', '政府招投标公告', '竞争对手官网变动'],
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  }
];

export const INITIAL_AUTO_TASKS: AutoIngestTask[] = [
  {
    id: 'task-36kr-ai',
    name: '36氪·AI 前沿动态与大模型快讯采集',
    category: '科技新闻',
    connectorId: 'rsshub',
    connectorName: 'RSSHub',
    icon: 'Sparkles',
    status: 'active',
    cronSchedule: '每 30 分钟',
    cronExpression: '*/30 * * * *',
    lastRunTime: '10 分钟前',
    nextRunTime: '20 分钟后',
    totalFetchedItems: 148,
    totalCompiledWiki: 26,
    targetEndpoint: 'https://rsshub.app/36kr/motif/1723438259461120',
    keywordsFilter: ['AI', 'Agent', '大模型', '算力', '开源', '推理', '具身智能'],
    aiSummaryPrompt: '提取该科技快讯的3点核心商业/技术事实，指出涉及的机构、估值与核心创新点，并生成 [[wiki/terms/...]] 关联。',
    autoCompileToWiki: true,
    targetRawFolder: 'raw/auto-tasks/36kr-ai/',
    targetWikiFolder: 'wiki/intelligence/tech-news/',
    latestLogs: [
      '[12:45:00] 成功通过 RSSHub 抓取 8 条最新快讯',
      '[12:45:02] Agent 过滤命中 4 条符合 AI 关键词的文章',
      '[12:45:06] 自动生成 1 篇综合洞察，已编织写入 wiki/intelligence/tech-news/2026-08-21-ai-brief.md',
      '[12:45:07] 更新 index.md 索引与知识图谱'
    ],
    sampleRecentArticles: [
      {
        title: '阿里通义千问开源新一代端侧超轻量模型，推理能效比提升 40%',
        source: '36氪快讯 (RSSHub 驱动)',
        pubDate: '2026-08-21 12:30',
        snippet: '针对移动端与嵌入式智能体场景，阿里最新推出兼具长上下文与极速响应的开源端侧模型，已在开源社区全面上线...',
        url: 'https://36kr.com/newsflashes/12345678',
        aiTags: ['大模型', '端侧推理', '开源生态'],
        compiledWikiPath: 'wiki/intelligence/tech-news/qwen-edge-model.md'
      },
      {
        title: 'OpenAI 计划于下周上线全新智能体调度协议，支持多工具自治编排',
        source: '36氪深度 (RSSHub 驱动)',
        pubDate: '2026-08-21 11:15',
        snippet: '知情人士透露，新协议将允许复杂工作流在多个专用 Sub-agent 间自动流转并具备自愈纠错机制...',
        url: 'https://36kr.com/p/23456789',
        aiTags: ['Agent架构', '工作流', '协议规范'],
        compiledWikiPath: 'wiki/engineering/agent-orchestration-protocols.md'
      }
    ]
  },
  {
    id: 'task-dailyhot-topics',
    name: '全网热搜·今日热榜热点线索提炼',
    category: '舆情聚合',
    connectorId: 'dailyhot-api',
    connectorName: 'TodayDailyHot API',
    icon: 'Flame',
    status: 'active',
    cronSchedule: '每 1 小时',
    cronExpression: '0 * * * *',
    lastRunTime: '35 分钟前',
    nextRunTime: '25 分钟后',
    totalFetchedItems: 420,
    totalCompiledWiki: 34,
    targetEndpoint: 'https://api.dailyhot.today/api/all?sources=zhihu,weibo,bilibili,36kr',
    keywordsFilter: ['科技', '产业', '政策', '芯片', '自动驾驶', '出海'],
    aiSummaryPrompt: '对比知乎、微博与36氪交叉热榜，提炼当前社会与产业讨论最热烈的话题脉络，归纳舆情走向。',
    autoCompileToWiki: true,
    targetRawFolder: 'raw/auto-tasks/dailyhot/',
    targetWikiFolder: 'wiki/intelligence/dailyhot-trends/',
    latestLogs: [
      '[12:00:01] 轮询 TodayDailyHot API，拉取 4 个主流平台共计 120 条榜单',
      '[12:00:03] 去重与主题聚类完成，识别出 3 个行业热点聚集簇',
      '[12:00:08] 生成「全网科技舆情与行业热议日报 (2026-08-21)」并归档'
    ],
    sampleRecentArticles: [
      {
        title: '知乎热榜第一：如何看待国内企业全面转向 Agentic 工作流？',
        source: '知乎热榜 (TodayDailyHot API)',
        pubDate: '2026-08-21 11:50',
        snippet: '讨论重点聚焦于企业从传统 RPA 向具备反思与规划能力的自主智能体系统演进过程中的安全边界与ROI...',
        url: 'https://www.zhihu.com/question/98765432',
        aiTags: ['热榜TOP1', 'Agentic工作流', '企业转型'],
        compiledWikiPath: 'wiki/sops/agent-workflow-best-practices.md'
      },
      {
        title: '微博热搜：我国新一代算力调度互联标准正式发布',
        source: '微博热搜 (TodayDailyHot API)',
        pubDate: '2026-08-21 10:20',
        snippet: '多部委联合发布全国一体化算力网调度标准，推进跨区域异构算力无缝调度与绿色低碳协同...',
        url: 'https://s.weibo.com/weibo?q=算力调度互联标准',
        aiTags: ['宏观政策', '算力网', '新基建']
      }
    ]
  },
  {
    id: 'task-akshare-macro',
    name: 'AkShare·宏观财经与央行政策快讯同步',
    category: '金融财经',
    connectorId: 'akshare',
    connectorName: 'AkShare',
    icon: 'TrendingUp',
    status: 'active',
    cronSchedule: '每天 08:30, 18:00',
    cronExpression: '30 8,18 * * *',
    lastRunTime: '4 小时前',
    nextRunTime: '5 小时后',
    totalFetchedItems: 85,
    totalCompiledWiki: 12,
    targetEndpoint: 'http://localhost:8080/api/public/stock_news_em',
    keywordsFilter: ['央行', '降准', '利率', '货币政策', '外贸', '半导体出口', '新质生产力'],
    aiSummaryPrompt: '结构化提取政策文件文号、核心数字指标变动、对企业中长期现金流与出海供应链的具体影响评估。',
    autoCompileToWiki: true,
    targetRawFolder: 'raw/auto-tasks/akshare-finance/',
    targetWikiFolder: 'wiki/company-info/market-macro/',
    latestLogs: [
      '[08:30:00] AkShare 调度触发，抓取早盘宏观资讯 22 条',
      '[08:30:04] 提取央行最新公开市场操作与利率导向声明',
      '[08:30:07] 已编织入企业财务与战略参考手册'
    ],
    sampleRecentArticles: [
      {
        title: '央行开展 3000 亿元中期借贷便利 (MLF) 操作，利率保持稳定',
        source: '东方财富 (AkShare 接口)',
        pubDate: '2026-08-21 08:20',
        snippet: '中国人民银行公告称，为维护银行体系流动性合理充裕，开展 3000 亿元 MLF 操作，充分满足金融机构资金需求...',
        url: 'http://www.pbc.gov.cn/goutongjiaoliu/12345',
        aiTags: ['货币政策', 'MLF', '流动性'],
        compiledWikiPath: 'wiki/company-info/finance-macro-2026.md'
      }
    ]
  },
  {
    id: 'task-wechat-deeptech',
    name: '微信公众号·硬核技术大号更新监控',
    category: '深度研报',
    connectorId: 'wechat-feeds',
    connectorName: 'Wechat-Feeds',
    icon: 'BookOpen',
    status: 'active',
    cronSchedule: '每 2 小时',
    cronExpression: '0 */2 * * *',
    lastRunTime: '1 小时前',
    nextRunTime: '1 小时后',
    totalFetchedItems: 64,
    totalCompiledWiki: 18,
    targetEndpoint: 'https://wechat-feeds.app/feed/gh_machine_heart.xml',
    keywordsFilter: ['架构', 'LLM Wiki', '知识图谱', '向量数据库', 'RAG', 'Transformer', '评估基准'],
    aiSummaryPrompt: '将长文转换为带二级大纲的标准知识库结构，提取文中出现的开源项目链接与代码片段。',
    autoCompileToWiki: true,
    targetRawFolder: 'raw/auto-tasks/wechat-feeds/',
    targetWikiFolder: 'wiki/engineering/deep-research/',
    latestLogs: [
      '[11:00:00] 检测到公众号「机器之心」与「量子位」新发布 3 篇深度研报',
      '[11:00:08] 自动完成图片图表 OCR 与长文 Markdown 清洗',
      '[11:00:15] 生成 2 篇核心架构解析文档并关联到知识库'
    ],
    sampleRecentArticles: [
      {
        title: 'Karpathy「LLM OS」理论企业级落地的最后一块拼图：从文件编译到自愈 Wiki',
        source: '机器之心 (Wechat-Feeds 驱动)',
        pubDate: '2026-08-21 10:45',
        snippet: '本文深入探讨了如何摒弃死板的传统 Wiki，利用大模型持续监控私有与开源信息，将原始文本编译为活的知识网络...',
        url: 'https://mp.weixin.qq.com/s/example123456',
        aiTags: ['Karpathy理论', '知识编译', '自愈网络'],
        compiledWikiPath: 'wiki/core-concepts/karpathy-llm-wiki.md'
      }
    ]
  },
  {
    id: 'task-github-trending',
    name: 'GitHub·中文高星开源项目与 AI 仓库监控',
    category: '代码前沿',
    connectorId: 'rsshub',
    connectorName: 'RSSHub',
    icon: 'Code2',
    status: 'active',
    cronSchedule: '每天 09:00',
    cronExpression: '0 9 * * *',
    lastRunTime: '3 小时前',
    nextRunTime: '21 小时后',
    totalFetchedItems: 110,
    totalCompiledWiki: 22,
    targetEndpoint: 'https://rsshub.app/github/trending/daily/any/chinese',
    keywordsFilter: ['Agent', 'Knowledge Base', 'Workflow', 'RAG', 'Scraper', 'Obsidian', 'LLM'],
    aiSummaryPrompt: '分析该项目的核心架构、Star 增长速度、核心痛点解决能力，并评估引入公司技术栈的可行性。',
    autoCompileToWiki: true,
    targetRawFolder: 'raw/auto-tasks/github-trending/',
    targetWikiFolder: 'wiki/engineering/open-source-eval/',
    latestLogs: [
      '[09:00:00] 抓取 GitHub 中文 Trending 榜单前 25 个仓库',
      '[09:00:05] 命中 6 个与企业知识中枢强相关的高星项目',
      '[09:00:12] 完成技术评估卡片生成与写入'
    ],
    sampleRecentArticles: [
      {
        title: 'unclecode/crawl4ai: 专为 LLM 与智能体打造的下一代开源网页抽取框架',
        source: 'GitHub Trending (RSSHub 驱动)',
        pubDate: '2026-08-21 08:30',
        snippet: '单日新增 Star +1,240，支持多模态网页解析与一键导出干净 Markdown，完美兼容大模型微调与知识库入库...',
        url: 'https://github.com/unclecode/crawl4ai',
        aiTags: ['爬虫引擎', 'LLM数据管道', 'Star破26k'],
        compiledWikiPath: 'wiki/engineering/crawl4ai-evaluation.md'
      }
    ]
  }
];
