import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import LandingNav from './LandingNav';
import LandingFooter from './LandingFooter';
import '../../styles/landing.css';

/**
 * Pricing - Beta pricing page matching foundernotes.co template
 */
export default function Pricing() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains('dark');
    html.classList.remove('dark');
    window.scrollTo(0, 0);

    const timer = setTimeout(() => setMounted(true), 100);

    return () => {
      clearTimeout(timer);
      if (hadDark) html.classList.add('dark');
    };
  }, []);

  const features = [
    '150 AI credits per month',
    'Unlimited projects',
    'AI-guided PRD generation',
    'Visual architecture canvas',
    'Tech stack recommendations',
    'Competitor research',
    'Export to Markdown & PDF',
    'Early adopter pricing lock-in',
  ];

  const specs = [
    { label: 'AI Credits', value: '150 / month' },
    { label: 'Projects', value: 'Unlimited' },
    { label: 'PRD Exports', value: 'Unlimited' },
    { label: 'Architecture Canvas', value: 'Included' },
    { label: 'Tech Stack Analysis', value: 'Included' },
    { label: 'Competitor Research', value: 'Included' },
    { label: 'Design System Generation', value: 'Included' },
    { label: 'Priority Support', value: 'Included' },
  ];

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, cancel with one click anytime. No commitments, no cancellation fees. Your access continues until the end of your billing period.',
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. All conversations and documents are encrypted end-to-end. Your chats are completely private. We use industry-standard security.',
    },
    {
      question: 'Are my PRDs used for AI training?',
      answer: 'Never. Your PRDs are yours alone. We never use customer data for training or any other purposes. Your IP stays private.',
    },
    {
      question: 'What happens after beta?',
      answer: 'Your founding member price is locked in forever. When we raise prices at launch, you keep your $9.99/month rate.',
    },
    {
      question: 'How do I get support?',
      answer: 'Email us at hello@founderlab.ai. Founding members get priority response within 24 hours.',
    },
  ];

  return (
    <div className="landing-page min-h-screen bg-[#FAFAF9]">
      <LandingNav />

      <main className="pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[1100px] mx-auto px-6">

          {/* Hero */}
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#8D323A]/10 text-[12px] font-semibold text-[#8D323A] uppercase tracking-wide mb-6">
              Limited Beta
            </div>
            <h1 className="font-satoshi font-black text-[37px] md:text-[53px] leading-[1.05] tracking-[-0.03em] text-stone-900 mb-4">
              Shape the future{' '}
              <span className="text-[#8D323A]">with us</span>
            </h1>
            <p className="text-[17px] text-stone-500 max-w-md mx-auto">
              Join our beta and lock in founding member pricing forever.
            </p>
          </div>

          {/* Pricing Card */}
          <div
            className={`max-w-[420px] mx-auto transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50 p-8">
              {/* Plan name */}
              <div className="text-[13px] font-semibold text-[#8D323A] uppercase tracking-wide mb-4">
                Beta Plan
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="font-satoshi font-black text-[52px] tracking-[-0.03em] text-stone-900 leading-none">
                  $9.99
                </span>
                <span className="text-stone-400 text-[17px] ml-1">/month</span>
              </div>
              <p className="text-[14px] text-stone-500 mb-6">
                Locked in. Price increases at launch.
              </p>

              {/* CTA Button */}
              <a
                href="/auth"
                className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                           bg-[#8D323A] text-white text-[15px] font-semibold
                           transition-all duration-300 ease-out
                           hover:bg-[#722830] hover:shadow-xl hover:shadow-[#8D323A]/20
                           active:scale-[0.98]"
              >
                Join the beta
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>

              {/* Trial text */}
              <p className="text-center text-[13px] text-stone-500 mt-4">
                Start with a 7-day free trial
              </p>
              <p className="text-center text-[12px] text-stone-400 mt-1">
                No charge until trial ends. Cancel anytime.
              </p>

              {/* Features list */}
              <ul className="space-y-3 mt-8 pt-6 border-t border-stone-100">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#8D323A] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-3 mt-6 text-[12px] text-stone-400">
              <span>Secure checkout</span>
              <span className="text-stone-300">·</span>
              <span>Cancel anytime</span>
              <span className="text-stone-300">·</span>
              <a href="/terms" className="hover:text-stone-600 transition-colors">Terms</a>
              <span className="text-stone-300">·</span>
              <a href="/privacy" className="hover:text-stone-600 transition-colors">Privacy</a>
            </div>
          </div>

          {/* Specifications Table */}
          <div
            className={`mt-20 md:mt-28 max-w-[600px] mx-auto transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h2 className="font-satoshi font-black text-[24px] md:text-[28px] text-stone-900 tracking-[-0.03em] text-center mb-8">
              What's <span className="text-[#8D323A]">Included</span>
            </h2>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              {specs.map((spec, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i !== specs.length - 1 ? 'border-b border-stone-100' : ''
                  }`}
                >
                  <span className="text-[14px] text-stone-600">{spec.label}</span>
                  <span className="text-[14px] font-medium text-stone-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div
            className={`mt-20 md:mt-28 max-w-[600px] mx-auto transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h2 className="font-satoshi font-black text-[24px] md:text-[28px] text-stone-900 tracking-[-0.03em] text-center mb-8">
              Common <span className="text-[#8D323A]">Questions</span>
            </h2>

            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border-b border-stone-200 ${index === 0 ? 'border-t' : ''}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left group"
                  >
                    <span className="font-medium text-[15px] text-stone-800 group-hover:text-[#8D323A] transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform duration-300 flex-shrink-0 ${
                        openFaq === index ? 'rotate-180 text-[#8D323A]' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-[200px] opacity-100 pb-5' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[14px] text-stone-500 leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <p className="text-center text-[13px] text-stone-400 mt-10">
              More questions?{' '}
              <a href="mailto:hello@founderlab.ai" className="text-[#8D323A] font-medium hover:underline">
                Get in touch
              </a>
            </p>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
