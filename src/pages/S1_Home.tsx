import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, DoorOpen } from 'lucide-react';
import g02Img from '@/assets/images/g02_braking_service.webp';
import g05Img from '@/assets/images/g05_door_service.webp';

interface S1Props {
  onOpenCase: () => void;
  onOpenBrake: () => void;
  onOpenDoor: () => void;
}

export function S1Home({ onOpenCase, onOpenBrake, onOpenDoor }: S1Props) {
  return (
    <div className="flex flex-col h-full px-[72px] pt-10 bg-[#002b6b] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          一个 CBM 框架，服务多个关键系统。<br/>
          <span className="text-blue-200 font-light text-2xl md:text-3xl block mt-2">One CBM framework. Multiple critical systems.</span>
        </h1>
        <p className="text-base text-blue-100 font-medium max-w-5xl leading-relaxed">
          从制动系统到门系统，我们根据不同设备的数据条件和维护需求，提供数据接入、状态监测、分析判断与维护闭环服务。
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 w-full mb-6 flex-1">
        {/* Braking System CBM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#072457] border border-[#2f6fbf]/40 border-t-4 border-t-[#1d5aa8] rounded-2xl p-6 flex flex-col hover:border-[#2f6fbf] transition-all"
        >
          <div className="relative rounded-xl overflow-hidden mb-5 shrink-0">
            <img src={g02Img} alt="制动系统CBM" className="w-full h-44 object-cover object-[center_28%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#072457] via-transparent to-transparent" />
          </div>
          <h2 className="text-2xl text-white font-bold">制动系统CBM</h2>
          <div className="text-sm font-light text-blue-200 mt-0.5 mb-3">Braking System CBM</div>
          <p className="text-sm text-blue-100/80 font-medium leading-relaxed mb-3">
            连接供风、制动控制与基础制动相关数据，形成系统级状态视图，识别异常趋势并支持维护决策。
          </p>
          <p className="text-xs text-[#7fa3c7] font-bold tracking-wider mb-6">
            供风系统｜制动控制｜气动控制｜基础制动
          </p>

          <div className="mt-auto flex gap-3">
            <button
              onClick={onOpenCase}
              className="flex-1 py-3.5 bg-[#1d5aa8] text-white rounded-full font-bold text-sm hover:bg-[#2f6fbf] transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>查看空压机CBM案例</span>
              <span className="px-2 py-0.5 bg-[#E2001A] text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Featured</span>
            </button>
            <button
              onClick={onOpenBrake}
              className="flex-1 py-3.5 bg-[#0a2a5e] border border-[#2f6fbf]/40 text-white rounded-full font-bold text-sm hover:bg-[#1d5aa8] transition-colors flex items-center justify-center space-x-2"
            >
              <span>查看制动系统CBM服务</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Entrance System CBM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-[#072457] border border-[#2f6fbf]/40 border-t-4 border-t-violet-500 rounded-2xl p-6 flex flex-col hover:border-violet-400/60 transition-all"
        >
          <div className="relative rounded-xl overflow-hidden mb-5 shrink-0">
            <img src={g05Img} alt="门系统CBM" className="w-full h-44 object-cover object-[center_42%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#072457] via-transparent to-transparent" />
          </div>
          <h2 className="text-2xl text-white font-bold flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-violet-300" />
            门系统CBM
          </h2>
          <div className="text-sm font-light text-blue-200 mt-0.5 mb-3">Entrance System CBM</div>
          <p className="text-sm text-blue-100/80 font-medium leading-relaxed mb-3">
            通过运行数据、事件日志和维护记录，持续跟踪车门运行表现，识别性能变化，并支持检查、维护和维修后验证。
          </p>
          <p className="text-xs text-violet-300/80 font-bold tracking-wider mb-6">
            门控系统｜驱动机构｜机械系统｜关键接口
          </p>

          <button
            onClick={onOpenDoor}
            className="mt-auto w-full py-3.5 bg-violet-600 text-white rounded-full font-bold text-sm hover:bg-violet-500 transition-colors flex items-center justify-center space-x-2"
          >
            <span>查看门系统CBM服务</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      <div className="pb-6 pt-2">
        <p className="text-[10px] text-blue-300/60 font-bold uppercase tracking-widest">
          本次互动以制动系统供风环节的空压机为代表性案例。具体数据接入、分析能力和服务范围根据系统条件与项目配置确定。
        </p>
      </div>
    </div>
  );
}
