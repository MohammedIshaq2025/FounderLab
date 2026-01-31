import React, { useState, useEffect, useRef } from 'react';
import RevealOnScroll from './shared/RevealOnScroll';
import { Lightbulb, Layers, Network, FileText, Download } from 'lucide-react';

/**
 * HowItWorks - Premium editorial-style process showcase
 * Granola-inspired: large typography, staggered cards, intentional negative space
 * Features auto-play cascade animation when section enters viewport
 */
export default function HowItWorks() {
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const [highlightedPhases, setHighlightedPhases] = useState(new Set());
  const [allComplete, setAllComplete] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const sectionRef = useRef(null);

  // Auto-play cascade animation when section comes into view
  useEffect(() => {
    if (hasPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setHasPlayed(true);

          // Cascade animation - each phase gets highlighted and stays
          const delays = [400, 900, 1400, 1900, 2400];

          delays.forEach((delay, index) => {
            setTimeout(() => {
              setHighlightedPhases(prev => new Set([...prev, index]));

              // After the last phase is highlighted, trigger the glow
              if (index === 4) {
                setTimeout(() => {
                  setAllComplete(true);
                  setShowGlow(true);
                }, 400);
              }
            }, delay);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayed]);

  // Check if a phase should be highlighted (from cascade animation)
  const isPhaseHighlighted = (index) => highlightedPhases.has(index);

  // Check if a phase is being hovered (separate from cascade)
  const isPhaseHovered = (index) => hoveredPhase === index;

  const phases = [
    {
      number: '01',
      title: 'Ideation',
      headline: 'Share your vision',
      description: 'Tell us about your product idea. Our AI coach asks the right questions to uncover your core value proposition.',
      icon: Lightbulb,
    },
    {
      number: '02',
      title: 'Features',
      headline: 'Define what matters',
      description: 'Collaboratively identify and prioritize the features that will make your product successful.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Architecture',
      headline: 'Map the system',
      description: 'Visualize your product structure with an interactive architecture diagram of components and connections.',
      icon: Network,
    },
    {
      number: '04',
      title: 'Generate',
      headline: 'Create your PRD',
      description: 'AI synthesizes everything into a comprehensive, developer-ready product requirements document.',
      icon: FileText,
    },
    {
      number: '05',
      title: 'Export',
      headline: 'Ship it',
      description: 'Download your PRD in formats optimized for Cursor, Claude, and other AI coding tools.',
      icon: Download,
    },
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* CSS for flowing glow animation */}
      <style>{`
        @keyframes flow-glow {
          0% {
            top: 24px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: calc(100% - 24px);
            opacity: 0;
          }
        }
        .animate-flow-glow {
          animation: flow-glow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #78716C 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header - Large Granola-style */}
        <RevealOnScroll>
          <div className="text-center mb-16 md:mb-24">
            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.2em] mb-5">
              The Process
            </p>
            <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[54px] text-stone-900 tracking-[-0.03em] leading-[1.1] mb-5">
              Five steps to <span className="text-[#8D323A]">your PRD</span>
            </h2>
            <p className="text-stone-500 text-[17px] md:text-[19px] max-w-xl mx-auto leading-relaxed">
              From idea to implementation-ready documentation in one guided session.
            </p>
          </div>
        </RevealOnScroll>

        {/* Desktop: Staggered editorial layout - centered */}
        <div className="hidden lg:block">
          <div className="relative max-w-[780px] mx-auto">
            {/* Vertical flow line - theme colored gradient */}
            <div className="absolute left-[171px] top-[24px] bottom-[24px] w-px bg-gradient-to-b from-[#8D323A]/20 via-[#8D323A]/40 to-[#8D323A]/20" />

            {/* Flowing glow effect after all phases complete */}
            {showGlow && (
              <div
                className="absolute left-[168px] w-[7px] h-16 animate-flow-glow pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(141, 50, 58, 0.6) 0%, rgba(141, 50, 58, 0.3) 30%, transparent 70%)',
                  filter: 'blur(3px)',
                }}
              />
            )}

            {/* Phases */}
            <div className="space-y-4">
              {phases.map((phase, i) => (
                <RevealOnScroll key={phase.number} delay={i * 80}>
                  <div
                    className="relative flex items-center gap-8 group cursor-default transition-all duration-500 ease-out"
                    onMouseEnter={() => setHoveredPhase(i)}
                    onMouseLeave={() => setHoveredPhase(null)}
                  >
                    {/* Number column - fixed width, vertically centered */}
                    <div className="w-[120px] flex-shrink-0 text-right flex items-center justify-end h-[80px]">
                      <span
                        className={`
                          font-satoshi font-black text-[56px] leading-none tracking-[-0.04em]
                          transition-colors duration-300
                          ${isPhaseHighlighted(i) ? 'text-[#8D323A]' : 'text-stone-200'}
                        `}
                      >
                        {phase.number}
                      </span>
                    </div>

                    {/* Connector dot - vertically centered */}
                    <div className="relative flex-shrink-0 w-[40px] flex justify-center items-center h-[80px]">
                      <div
                        className={`
                          w-3 h-3 rounded-full border-2 bg-white z-10
                          transition-all duration-300
                          ${isPhaseHighlighted(i)
                            ? 'border-[#8D323A] scale-125 shadow-md shadow-[#8D323A]/15'
                            : 'border-[#8D323A]/30'
                          }
                        `}
                      />
                    </div>

                    {/* Content card - hover shows subtle elevation, cascade shows highlight */}
                    <div
                      className={`
                        flex-1 max-w-[520px] py-4 px-6 rounded-2xl border
                        transition-all duration-300 ease-out
                        ${isPhaseHovered(i)
                          ? 'bg-white border-stone-200 shadow-lg shadow-stone-200/60 -translate-y-0.5'
                          : isPhaseHighlighted(i)
                            ? 'bg-stone-50/80 border-transparent'
                            : 'bg-transparent border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`
                            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                            transition-all duration-300
                            ${isPhaseHighlighted(i)
                              ? 'bg-[#8D323A] shadow-md shadow-[#8D323A]/20'
                              : 'bg-stone-100'
                            }
                          `}
                        >
                          <phase.icon
                            className={`
                              w-5 h-5 transition-colors duration-300
                              ${isPhaseHighlighted(i) ? 'text-white' : 'text-stone-500'}
                            `}
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-0.5">
                            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.15em]">
                              {phase.title}
                            </p>
                            <span className="text-stone-300">—</span>
                            <h3 className="font-satoshi font-bold text-lg text-stone-900">
                              {phase.headline}
                            </h3>
                          </div>
                          <p className="text-[14px] text-stone-500 leading-relaxed">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet: Compact cards */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            {phases.map((phase, i) => (
              <RevealOnScroll key={phase.number} delay={i * 60}>
                <div
                  className={`
                    relative p-5 rounded-2xl bg-stone-50 border border-stone-100
                    transition-all duration-300 hover:shadow-lg hover:border-stone-200
                    ${i === 4 ? 'col-span-2 max-w-md mx-auto' : ''}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center flex-shrink-0">
                      <phase.icon className="w-5 h-5 text-[#8D323A]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-stone-400">{phase.number}</span>
                        <span className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-wider">
                          {phase.title}
                        </span>
                      </div>
                      <h3 className="font-satoshi font-bold text-[15px] text-stone-900 mb-1">
                        {phase.headline}
                      </h3>
                      <p className="text-[13px] text-stone-500 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-4 bottom-4 w-px bg-stone-200" />

            <div className="space-y-8">
              {phases.map((phase, i) => (
                <RevealOnScroll key={phase.number} delay={i * 60}>
                  <div className="relative flex gap-5">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
                        <phase.icon className="w-4 h-4 text-[#8D323A]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-stone-300">{phase.number}</span>
                        <span className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-wider">
                          {phase.title}
                        </span>
                      </div>
                      <h3 className="font-satoshi font-bold text-[15px] text-stone-900 mb-1">
                        {phase.headline}
                      </h3>
                      <p className="text-[13px] text-stone-500 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
