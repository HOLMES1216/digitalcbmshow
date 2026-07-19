import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Database, Stethoscope, ClipboardList, Download, CheckCircle2, Clock, FileText, Link, Layers, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowDots } from '@/components/ui/diagrams';
import { ArchitectureOverlay } from '@/components/ui/ArchitectureOverlay';

interface S4Props {
  onNext: () => void;
  onOpenArchitecture: () => void;
}

const CHANNELS = [
  { icon: Activity, name: '实时或近实时数据', type: 'Streaming', tone: '#4f8ff7', y: 120 },
  { icon: Database, name: '历史运行数据', type: 'Batch', tone: '#8fc1ff', y: 275 },
  { icon: Stethoscope, name: 'DTD与现场检测', type: 'On-Demand', tone: '#a78bfa', y: 430 },
  { icon: ClipboardList, name: '维修与业务数据', type: 'Context', tone: '#34d399', y: 585 },
];

const NODES = [
  { icon: Download, name: '接入', en: 'Ingest', desc: '通过实时流、API、文件或任务型方式接入。' },
  { icon: CheckCircle2, name: '校验', en: 'Validate', desc: '检查数据完整性、格式和有效性。' },
  { icon: Clock, name: '时间同步', en: 'Align', desc: '将不同采样频率和来源的数据对齐到统一时间轴。' },
  { icon: FileText, name: '标准化', en: 'Standardize', desc: '将不同格式的数据转换为统一结构。' },
  { icon: Link, name: '设备关联', en: 'Associate', desc: '将数据对应到车辆、系统、设备和具体部件。' },
  { icon: Layers, name: '工况上下文化', en: 'Contextualize', desc: '将状态变化与运行负载、环境和维护任务关联。' },
];

const TECH_LABELS = ['Encrypted', 'Authenticated', 'Validated', 'Standardized', 'Contextualized', 'Traceable'];

const TIMELINE_ITEMS = ['运行状态', '温度和振动', '历史事件', 'DTD检测节点', '维护节点', '当前状态'];

const NODE_Y = (i: number) => 90 + i * 108;

function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (60 * k - 30) * (Math.PI / 180);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  });
  return `M${pts.join(' L')} Z`;
}

