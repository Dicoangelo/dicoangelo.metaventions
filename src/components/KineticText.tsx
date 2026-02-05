"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface KineticTextProps {
  /** The text to animate */
  text: string;
  /** Animation type */
  variant?: "split-chars" | "split-words" | "blur-in" | "slide-up" | "magnetic" | "wave";
  /** HTML tag to render */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Additional classes */
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Duration of animation (ms) */
  duration?: number;
  /** Stagger delay between elements (ms) */
  stagger?: number;
  /** Whether to animate on scroll into view */
  animateOnScroll?: boolean;
  /** Whether to apply gradient text styling */
  gradient?: boolean;
}

export default function KineticText({
  text,
  variant = "split-chars",
  as: Tag = "span",
  className = "",
  delay = 0,
  duration = 600,
  stagger = 30,
  animateOnScroll = true,
  gradient = false,
}: KineticTextProps) {
  const [isAnimated, setIsAnimated] = useState(!animateOnScroll);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const { ref: scrollRef, isVisible } = useScrollReveal({
    threshold: 0.2,
    once: true,
  });

  // Check for reduced motion preference
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
  }, []);

  // Trigger animation when visible
  useEffect(() => {
    if (animateOnScroll && isVisible) {
      const timer = setTimeout(() => setIsAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animateOnScroll, delay]);

  // Split text into elements
  const elements = useMemo(() => {
    if (variant === "split-words") {
      return text.split(" ").map((word, i) => ({ text: word, key: `word-${i}` }));
    }
    return text.split("").map((char, i) => ({
      text: char === " " ? "\u00A0" : char, // Non-breaking space
      key: `char-${i}`,
    }));
  }, [text, variant]);

  // Render without animation for reduced motion
  if (prefersReducedMotion) {
    return (
      <Tag className={`${className} ${gradient ? "gradient-text" : ""}`}>
        {text}
      </Tag>
    );
  }

  // Render based on variant
  const renderContent = () => {
    switch (variant) {
      case "split-chars":
      case "split-words":
        return elements.map((el, i) => (
          <span
            key={el.key}
            className="inline-block transition-all"
            style={{
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? "translateY(0)" : "translateY(20px)",
              transitionDuration: `${duration}ms`,
              transitionDelay: `${i * stagger}ms`,
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {el.text}
            {variant === "split-words" && i < elements.length - 1 && "\u00A0"}
          </span>
        ));

      case "blur-in":
        return elements.map((el, i) => (
          <span
            key={el.key}
            className="inline-block transition-all"
            style={{
              opacity: isAnimated ? 1 : 0,
              filter: isAnimated ? "blur(0)" : "blur(10px)",
              transform: isAnimated ? "translateY(0)" : "translateY(10px)",
              transitionDuration: `${duration}ms`,
              transitionDelay: `${i * stagger}ms`,
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {el.text}
          </span>
        ));

      case "slide-up":
        return (
          <span
            className="inline-block overflow-hidden"
            style={{ display: "inline-block" }}
          >
            <span
              className="inline-block transition-transform"
              style={{
                transform: isAnimated ? "translateY(0)" : "translateY(100%)",
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {text}
            </span>
          </span>
        );

      case "wave":
        return elements.map((el, i) => (
          <span
            key={el.key}
            className="inline-block"
            style={{
              animation: isAnimated
                ? `kinetic-wave ${duration}ms ${i * stagger}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`
                : "none",
              opacity: isAnimated ? undefined : 0,
            }}
          >
            {el.text}
          </span>
        ));

      case "magnetic":
        return (
          <MagneticText text={text} isAnimated={isAnimated} duration={duration} />
        );

      default:
        return text;
    }
  };

  return (
    <Tag
      ref={(node) => {
        // Combine refs
        (containerRef as any).current = node;
        (scrollRef as any).current = node;
      }}
      className={`${className} ${gradient ? "gradient-text" : ""}`}
      aria-label={text}
    >
      {renderContent()}
    </Tag>
  );
}

// Magnetic text effect - characters move toward cursor
function MagneticText({
  text,
  isAnimated,
  duration,
}: {
  text: string;
  isAnimated: boolean;
  duration: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!isAnimated) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isAnimated]);

  const chars = text.split("");

  return (
    <span ref={containerRef} className="relative inline-block">
      {chars.map((char, i) => {
        const charRef = charRefs.current[i];
        let transform = "translate(0, 0)";

        if (charRef && mousePos.x > 0) {
          const rect = charRef.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            const charCenterX = rect.left - containerRect.left + rect.width / 2;
            const charCenterY = rect.top - containerRect.top + rect.height / 2;
            const dx = mousePos.x - charCenterX;
            const dy = mousePos.y - charCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 100;

            if (distance < maxDistance) {
              const strength = (1 - distance / maxDistance) * 8;
              const moveX = (dx / distance) * strength;
              const moveY = (dy / distance) * strength;
              transform = `translate(${moveX}px, ${moveY}px)`;
            }
          }
        }

        return (
          <span
            key={i}
            ref={(el) => { charRefs.current[i] = el; }}
            className="inline-block transition-transform duration-150"
            style={{
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? transform : "translateY(20px)",
              transitionDuration: isAnimated ? "150ms" : `${duration}ms`,
              transitionDelay: isAnimated ? "0ms" : `${i * 30}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Animated section header with reveal effect
 */
export function AnimatedHeading({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  delay?: number;
}) {
  return (
    <KineticText
      text={children}
      variant="split-words"
      as={Tag}
      className={className}
      delay={delay}
      stagger={50}
      duration={700}
      animateOnScroll={true}
    />
  );
}

/**
 * Gradient animated heading with blur-in effect
 */
export function GradientHeading({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}) {
  return (
    <KineticText
      text={children}
      variant="blur-in"
      as={Tag}
      className={className}
      stagger={25}
      duration={500}
      gradient={true}
      animateOnScroll={true}
    />
  );
}
