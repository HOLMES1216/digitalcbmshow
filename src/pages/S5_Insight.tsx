import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, CheckCircle, Gauge, Sparkles, ArrowRight, TrendingUp, ScanSearch, ListChecks, BrainCircuit, Database, Wrench, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { RadialGauge, FlowBar } from '@/components/ui/diagrams';

interface S5Props {
  onNext: () => void;
  onOpenBasis: () => void;
  onVideoState?: (playing: boolean) => void;
  onStageChange?: (stage: string) => void;
  requestedStage?: { stage: string; token: number } | null;
}

const TIMELINE_NODES = ['历史稳定', '初期变化', '持续偏离', 'DTD专项检测', '当前状态'];
const DIMENSIONS = [
  { id: 'overall', label: '综合状态' },
  { id: 'vibration', label: '振动' },
  { id: 'temperature', label: '温度' },
  { id: 'events', label: '运行事件' },
];

const MODULES = [
  { name: '健康基线比较', icon: Gauge, desc: '将当前表现与同等工况下的历史健康基线动态对比。', result: '偏差 +8.2%' },
  { name: '趋势分析', icon: TrendingUp, desc: '识别连续数据中的缓慢漂移与速率变化。', result: '斜率 +0.34/d' },
  { name: '异常识别', icon: ScanSearch, desc: '区分单点波动与持续性异常模式。', result: '异常簇 ×2' },
  { name: '规则判断', icon: ListChecks, desc: '应用专家规则与维护阈值进行交叉验证。', result: '命中 3/5' },
  { name: '模型分析', icon: BrainCircuit, desc: '结合故障模式与服役条件评估风险等级。', result: '风险 62/100' },
  { name: 'AI Agent 辅助关联', icon: Sparkles, desc: '自动关联分散在多源数据中的相关证据。', result: '证据 ×4' },
];

/* ----- Trend chart data & coordinate system (viewBox 760x360, aspect kept) ----- */
const DAYS = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
const VIB = [52, 53, 52, 54, 55, 57, 60, 64, 69, 74, 79];
const TMP = [58, 58, 59, 59, 60, 61, 62, 63, 64, 66, 68];
const NODE_DAYS = [0, 9, 16, 21, 30]; // 历史稳定/初期变化/持续偏离/DTD专项检测/当前状态

const PLOT = { left: 56, right: 740, top: 24, bottom: 324 };
const X = (d: number) => PLOT.left + (d / 30) * (PLOT.right - PLOT.left);
const Y = (v: number) => PLOT.bottom - (v / 100) * (PLOT.bottom - PLOT.top);

function interp(xs: number[], ys: number[], x: number) {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  for (let i = 0; i < xs.length - 1; i++) {
    if (x >= xs[i] && x <= xs[i + 1]) {
      const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + t * (ys[i + 1] - ys[i]);
    }
  }
  return ys[ys.length - 1];
}

function smoothPath(xs: number[], ys: number[]) {
  let d = `M${xs[0]},${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const p0 = i === 0 ? [xs[0], ys[0]] : [xs[i - 1], ys[i - 1]];
    const p1 = [xs[i], ys[i]];
    const p2 = [xs[i + 1], ys[i + 1]];
    const p3 = i + 2 < xs.length ? [xs[i + 2], ys[i + 2]] : p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1].toFixed(1)}`;
  }
  return d;
}

const VIB_XS = DAYS.map(X);
const VIB_PATH = smoothPath(VIB_XS, VIB.map(Y));
const TMP_PATH = smoothPath(VIB_XS, TMP.map(Y));
const VIB_AREA = `${VIB_PATH} L${X(30)},${PLOT.bottom} L${X(0)},${PLOT.bottom} Z`;
const TMP_AREA = `${TMP_PATH} L${X(30)},${PLOT.bottom} L${X(0)},${PLOT.bottom} Z`;

