import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Shield, Cpu, Compass, GitCommit, Sliders, CheckCircle2,
  AlertTriangle, RefreshCw, Zap, Play, Lock, Unlock, ArrowRight,
  Crosshair, Radio, Search, Database, Layers, Check, Sparkles, Terminal,
  ExternalLink, Eye, ChevronRight, Activity, Gauge, CornerDownRight,
  Workflow, Share2, Maximize2, RotateCw
} from 'lucide-react';
import { SystemConfig } from '../types';

interface InteractiveBlueprintSchematicProps {
  config: SystemConfig;
  onUpdateConfig: (module: keyof SystemConfig, key: string, value: any) => void;
  onToggleVaultLock: () => void;
  onSelectComponent?: (compKey: string) => void;
}

export const InteractiveBlueprintSchematic: React.FC<InteractiveBlueprintSchematicProps> = ({
  config,
  onUpdateConfig,
  onToggleVaultLock,
  onSelectComponent
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('l2_core');
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);
  const [activeFlowIndex, setActiveFlowIndex] = useState<number>(0);

  // Radar sweep animation for CAD aesthetic
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Continuous flowing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlowIndex(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulation runner for live interactive feedback
  const triggerSimulation = (type: 'ingest' | 'query' | 'lint' | 'hitl') => {
    setActiveSimulation(type);
    const timestamp = new Date().toLocaleTimeString();
    
    if (type === 'ingest') {
      setSimulationLog(prev => [
        `[${timestamp}] [L1-INGEST] 监听到新源文件: raw/papers/attention_is_all_you_need.pdf`,
        `[${timestamp}] [L2-COMPILE] LayoutLMv3 视觉版式解析完成 (耗时 42ms)`,
        `[${timestamp}] [L2-SYNTHESIS] 生成 3 篇实体页，追加更新 index.md 与 log.md`,
        ...prev.slice(0, 5)
      ]);
    } else if (type === 'query') {
      setSimulationLog(prev => [
        `[${timestamp}] [L3-QUERY] 发起混合检索: "双链拓扑收敛策略"`,
        `[${timestamp}] [QMD-ENGINE] BM25(${(config.query.bm25Weight * 100).toFixed(0)}%) + Vector(${(config.query.vectorWeight * 100).toFixed(0)}%) 命中 8 篇实体`,
        `[${timestamp}] [SYNTHESIS] 提炼生成结构化研报，触发人在回路(HITL)审批通道`,
        ...prev.slice(0, 5)
      ]);
    } else if (type === 'hitl') {
      setSimulationLog(prev => [
        `[${timestamp}] [HITL-GATE] 审查通过: "双链拓扑与知识复利最佳实践"`,
        `[${timestamp}] [BACKFEED] 注入 link_reason 并压铸入 Layer 2 实体库 (+1 Compounding)`,
        `[${timestamp}] [GIT-COMMIT] SHA-256 指纹固化: 7f8a91b...`,
        ...prev.slice(0, 5)
      ]);
    } else if (type === 'lint') {
      setSimulationLog(prev => [
        `[${timestamp}] [LINT-SCAN] 启动全库一致性与孤立节点巡检`,
        `[${timestamp}] [OLLAMA-11434] 端侧零成本修复 2 处死链与 1 处别名重定向`,
        `[${timestamp}] [HEALTH] 维基健康度恢复至 99.8% (节约 Token: 12.4k)`,
        ...prev.slice(0, 5)
      ]);
    }

    setTimeout(() => {
      setActiveSimulation(null);
    }, 2400);
  };

  return (
    <div 
      className="relative w-full rounded-2xl bg-[#030914] border-2 border-cyan-500/40 p-4 md:p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-cyan-100 font-mono select-none overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverCoord({
          x: Math.round(e.clientX - rect.left),
          y: Math.round(e.clientY - rect.top)
        });
      }}
      onMouseLeave={() => setHoverCoord(null)}
    >
      {/* ------------------------------------------------------------- */}
      {/* CAD BLUEPRINT GRID & DIMENSION CALIPERS                       */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d415_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b212_1px,transparent_1px),linear-gradient(to_bottom,#0891b212_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Technical Corner Markers & Coordinate Marks */}
      <div className="absolute top-2 left-2 text-[9px] text-cyan-500/60 font-mono pointer-events-none">
        + CAD-SCHEMATIC // [0000, 0000] // ISO-9001
      </div>
      <div className="absolute top-2 right-2 text-[9px] text-cyan-500/60 font-mono pointer-events-none text-right">
        LLM-WIKI-ARCH-V4 // [1200, 0000] +
      </div>
      <div className="absolute bottom-2 left-2 text-[9px] text-cyan-500/60 font-mono pointer-events-none">
        + [0000, 0680] // STATUS: 100% OPERATIONAL
      </div>
      <div className="absolute bottom-2 right-2 text-[9px] text-cyan-500/60 font-mono pointer-events-none text-right">
        {hoverCoord ? `COORD: [${hoverCoord.x.toString().padStart(4, '0')}, ${hoverCoord.y.toString().padStart(4, '0')}]` : 'LIVE BLUEPRINT INTERACTIVE'} +
      </div>

      {/* ============================================================= */}
      {/* 1. TOP CAD SPEC HEADER & QUICK ACTION TRIGGER BAR             */}
      {/* ============================================================= */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-cyan-900/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/60 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Crosshair className="w-6 h-6 text-cyan-400 animate-spin [animation-duration:15s]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-cyan-300 tracking-wider">
                LLM WIKI 动态工程蓝图 · 3-LAYER 拓扑交互视界
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold">
                LIVE INTERACTIVE CAD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              端到端 5 大核心节点闭环连接：各节点均支持直接调控参数与实时触发脉冲测试
            </p>
          </div>
        </div>

        {/* Live Simulation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerSimulation('ingest')}
            disabled={activeSimulation !== null}
            className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 text-xs font-bold rounded-xl border border-amber-600/70 transition cursor-pointer flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            title="模拟原始文件推入并触发编译"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>模拟 Ingest 编译</span>
          </button>

          <button
            onClick={() => triggerSimulation('query')}
            disabled={activeSimulation !== null}
            className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-600/70 transition cursor-pointer flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            title="模拟问答与混合检索"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>模拟 Query 检索</span>
          </button>

          <button
            onClick={() => triggerSimulation('hitl')}
            disabled={activeSimulation !== null}
            className="px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900/90 text-purple-300 text-xs font-bold rounded-xl border border-purple-600/70 transition cursor-pointer flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            title="模拟人在回路知识熔铸回流"
          >
            <GitCommit className="w-3.5 h-3.5 text-purple-400" />
            <span>模拟 HITL 反哺</span>
          </button>

          <button
            onClick={() => triggerSimulation('lint')}
            disabled={activeSimulation !== null}
            className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-600/70 transition cursor-pointer flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            title="模拟端侧本地自愈巡检"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${activeSimulation === 'lint' ? 'animate-spin' : ''}`} />
            <span>模拟 Lint 自愈</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. DYNAMIC SCHEMATIC CANVAS WITH SVG BUS LINES & INTERACTION  */}
      {/* ============================================================= */}
      <div className="relative mt-4 w-full h-[640px] rounded-xl bg-[#020612]/95 border border-cyan-900/80 overflow-hidden shadow-inner select-none">
        
        {/* Subtle Radar Scanner Sweep FX */}
        <div
          className="absolute w-[450px] h-[450px] rounded-full border border-cyan-500/10 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25"
          style={{
            background: `conic-gradient(from ${radarAngle}deg at 50% 50%, rgba(6,182,212,0.12) 0deg, transparent 50deg, transparent 360deg)`
          }}
        />

        {/* Dimension and Axis Lines */}
        <div className="absolute top-0 bottom-0 left-[35%] w-[1px] bg-cyan-900/20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-[65%] w-[1px] bg-cyan-900/20 pointer-events-none" />
        <div className="absolute left-0 right-0 top-[48%] h-[1px] bg-cyan-900/20 pointer-events-none" />

        {/* =========================================================== */}
        {/* SVG SCHEMATIC BUS LINES (COORDINATES MATCH BLUEPRINT NODES) */}
        {/* Virtual Space: 0 0 1200 640                                */}
        {/* Coordinates:                                               */}
        {/* Node 1 (RAW): x:30, y:30, w:280, h:240                     */}
        {/*   - Out Port (Right): x=310, y=150                          */}
        {/*   - Drain/Scan (Bottom): x=170, y=270                       */}
        {/* Node 2 (MATRIX): x:420, y:120, w:360, h:380                 */}
        {/*   - In Port Left: x=420, y=210                              */}
        {/*   - Out Port Right: x=780, y=210                            */}
        {/*   - HITL In Port Right-Bottom: x=780, y=410                 */}
        {/*   - Lint Repair In Port Left-Bottom: x=420, y=410           */}
        {/* Node 3 (QUERY): x:890, y:30, w:280, h:240                  */}
        {/*   - In Port (Left): x=890, y=150                            */}
        {/*   - Downfeed Port (Bottom): x=1030, y=270                   */}
        {/* Node 4 (HITL): x:890, y:360, w:280, h:240                  */}
        {/*   - Upfeed Port (Top): x=1030, y=360                        */}
        {/*   - Backfeed Port (Left): x=890, y=480                      */}
        {/* Node 5 (LINT): x:30, y:360, w:280, h:240                   */}
        {/*   - Feed In (Top): x=170, y=360                             */}
        {/*   - Heal Out (Right): x=310, y=480                          */}
        {/* =========================================================== */}
        <svg
          viewBox="0 0 1200 640"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cadCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="cadAmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="cadPurpleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="cadEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
            </linearGradient>

            <filter id="cadLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ========================================================= */}
          {/* 1. BUS LINE: RAW (310, 150) -> L2 COMPILE IN (420, 210)   */}
          {/* ========================================================= */}
          <path
            d="M 310 150 L 365 150 Q 385 150 385 175 L 385 185 Q 385 210 405 210 L 420 210"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 310 150 L 365 150 Q 385 150 385 175 L 385 185 Q 385 210 405 210 L 420 210"
            fill="none"
            stroke="#78350f"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 310 150 L 365 150 Q 385 150 385 175 L 385 185 Q 385 210 405 210 L 420 210"
            fill="none"
            stroke="url(#cadAmberGrad)"
            strokeWidth="4"
            filter="url(#cadLaserGlow)"
            className={activeSimulation === 'ingest' ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
          />

          {/* ========================================================= */}
          {/* 2. BUS LINE: L2 MATRIX (780, 210) -> L3 QUERY (890, 150)  */}
          {/* ========================================================= */}
          <path
            d="M 780 210 L 815 210 Q 835 210 835 185 L 835 175 Q 835 150 855 150 L 890 150"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 780 210 L 815 210 Q 835 210 835 185 L 835 175 Q 835 150 855 150 L 890 150"
            fill="none"
            stroke="#164e63"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 780 210 L 815 210 Q 835 210 835 185 L 835 175 Q 835 150 855 150 L 890 150"
            fill="none"
            stroke="url(#cadCyanGrad)"
            strokeWidth="4"
            filter="url(#cadLaserGlow)"
            className={activeSimulation === 'query' ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
          />

          {/* ========================================================= */}
          {/* 3. BUS LINE: L3 QUERY (1030, 270) -> HITL GATE (1030, 360)*/}
          {/* ========================================================= */}
          <path
            d="M 1030 270 L 1030 360"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 1030 270 L 1030 360"
            fill="none"
            stroke="#581c87"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 1030 270 L 1030 360"
            fill="none"
            stroke="url(#cadPurpleGrad)"
            strokeWidth="4"
            filter="url(#cadLaserGlow)"
            className={activeSimulation === 'hitl' ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
          />

          {/* ========================================================= */}
          {/* 4. BUS LINE: HITL (890, 480) -> L2 RE-WRITE (780, 410)    */}
          {/* ========================================================= */}
          <path
            d="M 890 480 L 855 480 Q 835 480 835 450 L 835 440 Q 835 410 815 410 L 780 410"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 890 480 L 855 480 Q 835 480 835 450 L 835 440 Q 835 410 815 410 L 780 410"
            fill="none"
            stroke="#581c87"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 890 480 L 855 480 Q 835 480 835 450 L 835 440 Q 835 410 815 410 L 780 410"
            fill="none"
            stroke="url(#cadPurpleGrad)"
            strokeWidth="4"
            filter="url(#cadLaserGlow)"
            className={activeSimulation === 'hitl' ? 'animate-pipe-flow-reverse' : 'animate-pipe-flow-reverse'}
          />

          {/* ========================================================= */}
          {/* 5. BUS LINE: LINT HEAL (310, 480) -> L2 REPAIR (420, 410)  */}
          {/* ========================================================= */}
          <path
            d="M 310 480 L 365 480 Q 385 480 385 450 L 385 440 Q 385 410 405 410 L 420 410"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 310 480 L 365 480 Q 385 480 385 450 L 385 440 Q 385 410 405 410 L 420 410"
            fill="none"
            stroke="#064e3b"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 310 480 L 365 480 Q 385 480 385 450 L 385 440 Q 385 410 405 410 L 420 410"
            fill="none"
            stroke="url(#cadEmeraldGrad)"
            strokeWidth="4"
            filter="url(#cadLaserGlow)"
            className={activeSimulation === 'lint' ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
          />

          {/* ========================================================= */}
          {/* 6. BUS LINE: RAW SCAN (170, 270) -> LINT (170, 360)       */}
          {/* ========================================================= */}
          <path
            d="M 170 270 L 170 360"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 170 270 L 170 360"
            fill="none"
            stroke="#0e7490"
            strokeWidth="3"
            strokeDasharray="5 5"
          />
          <path
            d="M 170 270 L 170 360"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            opacity="0.9"
            className="animate-pipe-flow"
          />

          {/* ========================================================= */}
          {/* CAD SOLDER PINS & TEST JUNCTIONS                          */}
          {/* ========================================================= */}
          {/* Node 1 Out & In */}
          <circle cx="310" cy="150" r="6" fill="#f59e0b" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="170" cy="270" r="6" fill="#06b6d4" stroke="#040d21" strokeWidth="2.5" />
          
          {/* Node 2 In/Outs */}
          <circle cx="420" cy="210" r="6" fill="#f59e0b" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="780" cy="210" r="6" fill="#06b6d4" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="780" cy="410" r="6" fill="#a855f7" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="420" cy="410" r="6" fill="#10b981" stroke="#040d21" strokeWidth="2.5" />

          {/* Node 3 In/Out */}
          <circle cx="890" cy="150" r="6" fill="#06b6d4" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="1030" cy="270" r="6" fill="#a855f7" stroke="#040d21" strokeWidth="2.5" />

          {/* Node 4 In/Out */}
          <circle cx="1030" cy="360" r="6" fill="#a855f7" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="890" cy="480" r="6" fill="#a855f7" stroke="#040d21" strokeWidth="2.5" />

          {/* Node 5 In/Out */}
          <circle cx="170" cy="360" r="6" fill="#06b6d4" stroke="#040d21" strokeWidth="2.5" />
          <circle cx="310" cy="480" r="6" fill="#10b981" stroke="#040d21" strokeWidth="2.5" />

          {/* Test Point Solder Bridges */}
          <circle cx="385" cy="180" r="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="385" y="168" fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">TP-01</text>
          
          <circle cx="835" cy="180" r="7" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="835" y="168" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">TP-02</text>

          <circle cx="835" cy="445" r="7" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
          <text x="835" y="465" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">TP-03</text>

          <circle cx="385" cy="445" r="7" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <text x="385" y="465" fill="#10b981" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">TP-04</text>
        </svg>

        {/* =========================================================== */}
        {/* 5 INTERACTIVE CAD BLUEPRINT NODES (CLICKABLE & OPERABLE)    */}
        {/* Precision Coordinate Placement in 1200x640 Box:             */}
        {/* Node 1: Left 2.5% (30px), Top 30px, Width 280px, Height 240px*/}
        {/* Node 2: Left 35.0% (420px), Top 120px, Width 360px, Height 380px */}
        {/* Node 3: Left 74.2% (890px), Top 30px, Width 280px, Height 240px*/}
        {/* Node 4: Left 74.2% (890px), Top 360px, Width 280px, Height 240px*/}
        {/* Node 5: Left 2.5% (30px), Top 360px, Width 280px, Height 240px*/}
        {/* =========================================================== */}

        {/* ----------------------------------------------------------- */}
        {/* NODE 1: LAYER 1 - RAW IMMUTABLE VAULT                       */}
        {/* ----------------------------------------------------------- */}
        <div
          onClick={() => setSelectedNode('l1_raw')}
          style={{ left: '2.5%', top: '30px', width: '23.3%', minWidth: '260px', height: '240px' }}
          className={`absolute rounded-2xl bg-[#040d21]/95 border-2 p-3.5 backdrop-blur-md transition cursor-pointer z-20 shadow-xl flex flex-col justify-between ${
            selectedNode === 'l1_raw'
              ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/40'
              : 'border-cyan-800/80 hover:border-amber-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-amber-400 font-bold">NODE L1-RAW</div>
                  <div className="text-xs font-bold text-white">不可变物理原始源</div>
                </div>
              </div>

              {/* Lock Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVaultLock();
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer flex items-center space-x-1 ${
                  config.ingestion.vaultReadOnly
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500'
                }`}
              >
                {config.ingestion.vaultReadOnly ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{config.ingestion.vaultReadOnly ? '444 LOCK' : '755 WRITE'}</span>
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 bg-black/40 rounded border border-cyan-950">
                <span className="text-slate-400">自动抽吸监听:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateConfig('ingestion', 'autoIngest', !config.ingestion.autoIngest);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition cursor-pointer ${
                    config.ingestion.autoIngest
                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {config.ingestion.autoIngest ? 'ON (实时)' : 'OFF (手动)'}
                </button>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">格式解析:</span>
                <span className="text-amber-300 font-mono">PDF, WebClip, MD</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">数据真理防护:</span>
                <span className="text-emerald-400 font-bold">只读防篡改 OK</span>
              </div>
            </div>
          </div>

          {/* Test Action */}
          <div className="pt-2 border-t border-cyan-950/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">BUS-OUT: 0x481A</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSimulation('ingest');
              }}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-0.5 underline cursor-pointer"
            >
              <span>触发入库</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* NODE 2: LAYER 2 - WIKI COMPILATION & WEAVING MATRIX         */}
        {/* ----------------------------------------------------------- */}
        <div
          onClick={() => setSelectedNode('l2_core')}
          style={{ left: '35.0%', top: '120px', width: '30.0%', minWidth: '320px', height: '380px' }}
          className={`absolute rounded-2xl bg-[#040d21]/95 border-2 p-4 backdrop-blur-xl transition cursor-pointer z-20 shadow-2xl flex flex-col justify-between ${
            selectedNode === 'l2_core'
              ? 'border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.35)] ring-2 ring-indigo-500/40'
              : 'border-cyan-800/80 hover:border-indigo-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <Cpu className="w-6 h-6 text-indigo-400" />
                <div>
                  <div className="text-[10px] text-indigo-400 font-bold">NODE L2-MATRIX</div>
                  <div className="text-sm font-black text-white">实体真理层 (Wiki Fabric)</div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const next = config.ingestion.ocrEngine === 'LayoutLMv3' ? 'Standard' : 'LayoutLMv3';
                  onUpdateConfig('ingestion', 'ocrEngine', next);
                }}
                className="px-2 py-0.5 bg-indigo-950 text-indigo-300 text-[10px] font-bold rounded border border-indigo-700 hover:border-indigo-500 transition cursor-pointer"
              >
                {config.ingestion.ocrEngine}
              </button>
            </div>

            {/* 3 Parallel Ingestion Lines */}
            <div className="mt-3 bg-black/50 p-2.5 rounded-xl border border-cyan-950 space-y-2">
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>三路并行编译通道 (Tri-Compilation Pipelines)</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-1.5 bg-slate-900/90 rounded border border-indigo-900/80">
                  <div className="text-[9px] text-slate-400">视觉版式</div>
                  <div className="text-[10px] font-bold text-amber-300 mt-0.5">LayoutLM</div>
                </div>
                <div className="p-1.5 bg-slate-900/90 rounded border border-indigo-900/80">
                  <div className="text-[9px] text-slate-400">Frontmatter</div>
                  <div className="text-[10px] font-bold text-indigo-300 mt-0.5">
                    {config.ingestion.schemaStrict ? 'STRICT' : 'RELAX'}
                  </div>
                </div>
                <div className="p-1.5 bg-slate-900/90 rounded border border-indigo-900/80">
                  <div className="text-[9px] text-slate-400">Git指纹</div>
                  <div className="text-[10px] font-bold text-emerald-300 mt-0.5">SHA256</div>
                </div>
              </div>
            </div>

            {/* Operable Toggles inside Node */}
            <div className="mt-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-1.5 bg-black/40 rounded border border-cyan-950">
                <span className="text-slate-300">Frontmatter 强校验门禁:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateConfig('ingestion', 'schemaStrict', !config.ingestion.schemaStrict);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition cursor-pointer ${
                    config.ingestion.schemaStrict
                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-600'
                  }`}
                >
                  {config.ingestion.schemaStrict ? 'STRICT (强约束)' : 'PASS (宽松)'}
                </button>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">时序日志记录:</span>
                <span className="text-cyan-300 font-mono">log.md 自动追加</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">知识索引目录:</span>
                <span className="text-cyan-300 font-mono">index.md 毫秒增量</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-950 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">TOPOLOGY: 100% CONVERGED</span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">512 ENTITIES</span>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* NODE 3: LAYER 3 - QMD SEARCH & QUERY SYNTHESIS              */}
        {/* ----------------------------------------------------------- */}
        <div
          onClick={() => setSelectedNode('l3_query')}
          style={{ left: '74.2%', top: '30px', width: '23.3%', minWidth: '260px', height: '240px' }}
          className={`absolute rounded-2xl bg-[#040d21]/95 border-2 p-3.5 backdrop-blur-md transition cursor-pointer z-20 shadow-xl flex flex-col justify-between ${
            selectedNode === 'l3_query'
              ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] ring-2 ring-cyan-500/40'
              : 'border-cyan-800/80 hover:border-cyan-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold">NODE L3-QUERY</div>
                  <div className="text-xs font-bold text-white">问答检索与合成 (qmd)</div>
                </div>
              </div>

              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 text-[10px] font-bold rounded border border-cyan-700">
                混合检索
              </span>
            </div>

            {/* BM25 vs Vector Slider */}
            <div className="mt-2.5 p-2 bg-black/40 rounded border border-cyan-950 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                <span>BM25: {(config.query.bm25Weight * 100).toFixed(0)}%</span>
                <span>Vector: {(config.query.vectorWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={config.query.bm25Weight}
                onChange={(e) => {
                  const bm25 = parseFloat(e.target.value);
                  onUpdateConfig('query', 'bm25Weight', bm25);
                  onUpdateConfig('query', 'vectorWeight', parseFloat((1 - bm25).toFixed(2)));
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex items-center justify-between px-1">
                <span className="text-slate-400">双链拦截哨兵:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateConfig('query', 'biLinkSentinel', !config.query.biLinkSentinel);
                  }}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition cursor-pointer ${
                    config.query.biLinkSentinel
                      ? 'text-cyan-300 bg-cyan-950 border border-cyan-600'
                      : 'text-slate-400 bg-slate-800 border border-slate-700'
                  }`}
                >
                  {config.query.biLinkSentinel ? 'ACTIVE' : 'PASS'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-950 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">RETRIEVAL: 18ms</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSimulation('query');
              }}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 underline cursor-pointer"
            >
              <span>触发检索</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* NODE 4: HITL KNOWLEDGE COMPOUNDING CRUCIBLE                 */}
        {/* ----------------------------------------------------------- */}
        <div
          onClick={() => setSelectedNode('hitl_gate')}
          style={{ left: '74.2%', top: '360px', width: '23.3%', minWidth: '260px', height: '240px' }}
          className={`absolute rounded-2xl bg-[#040d21]/95 border-2 p-3.5 backdrop-blur-md transition cursor-pointer z-20 shadow-xl flex flex-col justify-between ${
            selectedNode === 'hitl_gate'
              ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-2 ring-purple-500/40'
              : 'border-cyan-800/80 hover:border-purple-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <GitCommit className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-[10px] text-purple-400 font-bold">NODE HITL-GATE</div>
                  <div className="text-xs font-bold text-white">人在回路知识反哺</div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateConfig('query', 'humanInLoop', !config.query.humanInLoop);
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded border transition cursor-pointer ${
                  config.query.humanInLoop
                    ? 'bg-purple-950 text-purple-300 border-purple-600'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {config.query.humanInLoop ? 'AUDIT ON' : 'AUTO PASS'}
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 bg-black/40 rounded border border-cyan-950">
                <span className="text-slate-300">link_reason 理由:</span>
                <span className="text-emerald-400 font-bold">强制审查注入</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">知识复利回流:</span>
                <span className="text-purple-300 font-bold">+1 Compounding</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">Git 版本回溯:</span>
                <span className="text-emerald-400 font-mono">AUTO-COMMIT</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-950 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">GATE: READY</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSimulation('hitl');
              }}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center space-x-0.5 underline cursor-pointer"
            >
              <span>触发反哺</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* NODE 5: LINT & HEALING LOCAL OLLAMA DISPATCH                */}
        {/* ----------------------------------------------------------- */}
        <div
          onClick={() => setSelectedNode('lint_heal')}
          style={{ left: '2.5%', top: '360px', width: '23.3%', minWidth: '260px', height: '240px' }}
          className={`absolute rounded-2xl bg-[#040d21]/95 border-2 p-3.5 backdrop-blur-md transition cursor-pointer z-20 shadow-xl flex flex-col justify-between ${
            selectedNode === 'lint_heal'
              ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/40'
              : 'border-cyan-800/80 hover:border-emerald-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold">NODE LINT-HEAL</div>
                  <div className="text-xs font-bold text-white">巡检自愈与本地分流</div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateConfig('lint', 'economicRouting', !config.lint.economicRouting);
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded border transition cursor-pointer ${
                  config.lint.economicRouting
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {config.lint.economicRouting ? 'PORT 11434' : 'CLOUD ONLY'}
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 bg-black/40 rounded border border-cyan-950">
                <span className="text-slate-300">自愈模式:</span>
                <select
                  value={config.lint.autoHealing}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdateConfig('lint', 'autoHealing', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-700"
                >
                  <option value="full-auto">全自动修复</option>
                  <option value="dry-run">模拟试运行</option>
                  <option value="disabled">关闭</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">死链与孤立项:</span>
                <span className="text-emerald-400 font-bold">Ollama 零成本清洗</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 px-1">
                <span className="text-slate-400">巡检健康指数:</span>
                <span className="text-emerald-400 font-mono">99.8% OK</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-950 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">CRON: 4h / CYCLE</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSimulation('lint');
              }}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5 underline cursor-pointer"
            >
              <span>触发巡检</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================= */}
      {/* 3. CAD LIVE DIAGNOSTICS CONSOLE & ACTION BENCH                */}
      {/* ============================================================= */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Realtime Simulation Log Output Terminal */}
        <div className="lg:col-span-2 p-3.5 rounded-xl bg-[#02050e] border border-cyan-900/80">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950 text-xs">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>动态流向实测诊断控制台 (LIVE STREAM AUDIT)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-slate-500 font-mono">AUTO-STREAMING</span>
            </div>
          </div>

          <div className="mt-2.5 space-y-1 text-[11px] font-mono min-h-[85px] max-h-[85px] overflow-y-auto">
            {simulationLog.length === 0 ? (
              <div className="text-slate-500 italic flex items-center space-x-2 py-4 justify-center">
                <span>点击上方任意「模拟」或各节点右下角的「触发」按钮，观测实时数据流脉冲传导...</span>
              </div>
            ) : (
              simulationLog.map((log, idx) => (
                <div key={idx} className="text-cyan-300/90 leading-relaxed truncate">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Node Quick Spec & Deep Link */}
        <div className="p-3.5 rounded-xl bg-[#02050e] border border-cyan-900/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">已聚焦节点:</span>
              <span className="font-bold text-amber-300">
                {selectedNode === 'l1_raw' && 'NODE 01: 原始输入仓'}
                {selectedNode === 'l2_core' && 'NODE 02: 知识编译中枢'}
                {selectedNode === 'l3_query' && 'NODE 03: 问答检索合成'}
                {selectedNode === 'hitl_gate' && 'NODE 04: 人在回路反哺'}
                {selectedNode === 'lint_heal' && 'NODE 05: 巡检自愈分流'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {selectedNode === 'l1_raw' && '只读保护与自动抽吸监听，确保原始数据永不被二次篡改。'}
              {selectedNode === 'l2_core' && 'LayoutLMv3 版式解析与 Frontmatter 强校验，实现知识裂变与拓扑编织。'}
              {selectedNode === 'l3_query' && 'qmd 混合检索与双链哨兵拦截，实现亚毫秒级精准知识定位。'}
              {selectedNode === 'hitl_gate' && '高价值问答沉淀与 link_reason 上下文审计，驱动知识复利递增。'}
              {selectedNode === 'lint_heal' && '端侧 Ollama 11434 端口零成本巡检，自动修复死链与孤立实体。'}
            </p>
          </div>

          <button
            onClick={() => onSelectComponent?.(selectedNode)}
            className="mt-3 w-full py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>聚焦底层配置矩阵</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
