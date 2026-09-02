import {
  ObsidianVaultConfig,
  ObsidianCanvasFile,
  ObsidianDataviewQueryPreset,
  ObsidianApiCallLog
} from '../types';

export const DEFAULT_OBSIDIAN_CONFIG: ObsidianVaultConfig = {
  vaultName: 'f324a1ec05d72a6f',
  vaultLocalPath: 'E:\\2026\\obsidian\\wiki',
  restApiEndpoint: 'http://127.0.0.1:27123',
  restApiStatus: 'connecting',
  apiKey: '',
  syncEngine: 'Obsidian Local REST API',
  activePlugins: [
    'obsidian-local-rest-api (v2.1.2)',
    'dataview (v0.5.67)',
    'obsidian-git (v2.30.0)',
    'omnisearch (v1.24.1)',
    'canvas-conversation (v1.0.8)',
    'templater-obsidian (v2.9.2)'
  ],
  totalNotes: 59,
  totalCanvasFiles: 0,
  totalAttachments: 0,
  lastSyncTime: '2026-08-26 12:30'
};

export const PRESET_OBSIDIAN_CANVASES: ObsidianCanvasFile[] = [
  {
    id: 'canvas-1',
    name: 'enterprise-knowledge-architecture.canvas',
    path: 'wiki/canvases/enterprise-knowledge-architecture.canvas',
    title: '企业全景知识拓扑与数据流转白板 (Obsidian Canvas)',
    updatedAt: '2026-08-18 18:50',
    nodes: [
      {
        id: 'node-raw',
        type: 'group',
        label: 'Layer 1: 不可变事实库 (raw/)',
        x: 40,
        y: 40,
        width: 320,
        height: 240,
        color: '#10B981'
      },
      {
        id: 'node-raw-doc',
        type: 'file',
        filePath: 'raw/2026-08-10_最新差旅报销与合规制度.pdf.md',
        x: 60,
        y: 90,
        width: 280,
        height: 160,
        color: '#10B981'
      },
      {
        id: 'node-agent',
        type: 'text',
        text: '### 🤖 LLM Agent 编织中枢\n- Multi-Touch Ingest\n- Obsidian REST API 写入\n- 自动注入 YAML 与 Callouts',
        x: 420,
        y: 110,
        width: 260,
        height: 140,
        color: '#6366F1'
      },
      {
        id: 'node-wiki-group',
        type: 'group',
        label: 'Layer 2: Obsidian 结构化网络 (wiki/)',
        x: 740,
        y: 30,
        width: 360,
        height: 380,
        color: '#3B82F6'
      },
      {
        id: 'node-sop',
        type: 'file',
        filePath: 'wiki/sops/travel-reimbursement.md',
        x: 760,
        y: 80,
        width: 320,
        height: 120,
        color: '#3B82F6'
      },
      {
        id: 'node-synthesis',
        type: 'file',
        filePath: 'wiki/syntheses/travel-policy-2026-comparison.md',
        x: 760,
        y: 230,
        width: 320,
        height: 140,
        color: '#8B5CF6'
      }
    ],
    edges: [
      {
        id: 'edge-1',
        fromNode: 'node-raw-doc',
        toNode: 'node-agent',
        fromSide: 'right',
        toSide: 'left',
        label: 'Agent 抓取与解析'
      },
      {
        id: 'edge-2',
        fromNode: 'node-agent',
        toNode: 'node-sop',
        fromSide: 'right',
        toSide: 'left',
        label: '生成 SOP 实体'
      },
      {
        id: 'edge-3',
        fromNode: 'node-agent',
        toNode: 'node-synthesis',
        fromSide: 'right',
        toSide: 'left',
        label: '生成对比综述'
      }
    ]
  },
  {
    id: 'canvas-2',
    name: 'media-content-matrix.canvas',
    path: 'wiki/canvases/media-content-matrix.canvas',
    title: '新媒体爆款短视频与文案创意流转矩阵 (Obsidian Canvas)',
    updatedAt: '2026-08-18 18:30',
    nodes: [
      {
        id: 'node-m-1',
        type: 'file',
        filePath: 'wiki/sops/short-video-3s-hook-library.md',
        x: 60,
        y: 60,
        width: 300,
        height: 140,
        color: '#F43F5E'
      },
      {
        id: 'node-m-2',
        type: 'file',
        filePath: 'wiki/sops/xiaohongshu-cover-typography-sop.md',
        x: 420,
        y: 60,
        width: 300,
        height: 140,
        color: '#EC4899'
      },
      {
        id: 'node-m-3',
        type: 'file',
        filePath: 'wiki/products/brand-visual-guidelines-2026.md',
        x: 240,
        y: 260,
        width: 300,
        height: 140,
        color: '#A855F7'
      }
    ],
    edges: [
      {
        id: 'edge-m-1',
        fromNode: 'node-m-1',
        toNode: 'node-m-3',
        fromSide: 'bottom',
        toSide: 'top',
        label: '对齐品牌色彩VI'
      },
      {
        id: 'edge-m-2',
        fromNode: 'node-m-2',
        toNode: 'node-m-3',
        fromSide: 'bottom',
        toSide: 'top',
        label: '遵循导出基准'
      }
    ]
  }
];

