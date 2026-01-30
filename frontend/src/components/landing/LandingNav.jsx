import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * LandingNav - Premium sticky navigation with blur effect
 */
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in on mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // We're on the landing page, smooth scroll
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // We're on a different page, navigate to landing with hash
      window.location.href = `/landing#${id}`;
    }
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 h-16
        transition-all duration-500 ease-out
        ${scrolled
          ? 'bg-[#FAFAF9]/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
        }
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between w-full">
        {/* Logo */}
        <a
          href="/landing"
          className="flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <img
            src="/logo-black.svg"
            alt="FounderLab"
            className="h-14"
          />
        </a>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className="px-4 py-2 text-[14px] font-medium text-stone-500 hover:text-stone-900
                       transition-colors duration-200 rounded-lg hover:bg-stone-100/50"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
            className="px-4 py-2 text-[14px] font-medium text-stone-500 hover:text-stone-900
                       transition-colors duration-200 rounded-lg hover:bg-stone-100/50"
          >
            How It Works
          </a>
          <a
            href="/pricing"
            className="px-4 py-2 text-[14px] font-medium text-stone-500 hover:text-stone-900
                       transition-colors duration-200 rounded-lg hover:bg-stone-100/50"
          >
            Pricing
          </a>

          <div className="w-px h-5 bg-stone-200 mx-3" />

          <a
            href="/auth"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                       text-white text-[14px] font-medium
                       shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]
                       transition-all duration-300 ease-out
                       hover:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]
                       hover:translate-y-[-1px]
                       active:scale-[0.98] active:translate-y-0"
          >
            Launch App
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <a
          href="/auth"
          className="md:hidden px-4 py-2 rounded-xl
                     bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                     text-white text-[13px] font-medium
                     shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          Launch App
        </a>
      </div>
    </nav>
  );
}
