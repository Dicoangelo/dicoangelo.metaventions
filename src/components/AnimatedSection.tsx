"use client";

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /**
   * Animation variant
   */
  variant?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  /**
   * Animation delay in seconds
   */
  delay?: number;
  /**
   * Animation duration in seconds
   */
  duration?: number;
}

/**
 * Animated section with scroll reveal
 *
 * Usage:
 * ```tsx
 * <AnimatedSection variant="fade-up">
 *   <h1>Content here</h1>
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  children,
  id,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 0.8,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const animations = {
        'fade-up': { y: 60, opacity: 0 },
        'fade-in': { opacity: 0 },
        'slide-left': { x: -60, opacity: 0 },
        'slide-right': { x: 60, opacity: 0 },
      };

      gsap.from(sectionRef.current, {
        ...animations[variant],
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { dependencies: [variant, delay, duration] }
  );

  return (
    <section ref={sectionRef} id={id} className={className}>
      {children}
    </section>
  );
}
