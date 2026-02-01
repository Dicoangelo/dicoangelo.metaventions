"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // 0-1, lower is slower
  className?: string;
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = ""
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(window.scrollY);

  useEffect(() => {
    // Check for prefers-reduced-motion to respect accessibility preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      // Capture scroll position
      lastScrollYRef.current = window.scrollY;

      // Use requestAnimationFrame to throttle updates to browser refresh rate
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current || prefersReducedMotion) return;

        const scrolled = lastScrollYRef.current;
        const parallaxValue = scrolled * speed;

        // Apply transform for parallax effect
        sectionRef.current.style.transform = `translateY(${parallaxValue}px)`;
        rafIdRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [speed]);

  return (
    <div ref={sectionRef} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
