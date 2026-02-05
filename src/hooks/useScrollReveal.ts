"use client";

import { useEffect, useRef, useState, RefObject, useCallback } from "react";

export interface UseScrollRevealOptions {
  /** Visibility threshold (0.0 to 1.0). Default: 0.2 */
  threshold?: number;
  /** Root margin for intersection observer. Default: "0px 0px -50px 0px" */
  rootMargin?: string;
  /** Only trigger animation once per page load. Default: true */
  once?: boolean;
  /** Delay before revealing (ms). Default: 0 */
  delay?: number;
  /** Respect prefers-reduced-motion. Default: true */
  respectReducedMotion?: boolean;
}

export interface UseScrollRevealReturn {
  ref: RefObject<HTMLElement | null>;
  isVisible: boolean;
  hasRevealed: boolean;
}

/**
 * Hook for scroll-triggered reveal animations using IntersectionObserver
 *
 * @param options - Configuration options for the scroll reveal
 * @returns Object containing ref to attach to element, visibility state, and revealed flag
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
 * return (
 *   <div ref={ref} className={isVisible ? 'reveal-visible reveal-up' : 'reveal-hidden reveal-up'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useScrollReveal(options?: UseScrollRevealOptions): UseScrollRevealReturn {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -50px 0px",
    once = true,
    delay = 0,
    respectReducedMotion = true,
  } = options ?? {};

  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const hasTriggered = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    if (respectReducedMotion) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        setHasRevealed(true);
        return;
      }
    }

    const element = ref.current;
    if (!element) return;

    // Skip if already triggered and once mode is enabled
    if (once && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasTriggered.current = true;

          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              setHasRevealed(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasRevealed(true);
          }

          // Unobserve after first intersection when once=true
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          // Reset visibility when element leaves viewport (only if once=false)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, once, delay, respectReducedMotion]);

  return { ref, isVisible, hasRevealed };
}

/**
 * Hook for staggered reveal animations on multiple elements
 * Reveals children with a delay between each
 */
export interface UseStaggeredRevealOptions {
  /** Base threshold for visibility. Default: 0.1 */
  threshold?: number;
  /** Root margin. Default: "0px 0px -50px 0px" */
  rootMargin?: string;
  /** Delay between each item reveal (ms). Default: 100 */
  staggerDelay?: number;
  /** Initial delay before first item reveals (ms). Default: 0 */
  initialDelay?: number;
}

export interface UseStaggeredRevealReturn {
  containerRef: RefObject<HTMLElement | null>;
  isContainerVisible: boolean;
  getItemDelay: (index: number) => number;
  getItemStyle: (index: number) => React.CSSProperties;
}

export function useStaggeredReveal(options?: UseStaggeredRevealOptions): UseStaggeredRevealReturn {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    staggerDelay = 100,
    initialDelay = 0,
  } = options ?? {};

  const { ref: containerRef, isVisible: isContainerVisible } = useScrollReveal({
    threshold,
    rootMargin,
    once: true,
  });

  const getItemDelay = useCallback(
    (index: number) => initialDelay + index * staggerDelay,
    [initialDelay, staggerDelay]
  );

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => ({
      transitionDelay: isContainerVisible ? `${getItemDelay(index)}ms` : "0ms",
    }),
    [isContainerVisible, getItemDelay]
  );

  return {
    containerRef,
    isContainerVisible,
    getItemDelay,
    getItemStyle,
  };
}
