"use client";

import { useEffect, useState, useCallback } from "react";

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const updateScrollProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;

    setScrollProgress(progress);
    // Only show progress bar after scrolling past a threshold
    setIsVisible(scrolled > 100);
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame for smoother updates
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateScrollProgress]);

  // Don't render animations if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-[var(--accent)]"
        style={{
          width: `${scrollProgress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    );
  }

  return (
    <>
      {/* Main progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-[var(--background)]/50 backdrop-blur-sm" />

        {/* Progress fill with gradient */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent)] via-[#8b5cf6] to-[#a855f7]"
          style={{
            width: `${scrollProgress}%`,
            transition: "width 0.15s ease-out",
          }}
        />

        {/* Glow effect at the leading edge */}
        <div
          className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent to-white/30"
          style={{
            left: `calc(${scrollProgress}% - 2rem)`,
            opacity: scrollProgress > 5 ? 1 : 0,
            transition: "left 0.15s ease-out, opacity 0.3s ease",
          }}
        />

        {/* Subtle shadow below */}
        <div
          className="absolute top-full left-0 h-4 bg-gradient-to-b from-[var(--accent)]/20 to-transparent"
          style={{
            width: `${scrollProgress}%`,
            transition: "width 0.15s ease-out",
          }}
        />
      </div>

      {/* Percentage indicator (optional - appears on hover near top) */}
      <div
        className="fixed top-3 right-4 z-50 px-2 py-1 text-xs font-medium rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] pointer-events-none hidden md:block"
        style={{
          opacity: isVisible && scrollProgress > 5 && scrollProgress < 95 ? 0.8 : 0,
          transform: `translateY(${isVisible ? 0 : -10}px)`,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {Math.round(scrollProgress)}%
      </div>
    </>
  );
}
