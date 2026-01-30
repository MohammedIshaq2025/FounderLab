import React, { useState, useEffect } from 'react';
import RevealOnScroll from './shared/RevealOnScroll';
import { ArrowUp } from 'lucide-react';

/**
 * ChatShowcase - Interactive chat interface with floating prompts
 * Inspired by Granola's "Put your meetings to work" section
 */
export default function ChatShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Prompts positioned around the chat bar
  const topPrompts = [
    { text: 'Suggest some features', delay: 0, duration: 4 },
    { text: 'What should my MVP include?', delay: 1.2, duration: 5 },
    { text: 'Define user personas', delay: 0.8, duration: 4.5 },
    { text: 'Key user flows?', delay: 2, duration: 3.8 },
  ];

  const bottomPrompts = [
    { text: 'List competitors', delay: 0.5, duration: 4.2 },
    { text: 'What tech stack?', delay: 1.5, duration: 3.5 },
    { text: 'Generate acceptance criteria', delay: 0.3, duration: 5.2 },
    { text: 'Data model suggestions', delay: 1.8, duration: 4.8 },
  ];

  return (
    <section className="py-24 md:py-32 bg-stone-50 relative overflow-hidden">
      {/* CSS for floating animation */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float-gentle var(--float-duration, 4s) ease-in-out infinite;
          animation-delay: var(--float-delay, 0s);
        }
      `}</style>

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header - Large bold heading like Granola */}
        <RevealOnScroll>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.2em] mb-5">
              The Experience
            </p>
            <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[54px] text-stone-900 tracking-[-0.03em] leading-[1.1] mb-5">
              Put your ideas <span className="text-[#8D323A]">to work</span>
            </h2>
            <p className="text-stone-500 text-[17px] md:text-[19px] max-w-2xl mx-auto leading-relaxed">
              FounderLab's AI coach guides you through structured conversations,
              extracting your vision into comprehensive PRD documentation.
            </p>
          </div>
        </RevealOnScroll>

        {/* Chat Interface with Surrounding Prompts */}
        <div className="relative max-w-4xl mx-auto">
          {/* Top prompts - close to chat */}
          <div
            className={`flex flex-wrap justify-center gap-2 mb-3 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {topPrompts.map((prompt, i) => (
              <PromptChip
                key={prompt.text}
                text={prompt.text}
                floatDelay={prompt.delay}
                floatDuration={prompt.duration}
              />
            ))}
          </div>

          {/* Central Chat Input - Wide pill shape */}
          <div
            className={`relative transition-all duration-700 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="relative bg-white rounded-full shadow-2xl shadow-stone-300/50 border border-stone-200 px-6 py-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-[16px] flex-1 pl-2">
                  Describe your product idea...
                </span>
                <button className="w-10 h-10 rounded-full bg-[#8D323A] flex items-center justify-center hover:bg-[#722830] transition-colors shadow-lg shadow-[#8D323A]/30">
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom prompts - close to chat */}
          <div
            className={`flex flex-wrap justify-center gap-2 mt-3 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            {bottomPrompts.map((prompt, i) => (
              <PromptChip
                key={prompt.text}
                text={prompt.text}
                floatDelay={prompt.delay}
                floatDuration={prompt.duration}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <RevealOnScroll delay={500}>
          <div className="flex justify-center mt-10">
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         bg-white text-stone-800 text-[14px] font-semibold
                         border border-stone-200
                         hover:bg-stone-50 hover:border-stone-300 transition-all duration-300
                         hover:shadow-lg"
            >
              Learn more
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

/**
 * PromptChip - Floating prompt suggestion with gentle animation
 */
function PromptChip({ text, floatDelay = 0, floatDuration = 4 }) {
  return (
    <button
      className="animate-float px-4 py-2.5 rounded-full text-[13px] font-medium
                 bg-[#8D323A]/10 text-[#8D323A] border border-[#8D323A]/20
                 hover:bg-[#8D323A] hover:text-white hover:border-[#8D323A]
                 transition-all duration-300 hover:-translate-y-0.5
                 backdrop-blur-sm"
      style={{
        '--float-delay': `${floatDelay}s`,
        '--float-duration': `${floatDuration}s`,
      }}
    >
      {text}
    </button>
  );
}
