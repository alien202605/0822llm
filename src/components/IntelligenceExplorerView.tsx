import React, { useState } from 'react';
import {
  Radar,
  Radio,
  Bot,
  FileText,
  Settings,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  ShieldCheck,
  Database,
  TrendingUp,
  Clock,
  ExternalLink,
  Plus,
  Play,
  Pause,
  Lock,
  Monitor,
  Code2,
  Globe,
  Scissors,
  Sparkles,
  Layers,
  Brain,
  Activity,
  Scale
} from 'lucide-react';

export const IntelligenceExplorerView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'radar' | 'sources' | 'pipeline'>('radar');
  const [isCollecting, setIsCollecting] = useState(false);

  const complianceRules = [
    { icon: ShieldCheck, title: 'robots.txt 合规', desc: '严格遵守 robots.txt 协议，拒绝任何越权爬取行为', status: 'active' },
    { icon: Lock, title: '公开数据原则', desc: '仅采集互联网公开数据、官方 RSS、开放 API 与授权文档', status: 'active' },
    { icon: Scale, title: '隐私法案遵守', desc: '不采集个人隐私信息，符合 GDPR / 个保法要求', status: 'active' },
    { icon: AlertCircle, title: '零社工窃密', desc: '拒绝密码破解、社工手段，仅使用合法公开渠道', status: 'active' }
  ];

  const collectMethods = [
    {
      id: 'rss',
      icon: Radio,
      title: 'RSS / Atom / WebSub 订阅流',
      desc: '科技媒体、开源社区 (GitHub Releases)、政策公告、行业博客',
      status: 'ready',
      rate: '320 req/min'
    },
    {
      id: 'browser',
      icon: Monitor,
      title: 'Headless Browser 动态抓取',
      desc: 'Puppeteer/Playwright 支持 JS 渲染、自动滚动、截图、DOM 提取',
      status: 'ready',
      rate: '180 doc/min'
    },
    {
      id: 'api',
      icon: Code2,
      title: '官方开放 API & Webhook',
      desc: 'GitHub 仓库动态、飞书/钉钉多维表格、专利数据库、开源情报 API',
      status: 'ready',
      rate: '实时推送'
    },
    {
      id: 'pdf',
      icon: FileText,
      title: 'PDF / 研报 / OCR 识别',
      desc: '行业研报、扫描版招股书、政策红头文件图像 → 结构化 Markdown',
      status: 'ready',
      rate: '95% 准确率'
    },
    {
      id: 'agent',
      icon: Bot,
      title: '大模型 Agent 深度探索',
      desc: 'LLM 驱动探索代理，自主分析页面链接、规划点击路径、提炼结论',
      status: 'testing',
      rate: '复杂场景'
    }
  ];

  const pipelineSteps = [
    { step: 1, name: '互联网公开数据', icon: Globe, color: 'text-slate-600', desc: '网页、RSS、API、文档、多媒体流' },
    { step: 2, name: '持续采集调度', icon: Radio, color: 'text-blue-600', desc: 'Cron / Webhook / 多线程轮询' },
    { step: 3, name: '正文提取', icon: Scissors, color: 'text-indigo-600', desc: 'Boilerplate Removal / Readability' },
    { step: 4, name: '内容清洗', icon: Sparkles, color: 'text-purple-600', desc: 'Markdown 标准化 & 去重' },
    { step: 5, name: 'AI 分类', icon: Layers, color: 'text-amber-600', desc: 'Gemini 多维标签体系' },
    { step: 6, name: '事件抽取', icon: Zap, color: 'text-orange-600', desc: '实体/情感/里程碑提取' },
    { step: 7, name: '知识入库', icon: Database, color: 'text-emerald-600', desc: 'Git / Markdown / Frontmatter' },
    { step: 8, name: 'Embedding', icon: Brain, color: 'text-cyan-600', desc: '语义向量索引构建' },
    { step: 9, name: 'Agent 调用', icon: Bot, color: 'text-rose-600', desc: '实时检索注入 Prompt 决策' }
  ];

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">情报探索器</h1>
            <p className="text-xs text-slate-500">Intelligence Explorer · 合法合规公开情报中心</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          面向现代企业的合法合规公开情报中心，致力于自动化汇聚行业动态、竞争对手动向、技术标准演进及政策法规信息，为企业决策层与 AI Agent 提供高质量上下文。
        </p>
      </div>

      {/* Compliance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">合规铁律</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {complianceRules.map((rule, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs">
              <rule.icon className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-900">{rule.title}</div>
                <div className="text-emerald-700/70 leading-snug">{rule.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: 'radar' as const, label: '📡 情报雷达看板', icon: Activity },
          { id: 'sources' as const, label: '🔌 采集引擎配置', icon: Settings },
          { id: 'pipeline' as const, label: '⚙️ 9步数据流水线', icon: Zap }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeSection === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Section: Radar Dashboard */}
      {activeSection === 'radar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>情报雷达看板</span>
            </h2>
            <button
              onClick={() => setIsCollecting(v => !v)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isCollecting
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }`}
            >
              {isCollecting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isCollecting ? '停止采集' : '启动采集'}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '今日采集事件', value: '1,247', change: '+12.3%', color: 'text-cyan-600' },
              { label: '热点趋势项', value: '38', change: '+5', color: 'text-amber-600' },
              { label: '风险预警', value: '3', change: '-2', color: 'text-red-600' },
              { label: '已入库文档', value: '8,432', change: '+156', color: 'text-emerald-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">{stat.label}</div>
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-slate-400">{stat.change} 今日</div>
              </div>
            ))}
          </div>

          {/* Intelligence Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">最新情报流</h3>
            {[
              { type: 'tech', title: 'Gemini 2.5 Pro 正式发布，多模态能力再升级', time: '12 分钟前', source: 'Google AI Blog', importance: 'high' },
              { type: 'policy', title: '《生成式人工智能服务管理暂行办法》实施细则征求意见稿发布', time: '1 小时前', source: '国家网信办', importance: 'critical' },
              { type: 'market', title: 'OpenAI GPT-5 训练规模披露：超 10^26 FLOPs', time: '2 小时前', source: 'arXiv 论文', importance: 'high' },
              { type: 'tech', title: 'GitHub Copilot 商业版新增企业级合规审计功能', time: '3 小时前', source: 'GitHub Blog', importance: 'medium' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start space-x-3 hover:border-cyan-300 transition cursor-pointer">
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                  item.importance === 'critical' ? 'bg-red-500' :
                  item.importance === 'high' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      item.type === 'policy' ? 'bg-red-100 text-red-700' :
                      item.type === 'tech' ? 'bg-cyan-100 text-cyan-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.type === 'policy' ? '政策' : item.type === 'tech' ? '技术' : '市场'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.source}</span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" /><span>{item.time}</span>
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Sources Configuration */}
      {activeSection === 'sources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-cyan-600" />
              <span>采集引擎配置台</span>
            </h2>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-700 transition">
              <Plus className="w-3.5 h-3.5" />
              <span>添加新源</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collectMethods.map(method => (
              <div key={method.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 hover:border-cyan-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <method.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{method.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{method.rate}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    method.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {method.status === 'ready' ? '就绪' : '测试中'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{method.desc}</p>
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <button className="text-[11px] text-cyan-600 hover:text-cyan-800 font-semibold">配置规则</button>
                  <span className="text-slate-300">|</span>
                  <button className="text-[11px] text-slate-500 hover:text-slate-700">查看日志</button>
                  <span className="text-slate-300">|</span>
                  <button className="text-[11px] text-slate-500 hover:text-red-600">删除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Pipeline */}
      {activeSection === 'pipeline' && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-600" />
            <span>9 步情报数据加工与沉淀流水线</span>
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            {pipelineSteps.map((step, idx) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    step.color.replace('text-', 'bg-').replace('/60', '/80')
                  }`}>
                    {step.step}
                  </div>
                  {idx < pipelineSteps.length - 1 && (
                    <div className="w-0.5 h-8 bg-slate-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center space-x-2">
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                    <span className="text-sm font-bold text-slate-900">{step.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 border border-cyan-200 rounded-xl p-4 flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-cyan-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-cyan-900">流水线状态：健康运行</div>
              <div className="text-[11px] text-cyan-700 mt-0.5">平均处理时延 820ms · 吞吐 320 req/min · 零错误率</div>
            </div>
            <RefreshCw className="w-4 h-4 text-cyan-400 ml-auto animate-spin-slow" />
          </div>
        </div>
      )}
    </div>
  );
};
