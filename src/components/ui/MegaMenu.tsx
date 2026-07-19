import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DoorOpen, Play, Database, BrainCircuit, Wrench, Target, Layers, QrCode, Users, Map, ChevronRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onGoTo: (page: number) => void;
  onOpenDrawer: (id: string) => void;
}

export function MegaMenu({ isOpen, onClose, onGoTo, onOpenDrawer }: MegaMenuProps) {
  const go = (page: number) => { onClose(); onGoTo(page); };
  const drawer = (id: string) => { onClose(); onOpenDrawer(id); };

  const itemCls = "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium text-blue-100/80 hover:bg-[#1d5aa8] hover:text-white transition-colors";
  const subItemCls = "w-full flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-lg text-left text-xs font-medium text-blue-100/60 hover:bg-[#1d5aa8] hover:text-white transition-colors";
  const headCls = "px-3 text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-2 mt-4 first:mt-0";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[75]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 right-8 w-[880px] max-w-[92%] bg-[#072457] border border-[#2f6fbf]/40 rounded-2xl shadow-2xl shadow-black/50 z-[80] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-bold text-lg">CBM服务与解决方案</div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#2f6fbf]/40 text-white hover:bg-[#E2001A] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* CBM服务 */}
              <div>
                <div className={headCls}>CBM服务</div>
                <button onClick={() => go(9)} className={itemCls}>
                  <Map className="w-4 h-4 text-[#8fc1ff] shrink-0" />
                  制动系统CBM 服务
                </button>
                <button onClick={() => go(2)} className={subItemCls}>
                  <Play className="w-3.5 h-3.5 text-[#E2001A] shrink-0" />
                  供风系统 · 空压机案例
                </button>
                <button onClick={() => go(8)} className={itemCls}>
                  <DoorOpen className="w-4 h-4 text-violet-300 shrink-0" />
                  门系统CBM 服务
                </button>
              </div>

              {/* 解决方案 */}
              <div>
                <div className={headCls}>解决方案</div>
                <button onClick={() => go(3)} className={itemCls}><Database className="w-4 h-4 text-[#8fc1ff] shrink-0" />多源数据</button>
                <button onClick={() => go(5)} className={itemCls}><BrainCircuit className="w-4 h-4 text-[#8fc1ff] shrink-0" />AI辅助决策</button>
                <button onClick={() => go(6)} className={itemCls}><Wrench className="w-4 h-4 text-[#8fc1ff] shrink-0" />运维闭环</button>
                <button onClick={() => drawer('value')} className={itemCls}><Target className="w-4 h-4 text-[#8fc1ff] shrink-0" />业务价值</button>
                <button onClick={() => go(13)} className={itemCls}><Layers className="w-4 h-4 text-[#8fc1ff] shrink-0" />完整架构</button>
              </div>

              {/* 资料 */}
              <div>
                <div className={headCls}>资料</div>
                <button onClick={() => go(7)} className={itemCls}><QrCode className="w-4 h-4 text-[#8fc1ff] shrink-0" />扫码获取资料</button>
                <button onClick={() => go(7)} className={itemCls}><Users className="w-4 h-4 text-[#8fc1ff] shrink-0" />联系现场专家</button>

                <div className="mt-6 p-3 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-xl">
                  <div className="text-[10px] font-bold text-[#7fa3c7] uppercase tracking-widest mb-2">本次互动案例</div>
                  <button onClick={() => go(2)} className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#8fc1ff] transition-colors">
                    制动系统 <ChevronRight className="w-3 h-3" /> 供风系统 <ChevronRight className="w-3 h-3" /> 空压机
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
