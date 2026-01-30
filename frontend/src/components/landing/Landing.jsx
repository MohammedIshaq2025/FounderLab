import React, { useEffect } from 'react';
import '../../styles/landing.css';

// Components
import LandingNav from './LandingNav';
import Hero from './Hero';
import ProblemSection from './ProblemSection';
import ChatShowcase from './ChatShowcase';
import HowItWorks from './HowItWorks';
import Features from './Features';
import WorksWith from './WorksWith';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import LandingFooter from './LandingFooter';

/**
 * Landing - Main landing page
 * Premium, light-themed page showcasing FounderLab's AI-powered PRD generator
 */
export default function Landing() {
  // Ensure light theme for landing page
  useEffect(() => {
    // Temporarily force light theme for landing page
    const html = document.documentElement;
    const hadDark = html.classList.contains('dark');
    html.classList.remove('dark');

    // Handle hash navigation or scroll to top
    const hash = window.location.hash;
    if (hash) {
      // Wait for content to render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      // Restore dark class if it was present
      if (hadDark) {
        html.classList.add('dark');
      }
    };
  }, []);

  return (
    <div className="landing-page min-h-screen bg-[#FAFAF9]">
      <LandingNav />

      <main>
        <Hero />
        <ProblemSection />
        <ChatShowcase />
        <HowItWorks />
        <Features />
        <WorksWith />
        <FAQ />
        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
