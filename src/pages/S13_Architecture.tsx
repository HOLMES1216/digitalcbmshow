import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Database, PlugZap, Boxes, BrainCircuit, LayoutDashboard, Play, ShieldCheck, Users, History, Settings, Languages, GitBranch, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchitecturePageProps {
  onBack: () => void;
  onHome: () => void;
}

const LAYERS = [
  {
    id: 'l1', no: '第一层', icon: Database, name: '多源数据', nameEn: 'Multi-Source Data',
    modules: ['实时或近实时运行数据', '历史运行数据与日志', 'DTD与现场检测', '维修与业务数据'],
  },
  {
    id: 'l2', no: '第二层', icon: PlugZap, name: '数据接入与治理', nameEn: 'Ingestion & Governance',
    modules: ['Streaming Data Ingestion', 'Batch Data Import', 'Terminal Log Retrieval', 'API Gateway', '数据校验', '时间同步', '数据标准化', '设备上下文化', '安全与权限'],
  },
  {
    id: 'l3', no: '第三层', icon: Boxes, name: 'CBM数据与编排平台', nameEn: 'CBM Data & Orchestration',
    modules: ['Asset Data Model', 'Time-Series Data', 'Historical Logs', 'Inspection Records', 'Maintenance History', 'Knowledge Base', 'Fault Database', 'CBM Orchestration'],
  },
  {
    id: 'l4', no: '第四层', icon: BrainCircuit, name: '分析与AI', nameEn: 'Analytics & AI',
    modules: ['Health Baseline', 'Trend Analysis', 'Anomaly Detection', 'Rule Engine', 'Predictive Models', 'AI Agent', 'Recommendation Generation'],
  },
  {
    id: 'l5', no: '第五层', icon: LayoutDashboard, name: '业务应用与执行', nameEn: 'Applications & Execution',
    modules: ['Condition Overview', 'Fleet and Asset Dashboard', 'Maintenance Recommendation', 'Work Orders', 'Scheduling', 'Mobile Execution', 'Reports and BI', 'ERP/CMMS Integration'],
  },
];

const SUPPORTS = [
  { icon: ShieldCheck, label: '本地化部署' },
  { icon: Users, label: '安全与权限' },
  { icon: History, label: '审计与追溯' },
  { icon: Settings, label: '配置管理' },
  { icon: Languages, label: '多语言' },
  { icon: GitBranch, label: '系统集成' },
];

export function ArchitecturePage({ onBack, onHome }: ArchitecturePageProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState(-1); // -1 idle; 0..4 highlight layers bottom-up

  useEffect(() => {
    if (flowStep >= 0 && flowStep < LAYERS.length + 1) {
      const t = setTimeout(() => setFlowStep((s) => (s >= LAYERS.length ? -1 : s + 1)), 900);
      return () => clearTimeout(t);
    }
  }, [flowStep]);

  const flowActive = (idx: number) => flowStep === LAYERS.length - 1 - idx;

  return (
    <div className="flex flex-col h-full px-12 md:px-20 pt-8 bg-[#002b6b] overflow-y-auto">
      {/* Top: back / home */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 h-10 rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1d5aa8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回故事
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFlowStep(0)}
            className="flex items-center gap-2 px-5 h-10 rounded-full bg-[#1d5aa8] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2f6fbf] transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            查看数据流
          </button>
          <button
            onClick={onHome}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white hover:bg-[#1d5aa8] transition-colors"
            aria-label="首页"
          >
            <HomeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-white">
          连接多源数据、状态洞察与维护执行。
          <span className="block text-lg font-light text-blue-200 mt-1">Connecting multi-source data, condition insight, and maintenance execution.</span>
        </h1>
      </div>

      {/* Five layers */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        {[...LAYERS].reverse().map((layer, revIdx) => {
          const idx = LAYERS.length - 1 - revIdx;
          const isSelected = selected === layer.id;
          const isDim = selected !== null && !isSelected;
          return (
            <motion.button
              key={layer.id}
              layout
              onClick={() => setSelected(isSelected ? null : layer.id)}
              className={cn(
                "text-left rounded-xl border p-4 transition-all relative overflow-hidden",
                isSelected ? "bg-[#0a2a5e] border-[#2f6fbf] flex-[2.2]" : "bg-[#072457] border-[#2f6fbf]/40 flex-1 hover:border-[#2f6fbf]",
                isDim && "opacity-40",
                flowActive(idx) && "border-[#8fc1ff] shadow-lg shadow-[#1d5aa8]/40"
              )}
            >
              {flowActive(idx) && (
                <motion.div
                  className="absolute inset-0 bg-[#1d5aa8]/20"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              )}
              <div className="flex items-center gap-3 relative">
                <span className="px-2.5 py-1 bg-[#1d5aa8]/40 text-[#8fc1ff] text-[10px] font-bold uppercase tracking-widest rounded-md shrink-0">{layer.no}</span>
                <layer.icon className="w-5 h-5 text-[#8fc1ff] shrink-0" />
                <span className="text-white font-bold">{layer.name}</span>
                <span className="text-xs font-light text-blue-200">{layer.nameEn}</span>
              </div>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden relative"
                  >
                    <div className="flex flex-wrap gap-2 mt-3">
                      {layer.modules.map((m) => (
                        <span key={m} className="px-2.5 py-1 bg-[#072457] border border-[#2f6fbf]/40 rounded-full text-[11px] text-blue-100/80 font-medium">{m}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Horizontal support capabilities */}
      <div className="flex items-center gap-3 mt-4 pb-6 shrink-0 flex-wrap">
        <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest">横向支撑</span>
        {SUPPORTS.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072457] border border-[#2f6fbf]/40 rounded-full text-[11px] text-blue-100/80 font-medium">
            <s.icon className="w-3.5 h-3.5 text-[#8fc1ff]" />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
