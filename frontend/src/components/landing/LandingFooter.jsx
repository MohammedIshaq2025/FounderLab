import React from 'react';
import { Twitter, Github, ArrowUpRight } from 'lucide-react';

/**
 * LandingFooter - Clean, modern minimal footer
 */
export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 md:py-20 grid md:grid-cols-2 gap-12 md:gap-8">
          {/* Left: Logo and tagline */}
          <div>
            <a href="/landing" className="inline-block mb-5">
              <img
                src="/logo-white.svg"
                alt="FounderLab"
                className="h-12"
              />
            </a>
            <p className="text-stone-400 text-[15px] leading-relaxed max-w-sm">
              Transform your startup ideas into comprehensive,
              build-ready PRDs through AI-guided conversations.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800/50 flex items-center justify-center
                           text-stone-400 hover:text-white hover:bg-stone-800
                           transition-all duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800/50 flex items-center justify-center
                           text-stone-400 hover:text-white hover:bg-stone-800
                           transition-all duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: Links */}
          <div className="md:flex md:justify-end">
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              {/* Product */}
              <div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Product
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/landing#features"
                      className="group text-[14px] text-stone-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="/landing#how-it-works"
                      className="text-[14px] text-stone-400 hover:text-white transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="/pricing"
                      className="text-[14px] text-stone-400 hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth"
                      className="group text-[14px] text-stone-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      Get Started
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Legal
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/privacy"
                      className="text-[14px] text-stone-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-[14px] text-stone-400 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-stone-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-stone-500">
            © {currentYear} FounderLab. All rights reserved.
          </p>
          <p className="text-[13px] text-stone-600">
            Built for founders, by founders.
          </p>
        </div>
      </div>
    </footer>
  );
}