export function S4Unify({ onNext, onOpenArchitecture }: S4Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [archOpen, setArchOpen] = useState(false);

  return (
    <div className="flex flex-col h-full px-12 md:px-16 pt-8 bg-[#002b6b] overflow-y-auto">
      <div className="max-w-4xl space-y-3 mb-2 shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          将分散的数据，连接成连续的状态视图。<br/>
          <span className="text-blue-200 font-light text-2xl">Turn fragmented data into a connected view of condition.</span>
        </h1>
      </div>

      {/* Full-canvas convergence diagram */}
      <div className="flex-1 min-h-0 relative">
        <svg viewBox="0 0 1600 720" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          <defs>
            <linearGradient id="s4-spine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f6fbf" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8fc1ff" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Channel cards (left) */}
          {CHANNELS.map((c, i) => (
            <motion.g key={c.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
              <rect x="40" y={c.y - 52} width="260" height="104" rx="14" fill="#072457" stroke="#2f6fbf" strokeOpacity="0.4" />
              <rect x="40" y={c.y - 52} width="5" height="104" rx="2.5" fill={c.tone} />
              <circle cx="88" cy={c.y} r="22" fill="#0a2a5e" stroke={c.tone} strokeOpacity="0.6" />
              <g transform={`translate(88,${c.y})`}>
                <c.icon x={-11} y={-11} width={22} height={22} style={{ color: c.tone }} />
              </g>
              <text x="124" y={c.y - 8} fill="#ffffff" fontSize="17" fontWeight="bold">{c.name}</text>
              <text x="124" y={c.y + 16} fill="#7fa3c7" fontSize="11" fontWeight="bold" letterSpacing="2">{c.type.toUpperCase()}</text>
              <circle cx="282" cy={c.y} r="4" fill={c.tone}>
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
              </circle>
            </motion.g>
          ))}

          {/* Channel curves into the spine */}
          {CHANNELS.map((c, i) => {
            const endY = 70 + i * 18;
            const d = `M300,${c.y} C470,${c.y} 540,${endY} 700,${endY}`;
            return (
              <React.Fragment key={`curve-${i}`}>
                <motion.path
                  d={d} fill="none" stroke={c.tone} strokeOpacity="0.45" strokeWidth="2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: 'easeInOut' }}
                />
                <FlowDots path={d} count={3} duration={5 + i} color={c.tone} r={3} paused={selected !== null} />
              </React.Fragment>
            );
          })}

          {/* Pipeline spine */}
          <motion.line
            x1="700" y1="60" x2="700" y2="665"
            stroke="url(#s4-spine)" strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.1, duration: 1, ease: 'easeInOut' }}
          />
          <FlowDots path="M700,60 L700,665" count={5} duration={6} color="#8fc1ff" r={3.5} paused={selected !== null} />

          {/* Pipeline nodes (hexagons) */}
          {NODES.map((n, i) => {
            const cy = NODE_Y(i);
            const isSel = selected === i;
            return (
              <motion.g
                key={n.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.15, type: 'spring', stiffness: 220, damping: 16 }}
                style={{ originX: '700px', originY: `${cy}px` }}
                onClick={() => setSelected(isSel ? null : i)}
                className="cursor-pointer"
              >
                <path d={hexPath(700, cy, isSel ? 44 : 38)}
                  fill={isSel ? '#1d5aa8' : '#072457'}
                  stroke={isSel ? '#8fc1ff' : '#2f6fbf'} strokeWidth={isSel ? 2.5 : 1.5}
                  style={{ transition: 'all 0.3s' }}
                />
                <g transform={`translate(700,${cy})`}>
                  <n.icon x={-13} y={-13} width={26} height={26} className={isSel ? 'text-white' : 'text-[#8fc1ff]'} />
                </g>
                <text x="764" y={cy - 2} fill={isSel ? '#ffffff' : '#dbeafe'} fontSize="17" fontWeight="bold">
                  {i + 1}. {n.name}
                </text>
                <text x="764" y={cy + 20} fill="#7fa3c7" fontSize="11" fontWeight="bold" letterSpacing="2">{n.en.toUpperCase()}</text>
                {isSel && (
                  <path d={hexPath(700, cy, 50)} fill="none" stroke="#8fc1ff" strokeOpacity="0.5" strokeDasharray="4 6" />
                )}
              </motion.g>
            );
          })}

          {/* Output beam to timeline */}
          {(() => {
            const d = 'M780,360 C1010,360 1120,360 1300,360';
            return (
              <React.Fragment>
                <motion.path
                  d={d} fill="none" stroke="#8fc1ff" strokeOpacity="0.6" strokeWidth="3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 2.4, duration: 0.8, ease: 'easeInOut' }}
                />
                <FlowDots path={d} count={4} duration={4.5} color="#8fc1ff" r={3.5} paused={selected !== null} />
              </React.Fragment>
            );
          })()}

          {/* Unified timeline card (right) */}
          <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8 }}>
            <rect x="1300" y="170" width="260" height="380" rx="16" fill="#072457" stroke="#2f6fbf" strokeOpacity="0.5" />
            <text x="1324" y="206" fill="#ffffff" fontSize="17" fontWeight="bold">统一设备时间轴</text>
            <text x="1324" y="226" fill="#7fa3c7" fontSize="10" fontWeight="bold" letterSpacing="2">UNIFIED ASSET TIMELINE</text>
            <line x1="1342" y1="252" x2="1342" y2="512" stroke="#2f6fbf" strokeWidth="2" strokeOpacity="0.6" />
            {TIMELINE_ITEMS.map((t, i) => {
              const iy = 262 + i * 50;
              const isCurrent = i === TIMELINE_ITEMS.length - 1;
              return (
                <g key={t}>
                  <circle cx="1342" cy={iy} r="6" fill={isCurrent ? '#f59e0b' : '#072457'} stroke={isCurrent ? '#fbbf24' : '#2f6fbf'} strokeWidth="2" />
                  <rect x="1360" y={iy - 15} width="180" height="30" rx="8"
                    fill={isCurrent ? '#f59e0b' : '#0a2a5e'} fillOpacity={isCurrent ? 0.15 : 1}
                    stroke={isCurrent ? '#f59e0b' : '#2f6fbf'} strokeOpacity="0.5" />
                  <text x="1372" y={iy + 5} fill={isCurrent ? '#fbbf24' : '#dbeafe'} fontSize="13" fontWeight="bold">{t}</text>
                </g>
              );
            })}
          </motion.g>
        </svg>

        {/* Node detail panel (HTML overlay, bottom-left of diagram) */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="absolute left-6 bottom-2 w-[420px] bg-[#072457] border border-amber-500/50 rounded-xl p-4 shadow-2xl shadow-black/50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-sm font-bold text-white">{selected + 1}. {NODES[selected].name} · {NODES[selected].en}</div>
                <button onClick={() => setSelected(null)} className="text-[#7fa3c7] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">{NODES[selected].desc}</p>
              <div className="text-[10px] text-amber-300 font-bold mt-2">数据流已暂停在该节点 · 点击节点或关闭继续</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tech labels */}
      <div className="flex justify-center gap-2 mt-2 flex-wrap shrink-0">
        {TECH_LABELS.map((t) => (
          <span key={t} className="px-2.5 py-1 bg-[#072457] border border-[#2f6fbf]/40 text-[#8fc1ff] text-[10px] font-bold uppercase tracking-widest rounded-full">{t}</span>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}
        className="mt-3 mb-8 flex justify-between items-center bg-[#072457] p-5 rounded-xl border border-[#2f6fbf]/40 shadow-lg shadow-black/20 shrink-0"
      >
        <div className="flex-1 flex items-center gap-4">
          <p className="text-lg text-white font-bold border-l-4 border-[#E2001A] pl-4">
            只有经过关联和上下文化的数据，才能形成有意义的状态判断。
          </p>
        </div>
        <button 
          onClick={() => setArchOpen(true)}
          className="px-5 py-3 text-xs font-bold text-[#8fc1ff] border border-[#2f6fbf]/40 rounded-full hover:bg-[#1d5aa8] hover:text-white transition-colors shrink-0 flex items-center gap-2"
        >
          查看完整架构
          <ChevronRight className="w-4 h-4" />
        </button>
        <button 
          onClick={onNext}
          className="ml-3 px-8 py-4 bg-[#1d5aa8] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2f6fbf] transition-colors shrink-0"
        >
          查看状态趋势
        </button>
      </motion.div>

      {/* Architecture diagram popup */}
      <ArchitectureOverlay isOpen={archOpen} onClose={() => setArchOpen(false)} onGoFull={onOpenArchitecture} />
    </div>
  );
}