export const PRESET_DATAVIEW_QUERIES: ObsidianDataviewQueryPreset[] = [
  {
    id: 'dv-1',
    title: '全库活跃 SOP 流程规范清单 (按更新时间倒序)',
    dql: `TABLE file.folder as "目录", status as "状态", updated_at as "最近更新", sources as "资料来源"
FROM "wiki/sops"
WHERE status = "active"
SORT updated_at DESC`,
    description: '通过 Obsidian Dataview 插件实时提取所有类型为 SOP 的 Markdown 文件的 Frontmatter 属性并格式化为表格',
    targetFolder: 'wiki/sops'
  },
  {
    id: 'dv-2',
    title: '新媒体爆款与设计规范主题知识 (标签聚合)',
    dql: `TABLE tags as "标签", aliases as "别名", file.outlinks as "关联知识链"
FROM "wiki"
WHERE contains(tags, "新媒体") OR contains(tags, "视觉设计")
SORT file.name ASC`,
    description: '聚合全库涉及新媒体、爆款短视频与设计规范的双链关系网络',
    targetFolder: 'wiki'
  },
  {
    id: 'dv-3',
    title: '技术架构与微服务 RFC 选型清单',
    dql: `TABLE type as "实体类型", sources as "原始RFC出处", tags as "架构标签"
FROM "wiki/projects" OR "wiki/terms"
WHERE contains(tags, "微服务") OR contains(tags, "技术架构")
SORT updated_at DESC`,
    description: '研发团队专用 Dataview 视图，快速检索架构设计、限流算法与 API 规范',
    targetFolder: 'wiki/projects'
  }
];

export const PRESET_OBSIDIAN_API_LOGS: ObsidianApiCallLog[] = [
  {
    id: 'api-log-1',
    timestamp: '2026-08-18 19:01:24',
    method: 'POST',
    endpoint: '/vault/wiki/sops/short-video-3s-hook-library.md',
    agentTask: 'Agent Ingest 自动生成 Obsidian 笔记与 Callout 格式',
    status: 201,
    latencyMs: 14,
    responsePayloadSummary: '{ "status": "created", "path": "wiki/sops/short-video-3s-hook-library.md", "size": 1842 }'
  },
  {
    id: 'api-log-2',
    timestamp: '2026-08-18 19:01:25',
    method: 'PUT',
    endpoint: '/vault/wiki/canvases/enterprise-knowledge-architecture.canvas',
    agentTask: 'Agent 自动同步白板拓扑节点并连接连线 (Obsidian Canvas)',
    status: 200,
    latencyMs: 19,
    responsePayloadSummary: '{ "status": "updated", "nodes": 6, "edges": 3 }'
  },
  {
    id: 'api-log-3',
    timestamp: '2026-08-18 19:01:28',
    method: 'POST',
    endpoint: '/dataview/query',
    agentTask: '执行 Dataview DQL 查询生成动态表格索引',
    status: 200,
    latencyMs: 8,
    responsePayloadSummary: '{ "resultsCount": 11, "columns": ["目录", "状态", "最近更新", "资料来源"] }'
  },
  {
    id: 'api-log-4',
    timestamp: '2026-08-18 19:01:30',
    method: 'POST',
    endpoint: '/periodic/sync-git-commit',
    agentTask: '触发 Obsidian Git 插件提交变更至企业私有知识库仓库',
    status: 200,
    latencyMs: 85,
    responsePayloadSummary: '{ "commitHash": "8f3b92c", "message": "chore: agent batch auto-ingest 3 wiki entities" }'
  }
];
