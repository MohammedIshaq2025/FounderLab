import React from 'react';
import RevealOnScroll from './shared/RevealOnScroll';

/**
 * WorksWith - Shows AI tools that FounderLab PRDs are optimized for
 * Uses actual brand logos from /logos/ folder
 */
export default function WorksWith() {
  const tools = [
    {
      name: 'Cursor',
      logo: '/logos/cursor.svg',
      bgClass: 'bg-black',
    },
    {
      name: 'Claude',
      logo: '/logos/claude.svg',
      bgClass: 'bg-[#D97757]',
    },
    {
      name: 'Replit',
      logo: '/logos/replit.svg',
      bgClass: 'bg-[#F26207]',
    },
    {
      name: 'Bolt',
      logo: '/logos/bolt.svg',
      bgClass: 'bg-[#1E1E1E]',
    },
    {
      name: 'Windsurf',
      logo: '/logos/windsurf.svg',
      bgClass: 'bg-[#09B6A2]',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white border-y border-stone-100">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.2em] mb-5">
              Integrations
            </p>
            <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[54px] text-stone-900 tracking-[-0.03em] leading-[1.1] mb-5">
              PRDs optimized for <span className="text-[#8D323A]">AI dev tools</span>
            </h2>
            <p className="text-stone-500 text-[17px] md:text-[19px] max-w-lg mx-auto leading-relaxed">
              Export documentation formatted perfectly for your favorite AI coding assistants
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="group flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-stone-900/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className={`
                      relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden
                      transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg
                      flex items-center justify-center
                    `}
                  >
                    <img
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="text-[14px] font-medium text-stone-400 group-hover:text-stone-600 transition-colors">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
