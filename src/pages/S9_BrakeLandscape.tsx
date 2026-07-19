import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, X, Play, Database, Activity, BrainCircuit, Wrench, ChevronRight, Info } from 'lucide-react';
import g02Img from '@/assets/images/g02_braking_service.webp';

interface BrakeServiceProps {
  onBack: () => void;
  onOpenCase: () => void;
  onOpenMore: () => void;
}

const CAPABILITIES = [
  {
    no: '01',
    icon: Database,
    title: '数据连接',
    titleEn: 'Connect',
    desc: '根据车辆和设备条件，接入实时运行数据、历史日志、现场检测结果和维修记录。',
    keywords: ['实时数据', '历史日志', 'DTD检测', '维修记录'],
  },
  {
    no: '02',
    icon: Activity,
    title: '状态监测',
    titleEn: 'Monitor',
    desc: '建立部件与系统级状态视图，持续跟踪压力、温度、动作特征、运行时长和异常事件等变化。',
    keywords: ['状态总览', '趋势跟踪', '异常识别', '事件关联'],
  },
  {
    no: '03',
    icon: BrainCircuit,
    title: '分析与判断',
    titleEn: 'Understand',
    desc: '结合设备结构、运行工况、历史趋势和维修知识，辅助识别异常来源、影响范围和维护优先级。',
    keywords: ['趋势分析', '关联分析', '风险评估', '辅助诊断'],
  },
  {
    no: '04',
    icon: Wrench,
    title: '维护闭环',
    titleEn: 'Act',
    desc: '将状态洞察转化为检查或维护建议，并通过维修结果和后续运行数据验证处理效果。',
    keywords: ['维护建议', '任务协同', '结果反馈', '效果验证'],
  },
];

export function BrakeLandscape({ onBack, onOpenCase, onOpenMore }: BrakeServiceProps) {
  return (
    <div className="flex flex-col h-full px-12 md:px-20 pt-8 bg-[#002b6b] overflow-y-auto">
      {/* Exit mechanism */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 h-10 rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1d5aa8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回服务全景
        </button>
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white hover:bg-[#E2001A] transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-white">
          从单一部件，到制动系统的连续状态视图。
          <span className="block text-lg font-light text-blue-200 mt-1">From individual components to a connected view of braking system condition.</span>
        </h1>
        <p className="text-sm text-blue-100/80 font-medium mt-3 max-w-5xl">
          制动系统由供风、控制、气动与机械执行等多个环节协同工作。数字化 CBM 将分散的数据关联到统一的设备与时间轴，帮助客户看见状态变化、理解异常影响，并更有依据地安排维护。
        </p>
      </div>

      {/* Main visual: system-level concept image with zone labels */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden border border-[#2f6fbf]/40 mb-6 shrink-0"
      >
        <img src={g02Img} alt="制动系统CBM服务" className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002b6b]/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 flex-wrap px-4">
          {['供风', '制动控制', '气动传递', '基础制动'].map((z, i, arr) => (
            <React.Fragment key={z}>
              <span className="px-3 py-1 bg-[#072457]/90 border border-[#2f6fbf]/40 rounded-full text-xs font-bold text-[#8fc1ff]">{z}</span>
              {i < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-[#8fc1ff]" />}
            </React.Fragment>
          ))}
          <span className="px-3 py-1 bg-[#1d5aa8] rounded-full text-xs font-bold text-white">CBM状态视图</span>
        </div>
      </motion.div>

      {/* Four service capabilities */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {CAPABILITIES.map((c, i) => (
          <motion.div
            key={c.no}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="bg-[#072457] border border-[#2f6fbf]/40 rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-[#2f6fbf]">{c.no}</span>
              <c.icon className="w-6 h-6 text-[#8fc1ff]" />
            </div>
            <div className="text-white font-bold mb-1">{c.title}</div>
            <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-3">{c.titleEn}</div>
            <p className="text-xs text-blue-100/80 font-medium leading-relaxed mb-4 flex-1">{c.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {c.keywords.map((k) => (
                <span key={k} className="px-2 py-0.5 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-full text-[10px] text-[#8fc1ff] font-medium">{k}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coverage statement (lightweight text, not product cards) */}
      <div className="flex items-start gap-2 text-xs text-[#7fa3c7] font-medium leading-relaxed mb-6 shrink-0">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          服务可覆盖供风设备、制动柜及集成制动控制系统、CCBII、EP2002、制动阀及基础制动相关设备；具体监测范围和分析能力根据车辆配置与可用数据确定。
          <span className="block text-blue-300/50 font-light mt-1">Services can cover air supply equipment, brake cabinets and integrated brake control systems, CCBII, EP2002, brake valves, and foundation brake equipment. The specific monitoring and analytics scope depends on vehicle configuration and available data.</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-8 shrink-0">
        <button
          onClick={onOpenCase}
          className="flex items-center gap-2 px-6 h-11 rounded-full bg-[#1d5aa8] text-white text-sm font-bold hover:bg-[#2f6fbf] transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          进入空压机完整案例
        </button>
        <button
          onClick={onOpenMore}
          className="flex items-center gap-2 px-6 h-11 rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white text-sm font-bold hover:bg-[#1d5aa8] transition-colors"
        >
          了解更多制动场景
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 h-11 rounded-full border border-[#2f6fbf]/40 text-[#7fa3c7] text-sm font-bold hover:text-white hover:bg-[#072457] transition-colors"
        >
          返回服务全景
        </button>
      </div>
    </div>
  );
}
