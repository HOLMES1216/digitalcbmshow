import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Database, PlugZap, Boxes, BrainCircuit, LayoutDashboard, ShieldCheck, Users, History, Settings, Languages, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchitectureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onGoFull: () => void;
}

const LAYERS = [
  { icon: Database, no: '第一层', name: '多源数据', nameEn: 'Multi-Source Data', modules: ['实时或近实时运行数据', '历史运行数据与日志', 'DTD与现场检测', '维修与业务数据'] },
  { icon: PlugZap, no: '第二层', name: '数据接入与治理', nameEn: 'Ingestion & Governance', modules: ['Streaming Ingestion', 'Batch Import', 'Log Retrieval', 'API Gateway', '数据校验', '时间同步', '标准化', '上下文化', '安全与权限'] },
  { icon: Boxes, no: '第三层', name: 'CBM数据与编排平台', nameEn: 'CBM Data & Orchestration', modules: ['Asset Data Model', 'Time-Series Data', 'Historical Logs', 'Inspection Records', 'Maintenance History', 'Knowledge Base', 'Fault Database', 'Orchestration'] },
  { icon: BrainCircuit, no: '第四层', name: '分析与AI', nameEn: 'Analytics & AI', modules: ['Health Baseline', 'Trend Analysis', 'Anomaly Detection', 'Rule Engine', 'Predictive Models', 'AI Agent', 'Recommendation'] },
  { icon: LayoutDashboard, no: '第五层', name: '业务应用与执行', nameEn: 'Applications & Execution', modules: ['Condition Overview', 'Fleet Dashboard', 'Maintenance Recommendation', 'Work Orders', 'Scheduling', 'Mobile Execution', 'Reports & BI', 'ERP/CMMS'] },
];

const SUPPORTS = [
  { icon: ShieldCheck, label: '本地化部署' },
  { icon: Users, label: '安全与权限' },
  { icon: History, label: '审计与追溯' },
  { icon: Settings, label: '配置管理' },
  { icon: Languages, label: '多语言' },
  { icon: GitBranch, label: '系统集成' },
];

export function ArchitectureOverlay({ isOpen, onClose, onGoFull }: ArchitectureOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-[#001538] flex flex-col px-16 py-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-white">连接多源数据、状态洞察与维护执行</h2>
              <div className="text-sm font-light text-blue-200 mt-0.5">Connecting multi-source data, condition insight, and maintenance execution.</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onGoFull}
                className="flex items-center gap-2 px-5 h-10 rounded-full bg-[#1d5aa8] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2f6fbf] transition-colors"
              >
                进入完整架构页
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white hover:bg-[#E2001A] transition-colors"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Diagram: five layers around a glowing spine */}
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Spine */}
            <div className="w-16 shrink-0 flex flex-col items-center justify-center relative">
              <div className="absolute inset-y-8 w-[3px] flow-y rounded-full" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative z-10 px-2 py-1 bg-[#1d5aa8] rounded-full text-[9px] font-bold text-white uppercase tracking-widest [writing-mode:vertical-lr]"
              >
                数据流 Data Flow
              </motion.div>
            </div>

            {/* Layers (rendered top-down: L5 .. L1 visually, animated bottom-up) */}
            <div className="flex-1 flex flex-col-reverse gap-3 min-h-0 pb-2">
              {LAYERS.map((layer, i) => (
                <motion.div
                  key={layer.no}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.15, duration: 0.5 }}
                  className="flex-1 bg-[#072457] border border-[#2f6fbf]/40 rounded-xl px-5 py-3 flex items-center gap-4 shadow-lg shadow-black/20 hover:border-[#2f6fbf] transition-colors"
                >
                  <span className="px-2.5 py-1 bg-[#1d5aa8]/40 text-[#8fc1ff] text-[10px] font-bold uppercase tracking-widest rounded-md shrink-0">{layer.no}</span>
                  <layer.icon className="w-6 h-6 text-[#8fc1ff] shrink-0" />
                  <div className="w-56 shrink-0">
                    <div className="text-white font-bold">{layer.name}</div>
                    <div className="text-[10px] text-blue-200 font-light">{layer.nameEn}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.modules.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-full text-[10px] text-blue-100/80 font-medium">{m}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Support base */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-3 mt-4 shrink-0 flex-wrap"
          >
            <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest">横向支撑</span>
            {SUPPORTS.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072457] border border-[#2f6fbf]/40 rounded-full text-[11px] text-blue-100/80 font-medium">
                <s.icon className="w-3.5 h-3.5 text-[#8fc1ff]" />
                {s.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
