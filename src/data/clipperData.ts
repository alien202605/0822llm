import { ClipperTemplate, ClipperJob, ClipperDaemonMetric } from '../types';

export const INITIAL_CLIPPER_METRIC: ClipperDaemonMetric = {
  browserExtensionInstalled: true,
  feishuWebhookActive: true,
  totalClippedToday: 42,
  averageExtractLatencyMs: 640,
  obsidianVaultAutoSave: true,
  autoWeaveEnabled: true
};

export interface OpenSourcePluginInfo {
  id: string;
  name: string;
  repo: string;
  license: string;
  stars: string;
  description: string;
  installMethod: string;
  protocolLink: string;
  tag: string;
}

export const OPEN_SOURCE_CLIPPER_PLUGINS: OpenSourcePluginInfo[] = [
  {
    id: 'obsidian-official-clipper',
    name: 'Obsidian Web Clipper (Official Browser Extension)',
    repo: 'github.com/obsidianmd/obsidian-clipper',
    license: 'MIT License',
    stars: '6.8k ★',
    description: 'Obsidian 官方开源的跨浏览器剪藏插件 (Chrome / Firefox / Safari / Edge / Arc)。支持高亮高亮、自定义变量 {{title}} / {{content}}、CSS 规则提取，并通过 obsidian:// 协议或 Local REST API 自动存入本地知识库。',
    installMethod: 'Chrome Web Store / Firefox Addons / GitHub Releases',
    protocolLink: 'obsidian://clipper/config',
    tag: '官方核心推荐'
  },
  {
    id: 'feishu-docs-to-obsidian',
    name: 'Feishu Docs to Obsidian Importer',
    repo: 'github.com/hx23840/feishu-docs-to-obsidian',
    license: 'MIT License',
    stars: '1.4k ★',
    description: '通过飞书/Lark OpenAPI 与 CLI 深度集成，一键将飞书云文档 Docx 或 Wiki 页面无损转换为标准 Markdown。自动转存文章内所有高清图片为本地附件，并保留多列分栏、Callouts 与数据表格。',
    installMethod: 'Obsidian BRAT 插件 / 手动解压至 .obsidian/plugins/',
    protocolLink: 'obsidian://feishu-importer/settings',
    tag: '飞书无损转换'
  },
  {
    id: 'jina-reader-pipeline',
    name: 'Jina Reader API / Readability.js Ingestion',
    repo: 'github.com/jina-ai/reader',
    license: 'Apache 2.0',
    stars: '14.2k ★',
    description: '在任意公开网址前添加 https://r.jina.ai/ 即可自动提取清洗为 LLM-Ready 的高密度干净 Markdown。内置反反爬、动态渲染与广告过滤，是全网内容自动化入库的最佳伴侣。',
    installMethod: 'REST API / npm i @mozilla/readability turndown',
    protocolLink: 'https://r.jina.ai/',
    tag: '全网正文提取'
  },
  {
    id: 'feishu-inbox',
    name: 'Feishu Inbox Sync Daemon',
    repo: 'github.com/chenfeizhou/obsidian-feishu-inbox',
    license: 'MIT License',
    stars: '860 ★',
    description: '企业飞书群/机器人消息自动同步插件。团队成员在飞书群中随手 @知识库机器人 或发送文章链接，后台守护进程秒级监听 Webhook 并自动拉取转存为收件箱笔记。',
    installMethod: 'Obsidian Community Plugins 市场直装',
    protocolLink: 'obsidian://show-plugin?id=feishu-inbox',
    tag: '飞书群自动化'
  }
];

