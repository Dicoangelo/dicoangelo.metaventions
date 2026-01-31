import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server (SSR safety)
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Custom hook for using GSAP animations in React 19
 *
 * Provides:
 * - Automatic cleanup of GSAP animations
 * - Context-based scoping
 * - SSR safety
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *
 *   useGSAP(() => {
 *     gsap.from('.box', { opacity: 0, y: 50 });
 *   }, { scope: containerRef });
 *
 *   return <div ref={containerRef}>...</div>;
 * }
 * ```
 */
export function useGSAP(
  callback: (context: gsap.Context) => void | (() => void),
  options?: {
    /**
     * Dependencies array (like useEffect)
     * If not provided, runs only once on mount
     */
    dependencies?: React.DependencyList;
    /**
     * Scope element for GSAP context
     * All selectors will be scoped to this element
     */
    scope?: React.RefObject<Element>;
    /**
     * Whether to respect prefers-reduced-motion
     * Default: true
     */
    respectReducedMotion?: boolean;
  }
) {
  const {
    dependencies = [],
    scope,
    respectReducedMotion = true,
  } = options || {};

  const contextRef = useRef<gsap.Context | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    // Check for reduced motion preference
    if (respectReducedMotion && typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Skip animations if user prefers reduced motion
        return;
      }
    }

    // Create GSAP context
    const ctx = gsap.context(() => {
      const cleanup = callback(contextRef.current!);
      return cleanup;
    }, scope?.current || undefined);

    contextRef.current = ctx;

    // Cleanup function
    return () => {
      ctx.revert();
    };
  }, dependencies);

  return contextRef;
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
