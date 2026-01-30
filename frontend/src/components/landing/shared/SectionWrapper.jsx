import React from 'react';

/**
 * SectionWrapper - Consistent section padding and max-width for landing page
 * @param {ReactNode} children - Section content
 * @param {string} className - Additional classes
 * @param {string} id - Section ID for scroll targeting
 * @param {boolean} noPaddingTop - Skip top padding
 * @param {boolean} noPaddingBottom - Skip bottom padding
 */
export default function SectionWrapper({
  children,
  className = '',
  id,
  noPaddingTop = false,
  noPaddingBottom = false
}) {
  return (
    <section
      id={id}
      className={`
        w-full max-w-[1280px] mx-auto
        px-6 md:px-12
        ${noPaddingTop ? '' : 'pt-16 md:pt-24'}
        ${noPaddingBottom ? '' : 'pb-16 md:pb-24'}
        ${className}
      `}
    >
      {children}
    </section>
  );
}
