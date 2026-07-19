import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import v1Img from '@/assets/images/v1_brand_overview_1784425635760.webp';
import v2Img from '@/assets/images/v2_multi_source_data_1784425646777.webp';
import v3Img from '@/assets/images/v3_dtd_field_capability_1784425660135.webp';
import v4Img from '@/assets/images/v4_trend_ai_decision_1784425670697.webp';
import v5Img from '@/assets/images/v5_maintenance_action_1784425681207.webp';
import v6Img from '@/assets/images/v6_system_service_coverage_1784425691389.webp';

const imageMap: Record<string, string> = {
  'V1': v1Img,
  'V2': v2Img,
  'V3': v3Img,
  'V4': v4Img,
  'V5': v5Img,
  'V6': v6Img,
};

interface VideoPlaceholderProps {
  id: string;
  title: string;
  durationMs?: number;
  onEnded?: () => void;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onProgress?: (progress: number) => void;
}

export function VideoPlaceholder({ 
  id, 
  title, 
  durationMs = 5000, 
  onEnded, 
  className = "", 
  autoPlay = true,
  loop = false,
  showControls = true,
  onPlayingChange,
  onProgress
}: VideoPlaceholderProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !hasEnded) {
      const updateInterval = 50;
      interval = setInterval(() => {
        setProgress(p => {
          const next = p + (updateInterval / durationMs) * 100;
          if (next >= 100) {
            if (loop) {
              onProgress?.(0);
              return 0;
            }
            onProgress?.(100);
            return 100;
          }
          onProgress?.(next);
          return next;
        });
      }, updateInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasEnded, durationMs, loop, onProgress]);

  useEffect(() => {
    if (progress >= 100 && !hasEnded && !loop) {
      setHasEnded(true);
      setIsPlaying(false);
      onEnded?.();
    }
  }, [progress, hasEnded, loop, onEnded]);

  // Notify parent of playing-state changes
  useEffect(() => {
    onPlayingChange?.(isPlaying && !hasEnded);
  }, [isPlaying, hasEnded, onPlayingChange]);

  const handleSkip = () => {
    setProgress(100);
    setHasEnded(true);
    setIsPlaying(false);
    onEnded?.();
  };

  const handleReplay = () => {
    setProgress(0);
    setHasEnded(false);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (hasEnded) {
      handleReplay();
    } else {
      setIsPlaying(p => !p);
    }
  };

  const bgImage = imageMap[id];

  return (
    <div className={cn("relative bg-[#041a3f] overflow-hidden flex flex-col items-center justify-center rounded-xl border border-[#2f6fbf]/40 shadow-inner group/video", className)}>
      {/* Background Image */}
      {bgImage && (
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000",
            isPlaying ? "scale-105" : "scale-100",
            (!isPlaying && !hasEnded) ? "opacity-70" : "opacity-100"
          )}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      
      {/* Overlay to ensure text readability if needed */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-[#001538]/80 via-transparent to-transparent transition-opacity",
        isPlaying ? "opacity-30" : "opacity-80"
      )} />

      {/* Video Content Simulation */}
      <div className="z-10 text-center p-4 relative w-full h-full flex flex-col justify-between pointer-events-none">
        <h3 className="text-white/80 font-bold text-lg text-left drop-shadow-md">[{id}] {title}</h3>
        <div className="flex justify-center items-center flex-1" />
        <div className="mb-10">
          {!hasEnded ? (
            isPlaying && (
              <div className="text-white/60 text-xs font-mono drop-shadow-md bg-black/30 inline-block px-3 py-1 rounded-full">
                Playing... {Math.floor(progress)}% 
                <span className="ml-2 animate-pulse text-blue-400">●</span>
              </div>
            )
          ) : (
            <div className="text-white/90 text-sm font-bold bg-green-500/20 px-4 py-2 rounded-full inline-block border border-green-500/30">
              End of sequence
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!hasEnded && (
        <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-75 z-20" style={{ width: `${progress}%` }} />
      )}

      {/* Persistent control bar: pause/resume, skip, replay */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20 opacity-80 group-hover/video:opacity-100 transition-opacity duration-300">
          {!hasEnded && (
            <>
              <button 
                onClick={handleTogglePlay}
                className="w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full border border-white/20 transition-colors"
                aria-label={isPlaying ? '暂停' : '继续'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              {!loop && (
                <button 
                  onClick={handleSkip}
                  className="px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-bold rounded-full flex items-center border border-white/20 transition-colors"
                >
                  <SkipForward className="w-3 h-3 mr-1" /> 跳过
                </button>
              )}
            </>
          )}
          {hasEnded && (
            <button 
              onClick={handleReplay}
              className="px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-bold rounded-full flex items-center border border-white/20 transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> 重播
            </button>
          )}
        </div>
      )}
      
      {/* Big center play button when paused before end */}
      {!isPlaying && !hasEnded && showControls && (
        <button 
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 hover:bg-black/50 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center border border-white/20 group-hover:scale-110 shadow-xl transition-all">
            <Play className="w-8 h-8 text-white ml-1 fill-current" />
          </div>
        </button>
      )}
    </div>
  );
}
