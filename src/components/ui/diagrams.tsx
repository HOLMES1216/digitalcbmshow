import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/* ---------- FlowDots: glowing dots travelling along an SVG path ---------- */

interface FlowDotsProps {
  path: string;
  count?: number;
  duration?: number; // seconds per full loop
  color?: string;
  r?: number;
  paused?: boolean;
}

export function FlowDots({ path, count = 3, duration = 8, color = '#8fc1ff', r = 3, paused = false }: FlowDotsProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const progressRef = useRef(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) {
        progressRef.current = (progressRef.current + dt / duration) % 1;
      }
      const pts = Array.from({ length: count }, (_, i) => {
        const p = (progressRef.current + i / count) % 1;
        const pt = el.getPointAtLength(p * len);
        return { x: pt.x, y: pt.y };
      });
      setPoints(pts);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [path, count, duration]);

  return (
    <g>
      <path ref={pathRef} d={path} fill="none" stroke="none" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} fill={color} opacity={paused ? 0.35 : 0.95 - (i / count) * 0.5} />
      ))}
    </g>
  );
}

/* ---------- LiveWave: scrolling telemetry waveform ---------- */

export function LiveWave({ color, base = 46, amp = 9, speed = 110, width = 600, height = 110 }: {
  color: string; base?: number; amp?: number; speed?: number; width?: number; height?: number;
}) {
  const N = 80;
  const [pts, setPts] = useState<number[]>(() => Array.from({ length: N }, (_, i) => base + Math.sin(i / 6) * amp * 0.6));

  useEffect(() => {
    const t = setInterval(() => {
      setPts((prev) => [
        ...prev.slice(1),
        base + Math.sin(Date.now() / 800) * amp * 0.5 + (Math.random() - 0.5) * amp,
      ]);
    }, speed);
    return () => clearInterval(t);
  }, [base, amp, speed]);

  const d = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${((i / (N - 1)) * width).toFixed(1)},${(height - p).toFixed(1)}`)
    .join(' ');
  return <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />;
}

/* ---------- FlowBar: DOM connector with animated dashes (no SVG geometry) ---------- */
export function FlowBar({ vertical = false, amber = false, className }: { vertical?: boolean; amber?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-full",
        vertical ? "w-[3px] flow-y" : "h-[3px] flow-x",
        amber ? "flow-amber" : "flow-blue",
        className
      )}
    />
  );
}

/* ---------- RadialGauge: animated radial value indicator ---------- */

interface RadialGaugeProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function RadialGauge({ value, size = 132, stroke = 11, label, sublabel }: RadialGaugeProps) {
  const [display, setDisplay] = useState(0);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gauge-amber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#0a2a5e" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#gauge-amber)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - display / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-end">
          <span className="text-4xl font-bold text-amber-400 leading-none">{display}</span>
          <span className="text-[#7fa3c7] text-sm mb-0.5 ml-0.5">/100</span>
        </div>
        {label && <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mt-1">{label}</span>}
        {sublabel && <span className="px-1.5 py-0.5 bg-[#1d5aa8]/40 text-[#8fc1ff] text-[9px] font-bold rounded mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ---------- GlowCard: unified card with entrance animation + hover glow ---------- */

export function GlowCard({ children, className, delay = 0, onClick }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={onClick ? { y: -3 } : undefined}
      onClick={onClick}
      className={cn(
        "bg-[#072457] border border-[#2f6fbf]/40 rounded-xl shadow-lg shadow-black/20 transition-colors",
        onClick && "cursor-pointer hover:border-[#2f6fbf] hover:shadow-[#1d5aa8]/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
