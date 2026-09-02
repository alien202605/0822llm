import React, { useState } from 'react';
import {
  BookOpen,
  FileCode,
  Tag,
  Share2,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  Edit3,
  Check,
  Code2,
  ArrowRight,
  Database,
  Lock,
  Sparkles,
  Link as LinkIcon,
  Box,
  AlertTriangle,
  Info,
  Lightbulb
} from 'lucide-react';
import { WikiPage, EntityType, LogEntry } from '../types';

interface WikiNetworkViewProps {
  wikiPages: WikiPage[];
  logs: LogEntry[];
  indexMdContent: string;
  onUpdateWikiPage: (updatedPage: WikiPage) => void;
  onNavigateToRaw: (path: string) => void;
}

export const WikiNetworkView: React.FC<WikiNetworkViewProps> = ({
  wikiPages,
  logs,
  indexMdContent,
  onUpdateWikiPage,
  onNavigateToRaw
}) => {
  const [selectedType, setSelectedType] = useState<EntityType | 'all' | 'index' | 'log'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPagePath, setSelectedPagePath] = useState<string>(wikiPages[0]?.path || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editMarkdown, setEditMarkdown] = useState('');

  const selectedPage = wikiPages.find(p => p.path === selectedPagePath) || wikiPages[0];

  const filteredPages = wikiPages.filter(page => {
    const matchType = selectedType === 'all' || page.frontmatter.type === selectedType;
    const matchSearch =
      page.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.frontmatter.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  // Calculate incoming backlinks for the selected page
  const incomingBacklinks = wikiPages.filter(
    p => p.path !== selectedPage?.path && p.outgoingLinks.includes(selectedPage?.path || '')
  );

  const handleSelectPage = (path: string) => {
    setSelectedPagePath(path);
    setIsEditing(false);
    const target = wikiPages.find(p => p.path === path);
    if (target) {
      setEditMarkdown(target.rawMarkdown);
    }
  };

  const handleStartEdit = () => {
    if (selectedPage) {
      setEditMarkdown(selectedPage.rawMarkdown);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedPage) {
      // Extract outgoing links [[wiki/...]]
      const linkRegex = /\[\[(wiki\/[a-zA-Z0-9_\-\.\/]+)\]\]/g;
      const outgoing: string[] = [];
      let match;
      while ((match = linkRegex.exec(editMarkdown)) !== null) {
        outgoing.push(match[1]);
      }

      const updated: WikiPage = {
        ...selectedPage,
        rawMarkdown: editMarkdown,
        content: editMarkdown.replace(/---[\s\S]*?---/, '').trim(),
        outgoingLinks: Array.from(new Set(outgoing)),
        wordCount: editMarkdown.length
      };

      onUpdateWikiPage(updated);
      setIsEditing(false);
    }
  };

  // Helper to render markdown with clickable [[wiki/...]] links
  const renderInteractiveMarkdown = (text: string) => {
    const parts = text.split(/(\[\[wiki\/[a-zA-Z0-9_\-\.\/]+\]\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkPath = part.slice(2, -2);
        const targetPage = wikiPages.find(p => p.path === linkPath);
        return (
          <span
            key={index}
            onClick={() => handleSelectPage(linkPath)}
            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-[11px] font-semibold border border-indigo-200 cursor-pointer transition mx-0.5 shadow-2xs"
            title={`点击跳转至: ${linkPath}`}
          >
            <LinkIcon className="w-3 h-3 text-indigo-500" />
            <span>{targetPage ? targetPage.frontmatter.title : linkPath.split('/').pop()}</span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Entity Stats Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                Layer 2: wiki/
              </span>
              <span className="text-xs text-slate-500 font-mono">
                5 类企业实体 + index.md / log.md 全局治理
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Wiki 知识网络管理与 Markdown 双链工作台
            </h2>
          </div>

          {/* Search in Wiki */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索 Wiki 实体标题、路径或标签..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Entity Type Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'all', label: '全部 Wiki 实体', count: wikiPages.length },
            { id: 'sop', label: 'SOP 流程', count: wikiPages.filter(p => p.frontmatter.type === 'sop').length },
            { id: 'product', label: 'Product 产品', count: wikiPages.filter(p => p.frontmatter.type === 'product').length },
            { id: 'project', label: 'Project 项目', count: wikiPages.filter(p => p.frontmatter.type === 'project').length },
            { id: 'term', label: 'Term 术语', count: wikiPages.filter(p => p.frontmatter.type === 'term').length },
            { id: 'synthesis', label: 'Synthesis 综述', count: wikiPages.filter(p => p.frontmatter.type === 'synthesis').length },
            { id: 'index', label: 'wiki/index.md', count: 1 },
            { id: 'log', label: 'wiki/log.md', count: logs.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as any)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                selectedType === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedType === tab.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Special Views for index.md and log.md */}
      {selectedType === 'index' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <span>全局一句话索引文件 (wiki/index.md)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                当知识库规模 &lt; 100 篇时，Agent 查询引擎将完整读取本索引感知全局上下文。
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              单行单页标准格式
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {indexMdContent}
          </div>
        </div>
      )}

      {selectedType === 'log' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <span>操作与编译流水日志 (wiki/log.md)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                只追加不覆盖 (Append-Only)，记录每一次 Ingest 编译、Query 反哺与 Lint 巡检自愈历史。
              </p>
            </div>
            <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
              不可篡改审计流
            </span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {logs.map(log => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="font-bold text-indigo-600">[{log.timestamp}]</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{log.source}</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">{log.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {log.targetPages.map((page, i) => (
                    <span key={i} className="text-[10px] font-mono bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {page}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 5-Entity Explorer Layout */}
      {selectedType !== 'index' && selectedType !== 'log' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Entity List (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredPages.map(page => {
              const isSelected = selectedPage?.id === page.id;
              const typeColorMap: Record<EntityType, string> = {
                sop: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                product: 'bg-blue-100 text-blue-800 border-blue-200',
                project: 'bg-purple-100 text-purple-800 border-purple-200',
                term: 'bg-amber-100 text-amber-800 border-amber-200',
                synthesis: 'bg-rose-100 text-rose-800 border-rose-200',
                guide: 'bg-indigo-100 text-indigo-800 border-indigo-200'
              };

              return (
                <div
                  key={page.id}
                  onClick={() => handleSelectPage(page.path)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {page.frontmatter.title}
                    </span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${typeColorMap[page.frontmatter.type]}`}>
                      {page.frontmatter.type}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                    {page.path}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <LinkIcon className="w-3 h-3 text-slate-400" />
                      <span>{page.outgoingLinks.length} 双链</span>
                    </span>
                    <span className="text-slate-400">{page.frontmatter.created_at}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Markdown Reader / Editor & Frontmatter Inspector (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedPage ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
                {/* Top Action Header */}
                <div className="p-6 bg-slate-900 text-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                        {selectedPage.path}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        status: {selectedPage.frontmatter.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const uri = `obsidian://open?vault=${encodeURIComponent('f324a1ec05d72a6f')}&file=${encodeURIComponent(selectedPage.path)}`;
                          navigator.clipboard?.writeText(uri);
                          window.location.href = uri;
                        }}
                        className="flex items-center space-x-1 text-xs bg-purple-900/80 hover:bg-purple-800 text-purple-200 px-3 py-1.5 rounded-lg font-medium border border-purple-700 transition"
                        title="在本地 Obsidian 客户端直接打开此笔记"
                      >
                        <Box className="w-3.5 h-3.5 text-purple-400" />
                        <span>在 Obsidian 中打开</span>
                      </button>

                      {isEditing ? (
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center space-x-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>保存更新</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleStartEdit}
                          className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium border border-slate-700 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>编辑 Markdown</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white">{selectedPage.frontmatter.title}</h3>
                </div>

                {/* YAML Frontmatter Inspector */}
                <div className="px-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center space-x-1.5">
                        <Code2 className="w-4 h-4 text-indigo-600" />
                        <span>YAML Frontmatter 元数据检查</span>
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">.agent/schema.md 规范验证通过</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">实体类别 (type):</span>
                        <span className="font-mono font-bold text-slate-800">{selectedPage.frontmatter.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">创建日期 (created_at):</span>
                        <span className="font-mono text-slate-800">{selectedPage.frontmatter.created_at}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 text-[11px] block">溯源来源 (sources):</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {selectedPage.frontmatter.sources.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => onNavigateToRaw(src)}
                              className="text-[11px] font-mono bg-white text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1 cursor-pointer transition"
                              title="点击前往 Raw 查看不可变原始文件"
                            >
                              <Lock className="w-3 h-3 text-emerald-500" />
                              <span>{src}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedPage.frontmatter.tags && (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center space-x-2 text-xs">
                        <span className="text-slate-400 text-[11px]">标签 (tags):</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedPage.frontmatter.tags.map((t, idx) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 font-mono text-[10px] px-2 py-0.5 rounded-full border border-indigo-200">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Markdown Content Area */}
                <div className="px-6 pb-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Markdown 正文内容 (支持双链交互跳转)</span>
                    <span className="text-slate-400 font-normal font-mono text-[11px]">
                      约 {selectedPage.wordCount} 字
                    </span>
                  </h4>

                  {isEditing ? (
                    <textarea
                      rows={16}
                      value={editMarkdown}
                      onChange={e => setEditMarkdown(e.target.value)}
                      className="w-full text-xs font-mono p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                      {renderInteractiveMarkdown(selectedPage.rawMarkdown)}
                    </div>
                  )}
                </div>

                {/* Backlinks Panel (谁引用了当前页面) */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                      <Share2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>反向链接 (Backlinks) · 引用了本页的实体 ({incomingBacklinks.length})</span>
                    </h4>
                    {incomingBacklinks.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {incomingBacklinks.map((page, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectPage(page.path)}
                            className="text-xs font-mono bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center space-x-1.5 transition"
                          >
                            <span>{page.frontmatter.title}</span>
                            <ArrowRight className="w-3 h-3 text-blue-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        暂无其他 Wiki 页面引用此实体（若为核心页面，可通过 Lint 引擎进行关联优化）。
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                请在左侧选择要查看的 Wiki 实体
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
