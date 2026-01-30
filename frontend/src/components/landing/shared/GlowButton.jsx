import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * GlowButton - Premium CTA button with glow effect
 * @param {ReactNode} children - Button text
 * @param {string} href - Link destination (uses anchor tag)
 * @param {function} onClick - Click handler (uses button)
 * @param {boolean} showArrow - Show arrow icon
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {string} variant - Button variant: 'primary' | 'secondary'
 * @param {string} className - Additional classes
 */
export default function GlowButton({
  children,
  href,
  onClick,
  showArrow = true,
  size = 'md',
  variant = 'primary',
  className = ''
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-[15px]',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    primary: `
      bg-[#E8613C] hover:bg-[#D14D2A] text-white
      shadow-[0_1px_2px_rgba(0,0,0,0.05)]
      hover:shadow-[0_8px_24px_rgba(232,97,60,0.25),0_4px_8px_rgba(232,97,60,0.15)]
    `,
    secondary: `
      bg-white hover:bg-stone-50 text-stone-800
      border border-stone-200 hover:border-stone-300
      shadow-sm hover:shadow-md
    `,
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]
    hover:-translate-y-0.5
    active:translate-y-0 active:scale-[0.98]
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`group ${baseClasses}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`group ${baseClasses}`}>
      {content}
    </button>
  );
}
