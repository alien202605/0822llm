import React, { useState } from 'react';
import {
  HardDrive,
  Laptop,
  Monitor,
  FolderSync,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  FileCode,
  FileText,
  Video,
  Palette,
  Code,
  Shield,
  Layers,
  Zap,
  Share2,
  Sliders,
  Check,
  ChevronRight,
  Terminal,
  Cpu,
  Building2,
  Film,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SharedDriveDevice, SharedAssetItem, IndustryArchetype, RawDocument, WikiPage, LogEntry } from '../types';
import { PRESET_SHARED_DEVICES, PRESET_SHARED_ASSETS, WORKSTATION_MOUNT_PROTOCOLS } from '../data/sharedDriveData';

interface SharedDriveSyncViewProps {
  onIngestComplete: (
    updatedRaw: RawDocument,
    newOrUpdatedWikiPages: WikiPage[],
    newLog: LogEntry
  ) => void;
  onNavigateToWikiPage: (path: string) => void;
  onNavigateToRaw: (path: string) => void;
}

export const SharedDriveSyncView: React.FC<SharedDriveSyncViewProps> = ({
  onIngestComplete,
  onNavigateToWikiPage,
  onNavigateToRaw
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryArchetype | 'all'>('all');
  const [devices, setDevices] = useState<SharedDriveDevice[]>(PRESET_SHARED_DEVICES);
  const [assets, setAssets] = useState<SharedAssetItem[]>(PRESET_SHARED_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isBatchIngesting, setIsBatchIngesting] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // New Workstation modal
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceOwner, setNewDeviceOwner] = useState('');
  const [newDeviceDept, setNewDeviceDept] = useState('');
  const [newDevicePath, setNewDevicePath] = useState('');
  const [newDeviceOS, setNewDeviceOS] = useState<'macOS' | 'Windows' | 'Linux'>('Windows');

  // Protocol guide tab
  const [activeProtocolTab, setActiveProtocolTab] = useState('smb');

  // Filter devices & assets
  const filteredDevices = devices.filter(d => {
    if (selectedIndustry !== 'all' && d.industry !== selectedIndustry) return false;
    return true;
  });

  const filteredAssets = assets.filter(a => {
    const matchIndustry = selectedIndustry === 'all' || a.industry === selectedIndustry;
    const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSearch =
      a.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.snippetPreview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchIndustry && matchCategory && matchSearch;
  });

  // Category counts
  const categories = Array.from(new Set(assets.map(a => a.category)));

  // Batch Ingest all pending assets from workstation shared drives
  const handleBatchIngestPendingAssets = () => {
    setIsBatchIngesting(true);
    setBatchProgress(15);

    setTimeout(() => setBatchProgress(45), 400);
    setTimeout(() => setBatchProgress(80), 900);

    setTimeout(() => {
      setBatchProgress(100);

      // Transform pending assets to synced and generate real Wiki pages
      const updatedAssets: SharedAssetItem[] = assets.map(a => {
        if (a.syncState === 'pending_ingest') {
          let generatedPaths: string[] = [];
          if (a.id === 'asset-media-1') {
            generatedPaths = [
              'wiki/sops/short-video-3s-hook-library.md',
              'wiki/terms/retention-rate-formula.md',
              'wiki/syntheses/video-opening-retention-benchmarks.md'
            ];
          } else if (a.id === 'asset-media-2') {
            generatedPaths = [
              'wiki/sops/xiaohongshu-cover-typography-sop.md',
              'wiki/products/social-media-content-matrix.md',
              'wiki/terms/emoji-visual-guidelines.md'
            ];
          } else if (a.id === 'asset-soft-1') {
            generatedPaths = [
              'wiki/projects/distributed-gateway-ratelimit.md',
              'wiki/terms/token-bucket-algorithm.md',
              'wiki/sops/api-auth-dual-token-spec.md'
            ];
          } else if (a.id === 'asset-soft-3') {
            generatedPaths = [
              'wiki/sops/production-p0-incident-sop.md',
              'wiki/terms/on-call-sla.md',
              'wiki/projects/stability-governance-2026.md'
            ];
          } else {
            generatedPaths = [
              `wiki/sops/${a.fileName.slice(0, 8)}.md`,
              `wiki/terms/${a.fileName.slice(0, 6)}.md`
            ];
          }

          return {
            ...a,
            syncState: 'synced_to_raw' as const,
            extractedEntitiesCount: generatedPaths.length,
            generatedWikiPaths: generatedPaths
          };
        }
        return a;
      });

      setAssets(updatedAssets);

      // Create a comprehensive Raw Document in Layer 1
      const newRawDoc: RawDocument = {
        id: `raw-shared-drive-${Date.now()}`,
        fileName: '2026-08-18_多工作站共享盘素材集中汇聚包.md',
        path: 'raw/2026-08-18_多工作站共享盘素材集中汇聚包.md',
        title: '企业全员工位工作共享盘素材汇聚归档',
        sourceType: 'shared_drive',
        uploadedAt: '2026-08-18 18:55',
        size: '1.4 MB (6份跨部门素材)',
        content: `# 企业各部门工作共享盘素材集中归档 (汇聚自局域网SMB与Sync Daemon)

## 1. 汇聚来源工作站清单
- 编导小美 (短视频运营部 / macOS) - 2026短视频爆款黄金3秒开头脚本库_SOP.docx
- 文案阿强 (内容创意中心 / Windows) - 小红书千赞爆文排版与封面设计拆解指南.pdf
- 王建国 (基础架构部 / macOS) - 微服务网关限流降级与分布式鉴权设计_RFC-089.md
- 李明轩 (运维保障中心 / Linux) - 生产环境P0级故障应急响应与自愈接管_SOP-2026.md

## 2. Agent 智能知识萃取摘要
经 Multi-Touch Ingest 自动提取，已解构为 12 篇跨部门通用 Wiki 实体（包含拍摄SOP、分镜规范、高并发架构设计与应急预案），实现全员即时搜索与复用。`,
        compiledPagesCount: 6,
        compiledPagePaths: [
          'wiki/sops/short-video-3s-hook-library.md',
          'wiki/terms/retention-rate-formula.md',
          'wiki/sops/xiaohongshu-cover-typography-sop.md',
          'wiki/projects/distributed-gateway-ratelimit.md',
          'wiki/terms/token-bucket-algorithm.md',
          'wiki/sops/production-p0-incident-sop.md'
        ],
        sourceDevice: '企业共享盘分布式网络 (4台员工电脑)',
        sourceCategory: '跨部门工作共享盘'
      };

      // Create newly generated Wiki pages
      const newWikiPages: WikiPage[] = [
        {
          id: `wiki-shared-1-${Date.now()}`,
          path: 'wiki/sops/short-video-3s-hook-library.md',
          fileName: 'short-video-3s-hook-library.md',
          frontmatter: {
            title: '短视频黄金3秒开头与完播率提升 SOP',
            type: 'sop',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: ['raw/2026-08-18_多工作站共享盘素材集中汇聚包.md'],
            tags: ['新媒体', '短视频', '脚本SOP', '爆款方法论'],
            status: 'active'
          },
          rawMarkdown: `---
title: "短视频黄金3秒开头与完播率提升 SOP"
type: "sop"
created_at: "2026-08-18"
updated_at: "2026-08-18"
sources:
  - "raw/2026-08-18_多工作站共享盘素材集中汇聚包.md"
tags:
  - "新媒体"
  - "短视频"
  - "脚本SOP"
status: "active"
---

# [SOP] 短视频黄金3秒开头与完播率提升 SOP

## 1. 核心概述
根据新媒体短视频运营部工作共享盘素材沉淀，短视频完播率核心取决于前3秒留存率。

## 2. 5大黄金开头公式
1. **痛点悬念型**：“90%的新媒体人都不知道的爆款公式...”
2. **反常识冲突型**：“千万不要再按照老方法写文案了...”
3. **情绪共鸣型**：“加班到深夜做不出爆款？今天彻底讲透...”
4. **权威背书型**：“实操操盘1000万播放量的底层逻辑...”
5. **沉浸式开箱型**：第一视角音效+视觉强刺激。

## 3. 关联知识
* [[wiki/terms/retention-rate-formula.md]]
* [[wiki/products/brand-visual-guidelines-2026.md]]`,
          content: '短视频完播率核心取决于前3秒留存率...',
          outgoingLinks: [
            'wiki/terms/retention-rate-formula.md',
            'wiki/products/brand-visual-guidelines-2026.md'
          ],
          wordCount: 420
        },
        {
          id: `wiki-shared-2-${Date.now()}`,
          path: 'wiki/projects/distributed-gateway-ratelimit.md',
          fileName: 'distributed-gateway-ratelimit.md',
          frontmatter: {
            title: '微服务网关分布式限流与高可用设计 RFC',
            type: 'project',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: ['raw/2026-08-18_多工作站共享盘素材集中汇聚包.md'],
            tags: ['技术架构', '微服务', '限流降级', 'RFC'],
            status: 'active'
          },
          rawMarkdown: `---
title: "微服务网关分布式限流与高可用设计 RFC"
type: "project"
created_at: "2026-08-18"
updated_at: "2026-08-18"
sources:
  - "raw/2026-08-18_多工作站共享盘素材集中汇聚包.md"
tags:
  - "技术架构"
  - "微服务"
  - "限流降级"
status: "active"
---

# [Project] 微服务网关分布式限流与高可用设计 RFC

## 1. 架构目标
支撑全集团日均10亿次 API 调用，实现毫秒级限流与无感平滑降级。

## 2. 核心技术选型
- **限流算法**：采用 Redis + Lua 脚本实现分布式令牌桶机制。
- **本地滑动窗口**：网关本地配置 100ms 滑动窗口做二级熔断保护。
- **双 Token 鉴权**：Access Token (15分钟) + Refresh Token (7天)，采用 Ed25519 签名。

## 3. 关联知识
* [[wiki/terms/token-bucket-algorithm.md]]
* [[wiki/sops/customer-service-incident-response.md]]`,
          content: '支撑全集团日均10亿次 API 调用...',
          outgoingLinks: [
            'wiki/terms/token-bucket-algorithm.md',
            'wiki/sops/customer-service-incident-response.md'
          ],
          wordCount: 510
        },
        {
          id: `wiki-shared-3-${Date.now()}`,
          path: 'wiki/sops/xiaohongshu-cover-typography-sop.md',
          fileName: 'xiaohongshu-cover-typography-sop.md',
          frontmatter: {
            title: '小红书爆文排版与封面设计规范 SOP',
            type: 'sop',
            created_at: '2026-08-18',
            updated_at: '2026-08-18',
            sources: ['raw/2026-08-18_多工作站共享盘素材集中汇聚包.md'],
            tags: ['新媒体', '排版规范', '小红书', '视觉设计'],
            status: 'active'
          },
          rawMarkdown: `---
title: "小红书爆文排版与封面设计规范 SOP"
type: "sop"
created_at: "2026-08-18"
updated_at: "2026-08-18"
sources:
  - "raw/2026-08-18_多工作站共享盘素材集中汇聚包.md"
tags:
  - "新媒体"
  - "小红书"
  - "视觉设计"
status: "active"
---

# [SOP] 小红书爆文排版与封面设计规范 SOP

## 1. 封面 3 要素黄金法则
1. **主视觉高饱和度**：突出核心人物或产品，背景简洁。
2. **利益点标题字号**：主标题字数不超过 10 个字，居中或左上对齐。
3. **标签背书**：右下角增加“建议收藏 / 实测推荐”等提示标。

## 2. 正文字体与段落
- 正文段落每段不超过 3 行。
- 适当添加表情符 (Emoji) 引导视线，每篇正文控制在 400-600 字以内。`,
          content: '小红书爆文排版与封面设计规范...',
          outgoingLinks: ['wiki/products/brand-visual-guidelines-2026.md'],
          wordCount: 380
        }
      ];

      const newLog: LogEntry = {
        id: `log-shared-${Date.now()}`,
        timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        action: 'SHARED_DRIVE_SYNC',
        source: 'Workstation Shared Drive (局域网工作共享盘)',
        targetPages: [
          'raw/2026-08-18_多工作站共享盘素材集中汇聚包.md',
          'wiki/sops/short-video-3s-hook-library.md',
          'wiki/projects/distributed-gateway-ratelimit.md',
          'wiki/sops/xiaohongshu-cover-typography-sop.md',
          'qmd.idx'
        ],
        description: '完成 4 台员工电脑工作共享盘素材一键汇聚并网，生成 3 篇结构化 Wiki 实体并更新 qmd 检索索引'
      };

      onIngestComplete(newRawDoc, newWikiPages, newLog);
      setIsBatchIngesting(false);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  // Add new workstation drive device
  const handleAddNewDevice = () => {
    if (!newDeviceName.trim() || !newDeviceOwner.trim()) return;

    const newDev: SharedDriveDevice = {
      id: `dev-custom-${Date.now()}`,
      name: newDeviceName,
      ownerName: newDeviceOwner,
      department: newDeviceDept || '综合业务部',
      os: newDeviceOS,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 150 + 50)}`,
      localMountPath: newDevicePath || (newDeviceOS === 'Windows' ? 'Z:\\OmniShare\\MyAssets' : '~/CompanyShare/WorkDocs'),
      status: 'online',
      lastSyncTime: '刚刚连线',
      pendingFilesCount: 1,
      totalSyncedFiles: 0,
      bandwidthSpeed: '54.0 MB/s',
      autoIngestToWiki: true,
      industry: selectedIndustry === 'all' ? 'general_enterprise' : selectedIndustry
    };

    setDevices(prev => [newDev, ...prev]);
    setIsAddDeviceOpen(false);
    setNewDeviceName('');
    setNewDeviceOwner('');
    setNewDeviceDept('');
    setNewDevicePath('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner with Enterprise Archetype Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Workstation Shared Drive Sync Center
              </span>
              <span className="text-xs text-slate-400 font-mono">
                企业工作共享盘 · 局域网分布式挂载与素材秒级并网
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              员工电脑工作共享盘素材汇聚与智能入库中心
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              解决软件研发团队、新媒体创意公司等散落在每台员工电脑、剪辑工作站与本地共享盘里的海量零碎素材（代码文档、RFC、爆款视频脚本、文案、设计规范、排版拆解）。
              员工只需在电脑中将素材<strong>随手保存在工作共享盘 (如 Z:\ 盘)</strong>，系统自动监听提取、解构归档并生成标准化 Wiki。
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddDeviceOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>接入新电脑/工位共享盘</span>
            </button>

            <button
              onClick={handleBatchIngestPendingAssets}
              disabled={isBatchIngesting}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isBatchIngesting ? 'animate-spin' : ''}`} />
              <span>
                {isBatchIngesting
                  ? `正在编织入库 (${batchProgress}%)...`
                  : `一键将全员工位素材并入 Wiki (${assets.filter(a => a.syncState === 'pending_ingest').length} 份待入库)`}
              </span>
            </button>
          </div>
        </div>

        {/* Enterprise Industry Archetype Switcher */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>切换企业行业业务形态：</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition ${
                selectedIndustry === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              全量综合视图 (All)
            </button>
            <button
              onClick={() => setSelectedIndustry('media_creative')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                selectedIndustry === 'media_creative'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-rose-300" />
              <span>新媒体与创意公司模式 (短视频/脚本/文案/视觉VI)</span>
            </button>
            <button
              onClick={() => setSelectedIndustry('software_dev')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                selectedIndustry === 'software_dev'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-blue-300" />
              <span>软件研发与技术公司模式 (架构RFC/API契约/SRE应急)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Sync KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold text-slate-700">在线电脑与工作站节点</span>
            <Laptop className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{devices.length}</span>
            <span className="text-xs text-emerald-600 font-bold">● 全部就绪</span>
          </div>
          <p className="text-[11px] text-slate-500">Windows/Mac/Linux 原生挂载</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold text-slate-700">累计汇聚散落素材</span>
            <FolderSync className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600">
              {devices.reduce((acc, d) => acc + d.totalSyncedFiles, 0) + assets.length}
            </span>
            <span className="text-xs text-slate-400">份文件</span>
          </div>
          <p className="text-[11px] text-slate-500">包含文档/脚本/代码/设计规范</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold text-slate-700">待编织入库素材</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-600">
              {assets.filter(a => a.syncState === 'pending_ingest').length}
            </span>
            <span className="text-xs text-slate-400">份待入库</span>
          </div>
          <p className="text-[11px] text-slate-500">已提取文本与分词特征</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold text-slate-700">内网传输平均吞吐</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-blue-600">62.8</span>
            <span className="text-xs text-slate-400">MB/s</span>
          </div>
          <p className="text-[11px] text-slate-500">SMB 3.1.1 + Sync Daemon 加速</p>
        </div>
      </div>

      {/* Workstation Fleet Nodes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-indigo-600" />
              <span>已连接的员工电脑与工作站工作共享盘节点 ({filteredDevices.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              各电脑工作共享盘目录变动实时同步，支持随时断点续传与敏感文件过滤
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(dev => (
            <div
              key={dev.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-indigo-400 transition"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{dev.name}</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{dev.ownerName}</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {dev.os}
                </span>
              </div>

              <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">所属部门:</span>
                  <span className="font-bold text-slate-700">{dev.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">本地映射路径:</span>
                  <span className="font-mono text-indigo-700 truncate max-w-[170px]" title={dev.localMountPath}>
                    {dev.localMountPath}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">局域网 IP / 传输:</span>
                  <span className="font-mono text-slate-600">{dev.ipAddress} · {dev.bandwidthSpeed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-mono">
                  已同步: <strong className="text-slate-900">{dev.totalSyncedFiles}</strong> 份素材
                </span>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  自动编织已开启
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Material Stream: Scattered Assets Ready to Ingest */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <FolderSync className="w-5 h-5 text-indigo-600" />
              <span>工作共享盘散落素材自动汇聚流 (Scattered Materials Hub)</span>
            </h3>
            <p className="text-xs text-slate-500">
              员工在电脑本地共享盘新存入的文件，在此处自动完成文本解析、OCR分词，并由 Agent 织网写入 Wiki。
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索素材名、工位、部门或内容片段..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            全部分类 ({assets.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat} ({assets.filter(a => a.category === cat).length})
            </button>
          ))}
        </div>

        {/* Material Items List */}
        <div className="space-y-4">
          {filteredAssets.map(asset => {
            const isPending = asset.syncState === 'pending_ingest';

            return (
              <div
                key={asset.id}
                className={`p-5 rounded-2xl border transition space-y-3.5 ${
                  isPending
                    ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                    : 'bg-slate-50/60 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      {asset.fileType === 'script' ? (
                        <Film className="w-5 h-5 text-rose-600" />
                      ) : asset.fileType === 'code' ? (
                        <Code className="w-5 h-5 text-blue-600" />
                      ) : asset.fileType === 'design' ? (
                        <Palette className="w-5 h-5 text-purple-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{asset.fileName}</h4>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-700">{asset.deviceName}</span>
                        <span>·</span>
                        <span>{asset.department}</span>
                        <span>·</span>
                        <span>{asset.size}</span>
                        <span>·</span>
                        <span>{asset.modifiedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-white text-indigo-700 px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                      {asset.category}
                    </span>
                    {isPending ? (
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>待编织入库</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>已并入 Wiki</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Snippet */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  <strong className="text-slate-900">📄 自动提取内容摘要：</strong>
                  <span>{asset.snippetPreview}</span>
                </div>

                {/* Generated Wiki Pages Links */}
                {asset.generatedWikiPaths.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-500">已衍生 Wiki 实体:</span>
                    {asset.generatedWikiPaths.map((wikiPath, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateToWikiPage(wikiPath)}
                        className="text-[11px] font-mono bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 flex items-center space-x-1 transition"
                      >
                        <FileCode className="w-3 h-3 text-indigo-500" />
                        <span>{wikiPath}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workstation Mount Protocols & Setup Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>员工电脑本地工作共享盘挂载配置指南</span>
          </h3>
          <p className="text-xs text-slate-500">
            员工无需离开熟悉的日常办公习惯，通过以下 3 种极简方式，直接在电脑操作系统中挂载工作共享盘：
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {WORKSTATION_MOUNT_PROTOCOLS.map(proto => (
            <button
              key={proto.id}
              onClick={() => setActiveProtocolTab(proto.id)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold transition ${
                activeProtocolTab === proto.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {proto.name}
            </button>
          ))}
        </div>

        {/* Protocol Details */}
        {(() => {
          const proto = WORKSTATION_MOUNT_PROTOCOLS.find(p => p.id === activeProtocolTab) || WORKSTATION_MOUNT_PROTOCOLS[0];
          return (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{proto.name}</span>
                  <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    {proto.protocol}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{proto.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  操作步骤指引：
                </h4>
                <div className="space-y-2">
                  {proto.setupSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        0{idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Modal: Add New Workstation Device */}
      {isAddDeviceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <span>接入新员工电脑 / 工作站共享盘</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  注册本地工作目录，自动加入全集团分布式知识汇聚网络
                </p>
              </div>
              <button
                onClick={() => setIsAddDeviceOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">工作站/电脑名称</label>
                <input
                  type="text"
                  placeholder="例如: 策划组小王-爆款文案PC / 架构师MacBook"
                  value={newDeviceName}
                  onChange={e => setNewDeviceName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">使用员工姓名</label>
                  <input
                    type="text"
                    placeholder="例如: 王策划 / 李工程师"
                    value={newDeviceOwner}
                    onChange={e => setNewDeviceOwner(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">所属业务部门</label>
                  <input
                    type="text"
                    placeholder="例如: 短视频运营部 / 基础架构部"
                    value={newDeviceDept}
                    onChange={e => setNewDeviceDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">操作系统平台</label>
                <div className="flex gap-2">
                  {['Windows', 'macOS', 'Linux'].map(os => (
                    <button
                      key={os}
                      type="button"
                      onClick={() => setNewDeviceOS(os as any)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition ${
                        newDeviceOS === os
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {os}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">本地挂载目录 (Local Path)</label>
                <input
                  type="text"
                  placeholder={newDeviceOS === 'Windows' ? 'Z:\\OmniShare\\MyMaterials' : '~/CompanyShare/WorkDocs'}
                  value={newDevicePath}
                  onChange={e => setNewDevicePath(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddDeviceOpen(false)}
                className="text-xs text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleAddNewDevice}
                disabled={!newDeviceName.trim() || !newDeviceOwner.trim()}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认连线并开启监听</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
