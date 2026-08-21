import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  BookOpen,
  Search,
  Activity,
  FileCode2,
  FileText,
  MessageSquare,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Share2,
  HardDrive,
  Box,
  ChevronDown,
  Users,
  Bot,
  Network,
  ClipboardList,
  Menu,
  X,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Scissors,
  Radar,
  Sliders
} from 'lucide-react';
import { TabType, LayoutMode } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  rawCount: number;
  wikiCount: number;
  healthScore: number;
  layoutMode?: LayoutMode;
  onSwitchLayoutMode?: (mode: LayoutMode) => void;
  onOpenQuickIngest?: () => void;
  onOpenQuickSearch?: () => void;
  onOpenIngest?: () => void;
  onOpenSearch?: () => void;
}

interface NavCategoryItem {
  id: TabType;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavCategory {
  id: string;
  title: string;
  roleTag: string;
  roleTagColor: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavCategoryItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  rawCount,
  wikiCount,
  healthScore,
  layoutMode = 'enterprise_hub',
  onSwitchLayoutMode,
  onOpenQuickIngest,
  onOpenQuickSearch,
  onOpenIngest,
  onOpenSearch
}) => {
  const triggerIngest = onOpenIngest || onOpenQuickIngest;
  const triggerSearch = onOpenSearch || onOpenQuickSearch;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4 Core Enterprise Knowledge Base Categories (All titles, tags, and items exactly 4 characters)
  const categories: NavCategory[] = [
    {
      id: 'employee-hub',
      title: '协同维护',
      roleTag: '协同维护',
      roleTagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Users,
      items: [
        {
          id: 'drive',
          label: '工位共享盘',
          subLabel: 'Z:\\ 盘/工位素材秒级提取与多源编织并网',
          icon: HardDrive,
          badge: '实时并网',
          badgeColor: 'bg-indigo-900 text-indigo-200 border-indigo-700'
        },
        {
          id: 'clipper',
          label: '飞书剪藏',
          subLabel: '飞书/浏览器插件/公开URL全自动并网',
          icon: Scissors,
          badge: '自动剪藏',
          badgeColor: 'bg-sky-900 text-sky-200 border-sky-700'
        },
        {
          id: 'raw',
          label: '原始文档库',
          subLabel: '不可变原始文件层 · 会议纪要/PDF/飞书文档',
          icon: FileText,
          badge: `${rawCount} 份`,
          badgeColor: 'bg-emerald-900 text-emerald-200 border-emerald-700'
        },
        {
          id: 'wiki',
          label: '百科实体网',
          subLabel: 'SOP/产品/项目/术语多页协同维护与双链',
          icon: BookOpen,
          badge: `${wikiCount} 篇`,
          badgeColor: 'bg-blue-900 text-blue-200 border-blue-700'
        }
      ]
    },
    {
      id: 'ai-engine-hub',
      title: '智能驱动',
      roleTag: '智能驱动',
      roleTagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Bot,
      items: [
        {
          id: 'realtime',
          label: '实时情报流',
          subLabel: '8 步动态 Refresh 流水线 · 实时情报与 MCP 底座',
          icon: Activity,
          badge: '动态流',
          badgeColor: 'bg-amber-900 text-amber-200 border-amber-700'
        },
        {
          id: 'obsidian',
          label: 'Obsidian Vault',
          subLabel: 'Agent 调用 Vault API、Canvas 白板与 Dataview',
          icon: Box,
          badge: 'Vault API',
          badgeColor: 'bg-purple-900 text-purple-200 border-purple-700'
        },
        {
          id: 'search',
          label: 'qmd 混合检索',
          subLabel: '本地 BM25 + 向量语义检索与出处溯源',
          icon: Search,
          badge: 'BM25+向量',
          badgeColor: 'bg-indigo-900 text-indigo-200 border-indigo-700'
        },
        {
          id: 'lint',
          label: '健康巡检自愈',
          subLabel: '双链死链排查、矛盾冲突消歧与自动修复补丁',
          icon: Activity,
          badge: `${healthScore}分`,
          badgeColor: 'bg-rose-900 text-rose-200 border-rose-700'
        },
        {
          id: 'bot',
          label: 'IM 机器人',
          subLabel: '飞书/企微/钉钉智能助理交互与知识反哺',
          icon: MessageSquare,
          badge: 'IM 终端',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        },
        {
          id: 'intelligence',
          label: '新增来源',
          subLabel: '合规公开情报中心 · 5大采集引擎 · 9步数据流水线',
          icon: Radar,
          badge: '情报雷达',
          badgeColor: 'bg-cyan-900 text-cyan-200 border-cyan-700'
        }
      ]
    },
    {
      id: 'graph-topology-hub',
      title: '图谱全景',
      roleTag: '图谱全景',
      roleTagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Network,
      items: [
        {
          id: 'graph',
          label: '双链知识图谱',
          subLabel: '探索实体双链交织网络与高密度知识集群',
          icon: Share2,
          badge: '动态图谱',
          badgeColor: 'bg-blue-900 text-blue-200 border-blue-700'
        },
        {
          id: 'overview',
          label: '系统拓扑大盘',
          subLabel: '3 层存储 × 3 大引擎 × 2 类终端全局运行大盘',
          icon: Layers,
          badge: '全景拓扑',
          badgeColor: 'bg-indigo-900 text-indigo-200 border-indigo-700'
        }
      ]
    },
    {
      id: 'governance-prd-hub',
      title: '治理规划',
      roleTag: '治理规划',
      roleTagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: ClipboardList,
      items: [
        {
          id: 'console',
          label: '控制中枢',
          subLabel: '三大闭环开关矩阵、3-Layer 拓扑、HITL 审批与 DQL 沙箱',
          icon: Sliders,
          badge: '开关矩阵',
          badgeColor: 'bg-indigo-900 text-indigo-200 border-indigo-700'
        },
        {
          id: 'schema',
          label: '规范 Schema',
          subLabel: '.agent/schema.md 实体定义与 YAML 字段约束',
          icon: ShieldCheck,
          badge: '规范',
          badgeColor: 'bg-amber-900 text-amber-200 border-amber-700'
        },
        {
          id: 'planning',
          label: '架构规划 PRD',
          subLabel: '企业知识库 10 大核心模块 PRD 说明书与接口清单',
          icon: FileCode2,
          badge: 'PRD 蓝图',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        }
      ]
    }
  ];

  // Helper to check if current active tab is in a category
  const isCategoryActive = (category: NavCategory) => {
    return category.items.some(item => item.id === currentTab);
  };

  const handleSelectItem = (tabId: TabType) => {
    onTabChange(tabId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleSelectItem('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 flex items-center justify-center shadow-inner shadow-white/20 shrink-0">
              <Box className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">
                  agent alien 知识库
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-medium border border-purple-500/30">
                  Obsidian & Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                企业级 LLM 知识库 · 分类下拉导航系统
              </p>
            </div>
          </div>

          {/* Center Navigation: Categorized Dropdown Menus (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            {categories.map(category => {
              const CategoryIcon = category.icon;
              const isActive = isCategoryActive(category);
              const isOpen = openDropdown === category.id;

              return (
                <div key={category.id} className="relative">
                  {/* Dropdown Button */}
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : category.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/90 text-white shadow-sm ring-1 ring-indigo-400/40'
                        : isOpen
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <CategoryIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                    <span className="font-bold whitespace-nowrap">{category.title}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Box */}
                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                      {/* Dropdown Header with Role Tag */}
                      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {category.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${category.roleTagColor}`}
                        >
                          {category.roleTag}
                        </span>
                      </div>

                      {/* Dropdown Items List */}
                      <div className="space-y-1 pt-1">
                        {category.items.map(item => {
                          const ItemIcon = item.icon;
                          const isItemActive = currentTab === item.id;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectItem(item.id)}
                              className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-3 ${
                                isItemActive
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'hover:bg-slate-800/90 text-slate-300 hover:text-white group'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  isItemActive
                                    ? 'bg-indigo-700 text-white'
                                    : 'bg-slate-800 text-indigo-400 group-hover:bg-slate-700'
                                }`}
                              >
                                <ItemIcon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                   <span className="font-bold text-xs whitespace-nowrap">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ml-1.5 shrink-0 ${
                                        isItemActive
                                          ? 'bg-indigo-800 text-white border-indigo-500'
                                          : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-[11px] truncate mt-0.5 ${
                                    isItemActive ? 'text-indigo-100' : 'text-slate-400 group-hover:text-slate-300'
                                  }`}
                                >
                                  {item.subLabel}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Layout Style Switcher Button */}
            {onSwitchLayoutMode && (
              <div className="hidden lg:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
                <button
                  onClick={() => onSwitchLayoutMode('craft_doc')}
                  className={`px-2.5 py-1 rounded-md transition font-medium ${
                    layoutMode === 'craft_doc'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="切换为：现代简约文档排版风格 (参考设计)"
                >
                  📑 现代文档
                </button>
                <button
                  onClick={() => onSwitchLayoutMode('enterprise_hub')}
                  className={`px-2.5 py-1 rounded-md transition font-medium ${
                    layoutMode === 'enterprise_hub'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="切换为：企业工程大盘排版风格"
                >
                  🎛️ 工程大屏
                </button>
              </div>
            )}

            {/* Quick Obsidian Vault Button */}
            <button
              onClick={() => handleSelectItem('obsidian')}
              className="hidden sm:flex items-center space-x-1.5 text-xs bg-purple-950/80 hover:bg-purple-900 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-700/60 transition"
              title="查看 Obsidian Vault 与 REST API"
            >
              <Box className="w-3.5 h-3.5 text-purple-400" />
              <span>Vault 状态</span>
            </button>

            {triggerSearch && (
              <button
                onClick={triggerSearch}
                className="hidden md:flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                title="即席 qmd 检索"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span>qmd 搜索</span>
              </button>
            )}

            {triggerIngest && (
              <button
                onClick={triggerIngest}
                className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition shadow-emerald-950"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>采集编译</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Current Active Breadcrumb / Module Sub-bar */}
        <div className="hidden lg:flex items-center justify-between py-1.5 px-1 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">当前模块：</span>
            {categories.map(cat => {
              const item = cat.items.find(i => i.id === currentTab);
              if (item) {
                return (
                  <span key={cat.id} className="flex items-center space-x-1.5">
                    <span className="text-indigo-400 font-bold whitespace-nowrap">{cat.title}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-200 font-bold whitespace-nowrap">{item.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${cat.roleTagColor}`}>
                      {cat.roleTag}
                    </span>
                  </span>
                );
              }
              return null;
            })}
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Obsidian Core + qmd 引擎就绪</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">健康分: {healthScore}/100</span>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Accordion */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-4 max-h-[80vh] overflow-y-auto">
            {categories.map(category => (
              <div key={category.id} className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
                    <category.icon className="w-4 h-4" />
                    <span>{category.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${category.roleTagColor}`}>
                    {category.roleTag}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {category.items.map(item => {
                    const isItemActive = currentTab === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                          isItemActive
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <ItemIcon className="w-4 h-4 text-indigo-400" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                              isItemActive
                                ? 'bg-indigo-700 text-white border-indigo-500'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
