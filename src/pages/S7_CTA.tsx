import React from 'react';
import { motion } from 'motion/react';
import { QrCode, Users, RotateCcw, Database, Activity, BrainCircuit, Wrench, DoorOpen, ArrowRight, Layers } from 'lucide-react';
import g07Img from '@/assets/images/g07_cbm_loop.webp';

interface S7Props {
  onRestart: () => void;
  onOpenBrake: () => void;
  onOpenDoor: () => void;
  onOpenArchitecture: () => void;
}

const LOOP_STEPS = [
  { icon: Database, cn: '连接数据', en: 'Connect' },
  { icon: Activity, cn: '监测状态', en: 'Monitor' },
  { icon: BrainCircuit, cn: '分析判断', en: 'Understand' },
  { icon: Wrench, cn: '推动行动', en: 'Act' },
];

const VALUES = [
  '更完整地看见系统状态',
  '更早发现值得关注的变化',
  '更有依据地安排维护',
  '让每次维护形成可复用的数据',
];

export function S7CTA({ onRestart, onOpenBrake, onOpenDoor, onOpenArchitecture }: S7Props) {
  return (
    <div className="flex flex-col h-full px-12 md:px-24 pt-10 bg-[#002b6b] overflow-y-auto pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl space-y-3 mb-8 text-center mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          一种数据驱动的方法，服务更多关键系统。<br/>
          <span className="text-blue-200 font-light text-2xl">One data-driven approach for multiple critical systems.</span>
        </h1>
      </motion.div>

      <div className="flex items-center gap-8 w-full max-w-6xl mx-auto mb-8">
        {/* Central loop visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative w-[46%] shrink-0 rounded-xl overflow-hidden border border-[#2f6fbf]/40"
        >
          <img src={g07Img} alt="CBM服务闭环" className="w-full h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002b6b]/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 flex-wrap px-3">
            {LOOP_STEPS.map((s, i) => (
              <React.Fragment key={s.en}>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#072457]/90 border border-[#2f6fbf]/40 rounded-full text-[11px] font-bold text-white">
                  <s.icon className="w-3.5 h-3.5 text-[#8fc1ff]" />
                  {s.cn}
                </span>
                {i < LOOP_STEPS.length - 1 && <span className="text-[#8fc1ff] text-xs">→</span>}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Two service areas + values */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            onClick={onOpenBrake}
            className="text-left bg-[#072457] border border-[#2f6fbf]/40 border-t-4 border-t-[#1d5aa8] rounded-xl p-5 hover:border-[#2f6fbf] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-lg">制动系统 CBM</div>
              <ArrowRight className="w-5 h-5 text-[#7fa3c7] group-hover:text-white transition-colors" />
            </div>
            <p className="text-sm text-blue-100/80 font-medium mt-1">从供风、制动控制到基础制动，形成相互关联的状态视图与维护依据。</p>
            <div className="text-[10px] text-[#E2001A] font-bold uppercase tracking-widest mt-2">空压机为本次完整演示案例</div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            onClick={onOpenDoor}
            className="text-left bg-[#072457] border border-violet-400/30 border-t-4 border-t-violet-500 rounded-xl p-5 hover:border-violet-400/60 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-lg flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-violet-300" />
                门系统 CBM
              </div>
              <ArrowRight className="w-5 h-5 text-[#7fa3c7] group-hover:text-white transition-colors" />
            </div>
            <p className="text-sm text-blue-100/80 font-medium mt-1">从车门运行数据中识别性能变化，支持状态监测和计划性维护。</p>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="grid grid-cols-2 gap-2"
          >
            {VALUES.map((v) => (
              <div key={v} className="flex items-center gap-2 px-3 py-2.5 bg-[#072457] border border-[#2f6fbf]/40 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs text-blue-100/90 font-bold">{v}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="w-full max-w-6xl mx-auto bg-[#072457] border border-[#2f6fbf]/40 rounded-xl p-6 flex items-center justify-center gap-6"
      >
        {/* QR block */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-20 h-20 bg-white rounded-lg p-1.5 grid grid-cols-7 grid-rows-7 gap-px">
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} className={Math.sin(i * 7.3) > -0.2 ? "bg-[#001538] rounded-[1px]" : "bg-white"} />
            ))}
          </div>
          <p className="text-[10px] text-blue-100/70 font-medium w-32 leading-relaxed">
            扫码了解 Knorr-Bremse 数字化 CBM 解决方案、服务范围与合作方式。
          </p>
        </div>

        <button className="px-6 py-4 bg-[#E2001A] hover:bg-red-700 text-white rounded-full font-bold flex items-center justify-center space-x-2 transition-colors flex-1 max-w-xs">
          <Users className="w-5 h-5" />
          <span>联系数字化 CBM 专家</span>
        </button>
        <button className="px-6 py-4 bg-[#1d5aa8] text-white hover:bg-[#2f6fbf] rounded-full font-bold flex items-center justify-center space-x-2 transition-colors flex-1 max-w-xs">
          <QrCode className="w-5 h-5" />
          <span>扫码获取解决方案</span>
        </button>
        <button onClick={onRestart} className="px-6 py-4 bg-[#0a2a5e] border border-[#2f6fbf]/40 text-white hover:bg-[#1d5aa8] rounded-full font-bold flex items-center justify-center space-x-2 transition-colors flex-1 max-w-xs">
          <RotateCcw className="w-5 h-5" />
          <span>重新体验空压机案例</span>
        </button>
        <button onClick={onOpenArchitecture} className="px-5 py-4 text-[#8fc1ff] border border-[#2f6fbf]/40 hover:text-white hover:bg-[#1d5aa8] rounded-full font-bold flex items-center justify-center space-x-2 transition-colors text-xs">
          <Layers className="w-4 h-4" />
          <span>查看完整架构</span>
        </button>
      </motion.div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-blue-300/60 uppercase tracking-wider font-bold">
          具体数据接入、分析能力和服务范围根据系统条件、数据可用性和项目配置确定。
        </p>
      </div>
    </div>
  );
}