export const OFFICIAL_CLIPPER_TEMPLATES: ClipperTemplate[] = [
  {
    id: 'tpl-tech-article',
    name: '📰 互联网技术深度长文 (Tech Article)',
    category: '行业研究',
    description: '用于剪藏掘金、知乎专栏、Medium、Substack、技术博客与公众号干货文章，自动提取作者、发布日期与正文。',
    targetFolder: 'raw/web-clippings/articles',
    properties: {
      title: '{{title}}',
      source: '{{url}}',
      author: '{{author}}',
      clipped_at: '{{date}}',
      type: 'tech_article',
      status: 'raw_captured'
    },
    contentTemplate: `# {{title}}

> **原文出处**: [{{title}}]({{url}})  
> **原作者**: {{author|default:"互联网作者"}}  
> **剪藏时间**: {{date}} {{time}}  
> **分类标签**: #web-clipping #tech-deepdive  

---

## 📌 文章核心摘要 (AI 自动浓缩)
{{description}}

---

## 📖 剪藏正文内容
{{content}}

---
*本文由 Obsidian Web Clipper 自动捕获并并入企业 Raw 库*`,
    triggers: ['medium.com', 'juejin.cn', 'zhuanlan.zhihu.com', 'techcrunch.com', 'news.ycombinator.com']
  },
  {
    id: 'tpl-feishu-docx',
    name: '🪶 飞书云文档/Wiki (Feishu Docx & Wiki)',
    category: '企业协同',
    description: '精准对齐飞书 Docx 的 Callout、表格与图片附件，自动生成 Frontmatter 与双链草稿。',
    targetFolder: 'raw/feishu-docs',
    properties: {
      title: '{{title}}',
      feishu_url: '{{url}}',
      creator: '{{author}}',
      doc_token: '{{feishu_token}}',
      imported_at: '{{date}}',
      type: 'feishu_sync'
    },
    contentTemplate: `# {{title}}

> **飞书源文档**: [查看飞书在线源文档]({{url}})  
> **撰写责任人**: {{author}}  
> **导入状态**: ✅ 已完成飞书组件 Markdown AST 降噪解析  

---

## 📑 飞书文档正文 (已无损转存附件与 Callouts)
{{content}}

---
*由 feishu-docs-to-obsidian 引擎全自动编织入库*`,
    triggers: ['feishu.cn/docx/', 'feishu.cn/wiki/', 'larksuite.com/docx/']
  },
  {
    id: 'tpl-github-repo',
    name: '🐙 GitHub 开源项目与架构 (GitHub Repo)',
    category: '技术工程',
    description: '剪藏开源仓库的 README、Stars、许可证与技术栈，自动归入研发参考资料。',
    targetFolder: 'raw/github-repos',
    properties: {
      title: '{{title}}',
      repo_url: '{{url}}',
      stars: '{{selector:.js-social-count}}',
      license: '{{selector:.octicon-law + span}}',
      type: 'github_spec'
    },
    contentTemplate: `# GitHub 开源技术分析: {{title}}

- **仓库地址**: [{{url}}]({{url}})
- **Stars 关注数**: {{selector:.js-social-count}}
- **开源许可证**: {{selector:.octicon-law + span}}

## 📖 仓库 README 深度导读
{{content}}`,
    triggers: ['github.com/']
  }
];

