import React, { useState, useEffect, useRef } from 'react';
import {
  Cog, Cpu, Zap, Activity, Flame, Radio, Layers, Database, GitCommit,
  Lock, Unlock, ShieldAlert, Sparkles, Sliders, RefreshCw, CheckCircle2,
  AlertTriangle, Play, Pause, ArrowRight, CornerDownRight, RotateCw,
  Gauge, Cable, Box, Wrench, Shield, Compass, FileText, ChevronRight,
  TrendingUp, Terminal, DollarSign, Power, Server, Eye, Image as ImageIcon,
  Maximize2, Binary, Check, SlidersHorizontal, Lightbulb
} from 'lucide-react';
import { SystemConfig } from '../types';
import { InteractiveBlueprintSchematic } from './InteractiveBlueprintSchematic';

// Generated Auxiliary Imagery
const MECH_BLUEPRINT_IMG = new URL('../assets/images/mech_engine_blueprint_1787321096061.jpg', import.meta.url).href;
const GEARBOX_CORE_IMG = new URL('../assets/images/gearbox_manifold_core_1787321118613.jpg', import.meta.url).href;

interface MechanicalEngineDiagramProps {
  config: SystemConfig;
  onUpdateConfig: (module: keyof SystemConfig, key: string, value: any) => void;
  onToggleVaultLock: () => void;
  onSelectComponent?: (compKey: string) => void;
}

