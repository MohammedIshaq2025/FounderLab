import React from 'react';
import SectionWrapper from './shared/SectionWrapper';
import RevealOnScroll from './shared/RevealOnScroll';
import { Play } from 'lucide-react';

/**
 * ProductDemo - Video/Demo placeholder section
 */
export default function ProductDemo() {
  return (
    <SectionWrapper className="bg-white">
      <RevealOnScroll>
        <h2 className="font-satoshi font-bold text-3xl md:text-[40px] text-center text-stone-950 tracking-[-0.015em] mb-16">
          See it in action
        </h2>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <div className="max-w-[1000px] mx-auto">
          {/* Video Placeholder */}
          <div className="relative aspect-video bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl overflow-hidden border border-stone-200 shadow-lg group cursor-pointer">
            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <pattern id="demo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#57534E" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#demo-grid)" />
              </svg>
            </div>

            {/* Center gradient accent */}
            <div className="absolute inset-0 bg-gradient-radial from-[#E8613C]/5 via-transparent to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                <Play className="w-8 h-8 text-[#E8613C] ml-1" />
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-stone-200">
              <span className="text-xs font-medium text-stone-600">
                Demo coming soon
              </span>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stone-300" />
              <div className="w-3 h-3 rounded-full bg-stone-300" />
              <div className="w-3 h-3 rounded-full bg-stone-300" />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </SectionWrapper>
  );
}
