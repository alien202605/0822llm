export interface DraftDoc {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  author: string;
  content: string;
}

export interface ArchivedDoc {
  id: string;
  title: string;
  category: string;
  archivedAt: string;
  reason: string;
  content: string;
}

export interface TrashDoc {
  id: string;
  title: string;
  deletedAt: string;
  originalPath: string;
  content: string;
}

export interface DocTemplate {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  content: string;
}

export interface CustomCollection {
  id: string;
  name: string;
  iconName: string;
  colorClass: string;
  docIds: string[];
}

export const INITIAL_TEMPLATES: DocTemplate[] = [
  {
    id: 'tpl-sop',
    title: '标准操作规程 (SOP) 规范模板',
    category: '流程规范',
    icon: 'FileText',
    description: '适用于各部门规章制度、审批流、运维手册及合规操作标准定义。',
    content: `# [SOP 标题]: 规范名称

> **版本状态**: Draft v1.0  
> **适用部门**: 全员 / 研发中心 / 运营部  
> **责任负责人**: @责任人  

---

## 1. 目的与适用范围 (Objective)
明确此规范的业务背景、核心价值及覆盖的业务场景与人员边界。

## 2. 核心操作流程与时限 (Workflow)
1. **第一步：申请/发起**
   - 填写标准表单，并关联源文件出处。
2. **第二步：自动合规校验**
   - 系统级校验关键字段，预计耗时 < 5分钟。
3. **第三步：人工复核与归档**
   - 负责人审批并自动回写 Wiki 索引。

## 3. 常见异常与兜底处理 (FAQ)
- **Q: 若网络超时未收到回调如何处理？**
  - A: 触发重试队列，最多重试 3 次后转入人工待办。
`
  },
  {
    id: 'tpl-prd',
    title: '产品需求文档 (PRD) 模板',
    category: '产品设计',
    icon: 'Layers',
    description: '结构化梳理业务痛点、用户画像、功能清单与验收标准。',
    content: `# [PRD]: 功能模块名称

> **产品经理**: @Jenn  
> **目标版本**: 2026-Q3  
> **优先级**: P0 (High)  

---

## 1. 需求背景与用户痛点
描述目标用户在当前工作流中遇到的瓶颈与数据孤岛问题。

## 2. 核心功能设计 (Feature Matrix)
| 功能点 | 优先级 | 描述 | 关联 API |
| :--- | :--- | :--- | :--- |
| 多源文件解析 | P0 | 支持 PDF/Excel/Word 结构化解析 | \`/api/parse\` |
| 双向链接编译 | P0 | 自动生成 [[wiki/...]] 关系网络 | \`/api/link\` |

## 3. 衡量指标与成功标准 (Metrics)
- 知识库检索准确率 >= 95%
- 单次 Agent 编织生成耗时 <= 15 秒
`
  },
  {
    id: 'tpl-tech-spec',
    title: '系统架构设计与白皮书模板',
    category: '研发工程',
    icon: 'Code2',
    description: '包含技术选型、接口定义、数据模型与安全防护设计。',
    content: `# [架构方案]: 系统技术规格说明书

> **架构师**: @Alex  
> **技术栈**: React 18 + Node.js + Obsidian Local API + qmd 引擎  

---

## 1. 架构拓扑设计
\`\`\`
[客户端] ---> [Nginx 代理:3000] ---> [Vite/Express 编译层] ---> [Obsidian Vault:27123]
\`\`\`

## 2. 接口契约定义 (API Contract)
\`\`\`typescript
interface KnowledgePayload {
  vaultPath: string;
  frontmatter: Record<string, any>;
  contentAst: string;
}
\`\`\`

## 3. 容灾与安全加固
- 生产环境敏感密钥仅保存在服务端。
- 本地 Vault 采用只读隔离机制与 Git SHA-256 审计存证。
`
  },
  {
    id: 'tpl-meeting',
    title: '战略与项目复盘纪要模板',
    category: '团队协同',
    icon: 'Users',
    description: '记录参会人员、核心决议、遗留待办事项与推进时间表。',
    content: `# [会议纪要]: 2026 战略对齐与进展复盘

> **会议时间**: 2026-08-18  
> **参会人**: @Jenn, @Alex, @Phoebe, @李雷  
> **主持人**: @Jenn  

---

## 1. 核心讨论议题
- 知识库双排版风格与中英文多语言落地规划。
- 复杂办公文档（PDF 多栏、Excel 多工作表）的 Agent 深度解析。

## 2. 关键决策结论 (Key Decisions)
- [x] 默认采用中文语言，设置面板提供中英即时切换。
- [x] 完善左侧栏所有功能项（收藏、模板、草稿、归档、回收站、设置）。

## 3. 下一步行动项 (Action Items)
- [ ] @Alex: 完善 Obsidian 自动化 .canvas 生成管道 (2026-08-20)
- [ ] @Phoebe: 优化 qmd 倒排索引分词召回率 (2026-08-21)
`
  },
  {
    id: 'tpl-announcement',
    title: '公司行政通知与重大通告模板',
    category: '公司资料',
    icon: 'Building2',
    description: '适用于重大人事任命、战略升级、节假日放假安排及行政通报。',
    content: `# [通知]: 关于 2026 年度公司某事项的行政通告

> **签发机构**: 总经办 / 人力资源部  
> **发布日期**: 2026-08-18  
> **通知文号**: ACME-NOTICE-2026-XXX  
> **适用范围**: 全体员工  

---

## 1. 通知背景与核心目的
简明阐述本通知发布的业务背景、决策起因与预期目标。

## 2. 核心调整与具体实施方案
- **执行时间节点**: 自 2026 年 X 月 X 日起正式施行；
- **具体细则**: 详细列出调整事项、操作流程及责任对接人。

## 3. 注意事项与疑问反馈
如有相关疑问，请通过企业工作群联系 @HR 或邮件咨询 hr-support@company.com。
`
  }
];

