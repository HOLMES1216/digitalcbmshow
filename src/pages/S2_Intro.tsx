import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, TrendingUp, ChevronRight, Bell, Activity, ThermometerSun } from 'lucide-react';
import { cn } from '@/lib/utils';
import compressorImg from '@/assets/images/compressor.webp';

interface S2Props {
  onNext: () => void;
}

/* Small random-walk live value */
function useLive(base: number, amp: number, intervalMs = 1300) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const t = setInterval(() => {
      setV((prev) => {
        const next = prev + (Math.random() - 0.5) * amp;
        return Math.min(base + amp, Math.max(base - amp, next));
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [base, amp, intervalMs]);
  return v;
}

/* Session monitor timer */
function useSessionClock() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/* Scrolling live waveform channel */
function LiveWave({ color, base = 46, amp = 9, speed = 110, width = 600, height = 110 }: {
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
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${((i / (N - 1)) * width).toFixed(1)},${(height - p).toFixed(1)}`).join(' ');
  return <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />;
}

/* Arc gauge for temperature */
function TempGauge({ value }: { value: number }) {
  const min = 55, max = 85;
  const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const angle = 180 - ratio * 180;
  const ax = 60 + 42 * Math.cos((angle * Math.PI) / 180);
  const ay = 62 - 42 * Math.sin((angle * Math.PI) / 180);
  return (
    <svg viewBox="0 0 120 72" className="w-24">
      <path d="M12,62 A48,48 0 0 1 108,62" fill="none" stroke="#0a2a5e" strokeWidth="8" strokeLinecap="round" />
      <path d="M12,62 A48,48 0 0 1 108,62" fill="none" stroke="#4f8ff7" strokeWidth="8" strokeLinecap="round"
        strokeDasharray="151" strokeDashoffset={151 * (1 - ratio)} className="transition-all duration-700" />
      <line x1="60" y1="62" x2={ax} y2={ay} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-700" />
      <circle cx="60" cy="62" r="4" fill="#f59e0b" />
    </svg>
  );
}

export function S2Intro({ onNext }: S2Props) {
  const temp = useLive(72, 1.6);
  const vib = useLive(4.2, 0.5, 900);
  const pressure = useLive(0.82, 0.05, 1100);
  const duty = useLive(38, 3, 1600);
  const clock = useSessionClock();

  return (
    <div className="flex flex-col h-full px-12 md:px-24 pt-8 bg-[#002b6b] overflow-y-auto">
      {/* Header */}
      <div className="max-w-5xl space-y-3 mb-4 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <nav className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#7fa3c7]">
            <span>制动系统 CBM</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>供风系统</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">空压机案例</span>
            <span className="ml-2 font-light text-blue-300/70">Braking System CBM / Air Supply / Compressor Case</span>
          </nav>
          <span className="px-3 py-1 bg-[#E2001A] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            本次互动案例 · Featured Interactive Story
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          设备仍在运行，状态正在悄然变化。<br/>
          <span className="text-blue-200 font-light text-2xl">The equipment is still running. Its condition is beginning to change.</span>
        </h1>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left: condition console */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[56%] bg-[#072457] rounded-2xl border border-[#2f6fbf]/40 p-5 flex flex-col shadow-lg shadow-black/20"
        >
          {/* Console header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-white">空压机状态监测台</span>
              <span className="text-[10px] text-[#7fa3c7] font-medium">Compressor Condition Console</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0a2a5e] border border-[#2f6fbf]/40 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-300 tracking-widest">LIVE · 演示数据</span>
            </div>
          </div>

          {/* Instrument area */}
          <div className="flex-1 relative min-h-0 mb-4 rounded-xl overflow-hidden">
            {/* Blueprint grid backdrop */}
            <div className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: 'linear-gradient(#2f6fbf22 1px, transparent 1px), linear-gradient(90deg, #2f6fbf22 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Hairline cross dividers */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#2f6fbf]/15" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2f6fbf]/15" />
            {/* Section captions */}
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.3em] text-[#2f6fbf]">ASSET</span>

            {/* TL: temperature gauge */}
            <div className="absolute top-0 left-0 w-56 bg-[#0a2a5e]/70 rounded-xl border border-[#2f6fbf]/40 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest flex items-center gap-1">
                  <ThermometerSun className="w-3.5 h-3.5 text-[#4f8ff7]" /> 排气温度
                </span>
                <span className="text-lg font-bold text-white transition-all">{temp.toFixed(1)}<span className="text-xs text-[#7fa3c7] ml-0.5">°C</span></span>
              </div>
              <TempGauge value={temp} />
            </div>

            {/* TR: vibration */}
            <div className="absolute top-0 right-0 w-56 bg-[#0a2a5e]/70 rounded-xl border border-[#2f6fbf]/40 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> 振动
                </span>
                <span className="text-lg font-bold text-white">{vib.toFixed(2)}<span className="text-xs text-[#7fa3c7] ml-0.5">mm/s</span></span>
              </div>
              <svg viewBox="0 0 200 44" className="w-full h-11">
                <LiveWave color="#f59e0b" base={22} amp={7} speed={130} width={200} height={44} />
              </svg>
            </div>

            {/* BL: run hours + session */}
            <div className="absolute bottom-0 left-0 w-56 bg-[#0a2a5e]/70 rounded-xl border border-[#2f6fbf]/40 p-3">
              <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-1">运行时间</div>
              <div className="text-lg font-bold text-white">12,400<span className="text-xs text-[#7fa3c7] ml-1">h</span></div>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-[#8fc1ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8fc1ff] animate-pulse" />
                持续监测 {clock}
              </div>
            </div>

            {/* BR: events & maintenance */}
            <div className="absolute bottom-0 right-0 w-56 bg-[#0a2a5e]/70 rounded-xl border border-[#2f6fbf]/40 p-3 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7fa3c7] font-medium">最近事件</span>
                <span className="text-emerald-300 font-bold">无报警</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7fa3c7] font-medium">最近维护</span>
                <span className="text-blue-100/90 font-bold">120 天前</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#7fa3c7] font-medium">数据更新</span>
                <span className="text-[#8fc1ff] font-bold">刚刚</span>
              </div>
            </div>

            {/* Mid-left: discharge pressure */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-36 bg-[#0a2a5e]/80 rounded-xl border border-[#2f6fbf]/40 p-2.5">
              <div className="text-[9px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-1">排气压力</div>
              <div className="text-base font-bold text-white mb-1.5">{pressure.toFixed(2)}<span className="text-[10px] text-[#7fa3c7] ml-1">MPa</span></div>
              <div className="h-1.5 rounded-full bg-[#072457] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#1d5aa8] to-[#22d3ee] transition-all duration-700"
                  style={{ width: `${(pressure / 1.1) * 100}%` }} />
              </div>
            </div>

            {/* Mid-right: duty cycle donut */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-36 bg-[#0a2a5e]/80 rounded-xl border border-[#2f6fbf]/40 p-2.5 flex items-center gap-2.5">
              <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90 shrink-0">
                <circle cx="22" cy="22" r="17" fill="none" stroke="#072457" strokeWidth="7" />
                <circle cx="22" cy="22" r="17" fill="none" stroke="#a78bfa" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray="106.8" strokeDashoffset={106.8 * (1 - duty / 100)} className="transition-all duration-700" />
              </svg>
              <div>
                <div className="text-[9px] text-[#7fa3c7] font-bold uppercase tracking-widest">占空比</div>
                <div className="text-base font-bold text-white">{duty.toFixed(0)}<span className="text-[10px] text-[#7fa3c7] ml-0.5">%</span></div>
              </div>
            </div>

            {/* Center: compressor with bezel ring + HUD frame + scanline */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative flex items-center justify-center"
              >
                {/* Instrument bezel: tick ring + channel arcs */}
                <svg viewBox="0 0 320 320" className="absolute w-[320px] h-[320px]">
                  <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 90, ease: 'linear' }}
                    style={{ originX: '160px', originY: '160px' }}
                  >
                    {Array.from({ length: 60 }).map((_, i) => {
                      const a = i * 6 * (Math.PI / 180);
                      const major = i % 5 === 0;
                      const r1 = major ? 130 : 136;
                      const r2 = 144;
                      return (
                        <line key={i}
                          x1={160 + r1 * Math.cos(a)} y1={160 + r1 * Math.sin(a)}
                          x2={160 + r2 * Math.cos(a)} y2={160 + r2 * Math.sin(a)}
                          stroke={major ? '#2f6fbf' : '#1a3a6b'} strokeWidth={major ? 2 : 1}
                        />
                      );
                    })}
                  </motion.g>
                  {['#4f8ff7', '#22d3ee', '#f59e0b', '#a78bfa'].map((tone, i) => (
                    <circle key={tone} cx="160" cy="160" r="118" fill="none"
                      stroke={tone} strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${(2 * Math.PI * 118 * 70) / 360} ${2 * Math.PI * 118}`}
                      transform={`rotate(${-90 + i * 90} 160 160)`} opacity="0.85"
                    />
                  ))}
                </svg>

                <img src={compressorImg} alt="空压机" className="w-52 h-52 rounded-2xl object-cover border-2 border-[#2f6fbf]/50 shadow-2xl shadow-[#1d5aa8]/30" />
                {/* HUD corner brackets */}
                {['-top-2 -left-2 border-t-2 border-l-2', '-top-2 -right-2 border-t-2 border-r-2', '-bottom-2 -left-2 border-b-2 border-l-2', '-bottom-2 -right-2 border-b-2 border-r-2'].map((cls) => (
                  <span key={cls} className={cn("absolute w-7 h-7 border-[#8fc1ff]", cls)} />
                ))}
                {/* Scanline */}
                <motion.div
                  animate={{ top: ['0%', '92%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-[#8fc1ff]/15 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          {/* Dual live channels */}
          <div className="shrink-0 bg-[#0a2a5e]/70 rounded-xl border border-[#2f6fbf]/40 p-3">
            <div className="flex items-center gap-5 mb-1 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-blue-100/70"><span className="w-3 h-0.5 bg-[#4f8ff7]" />振动通道</span>
              <span className="flex items-center gap-1.5 text-blue-100/70"><span className="w-3 h-0.5 bg-[#22d3ee]" />温度通道</span>
            </div>
            <svg viewBox="0 0 600 110" preserveAspectRatio="none" className="w-full h-20">
              {[28, 55, 82].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#2f6fbf" strokeOpacity="0.15" strokeDasharray="4 6" />
              ))}
              <LiveWave color="#4f8ff7" base={50} amp={10} speed={110} />
              <LiveWave color="#22d3ee" base={66} amp={6} speed={150} />
            </svg>
          </div>
        </motion.div>

        {/* Right: story + status sequence + baseline deviation */}
        <div className="w-[44%] flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-blue-100 font-medium text-base leading-relaxed mb-2"
          >
            作为制动系统供风环节的关键设备，一台空压机仍在正常运行，当前没有明确的故障报警。但多源状态数据表明，部分指标正在缓慢偏离健康基线。
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-sm text-[#8fc1ff] font-bold mb-5"
          >
            以下以空压机为例，展示从多源数据到维护行动的完整 CBM 服务流程。
          </motion.p>

          <div className="space-y-2.5 mb-5">
            {[
              { icon: CheckCircle2, text: '正常运行', tone: 'text-green-400', bar: 'bg-green-500', delay: 1.0 },
              { icon: Bell, text: '暂无明确故障报警', tone: 'text-blue-300', bar: 'bg-[#4f8ff7]', delay: 1.6 },
              { icon: AlertCircle, text: '趋势需要关注', tone: 'text-amber-300', bar: 'bg-amber-500', delay: 2.6 },
            ].map((s) => (
              <motion.div
                key={s.text}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: s.delay, duration: 0.45 }}
                className="flex items-center bg-[#072457] px-4 py-3 rounded-lg shadow-lg shadow-black/20 border border-[#2f6fbf]/40 relative overflow-hidden"
              >
                <span className={cn("absolute left-0 top-0 bottom-0 w-1", s.bar)} />
                <s.icon className={cn("w-5 h-5 mr-3", s.tone)} />
                <span className="text-sm font-bold text-white">{s.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Why attention: evidence rows */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0 }}
            className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-3.5 mb-5"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest">为什么需要关注</span>
              <span className="px-1.5 py-0.5 bg-[#1d5aa8]/40 text-[#8fc1ff] text-[9px] font-bold rounded">演示数据</span>
            </div>
            <div className="space-y-2">
              {[
                { label: '压力建立时间', delta: '+6%', note: '较30天前' },
                { label: '启停频次', delta: '+30%', note: '近30天' },
                { label: '单位能耗', delta: '+4%', note: '同等工况' },
              ].map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3.2 + i * 0.2 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-blue-100/80 font-medium">{r.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-[#7fa3c7]">{r.note}</span>
                    <span className="flex items-center text-xs font-bold text-amber-300">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />{r.delta}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2 }}
            className="bg-[#072457] rounded-lg border border-[#2f6fbf]/40 p-3"
          >
            <div className="text-[10px] text-[#7fa3c7] font-bold uppercase tracking-widest mb-1">健康基线 vs 当前趋势</div>
            <svg viewBox="0 0 320 90" className="w-full h-20">
              <rect x="8" y="48" width="304" height="24" fill="#10b981" fillOpacity="0.10" />
              <line x1="8" y1="60" x2="312" y2="60" stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 4" />
              <motion.path
                d="M8,62 C70,60 140,58 190,50 C240,42 280,30 312,16"
                fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 3.5, duration: 1.6, ease: 'easeInOut' }}
              />
              <motion.circle cx="312" cy="16" r="4" fill="#f59e0b"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.1 }} />
              <text x="14" y="44" fill="#34d399" fontSize="8" fontWeight="bold">健康基线</text>
              <motion.text x="306" y="12" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="end"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.1 }}>缓慢偏离</motion.text>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Conclusion + main button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.4 }}
        className="mt-4 mb-10 flex justify-between items-center bg-[#072457] p-6 rounded-xl border border-[#2f6fbf]/40 shadow-lg shadow-black/20 shrink-0"
      >
        <div className="flex items-center">
          <TrendingUp className="w-8 h-8 text-[#8fc1ff] mr-4 shrink-0" />
          <div>
            <p className="text-xl text-white font-bold">CBM不是等待故障，而是更早识别状态变化。</p>
            <p className="text-sm text-blue-100/80 mt-1 font-medium">CBM does not wait for failure. It identifies condition changes earlier.</p>
          </div>
        </div>
        <button 
          onClick={onNext}
          className="px-8 py-4 bg-[#1d5aa8] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2f6fbf] transition-colors shrink-0 whitespace-nowrap ml-8"
        >
          查看数据来自哪里
        </button>
      </motion.div>
    </div>
  );
}