export function S5Insight({ onNext, onOpenBasis, onVideoState, onStageChange, requestedStage }: S5Props) {
  const [stage, setStage] = useState<'insight' | 'video' | 'decide'>('insight');
  const [activeNode, setActiveNode] = useState(0);
  const [dimension, setDimension] = useState('overall');
  const [interacted, setInteracted] = useState(false);
  const [visitedDecide, setVisitedDecide] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // "Analysis in progress": modules light up one by one when the decide stage mounts
  useEffect(() => {
    if (stage !== 'decide') {
      setAnalysisStep(0);
      return;
    }
    if (analysisStep >= MODULES.length + 1) return;
    const t = setTimeout(() => setAnalysisStep((s) => s + 1), analysisStep === 0 ? 500 : 320);
    return () => clearTimeout(t);
  }, [stage, analysisStep]);

  // Report internal stage so the bottom nav can highlight correctly
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // External navigation requests (e.g. bottom nav "Decide")
  useEffect(() => {
    if (!requestedStage) return;
    if (requestedStage.stage === 'decide') {
      setStage('decide');
      setVisitedDecide(true);
    } else if (requestedStage.stage === 'insight') {
      setStage('insight');
    }
  }, [requestedStage]);

  // Auto progression: scrub the timeline automatically (curve grows step by step),
  // then move on to the V4 bridge. Any manual interaction takes over and stops this.
  useEffect(() => {
    if (stage !== 'insight' || interacted || visitedDecide) return;
    if (activeNode >= TIMELINE_NODES.length - 1) {
      const t = setTimeout(() => setStage('video'), 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveNode((n) => Math.min(n + 1, TIMELINE_NODES.length - 1)), 1800);
    return () => clearTimeout(t);
  }, [stage, activeNode, interacted, visitedDecide]);

  const nodeDay = NODE_DAYS[activeNode];

  // Smooth tween of the reveal/indicator position, so the curve grows fluidly
  // instead of jumping per node (and the chart never changes size).
  const [animX, setAnimX] = useState(X(NODE_DAYS[0]));
  const animRef = useRef(X(NODE_DAYS[0]));
  useEffect(() => {
    const target = X(nodeDay);
    const from = animRef.current;
    if (from === target) return;
    const start = performance.now();
    const dur = 900;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
      const v = from + (target - from) * e;
      animRef.current = v;
      setAnimX(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [nodeDay]);

  const indicatorX = animX;
  const clipWidth = animX;
  const animDay = ((animX - PLOT.left) / (PLOT.right - PLOT.left)) * 30;
  const vibNow = interp(DAYS, VIB, animDay).toFixed(1);
  const tmpNow = interp(DAYS, TMP, animDay).toFixed(1);

  const scrubTo = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const day = ratio * 30;
    let nearest = 0;
    NODE_DAYS.forEach((d, i) => {
      if (Math.abs(d - day) < Math.abs(NODE_DAYS[nearest] - day)) nearest = i;
    });
    setActiveNode(nearest);
    setInteracted(true);
  };

  const showVibration = dimension === 'overall' || dimension === 'vibration';
  const showTemperature = dimension === 'overall' || dimension === 'temperature';
  const showEvents = dimension === 'overall' || dimension === 'events';
  const attention = activeNode >= 2;

  return (
    <div className="flex flex-col h-full px-12 md:px-24 pt-12 bg-[#002b6b] overflow-y-auto">
      {/* Header */}
      <AnimatePresence mode="wait">
        {stage !== 'decide' ? (
          <motion.div 
            key="header-insight"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl space-y-4 mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              单点反映当下，融合数据揭示趋势。<br/>
              <span className="text-blue-200 font-light text-2xl">A data point shows the moment. Connected data reveals the trend.</span>
            </h1>
          </motion.div>
        ) : (
          <motion.div 
            key="header-decide"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-4 mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              从数据关联，到有依据的维护判断。<br/>
              <span className="text-blue-200 font-light text-2xl">From connected data to evidence-based maintenance decisions.</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative flex flex-col min-h-0">
        {/* Stage 1: Insight */}
        <AnimatePresence>
          {stage === 'insight' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* System alert (fixed-height slot: no layout shift when it appears) */}
              <div className="h-9 mb-2 shrink-0">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/50 rounded-lg transition-all duration-500",
                  attention ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                )}>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-300">发现持续性趋势偏离</span>
                  <span className="text-xs text-amber-200/70 font-medium">Sustained Trend Deviation Detected</span>
                </div>
              </div>

              <div className="flex gap-4 flex-1 min-h-0">
                {/* Chart + timeline */}
                <div className="flex-1 bg-[#072457] rounded-xl border border-[#2f6fbf]/40 p-5 flex flex-col">
                  {/* Card header: title + dimension switch */}
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-white font-bold text-sm">综合状态趋势</h3>
                      <span className="px-1.5 py-0.5 bg-[#1d5aa8]/40 text-[#8fc1ff] text-[9px] font-bold rounded">演示数据</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-full p-1">
                      {DIMENSIONS.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => { setDimension(d.id); setInteracted(true); }}
                          className={cn(
                            "px-4 h-7 rounded-full text-[11px] font-bold transition-colors",
                            dimension === d.id ? "bg-[#1d5aa8] text-white" : "text-[#7fa3c7] hover:text-white"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trend chart (aspect kept: no font distortion) */}
                  <svg viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet" className="w-full flex-1 min-h-0">
                    <defs>
                      <clipPath id="reveal"><rect x="0" y="0" width={clipWidth} height="360" /></clipPath>
                      <linearGradient id="vib-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f8ff7" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="#4f8ff7" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="tmp-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="amber-band" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.20" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                      </linearGradient>
                      <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="9" height="9" fill="#10b981" fillOpacity="0.05" />
                        <line x1="0" y1="0" x2="0" y2="9" stroke="#10b981" strokeOpacity="0.22" strokeWidth="1.5" />
                      </pattern>
                      <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="3" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Zones (aligned to Y scale) */}
                    <rect x={PLOT.left} y={Y(100)} width={PLOT.right - PLOT.left} height={Y(75) - Y(100)} fill="url(#amber-band)" />
                    <text x={PLOT.right - 8} y={Y(100) + 14} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="end">关注区间</text>
                    <rect x={PLOT.left} y={Y(65)} width={PLOT.right - PLOT.left} height={Y(45) - Y(65)} fill="url(#hatch)" stroke="#10b981" strokeOpacity="0.25" strokeDasharray="4 3" />
                    <text x={PLOT.right - 8} y={Y(65) + 14} fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="end">健康基线区间</text>

                    {/* Grid */}
                    {[0, 25, 50, 75, 100].map((v) => (
                      <line key={v} x1={PLOT.left} y1={Y(v)} x2={PLOT.right} y2={Y(v)} stroke="#2f6fbf" strokeOpacity={v === 0 ? 0 : 0.16} strokeDasharray="3 6" />
                    ))}
                    {[5, 10, 15, 20, 25].map((d) => (
                      <line key={d} x1={X(d)} y1={PLOT.top} x2={X(d)} y2={PLOT.bottom} stroke="#2f6fbf" strokeOpacity="0.07" strokeDasharray="3 6" />
                    ))}

                    {/* Axes */}
                    <line x1={PLOT.left} y1={PLOT.bottom} x2={PLOT.right} y2={PLOT.bottom} stroke="#2f6fbf" strokeOpacity="0.6" strokeWidth="1.2" />
                    <line x1={PLOT.left} y1={PLOT.top} x2={PLOT.left} y2={PLOT.bottom} stroke="#2f6fbf" strokeOpacity="0.6" strokeWidth="1.2" />

                    {/* Axis ticks & labels */}
                    {[0, 5, 10, 15, 20, 25, 30].map((d) => (
                      <g key={d}>
                        <line x1={X(d)} y1={PLOT.bottom} x2={X(d)} y2={PLOT.bottom + 5} stroke="#2f6fbf" strokeOpacity="0.6" />
                        <text x={X(d)} y={PLOT.bottom + 20} fill="#7fa3c7" fontSize="11" textAnchor="middle">Day {d}</text>
                      </g>
                    ))}
                    {[0, 25, 50, 75, 100].map((v) => (
                      <text key={v} x={PLOT.left - 10} y={Y(v) + 4} fill="#7fa3c7" fontSize="11" textAnchor="end">{v}</text>
                    ))}
                    <text x="18" y={(PLOT.top + PLOT.bottom) / 2} fill="#7fa3c7" fontSize="10" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 18 ${(PLOT.top + PLOT.bottom) / 2})`}>状态指标</text>

                    {/* Curves, revealed progressively */}
                    <g clipPath="url(#reveal)">
                      {showVibration && <path d={VIB_AREA} fill="url(#vib-area)" />}
                      {showTemperature && <path d={TMP_AREA} fill="url(#tmp-area)" />}
                      {showVibration && <path d={VIB_PATH} fill="none" stroke="#4f8ff7" strokeWidth="2.5" strokeLinecap="round" filter="url(#soft-glow)" />}
                      {showTemperature && <path d={TMP_PATH} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" filter="url(#soft-glow)" />}
                      {/* Data points */}
                      {showVibration && DAYS.map((d, i) => (
                        <circle key={`v${d}`} cx={X(d)} cy={Y(VIB[i])} r="3" fill="#072457" stroke="#4f8ff7" strokeWidth="1.8" />
                      ))}
                      {showTemperature && DAYS.map((d, i) => (
                        <circle key={`t${d}`} cx={X(d)} cy={Y(TMP[i])} r="2.4" fill="#072457" stroke="#22d3ee" strokeWidth="1.5" />
                      ))}
                      {/* Events */}
                      {showEvents && (
                        <>
                          <circle cx={X(12)} cy={Y(VIB[4])} r="4" fill="#7fa3c7" />
                          <circle cx={X(24)} cy={Y(VIB[8])} r="4" fill="#7fa3c7" />
                          {/* Maintenance node, Day 6 */}
                          <circle cx={X(6)} cy={Y(VIB[2])} r="6" fill="none" stroke="#34d399" strokeWidth="2" />
                          <circle cx={X(6)} cy={Y(VIB[2])} r="6" fill="none" stroke="#34d399" className="marker-pulse" />
                          {/* DTD inspection, Day 21 */}
                          <rect x={X(21) - 5} y={Y(VIB[7]) - 5} width="10" height="10" fill="#a78bfa" transform={`rotate(45 ${X(21)} ${Y(VIB[7])})`} />
                          <circle cx={X(21)} cy={Y(VIB[7])} r="9" fill="none" stroke="#a78bfa" className="marker-pulse" />
                        </>
                      )}
                    </g>

                    {/* Node indicator + readout */}
                    <g>
                      <line x1={indicatorX} y1={PLOT.top} x2={indicatorX} y2={PLOT.bottom}
                        stroke={attention ? '#f59e0b' : '#34d399'} strokeWidth="1.5" strokeDasharray="4 3" filter="url(#soft-glow)" />
                      <circle cx={indicatorX} cy={PLOT.top - 4} r="4" fill={attention ? '#f59e0b' : '#34d399'} />
                      <g transform={`translate(${Math.min(indicatorX + 12, 596)}, 44)`}>
                        <rect width="132" height="50" rx="8" fill="#072457" fillOpacity="0.95"
                          stroke={attention ? '#f59e0b' : '#2f6fbf'} strokeOpacity="0.7" />
                        <text x="10" y="20" fontSize="11" fontWeight="bold" fill="#4f8ff7">振动 {vibNow} mm/s</text>
                        <text x="10" y="38" fontSize="11" fontWeight="bold" fill="#22d3ee">温度 {tmpNow} °C</text>
                      </g>
                    </g>
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-3 text-[10px] font-medium text-blue-100/70 shrink-0">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#4f8ff7] rounded" />振动趋势</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#22d3ee] rounded" />温度趋势</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rotate-45 bg-[#a78bfa]" />DTD检测节点</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border-2 border-[#34d399]" />维修节点</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7fa3c7]" />运行事件</span>
                  </div>

                  {/* Scrubber timeline, aligned with the chart plot area */}
                  <div className="mt-3 shrink-0" style={{ paddingLeft: '7.37%', paddingRight: '2.63%' }}>
                    <div
                      ref={trackRef}
                      className="relative h-2 bg-[#0a2a5e] rounded-full cursor-pointer"
                      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); scrubTo(e.clientX); }}
                      onPointerMove={(e) => { if (e.buttons === 1) scrubTo(e.clientX); }}
                    >
                      <div className={cn("absolute left-0 top-0 h-2 rounded-full transition-all duration-700", attention ? "bg-amber-400" : "bg-emerald-400")}
                        style={{ width: `${(nodeDay / 30) * 100}%` }} />
                      {TIMELINE_NODES.map((_, i) => (
                        <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                          style={{ left: `${(NODE_DAYS[i] / 30) * 100}%` }}>
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 transition-all",
                            i === activeNode ? "bg-white border-[#1d5aa8] scale-125" : i < activeNode ? "bg-[#1d5aa8] border-[#1d5aa8]" : "bg-[#0a2a5e] border-[#2f6fbf]"
                          )} />
                        </div>
                      ))}
                    </div>
                    <div className="relative h-5 mt-1.5">
                      {TIMELINE_NODES.map((n, i) => (
                        <button
                          key={n}
                          onClick={() => { setActiveNode(i); setInteracted(true); }}
                          className={cn(
                            "absolute -translate-x-1/2 text-[10px] font-bold transition-colors whitespace-nowrap",
                            i === activeNode ? "text-white" : "text-[#7fa3c7] hover:text-blue-100"
                          )}
                          style={{ left: `${(NODE_DAYS[i] / 30) * 100}%` }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: current status card */}
                <div className="w-72 shrink-0 bg-[#072457] rounded-xl border border-[#2f6fbf]/40 p-5 flex flex-col">
                  <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-4 flex items-center">
                    <Gauge className="w-3.5 h-3.5 mr-1 text-[#8fc1ff]" /> 当前状态卡
                  </div>
                  <div className="flex-1 divide-y divide-[#2f6fbf]/20">
                    <div className="pb-3">
                      <div className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mb-1">当前状态</div>
                      <div className="text-lg font-bold text-white">设备仍在运行</div>
                    </div>
                    <div className="py-3">
                      <div className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mb-1">趋势</div>
                      <div className={cn("text-sm font-bold mb-2", attention ? "text-amber-300" : "text-emerald-300")}>
                        {attention ? '持续偏离健康基线' : '处于健康基线区间'}
                      </div>
                      <div className="h-1.5 rounded-full bg-[#0a2a5e] overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-700", attention ? "bg-gradient-to-r from-[#4f8ff7] to-amber-400" : "bg-emerald-400")}
                          style={{ width: `${(Number(vibNow) / 100) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-[#7fa3c7] font-medium mt-1">
                        <span>振动 {vibNow} mm/s</span><span>温度 {tmpNow} °C</span>
                      </div>
                    </div>
                    <div className="py-3">
                      <div className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mb-1.5">关注等级</div>
                      <span className={cn(
                        "inline-block px-3 py-1 rounded text-sm font-bold border",
                        attention ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      )}>
                        {attention ? '需关注' : '正常'}
                      </span>
                    </div>
                    <div className="pt-3">
                      <div className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mb-1.5">数据证据</div>
                      <div className="space-y-1.5">
                        {['连续运行数据趋势', 'DTD专项检测结果', '历史维修记录关联'].map((e, i) => (
                          <div key={e} className={cn(
                            "flex items-center gap-2 text-xs font-medium transition-opacity",
                            activeNode >= i + 2 ? "text-blue-100/90" : "text-blue-100/30"
                          )}>
                            <CheckCircle className={cn("w-3.5 h-3.5", activeNode >= i + 2 ? "text-[#8fc1ff]" : "text-[#2f6fbf]/40")} />
                            {e}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStage('video')}
                    className="mt-4 w-full py-3 bg-[#1d5aa8] text-white rounded-full font-bold text-sm hover:bg-[#2f6fbf] transition-colors"
                  >
                    开始分析
                  </button>
                </div>
              </div>

              {/* Back-to-decide shortcut after returning from decide */}
              {visitedDecide && (
                <button
                  onClick={() => setStage('decide')}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-5 py-2.5 bg-[#1d5aa8] text-white text-sm font-bold rounded-full hover:bg-[#2f6fbf] transition-colors shadow-lg"
                >
                  返回决策 <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2: V4 bridge video */}
        <AnimatePresence>
          {stage === 'video' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#002b6b] z-20"
            >
              <div className="w-full max-w-4xl h-[400px]">
                <VideoPlaceholder 
                  id="V4" 
                  title="洞察到决策桥接 (Insight to Decide)" 
                  durationMs={18000} 
                  autoPlay={true}
                  onEnded={() => { setStage('decide'); setVisitedDecide(true); }}
                  onPlayingChange={onVideoState}
                  className="w-full h-full shadow-lg"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 3: Decide — three columns */}
        <AnimatePresence>
          {stage === 'decide' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Evidence chain strip */}
              <div className="flex items-center justify-center gap-2 mb-3 shrink-0">
                {['多源输入', '分析能力', '维护判断'].map((s, i, arr) => (
                  <React.Fragment key={s}>
                    <motion.span
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.4 }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        i === arr.length - 1 ? "bg-[#1d5aa8] border-[#2f6fbf] text-white" : "bg-[#072457] border-[#2f6fbf]/40 text-[#8fc1ff]"
                      )}
                    >{s}</motion.span>
                    {i < arr.length - 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 + 0.2 }} className="w-16">
                        <FlowBar className="w-full" />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex-1 flex gap-2 min-h-0">
              {/* Left: analysis inputs (visual motifs) */}
              <div className="w-[24%] flex flex-col gap-3 overflow-y-auto">
                {[
                  { title: '状态数据', foot: '4 类数据源已接入', motif: 'wave' },
                  { title: '设备上下文', foot: '资产模型已关联', motif: 'tree' },
                  { title: '维修知识', foot: '知识库已就绪', motif: 'records' },
                ].map((g, gi) => (
                  <motion.div
                    key={g.title}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + gi * 0.15 }}
                    className="bg-[#072457] rounded-xl border border-[#2f6fbf]/40 p-4 flex-1 flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
                    {/* Visual motif */}
                    <div className="flex-1 flex items-center justify-center py-1">
                      {g.motif === 'wave' && (
                        <svg viewBox="0 0 200 56" className="w-full h-14">
                          <path d="M0,34 Q12,28 25,34 T50,32 T75,36 T100,30 T125,26 T150,22 T175,18 T200,14" fill="none" stroke="#4f8ff7" strokeWidth="2" />
                          <path d="M0,42 Q16,40 33,42 T66,40 T100,38 T133,40 T166,38 T200,36" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="5 3" className="dash-move" />
                          <path d="M0,48 L200,48" stroke="#2f6fbf" strokeOpacity="0.3" strokeDasharray="3 4" />
                          <circle cx="150" cy="22" r="3.5" fill="#a78bfa" />
                          <circle cx="200" cy="14" r="3.5" fill="#4f8ff7" />
                        </svg>
                      )}
                      {g.motif === 'tree' && (
                        <svg viewBox="0 0 200 64" className="w-full h-16">
                          <rect x="70" y="2" width="60" height="14" rx="4" fill="#0a2a5e" stroke="#2f6fbf" />
                          <text x="100" y="12" textAnchor="middle" fill="#8fc1ff" fontSize="8" fontWeight="bold">车辆</text>
                          <line x1="100" y1="16" x2="100" y2="24" stroke="#2f6fbf" />
                          <rect x="62" y="24" width="76" height="14" rx="4" fill="#0a2a5e" stroke="#2f6fbf" />
                          <text x="100" y="34" textAnchor="middle" fill="#8fc1ff" fontSize="8" fontWeight="bold">制动系统</text>
                          <line x1="100" y1="38" x2="100" y2="46" stroke="#2f6fbf" />
                          <rect x="58" y="46" width="84" height="16" rx="4" fill="#1d5aa8" stroke="#8fc1ff" />
                          <text x="100" y="57" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">空压机 ◉</text>
                        </svg>
                      )}
                      {g.motif === 'records' && (
                        <svg viewBox="0 0 200 56" className="w-full h-14">
                          <rect x="30" y="8" width="90" height="12" rx="3" fill="#0a2a5e" stroke="#2f6fbf" />
                          <rect x="38" y="24" width="90" height="12" rx="3" fill="#0a2a5e" stroke="#2f6fbf" />
                          <rect x="46" y="40" width="90" height="12" rx="3" fill="#0a2a5e" stroke="#2f6fbf" />
                          <circle cx="164" cy="40" r="12" fill="#1d5aa8" stroke="#8fc1ff" />
                          <path d="M158,40 l4,4 l8,-8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-white">{g.title}</span>
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + gi * 0.15 }}
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-300"
                      >
                        <CheckCircle className="w-3 h-3" />{g.foot}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="w-6 flex items-center shrink-0"><FlowBar className="w-full" /></div>

              {/* Middle: analysis lanes console */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="w-[38%] bg-[#072457] rounded-xl border border-[#2f6fbf]/40 p-4 flex flex-col relative overflow-hidden"
              >
                {/* Blueprint backdrop + caption */}
                <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" />
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.3em] text-[#2f6fbf] pointer-events-none">ANALYSIS</span>
                <div className="flex items-center justify-between mb-2 shrink-0 relative">
                  <div className="text-sm font-bold text-white">分析引擎 · 处理泳道</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    {analysisStep <= MODULES.length ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-[#8fc1ff] animate-pulse" /><span className="text-[#8fc1ff]">分析中 {Math.min(analysisStep, MODULES.length)}/{MODULES.length}</span></>
                    ) : (
                      <><CheckCircle className="w-3 h-3 text-emerald-400" /><span className="text-emerald-300">分析完成</span></>
                    )}
                  </div>
                </div>
                <div className="h-1 rounded-full bg-[#0a2a5e] mb-3 overflow-hidden shrink-0 relative">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#1d5aa8] to-[#8fc1ff] transition-all duration-300"
                    style={{ width: `${Math.min(100, (analysisStep / MODULES.length) * 100)}%` }} />
                </div>

                {/* Processing lanes */}
                <div className="flex-1 flex flex-col justify-center gap-2.5 min-h-0 relative">
                  {MODULES.map((m, i) => {
                    const done = i < analysisStep;
                    const active = i === analysisStep && analysisStep <= MODULES.length;
                    const isOpen = activeModule === i;
                    return (
                      <button
                        key={m.name}
                        onClick={() => done && setActiveModule(isOpen ? null : i)}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all duration-500",
                          isOpen
                            ? "bg-[#1d5aa8] border-[#8fc1ff]"
                            : done
                              ? "bg-[#0a2a5e] border-[#2f6fbf]"
                              : "bg-[#0a2a5e]/40 border-[#2f6fbf]/20 opacity-40"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                          isOpen ? "bg-white/20 border-white/40" : "bg-[#072457] border-[#2f6fbf]/40"
                        )}>
                          <m.icon className={cn("w-4 h-4", isOpen ? "text-white" : done ? "text-[#8fc1ff]" : "text-[#2f6fbf]/50")} />
                        </div>
                        <div className="w-24 shrink-0">
                          <div className="text-xs font-bold text-white leading-tight">{m.name}</div>
                        </div>
                        {/* Lane track */}
                        <div className="flex-1 h-1.5 rounded-full bg-[#041a3f] overflow-hidden relative">
                          {done ? (
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.4 }}
                              className="h-full rounded-full bg-gradient-to-r from-[#1d5aa8] to-[#8fc1ff]"
                            />
                          ) : active ? (
                            <motion.div
                              animate={{ x: ['-100%', '300%'] }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#8fc1ff] to-transparent"
                            />
                          ) : null}
                        </div>
                        {/* Lane result readout */}
                        <div className="w-20 shrink-0 text-right">
                          {done ? (
                            <motion.span
                              initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                              className="text-[10px] font-bold font-mono text-[#8fc1ff]"
                            >
                              {m.result}
                            </motion.span>
                          ) : active ? (
                            <span className="w-2 h-2 rounded-full bg-[#8fc1ff] animate-ping inline-block" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#2f6fbf]/30 inline-block" />
                          )}
                        </div>
                        <div className="w-5 shrink-0 flex justify-center">
                          {done && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {activeModule !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden shrink-0"
                    >
                      <div className="mt-2 px-3 py-2.5 bg-[#1d5aa8]/30 border border-[#2f6fbf]/40 rounded-lg text-xs text-blue-100/90 font-medium">
                        {MODULES[activeModule].desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="w-6 flex items-center shrink-0"><FlowBar amber={analysisStep > MODULES.length} className="w-full" /></div>

              {/* Right: result card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                className="w-[38%] bg-[#072457] rounded-xl border border-[#2f6fbf]/40 p-5 flex flex-col overflow-y-auto relative"
              >
                {/* HUD corner accents */}
                {['top-1.5 left-1.5 border-t border-l', 'top-1.5 right-1.5 border-t border-r', 'bottom-1.5 left-1.5 border-b border-l', 'bottom-1.5 right-1.5 border-b border-r'].map((cls) => (
                  <span key={cls} className={cn("absolute w-4 h-4 border-[#2f6fbf] pointer-events-none", cls)} />
                ))}

                {/* Verdict stamp, slams in when analysis completes */}
                {analysisStep > MODULES.length && (
                  <motion.div
                    initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
                    animate={{ scale: 1, opacity: 1, rotate: -8 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 17, delay: 0.15 }}
                    className="absolute top-5 right-5 z-10 px-3 py-1.5 border-[3px] border-amber-400/80 rounded-md text-amber-300 font-bold text-xs tracking-[0.2em] bg-[#072457]/80"
                  >
                    P2 · 计划性关注
                  </motion.div>
                )}

                <div className="flex items-center gap-5 mb-4">
                  <RadialGauge value={78} label="健康指数" sublabel="示例值" />
                  <div>
                    <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-1">当前状态</div>
                    <div className="text-xl font-bold text-white mb-2">设备仍在运行</div>
                    <span className="inline-block bg-amber-500/20 text-amber-300 px-3 py-1 rounded text-sm font-bold border border-amber-500/50 animate-pulse">需关注</span>
                  </div>
                </div>

                {/* Sub metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: '振动风险', v: 72, tone: 'bg-amber-400' },
                    { label: '温度偏差', v: 24, tone: 'bg-[#22d3ee]' },
                    { label: '证据一致性', v: 90, tone: 'bg-emerald-400' },
                  ].map((m, i) => (
                    <div key={m.label} className="bg-[#0a2a5e] rounded-lg border border-[#2f6fbf]/40 p-2.5">
                      <div className="text-[9px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-1.5">{m.label}</div>
                      <div className="h-1.5 rounded-full bg-[#072457] overflow-hidden mb-1">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${m.v}%` }} transition={{ delay: 1.2 + i * 0.2, duration: 0.8 }}
                          className={cn("h-full rounded-full", m.tone)}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-blue-100/80">{m.v}%</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm flex-1">
                  {/* Baseline vs current mini chart */}
                  <div className="bg-[#0a2a5e] rounded-lg border border-[#2f6fbf]/40 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest">基线对比 · 振动</span>
                      <div className="flex items-center gap-3 text-[9px] font-medium text-blue-100/60">
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400" />健康基线</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#4f8ff7]" />当前</span>
                      </div>
                    </div>
                    <svg viewBox="0 0 320 110" className="w-full h-24">
                      <rect x="10" y="58" width="300" height="26" fill="#10b981" fillOpacity="0.12" />
                      <rect x="10" y="14" width="300" height="22" fill="#f59e0b" fillOpacity="0.10" />
                      <line x1="10" y1="71" x2="310" y2="71" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 4" />
                      <path d="M10,74 C70,72 140,68 190,58 C240,48 280,32 310,20" fill="none" stroke="#4f8ff7" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M10,74 C70,72 140,68 190,58 C240,48 280,32 310,20 L310,100 L10,100 Z" fill="#4f8ff7" fillOpacity="0.10" />
                      <circle cx="310" cy="20" r="4" fill="#f59e0b" />
                      <text x="16" y="52" fill="#34d399" fontSize="8" fontWeight="bold">基线区间</text>
                      <text x="304" y="12" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="end">当前已偏离</text>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-blue-100/60 font-medium mb-1.5">主要证据</div>
                    <div className="space-y-1.5">
                      {['连续运行数据与DTD专项检测结果相互印证', '趋势特征符合早期磨损模式', '维修历史与当前偏离时点吻合'].map((e, i) => (
                        <motion.div
                          key={e}
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 + i * 0.25 }}
                          className="flex items-start gap-2 text-xs text-blue-100/90 font-medium"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#8fc1ff] mt-0.5 shrink-0" />
                          {e}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#1d5aa8]/30 p-3 rounded-lg border border-[#2f6fbf]/40 relative overflow-hidden">
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4f8ff7] to-[#8fc1ff]" />
                    <div className="text-xs text-blue-100/60 font-medium mb-0.5">建议行动</div>
                    <div className="text-white font-bold">在下一计划维护窗口开展专项检查。</div>
                    <div className="text-xs text-blue-100/70 font-medium mt-1">准备事项：确认相关易损件和备件可用性。</div>
                  </div>
                  {/* Confidence & completeness */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '诊断置信度', v: 87 },
                      { label: '数据完整度', v: 92 },
                    ].map((c, i) => (
                      <div key={c.label}>
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-[#7fa3c7]">{c.label}</span>
                          <span className="text-blue-100/90">{c.v}%<span className="text-[#7fa3c7] font-medium ml-1">示例值</span></span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#0a2a5e] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${c.v}%` }} transition={{ delay: 1.8 + i * 0.2, duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#1d5aa8] to-[#8fc1ff]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setStage('insight')}
                    className="flex-1 py-2.5 text-xs font-bold text-[#8fc1ff] border border-[#2f6fbf]/40 rounded-full hover:bg-[#0a2a5e] transition-colors"
                  >
                    查看趋势证据
                  </button>
                  <button
                    onClick={onOpenBasis}
                    className="flex-1 py-2.5 text-xs font-bold text-[#8fc1ff] border border-[#2f6fbf]/40 rounded-full hover:bg-[#0a2a5e] transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3 h-3" /> 查看分析依据
                  </button>
                </div>
              </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <AnimatePresence>
        {stage === 'decide' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 mb-12 flex justify-between items-center bg-[#072457] p-6 rounded-xl border border-[#2f6fbf]/40 shadow-lg shadow-black/20"
          >
            <div className="flex-1 flex items-center">
              <Sparkles className="w-5 h-5 text-[#E2001A] mr-3 shrink-0" />
              <p className="text-lg text-white font-bold border-l-4 border-[#E2001A] pl-4">
                AI辅助工程人员关联状态数据、设备上下文、维修知识和历史经验，形成可解释、可追溯的维护建议。
              </p>
            </div>
            <button 
              onClick={onNext}
              className="ml-8 px-8 py-4 bg-[#1d5aa8] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2f6fbf] transition-colors shrink-0"
            >
              创建维护任务
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