export const INITIAL_DRAFTS: DraftDoc[] = [
  {
    id: 'draft-1',
    title: '草稿: Q4 研发技术演进路线与 LLM 知识引擎升级',
    category: 'Engineering',
    updatedAt: '10 分钟前',
    author: 'Jenn Smith',
    content: `# 草稿: Q4 研发技术演进路线与 LLM 知识引擎升级

本文正在整理关于本地 Obsidian REST API 与企业私有化部署的混合检索性能基准测试。

## 待完善要点：
1. BM25 与向量混合重排的最佳权重配置 (当前评估 0.6 : 0.4)
2. 跨页表格 TableTransformer 的 GPU 加速方案`
  },
  {
    id: 'draft-2',
    title: '草稿: 客户支持团队多源问答标准话术规范',
    category: 'Support',
    updatedAt: '2 小时前',
    author: 'Phoebe',
    content: `# 草稿: 客户支持团队多源问答标准话术规范

针对企业客户对于数据私有化与合规审计的常见咨询，制定标准答复口径。`
  },
  {
    id: 'draft-3',
    title: '草稿: 品牌视觉 2026 新版配色与 UI 规范提案',
    category: 'Brand Design',
    updatedAt: '昨天',
    author: 'Alex',
    content: `# 草稿: 品牌视觉 2026 新版配色与 UI 规范提案

探索更具呼吸感的灰阶系统与高可读性字体排版层级。`
  }
];

export const INITIAL_ARCHIVED_DOCS: ArchivedDoc[] = [
  {
    id: 'arch-1',
    title: '已归档: 2025 传统静态 Wiki 迁移方案 (已废止)',
    category: 'Documentation',
    archivedAt: '2026-01-15',
    reason: '系统已全面升级为基于 Karpathy 理论的 Agent 自动化编译知识库',
    content: `# 2025 传统静态 Wiki 迁移方案 (已封存归档)

该文档为往期基于 Confluence 的旧迁移方案，现已废弃。`
  },
  {
    id: 'arch-2',
    title: '已归档: 2025 Q4 季度财务预决算手工汇总表',
    category: 'Finance',
    archivedAt: '2026-02-01',
    reason: '已结项并通过审计，替换为 2026 年度自动化多工作表 Excel 引擎',
    content: `# 2025 Q4 季度财务预决算手工汇总表

归档存证用途，只读保存。`
  }
];

export const INITIAL_TRASH_DOCS: TrashDoc[] = [
  {
    id: 'trash-1',
    title: '待清理: 临时测试用爬虫切片.md',
    deletedAt: '2026-08-16',
    originalPath: 'raw/temp-scrape-test.md',
    content: `# 临时测试用爬虫切片

仅供联调网络时使用，已无业务留存价值。`
  }
];
