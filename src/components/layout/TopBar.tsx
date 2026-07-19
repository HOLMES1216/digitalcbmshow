import React, { useState } from 'react';
import { Play, Pause, Home, MoreHorizontal, ChevronLeft, ChevronRight, Map, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import kbLogo from '@/assets/images/kb_logo_full.webp';

interface TopBarProps {
  currentPage: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onHome: () => void;
  onMore: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenLandscape: () => void;
}

export function TopBar({ currentPage, isPlaying, onTogglePlay, onHome, onMore, onPrev, onNext, onOpenLandscape }: TopBarProps) {
  const [showMap, setShowMap] = useState(false);
  const inCaseFlow = currentPage > 1 && currentPage < 8;

  return (
    <header className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50 bg-[#001a45] border-b border-[#2f6fbf]/40">
      {/* Left: deck-style stacked title */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-[10px] font-medium tracking-wide text-[#7fa3c7]">Knorr-Bremse</span>
          <span className="text-xl font-bold text-white">Digital CBM</span>
          <span className="text-[11px] font-light text-blue-200">Rail Vehicle Systems · 数字化状态维修</span>
        </div>
        {inCaseFlow && (
          <>
            <div className="h-8 w-[1px] bg-[#24497e]"></div>
            {/* Case attribution + hierarchy mini-map */}
            <div className="relative">
              <button
                onClick={() => setShowMap((v) => !v)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-left",
                  showMap ? "bg-[#072457] border-[#2f6fbf]" : "border-transparent hover:bg-[#072457] hover:border-[#2f6fbf]/40"
                )}
              >
                <Map className="w-4 h-4 text-[#8fc1ff] shrink-0" />
                <div className="leading-tight">
                  <div className="text-[11px] text-white font-bold tracking-wider">制动系统 · 供风系统 · 空压机</div>
                  <div className="text-[9px] text-[#7fa3c7] font-medium uppercase tracking-widest">Braking System · Air Supply · Compressor</div>
                </div>
              </button>

              {showMap && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#072457] border border-[#2f6fbf]/40 rounded-xl p-4 shadow-2xl shadow-black/50 z-50">
                  <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-3">制动系统CBM · 层级小地图</div>
                  <div className="space-y-1 text-sm font-medium">
                    <div className="text-white font-bold">制动系统CBM</div>
                    <div className="pl-4 text-blue-100/80">├─ 供风系统</div>
                    <div className="pl-8 flex items-center gap-2 text-white font-bold">
                      └─ 空压机
                      <span className="px-2 py-0.5 bg-[#E2001A] text-white text-[9px] font-bold uppercase tracking-widest rounded-full">当前案例</span>
                    </div>
                    <div className="pl-4 text-blue-100/60">├─ 制动控制</div>
                    <div className="pl-4 text-blue-100/60">├─ 制动阀与气动部件</div>
                    <div className="pl-4 text-blue-100/60">├─ 黏着与防滑</div>
                    <div className="pl-4 text-blue-100/60">└─ 基础制动</div>
                  </div>
                  <button
                    onClick={() => { setShowMap(false); onOpenLandscape(); }}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 h-9 rounded-full bg-[#1d5aa8] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#2f6fbf] transition-colors"
                  >
                    查看制动系统CBM全景
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: deck-style pill controls + logo */}
      <div className="flex items-center gap-3">
        {inCaseFlow && (
          <div className="flex items-center gap-1 rounded-full border border-[#2f6fbf]/40 bg-[#072457] p-1">
            <button
              onClick={onPrev}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#7fa3c7] hover:text-white hover:bg-[#1d5aa8] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onTogglePlay}
              className={cn(
                "play-pause-btn w-9 h-9 flex items-center justify-center rounded-full transition-colors",
                isPlaying
                  ? "bg-[#1d5aa8] text-white"
                  : "text-[#7fa3c7] hover:text-white hover:bg-[#1d5aa8]"
              )}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={onNext}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#7fa3c7] hover:text-white hover:bg-[#1d5aa8] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex items-center rounded-full border border-[#2f6fbf]/40 bg-[#072457] p-1">
          <button className="px-3 h-8 rounded-full text-xs font-bold bg-[#1d5aa8] text-white">CN</button>
          <button className="px-3 h-8 rounded-full text-xs font-medium text-[#7fa3c7] hover:text-white transition-colors">EN</button>
        </div>

        <button
          onClick={onHome}
          className="h-9 px-4 flex items-center gap-2 rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1d5aa8] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </button>

        <button
          onClick={onMore}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2f6fbf]/40 bg-[#072457] text-white hover:bg-[#1d5aa8] transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        <div className="h-8 w-[1px] bg-[#24497e] mx-1"></div>

        {/* Knorr-Bremse real logo */}
        <div className="bg-white rounded-md px-3 py-1.5 flex items-center">
          <img src={kbLogo} alt="Knorr-Bremse" className="h-7 w-auto" />
        </div>
      </div>
    </header>
  );
}
