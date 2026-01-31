import { useEffect, useRef } from 'react';

/**
 * Custom hook for using GSAP animations in React 19
 * Client-side only - safe for Next.js SSR
 */
export function useGSAP(
  callback: (context?: any) => void | (() => void),
  options?: {
    dependencies?: React.DependencyList;
    scope?: React.RefObject<Element>;
    respectReducedMotion?: boolean;
  }
) {
  const {
    dependencies = [],
    scope,
    respectReducedMotion = true,
  } = options || {};

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check reduced motion
    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Dynamically import GSAP only on client
    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Create context if scope provided, otherwise use global
        if (scope?.current) {
          const ctx = gsap.context(() => {
            callback();
          }, scope.current);

          cleanupRef.current = () => ctx.revert();
        } else {
          callback();
        }
      });
    });

    return () => {
      cleanupRef.current?.();
    };
  }, dependencies);

  return cleanupRef;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Utility to get scroll trigger defaults
 */
export function getScrollTriggerDefaults() {
  return {
    start: 'top 80%',
    toggleActions: 'play none none reverse',
    // markers: process.env.NODE_ENV === 'development', // Uncomment to debug
  };
}
