import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Database, Activity, TrendingUp, ClipboardCheck, CircleDot, Info } from 'lucide-react';
import g05Img from '@/assets/images/g05_door_service.webp';

interface DoorServiceProps {
  onBack: () => void;
}

const CAPABILITIES = [
  {
    no: '01',
    icon: Database,
    title: '运行数据连接',
    titleEn: 'Connect',
    desc: '连接开关门循环、动作时间、驱动数据、状态事件、控制器日志和维修记录。',
  },
  {
    no: '02',
    icon: Activity,
    title: '门状态持续监测',
    titleEn: 'Monitor',
    desc: '对车门运行表现进行统一呈现，帮助快速识别异常车门、重复事件及性能变化。',
  },
  {
    no: '03',
    icon: TrendingUp,
    title: '性能变化分析',
    titleEn: 'Understand',
    desc: '分析动作时间、驱动特征和历史事件的变化趋势，辅助判断是否需要进一步检查。',
  },
  {
    no: '04',
    icon: ClipboardCheck,
    title: '维护计划支持',
    titleEn: 'Act',
    desc: '根据状态、使用强度和历史维护信息，为检查顺序、维护时机和现场任务提供依据。',
  },
];

export function DoorService({ onBack }: DoorServiceProps) {
  const [hotspotOpen, setHotspotOpen] = useState(false);

  return (
    <div className="flex flex-col h-full px-12 md:px-20 pt-8 bg-[#002b6b] overflow-y-auto">
      {/* Exit mechanism */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 h-10 rounded-full border border-violet-400/40 bg-[#072457] text-white text-xs font-bold uppercase tracking-widest hover:bg-violet-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回服务全景
        </button>
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-violet-400/40 bg-[#072457] text-white hover:bg-[#E2001A] transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6 shrink-0">
        <div className="text-[11px] text-violet-300 font-bold uppercase tracking-widest mb-2">Entrance System CBM · 门系统CBM</div>
        <h1 className="text-3xl font-bold text-white">
          让每一次开关门，都成为可理解的状态数据。
          <span className="block text-lg font-light text-blue-200 mt-1">Turn every door cycle into actionable condition insight.</span>
        </h1>
        <p className="text-sm text-blue-100/80 font-medium mt-3 max-w-5xl">
          门系统的性能变化往往体现在动作时间、驱动特征、循环次数和异常事件中。数字化 CBM 汇聚这些数据及维修记录，帮助客户识别变化、定位需要关注的车门，并更合理地安排检查与维护。
        </p>
      </div>

      {/* Main visual with door hotspot */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden border border-violet-400/40 mb-6 shrink-0"
      >
        <img src={g05Img} alt="门系统CBM服务" className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002b6b]/70 via-transparent to-transparent" />

        {/* Amber door hotspot */}
        <button
          onClick={() => setHotspotOpen((v) => !v)}
          className="absolute top-[40%] left-[73%] group"
          aria-label="查看车门状态"
        >
          <span className="absolute inline-flex h-10 w-10 rounded-full bg-amber-400/40 animate-ping" />
          <span className="relative flex h-10 w-10 rounded-full bg-amber-400/80 border-2 border-amber-200 items-center justify-center">
            <CircleDot className="w-5 h-5 text-white" />
          </span>
        </button>

        {/* Door status popover */}
        <AnimatePresence>
          {hotspotOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-[30%] left-[54%] w-64 bg-[#072457] border border-amber-400/40 rounded-xl p-4 shadow-2xl shadow-black/50"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">车门状态 · 4车2门</span>
                <button onClick={() => setHotspotOpen(false)} className="text-[#7fa3c7] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between"><span className="text-[#7fa3c7]">当前状态</span><span className="text-amber-300 font-bold">关注 · 关门时间趋势上升</span></div>
                <div className="flex justify-between"><span className="text-[#7fa3c7]">动作趋势</span><span className="text-blue-100/80">近30天缓慢偏离基线</span></div>
                <div className="flex justify-between"><span className="text-[#7fa3c7]">最近事件</span><span className="text-blue-100/80">2次防夹反转（客流高峰）</span></div>
                <div className="flex justify-between"><span className="text-[#7fa3c7]">建议行动</span><span className="text-[#8fc1ff] font-bold">下次回库检查导轨与密封</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 left-4 text-[11px] text-blue-100/70 font-medium">
          大部分车门状态稳定（青绿）；一扇门呈琥珀色关注状态——点击热点查看状态浮层。
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
            className="bg-[#072457] border border-violet-400/30 rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-violet-400">{c.no}</span>
              <c.icon className="w-6 h-6 text-violet-300" />
            </div>
            <div className="text-white font-bold mb-1">{c.title}</div>
            <div className="text-[10px] text-violet-300/70 font-bold uppercase tracking-widest mb-3">{c.titleEn}</div>
            <p className="text-xs text-blue-100/80 font-medium leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-[#7fa3c7] font-medium leading-relaxed pb-8 shrink-0">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        官方资料显示入口系统可基于运行数据预测维护需求（如估算剩余开关循环）；本项目中具体预测能力以实际部署范围和数据条件为准。
      </div>
    </div>
  );
}
