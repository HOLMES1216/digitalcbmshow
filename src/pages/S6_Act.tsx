import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, ArrowRight, RefreshCw, Database, CheckCircle2, ClipboardList, Calendar, Package, Wrench, Upload, FileCheck, Radar, Search, CalendarCheck, Zap, History, BookOpen, ListChecks, BrainCircuit, ChevronRight, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { FlowDots, FlowBar } from '@/components/ui/diagrams';

interface S6Props {
  onNext: () => void;
  onVideoState?: (playing: boolean) => void;
  onStageChange?: (stage: string) => void;
  requestedStage?: { stage: string; token: number } | null;
}

const FLOW_NODES = [
  { icon: FileCheck, label: '建议' },
  { icon: ClipboardList, label: '工单' },
  { icon: Radar, label: '优先级' },
  { icon: Calendar, label: '排程' },
  { icon: Package, label: '备件' },
  { icon: Wrench, label: '现场执行' },
  { icon: Upload, label: '结果上传' },
];

const FEEDBACK_ITEMS = ['检查结果', '现场照片', '实际维修措施', '更换部件', '故障根因', '维修后验证', '工程师反馈'];
const SINK_ITEMS = [
  { label: '设备履历', icon: History },
  { label: '维修知识库', icon: BookOpen },
  { label: '故障数据库', icon: Database },
  { label: '分析规则', icon: ListChecks },
  { label: '模型验证', icon: BrainCircuit },
];

const VALUES = [
  { title: '更早识别', icon: Radar, desc: '在故障前识别值得关注的状态变化。' },
  { title: '更完整理解', icon: Search, desc: '结合不同来源和时间的数据理解设备状态。' },
  { title: '更有依据规划', icon: CalendarCheck, desc: '支持维护窗口、人员、任务和备件安排。' },
  { title: '更高效执行', icon: Zap, desc: '将状态洞察连接到工单和现场行动。' },
];

