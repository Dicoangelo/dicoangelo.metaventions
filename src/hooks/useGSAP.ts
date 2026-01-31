import { useEffect, useRef } from 'react';

// Define minimal types to avoid GSAP import
interface GSAPContext {
  revert: () => void;
}

/**
 * Custom hook for using GSAP animations in React 19
 *
 * SIMPLIFIED VERSION - No actual GSAP, just CSS animations
 * This prevents SSR crashes while maintaining the API
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *
 *   useGSAP(() => {
 *     // Animation code (ignored in this version)
 *   }, { scope: containerRef });
 *
 *   return <div ref={containerRef}>...</div>;
 * }
 * ```
 */
export function useGSAP(
  callback: (context?: any) => void | (() => void),
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

  const contextRef = useRef<GSAPContext | undefined>(undefined);

  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    if (respectReducedMotion) {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Skip animations if user prefers reduced motion
        return;
      }
    }

    // For now, just skip the callback to prevent GSAP crashes
    // The CSS animations in globals.css will handle visual effects

    // Return empty cleanup
    return () => {
      // No cleanup needed
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
