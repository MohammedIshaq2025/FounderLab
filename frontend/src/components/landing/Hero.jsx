import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Hero - Premium editorial hero with Granola-inspired typography
 * Bold, intentional design with oversized heading and refined details
 */
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Play video only when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Layered ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary warm glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-[#8D323A]/[0.06] via-[#8D323A]/[0.02] to-transparent rounded-full blur-3xl" />
        {/* Secondary accent */}
        <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] bg-gradient-radial from-amber-500/[0.03] to-transparent rounded-full blur-3xl" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #78716C 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Headline - Oversized Granola-style */}
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <h1 className="font-satoshi font-black text-[43px] md:text-[67px] lg:text-[81px] leading-[0.95] tracking-[-0.03em] text-stone-900 mb-6">
            From idea to PRD
            <br />
            <span className="text-[#8D323A]">
              in minutes.
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <div
          className={`text-center max-w-2xl mx-auto transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-[17px] md:text-[20px] leading-relaxed text-stone-500 mb-10">
            AI-guided conversations that transform your startup vision into
            <span className="text-stone-700 font-medium"> build-ready product documentation</span>.
          </p>
        </div>

        {/* CTA Group */}
        <div
          className={`flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 md:mb-24 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <a
            href="/auth"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                       bg-[#8D323A] text-white text-[15px] font-semibold
                       transition-all duration-300 ease-out
                       hover:bg-[#722830] hover:shadow-2xl hover:shadow-[#8D323A]/25
                       hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]
                       overflow-hidden"
          >
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">Start Building</span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-6 py-4 rounded-full
                       text-stone-600 text-[15px] font-medium
                       transition-all duration-300
                       hover:bg-white hover:shadow-lg hover:shadow-stone-200/50 hover:text-stone-900"
          >
            See how it works
          </a>
        </div>

        {/* Video with premium framing - Linear/Stripe inspired */}
        <div
          className={`max-w-[1104px] mx-auto transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="relative group">
            {/* Layered ambient shadow system - creates depth without color */}
            <div
              className="absolute -inset-px rounded-[18px] opacity-100"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0.08))',
              }}
            />

            {/* Soft outer glow - very subtle warm tint */}
            <div
              className="absolute -inset-4 rounded-[28px] opacity-50 blur-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(141,50,58,0.08) 0%, rgba(0,0,0,0.04) 100%)',
              }}
            />

            {/* Deep ambient shadow for lift */}
            <div
              className="absolute -inset-1 rounded-[20px] opacity-100"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.1)',
              }}
            />

            {/* Video container with refined border */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(0,0,0,0.06),
                  0 1px 2px rgba(0,0,0,0.04),
                  0 4px 8px rgba(0,0,0,0.04),
                  0 8px 16px rgba(0,0,0,0.04),
                  inset 0 0 0 1px rgba(255,255,255,0.1)
                `,
              }}
            >
              {/* Inner highlight for premium feel */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              />
              <video
                ref={videoRef}
                loop
                muted
                playsInline
                className="w-full h-auto block"
              >
                <source src="/FounderLabHero.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
