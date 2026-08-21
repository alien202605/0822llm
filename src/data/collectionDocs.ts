import { WikiPage } from '../types';
import { SOCIAL_MEDIA_COLLECTIONS } from './socialMediaCollectionDocs';

export interface CategoryCollectionGroup {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  colorClass: string;
  description: string;
  readmeDoc: WikiPage;
  exampleDocs: WikiPage[];
}

export const BASE_COLLECTION_DOCS: CategoryCollectionGroup[] = [
  // 0. Company Information (公司资料 / 基础目录)
  {
    id: 'companyInfo',
    name: '公司资料',
    nameEn: 'Company Info',
    icon: 'Building2',
    colorClass: 'text-blue-600',
    description: '企业概况、品牌愿景、组织架构、全员行政通告、重点会议纪要及员工规章制度。',
    readmeDoc: {
      id: 'wiki-company-readme',
      path: 'wiki/company-info/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 企业基础资料库与全员知识管理总纲',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/corporate-handbook-2026.pdf', 'raw/org-structure-v4.docx'],
        tags: ['公司资料', '全员总纲', '组织架构', '通知规范', '会议制度'],
        aliases: ['公司资料说明', 'Company Info README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 企业基础资料库与全员知识管理总纲

> **维护机构**: 总经办 (CEO Office) & 人力行政中枢 (HR & Admin Hub)  
> **保密级别**: 全员公开 (Company-Wide Access) · 部分子模块受控  
> **更新周期**: 月度常态维护 · 遇重大通知即时发布  
> **所属分类**: 🏢 Company Information (公司资料)

---

## 1. 知识库定位与四梁八柱

「公司资料」分类是全体员工快速了解公司全貌、知悉企业最新战略决策、获取日常行政与合规制度的核心基础目录。遵循 **“权威发布、单向累加、透明可溯”** 的知识管理原则。

\`\`\`
                     ┌────────────────────────┐
                     │   🏢 企业基础资料库    │
                     └───────────┬────────────┘
                                 │
     ┌───────────────┬───────────┴───────────┬───────────────┬───────────────────┐
     ▼               ▼                       ▼               ▼                   ▼
【公司介绍】   【公司通知】            【会议资料】    【制度手册】        【知识素材】
• 企业概况     • 战略升级通告          • All-Hands 纪要• 员工入职指引      • 为什么建知识库
• 愿景价值观   • 假期行政通知          • 战略会行动项  • 信息安全合规      • 实时活知识范式
• 组织架构图   • 安全通报机制          • 执委会决议    • 差旅报销制度      • 数据底座与MCP
\`\`\`

---

## 2. 核心子目录架构与维护规范

| 子目录名称 | 责任维护方 | 核心收录内容 | 发布时效要求 |
| :--- | :--- | :--- | :--- |
| **🏢 公司介绍** | 品牌公关部 / HR | 企业发展史、核心高管架构、全球分支机构、业务线矩阵 | 季度核验更新 |
| **📢 公司通知** | 总裁办 / 行政部 | 重大人事任命、战略调整通报、全员节假日与工作模式调整 | 决策后 2 小时内发布 |
| **📅 会议资料** | 会议主持人 / 秘书组 | 季度全员大会 (All-Hands)、业务战略研讨会纪要与行动追踪表 | 会议结束后 24 小时内 |
| **📘 制度手册** | 法务部 / HR / IT | 员工手册、合规审查条例、数据安全红线、知识产权规范 | 年度评审或法令变更时 |
| **💡 知识素材** | 知识工程委员会 | 知识管理方法论、企业为什么建知识库白皮书、实时活知识架构 | 持续沉淀更新 |

---

## 3. 员工使用指引与检索技巧

1. **新员工入职 (Onboarding)**：优先研读 [[wiki/company-info/company-overview.md|企业概况与组织架构白皮书]] 与 [[wiki/company-info/employee-handbook-2026.md|全球员工入职指引与信息安全合规条例]]；
2. **理解知识库战略价值**：阅读 [[wiki/company-info/why-enterprises-need-knowledge-base.md|企业为什么要搭建知识库？核心价值、实施路径与组织收益全景解析]]；
3. **掌握前沿实时活知识范式**：研读 [[wiki/company-info/realtime-living-knowledge-paradigm.md|从静态 RAG 到企业实时知识库：活知识架构、数据刷新链路与 Agent 数据底座]]；
4. **追踪公司最新动向**：关注 [[wiki/company-info/strategic-notice-2026.md|2026 年度企业重大战略升级与全员行政通告]]；
5. **查阅全员大会决策**：检索 [[wiki/company-info/all-hands-q1-2026.md|2026 Q1 全球全员大会 (All-Hands) 纪要与战略行动清单]]。

---

## 4. 知识沉淀与变更审批 SOP

- **新建通知/纪要**: 由各部门秘书或责任人起草草稿，提交由总经办或 HRBP 审核后发布至此目录；
- **历史版本归档**: 往期失效通知按季度自动移入归档库，标题前缀自动标记 \`[归档]\`，正文顶部保留变更生效时间戳。`,
      content: `# [说明] 企业基础资料库与全员知识管理总纲

> **维护机构**: 总经办 (CEO Office) & 人力行政中枢 (HR & Admin Hub)  
> **保密级别**: 全员公开 (Company-Wide Access) · 部分子模块受控  
> **更新周期**: 月度常态维护 · 遇重大通知即时发布  
> **所属分类**: 🏢 Company Information (公司资料)

---

## 1. 知识库定位与四梁八柱

「公司资料」分类是全体员工快速了解公司全貌、知悉企业最新战略决策、获取日常行政与合规制度的核心基础目录。遵循 **“权威发布、单向累加、透明可溯”** 的知识管理原则。

\`\`\`
                     ┌────────────────────────┐
                     │   🏢 企业基础资料库    │
                     └───────────┬────────────┘
                                 │
     ┌───────────────┬───────────┴───────────┬───────────────┬───────────────────┐
     ▼               ▼                       ▼               ▼                   ▼
【公司介绍】   【公司通知】            【会议资料】    【制度手册】        【知识素材】
• 企业概况     • 战略升级通告          • All-Hands 纪要• 员工入职指引      • 为什么建知识库
• 愿景价值观   • 假期行政通知          • 战略会行动项  • 信息安全合规      • 实时活知识范式
• 组织架构图   • 安全通报机制          • 执委会决议    • 差旅报销制度      • 数据底座与MCP
\`\`\`

---

## 2. 核心子目录架构与维护规范

| 子目录名称 | 责任维护方 | 核心收录内容 | 发布时效要求 |
| :--- | :--- | :--- | :--- |
| **🏢 公司介绍** | 品牌公关部 / HR | 企业发展史、核心高管架构、全球分支机构、业务线矩阵 | 季度核验更新 |
| **📢 公司通知** | 总裁办 / 行政部 | 重大人事任命、战略调整通报、全员节假日与工作模式调整 | 决策后 2 小时内发布 |
| **📅 会议资料** | 会议主持人 / 秘书组 | 季度全员大会 (All-Hands)、业务战略研讨会纪要与行动追踪表 | 会议结束后 24 小时内 |
| **📘 制度手册** | 法务部 / HR / IT | 员工手册、合规审查条例、数据安全红线、知识产权规范 | 年度评审或法令变更时 |
| **💡 知识素材** | 知识工程委员会 | 知识管理方法论、企业为什么建知识库白皮书、实时活知识架构 | 持续沉淀更新 |

---

## 3. 员工使用指引与检索技巧

1. **新员工入职 (Onboarding)**：优先研读 [[wiki/company-info/company-overview.md|企业概况与组织架构白皮书]] 与 [[wiki/company-info/employee-handbook-2026.md|全球员工入职指引与信息安全合规条例]]；
2. **理解知识库战略价值**：阅读 [[wiki/company-info/why-enterprises-need-knowledge-base.md|企业为什么要搭建知识库？核心价值、实施路径与组织收益全景解析]]；
3. **掌握前沿实时活知识范式**：研读 [[wiki/company-info/realtime-living-knowledge-paradigm.md|从静态 RAG 到企业实时知识库：活知识架构、数据刷新链路与 Agent 数据底座]]；
4. **追踪公司最新动向**：关注 [[wiki/company-info/strategic-notice-2026.md|2026 年度企业重大战略升级与全员行政通告]]；
5. **查阅全员大会决策**：检索 [[wiki/company-info/all-hands-q1-2026.md|2026 Q1 全球全员大会 (All-Hands) 纪要与战略行动清单]]。

---

## 4. 知识沉淀与变更审批 SOP

- **新建通知/纪要**: 由各部门秘书或责任人起草草稿，提交由总经办或 HRBP 审核后发布至此目录；
- **历史版本归档**: 往期失效通知按季度自动移入归档库，标题前缀自动标记 \`[归档]\`，正文顶部保留变更生效时间戳。`,
      outgoingLinks: [
        'wiki/company-info/company-overview.md',
        'wiki/company-info/strategic-notice-2026.md',
        'wiki/company-info/all-hands-q1-2026.md',
        'wiki/company-info/employee-handbook-2026.md',
        'wiki/company-info/why-enterprises-need-knowledge-base.md',
        'wiki/company-info/realtime-living-knowledge-paradigm.md'
      ],
      wordCount: 1480
    },
    exampleDocs: [
      // 1. 公司介绍 (Company Overview)
      {
        id: 'wiki-company-overview',
        path: 'wiki/company-info/company-overview.md',
        fileName: 'company-overview.md',
        frontmatter: {
          title: '[资料] 企业概况、发展愿景与组织架构白皮书',
          type: 'product',
          created_at: '2026-08-18',
          updated_at: '2026-08-18',
          sources: ['raw/acme-corp-overview-2026.pdf'],
          tags: ['公司介绍', '组织架构', '核心高管', '业务全景', '企业文化'],
          aliases: ['企业概况白皮书', 'Company Profile 2026'],
          status: 'active'
        },
        rawMarkdown: `# [资料] 企业概况、发展愿景与组织架构白皮书

> **文档代号**: CORP-PROFILE-2026-V1  
> **适用对象**: 全体员工、外部生态合作伙伴、新入职成员  
> **当前生效版本**: 2026.Q3  

---

## 1. 公司基本概况 (Company Overview)

Acme Corporation (简称 Acme) 创立于 2021 年，是一家专注于 **企业级智能知识中枢 (Enterprise Knowledge Intelligence Hub)** 与 **Agentic 自动化协同系统** 的全球化科技企业。

- **愿景 (Vision)**: 让全球每一家企业都能拥有永续生长、无缝互联的自主智能知识网络。
- **使命 (Mission)**: 终结企业内部信息孤岛与割裂文档，实现人机协同的高密度知识编译与分发。
- **核心价值观 (Core Values)**:
  1. **客户价值优先 (Customer Obsessed)**: 所有的技术创新必须可衡量地提升客户工作效率；
  2. **终极真实与透明 (Radical Truth & Transparency)**: 事实与数据胜于权威，鼓励全员对齐上下文；
  3. **极致工匠精神 (Extreme Craftsmanship)**: 从 API 毫秒级响应到 UI 每一个像素间距，追求世界级标准；
  4. **长期主义复利 (Long-term Compounding)**: 坚持建立单调累加的知识体系，沉淀永续资产。

---

## 2. 全球分支机构与研发中心

\`\`\`
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   北美总部 (HQ)   │     │   亚太创新中心    │     │   欧洲合规与商务  │
│   旧金山 / 硅谷   │     │   新加坡 / 深圳   │     │   伦敦 / 柏林     │
│  基础大模型与架构 │     │ 行业解决方案与交付│     │  GDPR合规与生态拓展│
└───────────────────┘     └───────────────────┘     └───────────────────┘
\`\`\`

---

## 3. 组织管理架构 (Executive Leadership & Structure)

- **执委会 (Executive Committee)**:
  - **Chief Executive Officer (CEO)**: Jenn Smith
  - **Chief Technology Officer (CTO)**: Dr. Aris Thorne
  - **Chief Product Officer (CPO)**: Elena Rostova
  - **VP of Enterprise Solutions**: Marcus Vance
  - **Head of People & Culture (HR)**: Sarah Lin
- **核心事业群 (Business Units)**:
  - **Knowledge Engine BU**: 负责 Obsidian 本地网关、混合倒排/向量即席检索引擎 \`qmd\`、Markdown 编译管线；
  - **AI Agent Automation BU**: 负责 Karpathy 3-Loop 自动化整理 Agent、Canvas 图谱自主推理引擎；
  - **Enterprise Platform BU**: 负责多租户安全、RBAC 权限、Webhooks 回调系统与私有化部署。`,
        content: `# [资料] 企业概况、发展愿景与组织架构白皮书

> **文档代号**: CORP-PROFILE-2026-V1  
> **适用对象**: 全体员工、外部生态合作伙伴、新入职成员  
> **当前生效版本**: 2026.Q3  

---

## 1. 公司基本概况 (Company Overview)

Acme Corporation (简称 Acme) 创立于 2021 年，是一家专注于 **企业级智能知识中枢 (Enterprise Knowledge Intelligence Hub)** 与 **Agentic 自动化协同系统** 的全球化科技企业。

- **愿景 (Vision)**: 让全球每一家企业都能拥有永续生长、无缝互联的自主智能知识网络。
- **使命 (Mission)**: 终结企业内部信息孤岛与割裂文档，实现人机协同的高密度知识编译与分发。
- **核心价值观 (Core Values)**:
  1. **客户价值优先 (Customer Obsessed)**: 所有的技术创新必须可衡量地提升客户工作效率；
  2. **终极真实与透明 (Radical Truth & Transparency)**: 事实与数据胜于权威，鼓励全员对齐上下文；
  3. **极致工匠精神 (Extreme Craftsmanship)**: 从 API 毫秒级响应到 UI 每一个像素间距，追求世界级标准；
  4. **长期主义复利 (Long-term Compounding)**: 坚持建立单调累加的知识体系，沉淀永续资产。

---

## 2. 全球分支机构与研发中心

\`\`\`
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   北美总部 (HQ)   │     │   亚太创新中心    │     │   欧洲合规与商务  │
│   旧金山 / 硅谷   │     │   新加坡 / 深圳   │     │   伦敦 / 柏林     │
│  基础大模型与架构 │     │ 行业解决方案与交付│     │  GDPR合规与生态拓展│
└───────────────────┘     └───────────────────┘     └───────────────────┘
\`\`\`

---

## 3. 组织管理架构 (Executive Leadership & Structure)

- **执委会 (Executive Committee)**:
  - **Chief Executive Officer (CEO)**: Jenn Smith
  - **Chief Technology Officer (CTO)**: Dr. Aris Thorne
  - **Chief Product Officer (CPO)**: Elena Rostova
  - **VP of Enterprise Solutions**: Marcus Vance
  - **Head of People & Culture (HR)**: Sarah Lin
- **核心事业群 (Business Units)**:
  - **Knowledge Engine BU**: 负责 Obsidian 本地网关、混合倒排/向量即席检索引擎 \`qmd\`、Markdown 编译管线；
  - **AI Agent Automation BU**: 负责 Karpathy 3-Loop 自动化整理 Agent、Canvas 图谱自主推理引擎；
  - **Enterprise Platform BU**: 负责多租户安全、RBAC 权限、Webhooks 回调系统与私有化部署。`,
        outgoingLinks: ['wiki/company-info/README.md'],
        wordCount: 1350
      },
      // 2. 公司相关通知 (Company Notices)
      {
        id: 'wiki-company-notice-strategic',
        path: 'wiki/company-info/strategic-notice-2026.md',
        fileName: 'strategic-notice-2026.md',
        frontmatter: {
          title: '[通知] 2026 年度企业重大战略升级与全员行政通告',
          type: 'sop',
          created_at: '2026-08-18',
          updated_at: '2026-08-18',
          sources: ['raw/executive-notice-2026-08.pdf'],
          tags: ['公司通知', '行政公告', '战略升级', '混合办公', '福利政策'],
          aliases: ['2026战略升级通知', 'All-Company Announcement'],
          status: 'active'
        },
        rawMarkdown: `# [通知] 2026 年度企业重大战略升级与全员行政通告

> **签发人**: Jenn Smith (CEO) & 执委会  
> **发布日期**: 2026 年 8 月 18 日  
> **通知文号**: ACME-ADMIN-2026-042  
> **传达范围**: 全球全体正式员工与长期协同顾问  

---

## 1. 核心战略方向调整公告

全体 Acme 同仁：

随着大语言模型与 Agentic 架构在企业知识管理领域的突破性进展，执委会在 2026 年下半年正式启动 **「Agentic First 知识工程战役」**。全体产研与交付团队将围绕以下三项核心举措全面升级：

1. **全面接入 Obsidian Local REST API 生态**: 推进私有化 Vault 本地加密与云端索引的无缝双轨制；
2. **启动 qmd 即席混合检索引擎全量集成**: 实现毫秒级 BM25 倒排与向量嵌入融合搜索；
3. **建立 Karpathy 知识生命周期自动化 SOP**: 知识库从“被动撰写”转向“Agent 主动提取与定期巡检自愈”。

---

## 2. 员工协同与混合办公 (Hybrid Work) 优化政策

为支持全球分布式研发，自 2026 年 9 月 1 日起实施新版办公指引：

| 办公模式 | 适用团队 | 协同要求 | 补贴与支持 |
| :--- | :--- | :--- | :--- |
| **混合办公 (3+2)** | 产研、设计、市场核心组 | 每周二、四全员集中在办公室进行 Brainstorm 与评审 | 提供每月远程办公设备与网络补贴 |
| **全远程 (Full Remote)** | 全球分布式架构师与顾问 | 保持 Slack/Lark 在线，按周同步异步周报与 Wiki | 每年报销两次总部全员大会差旅 |
| **驻场驻客 (On-site)** | 关键客户解决方案架构组 | 按客户现场安全与保密协议排期 | 专属差旅标准与现场专项津贴 |

---

## 3. 全员信息安全与数据隔离强化通知

- **禁止非合规外发**: 严禁将包含客户 PII（个人身份信息）或未发布源码上传至未经安全审查的外部公共 AI 工具；
- **Vault 密钥更新**: 各部门需在 8 月 31 日前完成 Obsidian 本地 API 访问密钥的季度轮转。`,
        content: `# [通知] 2026 年度企业重大战略升级与全员行政通告

> **签发人**: Jenn Smith (CEO) & 执委会  
> **发布日期**: 2026 年 8 月 18 日  
> **通知文号**: ACME-ADMIN-2026-042  
> **传达范围**: 全球全体正式员工与长期协同顾问  

---

## 1. 核心战略方向调整公告

全体 Acme 同仁：

随着大语言模型与 Agentic 架构在企业知识管理领域的突破性进展，执委会在 2026 年下半年正式启动 **「Agentic First 知识工程战役」**。全体产研与交付团队将围绕以下三项核心举措全面升级：

1. **全面接入 Obsidian Local REST API 生态**: 推进私有化 Vault 本地加密与云端索引的无缝双轨制；
2. **启动 qmd 即席混合检索引擎全量集成**: 实现毫秒级 BM25 倒排与向量嵌入融合搜索；
3. **建立 Karpathy 知识生命周期自动化 SOP**: 知识库从“被动撰写”转向“Agent 主动提取与定期巡检自愈”。

---

## 2. 员工协同与混合办公 (Hybrid Work) 优化政策

为支持全球分布式研发，自 2026 年 9 月 1 日起实施新版办公指引：

| 办公模式 | 适用团队 | 协同要求 | 补贴与支持 |
| :--- | :--- | :--- | :--- |
| **混合办公 (3+2)** | 产研、设计、市场核心组 | 每周二、四全员集中在办公室进行 Brainstorm 与评审 | 提供每月远程办公设备与网络补贴 |
| **全远程 (Full Remote)** | 全球分布式架构师与顾问 | 保持 Slack/Lark 在线，按周同步异步周报与 Wiki | 每年报销两次总部全员大会差旅 |
| **驻场驻客 (On-site)** | 关键客户解决方案架构组 | 按客户现场安全与保密协议排期 | 专属差旅标准与现场专项津贴 |

---

## 3. 全员信息安全与数据隔离强化通知

- **禁止非合规外发**: 严禁将包含客户 PII（个人身份信息）或未发布源码上传至未经安全审查的外部公共 AI 工具；
- **Vault 密钥更新**: 各部门需在 8 月 31 日前完成 Obsidian 本地 API 访问密钥的季度轮转。`,
        outgoingLinks: ['wiki/company-info/README.md', 'wiki/company-info/employee-handbook-2026.md'],
        wordCount: 1210
      },
      // 3. 会议资料 (Meeting Minutes)
      {
        id: 'wiki-company-meeting-allhands',
        path: 'wiki/company-info/all-hands-q1-2026.md',
        fileName: 'all-hands-q1-2026.md',
        frontmatter: {
          title: '[会议] 2026 Q1 全球全员大会 (All-Hands) 纪要与战略行动清单',
          type: 'project',
          created_at: '2026-08-18',
          updated_at: '2026-08-18',
          sources: ['raw/all-hands-q1-recording-transcript.docx'],
          tags: ['会议资料', '全员大会', 'All-Hands', 'OKR对齐', '行动清单'],
          aliases: ['2026 Q1 All-Hands 纪要', 'Q1 Town Hall Minutes'],
          status: 'active'
        },
        rawMarkdown: `# [会议] 2026 Q1 全球全员大会 (All-Hands) 纪要与战略行动清单

> **会议时间**: 2026 年 8 月 15 日 09:30 - 11:30 (SGT)  
> **会议形式**: 全球线上混合联席 (主会场: 旧金山 + 新加坡分会场)  
> **主持人**: Sarah Lin (HR Head)  
> **主讲人**: Jenn Smith (CEO), Dr. Aris Thorne (CTO), Elena Rostova (CPO)  

---

## 1. 核心议程与业务关键数据回顾

### A. CEO 战略演讲: “从文件堆积到活的知识大脑”
- **经营指标**: 上半年 ARR 同比增长 142%，企业级付费节点突破 5,200 个；
- **标杆客户**: 签约 3 家全球顶级金融机构与 12 家高精尖智能制造企业；
- **核心挑战**: 客户海量非结构化 PDF/Word 解析损耗大，需加快批量文档处理引擎落地。

### B. CTO 技术路线发布: “Obsidian 本地优先与 Agentic 闭环”
- 验证了前端直连 Obsidian REST API 网关架构的可行性，降低了中心化服务器的数据合规风险；
- 正式开源企业级 DQL 跨库查询组件，支持秒级执行知识库复杂条件过滤。

---

## 2. 问答环节 (AMA / Q&A) 关键决议

1. **Q: 本地知识库与云端团队库冲突时如何解决？**  
   *A (Aris CTO)*: 采用单调累加合并策略 (Monotonic Union)，冲突节点自动进入人工复核队列，绝不覆盖已有高价值 Wiki 节点。
2. **Q: 下半年是否有团队股权激励与职级晋升窗口？**  
   *A (Sarah HR)*: 2026 年度秋季职级评审已于 8 月 20 日启动，HR 将在一周内下发评审申报手册。

---

## 3. 会后行动追踪清单 (Action Items Tracker)

| 任务事项 (Action Item) | 责任负责人 | 截止交付时间 | 当前状态 | 验收产物 |
| :--- | :--- | :--- | :--- | :--- |
| **完成 Craft 现代排版与双向链接高亮优化** | 前端组 @Alex | 2026-08-25 | 🟢 进行中 | 交互验收通过 |
| **部署多源文件 (PDF/Table/Docx) 解析中间件** | 后端组 @Phoebe | 2026-08-30 | 🟢 进行中 | 测试用例通过率 > 99% |
| **发布全员分类说明文件与示例文档** | 知识委员会 @Jenn | 2026-08-20 | ✅ 已完成 | 6 大基础目录上线 |`,
        content: `# [会议] 2026 Q1 全球全员大会 (All-Hands) 纪要与战略行动清单

> **会议时间**: 2026 年 8 月 15 日 09:30 - 11:30 (SGT)  
> **会议形式**: 全球线上混合联席 (主会场: 旧金山 + 新加坡分会场)  
> **主持人**: Sarah Lin (HR Head)  
> **主讲人**: Jenn Smith (CEO), Dr. Aris Thorne (CTO), Elena Rostova (CPO)  

---

## 1. 核心议程与业务关键数据回顾

### A. CEO 战略演讲: “从文件堆积到活的知识大脑”
- **经营指标**: 上半年 ARR 同比增长 142%，企业级付费节点突破 5,200 个；
- **标杆客户**: 签约 3 家全球顶级金融机构与 12 家高精尖智能制造企业；
- **核心挑战**: 客户海量非结构化 PDF/Word 解析损耗大，需加快批量文档处理引擎落地。

### B. CTO 技术路线发布: “Obsidian 本地优先与 Agentic 闭环”
- 验证了前端直连 Obsidian REST API 网关架构的可行性，降低了中心化服务器的数据合规风险；
- 正式开源企业级 DQL 跨库查询组件，支持秒级执行知识库复杂条件过滤。

---

## 2. 问答环节 (AMA / Q&A) 关键决议

1. **Q: 本地知识库与云端团队库冲突时如何解决？**  
   *A (Aris CTO)*: 采用单调累加合并策略 (Monotonic Union)，冲突节点自动进入人工复核队列，绝不覆盖已有高价值 Wiki 节点。
2. **Q: 下半年是否有团队股权激励与职级晋升窗口？**  
   *A (Sarah HR)*: 2026 年度秋季职级评审已于 8 月 20 日启动，HR 将在一周内下发评审申报手册。

---

## 3. 会后行动追踪清单 (Action Items Tracker)

| 任务事项 (Action Item) | 责任负责人 | 截止交付时间 | 当前状态 | 验收产物 |
| :--- | :--- | :--- | :--- | :--- |
| **完成 Craft 现代排版与双向链接高亮优化** | 前端组 @Alex | 2026-08-25 | 🟢 进行中 | 交互验收通过 |
| **部署多源文件 (PDF/Table/Docx) 解析中间件** | 后端组 @Phoebe | 2026-08-30 | 🟢 进行中 | 测试用例通过率 > 99% |
| **发布全员分类说明文件与示例文档** | 知识委员会 @Jenn | 2026-08-20 | ✅ 已完成 | 6 大基础目录上线 |`,
        outgoingLinks: ['wiki/company-info/README.md', 'wiki/company-info/company-overview.md'],
        wordCount: 1420
      },
      // 4. 制度手册 (Employee Handbook & Compliance)
      {
        id: 'wiki-company-handbook-compliance',
        path: 'wiki/company-info/employee-handbook-2026.md',
        fileName: 'employee-handbook-2026.md',
        frontmatter: {
          title: '[制度] 全球员工入职指引与信息安全合规条例',
          type: 'sop',
          created_at: '2026-08-18',
          updated_at: '2026-08-18',
          sources: ['raw/hr-handbook-2026-rev3.pdf'],
          tags: ['员工手册', '入职指引', '信息安全', '合规条例', '报销制度'],
          aliases: ['员工手册2026', 'Onboarding & Compliance'],
          status: 'active'
        },
        rawMarkdown: `# [制度] 全球员工入职指引与信息安全合规条例

> **归口管理**: 人力资源部 (HR) · 法务与合规中枢 (Legal & Compliance)  
> **文档版本**: V2026.2  
> **受众对象**: 全体正式雇员、兼职顾问、实习生  

---

## 1. 新员工入职第一周 Checklist (Day 1 - Day 7)

\`\`\`
  [Day 1] 账号开通与硬件发放 ────────► [Day 2] 安全通识与合规签名
           │                                      │
           ▼                                      ▼
  [Day 3] 导师对齐与知识库阅读 ──────► [Day 7] 首周 Review 与环境验证
\`\`\`

1. **系统账号激活**: 绑定企业 SSO 账号并开启 Google Authenticator / 硬件 Security Key 二次验证；
2. **知识库工具配置**: 安装 Obsidian 客户端并配置 Local REST API 密钥，连接至 Acme 内部知识库；
3. **入职导师 (Buddy) 分配**: 由团队指定资深骨干协助熟悉代码规范与业务流程。

---

## 2. 信息安全与数据保护十项红线

- 🔴 **严禁泄露密钥**: 严禁将 API 密钥、数据库连接字符串或私有证书提交到任何公开仓库；
- 🔴 **全盘加密要求**: 员工工作电脑必须开启 FileVault (macOS) 或 BitLocker (Windows)；
- 🔴 **离职数据交接**: 离职前必须将个人 Vault 编译产物同步推送至团队中心仓库。

---

## 3. 日常差旅与弹性报销制度概要

- **差旅标准**: 跨国差旅需提前 5 个工作日提交审批，城际高铁优先二等座/一等座；
- **报销周期**: 每月 10 日与 25 日为财务集中打款日，电子发票直接在财务系统提交。`,
        content: `# [制度] 全球员工入职指引与信息安全合规条例

> **归口管理**: 人力资源部 (HR) · 法务与合规中枢 (Legal & Compliance)  
> **文档版本**: V2026.2  
> **受众对象**: 全体正式雇员、兼职顾问、实习生  

---

## 1. 新员工入职第一周 Checklist (Day 1 - Day 7)

\`\`\`
  [Day 1] 账号开通与硬件发放 ────────► [Day 2] 安全通识与合规签名
           │                                      │
           ▼                                      ▼
  [Day 3] 导师对齐与知识库阅读 ──────► [Day 7] 首周 Review 与环境验证
\`\`\`

1. **系统账号激活**: 绑定企业 SSO 账号并开启 Google Authenticator / 硬件 Security Key 二次验证；
2. **知识库工具配置**: 安装 Obsidian 客户端并配置 Local REST API 密钥，连接至 Acme 内部知识库；
3. **入职导师 (Buddy) 分配**: 由团队指定资深骨干协助熟悉代码规范与业务流程。

---

## 2. 信息安全与数据保护十项红线

- 🔴 **严禁泄露密钥**: 严禁将 API 密钥、数据库连接字符串或私有证书提交到任何公开仓库；
- 🔴 **全盘加密要求**: 员工工作电脑必须开启 FileVault (macOS) 或 BitLocker (Windows)；
- 🔴 **离职数据交接**: 离职前必须将个人 Vault 编译产物同步推送至团队中心仓库。

---

## 3. 日常差旅与弹性报销制度概要

- **差旅标准**: 跨国差旅需提前 5 个工作日提交审批，城际高铁优先二等座/一等座；
- **报销周期**: 每月 10 日与 25 日为财务集中打款日，电子发票直接在财务系统提交。`,
        outgoingLinks: ['wiki/company-info/README.md', 'wiki/company-info/company-overview.md'],
        wordCount: 1290
      },
      // 5. 知识素材：企业为什么要搭建知识库 (Why Enterprises Need Knowledge Base)
      {
        id: 'wiki-company-why-knowledge-base',
        path: 'wiki/company-info/why-enterprises-need-knowledge-base.md',
        fileName: 'why-enterprises-need-knowledge-base.md',
        frontmatter: {
          title: '[素材] 企业为什么要搭建知识库？核心价值、实施路径与组织收益全景解析',
          type: 'guide',
          created_at: '2026-08-19',
          updated_at: '2026-08-19',
          sources: ['raw/why-enterprises-need-kb-2026.md', 'clippings/enterprise-brain-value.pdf'],
          tags: ['知识素材', '企业大脑', '知识管理', '降本增效', 'Onboarding', '团队协同'],
          aliases: ['企业知识库价值白皮书', 'Why Enterprises Need Knowledge Base'],
          status: 'active'
        },
        rawMarkdown: `# [素材] 企业为什么要搭建知识库？核心价值、实施路径与组织收益全景解析

> **归口分类**: 🏢 公司资料 / 知识资产与方法论素材 (Knowledge Assets)  
> **推荐受众**: 全体管理层、新老员工、业务骨干、HR 及数字化转型推进组  
> **核心命题**: 在瞬息万变、竞争激烈的商业环境中，企业如何通过沉淀知识大脑实现持续降本增效？

---

## 1. 核心定位：知识库是企业的“第二大脑”

在现代数字化商业战场中，**快速获得准确信息并迅速作出高质量决策**已成为企业的核心生存能力。

知识库不仅是文档的堆放地，更是企业组织的**核心大脑中枢**。它负责持续保存、结构化整理和透明共享企业在经营探索中积累的无形资产，确保任何人、任何 AI Agent 均可随时秒级调取所需上下文，驱动业务决策与创新突破。

\`\`\`
                  ┌─────────────────────────────────────┐
                  │    🏢 企业知识中枢 (The Second Brain) │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────┬───────┴───────────┬───────────────────┐
         ▼                   ▼                   ▼                   ▼
   【时间大幅节省】    【员工技能复利】    【打破信息孤岛】    【入职培训加速】
   • 秒级全局检索      • 吸收历史经验      • 跨部门透明协作    • 自助式 Onboarding
   • 杜绝翻箱倒柜      • 避免重复踩坑      • 沉淀企业文化      • 释放骨干导师精力
\`\`\`

---

## 2. 为什么企业必须搭建知识库？四大核心价值剖析

### 价值一：极大节省全员检索与沟通时间 (Save Time & Friction)
- **没有知识库的痛点**: 员工需要查找某项规范或技术方案时，必须层层询问同事、翻遍微信群聊天记录或私人电脑文件夹，耗费大量无效工时。
- **构建知识库的收益**: 所有关键流程、接口协议与运营规范被统一整理，结合 \`⌘K\` 混合检索，**数秒内即可精准触达所需事实**，工作流无缝运转。

### 价值二：沉淀组织经验，实现员工技能与能力复利 (Skills & Competency)
- 保存各业务条线的核心资产、行业洞察、产品技术细节与标准操作规范 (SOP)；
- 员工通过知识库深度学习，不仅能快速掌握业务体系，更能**直接吸取往期项目的经验教训，杜绝犯同样的低级错误**。

### 价值三：促进信息流动与全员知识共享，塑造透明文化 (Open Collaboration)
- 破除“部门墙”与“个人知识垄断”，任何业务成果、复盘纪要与技术突破都在第一时间内沉淀回流；
- 形成人人可贡献、人人可获益的正向飞轮，推动组织智慧的自驱生长。

### 价值四：为新员工入职培训 (Onboarding) 提供极大便利
- 新成员加入时，无需耗费资深骨干数周时间进行基础流程的重复口传面授；
- 新员工查阅入职指引与分类知识库，即可**在 3~7 天内快速通晓公司业务全貌、协作工具与合规红线**，极大缩短新人产出周期并降低用人成本。

---

## 3. 落地实施：构建完整高效企业知识库的三大关键步骤

| 实施阶段 | 核心任务 | 关键交付物与标准 |
| :--- | :--- | :--- |
| **步骤 1: 明确知识库目标与业务边界** | 厘清知识库核心服务对象与应用场景（如产研技术架构、客服话术、销售赋能、行政制度等）。 | 知识库定位声明与第一阶段核心目录清单 |
| **步骤 2: 收集、清洗与分类知识资产** | 盘点企业内部散落在电脑、网盘、飞书与微信中的历史文档、专业书籍与实战案例，结构化打标。 | Markdown 格式化资料库与 Frontmatter 统一元数据 |
| **步骤 3: 引入现代数字化与 Agent 工具** | 采用 Obsidian 本地优先 + Git 分布式存储 + qmd 混合检索 + AI 编译引擎，实现人机协同自动更新。 | 自动化织网、双向链接拓扑与实时知识自愈体系 |

---

## 4. 总结与行动号召

企业搭建知识库绝非面子工程，而是**构建长青竞争壁垒与智能化生产力的基石**。

通过将企业知识资产从“零散孤岛”汇聚为“动态生长的活字典”，企业才能在 Agentic AI 时代让人类与智能体共同站在最坚实的知识地基上高效前行。`,
        content: `# [素材] 企业为什么要搭建知识库？核心价值、实施路径与组织收益全景解析

> **归口分类**: 🏢 公司资料 / 知识资产与方法论素材 (Knowledge Assets)  
> **推荐受众**: 全体管理层、新老员工、业务骨干、HR 及数字化转型推进组  
> **核心命题**: 在瞬息万变、竞争激烈的商业环境中，企业如何通过沉淀知识大脑实现持续降本增效？

---

## 1. 核心定位：知识库是企业的“第二大脑”

在现代数字化商业战场中，**快速获得准确信息并迅速作出高质量决策**已成为企业的核心生存能力。

知识库不仅是文档的堆放地，更是企业组织的**核心大脑中枢**。它负责持续保存、结构化整理和透明共享企业在经营探索中积累的无形资产，确保任何人、任何 AI Agent 均可随时秒级调取所需上下文，驱动业务决策与创新突破。

\`\`\`
                  ┌─────────────────────────────────────┐
                  │    🏢 企业知识中枢 (The Second Brain) │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────┬───────┴───────────┬───────────────────┐
         ▼                   ▼                   ▼                   ▼
   【时间大幅节省】    【员工技能复利】    【打破信息孤岛】    【入职培训加速】
   • 秒级全局检索      • 吸收历史经验      • 跨部门透明协作    • 自助式 Onboarding
   • 杜绝翻箱倒柜      • 避免重复踩坑      • 沉淀企业文化      • 释放骨干导师精力
\`\`\`

---

## 2. 为什么企业必须搭建知识库？四大核心价值剖析

### 价值一：极大节省全员检索与沟通时间 (Save Time & Friction)
- **没有知识库的痛点**: 员工需要查找某项规范或技术方案时，必须层层询问同事、翻遍微信群聊天记录或私人电脑文件夹，耗费大量无效工时。
- **构建知识库的收益**: 所有关键流程、接口协议与运营规范被统一整理，结合 \`⌘K\` 混合检索，**数秒内即可精准触达所需事实**，工作流无缝运转。

### 价值二：沉淀组织经验，实现员工技能与能力复利 (Skills & Competency)
- 保存各业务条线的核心资产、行业洞察、产品技术细节与标准操作规范 (SOP)；
- 员工通过知识库深度学习，不仅能快速掌握业务体系，更能**直接吸取往期项目的经验教训，杜绝犯同样的低级错误**。

### 价值三：促进信息流动与全员知识共享，塑造透明文化 (Open Collaboration)
- 破除“部门墙”与“个人知识垄断”，任何业务成果、复盘纪要与技术突破都在第一时间内沉淀回流；
- 形成人人可贡献、人人可获益的正向飞轮，推动组织智慧的自驱生长。

### 价值四：为新员工入职培训 (Onboarding) 提供极大便利
- 新成员加入时，无需耗费资深骨干数周时间进行基础流程的重复口传面授；
- 新员工查阅入职指引与分类知识库，即可**在 3~7 天内快速通晓公司业务全貌、协作工具与合规红线**，极大缩短新人产出周期并降低用人成本。

---

## 3. 落地实施：构建完整高效企业知识库的三大关键步骤

| 实施阶段 | 核心任务 | 关键交付物与标准 |
| :--- | :--- | :--- |
| **步骤 1: 明确知识库目标与业务边界** | 厘清知识库核心服务对象与应用场景（如产研技术架构、客服话术、销售赋能、行政制度等）。 | 知识库定位声明与第一阶段核心目录清单 |
| **步骤 2: 收集、清洗与分类知识资产** | 盘点企业内部散落在电脑、网盘、飞书与微信中的历史文档、专业书籍与实战案例，结构化打标。 | Markdown 格式化资料库与 Frontmatter 统一元数据 |
| **步骤 3: 引入现代数字化与 Agent 工具** | 采用 Obsidian 本地优先 + Git 分布式存储 + qmd 混合检索 + AI 编译引擎，实现人机协同自动更新。 | 自动化织网、双向链接拓扑与实时知识自愈体系 |

---

## 4. 总结与行动号召

企业搭建知识库绝非面子工程，而是**构建长青竞争壁垒与智能化生产力的基石**。

通过将企业知识资产从“零散孤岛”汇聚为“动态生长的活字典”，企业才能在 Agentic AI 时代让人类与智能体共同站在最坚实的知识地基上高效前行。`,
        outgoingLinks: [
          'wiki/company-info/README.md',
          'wiki/company-info/employee-handbook-2026.md',
          'wiki/company-info/realtime-living-knowledge-paradigm.md'
        ],
        wordCount: 1650
      },
      // 6. 知识素材：从静态 RAG 到企业实时知识库 (Real-time Living Knowledge Paradigm)
      {
        id: 'wiki-company-realtime-knowledge-paradigm',
        path: 'wiki/company-info/realtime-living-knowledge-paradigm.md',
        fileName: 'realtime-living-knowledge-paradigm.md',
        frontmatter: {
          title: '[素材] 从静态 RAG 到企业实时知识库：活知识架构、数据刷新链路与 Agent 数据底座',
          type: 'guide',
          created_at: '2026-08-19',
          updated_at: '2026-08-19',
          sources: ['raw/client-intel-realtime-paradigm.md', 'clippings/refresh-vs-retrieval-rag.pdf'],
          tags: ['实时知识库', 'Client Intel', '动态Refresh', 'Agent数据底座', 'MCP协议', '活知识'],
          aliases: ['实时知识库方法论', 'Realtime Living Knowledge Paradigm'],
          status: 'active'
        },
        rawMarkdown: `# [素材] 从静态 RAG 到企业实时知识库：活知识架构、数据刷新链路与 Agent 数据底座

> **核心实践出处**: 企业情报平台 CLIENT INTEL 架构演进与落地反思  
> **核心命题**: 为什么说“企业 AI 未来的竞争，最终比拼的不只是模型，而是数据获取与持续知识更新能力”？

---

## 1. 传统 RAG 的致命盲区：静态知识库 vs 活知识现实

在很多开发者的理解中，RAG (Retrieval-Augmented Generation) 标准流程非常直观：
\`\`\`
上传 PDF/Word ──► 切分文本 Chunk ──► Embedding ──► 向量数据库 ──► LLM 检索问答
\`\`\`

然而，当系统真正进入真实的企业经营场景时，就会暴露出不可逾越的鸿沟：

> **企业知识并不是静态的，而是瞬息万变的“活知识”。**

- 今天上传了一份产品手册；
- 明天官网更新了一篇战略新闻；
- 后天企业发布了重要人事或合规通告；
- 一周后公布了最新季度财报与架构调整；
- 外部竞品、行业新政与开源技术每天都在发生巨变。

如果系统仍然依赖人工定期下载、重新切分、重新向量化，**知识库必然迅速过时。Agent 再聪明，也只能基于过时的事实给出偏离现实的陈旧答案。**

---

## 2. 核心范式变革：RAG 最大的挑战不是 Retrieval，而是 Refresh！

行业内大量讨论集中在：
- *“如何提升检索匹配率？”*
- *“如何优化 Chunk 分割窗口？”*
- *“如何调优 Dense/Sparse 向量模型？”*

这些技术点固然重要，但在真实生产业务中：

> **最大的瓶颈不在于 Retrieval (怎么找)，而在于 Refresh (如何保证知识一直是最新的)！**

### 传统静态 RAG vs 实时活知识库全方位对比矩阵

| 评估维度 | 传统静态 RAG | 企业实时活知识库 (Living Knowledge Engine) |
| :--- | :--- | :--- |
| **数据形态** | 静态快照（上传时刻的文件） | 动态数据流（持续监听、即时清洗、事件识别） |
| **更新机制** | 人工下载 -> 重传 -> 重建索引（滞后周/月） | Webhook/Crawler 自动感知 -> 毫秒级增量 Refresh |
| **数据组织** | 孤立的碎片化 Chunk 文本段 | 结构化实体画像、事件时间线 (Timeline)、双向链接网络 |
| **Agent 调用** | 简单的相似度向量召回 | 结构化事实底座 + MCP (Model Context Protocol) 实时探针 |
| **事实准确度** | 高度受限于上传时间，易产生时效性幻觉 | 实时反映当天甚至几秒钟前的最新经营动态 |

---

## 3. 8 步闭环：企业实时动态知识更新链路架构

为实现“活知识”自动流转，我们将整条数据链路重构为 8 阶段动态自驱管道：

\`\`\`
  [1. 互联网/内外部公开流] (官网、公告、财报、GitHub、招聘、政策)
            │
            ▼
  [2. 持续自动采集监听] (Webhook / Crawler / RSS / API Daemon)
            │
            ▼
  [3. 正文提取与降噪清洗] (Boilerplate Stripping & Clean Markdown AST)
            │
            ▼
  [4. AI 语义分类与标签] (多维实体抽取与组织架构打标)
            │
            ▼
  [5. 事件抽取与时间线识别] (Event Timeline Extraction & Entity Chronology)
            │
            ▼
  [6. 知识动态入库与图谱织网] (Living Wiki & Obsidian Vault 增量累加)
            │
            ▼
  [7. 增量 Embedding 与 qmd 刷新] (毫秒级局部索引重构，避免全量重算)
            │
            ▼
  [8. Agent / MCP 实时调用] (业务决策分析、问答与自动化工作流)
\`\`\`

---

## 4. 企业情报 (Client Intel) 与 Agent 实时数据底座

对于企业级 AI Agent 而言，它真正需要的不是几十个未消化的网页链接，而是经过结构化提炼的高置信度事实：
- **哪件事情刚刚发生？** (What just happened?)
- **哪家机构/合作伙伴发生了异动？** (Who changed?)
- **哪些信息对当前业务最具价值？** (What matters?)
- **新事件与已有历史文档如何相互关联？** (How are they linked?)

通过将实时情报接入 **MCP (Model Context Protocol)** 协议，Agent 可以像调用本地文件一样，随时调取经过时间线梳理与事实校验的企业活知识。

---

## 5. 核心结论与行业启示

> **“模型决定 AI 的能力上限，而数据更新决定 AI 的实际表现。”**

未来企业 AI 的核心资产，绝不是孤立的模型参数，而是**能够随着企业内外部环境持续实时演化、自动沉淀的动态知识生态系统**。`,
        content: `# [素材] 从静态 RAG 到企业实时知识库：活知识架构、数据刷新链路与 Agent 数据底座

> **核心实践出处**: 企业情报平台 CLIENT INTEL 架构演进与落地反思  
> **核心命题**: 为什么说“企业 AI 未来的竞争，最终比拼的不只是模型，而是数据获取与持续知识更新能力”？

---

## 1. 传统 RAG 的致命盲区：静态知识库 vs 活知识现实

在很多开发者的理解中，RAG (Retrieval-Augmented Generation) 标准流程非常直观：
\`\`\`
上传 PDF/Word ──► 切分文本 Chunk ──► Embedding ──► 向量数据库 ──► LLM 检索问答
\`\`\`

然而，当系统真正进入真实的企业经营场景时，就会暴露出不可逾越的鸿沟：

> **企业知识并不是静态的，而是瞬息万变的“活知识”。**

- 今天上传了一份产品手册；
- 明天官网更新了一篇战略新闻；
- 后天企业发布了重要人事或合规通告；
- 一周后公布了最新季度财报与架构调整；
- 外部竞品、行业新政与开源技术每天都在发生巨变。

如果系统仍然依赖人工定期下载、重新切分、重新向量化，**知识库必然迅速过时。Agent 再聪明，也只能基于过时的事实给出偏离现实的陈旧答案。**

---

## 2. 核心范式变革：RAG 最大的挑战不是 Retrieval，而是 Refresh！

行业内大量讨论集中在：
- *“如何提升检索匹配率？”*
- *“如何优化 Chunk 分割窗口？”*
- *“如何调优 Dense/Sparse 向量模型？”*

这些技术点固然重要，但在真实生产业务中：

> **最大的瓶颈不在于 Retrieval (怎么找)，而在于 Refresh (如何保证知识一直是最新的)！**

### 传统静态 RAG vs 实时活知识库全方位对比矩阵

| 评估维度 | 传统静态 RAG | 企业实时活知识库 (Living Knowledge Engine) |
| :--- | :--- | :--- |
| **数据形态** | 静态快照（上传时刻的文件） | 动态数据流（持续监听、即时清洗、事件识别） |
| **更新机制** | 人工下载 -> 重传 -> 重建索引（滞后周/月） | Webhook/Crawler 自动感知 -> 毫秒级增量 Refresh |
| **数据组织** | 孤立的碎片化 Chunk 文本段 | 结构化实体画像、事件时间线 (Timeline)、双向链接网络 |
| **Agent 调用** | 简单的相似度向量召回 | 结构化事实底座 + MCP (Model Context Protocol) 实时探针 |
| **事实准确度** | 高度受限于上传时间，易产生时效性幻觉 | 实时反映当天甚至几秒钟前的最新经营动态 |

---

## 3. 8 步闭环：企业实时动态知识更新链路架构

为实现“活知识”自动流转，我们将整条数据链路重构为 8 阶段动态自驱管道：

\`\`\`
  [1. 互联网/内外部公开流] (官网、公告、财报、GitHub、招聘、政策)
            │
            ▼
  [2. 持续自动采集监听] (Webhook / Crawler / RSS / API Daemon)
            │
            ▼
  [3. 正文提取与降噪清洗] (Boilerplate Stripping & Clean Markdown AST)
            │
            ▼
  [4. AI 语义分类与标签] (多维实体抽取与组织架构打标)
            │
            ▼
  [5. 事件抽取与时间线识别] (Event Timeline Extraction & Entity Chronology)
            │
            ▼
  [6. 知识动态入库与图谱织网] (Living Wiki & Obsidian Vault 增量累加)
            │
            ▼
  [7. 增量 Embedding 与 qmd 刷新] (毫秒级局部索引重构，避免全量重算)
            │
            ▼
  [8. Agent / MCP 实时调用] (业务决策分析、问答与自动化工作流)
\`\`\`

---

## 4. 企业情报 (Client Intel) 与 Agent 实时数据底座

对于企业级 AI Agent 而言，它真正需要的不是几十个未消化的网页链接，而是经过结构化提炼的高置信度事实：
- **哪件事情刚刚发生？** (What just happened?)
- **哪家机构/合作伙伴发生了异动？** (Who changed?)
- **哪些信息对当前业务最具价值？** (What matters?)
- **新事件与已有历史文档如何相互关联？** (How are they linked?)

通过将实时情报接入 **MCP (Model Context Protocol)** 协议，Agent 可以像调用本地文件一样，随时调取经过时间线梳理与事实校验的企业活知识。

---

## 5. 核心结论与行业启示

> **“模型决定 AI 的能力上限，而数据更新决定 AI 的实际表现。”**

未来企业 AI 的核心资产，绝不是孤立的模型参数，而是**能够随着企业内外部环境持续实时演化、自动沉淀的动态知识生态系统**。`,
        outgoingLinks: [
          'wiki/company-info/README.md',
          'wiki/company-info/why-enterprises-need-knowledge-base.md',
          'wiki/company-info/company-overview.md'
        ],
        wordCount: 1980
      }
    ]
  },
  // 1. Brand Design (品牌设计)
  {
    id: 'brandDesign',
    name: '品牌设计',
    nameEn: 'Brand Design',
    icon: 'Palette',
    colorClass: 'text-orange-500',
    description: '企业品牌视觉识别系统、VI 规范、多端色彩与设计资产沉淀。',
    readmeDoc: {
      id: 'wiki-brand-readme',
      path: 'wiki/brand-design/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 品牌设计资产与视觉规范体系总纲',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/brand-guideline-2026.pdf'],
        tags: ['品牌设计', 'VI规范', '分类说明', '设计总纲'],
        aliases: ['品牌说明文件', 'Brand README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 品牌设计资产与视觉规范体系总纲

> **维护角色**: 品牌设计组 @Alex (员工主导维护)  
> **更新周期**: 季度评审更新  
> **所属分类**: 🎨 Brand Design (品牌设计)  

---

## 1. 分类定位与维护原则
本分类用于集中沉淀企业对内及对外的统一视觉语言。确保无论在 Web 端、移动端、办公协作工具还是对外发布会物料中，品牌形象均保持高度一致。

### 维护责任人分工：
- **员工维护 (80%)**：主色调调整、VI 标志矢量源文件更新、展会物料规范审校。
- **AI 智能体维护 (20%)**：自动校验色值无障碍对比度 (WCAG AA)、自动提取设计规范中的尺寸并生成样式表。

## 2. 核心子目录说明
- \`vi-standards/\`: 企业 Logo、标准字、标准色与辅助图形。
- \`color-system/\`: 浅色与深色模式下的灰阶阶梯与无障碍对比度矩阵。
- \`assets-library/\`: 官方图标集 (Lucide) 与高清矢量物料下载清单。

## 3. 关联示例文档
- [[wiki/brand-design/vi-system-2026.md]]: 2026 企业品牌视觉识别系统 (VI) 与组件标准
- [[wiki/brand-design/contrast-color-specs.md]]: 企业级多端深浅色配色系统与无障碍对比度规范
`,
      content: `# [说明] 品牌设计资产与视觉规范体系总纲

> **维护角色**: 品牌设计组 @Alex (员工主导维护)  
> **更新周期**: 季度评审更新  
> **所属分类**: 🎨 Brand Design (品牌设计)  

---

## 1. 分类定位与维护原则
本分类用于集中沉淀企业对内及对外的统一视觉语言。确保无论在 Web 端、移动端、办公协作工具还是对外发布会物料中，品牌形象均保持高度一致。

### 维护责任人分工：
- **员工维护 (80%)**：主色调调整、VI 标志矢量源文件更新、展会物料规范审校。
- **AI 智能体维护 (20%)**：自动校验色值无障碍对比度 (WCAG AA)、自动提取设计规范中的尺寸并生成样式表。

## 2. 核心子目录说明
- \`vi-standards/\`: 企业 Logo、标准字、标准色与辅助图形。
- \`color-system/\`: 浅色与深色模式下的灰阶阶梯与无障碍对比度矩阵。
- \`assets-library/\`: 官方图标集 (Lucide) 与高清矢量物料下载清单。

## 3. 关联示例文档
- [[wiki/brand-design/vi-system-2026.md]]: 2026 企业品牌视觉识别系统 (VI) 与组件标准
- [[wiki/brand-design/contrast-color-specs.md]]: 企业级多端深浅色配色系统与无障碍对比度规范
`,
      outgoingLinks: ['[[wiki/brand-design/vi-system-2026.md]]', '[[wiki/brand-design/contrast-color-specs.md]]'],
      wordCount: 520
    },
    exampleDocs: [
      {
        id: 'wiki-brand-vi-example',
        path: 'wiki/brand-design/vi-system-2026.md',
        fileName: 'vi-system-2026.md',
        frontmatter: {
          title: '[示例] 2026 企业品牌视觉识别系统 (VI) 与组件标准',
          type: 'sop',
          created_at: '2026-08-15',
          updated_at: '2026-08-18',
          sources: ['raw/brand-vi-manual-v3.pdf'],
          tags: ['VI规范', '示例', '设计资产', 'Logo标准'],
          aliases: ['企业VI标准', 'Brand Identity Specs'],
          status: 'active'
        },
        rawMarkdown: `# [示例] 2026 企业品牌视觉识别系统 (VI) 与组件标准

> **版本**: Release v3.2 (2026 旗舰版)  
> **执行标准**: 全集团通用强制规范  

---

## 1. 核心品牌主色与辅助色 (Color Palette)
| 色彩定义 | 色值 (HEX) | RGB 值 | 使用场景 |
| :--- | :--- | :--- | :--- |
| **Omni Blue (品牌主色)** | \`#2563EB\` | rgb(37, 99, 235) | 核心品牌标识、主要操作按钮、高亮链接 |
| **Deep Slate (中性深色)** | \`#0F172A\` | rgb(15, 23, 42) | 一级正文标题、全局深色侧边栏背景 |
| **Emerald Growth (成功绿)** | \`#10B981\` | rgb(16, 185, 129) | 编译成功状态、Vault 同步就绪状态 |
| **Amber Warning (预警橙)** | \`#F59E0B\` | rgb(245, 158, 11) | Lint 断链预警、待办审批标记 |

## 2. 标志使用安全区与最小比例
- **安全边距 (Safe Zone)**：标志四周必须预留不小于 \`1.5x\` 标志高度的完全空白区域。
- **最小印刷尺寸**：印刷品宽度不得小于 15mm；数字屏幕显示不得小于 24px。

## 3. 禁用场景清单 (Strict Prohibitions)
1. 严禁对 Logo 进行非等比拉伸、透视变形或任意旋转。
2. 严禁在对比度低于 4.5:1 的杂乱背景图上直接放置无底衬 Logo。
`,
        content: `# [示例] 2026 企业品牌视觉识别系统 (VI) 与组件标准

> **版本**: Release v3.2 (2026 旗舰版)  
> **执行标准**: 全集团通用强制规范  

---

## 1. 核心品牌主色与辅助色 (Color Palette)
| 色彩定义 | 色值 (HEX) | RGB 值 | 使用场景 |
| :--- | :--- | :--- | :--- |
| **Omni Blue (品牌主色)** | \`#2563EB\` | rgb(37, 99, 235) | 核心品牌标识、主要操作按钮、高亮链接 |
| **Deep Slate (中性深色)** | \`#0F172A\` | rgb(15, 23, 42) | 一级正文标题、全局深色侧边栏背景 |
| **Emerald Growth (成功绿)** | \`#10B981\` | rgb(16, 185, 129) | 编译成功状态、Vault 同步就绪状态 |
| **Amber Warning (预警橙)** | \`#F59E0B\` | rgb(245, 158, 11) | Lint 断链预警、待办审批标记 |

## 2. 标志使用安全区与最小比例
- **安全边距 (Safe Zone)**：标志四周必须预留不小于 \`1.5x\` 标志高度的完全空白区域。
- **最小印刷尺寸**：印刷品宽度不得小于 15mm；数字屏幕显示不得小于 24px。

## 3. 禁用场景清单 (Strict Prohibitions)
1. 严禁对 Logo 进行非等比拉伸、透视变形或任意旋转。
2. 严禁在对比度低于 4.5:1 的杂乱背景图上直接放置无底衬 Logo。
`,
        outgoingLinks: ['[[wiki/brand-design/README.md]]'],
        wordCount: 680
      }
    ]
  },

  // 2. Design (体验设计)
  {
    id: 'design',
    name: '体验设计',
    nameEn: 'Design',
    icon: 'Feather',
    colorClass: 'text-emerald-500',
    description: '交互设计走查规范、B端复杂表单与用户体验旅程地图。',
    readmeDoc: {
      id: 'wiki-design-readme',
      path: 'wiki/design/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 产品体验与交互走查设计指引',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/design-guidelines-2026.docx'],
        tags: ['体验设计', '交互规范', '分类说明', '走查自检'],
        aliases: ['体验设计说明', 'UX README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 产品体验与交互走查设计指引

> **维护角色**: 交互体验组 @Jenn (全员协同)  
> **所属分类**: 🍃 Design (体验设计)  

---

## 1. 体验设计核心理念
坚持“抗审美疲劳”、“极速信息获取”与“无挫败操作反馈”。B端企业级产品的核心价值在于提升员工处理密集信息的吞吐量。

## 2. 交互自检六原则 (Interaction Checklist)
1. **即时反馈**：所有耗时操作必须在 100ms 内给予视觉加载或禁用反馈。
2. **防错与二次确认**：破坏性操作（如删除草稿、清空回收站）必须提供明确的危险警示。
3. **触控与点击热区**：桌面端可点击项高度 >= 32px，移动端触摸目标 >= 44px。
4. **键盘亲和性**：支持全局 \`⌘K\` 搜索与 \`Esc\` 退出模态弹窗。

## 3. 关联示例文档
- [[wiki/design/data-dense-table-patterns.md]]: B端企业级复杂表格与数据密集型表单交互设计范式
- [[wiki/design/omni-journey-map.md]]: 全渠道用户体验旅程地图 (Journey Map) 模板
`,
      content: `# [说明] 产品体验与交互走查设计指引

> **维护角色**: 交互体验组 @Jenn (全员协同)  
> **所属分类**: 🍃 Design (体验设计)  

---

## 1. 体验设计核心理念
坚持“抗审美疲劳”、“极速信息获取”与“无挫败操作反馈”。B端企业级产品的核心价值在于提升员工处理密集信息的吞吐量。

## 2. 交互自检六原则 (Interaction Checklist)
1. **即时反馈**：所有耗时操作必须在 100ms 内给予视觉加载或禁用反馈。
2. **防错与二次确认**：破坏性操作（如删除草稿、清空回收站）必须提供明确的危险警示。
3. **触控与点击热区**：桌面端可点击项高度 >= 32px，移动端触摸目标 >= 44px。
4. **键盘亲和性**：支持全局 \`⌘K\` 搜索与 \`Esc\` 退出模态弹窗。

## 3. 关联示例文档
- [[wiki/design/data-dense-table-patterns.md]]: B端企业级复杂表格与数据密集型表单交互设计范式
- [[wiki/design/omni-journey-map.md]]: 全渠道用户体验旅程地图 (Journey Map) 模板
`,
      outgoingLinks: ['[[wiki/design/data-dense-table-patterns.md]]'],
      wordCount: 490
    },
    exampleDocs: [
      {
        id: 'wiki-design-table-example',
        path: 'wiki/design/data-dense-table-patterns.md',
        fileName: 'data-dense-table-patterns.md',
        frontmatter: {
          title: '[示例] B端企业级复杂表格与数据密集型表单交互设计范式',
          type: 'sop',
          created_at: '2026-08-16',
          updated_at: '2026-08-18',
          sources: ['raw/table-design-pattern.md'],
          tags: ['交互范例', 'B端表格', '示例', 'UI组件'],
          aliases: ['企业表格交互设计', 'Table UX Guide'],
          status: 'active'
        },
        rawMarkdown: `# [示例] B端企业级复杂表格与数据密集型表单交互设计范式

## 1. 表格高密度信息排版原则
当每页需要展示 50+ 条数据时，必须遵循以下排版规范：
- **斑马纹与悬浮高亮**：基数行背景 \`#FFFFFF\`，偶数行背景 \`#F8FAFC\`，鼠标悬浮行高亮为 \`#EFF6FF\`。
- **列对齐规则**：文本左对齐、数字/金额/百分比严格右对齐、状态标签居中对齐。

## 2. 典型操作列按钮数量控制
| 数据条目状态 | 主操作 (Button) | 次操作 (Text) | 折叠操作 (...) |
| :--- | :--- | :--- | :--- |
| **待审批** | 立即审核 (高亮) | 委派/转交 | 驳回、查看日志、归档 |
| **已通过** | 查看详情 | 导出 PDF | 打印存根、废止撤回 |
| **异常阻断** | 一键自愈 (修复) | 联系负责人 | 忽略警告、上报风控 |
`,
        content: `# [示例] B端企业级复杂表格与数据密集型表单交互设计范式

## 1. 表格高密度信息排版原则
当每页需要展示 50+ 条数据时，必须遵循以下排版规范：
- **斑马纹与悬浮高亮**：基数行背景 \`#FFFFFF\`，偶数行背景 \`#F8FAFC\`，鼠标悬浮行高亮为 \`#EFF6FF\`。
- **列对齐规则**：文本左对齐、数字/金额/百分比严格右对齐、状态标签居中对齐。

## 2. 典型操作列按钮数量控制
| 数据条目状态 | 主操作 (Button) | 次操作 (Text) | 折叠操作 (...) |
| :--- | :--- | :--- | :--- |
| **待审批** | 立即审核 (高亮) | 委派/转交 | 驳回、查看日志、归档 |
| **已通过** | 查看详情 | 导出 PDF | 打印存根、废止撤回 |
| **异常阻断** | 一键自愈 (修复) | 联系负责人 | 忽略警告、上报风控 |
`,
        outgoingLinks: ['[[wiki/design/README.md]]'],
        wordCount: 560
      }
    ]
  },

  // 3. Engineering (研发工程)
  {
    id: 'engineering',
    name: '研发工程',
    nameEn: 'Engineering',
    icon: 'Code2',
    colorClass: 'text-blue-600',
    description: '核心技术栈、API 契约、Obsidian REST 接口与 qmd 混合检索引擎。',
    readmeDoc: {
      id: 'wiki-eng-readme',
      path: 'wiki/engineering/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 研发工程架构规范与技术演进总纲',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/engineering-tech-manifesto.md'],
        tags: ['研发工程', '架构总纲', '分类说明', 'API契约'],
        aliases: ['研发说明文件', 'Engineering README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 研发工程架构规范与技术演进总纲

> **维护角色**: 核心架构组 @Alex & @李雷  
> **核心引擎**: React 18 + Node.js + Obsidian Local REST API + qmd 引擎  

---

## 1. 架构目标与约束
1. **单一数据真相源 (SSOT)**：所有知识以标准 Markdown 与 YAML Frontmatter 存储在 Git 仓库中。
2. **Obsidian 双向兼容**：支持通过 \`http://127.0.0.1:27123\` 本地端口对 Obsidian Vault 进行秒级双向读写与 Canvas 生成。
3. **零云端数据库锁死**：依托轻量级 \`qmd\` 实现本地 SQLite FTS5 与向量双模混合检索。

## 2. 工程模块划分
- \`Core Concepts\`: Karpathy 编译论、不可变 Raw 与单调累加 Wiki。
- \`Backend\`: Webhooks 回调规范、签名验签与分布式同步。
- \`Frontend\`: 现代文档排版 (Craft Doc) 与工程大盘 (Enterprise Hub) 双模渲染。
- \`Documentation\`: API 接口定义与技术白皮书。
`,
      content: `# [说明] 研发工程架构规范与技术演进总纲

> **维护角色**: 核心架构组 @Alex & @李雷  
> **核心引擎**: React 18 + Node.js + Obsidian Local REST API + qmd 引擎  

---

## 1. 架构目标与约束
1. **单一数据真相源 (SSOT)**：所有知识以标准 Markdown 与 YAML Frontmatter 存储在 Git 仓库中。
2. **Obsidian 双向兼容**：支持通过 \`http://127.0.0.1:27123\` 本地端口对 Obsidian Vault 进行秒级双向读写与 Canvas 生成。
3. **零云端数据库锁死**：依托轻量级 \`qmd\` 实现本地 SQLite FTS5 与向量双模混合检索。

## 2. 工程模块划分
- \`Core Concepts\`: Karpathy 编译论、不可变 Raw 与单调累加 Wiki。
- \`Backend\`: Webhooks 回调规范、签名验签与分布式同步。
- \`Frontend\`: 现代文档排版 (Craft Doc) 与工程大盘 (Enterprise Hub) 双模渲染。
- \`Documentation\`: API 接口定义与技术白皮书。
`,
      outgoingLinks: ['[[wiki/docs/webhooks.md]]', '[[wiki/terms/qmd.md]]'],
      wordCount: 620
    },
    exampleDocs: [
      {
        id: 'wiki-eng-llm-wiki-case-study',
        path: 'wiki/engineering/llm-wiki-architecture-case-study.md',
        fileName: 'llm-wiki-architecture-case-study.md',
        frontmatter: {
          title: '[深度案例] 基于 Karpathy LLM Wiki 与全自动剪藏流水线的企业级实时活知识库架构实战',
          type: 'guide',
          created_at: '2026-08-18',
          updated_at: '2026-08-18',
          sources: ['raw/llm-wiki-architecture-whitepaper.md'],
          tags: ['LLM Wiki', '架构案例', 'Karpathy', '知识图谱', '全自动剪藏'],
          aliases: ['LLM Wiki实战案例', 'LLM Wiki Case Study'],
          status: 'active'
        },
        rawMarkdown: `# [深度案例] 基于 Karpathy LLM Wiki 与全自动剪藏流水线的企业级实时活知识库架构实战

> **主讲架构师**: OmniWiki 核心工程组  
> **核心方法论**: Andrej Karpathy LLM Wiki 编译论 + 动态知识图谱 + 异步自愈守护进程  
> **所属分类**: 💻 研发工程 (Engineering Case Study)

---

## 1. 引言：企业知识管理的“静态困境”与 Karpathy 解法

在传统企业中，Confluence 或 Notion 往往沦为“知识墓地”——员工录入后无人维护、信息孤岛严重、大模型检索时频繁遭遇向量分块（Chunking）导致的上下文割裂。

Andrej Karpathy 提出了 **LLM Wiki** 的划时代方法论：**LLM 不应只是与人类对话的临时代理，而应当构建并维护一个不断生长的、互联互通的“活体百科全书（Living Encyclopedia）”**。

在本系统中，我们将这一构想完整落地，构建了从**非结构化网页/飞书文档抓取 $\rightarrow$ 智能清洗 $\rightarrow$ Markdown AST 编译 $\rightarrow$ 双链网状图谱 $\rightarrow$ 后台自愈巡检**的全链路闭环。

---

## 2. 系统核心架构与数据流动 (ASCII Architecture Diagram)

整个知识库系统的运行逻辑可以概括为：**“Raw 不可变原件 $\rightarrow$ AST 清洗流水线 $\rightarrow$ Wiki 活体双链网 $\rightarrow$ qmd 混合检索引擎 $\rightarrow$ Lint 自愈守护进程”**。

\`\`\`
  +-----------------------------------------------------------------+
  |                        1. 外部信息源 (Data Sources)             |
  |   [ 🌐 互联网网页 ]      [ 🪶 飞书云文档 ]      [ 📂 本地 Markdown ]   |
  +-----------------------------------+-----------------------------+
                                      |
                                      v (POST /api/clipper/fetch-live)
  +-----------------------------------------------------------------+
  |                    2. 后端实时代理与清洗流水线                  |
  |  - 协议路由解析  ->  DOM/飞书无损脱敏  ->  Jina Reader AST 提取 |
  +-----------------------------------+-----------------------------+
                                      |
                                      v (写入不可变原件)
  +-----------------------------------------------------------------+
  |                  3. Raw 原始资料库 (Raw Repository)             |
  |             (保存原始 Markdown、元数据、文件大小与编译状态)     |
  +-----------------------------------+-----------------------------+
                                      |
                                      v (自动化编译与并网)
  +-----------------------------------------------------------------+
  |             4. Wiki 活体双链知识网络 (Living Knowledge Graph)   |
  |  - YAML Frontmatter     - [[wikilinks]] 双向反向链接            |
  |  - 概念网状拓扑         - Obsidian Local REST API 同步          |
  +-----------------------------------+-----------------------------+
                                      |
            +-------------------------+-------------------------+
            |                                                   |
            v (全文与向量检索)                                   v (后台守护巡检)
  +--------------------+                             +---------------------+
  |   5. qmd 混合检索   |                             |  6. Lint 自愈引擎   |
  | (SQLite FTS5 + 向量)|                             | (死链检测/孤岛修复) |
  +--------------------+                             +---------------------+
\`\`\`

---

## 3. 全自动剪藏与五步并网流水线实战

为了解决“从任意网页或飞书文档一键入库”的痛点，本项目设计了严密的 5 步自动化流水线：
1. **Step 1: 协议路由解析**
2. **Step 2: DOM 与飞书脱敏清洗**
3. **Step 3: Markdown AST 转换**
4. **Step 4: 写入 Raw 原始库**
5. **Step 5: 双链并网完成**

---

## 4. 核心工程代码范例：自动化并网与防冲突 ID 生成

\`\`\`typescript
const uniqueSuffix = \`\${Date.now()}-\${Math.random().toString(36).substring(2, 7)}\`;
const rawId = \`raw-\${uniqueSuffix}\`;
const wikiId = \`wiki-\${uniqueSuffix}\`;

setTimeout(() => {
  onAddRawDoc(newRawDoc, [newWikiPage]);
}, 0);
\`\`\`

---

## 5. 总结与企业落地收益
通过将 **Karpathy LLM Wiki 编译论** 与 **Obsidian 本地生态**、**全自动网页/飞书剪藏**相结合，成功实现了活知识网络的智能化演进。`,
        content: `# [深度案例] 基于 Karpathy LLM Wiki 与全自动剪藏流水线的企业级实时活知识库架构实战

> **主讲架构师**: OmniWiki 核心工程组  
> **核心方法论**: Andrej Karpathy LLM Wiki 编译论 + 动态知识图谱 + 异步自愈守护进程  
> **所属分类**: 💻 研发工程 (Engineering Case Study)

---

## 1. 引言：企业知识管理的“静态困境”与 Karpathy 解法

在传统企业中，Confluence 或 Notion 往往沦为“知识墓地”——员工录入后无人维护、信息孤岛严重、大模型检索时频繁遭遇向量分块（Chunking）导致的上下文割裂。

Andrej Karpathy 提出了 **LLM Wiki** 的划时代方法论：**LLM 不应只是与人类对话的临时代理，而应当构建并维护一个不断生长的、互联互通的“活体百科全书（Living Encyclopedia）”**。

在本系统中，我们将这一构想完整落地，构建了从**非结构化网页/飞书文档抓取 $\rightarrow$ 智能清洗 $\rightarrow$ Markdown AST 编译 $\rightarrow$ 双链网状图谱 $\rightarrow$ 后台自愈巡检**的全链路闭环。

---

## 2. 系统核心架构与数据流动 (ASCII Architecture Diagram)

整个知识库系统的运行逻辑可以概括为：**“Raw 不可变原件 $\rightarrow$ AST 清洗流水线 $\rightarrow$ Wiki 活体双链网 $\rightarrow$ qmd 混合检索引擎 $\rightarrow$ Lint 自愈守护进程”**。

\`\`\`
  +-----------------------------------------------------------------+
  |                        1. 外部信息源 (Data Sources)             |
  |   [ 🌐 互联网网页 ]      [ 🪶 飞书云文档 ]      [ 📂 本地 Markdown ]   |
  +-----------------------------------+-----------------------------+
                                      |
                                      v (POST /api/clipper/fetch-live)
  +-----------------------------------------------------------------+
  |                    2. 后端实时代理与清洗流水线                  |
  |  - 协议路由解析  ->  DOM/飞书无损脱敏  ->  Jina Reader AST 提取 |
  +-----------------------------------+-----------------------------+
                                      |
                                      v (写入不可变原件)
  +-----------------------------------------------------------------+
  |                  3. Raw 原始资料库 (Raw Repository)             |
  |             (保存原始 Markdown、元数据、文件大小与编译状态)     |
  +-----------------------------------+-----------------------------+
                                      |
                                      v (自动化编译与并网)
  +-----------------------------------------------------------------+
  |             4. Wiki 活体双链知识网络 (Living Knowledge Graph)   |
  |  - YAML Frontmatter     - [[wikilinks]] 双向反向链接            |
  |  - 概念网状拓扑         - Obsidian Local REST API 同步          |
  +-----------------------------------+-----------------------------+
                                      |
            +-------------------------+-------------------------+
            |                                                   |
            v (全文与向量检索)                                   v (后台守护巡检)
  +--------------------+                             +---------------------+
  |   5. qmd 混合检索   |                             |  6. Lint 自愈引擎   |
  | (SQLite FTS5 + 向量)|                             | (死链检测/孤岛修复) |
  +--------------------+                             +---------------------+
\`\`\`

---

## 3. 全自动剪藏与五步并网流水线实战

为了解决“从任意网页或飞书文档一键入库”的痛点，本项目设计了严密的 5 步自动化流水线：
1. **Step 1: 协议路由解析**
2. **Step 2: DOM 与飞书脱敏清洗**
3. **Step 3: Markdown AST 转换**
4. **Step 4: 写入 Raw 原始库**
5. **Step 5: 双链并网完成**

---

## 4. 核心工程代码范例：自动化并网与防冲突 ID 生成

\`\`\`typescript
const uniqueSuffix = \`\${Date.now()}-\${Math.random().toString(36).substring(2, 7)}\`;
const rawId = \`raw-\${uniqueSuffix}\`;
const wikiId = \`wiki-\${uniqueSuffix}\`;

setTimeout(() => {
  onAddRawDoc(newRawDoc, [newWikiPage]);
}, 0);
\`\`\`

---

## 5. 总结与企业落地收益
通过将 **Karpathy LLM Wiki 编译论** 与 **Obsidian 本地生态**、**全自动网页/飞书剪藏**相结合，成功实现了活知识网络的智能化演进。`,
        outgoingLinks: ['[[wiki/engineering/README.md]]', '[[wiki/docs/webhooks.md]]'],
        wordCount: 1450
      },
      {
        id: 'wiki-eng-webhooks-example',
        path: 'wiki/docs/webhooks.md',
        fileName: 'webhooks.md',
        frontmatter: {
          title: '[示例] Webhooks 异步回调与签名鉴权设计规范',
          type: 'sop',
          created_at: '2026-08-18',
          updated_at: '2026-08-18',
          sources: ['raw/webhooks-api-spec.json'],
          tags: ['接口规范', 'Webhooks', '示例', '安全鉴权'],
          aliases: ['Webhooks规范', 'API Webhooks Spec'],
          status: 'active'
        },
        rawMarkdown: `# [示例] Webhooks 异步回调与签名鉴权设计规范

## 1. What are webhooks
Webhooks refers to a combination of elements that collectively create a notification and reaction system within a larger integration.

Metaphorically, webhooks are like a phone number that Acme calls to notify you of activity in your account. Activity could be the creation of a new customer or the payout of funds to your bank account.

## 2. When to use webhooks
Many events that occur within an Acme account have synchronous results—immediate and direct—to an executed request. For example, a successful request to create an item immediately returns an Item object.

Other events that occur within an Acme account are asynchronous: happening at a later time and not directly in response to your code's execution. Most commonly these involve:
- The Item Intents API for asynchronous state reconciliation.
- Notifications of background events such as automated Obsidian Dataview rebuilds.
- Periodic \`qmd update\` CLI cache invalidations.

## 3. Authentication & Obsidian Integration
All incoming webhook payloads from the local Obsidian REST API or external services are verified via cryptographic signature:

\`\`\`typescript
const signature = req.headers['x-omniwiki-signature'];
const isValid = verifySignature(req.rawBody, signature, process.env.WEBHOOK_SECRET);
if (!isValid) return res.status(401).send('Unauthorized');
\`\`\`
`,
        content: `# [示例] Webhooks 异步回调与签名鉴权设计规范

## 1. What are webhooks
Webhooks refers to a combination of elements that collectively create a notification and reaction system within a larger integration.

Metaphorically, webhooks are like a phone number that Acme calls to notify you of activity in your account. Activity could be the creation of a new customer or the payout of funds to your bank account.

## 2. When to use webhooks
Many events that occur within an Acme account have synchronous results—immediate and direct—to an executed request. For example, a successful request to create an item immediately returns an Item object.

Other events that occur within an Acme account are asynchronous: happening at a later time and not directly in response to your code's execution. Most commonly these involve:
- The Item Intents API for asynchronous state reconciliation.
- Notifications of background events such as automated Obsidian Dataview rebuilds.
- Periodic \`qmd update\` CLI cache invalidations.

## 3. Authentication & Obsidian Integration
All incoming webhook payloads from the local Obsidian REST API or external services are verified via cryptographic signature:

\`\`\`typescript
const signature = req.headers['x-omniwiki-signature'];
const isValid = verifySignature(req.rawBody, signature, process.env.WEBHOOK_SECRET);
if (!isValid) return res.status(401).send('Unauthorized');
\`\`\`
`,
        outgoingLinks: ['[[wiki/engineering/README.md]]'],
        wordCount: 710
      }
    ]
  },

  // 4. Marketing (市场营销)
  {
    id: 'marketing',
    name: '市场营销',
    nameEn: 'Marketing',
    icon: 'BookOpen',
    colorClass: 'text-blue-500',
    description: '市场出海推广方案、竞品 Battlesheet、客户案例与物料库。',
    readmeDoc: {
      id: 'wiki-mkt-readme',
      path: 'wiki/marketing/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 全球市场营销与增长知识库使用说明',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/marketing-playbook-2026.pdf'],
        tags: ['市场营销', '增长知识库', '分类说明', '销售支持'],
        aliases: ['市场说明文件', 'Marketing README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 全球市场营销与增长知识库使用说明

> **维护角色**: 市场与增长团队 @Phoebe (全员协同维护)  
> **所属分类**: 📘 Marketing (市场营销)  

---

## 1. 知识沉淀与对外口径
市场部需确保所有对外发布的白皮书、宣讲 PPT、产品定价策略与竞品 Battlesheet 均经过法务及技术合规审核。

## 2. 销售赋能与资料提取 SOP
1. **售前资料检索**：直接在全局检索框输入 \`Battlesheet\` 或 \`定价 FAQ\` 快速获取最新销售攻防话术。
2. **定制化案例输出**：禁止向外部客户直接发送内部 Wiki 链接，请通过顶部 **「分享」** 按钮生成带水印的只读外发版本。
`,
      content: `# [说明] 全球市场营销与增长知识库使用说明

> **维护角色**: 市场与增长团队 @Phoebe (全员协同维护)  
> **所属分类**: 📘 Marketing (市场营销)  

---

## 1. 知识沉淀与对外口径
市场部需确保所有对外发布的白皮书、宣讲 PPT、产品定价策略与竞品 Battlesheet 均经过法务及技术合规审核。

## 2. 销售赋能与资料提取 SOP
1. **售前资料检索**：直接在全局检索框输入 \`Battlesheet\` 或 \`定价 FAQ\` 快速获取最新销售攻防话术。
2. **定制化案例输出**：禁止向外部客户直接发送内部 Wiki 链接，请通过顶部 **「分享」** 按钮生成带水印的只读外发版本。
`,
      outgoingLinks: ['[[wiki/marketing/omniwiki-battlesheet.md]]'],
      wordCount: 460
    },
    exampleDocs: [
      {
        id: 'wiki-mkt-battlesheet-example',
        path: 'wiki/marketing/omniwiki-battlesheet.md',
        fileName: 'omniwiki-battlesheet.md',
        frontmatter: {
          title: '[示例] 竞品全维度横向评测与差异化卖点矩阵 (Battlesheet)',
          type: 'sop',
          created_at: '2026-08-16',
          updated_at: '2026-08-18',
          sources: ['raw/competitor-analysis-2026.xlsx'],
          tags: ['竞品对比', '示例', '销售赋能', '市场攻防'],
          aliases: ['竞品对标矩阵', 'Sales Battlesheet'],
          status: 'active'
        },
        rawMarkdown: `# [示例] 竞品全维度横向评测与差异化卖点矩阵 (Battlesheet)

## 1. 与传统黑盒 RAG 及传统静态知识库横向对比
| 评估维度 | 传统云端黑盒 RAG | 传统静态 Wiki (如 Confluence) | **OmniWiki 企业知识库** |
| :--- | :--- | :--- | :--- |
| **知识存储格式** | 向量分块 (无法直观查阅) | 专有富文本数据库 | **纯净 Markdown + Git 纯文本** |
| **知识关系网络** | 仅依赖向量余弦相似度 | 树状单向层级 | **多源双向链接 ([[...]]) + 3D 图谱** |
| **维护成本与自愈**| 幻觉累加，需频繁重切块 | 员工离职后死链遍地 | **Agent 自动编译 + Lint 自动化自愈** |
| **本地生态集成** | 无 | 封闭云端 API | **Obsidian Local REST API + Canvas** |

## 2. 核心破冰话术 (Sales Pitch)
> “客户您好，很多企业上了 RAG 却依然找不到精准答案，根源在于切块割裂了业务上下文。OmniWiki 像人类维基百科一样，由智能体自动把制度、代码与复盘编译成互联互通的网状 Wiki，保证 100% 来源可溯。”
`,
        content: `# [示例] 竞品全维度横向评测与差异化卖点矩阵 (Battlesheet)

## 1. 与传统黑盒 RAG 及传统静态知识库横向对比
| 评估维度 | 传统云端黑盒 RAG | 传统静态 Wiki (如 Confluence) | **OmniWiki 企业知识库** |
| :--- | :--- | :--- | :--- |
| **知识存储格式** | 向量分块 (无法直观查阅) | 专有富文本数据库 | **纯净 Markdown + Git 纯文本** |
| **知识关系网络** | 仅依赖向量余弦相似度 | 树状单向层级 | **多源双向链接 ([[...]]) + 3D 图谱** |
| **维护成本与自愈**| 幻觉累加，需频繁重切块 | 员工离职后死链遍地 | **Agent 自动编译 + Lint 自动化自愈** |
| **本地生态集成** | 无 | 封闭云端 API | **Obsidian Local REST API + Canvas** |

## 2. 核心破冰话术 (Sales Pitch)
> “客户您好，很多企业上了 RAG 却依然找不到精准答案，根源在于切块割裂了业务上下文。OmniWiki 像人类维基百科一样，由智能体自动把制度、代码与复盘编译成互联互通的网状 Wiki，保证 100% 来源可溯。”
`,
        outgoingLinks: ['[[wiki/marketing/README.md]]'],
        wordCount: 650
      }
    ]
  },

  // 5. Research (前沿研究)
  {
    id: 'research',
    name: '前沿研究',
    nameEn: 'Research',
    icon: 'FlaskConical',
    colorClass: 'text-amber-500',
    description: '大模型私有化安全、复杂多栏 PDF 解析与向量混合重排算法。',
    readmeDoc: {
      id: 'wiki-res-readme',
      path: 'wiki/research/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 前沿技术预研与论文复现工作流规范',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/ai-research-methodology.md'],
        tags: ['前沿研究', '技术预研', '分类说明', '算法评估'],
        aliases: ['研究说明文件', 'Research README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 前沿技术预研与论文复现工作流规范

> **维护角色**: AI Lab 前沿算法组 @李雷  
> **所属分类**: 🧪 Research (前沿研究)  

---

## 1. 前沿研究选题与准入标准
重点聚焦中大型企业落地 LLM 的真实瓶颈，包括：
- 复杂办公文档 (PDF/Word/Excel) 的跨页结构化解析。
- 严苛的数据隔离与防提示词注入安全加固。
- 极低显存占用下的本地轻量化嵌入检索模型。
`,
      content: `# [说明] 前沿技术预研与论文复现工作流规范

> **维护角色**: AI Lab 前沿算法组 @李雷  
> **所属分类**: 🧪 Research (前沿研究)  

---

## 1. 前沿研究选题与准入标准
重点聚焦中大型企业落地 LLM 的真实瓶颈，包括：
- 复杂办公文档 (PDF/Word/Excel) 的跨页结构化解析。
- 严苛的数据隔离与防提示词注入安全加固。
- 极低显存占用下的本地轻量化嵌入检索模型。
`,
      outgoingLinks: ['[[wiki/research/llm-enterprise-security.md]]'],
      wordCount: 410
    },
    exampleDocs: [
      {
        id: 'wiki-res-security-example',
        path: 'wiki/research/llm-enterprise-security.md',
        fileName: 'llm-enterprise-security.md',
        frontmatter: {
          title: '[示例] 企业大模型私有化安全合规与数据防泄密白皮书',
          type: 'sop',
          created_at: '2026-08-17',
          updated_at: '2026-08-18',
          sources: ['raw/2026-企业知识引擎架构与安全隔离规范.docx'],
          tags: ['安全合规', '私有化部署', '示例', '白皮书'],
          aliases: ['企业安全白皮书', 'LLM Security Specs'],
          status: 'active'
        },
        rawMarkdown: `# [示例] 企业大模型私有化安全合规与数据防泄密白皮书

## 1. 数据分级与存储隔离策略
根据数据敏感程度，将企业资产划分为 3 个安全等级：
- **L1 公开/通用知识**：产品 PRD、公共放假制度、公司官网对外介绍（允许云端模型推理）。
- **L2 部门机密知识**：项目复盘代码、架构设计、员工考勤流水（仅限企业本地私有化集群处理）。
- **L3 绝密核心数据**：财务真实损益、高管薪酬、战略收购意向书（严禁接入任何外部 API）。

## 2. 运行时敏感词与脱敏管道 (PII Masking)
在用户提问进入 LLM 之前，系统自动执行实时流式脱敏：
\`\`\`text
[原始输入] 员工 张三 (身份证号: 110101199003072345) 报销 5200 元
   ↓ (PII 智能脱敏管道)
[模型输入] 员工 [USER_A] (身份证号: [MASKED_ID]) 报销 5200 元
\`\`\`
`,
        content: `# [示例] 企业大模型私有化安全合规与数据防泄密白皮书

## 1. 数据分级与存储隔离策略
根据数据敏感程度，将企业资产划分为 3 个安全等级：
- **L1 公开/通用知识**：产品 PRD、公共放假制度、公司官网对外介绍（允许云端模型推理）。
- **L2 部门机密知识**：项目复盘代码、架构设计、员工考勤流水（仅限企业本地私有化集群处理）。
- **L3 绝密核心数据**：财务真实损益、高管薪酬、战略收购意向书（严禁接入任何外部 API）。

## 2. 运行时敏感词与脱敏管道 (PII Masking)
在用户提问进入 LLM 之前，系统自动执行实时流式脱敏：
\`\`\`text
[原始输入] 员工 张三 (身份证号: 110101199003072345) 报销 5200 元
   ↓ (PII 智能脱敏管道)
[模型输入] 员工 [USER_A] (身份证号: [MASKED_ID]) 报销 5200 元
\`\`\`
`,
        outgoingLinks: ['[[wiki/research/README.md]]'],
        wordCount: 690
      }
    ]
  },

  // 6. Support (客户支持)
  {
    id: 'support',
    name: '客户支持',
    nameEn: 'Support',
    icon: 'Lightbulb',
    colorClass: 'text-purple-500',
    description: '全员行政审批 SOP、员工考勤年假规范、差旅合规报销流程。',
    readmeDoc: {
      id: 'wiki-sup-readme',
      path: 'wiki/support/README.md',
      fileName: 'README.md',
      frontmatter: {
        title: '[说明] 全员协同 SOP 与行政审批全景指引',
        type: 'guide',
        created_at: '2026-08-18',
        updated_at: '2026-08-18',
        sources: ['raw/employee-handbook-2026.pdf'],
        tags: ['客户支持', '行政SOP', '分类说明', '审批流程'],
        aliases: ['支持说明文件', 'Support README'],
        status: 'active'
      },
      rawMarkdown: `# [说明] 全员协同 SOP 与行政审批全景指引

> **维护角色**: 综合人事与行政支持组 (全员协同)  
> **所属分类**: 💡 Support (客户支持)  

---

## 1. 协同维护指引
全员可在日常遇到制度不明确或流程堵塞时，在对应 Wiki 页面下方提交工单建议，AI Agent 汇总后将自动通知制度负责人审核。

## 2. 常用行政流程速查
- **休假与假期**：[[wiki/support/annual-leave-sop.md]] (员工年假与弹性休假申请及审批 SOP)
- **差旅与报销**：[[wiki/support/travel-reimbursement-sop.md]] (员工差旅与合规报销审批 SOP)
`,
      content: `# [说明] 全员协同 SOP 与行政审批全景指引

> **维护角色**: 综合人事与行政支持组 (全员协同)  
> **所属分类**: 💡 Support (客户支持)  

---

## 1. 协同维护指引
全员可在日常遇到制度不明确或流程堵塞时，在对应 Wiki 页面下方提交工单建议，AI Agent 汇总后将自动通知制度负责人审核。

## 2. 常用行政流程速查
- **休假与假期**：[[wiki/support/annual-leave-sop.md]] (员工年假与弹性休假申请及审批 SOP)
- **差旅与报销**：[[wiki/support/travel-reimbursement-sop.md]] (员工差旅与合规报销审批 SOP)
`,
      outgoingLinks: ['[[wiki/support/annual-leave-sop.md]]'],
      wordCount: 420
    },
    exampleDocs: [
      {
        id: 'wiki-sup-leave-example',
        path: 'wiki/support/annual-leave-sop.md',
        fileName: 'annual-leave-sop.md',
        frontmatter: {
          title: '[示例] 员工年假与弹性休假申请及审批标准操作规程 (SOP)',
          type: 'sop',
          created_at: '2026-08-12',
          updated_at: '2026-08-18',
          sources: ['raw/leave-policy-2026.docx'],
          tags: ['考勤休假', '示例', '行政SOP', '全员规范'],
          aliases: ['年假申请流程', 'Annual Leave SOP'],
          status: 'active'
        },
        rawMarkdown: `# [示例] 员工年假与弹性休假申请及审批标准操作规程 (SOP)

## 1. 目的与适用范围
规范集团全体正式员工带薪年休假、婚假、产假与调休假期的额度计算与审批流转，保障员工法定权益与业务正常交接。

## 2. 年休假天数阶梯标准
| 工龄阶段 (累计工作年限) | 法定年休假天数 | 集团额外福利假 | 年度合计可用年假 |
| :--- | :--- | :--- | :--- |
| **已满 1 年不满 10 年** | 5 天 | +2 天福利假 | **7 天** |
| **已满 10 年不满 20 年**| 10 天 | +3 天福利假 | **13 天** |
| **已满 20 年及以上** | 15 天 | +5 天福利假 | **20 天** |

## 3. 申请与审批时效规定
1. **单次休假 <= 3 天**：需提前 2 个工作日提报 OA，直属主管审批通过即生效。
2. **单次休假 > 3 天**：需提前 5 个工作日提报，附带《工作交接临时责任人清单》，抄送部门总监。
3. **假期待遇**：年休假期间视同正常出勤，全额发放基本工资与岗位薪酬。
`,
        content: `# [示例] 员工年假与弹性休假申请及审批标准操作规程 (SOP)

## 1. 目的与适用范围
规范集团全体正式员工带薪年休假、婚假、产假与调休假期的额度计算与审批流转，保障员工法定权益与业务正常交接。

## 2. 年休假天数阶梯标准
| 工龄阶段 (累计工作年限) | 法定年休假天数 | 集团额外福利假 | 年度合计可用年假 |
| :--- | :--- | :--- | :--- |
| **已满 1 年不满 10 年** | 5 天 | +2 天福利假 | **7 天** |
| **已满 10 年不满 20 年**| 10 天 | +3 天福利假 | **13 天** |
| **已满 20 年及以上** | 15 天 | +5 天福利假 | **20 天** |

## 3. 申请与审批时效规定
1. **单次休假 <= 3 天**：需提前 2 个工作日提报 OA，直属主管审批通过即生效。
2. **单次休假 > 3 天**：需提前 5 个工作日提报，附带《工作交接临时责任人清单》，抄送部门总监。
3. **假期待遇**：年休假期间视同正常出勤，全额发放基本工资与岗位薪酬。
`,
        outgoingLinks: ['[[wiki/support/README.md]]'],
        wordCount: 680
      }
    ]
  }
];

export const COLLECTION_DOCS: CategoryCollectionGroup[] = [
  ...BASE_COLLECTION_DOCS,
  ...SOCIAL_MEDIA_COLLECTIONS
];

// Helper to get all collection wiki pages flattened
export const ALL_COLLECTION_WIKI_PAGES: WikiPage[] = COLLECTION_DOCS.flatMap(c => [
  c.readmeDoc,
  ...c.exampleDocs
]);
