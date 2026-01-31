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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const scrolled = window.scrollY;
      const parallaxValue = scrolled * speed;

      // Apply transform for parallax effect
      sectionRef.current.style.transform = `translateY(${parallaxValue}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={sectionRef} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
