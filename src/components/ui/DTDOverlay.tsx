import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

interface DTDOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoState?: (playing: boolean) => void;
}

const TAGS = ['标准化现场任务', '专业检测', '数字化记录', '授权历史日志获取', '数据上传', '全程可追溯'];

export function DTDOverlay({ isOpen, onClose, onVideoState }: DTDOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-[#001538] flex flex-col px-14 py-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5 shrink-0">
            <div>
              <div className="text-[11px] text-[#a78bfa] font-bold uppercase tracking-widest mb-1">Field / On-Demand · DTD</div>
              <h2 className="text-2xl font-bold text-white">
                DTD延伸CBM的数据触点
                <span className="block text-base font-light text-blue-200 mt-0.5">DTD extends CBM data access into the field.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 h-10 rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1d5aa8] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回多源数据
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

          {/* Full-screen video */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 min-h-0 max-w-[1240px] w-full mx-auto flex flex-col"
          >
            <VideoPlaceholder
              id="V3"
              title="DTD检测演示 (DTD Demo)"
              durationMs={20000}
              autoPlay={true}
              onPlayingChange={onVideoState}
              className="w-full flex-1 min-h-0 shadow-2xl"
            />
          </motion.div>

          {/* Capability tags */}
          <div className="max-w-[1240px] w-full mx-auto mt-4 flex items-center gap-2 flex-wrap shrink-0">
            {TAGS.map((t) => (
              <span key={t} className="px-3 py-1 bg-[#1d5aa8]/40 border border-[#2f6fbf]/40 text-[#8fc1ff] text-xs font-bold rounded-full">{t}</span>
            ))}
          </div>

          {/* Notes */}
          <div className="max-w-[1240px] w-full mx-auto mt-3 flex items-start justify-between gap-8 shrink-0">
            <p className="text-sm text-blue-100/80 font-medium leading-relaxed max-w-4xl">
              DTD支持标准化现场检测和任务执行；在系统授权与接口支持的条件下，还可获取设备或监控终端中的历史运行数据和日志，为CBM分析补充更完整的状态证据。
              <span className="text-[#8fc1ff] font-bold"> DTD是CBM多源数据体系中的重要现场工具，但不是唯一的数据来源。</span>
            </p>
            <p className="text-[11px] text-[#7fa3c7] font-medium shrink-0 pt-1">
              数据获取范围取决于设备接口、系统授权和项目配置。
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