export const INITIAL_CLIPPER_JOBS: ClipperJob[] = [
  {
    id: 'clip-001',
    sourceType: 'feishu_doc',
    sourceTitle: '【飞书文档】2026 年企业级大模型微调与 RAG 落地白皮书 (内部完整版)',
    sourceUrl: 'https://company.feishu.cn/docx/doxcn9428FJa82Lkd9218942',
    author: 'AI 架构委员会 (李振 / 资深算法总监)',
    importedAt: '5 分钟前 (21:26:10)',
    status: 'completed',
    extractedWordCount: 4820,
    imagesCount: 8,
    calloutsCount: 6,
    targetRawPath: 'raw/feishu-docs/2026_rag_finetune_whitepaper.md',
    targetWikiPath: 'wiki/engineering/README.md',
    contentPreview: '本白皮书系统梳理了企业在从传统微调 (SFT) 走向 Agentic Workflow 过程中面临的六大技术难点，包括长上下文损耗、增量向量索引刷新时延、以及私有化知识库与 Obsidian Local REST API 的结合方案...',
    autoGeneratedTags: ['飞书导入', '大模型', 'RAG架构', '微调白皮书'],
    cleanMarkdown: `# 2026 年企业级大模型微调与 RAG 落地白皮书 (内部完整版)

> **飞书源地址**: https://company.feishu.cn/docx/doxcn9428FJa82Lkd9218942  
> **导入时间**: 2026-08-18 21:26:10  
> **解析引擎**: feishu-docs-to-obsidian (OpenAPI v2.0)  

---

> [!NOTE] 核心摘要
> 企业从静态 RAG 迈向企业实时知识库已成为 2026 年的核心趋势。结合 Obsidian 本地私有化存储与 qmd 混合检索，能够实现数据零外泄的高并发问答。

## 1. 架构总览
通过将飞书在线协作文档秒级转换为标准 Markdown，并存入 \`raw/feishu-docs/\`，由后台智能体自动执行实体提取与双向链接织网。`
  },
  {
    id: 'clip-002',
    sourceType: 'browser_clipper',
    sourceTitle: 'Obsidian Web Clipper 官方正式发布：浏览器一键将任意网页转为干净 Markdown',
    sourceUrl: 'https://obsidian.md/clipper',
    author: 'Steph Ango (CEO of Obsidian)',
    importedAt: '18 分钟前 (21:13:00)',
    status: 'completed',
    extractedWordCount: 2360,
    imagesCount: 3,
    calloutsCount: 2,
    targetRawPath: 'raw/web-clippings/articles/obsidian_web_clipper_release.md',
    targetWikiPath: 'wiki/company-info/realtime-living-knowledge-paradigm.md',
    contentPreview: 'We are thrilled to announce Obsidian Web Clipper, an official, free, open-source extension for Chrome, Safari, Firefox, and Edge that lets you capture any web page directly into your Obsidian vault...',
    autoGeneratedTags: ['Obsidian官方', 'WebClipper', '开源插件', '浏览器扩展'],
    cleanMarkdown: `# Obsidian Web Clipper 官方正式发布

> **原文链接**: https://obsidian.md/clipper  
> **原作者**: Steph Ango (Obsidian)  
> **剪藏方式**: Obsidian Web Clipper Browser Extension  

## 功能亮点
- 跨浏览器支持 Chrome / Firefox / Safari / Edge / Arc；
- 支持模板自定义属性变量与 CSS Selector 高亮抓取；
- 离线优先，数据直存本地 Vault，不经过第三方中间服务器。`
  },
  {
    id: 'clip-003',
    sourceType: 'public_url',
    sourceTitle: 'Jina Reader: Convert any URL to Clean, LLM-friendly Markdown in 500ms',
    sourceUrl: 'https://jina.ai/news/reader-api-llm-markdown-engine',
    author: 'Jina AI Core Team',
    importedAt: '45 分钟前 (20:46:20)',
    status: 'completed',
    extractedWordCount: 3100,
    imagesCount: 4,
    calloutsCount: 1,
    targetRawPath: 'raw/web-clippings/articles/jina_reader_llm_markdown.md',
    targetWikiPath: 'wiki/company-info/why-enterprises-need-knowledge-base.md',
    contentPreview: 'Jina Reader provides a simple API that strips navigation menus, ads, cookie banners, and cookie consent overlays, outputting a high-signal markdown format ready for RAG and autonomous knowledge compilation...',
    autoGeneratedTags: ['JinaReader', 'Markdown提取', '开源工具', '降噪清洗'],
    cleanMarkdown: `# Jina Reader: 极速将任意网页转为干净 Markdown

> **链接**: https://jina.ai/news/reader-api-llm-markdown-engine  
> **解析延迟**: 520ms (LLM-Ready Clean AST)  

## 为什么网页提取需要降噪
普通网页包含大量的 DOM 噪音（header/footer/sidebar/popups）。Jina Reader 通过 Readability 启发式算法与 DOM 剪枝，只保留高信息密度的核心文章。`
  }
];

export interface PresetClippingDemoItem {
  name: string;
  sourceType: 'feishu_doc' | 'public_url';
  url: string;
  author: string;
  defaultTitle: string;
  description: string;
}

export const PRESET_DEMO_CLIPPINGS: PresetClippingDemoItem[] = [
  {
    name: '🪶 飞书研发协同 RFC: 《微服务本地缓存与分级容灾策略》',
    sourceType: 'feishu_doc',
    url: 'https://company.feishu.cn/docx/doxcnCacheFailover2026SOP',
    author: '后端基础架构组 (陈工 / Tech Lead)',
    defaultTitle: '【飞书 RFC】微服务本地缓存与分级容灾策略实施规范',
    description: '包含 3 张多列数据表格、2 个告警 Callouts 和 4 处 Mermaid 时序图，测试飞书无损转换。'
  },
  {
    name: '🌐 互联网技术长文: 《从零构建企业级 Agentic 知识中枢与双向图谱》',
    sourceType: 'public_url',
    url: 'https://zhuanlan.zhihu.com/p/agentic-knowledge-graph-2026',
    author: '知乎专栏 · 知识工程专家组',
    defaultTitle: '从零构建企业级 Agentic 知识中枢与双向图谱实战指南',
    description: '深度长文，测试 Readability 降噪正文提取、图片无损存转与 YAML Frontmatter 自动织网。'
  },
  {
    name: '🐙 GitHub 官方技术规范: Model Context Protocol (MCP) 2.0 架构白皮书',
    sourceType: 'public_url',
    url: 'https://github.com/modelcontextprotocol/specification/blob/main/README.md',
    author: 'Anthropic & Open Source MCP Contributors',
    defaultTitle: 'Model Context Protocol (MCP) 2.0 官方架构白皮书与协议规范',
    description: '测试 GitHub README 原生 Markdown 提取、代码块高亮保持与目录层级生成。'
  }
];
