import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Box, Layers, Palette, Server } from 'lucide-react';

/**
 * HeroCanvas - Animated canvas mockup showing the product flow
 *
 * Animation sequence:
 * t=0s: Root node appears
 * t=2s: Ideation node flies in
 * t=4s: Feature nodes cascade
 * t=6s: Tech stack node appears
 * t=8s: UI Design node appears
 * t=10s: Pulse effect on all
 * t=12s: Hold
 * t=14s: Fade out, reset, loop
 */
export default function HeroCanvas() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000];
    let timeouts = [];

    const runAnimation = () => {
      phases.forEach((time, index) => {
        const timeout = setTimeout(() => {
          setPhase(index);
        }, time);
        timeouts.push(timeout);
      });

      // Reset and loop
      const resetTimeout = setTimeout(() => {
        setPhase(0);
        runAnimation();
      }, 16000);
      timeouts.push(resetTimeout);
    };

    runAnimation();

    return () => timeouts.forEach(t => clearTimeout(t));
  }, []);

  const nodeBase = "absolute bg-white rounded-xl shadow-lg border border-stone-200 transition-all duration-700";
  const accentBar = "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl";

  return (
    <div className="relative bg-stone-100 rounded-2xl shadow-xl border border-stone-200 overflow-hidden aspect-[16/10]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D6D3D1" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* SVG Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {/* Root to Ideation */}
        {phase >= 1 && (
          <path
            d="M 50% 50% Q 60% 45% 70% 35%"
            className="animate-edge-draw"
            fill="none"
            stroke="#44403C"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            style={{
              d: 'path("M 400 200 Q 480 180 530 140")',
              opacity: phase >= 1 ? 1 : 0,
              transition: 'opacity 0.5s'
            }}
          />
        )}
        {/* Root to Features */}
        {phase >= 2 && (
          <path
            fill="none"
            stroke="#44403C"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            style={{
              d: 'path("M 400 220 L 400 280")',
              opacity: phase >= 2 ? 1 : 0,
              transition: 'opacity 0.5s'
            }}
          />
        )}
        {/* Root to Tech */}
        {phase >= 3 && (
          <path
            fill="none"
            stroke="#44403C"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            style={{
              d: 'path("M 400 180 L 400 120")',
              opacity: phase >= 3 ? 1 : 0,
              transition: 'opacity 0.5s'
            }}
          />
        )}
        {/* Root to UI */}
        {phase >= 4 && (
          <path
            fill="none"
            stroke="#44403C"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
            style={{
              d: 'path("M 360 200 L 280 160")',
              opacity: phase >= 4 ? 1 : 0,
              transition: 'opacity 0.5s'
            }}
          />
        )}
      </svg>

      {/* Root Node - Always visible */}
      <div
        className={`
          ${nodeBase} w-44 h-16 flex items-center gap-3 px-4
          ${phase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          ${phase === 5 ? 'animate-pulse-glow' : ''}
        `}
        style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}
      >
        <div className={`${accentBar} bg-stone-700`} />
        <div className="ml-2 w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-stone-600" />
        </div>
        <div>
          <div className="text-xs font-medium text-stone-400">Project</div>
          <div className="text-sm font-semibold text-stone-700">My Startup</div>
        </div>
      </div>

      {/* Ideation Node - Right of root */}
      <div
        className={`
          ${nodeBase} w-40 h-14 flex items-center gap-2 px-3
          transition-all duration-700
          ${phase >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
          ${phase === 5 ? 'animate-pulse-glow' : ''}
        `}
        style={{ top: '25%', right: '12%', zIndex: 10 }}
      >
        <div className={`${accentBar} bg-[#8D323A]`} />
        <div className="ml-2 w-6 h-6 rounded-md bg-[#FDF5F6] flex items-center justify-center">
          <Lightbulb className="w-3 h-3 text-[#8D323A]" />
        </div>
        <div className="text-sm font-medium text-stone-700">Ideation</div>
      </div>

      {/* Feature Nodes - Below root */}
      <div
        className="absolute flex gap-3"
        style={{ top: '68%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
      >
        {['User Auth', 'Dashboard', 'Analytics'].map((feature, i) => (
          <div
            key={feature}
            className={`
              ${nodeBase} w-28 h-12 flex items-center gap-2 px-3
              transition-all duration-500
              ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              ${phase === 5 ? 'animate-pulse-glow' : ''}
            `}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className={`${accentBar} bg-amber-500`} />
            <Box className="ml-2 w-3 h-3 text-amber-600" />
            <span className="text-xs font-medium text-stone-600 truncate">{feature}</span>
          </div>
        ))}
      </div>

      {/* Tech Stack Node - Above root */}
      <div
        className={`
          ${nodeBase} w-36 h-14 flex items-center gap-2 px-3
          transition-all duration-700
          ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          ${phase === 5 ? 'animate-pulse-glow' : ''}
        `}
        style={{ top: '12%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
      >
        <div className={`${accentBar} bg-teal-500`} />
        <div className="ml-2 w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center">
          <Server className="w-3 h-3 text-teal-500" />
        </div>
        <div className="text-sm font-medium text-stone-700">Tech Stack</div>
      </div>

      {/* UI Design Node - Left of root */}
      <div
        className={`
          ${nodeBase} w-36 h-14 flex items-center gap-2 px-3
          transition-all duration-700
          ${phase >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
          ${phase === 5 ? 'animate-pulse-glow' : ''}
        `}
        style={{ top: '28%', left: '10%', zIndex: 10 }}
      >
        <div className={`${accentBar} bg-rose-500`} />
        <div className="ml-2 w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center">
          <Palette className="w-3 h-3 text-rose-500" />
        </div>
        <div className="text-sm font-medium text-stone-700">UI Design</div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 opacity-40">
        <div className="w-4 h-4 rounded bg-stone-600 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">F</span>
        </div>
        <span className="text-xs font-medium text-stone-500">FounderLab</span>
      </div>
    </div>
  );
}
