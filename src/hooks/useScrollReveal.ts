"use client";

import { useEffect, useRef, useState, RefObject } from "react";

export interface UseScrollRevealOptions {
  /** Visibility threshold (0.0 to 1.0). Default: 0.2 */
  threshold?: number;
  /** Root margin for intersection observer. Default: "0px" */
  rootMargin?: string;
  /** Only trigger animation once per page load. Default: true */
  once?: boolean;
}

export interface UseScrollRevealReturn {
  ref: RefObject<HTMLElement | null>;
  isVisible: boolean;
}

/**
 * Hook for scroll-triggered reveal animations using IntersectionObserver
 *
 * @param options - Configuration options for the scroll reveal
 * @returns Object containing ref to attach to element and visibility state
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
 * return (
 *   <div ref={ref} className={isVisible ? 'reveal-visible' : 'reveal-hidden'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useScrollReveal(options?: UseScrollRevealOptions): UseScrollRevealReturn {
  const {
    threshold = 0.2,
    rootMargin = "0px",
    once = true,
  } = options ?? {};

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already triggered and once mode is enabled
    if (once && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          hasTriggered.current = true;

          // Unobserve after first intersection when once=true
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          // Reset visibility when element leaves viewport (only if once=false)
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
