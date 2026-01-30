import React from 'react';
import RevealOnScroll from './shared/RevealOnScroll';

/**
 * Testimonial - Clean, minimal quote section
 */
export default function Testimonial() {
  return (
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            {/* Large quote mark */}
            <div className="mb-8">
              <span className="text-[80px] md:text-[100px] font-serif text-stone-200 leading-none select-none">
                "
              </span>
            </div>

            {/* Quote Text */}
            <blockquote className="text-[22px] md:text-[28px] text-stone-700 leading-relaxed mb-10 font-satoshi font-medium tracking-[-0.01em] -mt-12">
              FounderLab helped me go from a napkin sketch to a complete PRD in under an hour.
              My dev team actually understood what to build.
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-800 to-stone-600
                              flex items-center justify-center overflow-hidden">
                <span className="text-white font-medium text-[15px]">SC</span>
              </div>

              {/* Info */}
              <div className="text-left">
                <div className="font-semibold text-stone-800 text-[15px]">
                  Sarah Chen
                </div>
                <div className="text-[13px] text-stone-500">
                  Founder & CEO, TechStartup
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
