import React, { useState, useEffect, useRef } from 'react';
import RevealOnScroll from './shared/RevealOnScroll';
import {
  MessageSquare,
  Workflow,
  FileDown,
  Search,
  Layers,
  Palette,
  ArrowUpRight,
} from 'lucide-react';

/**
 * Features - Premium editorial bento-box layout
 * Asymmetric, sophisticated, with intentional hierarchy
 * Hero feature + staggered supporting cards
 */
export default function Features() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  // Track mouse for ambient glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const heroFeature = {
    number: '01',
    icon: MessageSquare,
    title: 'AI Coach',
    headline: 'Your product thinking partner',
    description: 'Guided conversations that extract your best ideas through structured discovery. Our AI asks the right questions, challenges assumptions, and helps you articulate your vision with clarity.',
    accent: 'The brain behind your PRD',
  };

  const features = [
    {
      number: '02',
      icon: Workflow,
      title: 'Visual Canvas',
      description: 'Watch your PRD take shape on a live mindmap as you build — real-time visualization of your product architecture.',
    },
    {
      number: '03',
      icon: FileDown,
      title: 'Smart Export',
      description: 'Markdown + PDF optimized for AI dev tools. Copy into Cursor, Claude, or Replit and start building immediately.',
    },
    {
      number: '04',
      icon: Search,
      title: 'Competitor Research',
      description: 'Built-in web search provides market context, competitive analysis, and positioning insights.',
    },
    {
      number: '05',
      icon: Layers,
      title: 'Tech Stack',
      description: 'AI-powered technology recommendations tailored to your project scope and technical requirements.',
    },
    {
      number: '06',
      icon: Palette,
      title: 'Design System',
      description: 'Auto-generated color palettes, typography scales, and component guidelines for your app.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-28 md:py-36 bg-stone-50 relative overflow-hidden"
    >
      {/* Ambient mouse-following glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(141, 50, 58, 0.08) 0%, transparent 70%)',
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          transform: 'translate(0, 0)',
        }}
      />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(90deg, #78716C 1px, transparent 1px),
                              linear-gradient(#78716C 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Decorative accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#8D323A]/30 to-transparent" />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header with large typography */}
        <RevealOnScroll>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.25em] mb-5">
              Capabilities
            </p>
            <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[58px] text-stone-900 tracking-[-0.03em] leading-[1.05] mb-6">
              Everything{' '}
              <span className="text-[#8D323A]">you need</span>
            </h2>
            <p className="text-stone-500 text-[17px] md:text-[19px] max-w-xl mx-auto leading-relaxed">
              Six powerful capabilities working together to transform your vision into implementation-ready documentation.
            </p>
          </div>
        </RevealOnScroll>

        {/* Hero Feature Card - Large, dominant */}
        <RevealOnScroll delay={100}>
          <div
            className="group relative mb-6 cursor-pointer"
            onMouseEnter={() => setActiveFeature('hero')}
            onMouseLeave={() => setActiveFeature(null)}
          >
            <div className="relative bg-white rounded-3xl p-8 md:p-12 border border-stone-200/80
                            transition-all duration-500 ease-out
                            hover:border-[#8D323A]/20 hover:shadow-2xl hover:shadow-stone-300/40
                            hover:-translate-y-1">
              {/* Large number watermark */}
              <div className="absolute top-6 right-8 md:top-8 md:right-12">
                <span className="font-satoshi font-black text-[100px] md:text-[140px] leading-none text-stone-100
                                 transition-colors duration-500 group-hover:text-[#8D323A]/[0.08]">
                  {heroFeature.number}
                </span>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                {/* Icon container with animated ring */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-[#8D323A]/10 scale-110 opacity-0
                                  transition-all duration-500 group-hover:opacity-100 group-hover:scale-125 blur-xl" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#8D323A] to-[#722830]
                                  flex items-center justify-center shadow-lg shadow-[#8D323A]/20
                                  transition-transform duration-500 group-hover:scale-105">
                    <heroFeature.icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 max-w-xl">
                  <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.2em] mb-2">
                    {heroFeature.accent}
                  </p>
                  <h3 className="font-satoshi font-black text-[28px] md:text-[36px] text-stone-900 tracking-[-0.02em] mb-3">
                    {heroFeature.title}
                  </h3>
                  <p className="text-stone-500 text-[16px] md:text-[17px] leading-relaxed mb-4">
                    {heroFeature.description}
                  </p>

                  {/* Subtle link indicator */}
                  <div className="flex items-center gap-2 text-[#8D323A] opacity-0 -translate-x-2
                                  transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <span className="text-[13px] font-semibold">Learn more</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden rounded-br-3xl pointer-events-none">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-stone-100/80 to-transparent
                                transition-colors duration-500 group-hover:from-[#8D323A]/[0.04]" />
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Feature Grid - 6-column bento layout for perfect fill */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <RevealOnScroll
              key={feature.title}
              delay={150 + i * 60}
              className={`
                ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}
              `}
            >
              <div
                className={`
                  group relative bg-white rounded-2xl p-6 md:p-7 border border-stone-200/80
                  transition-all duration-400 ease-out cursor-pointer h-full
                  hover:border-[#8D323A]/20 hover:shadow-xl hover:shadow-stone-200/60
                  hover:-translate-y-1
                `}
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Number - positioned top right, fills with color on hover */}
                <div className="absolute top-4 right-5">
                  <span className={`
                    font-satoshi font-bold text-[32px] leading-none tracking-tight
                    transition-all duration-300
                    ${activeFeature === i
                      ? 'text-[#8D323A]'
                      : 'text-stone-200 group-hover:text-[#8D323A]'
                    }
                  `}>
                    {feature.number}
                  </span>
                </div>

                {/* Icon - colored by default */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5
                                bg-[#8D323A] shadow-lg shadow-[#8D323A]/20">
                  <feature.icon
                    className="w-5 h-5 text-white"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Title */}
                <h3 className="font-satoshi font-bold text-[18px] text-stone-900 mb-2 tracking-[-0.01em]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-stone-500 text-[14px] leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`
                  absolute bottom-0 left-6 right-6 h-[2px] rounded-full
                  transition-all duration-400 origin-left
                  ${activeFeature === i
                    ? 'bg-[#8D323A] scale-x-100'
                    : 'bg-stone-200 scale-x-0 group-hover:scale-x-100 group-hover:bg-[#8D323A]/50'
                  }
                `} />
              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
