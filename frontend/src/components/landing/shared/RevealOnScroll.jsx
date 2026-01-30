import React, { useState, useEffect, useRef } from 'react';

/**
 * RevealOnScroll - Intersection Observer based reveal animation
 * @param {ReactNode} children - Content to reveal
 * @param {number} delay - Delay in ms before reveal (for staggering)
 * @param {string} className - Additional classes
 * @param {string} direction - Animation direction: 'up' | 'down' | 'left' | 'right'
 */
export default function RevealOnScroll({
  children,
  delay = 0,
  className = '',
  direction = 'up'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'down':
        return isVisible ? 'translateY(0)' : 'translateY(-24px)';
      case 'left':
        return isVisible ? 'translateX(0)' : 'translateX(24px)';
      case 'right':
        return isVisible ? 'translateX(0)' : 'translateX(-24px)';
      case 'up':
      default:
        return isVisible ? 'translateY(0)' : 'translateY(24px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
