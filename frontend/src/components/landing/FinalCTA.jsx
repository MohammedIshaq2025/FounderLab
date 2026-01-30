import React from 'react';
import RevealOnScroll from './shared/RevealOnScroll';
import { ArrowRight, Check } from 'lucide-react';

/**
 * FinalCTA - Premium light-themed conversion section
 * Refined editorial aesthetic with subtle depth and warmth
 */
export default function FinalCTA() {
  const benefits = [
    'Complete PRD in 30 minutes',
    'AI-powered tech recommendations',
    'Export for Cursor, Claude & more',
  ];

  return (
    <section className="py-24 md:py-32 bg-stone-50 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#8D323A]/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-3xl bg-white px-8 py-16 md:px-16 md:py-24
                          border border-stone-200/80 shadow-xl shadow-stone-200/50">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-[#8D323A]/[0.06] to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-stone-100 to-transparent" />
            </div>

            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #78716C 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#8D323A]/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Eyebrow with decorative lines */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#8D323A]/30" />
                <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.25em]">
                  Start Building Today
                </p>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#8D323A]/30" />
              </div>

              <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[58px] text-stone-900 tracking-[-0.03em] leading-[1.05] mb-6">
                Turn your vision into
                <br className="hidden md:block" />
                <span className="text-[#8D323A]">actionable specs</span>
              </h2>

              <p className="text-stone-500 text-[17px] md:text-[19px] mb-10 max-w-lg mx-auto leading-relaxed">
                Stop wasting weeks on documentation. Create professional PRDs that developers actually want to read.
              </p>

              {/* Benefits list */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#8D323A]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#8D323A]" strokeWidth={3} />
                    </span>
                    <span className="text-[14px] text-stone-600 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-center gap-4">
                <a
                  href="/auth"
                  className="group relative inline-flex items-center gap-2.5 px-10 py-4 rounded-full
                             bg-[#8D323A] text-white text-[16px] font-semibold
                             transition-all duration-300 ease-out
                             hover:bg-[#722830] hover:shadow-2xl hover:shadow-[#8D323A]/30
                             hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                             overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Get Started</span>
                  <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>

                <p className="text-stone-400 text-[13px]">
                  Join 500+ founders building with FounderLab
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
