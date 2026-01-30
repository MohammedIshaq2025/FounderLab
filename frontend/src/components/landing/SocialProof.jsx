import React from 'react';
import RevealOnScroll from './shared/RevealOnScroll';

/**
 * SocialProof - Minimal trust indicators
 */
export default function SocialProof() {
  const stats = [
    { value: '500+', label: 'PRDs generated' },
    { value: '30min', label: 'average completion' },
    { value: '4.9★', label: 'user rating' },
  ];

  return (
    <section className="py-10 md:py-12 border-y border-stone-200/60">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <span className="text-[22px] md:text-[26px] font-satoshi font-bold text-stone-800">
                  {stat.value}
                </span>
                <span className="text-[13px] text-stone-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                {i < stats.length - 1 && (
                  <span className="hidden md:block w-px h-6 bg-stone-200 ml-6" />
                )}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