export const MechanicalEngineDiagram: React.FC<MechanicalEngineDiagramProps> = ({
  config,
  onUpdateConfig,
  onToggleVaultLock,
  onSelectComponent
}) => {
  const [engineSpeed, setEngineSpeed] = useState<'normal' | 'overdrive' | 'idle'>('normal');
  const [selectedUnit, setSelectedUnit] = useState<string>('engine');
  const [viewMode, setViewMode] = useState<'apparatus' | 'blueprint' | 'hologram'>('apparatus');
  const [steamVenting, setSteamVenting] = useState(true);
  const [valveOpen, setValveOpen] = useState(true);
  const [realtimeRpm, setRealtimeRpm] = useState(1480);
  const [realtimePressurePsi, setRealtimePressurePsi] = useState(88.5);
  const [fluidFlowRate, setFluidFlowRate] = useState(48.2);
  const [coolingTempC, setCoolingTempC] = useState(42.3);
  const [packetOffset, setPacketOffset] = useState(0);

  // Live sensor animation tick
  useEffect(() => {
    const timer = setInterval(() => {
      const mult = engineSpeed === 'overdrive' ? 1.6 : engineSpeed === 'idle' ? 0.2 : 1.0;
      setRealtimeRpm(Math.round((1450 + Math.sin(Date.now() / 800) * 90) * mult));
      setRealtimePressurePsi(Number(((85 + Math.sin(Date.now() / 1200) * 5) * mult).toFixed(1)));
      setFluidFlowRate(Number(((45 + Math.cos(Date.now() / 1000) * 6) * mult).toFixed(1)));
      setCoolingTempC(Number((40 + (engineSpeed === 'overdrive' ? 15 : 0) + Math.sin(Date.now() / 2000) * 2).toFixed(1)));
      setPacketOffset(prev => (prev + (engineSpeed === 'overdrive' ? 6 : engineSpeed === 'idle' ? 1 : 3)) % 1000);
    }, 100);
    return () => clearInterval(timer);
  }, [engineSpeed]);

  const isOverdrive = engineSpeed === 'overdrive';
  const isIdle = engineSpeed === 'idle';

  // Dynamic animation speeds for mechanical gears
  const gearCwClass = isIdle
    ? 'opacity-70'
    : isOverdrive
    ? 'animate-gear-fast-cw'
    : 'animate-gear-cw';

  const gearCcwClass = isIdle
    ? 'opacity-70'
    : isOverdrive
    ? 'animate-gear-fast-ccw'
    : 'animate-gear-ccw';

  return (
    <div className="relative w-full rounded-3xl bg-radial from-slate-900 via-[#070b14] to-[#03060c] border-2 border-slate-700/80 p-5 shadow-[0_0_60px_rgba(0,0,0,0.85)] text-slate-100 font-sans select-none overflow-hidden">
      {/* Background Industrial Metallic Grid & Hex Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#33415518_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Industrial Chassis Rivets */}
      <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-800 border border-slate-600 shadow-inner flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-0.5 bg-slate-400 rotate-45" />
      </div>
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-slate-800 border border-slate-600 shadow-inner flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-0.5 bg-slate-400 -rotate-45" />
      </div>
      <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-slate-800 border border-slate-600 shadow-inner flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-0.5 bg-slate-400 -rotate-45" />
      </div>
      <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-slate-800 border border-slate-600 shadow-inner flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-0.5 bg-slate-400 rotate-45" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER: REALTIME WORKFLOW TELEMETRY BAR                            */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
        <div className="flex items-center space-x-3.5">
          <div className="relative p-2.5 bg-gradient-to-br from-amber-600 via-indigo-800 to-slate-950 rounded-2xl border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Cog className={`w-7 h-7 text-amber-300 ${gearCwClass}`} />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-amber-100 tracking-wider flex items-center gap-1.5">
                <span>LLM WIKI 知识流变全景动态流</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-700 font-bold">
                PERSISTENT COMPOUNDING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              数据流经三层架构，由 LLM 持续编译与双链编织，驱动知识库自增益与巡检自愈
            </p>
          </div>
        </div>

        {/* View Mode Switcher + Throttle Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Visual Mode Toggle */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('apparatus')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                viewMode === 'apparatus'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="三层知识流向动态图"
            >
              <Cog className="w-3.5 h-3.5" />
              <span>动态流向</span>
            </button>
            <button
              onClick={() => setViewMode('blueprint')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                viewMode === 'blueprint'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="架构解构与数据流图"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>架构全景</span>
            </button>
            <button
              onClick={() => setViewMode('hologram')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                viewMode === 'hologram'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="双链编译核心剖面"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>编译核心</span>
            </button>
          </div>

          {/* Realtime System Telemetry */}
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-xs font-mono">
            <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-black/40 rounded-lg">
              <Gauge className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-slate-400 text-[10px]">检索负载:</span>
              <span className="font-bold text-cyan-300">{realtimePressurePsi} QPS</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-black/40 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[10px]">编译吞吐:</span>
              <span className="font-bold text-amber-300">{realtimeRpm} tok/s</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-black/40 rounded-lg">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-400 text-[10px]">自愈健康度:</span>
              <span className="font-bold text-rose-300">98.5%</span>
            </div>
          </div>

          {/* Throughput Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setEngineSpeed('idle')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                engineSpeed === 'idle' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              低功耗
            </button>
            <button
              onClick={() => setEngineSpeed('normal')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                engineSpeed === 'normal' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              标准
            </button>
            <button
              onClick={() => setEngineSpeed('overdrive')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                engineSpeed === 'overdrive' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/40 animate-pulse' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>并发加速</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE: ARCHITECTURE BLUEPRINT & CORE VIEW MODES                         */}
      {/* ========================================================================= */}
      {viewMode === 'blueprint' && (
        <div className="mt-4 animate-fadeIn">
          <InteractiveBlueprintSchematic
            config={config}
            onUpdateConfig={onUpdateConfig}
            onToggleVaultLock={onToggleVaultLock}
            onSelectComponent={onSelectComponent}
          />
        </div>
      )}

      {viewMode === 'hologram' && (
        <div className="relative mt-4 w-full h-[580px] rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <img
              src={GEARBOX_CORE_IMG}
              alt="Knowledge Synthesis Core Render"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-md">
              <div className="text-xs font-mono text-cyan-400 font-bold flex items-center justify-between">
                <span>KNOWLEDGE COMPILATION & DISPATCH CORE</span>
                <span className="text-emerald-400">STATUS: ACTIVE COMPILING</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">
                多源知识调度与双链编译核心
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                将高并发非结构化知识流匀速分发给后台 OCR 解析与知识三元组抽取，生成规范 Markdown 与双向引用，保障全局知识一致性。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN APPARATUS CANVAS: HIGH-PRECISION PIPELINES & GEAR TRAIN           */}
      {/* ========================================================================= */}
      {viewMode === 'apparatus' && (
        <div className="relative mt-4 w-full h-[620px] rounded-2xl bg-radial from-[#0e1626] via-[#080d17] to-[#02050a] border border-slate-800 shadow-inner overflow-hidden">
          
          {/* Ambient Industrial Steam Ventilation FX */}
          {steamVenting && (
            <>
              <div className="absolute top-24 left-[310px] w-16 h-16 rounded-full bg-slate-400/20 blur-2xl animate-steam pointer-events-none" />
              <div className="absolute bottom-24 right-[310px] w-20 h-20 rounded-full bg-cyan-400/15 blur-2xl animate-steam pointer-events-none" />
              <div className="absolute top-20 right-[280px] w-14 h-14 rounded-full bg-purple-400/15 blur-2xl animate-steam pointer-events-none" />
            </>
          )}

          {/* ===================================================================== */}
          {/* EXACT SVG PIPELINES CANVAS WITH PIXEL-PERFECT FLANGE ALIGNMENT         */}
          {/* Virtual Coordinate Space: 0 0 1200 620                                */}
          {/* ===================================================================== */}
          <svg
            viewBox="0 0 1200 620"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="pipeMetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="pipeAmberFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="pipeCyanFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="pipePurpleFlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="pipeEmeraldFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
              </linearGradient>

              {/* Glowing Filters */}
              <filter id="glowLaser" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ------------------------------------------------------------- */}
            {/* 1. PIPELINE A: RAW FEEDER (310, 160) -> MAIN ENGINE (440, 240) */}
            {/* ------------------------------------------------------------- */}
            {/* Outer Metal Pipe Shell */}
            <path
              d="M 310 160 L 375 160 Q 395 160 395 180 L 395 220 Q 395 240 415 240 L 440 240"
              fill="none"
              stroke="url(#pipeMetalGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Translucent Fluid Conduit */}
            <path
              d="M 310 160 L 375 160 Q 395 160 395 180 L 395 220 Q 395 240 415 240 L 440 240"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
            />
            {/* High-Pressure Amber Fluid Flow */}
            <path
              d="M 310 160 L 375 160 Q 395 160 395 180 L 395 220 Q 395 240 415 240 L 440 240"
              fill="none"
              stroke="url(#pipeAmberFlow)"
              strokeWidth="7"
              filter="url(#glowLaser)"
              className={isIdle ? 'opacity-30' : isOverdrive ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
            />

            {/* ------------------------------------------------------------- */}
            {/* 2. PIPELINE B: MAIN ENGINE (760, 210) -> TURBINE Q-03 (890, 160) */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 760 210 L 805 210 Q 825 210 825 190 L 825 180 Q 825 160 845 160 L 890 160"
              fill="none"
              stroke="url(#pipeMetalGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 760 210 L 805 210 Q 825 210 825 190 L 825 180 Q 825 160 845 160 L 890 160"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
            />
            <path
              d="M 760 210 L 805 210 Q 825 210 825 190 L 825 180 Q 825 160 845 160 L 890 160"
              fill="none"
              stroke="url(#pipeCyanFlow)"
              strokeWidth="7"
              filter="url(#glowLaser)"
              className={isIdle ? 'opacity-30' : isOverdrive ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
            />

            {/* ------------------------------------------------------------- */}
            {/* 3. PIPELINE C: TURBINE Q-03 (1020, 270) -> HITL CHAMBER (1020, 410) */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 1020 270 L 1020 410"
              fill="none"
              stroke="url(#pipeMetalGrad)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 1020 270 L 1020 410"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
            />
            <path
              d="M 1020 270 L 1020 410"
              fill="none"
              stroke="url(#pipePurpleFlow)"
              strokeWidth="7"
              filter="url(#glowLaser)"
              className={isIdle ? 'opacity-30' : isOverdrive ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
            />

            {/* ------------------------------------------------------------- */}
            {/* 4. PIPELINE D: HITL (890, 520) -> MAIN ENGINE BASE (760, 410) */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 890 520 L 825 520 Q 805 520 805 490 L 805 440 Q 805 410 785 410 L 760 410"
              fill="none"
              stroke="url(#pipeMetalGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 890 520 L 825 520 Q 805 520 805 490 L 805 440 Q 805 410 785 410 L 760 410"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
            />
            <path
              d="M 890 520 L 825 520 Q 805 520 805 490 L 805 440 Q 805 410 785 410 L 760 410"
              fill="none"
              stroke="url(#pipePurpleFlow)"
              strokeWidth="7"
              filter="url(#glowLaser)"
              className={isIdle ? 'opacity-30' : isOverdrive ? 'animate-pipe-flow-reverse' : 'animate-pipe-flow-reverse'}
            />

            {/* ------------------------------------------------------------- */}
            {/* 5. PIPELINE E: PUMP L-05 (310, 520) -> MAIN ENGINE BASE (440, 440) */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 310 520 L 375 520 Q 395 520 395 490 L 395 460 Q 395 440 415 440 L 440 440"
              fill="none"
              stroke="url(#pipeMetalGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 310 520 L 375 520 Q 395 520 395 490 L 395 460 Q 395 440 415 440 L 440 440"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
            />
            <path
              d="M 310 520 L 375 520 Q 395 520 395 490 L 395 460 Q 395 440 415 440 L 440 440"
              fill="none"
              stroke="url(#pipeEmeraldFlow)"
              strokeWidth="7"
              filter="url(#glowLaser)"
              className={isIdle ? 'opacity-30' : isOverdrive ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
            />

            {/* ------------------------------------------------------------- */}
            {/* 6. PIPELINE F: RAW DRAIN (180, 270) -> PUMP VACUUM (180, 410)  */}
            {/* ------------------------------------------------------------- */}
            <path
              d="M 180 270 L 180 410"
              fill="none"
              stroke="url(#pipeMetalGrad)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 180 270 L 180 410"
              fill="none"
              stroke="#0f172a"
              strokeWidth="10"
            />
            <path
              d="M 180 270 L 180 410"
              fill="none"
              stroke="url(#pipeAmberFlow)"
              strokeWidth="5"
              filter="url(#glowLaser)"
              className={isIdle ? 'opacity-30' : isOverdrive ? 'animate-pipe-flow-fast' : 'animate-pipe-flow'}
            />

            {/* ============================================================= */}
            {/* INDUSTRIAL FLANGE FITTINGS & VALVES AT CONNECTION PORTS        */}
            {/* ============================================================= */}
            {/* Flange 1 (310, 160) */}
            <rect x="305" y="146" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="310" cy="152" r="1.5" fill="#f8fafc" />
            <circle cx="310" cy="168" r="1.5" fill="#f8fafc" />

            {/* Flange 2 Engine In (440, 240) */}
            <rect x="435" y="226" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="440" cy="232" r="1.5" fill="#f8fafc" />
            <circle cx="440" cy="248" r="1.5" fill="#f8fafc" />

            {/* Flange 3 Engine Out (760, 210) */}
            <rect x="755" y="196" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="760" cy="202" r="1.5" fill="#f8fafc" />
            <circle cx="760" cy="218" r="1.5" fill="#f8fafc" />

            {/* Flange 4 Turbine In (890, 160) */}
            <rect x="885" y="146" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="890" cy="152" r="1.5" fill="#f8fafc" />
            <circle cx="890" cy="168" r="1.5" fill="#f8fafc" />

            {/* Flange 5 Turbine Out (1020, 270) */}
            <rect x="1006" y="265" width="28" height="10" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Flange 6 HITL In (1020, 410) */}
            <rect x="1006" y="405" width="28" height="10" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Flange 7 HITL Out (890, 520) */}
            <rect x="885" y="506" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Flange 8 Engine Hitl Recv (760, 410) */}
            <rect x="755" y="396" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Flange 9 Pump Out (310, 520) */}
            <rect x="305" y="506" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Flange 10 Engine Lint Recv (440, 440) */}
            <rect x="435" y="426" width="10" height="28" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Pressure Relief Valves & Sight Glasses */}
            <circle cx="395" cy="190" r="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="395" y1="183" x2="395" y2="197" stroke="#f59e0b" strokeWidth="2" />
            
            <circle cx="825" cy="185" r="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
            <line x1="818" y1="185" x2="832" y2="185" stroke="#06b6d4" strokeWidth="2" />

            <circle cx="805" cy="465" r="10" fill="#0f172a" stroke="#a855f7" strokeWidth="2.5" />
            <line x1="800" y1="460" x2="810" y2="470" stroke="#a855f7" strokeWidth="2" />
          </svg>

          {/* ===================================================================== */}
          {/* 5 PHYSICAL APPARATUS STATIONS (ABSOLUTE PLACEMENT)                    */}
          {/* Coordinates correspond exactly with SVG Flanges:                     */}
          {/* Left: 50-310 (w:260), Center: 440-760 (w:320), Right: 890-1150 (w:260) */}
          {/* ===================================================================== */}

          {/* ------------------------------------------------------------------- */}
          {/* STATION 1: RAW INGESTION & READ-ONLY VAULT LOCK                     */}
          {/* Bounding: x 50, y 50, w 260, h 220 -> Right Flange at (310, 160)    */}
          {/* ------------------------------------------------------------------- */}
          <div
            onClick={() => setSelectedUnit('raw_feeder')}
            className={`absolute top-[50px] left-[50px] w-[260px] h-[220px] bg-slate-900/95 rounded-3xl border p-4 backdrop-blur-md shadow-2xl transition cursor-pointer z-20 group ${
              selectedUnit === 'raw_feeder'
                ? 'border-amber-400 ring-4 ring-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                : 'border-slate-700 hover:border-amber-500/60'
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <Cog className={`w-6 h-6 text-amber-400 ${gearCwClass}`} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-amber-400 font-bold">NODE 01 · INGESTION</div>
                  <div className="text-xs font-bold text-white">Layer 1 原始输入仓</div>
                </div>
              </div>

              {/* Hardware Lock Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVaultLock();
                }}
                className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center space-x-1 transition cursor-pointer ${
                  config.ingestion.vaultReadOnly
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-sm'
                    : 'bg-amber-950 text-amber-300 border border-amber-600 shadow-sm'
                }`}
                title="物理只读锁切换 (chmod 444 / 755)"
              >
                {config.ingestion.vaultReadOnly ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{config.ingestion.vaultReadOnly ? '444 LOCK' : '755 WRITE'}</span>
              </button>
            </div>

            <div className="my-2.5 bg-black/50 p-2.5 rounded-2xl border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">自动入库监听:</span>
                <span className={config.ingestion.autoIngest ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {config.ingestion.autoIngest ? 'ACTIVE (持续抽吸)' : 'PAUSED (待命)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">输入门禁状态:</span>
                <span className="text-amber-300 font-mono font-bold">只读防护 OK</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>进料流量: 48.2 KB/s</span>
              <span className="text-amber-400">PDF / MD / TXT</span>
            </div>

            {/* Right Output Flange Indicator */}
            <div className="absolute top-[102px] -right-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            </div>
            {/* Bottom Drain Flange Indicator */}
            <div className="absolute -bottom-2 left-[122px] w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* STATION 2: MULTI-MODAL COMPILE & KNOWLEDGE WEAVING CORE              */}
          {/* Bounding: x 440, y 140, w 320, h 340 -> Direct Interlocking Core    */}
          {/* ------------------------------------------------------------------- */}
          <div
            onClick={() => setSelectedUnit('engine')}
            className={`absolute top-[140px] left-[440px] w-[320px] h-[340px] bg-slate-900/95 rounded-3xl border-2 p-4.5 backdrop-blur-xl shadow-2xl transition cursor-pointer z-20 ${
              selectedUnit === 'engine'
                ? 'border-indigo-400 ring-4 ring-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.35)]'
                : 'border-slate-700 hover:border-indigo-500/70'
            }`}
          >
            {/* Header: Core Processing */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Cog className={`w-7 h-7 text-indigo-400 absolute -top-0.5 -left-0.5 ${gearCwClass}`} />
                  <Cog className={`w-5 h-5 text-purple-400 absolute -bottom-0.5 -right-0.5 ${gearCcwClass}`} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-indigo-400 font-bold">NODE 02 · SYNTHESIS</div>
                  <div className="text-sm font-extrabold text-white">多模态知识编译中枢</div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-700">
                {config.ingestion.ocrEngine}
              </span>
            </div>

            {/* 3 Pipeline Processing Units */}
            <div className="my-3.5 bg-black/60 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>三路并行编译通道 (Tri-Parallel Pipeline)</span>
                <span className="text-amber-400 font-bold">{isIdle ? 'IDLE' : 'PROCESSING'}</span>
              </div>
              
              <div className="flex items-center justify-around pt-1">
                {/* Channel 1: OCR LayoutLMv3 */}
                <div className="text-center">
                  <div className="w-8 h-12 mx-auto bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-lg border border-slate-600 animate-piston flex flex-col items-center justify-between p-1">
                    <div className="w-4 h-1.5 bg-amber-400 rounded-full shadow" />
                    <div className="w-1.5 h-6 bg-slate-400 rounded-sm" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-300 mt-1 font-bold">OCR解析</div>
                </div>

                {/* Channel 2: YAML Frontmatter Strict */}
                <div className="text-center">
                  <div className="w-8 h-12 mx-auto bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-lg border border-slate-600 animate-piston [animation-delay:0.4s] flex flex-col items-center justify-between p-1">
                    <div className="w-4 h-1.5 bg-indigo-400 rounded-full shadow" />
                    <div className="w-1.5 h-6 bg-slate-400 rounded-sm" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-300 mt-1 font-bold">Schema约束</div>
                </div>

                {/* Channel 3: Git Fingerprint Commit */}
                <div className="text-center">
                  <div className="w-8 h-12 mx-auto bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-lg border border-slate-600 animate-piston [animation-delay:0.8s] flex flex-col items-center justify-between p-1">
                    <div className="w-4 h-1.5 bg-emerald-400 rounded-full shadow" />
                    <div className="w-1.5 h-6 bg-slate-400 rounded-sm" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-300 mt-1 font-bold">Git指纹</div>
                </div>
              </div>
            </div>

            {/* Core Specs Readout */}
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Frontmatter 强校验门禁:</span>
                <span className={config.ingestion.schemaStrict ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {config.ingestion.schemaStrict ? 'STRICT (强约束)' : 'RELAXED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">双链拓扑一致性:</span>
                <span className="font-mono text-cyan-300 font-bold">100% 实体拓扑关联</span>
              </div>
            </div>

            {/* Flange Connection Indicators */}
            <div className="absolute top-[92px] -left-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900" />
            <div className="absolute top-[62px] -right-2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-900" />
            <div className="absolute bottom-[62px] -right-2 w-4 h-4 rounded-full bg-purple-400 border-2 border-slate-900" />
            <div className="absolute bottom-[32px] -left-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* STATION 3: QUERY SYNTHESIS & qmd SEARCH                            */}
          {/* Bounding: x 890, y 50, w 260, h 220 -> Left Flange (890, 160)       */}
          {/* ------------------------------------------------------------------- */}
          <div
            onClick={() => setSelectedUnit('turbine')}
            className={`absolute top-[50px] left-[890px] w-[260px] h-[220px] bg-slate-900/95 rounded-3xl border p-4 backdrop-blur-md shadow-2xl transition cursor-pointer z-20 ${
              selectedUnit === 'turbine'
                ? 'border-cyan-400 ring-4 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                : 'border-slate-700 hover:border-cyan-500/60'
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <Compass className={`w-6 h-6 text-cyan-400 ${gearCcwClass}`} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">NODE 03 · RETRIEVAL</div>
                  <div className="text-xs font-bold text-white">问答检索与合成 (qmd)</div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                qmd 混合
              </span>
            </div>

            {/* BM25 & Vector Balance */}
            <div className="my-2.5 bg-black/50 p-2.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>BM25: {(config.query.bm25Weight * 100).toFixed(0)}%</span>
                <span>Vector: {(config.query.vectorWeight * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${config.query.bm25Weight * 100}%` }} className="bg-cyan-500 h-full" />
                <div style={{ width: `${config.query.vectorWeight * 100}%` }} className="bg-indigo-500 h-full" />
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">主动双链哨兵:</span>
                <span className={config.query.biLinkSentinel ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                  {config.query.biLinkSentinel ? 'ACTIVE 拦截' : 'PASS 允许'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>检索延迟: 18ms</span>
                <span className="text-cyan-400">Top-k: 12 实体</span>
              </div>
            </div>

            {/* Flange Indicators */}
            <div className="absolute top-[102px] -left-2 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-900" />
            <div className="absolute -bottom-2 left-[122px] w-4 h-4 rounded-full bg-purple-400 border-2 border-slate-900" />
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* STATION 4: HITL KNOWLEDGE COMPOUNDING & BACKFEED                    */}
          {/* Bounding: x 890, y 410, w 260, h 220 -> Top In (1020,410), Left Out */}
          {/* ------------------------------------------------------------------- */}
          <div
            onClick={() => setSelectedUnit('hitl')}
            className={`absolute top-[410px] left-[890px] w-[260px] h-[220px] bg-slate-900/95 rounded-3xl border p-4 backdrop-blur-md shadow-2xl transition cursor-pointer z-20 ${
              selectedUnit === 'hitl'
                ? 'border-purple-400 ring-4 ring-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                : 'border-slate-700 hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <GitCommit className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-purple-400 font-bold">NODE 04 · BACKFEED</div>
                  <div className="text-xs font-bold text-white">人在回路知识反哺 (HITL)</div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                {config.query.humanInLoop ? 'AUDIT ON' : 'AUTO WRITE'}
              </span>
            </div>

            <div className="my-2.5 bg-black/50 p-2.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">人在回路人工裁决:</span>
                <span className="text-purple-300 font-bold font-mono">
                  {config.query.humanInLoop ? 'STRICT GATE' : 'DIRECT PASS'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">关联理由 (link_reason):</span>
                <span className="text-emerald-400 font-bold">强制审计注入</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>知识复利: 写入 Layer 2</span>
              <span className="text-purple-300 font-bold">+1 Compounding</span>
            </div>

            {/* Flange Indicators */}
            <div className="absolute -top-2 left-[122px] w-4 h-4 rounded-full bg-purple-400 border-2 border-slate-900" />
            <div className="absolute top-[102px] -left-2 w-4 h-4 rounded-full bg-purple-400 border-2 border-slate-900" />
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* STATION 5: LOCAL OLLAMA DISPATCH & LINT HEALING                     */}
          {/* Bounding: x 50, y 410, w 260, h 220 -> Top In (180,410), Right Out  */}
          {/* ------------------------------------------------------------------- */}
          <div
            onClick={() => setSelectedUnit('lint')}
            className={`absolute top-[410px] left-[50px] w-[260px] h-[220px] bg-slate-900/95 rounded-3xl border p-4 backdrop-blur-md shadow-2xl transition cursor-pointer z-20 ${
              selectedUnit === 'lint'
                ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                : 'border-slate-700 hover:border-emerald-500/60'
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <Cpu className={`w-6 h-6 text-emerald-400 ${gearCwClass}`} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">NODE 05 · HEALING</div>
                  <div className="text-xs font-bold text-white">巡检自愈与本地分流</div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                {config.lint.economicRouting ? 'PORT 11434' : 'CLOUD ONLY'}
              </span>
            </div>

            <div className="my-2.5 bg-black/50 p-2.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">自愈模式:</span>
                <span className="text-emerald-400 font-bold font-mono uppercase">
                  {config.lint.autoHealing}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">经济分流 (Ollama):</span>
                <span className={config.lint.economicRouting ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {config.lint.economicRouting ? 'ENABLED (零成本)' : 'DISABLED (上云)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>巡检周期: 4小时/次</span>
              <span className="text-emerald-400 font-bold">死链修复: 99.4%</span>
            </div>

            {/* Flange Indicators */}
            <div className="absolute -top-2 left-[122px] w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900" />
            <div className="absolute top-[102px] -right-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM INTERACTIVE CONTROL BENCH (APPARATUS VIEW ONLY)                 */}
      {/* ========================================================================= */}
      {viewMode === 'apparatus' && (
        <div className="mt-4 p-4.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border border-slate-700 text-amber-400 shadow-inner">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <span>节点状态与调控:</span>
              <span className="font-mono text-amber-400 uppercase font-bold tracking-wider">
                {selectedUnit === 'raw_feeder' && 'NODE 01: Layer 1 原始输入仓与只读锁'}
                {selectedUnit === 'engine' && 'NODE 02: 多模态知识编译中枢'}
                {selectedUnit === 'turbine' && 'NODE 03: 问答检索与 qmd 混合引擎'}
                {selectedUnit === 'hitl' && 'NODE 04: 人在回路 (HITL) 知识反哺'}
                {selectedUnit === 'lint' && 'NODE 05: 巡检自愈与本地 Ollama 分流'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedUnit === 'raw_feeder' && '控制原始输入流向，支持系统级 chmod 444 只读锁，防止上游数据被覆盖或污染。'}
              {selectedUnit === 'engine' && '多模态 LayoutLMv3 版式解析与 Frontmatter 强校验，保障知识实体规范生成。'}
              {selectedUnit === 'turbine' && '调节 BM25 词法与 Vector 语义混合检索权重配比，激活主动双链拦截哨兵。'}
              {selectedUnit === 'hitl' && '对 AI 提炼的新知识进行人工审查，审核通过后回写压铸入 Layer 2 百科维基。'}
              {selectedUnit === 'lint' && '将死链与孤立术语修复任务调度至端侧 Ollama 11434 端口执行，大幅降低 API 成本。'}
            </p>
          </div>
        </div>

        {/* Quick Functional Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {selectedUnit === 'raw_feeder' && (
            <button
              onClick={onToggleVaultLock}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-md shadow-amber-600/30"
            >
              {config.ingestion.vaultReadOnly ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{config.ingestion.vaultReadOnly ? '解除锁定 (755)' : '物理锁定 (444)'}</span>
            </button>
          )}

          {selectedUnit === 'engine' && (
            <button
              onClick={() => onUpdateConfig('ingestion', 'ocrEngine', config.ingestion.ocrEngine === 'LayoutLMv3' ? 'Standard' : 'LayoutLMv3')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/30"
            >
              切换引擎: {config.ingestion.ocrEngine === 'LayoutLMv3' ? 'Standard' : 'LayoutLMv3'}
            </button>
          )}

          {selectedUnit === 'turbine' && (
            <button
              onClick={() => onUpdateConfig('query', 'biLinkSentinel', !config.query.biLinkSentinel)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-cyan-600/30"
            >
              双链哨兵: {config.query.biLinkSentinel ? '关闭拦截' : '开启拦截'}
            </button>
          )}

          {selectedUnit === 'hitl' && (
            <button
              onClick={() => onUpdateConfig('query', 'humanInLoop', !config.query.humanInLoop)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-purple-600/30"
            >
              人工审批流: {config.query.humanInLoop ? '直写模式' : '审核入库'}
            </button>
          )}

          {selectedUnit === 'lint' && (
            <button
              onClick={() => onUpdateConfig('lint', 'economicRouting', !config.lint.economicRouting)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-emerald-600/30"
            >
              Ollama分流: {config.lint.economicRouting ? '强制上云' : '启用本地'}
            </button>
          )}

          <button
            onClick={() => onSelectComponent?.(selectedUnit)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer flex items-center space-x-1"
          >
            <span>聚焦对应开关矩阵</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      )}
    </div>
  );
};
