import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Database, Stethoscope, ClipboardList, Gauge, Layers, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { FlowDots, LiveWave } from '@/components/ui/diagrams';
import compressorImg from '@/assets/images/compressor.webp';

interface S3Props {
  onNext: () => void;
  onOpenDTD: () => void;
  onOpenData: (type: 'realtime' | 'history' | 'maintenance') => void;
  onVideoState?: (playing: boolean) => void;
}

const TONES = {
  realtime: '#4f8ff7',
  history: '#8fc1ff',
  dtd: '#a78bfa',
  maintenance: '#34d399',
};

export function S3Data({ onNext, onOpenDTD, onOpenData, onVideoState }: S3Props) {
  const [v2Ended, setV2Ended] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="flex flex-col h-full px-12 md:px-20 pt-10 bg-[#002b6b] overflow-y-auto">
      <div className="max-w-4xl space-y-3 mb-4 shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          多源数据，共同描绘设备状态。<br/>
          <span className="text-blue-200 font-light text-2xl">Multiple data sources. One connected view of condition.</span>
        </h1>
      </div>

      <div className="relative flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {!v2Ended ? (
            <motion.div 
              key={`v2-video-${replayKey}`}
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="h-[430px]">
                <VideoPlaceholder 
                  id="V2" 
                  title="多源数据 (Multi-source Data)" 
                  durationMs={14000} 
                  onEnded={() => setV2Ended(true)}
                  onPlayingChange={onVideoState}
                  className="w-full h-full shadow-lg"
                />
              </div>
              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={() => setV2Ended(true)}
                  className="px-4 py-1.5 text-xs font-bold text-[#7fa3c7] hover:text-white border border-[#2f6fbf]/40 rounded-full bg-[#072457] transition-colors"
                >
                  跳过动画
                </button>
                <button
                  onClick={() => setReplayKey(k => k + 1)}
                  className="px-4 py-1.5 text-xs font-bold text-[#7fa3c7] hover:text-white border border-[#2f6fbf]/40 rounded-full bg-[#072457] transition-colors"
                >
                  重播动画
                </button>
                <button
                  onClick={() => onOpenData('realtime')}
                  className="px-4 py-1.5 text-xs font-bold text-[#7fa3c7] hover:text-white border border-[#2f6fbf]/40 rounded-full bg-[#072457] transition-colors"
                >
                  了解更多
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="console"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              {/* Convergence beams */}
              <svg viewBox="0 0 1600 620" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                {([
                  { d: 'M250,110 C450,110 580,230 770,290', tone: TONES.realtime, delay: 0.4 },
                  { d: 'M1350,110 C1150,110 1020,230 830,290', tone: TONES.history, delay: 0.6 },
                  { d: 'M250,510 C450,510 580,390 770,330', tone: TONES.dtd, delay: 0.8 },
                  { d: 'M1350,510 C1150,510 1020,390 830,330', tone: TONES.maintenance, delay: 1.0 },
                ]).map((b) => (
                  <React.Fragment key={b.d}>
                    <motion.path
                      d={b.d} fill="none" stroke={b.tone} strokeOpacity="0.5" strokeWidth="2.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: b.delay, duration: 1, ease: 'easeInOut' }}
                    />
                    <FlowDots path={b.d} count={3} duration={4.5} color={b.tone} r={3} />
                  </React.Fragment>
                ))}
              </svg>

              {/* Central core */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div className="relative">
                  <span className="absolute -inset-6 rounded-full border-2 border-dashed border-[#2f6fbf]/40 animate-[spin_24s_linear_infinite]" />
                  <span className="absolute -inset-6 rounded-full border border-[#8fc1ff]/30 marker-pulse" />
                  <img src={compressorImg} alt="空压机" className="w-32 h-32 rounded-full object-cover border-4 border-[#2f6fbf]/60 shadow-2xl shadow-[#1d5aa8]/40" />
                </div>
                <div className="mt-3 px-3 py-1 bg-[#072457] border border-[#2f6fbf]/50 rounded-full flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-white whitespace-nowrap">空压机 · 统一状态视图</span>
                </div>
              </motion.div>

              {/* TL: realtime */}
              <motion.button
                initial={{ opacity: 0, x: -30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 18 }}
                onClick={() => onOpenData('realtime')}
                className="absolute top-0 left-0 w-72 text-left bg-[#072457] rounded-xl border border-[#2f6fbf]/40 border-l-4 p-4 shadow-lg shadow-black/20 hover:border-[#4f8ff7] transition-colors group"
                style={{ borderLeftColor: TONES.realtime }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" style={{ color: TONES.realtime }} />
                    <span className="text-sm font-bold text-white">实时或近实时数据</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7fa3c7] group-hover:text-white transition-colors" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: TONES.realtime }}>Continuous / Streaming</div>
                <svg viewBox="0 0 240 44" className="w-full h-11 mb-2 bg-[#0a2a5e] rounded">
                  <LiveWave color={TONES.realtime} base={22} amp={7} speed={120} width={240} height={44} />
                </svg>
                <div className="flex flex-wrap gap-1">
                  {['温度', '振动', '压力', '电流', '运行状态', '设备事件'].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-[#0a2a5e] rounded text-[9px] text-blue-100/70 font-medium">{t}</span>
                  ))}
                </div>
              </motion.button>

              {/* TR: history */}
              <motion.button
                initial={{ opacity: 0, x: 30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 18 }}
                onClick={() => onOpenData('history')}
                className="absolute top-0 right-0 w-72 text-left bg-[#072457] rounded-xl border border-[#2f6fbf]/40 border-r-4 p-4 shadow-lg shadow-black/20 hover:border-[#8fc1ff] transition-colors group"
                style={{ borderRightColor: TONES.history }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" style={{ color: TONES.history }} />
                    <span className="text-sm font-bold text-white">历史运行数据</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7fa3c7] group-hover:text-white transition-colors" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: TONES.history }}>Historical / Logged</div>
                <svg viewBox="0 0 240 44" className="w-full h-11 mb-2 bg-[#0a2a5e] rounded">
                  <line x1="12" y1="30" x2="228" y2="30" stroke="#2f6fbf" strokeOpacity="0.4" strokeDasharray="4 4" />
                  <path d="M12,32 C60,30 120,26 170,18 C195,14 215,10 228,8" fill="none" stroke={TONES.history} strokeWidth="2" />
                  {[50, 130, 200].map((x, i) => (
                    <circle key={x} cx={x} cy={[29, 24, 12][i]} r="3" fill={i === 2 ? '#f59e0b' : TONES.history} />
                  ))}
                </svg>
                <div className="flex flex-wrap gap-1">
                  {['运行曲线', '事件日志', '报警历史', '启停记录', '控制器日志', '运行工况'].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-[#0a2a5e] rounded text-[9px] text-blue-100/70 font-medium">{t}</span>
                  ))}
                </div>
              </motion.button>

              {/* BL: DTD */}
              <motion.button
                initial={{ opacity: 0, x: -30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8, type: 'spring', stiffness: 180, damping: 18 }}
                onClick={onOpenDTD}
                className="absolute bottom-0 left-0 w-72 text-left bg-[#072457] rounded-xl border border-[#2f6fbf]/40 border-l-4 p-4 shadow-lg shadow-black/20 hover:border-[#a78bfa] transition-colors group"
                style={{ borderLeftColor: TONES.dtd }}
              >
                {/* Video guide badge */}
                <span className="absolute -top-3 -right-2 flex items-center gap-1.5 px-2.5 py-1 bg-[#a78bfa] text-white text-[10px] font-bold rounded-full shadow-lg">
                  <span className="absolute inset-0 rounded-full bg-[#a78bfa] marker-pulse" />
                  ▶ 演示视频 · 点击播放
                </span>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" style={{ color: TONES.dtd }} />
                    <span className="text-sm font-bold text-white">DTD与现场检测</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7fa3c7] group-hover:text-white transition-colors" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: TONES.dtd }}>Field / On-Demand</div>
                <div className="flex gap-1.5 mb-2">
                  {['振动检测', '声音检测', '热成像'].map((t, i) => (
                    <span key={t} className="flex items-center gap-1 px-1.5 py-0.5 bg-[#0a2a5e] rounded text-[9px] font-bold" style={{ color: TONES.dtd }}>
                      {i < 2 ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current inline-block" />}
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {['振动、声音检测', '温度测量、热成像', '检查和测试记录', '授权历史日志获取'].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-[#0a2a5e] rounded text-[9px] text-blue-100/70 font-medium">{t}</span>
                  ))}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: TONES.dtd }}>查看 DTD 详情 &gt;</div>
              </motion.button>

              {/* BR: maintenance */}
              <motion.button
                initial={{ opacity: 0, x: 30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1.0, type: 'spring', stiffness: 180, damping: 18 }}
                onClick={() => onOpenData('maintenance')}
                className="absolute bottom-0 right-0 w-72 text-left bg-[#072457] rounded-xl border border-[#2f6fbf]/40 border-r-4 p-4 shadow-lg shadow-black/20 hover:border-[#34d399] transition-colors group"
                style={{ borderRightColor: TONES.maintenance }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" style={{ color: TONES.maintenance }} />
                    <span className="text-sm font-bold text-white">维修与业务数据</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7fa3c7] group-hover:text-white transition-colors" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: TONES.maintenance }}>Maintenance / Context</div>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#0a2a5e] rounded mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: TONES.maintenance }} />
                  <span className="text-[10px] font-bold text-blue-100/90">WO-1024 滤芯更换 · 已完成</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['历史工单', '故障记录', '维修措施', '更换部件', '备件使用', '维修后验证'].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-[#0a2a5e] rounded text-[9px] text-blue-100/70 font-medium">{t}</span>
                  ))}
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {v2Ended && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            className="mt-4 mb-8 flex justify-between items-center bg-[#072457] p-5 rounded-xl border border-[#2f6fbf]/40 shadow-lg shadow-black/20 shrink-0"
          >
            <Layers className="w-8 h-8 text-[#E2001A] mr-4 shrink-0" />
            <div className="flex-1">
              <p className="text-lg text-white font-bold border-l-4 border-[#E2001A] pl-4">
                实时、历史、现场与维修数据，共同构成CBM的状态基础。
              </p>
            </div>
            <button
              onClick={() => setV2Ended(false)}
              className="px-4 py-3 text-xs font-bold text-[#7fa3c7] hover:text-white border border-[#2f6fbf]/40 rounded-full hover:bg-[#1d5aa8] transition-colors shrink-0 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 重播视频
            </button>
            <button 
              onClick={onNext}
              className="ml-3 px-8 py-4 bg-[#1d5aa8] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2f6fbf] transition-colors shrink-0"
            >
              汇聚数据
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
