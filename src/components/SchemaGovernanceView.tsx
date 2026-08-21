import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCode,
  Copy,
  Check,
  Code2,
  FolderGit2,
  BookOpen,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ENTITY_SCHEMAS_META } from '../data/pagePlanningData';

export const SchemaGovernanceView: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('sop');
  const [copied, setCopied] = useState<boolean>(false);

  const schemaMarkdownContent = `# 企业 LLM Wiki 系统治理规范 (.agent/schema.md)

本文件定义了企业通用知识库（LLM Wiki）的目录架构、实体分类模板、格式规范以及智能体（Agent）在执行 Ingest（摄入）、Query（查询）与 Lint（体检）时的核心准则。

---

## 1. 核心运行原则 (Core Principles)

1. **Layer 1 绝对不可变**：\`raw/\` 目录为原始资料库，Agent 仅有读取权限，**严禁修改或删除** \`raw/\` 下的任何文件。
2. **Layer 2 全权托管**：\`wiki/\` 目录完全由 Agent 生成与维护。人类用户负责查看，Agent 负责写、更新、重构与交叉引用。
3. **知识网状交织 (Multi-Touch Update)**：新增或更新一份原始资料时，Agent 不得仅生成单一摘要，必须主动更新 5–15 个关联的 Wiki 概念页、术语页与对比页。
4. **追溯性 (Provenance)**：每一个 Wiki 页面必须在 Frontmatter 和页面底部明确记录引用的 \`raw/\` 来源路径。
5. **增量复利 (Compounding)**：提问（Query）过程中产出的高价值综合分析，必须经确认后反哺写回为新的 Wiki 页面，不得遗留在对话记录中。

---

## 2. 目录架构标准 (Directory Layout)

\`\`\`text
.
├── .agent/                    # Agent 系统治理规范与模板
│   ├── schema.md              # [本文件] 系统运行总规则
│   └── templates/             # 页面 Markdown 模板
├── raw/                       # 原始资料层 (不可变)
│   ├── assets/                # 图片、附件、PDF解析临时图表
│   └── YYYY-MM-DD_title.md    # 摄入的原始文档/会议纪要/SOP文本
└── wiki/                      # 编译知识库层 (Agent 全权维护)
    ├── index.md               # [核心] 全局一句话索引 (单行/页)
    ├── log.md                 # [核心] 追加式操作与变更日志
    ├── sops/                  # 业务流程、规范、指南
    ├── products/              # 产品定义、功能说明、售前/售后 FAQ
    ├── projects/              # 项目背景、里程碑、技术选型与复盘
    ├── terms/                 # 企业内部黑话、缩写、技术/业务术语
    └── syntheses/             # 综合分析、对比表格、季度/跨部门总结
\`\`\`

---

## 3. Metadata & Frontmatter 统一标准

所有在 \`wiki/\` 下生成的 Markdown 页面，顶部必须包含标准的 YAML Frontmatter，禁止缺失：

\`\`\`yaml
---
title: "标准的页面标题"
type: "sop" # 取值范围: sop | product | project | term | synthesis
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
sources:
  - "raw/YYYY-MM-DD_filename.md"
tags:
  - "标签1"
  - "标签2"
aliases:
  - "同义词/别名1"
status: "active" # active | deprecated | draft
---
\`\`\`
`;

  const entityTemplates: Record<string, string> = {
    sop: `# [SOP] 页面标题

## 1. 流程概述
简要说明本流程的适用对象、触发条件与期望目标。

## 2. 前置条件与准备
列出执行本流程前需具备的权限、工具或文档。

## 3. 详细执行步骤
1. **步骤一**：动作说明。
2. **步骤二**：动作说明。

## 4. 常见报错与异常处理
| 报错/异常现象 | 可能原因 | 解决办法/排查路径 |
| :--- | :--- | :--- |

## 5. 关联文档与术语
* [[wiki/terms/sample-term.md]]
* [[wiki/projects/sample-project.md]]`,

    product: `# [Product] 产品/功能名称

## 1. 产品定位与目标客群
说明该产品或功能解决的核心痛点。

## 2. 核心功能与规格
详细列出功能模块、参数或收费标准。

## 3. 常见客户问答 (FAQ)
* **Q: 问题描述？**
  * A: 标准回答。

## 4. 关联项目与 SOP
* [[wiki/sops/sample-sop.md]]`,

    project: `# [Project] 项目名称

## 1. 项目背景与目标
说明项目起因、关键负责人及终态目标。

## 2. 关键里程碑与决策
* **[YYYY-MM-DD]** 关键技术选型或业务决策点。

## 3. 架构设计与技术路径
简述核心实现逻辑与使用的技术栈。

## 4. 经验复盘与遗留问题
记录项目的踩坑经验与后续迭代计划。`,

    term: `# [Term] 术语/黑话全称 (缩写)

## 1. 标准定义
用 1–2 句话精准给出专业定义。

## 2. 企业内部应用场景
说明该术语在公司内部的特定含义、适用部门及使用例句。

## 3. 易混淆概念对比
对比易混淆的相关术语或概念。`,

    synthesis: `# [Synthesis] 综述分析主题

## 1. 核心结论摘要
用 3 个要点总结本篇分析的最终结论。

## 2. 多维度对比分析
使用 Markdown 表格或结构化列表进行横向对比。

## 3. 详细论证与数据支撑
结合引用的 Raw Sources 展开论述。`
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaMarkdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              .agent/schema.md
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Agent 系统治理规范与 5 大实体 Markdown 标准
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            系统治理规范与 Schema 模板中心
          </h2>
          <p className="text-xs text-slate-500">
            作为 Codex / Claude Code / 自研 Agent 的底层运行指令与行为准则，确保企业知识库标准统一。
          </p>
        </div>

        <button
          onClick={handleCopySchema}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '已复制 schema.md' : '复制 .agent/schema.md'}</span>
        </button>
      </div>

      {/* 2-Column: Left = schema.md Spec; Right = 5 Entity Markdown Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: schema.md Raw Viewer (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>.agent/schema.md 规范全文</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs max-h-[600px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {schemaMarkdownContent}
          </div>
        </div>

        {/* Right: 5 Entity Templates Interactive Drawer (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-emerald-600" />
              <span>5 大实体结构 Markdown 模板库</span>
            </h3>
          </div>

          {/* Entity Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {ENTITY_SCHEMAS_META.map(meta => (
              <button
                key={meta.type}
                onClick={() => setSelectedEntity(meta.type)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedEntity === meta.type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {meta.name}
              </button>
            ))}
          </div>

          {/* Template Content */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block">
                {ENTITY_SCHEMAS_META.find(m => m.type === selectedEntity)?.name}
              </span>
              <p className="text-slate-500">
                {ENTITY_SCHEMAS_META.find(m => m.type === selectedEntity)?.purpose}
              </p>
              <div className="text-[11px] text-indigo-600 font-mono">
                存储路径: {ENTITY_SCHEMAS_META.find(m => m.type === selectedEntity)?.path}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs max-h-[440px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {entityTemplates[selectedEntity]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