export function S6Act({ onNext, onVideoState, onStageChange, requestedStage }: S6Props) {
  const [stage, setStage] = useState<'act' | 'improve'>('act');
  const [v5Ended, setV5Ended] = useState(false);
  const [v5Progress, setV5Progress] = useState(0);
  const [syncState, setSyncState] = useState<'idle' | 'uploading' | 'synced'>('idle');

  // Two-end sync demo: mobile upload -> sync burst -> portal confirms receipt
  const triggerSync = () => {
    if (syncState !== 'idle') return;
    setSyncState('uploading');
    setTimeout(() => setSyncState('synced'), 1400);
  };

  // Report internal stage so the bottom nav can highlight correctly
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // External navigation requests (e.g. bottom nav "Improve")
  useEffect(() => {
    if (!requestedStage) return;
    if (requestedStage.stage === 'improve') {
      setStage('improve');
    } else if (requestedStage.stage === 'act') {
      setStage('act');
    }
  }, [requestedStage]);

  const litNodes = Math.min(FLOW_NODES.length, Math.floor((v5Progress / 100) * FLOW_NODES.length) + (v5Progress > 2 ? 1 : 0));

  return (
    <div className="flex flex-col h-full px-12 md:px-24 pt-12 bg-[#002b6b] overflow-y-auto">
      <AnimatePresence mode="wait">
        {stage === 'act' ? (
          <motion.div key="act-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              让状态洞察进入维护流程。<br/>
              <span className="text-blue-200 font-light text-2xl">Turn condition insight into maintenance action.</span>
            </h1>
          </motion.div>
        ) : (
          <motion.div key="improve-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              让每一次行动，成为下一次判断的依据。<br/>
              <span className="text-blue-200 font-light text-2xl">Make every action part of the next decision.</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative flex items-center justify-center min-h-0">
        <AnimatePresence mode="wait">
          {stage === 'act' ? (
            <motion.div key="act-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-5xl flex flex-col items-center">
              {!v5Ended ? (
                <div className="w-full max-w-4xl">
                  <div className="h-[400px]">
                    <VideoPlaceholder 
                      id="V5" 
                      title="维护行动流程 (Maintenance Action)" 
                      durationMs={20000} 
                      onEnded={() => setV5Ended(true)}
                      onPlayingChange={onVideoState}
                      onProgress={setV5Progress}
                      className="w-full h-full shadow-lg"
                    />
                  </div>
                  {/* Flow nodes light up with video progress */}
                  <div className="flex justify-between mt-4 px-2">
                    {FLOW_NODES.map((n, i) => (
                      <div key={n.label} className="flex flex-col items-center gap-1.5">
                        <div className={cn(
                          "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                          i < litNodes ? "bg-[#1d5aa8] border-[#2f6fbf] scale-110" : "bg-[#072457] border-[#2f6fbf]/40"
                        )}>
                          <n.icon className={cn("w-4 h-4", i < litNodes ? "text-white" : "text-[#7fa3c7]")} />
                        </div>
                        <span className={cn("text-[10px] font-bold transition-colors", i < litNodes ? "text-white" : "text-[#7fa3c7]")}>{n.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div 
                  key="v5-static"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-full flex items-stretch gap-6">
                    {/* ===== Web Portal mockup ===== */}
                    <motion.div
                      initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                      className="flex-1 rounded-xl overflow-hidden border border-[#2f6fbf]/50 shadow-2xl shadow-black/40 bg-[#041a3f]"
                    >
                      {/* Browser chrome */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#072457] border-b border-[#2f6fbf]/40">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E2001A]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        <span className="ml-3 flex-1 max-w-xs px-3 py-0.5 bg-[#041a3f] rounded text-[10px] text-[#7fa3c7] font-mono">cbm.knorr-bremse.cn/portal</span>
                      </div>
                      <div className="flex">
                        {/* Sidebar */}
                        <div className="w-28 shrink-0 bg-[#072457] border-r border-[#2f6fbf]/40 py-3 px-2 flex flex-col gap-1">
                          <div className="px-2 pb-2 mb-1 border-b border-[#2f6fbf]/40">
                            <div className="text-[10px] font-bold text-white">CBM Portal</div>
                            <div className="text-[8px] text-[#7fa3c7]">Fleet Console</div>
                          </div>
                          {['总览', '资产', '工单', '报表', '设置'].map((n) => (
                            <span key={n} className={cn(
                              "px-2 py-1.5 rounded text-[10px] font-bold",
                              n === '工单' ? "bg-[#1d5aa8] text-white" : "text-[#7fa3c7]"
                            )}>{n}</span>
                          ))}
                        </div>
                        {/* Main */}
                        <div className="flex-1 p-3 min-w-0">
                          {/* Page header */}
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2 text-[10px] text-[#7fa3c7] font-medium">
                              工单管理 <ChevronRight className="w-3 h-3" /> <span className="text-white font-bold">WO-2024-118</span>
                            </div>
                            <span className={cn(
                              "px-2 py-0.5 text-[9px] font-bold rounded-full border transition-colors",
                              syncState === 'synced'
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                                : "bg-[#1d5aa8]/40 border-[#2f6fbf] text-[#8fc1ff]"
                            )}>
                              {syncState === 'synced' ? '已回传' : '执行中'}
                            </span>
                          </div>

                          {/* Sync toast from mobile */}
                          <AnimatePresence>
                            {syncState === 'synced' && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                className="overflow-hidden mb-2.5"
                              >
                                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-500/15 border border-emerald-500/50 rounded-lg">
                                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[10px] font-bold text-emerald-300">收到现场回传：检测数据 + 3 张照片 · 刚刚</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {/* KPI cards */}
                          <div className="grid grid-cols-4 gap-2 mb-2.5">
                            {[
                              { l: '优先级', v: 'P2', s: '计划性关注', tone: 'text-amber-300' },
                              { l: '维护窗口', v: '周五 22:00', s: '下一窗口', tone: 'text-white' },
                              { l: '备件状态', v: '已确认', s: '滤芯/密封件', tone: 'text-emerald-300' },
                              { l: '负责人', v: '张工', s: '现场工程师', tone: 'text-white' },
                            ].map((k, i) => (
                              <motion.div
                                key={k.l}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                                className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-2"
                              >
                                <div className="text-[8px] text-[#7fa3c7] font-bold uppercase tracking-widest">{k.l}</div>
                                <div className={cn("text-xs font-bold", k.tone)}>{k.v}</div>
                                <div className="text-[8px] text-blue-100/50">{k.s}</div>
                              </motion.div>
                            ))}
                          </div>
                          {/* Chart + progress */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-2">
                              <div className="text-[9px] text-[#7fa3c7] font-bold mb-1">振动趋势 · 关联工单</div>
                              <svg viewBox="0 0 200 56" className="w-full h-12">
                                <rect x="4" y="30" width="192" height="14" fill="#10b981" fillOpacity="0.10" />
                                <path d="M4,38 C40,36 80,34 120,26 C150,20 175,14 196,8" fill="none" stroke="#4f8ff7" strokeWidth="2" />
                                <circle cx="196" cy="8" r="3" fill="#f59e0b" />
                              </svg>
                            </div>
                            <div className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-2">
                              <div className="text-[9px] text-[#7fa3c7] font-bold mb-1.5">任务进度</div>
                              <div className="space-y-1.5">
                                {['创建', '排程', '分配', '备件确认'].map((s, i) => (
                                  <motion.div
                                    key={s}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.15 }}
                                    className="flex items-center gap-1.5 text-[9px] font-bold text-blue-100/80"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />{s}
                                  </motion.div>
                                ))}
                                <motion.div
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
                                  className="flex items-center gap-1.5 text-[9px] font-bold text-[#8fc1ff]"
                                >
                                  {syncState === 'synced' ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-300">现场执行 · 已回传</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-3 h-3 rounded-full border-2 border-[#8fc1ff] border-t-transparent animate-spin inline-block" />现场执行
                                    </>
                                  )}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* ===== Sync channel between the two ends ===== */}
                    <div className="w-16 shrink-0 flex flex-col items-center justify-center gap-2">
                      <motion.div
                        animate={syncState === 'uploading' ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: syncState === 'uploading' ? Infinity : 0, duration: 0.6 }}
                        className={cn(
                          "w-11 h-11 rounded-full border flex items-center justify-center transition-colors",
                          syncState === 'synced' ? "bg-emerald-500/20 border-emerald-400/60" : "bg-[#072457] border-[#2f6fbf]/50"
                        )}
                      >
                        {syncState === 'synced' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <RefreshCw className={cn("w-5 h-5 text-[#8fc1ff]", syncState === 'uploading' && "animate-spin")} />
                        )}
                      </motion.div>
                      <div className="flex gap-1 h-24">
                        <div className={cn("w-[3px] flow-y rounded-full", syncState === 'idle' && "opacity-40")} />
                        <div className={cn("w-[3px] flow-y-rev rounded-full", syncState === 'idle' && "opacity-40")} />
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold tracking-widest whitespace-nowrap transition-colors",
                        syncState === 'synced' ? "text-emerald-300" : "text-[#7fa3c7]"
                      )}>
                        {syncState === 'synced' ? '已同步' : '实时同步'}
                      </span>
                    </div>

                    {/* ===== Mobile mockup ===== */}
                    <motion.div
                      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                      className="w-60 shrink-0 rounded-[1.8rem] border-4 border-[#0a2a5e] bg-[#041a3f] overflow-hidden shadow-2xl shadow-black/40 flex flex-col"
                    >
                      {/* Phone status bar */}
                      <div className="flex justify-between items-center px-4 pt-2 text-[8px] text-[#7fa3c7]">
                        <span>22:00</span>
                        <span className="w-12 h-3.5 bg-[#0a2a5e] rounded-full" />
                        <span>5G ▮</span>
                      </div>
                      {/* Mini-APP header */}
                      <div className="px-3 py-2 bg-[#0a2a5e] border-b border-[#2f6fbf]/40 flex items-center gap-2 mt-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-white">CBM现场助手 · Mini-APP</span>
                      </div>
                      <div className="p-3 space-y-2.5 flex-1">
                        {/* Task card */}
                        <div className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-white">WO-2024-118</span>
                            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[8px] font-bold rounded">P2</span>
                          </div>
                          <div className="text-[9px] text-blue-100/70">空压机专项检查 · 3车供风单元</div>
                        </div>
                        {/* Checklist */}
                        <div className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-2.5 space-y-1.5">
                          <div className="text-[9px] text-[#7fa3c7] font-bold">检查清单</div>
                          {['外观与管路检查', '振动与声音检测', '温度与热成像', '数据复核上传'].map((c, i) => (
                            <motion.div
                              key={c}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.15 }}
                              className="flex items-center gap-2 text-[10px] font-medium text-blue-100/90"
                            >
                              {i < 3 || syncState === 'synced' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#8fc1ff] border-t-transparent animate-spin inline-block" />
                              )}
                              {c}
                            </motion.div>
                          ))}
                        </div>
                        {/* Photo upload */}
                        <div className={cn(
                          "border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 text-[9px] font-bold transition-colors",
                          syncState === 'synced' ? "border-emerald-500/50 text-emerald-300" : "border-[#2f6fbf]/50 text-[#7fa3c7]"
                        )}>
                          <Upload className="w-3.5 h-3.5" /> 照片与检测数据 {syncState === 'synced' ? '4/4' : '2/4'}
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={triggerSync}
                            disabled={syncState !== 'idle'}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1.5",
                              syncState === 'synced'
                                ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-300"
                                : "bg-[#1d5aa8] text-white hover:bg-[#2f6fbf]"
                            )}
                          >
                            {syncState === 'uploading' ? (
                              <><span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />上传中…</>
                            ) : syncState === 'synced' ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" />已回传</>
                            ) : '上传结果'}
                          </button>
                          <span className={cn(
                            "flex-1 text-center py-2 rounded-lg text-[10px] font-bold transition-colors",
                            syncState === 'synced'
                              ? "bg-emerald-500 text-white"
                              : "border border-emerald-500/60 text-emerald-300"
                          )}>
                            完成确认
                          </span>
                        </div>
                      </div>
                      {/* App tab bar + home indicator */}
                      <div className="border-t border-[#2f6fbf]/40 bg-[#072457] flex justify-around py-1.5">
                        <span className="flex flex-col items-center gap-0.5 text-[#8fc1ff]">
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-bold">任务</span>
                        </span>
                        <span className="flex flex-col items-center gap-0.5 text-[#7fa3c7] relative">
                          <Bell className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-bold">消息</span>
                          {syncState !== 'synced' && <span className="absolute -top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#E2001A]" />}
                        </span>
                        <span className="flex flex-col items-center gap-0.5 text-[#7fa3c7]">
                          <Wrench className="w-3.5 h-3.5" />
                          <span className="text-[7px] font-bold">我的</span>
                        </span>
                      </div>
                      <div className="flex justify-center py-1 bg-[#072457]">
                        <span className="w-16 h-1 rounded-full bg-[#2f6fbf]/60" />
                      </div>
                    </motion.div>
                  </div>

                  <p className="mt-8 text-xl text-white font-bold tracking-wider">建议不是终点，执行才形成价值。</p>
                  <p className="mt-1 text-sm text-blue-300 font-light">Insight creates value only when it leads to action.</p>

                  <button
                    onClick={() => setStage('improve')}
                    className="mt-6 px-8 py-4 bg-[#1d5aa8] text-white rounded-full font-bold text-sm hover:bg-[#2f6fbf] transition-colors flex items-center gap-2"
                  >
                    查看反馈如何优化下一次判断 <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="improve-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl flex flex-col gap-4">
              {/* Knowledge sedimentation console */}
              <div className="bg-[#072457] rounded-xl border border-[#2f6fbf]/40 p-5 relative overflow-hidden">
                <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.3em] text-[#2f6fbf] pointer-events-none">KNOWLEDGE REFLOW</span>
                <div className="flex items-center justify-between mb-4 relative">
                  <div className="text-sm font-bold text-white flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-[#8fc1ff]" /> 维修反馈回流控制台</div>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-300 tracking-widest">VERIFIED FLOW</span>
                  </div>
                </div>

                <div className="flex gap-3 items-stretch">
                  {/* Inflow: uploaded results */}
                  <div className="w-52 shrink-0 space-y-1.5">
                    <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-2">上传的维修结果</div>
                    {FEEDBACK_ITEMS.map((t, i) => (
                      <motion.div
                        key={t}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="px-2.5 py-1.5 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-lg text-[11px] text-blue-100/80 font-medium"
                      >
                        {t}
                      </motion.div>
                    ))}
                  </div>

                  {/* Conveyor + verification */}
                  <div className="w-14 shrink-0 flex flex-col items-center justify-center gap-2">
                    <FlowBar className="w-full" />
                    <span className="px-2 py-1 bg-emerald-500/15 border border-emerald-500/50 rounded text-[9px] font-bold text-emerald-300 whitespace-nowrap">验证</span>
                    <FlowBar className="w-full" />
                  </div>

                  {/* Knowledge asset tanks */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between flex-1">
                      {SINK_ITEMS.map((t, i) => {
                        const level = [78, 64, 52, 46, 38][i];
                        return (
                          <motion.div
                            key={t.label}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.12 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className="relative w-16 h-36 rounded-lg border border-[#2f6fbf]/50 bg-[#041a3f] overflow-hidden">
                              {/* Tank top cap */}
                              <span className="absolute top-0 left-0 right-0 h-1 bg-[#2f6fbf]/40" />
                              {/* Level ticks */}
                              {[25, 50, 75].map((t) => (
                                <span key={t} className="absolute right-0 w-1.5 h-px bg-[#2f6fbf]/60" style={{ bottom: `${t}%` }} />
                              ))}
                              <motion.div
                                initial={{ height: '3%' }}
                                animate={{ height: `${level}%` }}
                                transition={{ delay: 0.8 + i * 0.2, duration: 1.6, ease: 'easeInOut' }}
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1d5aa8] to-[#4f8ff7]"
                              >
                                <motion.svg
                                  viewBox="0 0 100 10" preserveAspectRatio="none"
                                  className="absolute -top-2 left-0 h-2.5 w-[200%]"
                                  animate={{ x: ['0%', '-50%'] }}
                                  transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'linear' }}
                                >
                                  <path d="M0,5 Q12.5,0 25,5 T50,5 T75,5 T100,5 T125,5 T150,5 T175,5 T200,5 L200,10 L0,10 Z" fill="#6ea8ff" fillOpacity="0.85" />
                                </motion.svg>
                              </motion.div>
                              {/* Glass shine */}
                              <span className="absolute inset-y-0 left-1 w-2 bg-gradient-to-r from-white/10 to-transparent rounded-full pointer-events-none" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <t.icon className="w-6 h-6 text-white/85" />
                              </div>
                              <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white/80">{level}%</span>
                            </div>
                            <span className="text-[10px] font-bold text-blue-100/80 text-center leading-tight">{t.label}</span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Return pipe back to Data */}
                    <svg viewBox="0 0 800 56" preserveAspectRatio="none" className="w-full h-12 mt-2 relative">
                      {/* Pipe body: double line + collars */}
                      <path d="M760,24 C560,24 320,24 96,24" fill="none" stroke="#2f6fbf" strokeOpacity="0.4" strokeWidth="1.5" />
                      <path d="M760,32 C560,32 320,32 96,32" fill="none" stroke="#2f6fbf" strokeOpacity="0.4" strokeWidth="1.5" />
                      {[200, 340, 480, 620].map((x) => (
                        <rect key={x} x={x} y="20" width="8" height="16" rx="2" fill="#072457" stroke="#2f6fbf" strokeOpacity="0.6" />
                      ))}
                      <FlowDots path="M760,28 C560,28 320,28 96,28" count={4} duration={6} color="#8fc1ff" r={3} />
                      <circle cx="52" cy="28" r="16" fill="#1d5aa8" stroke="#8fc1ff" strokeWidth="1.5" />
                      <text x="52" y="32" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Data</text>
                      <text x="120" y="14" fill="#7fa3c7" fontSize="9">回流至 Data · 支持下一次判断</text>
                    </svg>
                  </div>
                </div>

                <p className="mt-2 text-xs text-blue-100/70 font-medium border-t border-[#2f6fbf]/40 pt-3">
                  经验证的维修反馈持续沉淀为知识资产，支持规则和模型受控迭代。
                </p>
              </div>

              {/* Values row */}
              <div className="grid grid-cols-4 gap-3">
                {VALUES.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#072457] p-4 rounded-xl border border-[#2f6fbf]/40 flex flex-col relative overflow-hidden transition-colors hover:border-[#2f6fbf]"
                  >
                    <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1d5aa8] to-[#8fc1ff]" />
                    <v.icon className="w-5 h-5 text-[#E2001A] mb-2" />
                    <div className="text-white font-bold text-sm mb-1">{v.title}</div>
                    <p className="text-xs text-blue-100/70 font-medium leading-relaxed flex-1">{v.desc}</p>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: '55%' }} transition={{ delay: 1.5 + i * 0.12, duration: 0.7 }}
                      className="h-0.5 rounded-full bg-gradient-to-r from-[#2f6fbf] to-transparent mt-2"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === 'improve' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-12 flex justify-end items-center bg-[#072457] p-6 rounded-xl border border-[#2f6fbf]/40 shadow-lg shadow-black/20"
          >
            <button 
              onClick={onNext}
              className="px-8 py-4 bg-[#1d5aa8] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2f6fbf] transition-colors shrink-0 flex items-center gap-2"
            >
              查看CBM服务覆盖 <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
