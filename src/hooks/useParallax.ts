'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseParallaxOptions {
  speed?: number;  // 0.1 to 0.3 recommended for subtle effect
  disabled?: boolean;
}

interface UseParallaxReturn {
  offset: number;
  style: {
    transform: string;
    willChange: string;
    backfaceVisibility: 'hidden';
  };
  isDisabled: boolean;
}

export function useParallax(options: UseParallaxOptions = {}): UseParallaxReturn {
  const { speed = 0.15, disabled = false } = options;
  const [offset, setOffset] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  // Detect touch device and reduced motion preference on mount
  useEffect(() => {
    // Detect touch device using pointer capability (more reliable than ontouchstart)
    const touchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(touchDevice);

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to reduced motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isEffectDisabled = disabled || isTouchDevice || prefersReducedMotion;

  const handleScroll = useCallback(() => {
    if (isEffectDisabled) return;

    // Cancel any pending animation frame to prevent buildup
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Use requestAnimationFrame for smooth 60fps updates
    rafIdRef.current = requestAnimationFrame(() => {
      setOffset(window.scrollY * speed);
      rafIdRef.current = null;
    });
  }, [speed, isEffectDisabled]);

  useEffect(() => {
    if (isEffectDisabled) {
      setOffset(0);
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set offset on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleScroll, isEffectDisabled]);

  return {
    offset,
    style: {
      transform: isEffectDisabled ? 'translateY(0)' : `translateY(${offset}px)`,
      willChange: isEffectDisabled ? 'auto' : 'transform',
      backfaceVisibility: 'hidden' as const,
    },
    isDisabled: isEffectDisabled,
  };
}
