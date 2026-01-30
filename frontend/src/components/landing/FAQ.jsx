import React, { useState } from 'react';
import RevealOnScroll from './shared/RevealOnScroll';
import { ChevronDown } from 'lucide-react';

/**
 * FAQ - Clean, modern accordion-style FAQ section
 * Premium editorial aesthetic with smooth animations
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What exactly is a PRD?',
      answer: 'A Product Requirements Document (PRD) is a comprehensive guide that outlines everything needed to build your product — from user stories and feature specifications to technical architecture and acceptance criteria. It serves as the single source of truth for your development team.',
    },
    {
      question: 'How long does it take to create a PRD?',
      answer: 'Most founders complete their PRD in a single 30-minute session. Our AI coach guides you through a structured conversation, extracting and organizing your ideas in real-time. You can see your PRD taking shape on the visual canvas as you go.',
    },
    {
      question: 'Do I need technical knowledge to use FounderLab?',
      answer: 'Not at all. FounderLab is designed for founders and product managers of all technical backgrounds. Our AI translates your vision into technical specifications, suggests appropriate tech stacks, and formats everything for developers.',
    },
    {
      question: 'What formats can I export my PRD in?',
      answer: 'You can export your PRD as Markdown or PDF. Both formats are optimized for AI coding tools like Cursor, Claude, and Replit — just copy, paste, and start building.',
    },
    {
      question: 'Can I edit my PRD after it\'s generated?',
      answer: 'Yes. Your PRD is stored in your dashboard and you can revisit, refine, and regenerate sections anytime. As your product evolves, so can your documentation.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. All conversations and documents are encrypted and stored securely. We never share your product ideas or PRDs with third parties. Your intellectual property remains yours.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-14 md:mb-16">
            <p className="text-[11px] font-semibold text-[#8D323A] uppercase tracking-[0.2em] mb-5">
              FAQ
            </p>
            <h2 className="font-satoshi font-black text-[28px] md:text-[46px] lg:text-[54px] text-stone-900 tracking-[-0.03em] leading-[1.05]">
              Common <span className="text-[#8D323A]">questions</span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <RevealOnScroll key={index} delay={index * 50}>
              <div
                className={`
                  border-b border-stone-200 last:border-b-0
                  ${index === 0 ? 'border-t' : ''}
                `}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-6 flex items-center justify-between gap-4 text-left
                             group transition-colors duration-200"
                >
                  <span className="font-satoshi font-bold text-[17px] md:text-[18px] text-stone-800
                                   group-hover:text-[#8D323A] transition-colors duration-200">
                    {faq.question}
                  </span>
                  <span
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full bg-stone-100
                      flex items-center justify-center
                      transition-all duration-300
                      group-hover:bg-[#8D323A]/10
                      ${openIndex === index ? 'bg-[#8D323A]/10' : ''}
                    `}
                  >
                    <ChevronDown
                      className={`
                        w-4 h-4 text-stone-500 transition-transform duration-300
                        group-hover:text-[#8D323A]
                        ${openIndex === index ? 'rotate-180 text-[#8D323A]' : ''}
                      `}
                    />
                  </span>
                </button>

                {/* Answer with smooth height animation */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-out
                    ${openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}
                  `}
                >
                  <p className="text-[15px] text-stone-600 leading-relaxed pr-12">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Bottom prompt */}
        <RevealOnScroll delay={400}>
          <div className="text-center mt-12">
            <p className="text-[14px] text-stone-500">
              Have more questions?{' '}
              <a
                href="mailto:hello@founderlab.ai"
                className="text-[#8D323A] font-medium hover:underline transition-colors"
              >
                Get in touch
              </a>
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
