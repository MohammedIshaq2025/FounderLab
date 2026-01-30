import React, { useState, useEffect, useRef } from 'react';
import RevealOnScroll from './shared/RevealOnScroll';
import { X, Check } from 'lucide-react';

/**
 * ProblemSection - Editorial contrast layout
 * Bold visual narrative: crossed-out chaos items vs clean clarity items
 * Granola-inspired typography with asymmetric composition
 */
export default function ProblemSection() {
  const [activeItem, setActiveItem] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  // Animate items sequentially when section enters view
  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && entries[0].intersectionRatio >= 0.3) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const chaosItems = [
    { text: 'Weeks of scattered docs', delay: 0 },
    { text: 'Endless revision cycles', delay: 200 },
    { text: 'Missing technical specs', delay: 400 },
    { text: 'Lost-in-translation features', delay: 600 },
  ];

  const clarityItems = [
    { text: 'One guided conversation', delay: 100 },
    { text: 'AI-structured documentation', delay: 300 },
    { text: 'Complete technical specs', delay: 500 },
    { text: 'Export-ready for developers', delay: 700 },
  ];

  return (
    <section ref={sectionRef} className="py-28 md:py-36 bg-white relative overflow-hidden">
      {/* Diagonal accent line */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-[#8D323A]/10 to-transparent"
          style={{ transform: 'translate(-50%, -50%) rotate(15deg)' }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-20 md:mb-28">
            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.2em] mb-5">
              Why FounderLab
            </p>
            <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[54px] text-stone-900 tracking-[-0.03em] leading-[1.05]">
              Skip the chaos.
              <br />
              <span className="text-[#8D323A]">Ship with clarity.</span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Two-column contrast layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 max-w-5xl mx-auto">
          {/* Left: Chaos (struck through) */}
          <div className="relative">
            <RevealOnScroll>
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center">
                  <X className="w-5 h-5 text-stone-400" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.15em]">The old way</p>
                  <p className="font-satoshi font-bold text-xl text-stone-500">Traditional PRDs</p>
                </div>
              </div>
            </RevealOnScroll>

            <div className="space-y-5">
              {chaosItems.map((item, i) => (
                <div
                  key={i}
                  className={`
                    transform transition-all duration-700 ease-out
                    ${hasAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                  `}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <div
                    className="group relative py-4 px-5 rounded-xl bg-stone-100 border border-stone-200
                               hover:bg-stone-50 transition-all duration-300 cursor-default"
                    onMouseEnter={() => setActiveItem(`chaos-${i}`)}
                    onMouseLeave={() => setActiveItem(null)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-stone-500" strokeWidth={3} />
                      </span>
                      <span className="text-[16px] text-stone-600 line-through decoration-stone-400/60 decoration-[1.5px]">
                        {item.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time indicator */}
            <div
              className={`
                mt-10 pl-5 flex items-baseline gap-2
                transform transition-all duration-700 ease-out
                ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: '800ms' }}
            >
              <span className="font-satoshi font-black text-[42px] text-stone-400 tracking-tight">2-4</span>
              <span className="text-[16px] text-stone-500 font-medium">weeks average</span>
            </div>
          </div>

          {/* Right: Clarity (highlighted) */}
          <div className="relative">
            <RevealOnScroll delay={200}>
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#8D323A] flex items-center justify-center shadow-lg shadow-[#8D323A]/20">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#8D323A] uppercase tracking-[0.15em]">The new way</p>
                  <p className="font-satoshi font-bold text-xl text-stone-900">With FounderLab</p>
                </div>
              </div>
            </RevealOnScroll>

            <div className="space-y-5">
              {clarityItems.map((item, i) => (
                <div
                  key={i}
                  className={`
                    transform transition-all duration-700 ease-out
                    ${hasAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
                  `}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <div
                    className="group relative py-4 px-5 rounded-xl bg-white border border-stone-200
                               shadow-sm hover:shadow-md hover:border-[#8D323A]/20
                               transition-all duration-300 cursor-default"
                    onMouseEnter={() => setActiveItem(`clarity-${i}`)}
                    onMouseLeave={() => setActiveItem(null)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-[#8D323A]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#8D323A]" strokeWidth={3} />
                      </span>
                      <span className="text-[16px] text-stone-700 font-medium">
                        {item.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time indicator */}
            <div
              className={`
                mt-10 pl-5
                transform transition-all duration-700 ease-out
                ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: '900ms' }}
            >
              <span className="font-satoshi font-black text-[42px] text-[#8D323A] tracking-tight">30</span>
              <span className="text-[15px] text-stone-600 ml-2">minutes total</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
