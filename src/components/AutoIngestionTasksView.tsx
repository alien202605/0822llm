import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Bot, Clock, RefreshCw, Play, Pause, Plus, Settings2,
  ExternalLink, CheckCircle2, AlertCircle, Trash2, Edit3, Filter,
  Search, ArrowRight, Zap, Check, Flame, TrendingUp, BookOpen, Code2,
  Terminal, Globe, Database, ShieldCheck, ChevronRight, Layers, FileText,
  Copy, FolderPlus, Radio, Cpu, X, Tag, Download, UploadCloud, PlayCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AutoIngestTask, OpenSourceConnector, RawDocument, WikiPage } from '../types';
import { OPEN_SOURCE_CONNECTORS, INITIAL_AUTO_TASKS } from '../data/autoTasksData';

interface AutoIngestionTasksViewProps {
  onAddRawDoc?: (doc: RawDocument, wikiPages: WikiPage[]) => void;
  onNavigateToWikiPage?: (path: string) => void;
  onNavigateToRaw?: (path: string) => void;
}

const STORAGE_KEY = 'obsidian_auto_tasks_v1';

export const AutoIngestionTasksView: React.FC<AutoIngestionTasksViewProps> = ({
  onAddRawDoc,
  onNavigateToWikiPage,
  onNavigateToRaw
}) => {
  // Initialize tasks from localStorage or default
  const [tasks, setTasks] = useState<AutoIngestTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load auto tasks from storage, using initial data");
    }
    return INITIAL_AUTO_TASKS;
  });

  const [connectors] = useState<OpenSourceConnector[]>(OPEN_SOURCE_CONNECTORS);
  const [activeTab, setActiveTab] = useState<'tasks' | 'connectors' | 'scheduler'>('tasks');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected task for inspection/run
  const [activeTask, setActiveTask] = useState<AutoIngestTask | null>(tasks[0] || null);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [runSuccessToast, setRunSuccessToast] = useState<{ show: boolean; msg: string; isError?: boolean } | null>(null);

  // Background Auto-Scheduler Daemon state
  const [schedulerEnabled, setSchedulerEnabled] = useState<boolean>(false);
  const [schedulerIntervalMinutes, setSchedulerIntervalMinutes] = useState<number>(5);
  const [schedulerCountdown, setSchedulerCountdown] = useState<number>(300);
  const schedulerTimerRef = useRef<any>(null);

  // New / Edit task modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Modal Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('科技新闻');
  const [formConnectorId, setFormConnectorId] = useState('rsshub');
  const [formEndpoint, setFormEndpoint] = useState('https://rsshub.app/36kr/newsflashes');
  const [formCronSchedule, setFormCronSchedule] = useState('每 30 分钟');
  const [formKeywords, setFormKeywords] = useState('AI, Agent, 大模型, 开源, 算力');
  const [formAiPrompt, setFormAiPrompt] = useState('提取该信息源核心事实要点，指出涉及主体、创新突破与业务影响，并自动生成双链。');
  const [formAutoWiki, setFormAutoWiki] = useState(true);
  const [formRawFolder, setFormRawFolder] = useState('raw/auto-tasks/');
  const [formWikiFolder, setFormWikiFolder] = useState('wiki/intelligence/');

  // Modal test endpoint state
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs?: number; msg?: string; preview?: string } | null>(null);

  // Connector details modal
  const [selectedConnectorForDoc, setSelectedConnectorForDoc] = useState<OpenSourceConnector | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Save tasks to localStorage on change
  const saveTasks = (newTasks: AutoIngestTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.warn("Failed to persist auto tasks to storage:", e);
    }
  };

  // Stats calculation
  const activeCount = tasks.filter(t => t.status === 'active').length;
  const totalFetched = tasks.reduce((sum, t) => sum + t.totalFetchedItems, 0);
  const totalWikiCompiled = tasks.reduce((sum, t) => sum + t.totalCompiledWiki, 0);

  // Live Background Auto-Scheduler Daemon
  useEffect(() => {
    if (!schedulerEnabled) {
      if (schedulerTimerRef.current) clearInterval(schedulerTimerRef.current);
      return;
    }

    setSchedulerCountdown(schedulerIntervalMinutes * 60);

    const intervalId = setInterval(() => {
      setSchedulerCountdown(prev => {
        if (prev <= 1) {
          // Trigger execution of first active task in round-robin
          const activeTasksList = tasks.filter(t => t.status === 'active');
          if (activeTasksList.length > 0) {
            const randomTask = activeTasksList[Math.floor(Math.random() * activeTasksList.length)];
            executeTaskAsync(randomTask, true);
          }
          return schedulerIntervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    schedulerTimerRef.current = intervalId;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [schedulerEnabled, schedulerIntervalMinutes, tasks]);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.connectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keywordsFilter.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle Toggle status
  const handleToggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tasks.map(t =>
      t.id === id ? { ...t, status: (t.status === 'active' ? 'paused' : 'active') as 'active' | 'paused' } : t
    );
    saveTasks(updated);
    if (activeTask?.id === id) {
      const current = updated.find(t => t.id === id);
      if (current) setActiveTask(current);
    }
  };

  // Handle Delete task
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除该自动化任务吗？')) {
      const updated = tasks.filter(t => t.id !== id);
      saveTasks(updated);
      if (activeTask?.id === id) {
        setActiveTask(updated[0] || null);
      }
    }
  };

  // Core Real Async Execution Logic
  const executeTaskAsync = async (task: AutoIngestTask, isSilentBackground = false): Promise<boolean> => {
    try {
      if (!isSilentBackground) setRunningTaskId(task.id);

      const res = await fetch('/api/auto-tasks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '执行自动化采集任务失败');
      }

      // Live Weaving: Push raw document and compiled wiki pages into central knowledge state
      if (data.rawDocument && data.wikiPages && onAddRawDoc) {
        onAddRawDoc(data.rawDocument, data.wikiPages);
      }

      const newArticles = data.articles || [];
      const newArticlesCount = data.articlesCount || newArticles.length;
      const newWikiCount = data.wikiPages ? data.wikiPages.length : 0;
      const logMsg = data.logMessage || `[${new Date().toLocaleTimeString()}] 成功采集 ${newArticlesCount} 篇新线索，已编织入 ${newWikiCount} 篇 Wiki 词条`;

      // Update Task in state and storage
      setTasks(prev => {
        const updatedList = prev.map(t => {
          if (t.id === task.id) {
            const updated: AutoIngestTask = {
              ...t,
              lastRunTime: '刚刚 (实时已完成)',
              nextRunTime: t.cronSchedule,
              totalFetchedItems: t.totalFetchedItems + newArticlesCount,
              totalCompiledWiki: t.totalCompiledWiki + newWikiCount,
              latestLogs: [logMsg, ...(t.latestLogs || []).slice(0, 6)],
              sampleRecentArticles: [...newArticles, ...(t.sampleRecentArticles || [])].slice(0, 8)
            };
            return updated;
          }
          return t;
        });
        saveTasks(updatedList);
        const newlyUpdated = updatedList.find(t => t.id === task.id);
        if (newlyUpdated && (!activeTask || activeTask.id === task.id)) {
          setActiveTask(newlyUpdated);
        }
        return updatedList;
      });

      if (!isSilentBackground) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 }
        });

        setRunSuccessToast({
          show: true,
          msg: `任务「${task.name}」抓取成功！捕获 ${newArticlesCount} 条高价值信息，已生成 Wiki 词条。`
        });
        setTimeout(() => setRunSuccessToast(null), 4500);
      }

      return true;
    } catch (error: any) {
      console.error("[Auto-Tasks Error]:", error);
      if (!isSilentBackground) {
        setRunSuccessToast({
          show: true,
          msg: `任务执行失败: ${error.message || '网络连接超时'}`,
          isError: true
        });
        setTimeout(() => setRunSuccessToast(null), 5000);
      }
      return false;
    } finally {
      if (!isSilentBackground) setRunningTaskId(null);
    }
  };

  // Trigger Immediate Run for single task
  const handleRunTaskNow = (task: AutoIngestTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTask(task);
    executeTaskAsync(task, false);
  };

  // Batch Run All Active Tasks
  const handleBatchRunAll = async () => {
    const activeTasks = tasks.filter(t => t.status === 'active');
    if (activeTasks.length === 0) {
      alert('当前没有处于「运行中」状态的自动化任务，请先启用或新建任务。');
      return;
    }

    setBatchRunning(true);
    setBatchProgress({ current: 0, total: activeTasks.length });

    for (let i = 0; i < activeTasks.length; i++) {
      setBatchProgress({ current: i + 1, total: activeTasks.length });
      await executeTaskAsync(activeTasks[i], true);
      // Small pause between parallel tasks
      await new Promise(r => setTimeout(r, 600));
    }

    setBatchRunning(false);
    setBatchProgress(null);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 }
    });

    setRunSuccessToast({
      show: true,
      msg: `批量运行完成！共执行 ${activeTasks.length} 个活跃采集流，全部线索已并网编织入 Obsidian 知识库。`
    });
    setTimeout(() => setRunSuccessToast(null), 5000);
  };

  // Test Endpoint in modal
  const handleTestEndpoint = async () => {
    if (!formEndpoint.trim()) return;
    setTestingEndpoint(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/auto-tasks/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: formEndpoint.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          latencyMs: data.latencyMs,
          msg: `连通性正常 (${data.status} ${data.statusText || 'OK'} | 耗时 ${data.latencyMs}ms | ${data.contentType || 'text/xml'})`,
          preview: data.preview ? `${data.preview.slice(0, 180)}...` : undefined
        });
      } else {
        setTestResult({
          success: false,
          latencyMs: data.latencyMs,
          msg: `端点响应异常: ${data.error || '无法访问上游目标'}`
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: `连接异常: ${err.message || '网络连接超时'}`
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = (connector?: OpenSourceConnector) => {
    setModalMode('create');
    setEditingTaskId(null);
    setTestResult(null);

    if (connector) {
      setFormConnectorId(connector.id);
      setFormName(`基于 ${connector.name.split(' ')[0]} 的信息流`);
      setFormEndpoint(connector.sampleEndpoint);
      if (connector.category === 'finance') setFormCategory('金融财经');
      else if (connector.category === 'hot_topics') setFormCategory('舆情聚合');
      else if (connector.category === 'social_media') setFormCategory('深度研报');
      else setFormCategory('科技新闻');
    } else {
      setFormName('新中文信息自动化采集任务');
      setFormCategory('科技新闻');
      setFormConnectorId('rsshub');
      setFormEndpoint('https://rsshub.app/36kr/newsflashes');
    }
    setFormCronSchedule('每 30 分钟');
    setFormKeywords('AI, Agent, 知识库, 行业洞察');
    setFormAiPrompt('提取该信息源核心事实要点，指出涉及主体、创新突破与业务影响，并自动生成双链。');
    setFormAutoWiki(true);
    setFormRawFolder('raw/auto-tasks/');
    setFormWikiFolder('wiki/intelligence/');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (task: AutoIngestTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode('edit');
    setEditingTaskId(task.id);
    setTestResult(null);
    setFormName(task.name);
    setFormCategory(task.category);
    setFormConnectorId(task.connectorId);
    setFormEndpoint(task.targetEndpoint);
    setFormCronSchedule(task.cronSchedule);
    setFormKeywords(task.keywordsFilter.join(', '));
    setFormAiPrompt(task.aiSummaryPrompt);
    setFormAutoWiki(task.autoCompileToWiki);
    setFormRawFolder(task.targetRawFolder);
    setFormWikiFolder(task.targetWikiFolder);
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = () => {
    if (!formName.trim()) return;

    const matchedConnector = connectors.find(c => c.id === formConnectorId);
    const keywordsArray = formKeywords.split(/[,，]/).map(k => k.trim()).filter(Boolean);

    if (modalMode === 'create') {
      const newTask: AutoIngestTask = {
        id: `task-${Date.now()}`,
        name: formName,
        category: formCategory,
        connectorId: formConnectorId,
        connectorName: matchedConnector ? matchedConnector.name.split(' ')[0] : '开源工具',
        icon: 'Sparkles',
        status: 'active',
        cronSchedule: formCronSchedule,
        lastRunTime: '未运行',
        nextRunTime: formCronSchedule,
        totalFetchedItems: 0,
        totalCompiledWiki: 0,
        targetEndpoint: formEndpoint,
        keywordsFilter: keywordsArray.length > 0 ? keywordsArray : ['全部'],
        aiSummaryPrompt: formAiPrompt,
        autoCompileToWiki: formAutoWiki,
        targetRawFolder: formRawFolder,
        targetWikiFolder: formWikiFolder,
        latestLogs: [`[${new Date().toLocaleTimeString()}] 任务已创建，准备就绪`],
        sampleRecentArticles: []
      };

      const updated = [newTask, ...tasks];
      saveTasks(updated);
      setActiveTask(newTask);
    } else if (modalMode === 'edit' && editingTaskId) {
      const updated = tasks.map(t => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            name: formName,
            category: formCategory,
            connectorId: formConnectorId,
            connectorName: matchedConnector ? matchedConnector.name.split(' ')[0] : t.connectorName,
            targetEndpoint: formEndpoint,
            cronSchedule: formCronSchedule,
            keywordsFilter: keywordsArray.length > 0 ? keywordsArray : ['全部'],
            aiSummaryPrompt: formAiPrompt,
            autoCompileToWiki: formAutoWiki,
            targetRawFolder: formRawFolder,
            targetWikiFolder: formWikiFolder
          };
        }
        return t;
      });
      saveTasks(updated);
      const current = updated.find(t => t.id === editingTaskId);
      if (current) setActiveTask(current);
    }

    setIsModalOpen(false);
  };

  // Export JSON
  const handleExportTasks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `obsidian_auto_tasks_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn pb-32">
      {/* Toast Notification */}
      {runSuccessToast && (
        <div className={`fixed top-6 right-6 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center space-x-3 animate-slideDown ${
          runSuccessToast.isError
            ? 'bg-rose-900 border-rose-700'
            : 'bg-slate-900 border-slate-700'
        }`}>
          {runSuccessToast.isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-relaxed">{runSuccessToast.msg}</span>
        </div>
      )}

      {/* Top Banner with Stats & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-mono border border-indigo-500/30">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>GITHUB CHINESE OPEN-SOURCE INFO AUTOMATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              自动任务 · 中文开源信息获取中枢
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              汇聚 GitHub 最强大的中文开源信息采集与订阅软件（RSSHub、今日热榜 API、AkShare、Wechat-Feeds、Crawl4AI 等），支持定时轮询、Agent 智能提炼、去噪去重与全自动编织入知识库。
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenCreateModal()}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新建自动任务</span>
            </button>
            <button
              onClick={handleBatchRunAll}
              disabled={batchRunning}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl transition border cursor-pointer ${
                batchRunning
                  ? 'bg-amber-600/30 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-sm'
              }`}
            >
              {batchRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>批量运行中 ({batchProgress?.current}/{batchProgress?.total})...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>批量运行所有活跃任务</span>
                </>
              )}
            </button>
            <button
              onClick={handleExportTasks}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl transition border border-white/10"
              title="导出任务配置 (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Statistics Cards & Live Scheduler Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-slate-200">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>活跃自动化任务</span>
            </div>
            <div className="text-xl font-bold text-white">
              {activeCount} <span className="text-xs font-normal text-slate-400">/ {tasks.length}</span>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>累计获取信息线索</span>
            </div>
            <div className="text-xl font-bold text-white">{totalFetched} 条</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>自动沉淀 Wiki 词条</span>
            </div>
            <div className="text-xl font-bold text-white">{totalWikiCompiled} 篇</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>后台定时调度引擎</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                schedulerEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
              }`}>
                {schedulerEnabled ? `● 运行中 (${schedulerCountdown}s)` : '○ 已休眠'}
              </span>
              <button
                onClick={() => setSchedulerEnabled(!schedulerEnabled)}
                className="text-[10px] text-indigo-300 hover:text-white underline"
              >
                {schedulerEnabled ? '暂停' : '启用'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>我的自动化任务 ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'connectors'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>GitHub 开源软件库 ({connectors.length})</span>
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索任务或关键词..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
              />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: TASKS LIST */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>分类筛选:</span>
            </span>
            {['all', '科技新闻', '舆情聚合', '金融财经', '深度研报', '代码前沿'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? '全部任务' : cat}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Task Cards List */}
            <div className="lg:col-span-7 space-y-3.5">
              {filteredTasks.map(task => {
                const isSelected = activeTask?.id === task.id;
                const isRunning = runningTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => setActiveTask(task)}
                    className={`p-5 rounded-2xl border transition cursor-pointer relative bg-white shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              task.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {task.status === 'active' ? '● 调度运行中' : '○ 已暂停'}
                          </span>
                          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {task.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {task.connectorName}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 truncate">{task.name}</h3>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          URL/API: {task.targetEndpoint}
                        </p>
                      </div>

                      {/* Run button */}
                      <button
                        onClick={e => handleRunTaskNow(task, e)}
                        disabled={isRunning}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
                          isRunning
                            ? 'bg-indigo-100 text-indigo-700 animate-pulse cursor-wait'
                            : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs'
                        }`}
                        title="立即执行此任务并拉取最新信息"
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>抓取编织中...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>立即运行</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Keywords tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-slate-100 items-center justify-between text-xs text-slate-500">
                      <div className="flex flex-wrap gap-1 items-center">
                        <Tag className="w-3 h-3 text-slate-400 mr-0.5" />
                        {task.keywordsFilter.slice(0, 4).map((kw, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] font-medium text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.cronSchedule}</span>
                        </span>
                        <span>累计 {task.totalFetchedItems} 条</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">暂无匹配的自动信息获取任务</p>
                  <button
                    onClick={() => handleOpenCreateModal()}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    立即创建第一个任务
                  </button>
                </div>
              )}
            </div>

            {/* Right: Selected Task Details & Live Feed Inspection */}
            <div className="lg:col-span-5">
              {activeTask ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5 sticky top-4">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{activeTask.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                        <span>上次运行: {activeTask.lastRunTime}</span>
                        <span>•</span>
                        <span>周期: {activeTask.cronSchedule}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={e => handleOpenEditModal(activeTask, e)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="编辑任务"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => handleToggleTask(activeTask.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          activeTask.status === 'active'
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={activeTask.status === 'active' ? '暂停任务' : '启动任务'}
                      >
                        {activeTask.status === 'active' ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={e => handleDeleteTask(activeTask.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="删除任务"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Pipeline Details */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                      <div className="font-semibold text-slate-700 flex items-center justify-between">
                        <span>⚙️ 驱动引擎与数据管道</span>
                        <span className="text-[10px] font-mono text-indigo-600">
                          {activeTask.connectorName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono break-all bg-white p-2 rounded border border-slate-200">
                        {activeTask.targetEndpoint}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                      <div className="font-semibold text-slate-700">🤖 Agent 智能清洗与提炼 Prompt</div>
                      <div className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded border border-slate-200">
                        {activeTask.aiSummaryPrompt}
                      </div>
                    </div>

                    {/* Routing Destinations */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                        <div className="text-slate-400 font-medium">原始归档 (Raw)</div>
                        <div className="font-mono text-slate-700 truncate">{activeTask.targetRawFolder}</div>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                        <div className="text-slate-400 font-medium">编译目标 (Wiki)</div>
                        <div className="font-mono text-slate-700 truncate">{activeTask.targetWikiFolder}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Latest Harvested Articles */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>📰 最近抓取成果线索</span>
                      <span className="text-[10px] font-normal text-slate-400">已智能清洗去噪</span>
                    </div>

                    <div className="space-y-2">
                      {activeTask.sampleRecentArticles && activeTask.sampleRecentArticles.length > 0 ? (
                        activeTask.sampleRecentArticles.map((art, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                {art.title}
                              </h4>
                              <a
                                href={art.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-indigo-600 shrink-0"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {art.snippet}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <span>{art.source}</span>
                              <span>{art.pubDate}</span>
                            </div>
                            {art.compiledWikiPath && onNavigateToWikiPage && (
                              <button
                                onClick={() => onNavigateToWikiPage(art.compiledWikiPath!)}
                                className="text-[10px] text-indigo-600 font-semibold hover:underline flex items-center space-x-1 mt-1 cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>已编译为: {art.compiledWikiPath}</span>
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                          暂无线索数据，点击右上角「立即运行」即可触发抓取
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Execution Logs */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span>执行日志流 (Live Logs)</span>
                    </div>
                    <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-[10px] space-y-1 max-h-36 overflow-y-auto">
                      {activeTask.latestLogs.map((log, li) => (
                        <div key={li} className="leading-tight text-emerald-400/90">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  请选择左侧任务查看详细信息
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GITHUB OPEN-SOURCE SOFTWARE DIRECTORY */}
      {activeTab === 'connectors' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                以下是系统已内置支持的 <strong>GitHub 明星中文开源信息采集软件</strong>。你可以直接将其作为自动化引擎创建任务，或在本地私有化部署。
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectors.map(conn => (
              <div
                key={conn.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${conn.badgeColor}`}>
                          {conn.category.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          ★ {conn.stars}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{conn.name}</h3>
                      <div className="text-[11px] font-mono text-slate-400">
                        GitHub: <span className="text-indigo-600 font-semibold">{conn.repo}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{conn.description}</p>

                  {/* Feature Bullets */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    {conn.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center space-x-1.5">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Supported Sources Tags */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">支持的中文源:</div>
                    <div className="flex flex-wrap gap-1">
                      {conn.supportedSources.map((src, si) => (
                        <span
                          key={si}
                          className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={conn.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center space-x-1"
                  >
                    <span>开源文档</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedConnectorForDoc(conn)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    >
                      部署指南
                    </button>
                    <button
                      onClick={() => {
                        handleOpenCreateModal(conn);
                        setActiveTab('tasks');
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>以此创建任务</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONNECTOR DEPLOYMENT MODAL */}
      {selectedConnectorForDoc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-slate-900">
                  {selectedConnectorForDoc.name} 私有化部署指南
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Repository: {selectedConnectorForDoc.repo}
                </p>
              </div>
              <button
                onClick={() => setSelectedConnectorForDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-bold text-slate-800 block mb-1">推荐一键启动命令:</label>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                  <span className="break-all">{selectedConnectorForDoc.setupGuide}</span>
                  <button
                    onClick={() => copyToClipboard(selectedConnectorForDoc.setupGuide)}
                    className="text-slate-400 hover:text-white p-1 ml-2 cursor-pointer"
                    title="复制命令"
                  >
                    {copiedCmd === selectedConnectorForDoc.setupGuide ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">示例接口调用 URL:</label>
                <div className="bg-slate-100 text-slate-700 p-2.5 rounded-xl font-mono text-xs break-all border border-slate-200">
                  {selectedConnectorForDoc.sampleEndpoint}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                💡 <strong>架构建议</strong>: 本地 Docker 或私有服务器部署后，直接将本系统的自动任务端点填写为内部 IP (如 <code>http://192.168.1.100:1200/...</code>)，即可零外部网络依赖实现私密企业级信息巡检。
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedConnectorForDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  const conn = selectedConnectorForDoc;
                  setSelectedConnectorForDoc(null);
                  handleOpenCreateModal(conn);
                  setActiveTab('tasks');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                以此创建自动任务
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {modalMode === 'create' ? '✨ 新建自动信息获取任务' : '⚙️ 编辑自动化任务配置'}
                </h3>
                <p className="text-xs text-slate-500">
                  设定开源数据引擎、抓取周期、Agent 关键词过滤与知识库编织规则
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Task Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-800">任务名称</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="如：36氪·AI 突发快讯与行业动态追踪"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">所属分类</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium bg-white"
                  >
                    <option value="科技新闻">科技新闻</option>
                    <option value="舆情聚合">舆情聚合</option>
                    <option value="金融财经">金融财经</option>
                    <option value="深度研报">深度研报</option>
                    <option value="代码前沿">代码前沿</option>
                  </select>
                </div>
              </div>

              {/* Open-Source Connector selection */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">选择开源驱动引擎 (Connector)</label>
                <select
                  value={formConnectorId}
                  onChange={e => {
                    setFormConnectorId(e.target.value);
                    const matched = connectors.find(c => c.id === e.target.value);
                    if (matched) {
                      setFormEndpoint(matched.sampleEndpoint);
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium bg-white"
                >
                  {connectors.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (★ {c.stars}) - {c.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Endpoint & Test Connection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    采集目标端点 (RSS Feed / API URL / Webhook)
                  </label>
                  <button
                    type="button"
                    onClick={handleTestEndpoint}
                    disabled={testingEndpoint || !formEndpoint.trim()}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center space-x-1 disabled:text-slate-400 cursor-pointer"
                  >
                    {testingEndpoint ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>正在探测...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" />
                        <span>测试端点连通性</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={formEndpoint}
                  onChange={e => {
                    setFormEndpoint(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="https://rsshub.app/36kr/newsflashes"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono text-xs"
                />

                {testResult && (
                  <div className={`p-2.5 rounded-xl text-[11px] space-y-1 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <div className="font-semibold flex items-center space-x-1.5">
                      {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                      <span>{testResult.msg}</span>
                    </div>
                    {testResult.preview && (
                      <div className="font-mono text-[10px] text-slate-500 bg-white/70 p-1.5 rounded border border-slate-200/50 break-all">
                        {testResult.preview}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Schedule Cron */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">执行频率 / 周期</label>
                  <select
                    value={formCronSchedule}
                    onChange={e => setFormCronSchedule(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium bg-white"
                  >
                    <option value="每 15 分钟">每 15 分钟 (高频突发)</option>
                    <option value="每 30 分钟">每 30 分钟 (推荐)</option>
                    <option value="每 1 小时">每 1 小时</option>
                    <option value="每 2 小时">每 2 小时</option>
                    <option value="每天 08:30, 18:00">每天早晚各一次 (早 8:30 / 晚 18:00)</option>
                    <option value="每天 09:00">每天早晨 09:00 一次</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">关键词命中过滤 (逗号分隔)</label>
                  <input
                    type="text"
                    value={formKeywords}
                    onChange={e => setFormKeywords(e.target.value)}
                    placeholder="AI, Agent, 知识库, 架构, 估值"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              {/* AI Prompt */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  Agent 智能清洗提炼指令 (Prompt)
                </label>
                <textarea
                  rows={2}
                  value={formAiPrompt}
                  onChange={e => setFormAiPrompt(e.target.value)}
                  placeholder="提取该信息源核心事实要点，指出涉及主体、创新突破与业务影响，并自动生成双链。"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
                />
              </div>

              {/* Auto Compile Wiki toggle & folders */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-xs">自动编译为 Wiki 知识词条</div>
                    <div className="text-[11px] text-slate-500">
                      开启后，抓取并过滤后的优质内容将自动编译为带有 Frontmatter 与双链的 Markdown 词条
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormAutoWiki(!formAutoWiki)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      formAutoWiki ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        formAutoWiki ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">原始归档路径 (Raw)</label>
                    <input
                      type="text"
                      value={formRawFolder}
                      onChange={e => setFormRawFolder(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Wiki 目标路径</label>
                    <input
                      type="text"
                      value={formWikiFolder}
                      onChange={e => setFormWikiFolder(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={!formName.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm ${
                  formName.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {modalMode === 'create' ? '创建并启动任务' : '保存修改'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
