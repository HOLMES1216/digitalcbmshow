import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint } from 'lucide-react';
import kbLogo from '@/assets/images/kb_logo_full.webp';
import g01Img from '@/assets/images/g01_panorama.webp';

export function S0Standby({ onStart }: { onStart: () => void }) {
  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer bg-[#002b6b] overflow-hidden"
      onClick={onStart}
    >
      {/* Background: unified CBM panorama */}
      <div className="absolute inset-0">
        <img src={g01Img} alt="" className="w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#002b6b]/60 to-[#002b6b]" />
      </div>

      {/* Real Knorr-Bremse logo */}
      <div className="absolute top-8 left-10 z-20 bg-white rounded-md px-3 py-2">
        <img src={kbLogo} alt="Knorr-Bremse" className="h-9 w-auto" />
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            汇聚数据，洞察状态，驱动行动。
          </h1>
          <h2 className="text-2xl md:text-3xl text-blue-200 font-light tracking-wide">
            Unify Data. Understand Condition. Drive Action.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-2 border-t border-white/20 pt-8"
        >
          <p className="text-xl text-blue-100 font-medium max-w-3xl">Knorr-Bremse 数字化 CBM 连接多源设备数据，持续识别系统状态变化，并将洞察转化为可执行的维护建议。</p>
          <p className="text-sm text-blue-300/80 font-light">Knorr-Bremse Digital CBM connects multi-source equipment data, identifies changes in system condition, and turns insights into actionable maintenance recommendations.</p>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 flex flex-col items-center space-y-4"
        >
          <div className="w-20 h-20 bg-blue-600/30 rounded-full flex items-center justify-center border border-blue-400/50">
            <Fingerprint className="w-8 h-8 text-blue-200" />
          </div>
          <div className="text-center">
            <div className="text-blue-200 font-bold tracking-widest text-lg">探索 CBM 服务</div>
            <div className="text-blue-300/70 text-sm uppercase tracking-widest mt-1">Explore CBM Services</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
