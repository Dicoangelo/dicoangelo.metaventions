'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, ReactNode, useSyncExternalStore, useCallback } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Custom hook to subscribe to prefers-reduced-motion media query
function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip animation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousPathname.current = pathname;
      return;
    }

    // Only animate if pathname changed and user doesn't prefer reduced motion
    if (pathname !== previousPathname.current && !prefersReducedMotion) {
      const container = containerRef.current;
      if (container) {
        // Trigger CSS animation by adding class
        container.classList.add('page-transitioning');

        // Remove class after animation completes to reset state
        const timeout = setTimeout(() => {
          container.classList.remove('page-transitioning');
        }, 400); // Total animation time (200ms out + 200ms in)

        previousPathname.current = pathname;
        return () => clearTimeout(timeout);
      }
    }

    previousPathname.current = pathname;
  }, [pathname, prefersReducedMotion]);

  // For reduced motion, just render without transitions
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className="page-transition-wrapper"
      style={{
        // Prevent layout shift by maintaining dimensions
        minHeight: 'inherit',
      }}
    >
      {children}
    </div>
  );
}

// Default export for backward compatibility
export default PageTransition;
