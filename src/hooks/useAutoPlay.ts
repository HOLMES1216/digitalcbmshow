import { useState, useEffect, useCallback, useRef } from 'react';

interface AutoPlayOptions {
  pageDurations: Record<number, number>; // index -> duration in ms
  totalPages: number;
  onTimeout: () => void; // Function to call when returning to standby
  timeoutMs: number;
  paused?: boolean; // Pause auto-advance and inactivity reset (e.g. while a video plays)
}

export function useAutoPlay({ pageDurations, totalPages, onTimeout, timeoutMs, paused = false }: AutoPlayOptions) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      onTimeout();
      setCurrentPage(0);
      setIsPlaying(true);
    }, timeoutMs);
  }, [onTimeout, timeoutMs]);

  const advance = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev < totalPages - 1) {
        return prev + 1;
      }
      return prev; // Stop at the last page (CTA) or loop if desired, but requirements say return to standby after inactivity
    });
  }, [totalPages]);

  useEffect(() => {
    clearTimers();
    if (paused) {
      return clearTimers;
    }
    resetInactivityTimer();

    // Auto-play logic
    if (isPlaying && currentPage > 1 && currentPage < totalPages - 1) {
      // Don't auto-advance on standby (0), home (1), or CTA (9)
      const duration = pageDurations[currentPage];
      if (duration) {
        timerRef.current = setTimeout(() => {
          advance();
        }, duration);
      }
    }

    return clearTimers;
  }, [currentPage, isPlaying, paused, advance, clearTimers, resetInactivityTimer, pageDurations, totalPages]);

  // Global event listener for user interaction
  useEffect(() => {
    const handleInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.play-pause-btn')) return;
      setIsPlaying(false);
      resetInactivityTimer();
    };

    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [resetInactivityTimer]);

  const goTo = (index: number) => {
    setCurrentPage(index);
    resetInactivityTimer();
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    resetInactivityTimer();
  };

  return {
    currentPage,
    isPlaying,
    goTo,
    togglePlay,
    advance,
    prev: () => goTo(Math.max(0, currentPage - 1)),
  };
}
