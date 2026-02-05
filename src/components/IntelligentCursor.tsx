"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

type CursorState = "default" | "hover" | "click" | "text" | "drag" | "hidden";

interface CursorPosition {
  x: number;
  y: number;
}

interface IntelligentCursorProps {
  /** Enable glow trail effect */
  enableTrail?: boolean;
  /** Number of trail segments */
  trailLength?: number;
  /** Cursor lerp factor (0-1, higher = snappier) */
  lerpFactor?: number;
}

export default function IntelligentCursor({
  enableTrail = true,
  trailLength = 8,
  lerpFactor = 0.15,
}: IntelligentCursorProps) {
  const { theme } = useTheme();
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Cursor positions
  const mousePos = useRef<CursorPosition>({ x: 0, y: 0 });
  const cursorPos = useRef<CursorPosition>({ x: 0, y: 0 });
  const trailPositions = useRef<CursorPosition[]>([]);

  // DOM refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Check for mobile and reduced motion
  useEffect(() => {
    const checkDevice = () => {
      // Use pointer and hover media queries instead of touch detection
      // Many desktop browsers report touch support for trackpads
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoHover = window.matchMedia("(hover: none)").matches;
      const isSmallScreen = window.innerWidth < 1024;
      // Consider mobile only if small screen AND has touch-primary input
      setIsMobile(isSmallScreen && (hasCoarsePointer || hasNoHover));
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    checkDevice();
    window.addEventListener("resize", checkDevice);
    motionQuery.addEventListener("change", (e) => setPrefersReducedMotion(e.matches));

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // Initialize trail positions
  useEffect(() => {
    if (enableTrail) {
      trailPositions.current = Array(trailLength).fill({ x: 0, y: 0 });
    }
  }, [enableTrail, trailLength]);

  // Detect hoverable elements and update cursor state
  const updateCursorState = useCallback((target: Element | null) => {
    if (!target) {
      setCursorState("default");
      return;
    }

    // Check for interactive elements
    const isLink = target.closest("a, button, [role='button'], [data-cursor='pointer']");
    const isText = target.closest("input, textarea, [contenteditable='true']");
    const isDraggable = target.closest("[draggable='true'], [data-cursor='drag']");
    const isHidden = target.closest("[data-cursor='hidden']");

    if (isHidden) {
      setCursorState("hidden");
    } else if (isDraggable) {
      setCursorState("drag");
    } else if (isText) {
      setCursorState("text");
    } else if (isLink) {
      setCursorState("hover");
    } else {
      setCursorState("default");
    }
  }, []);

  // Mouse movement handler
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      updateCursorState(e.target as Element);
    };

    const handleMouseDown = () => {
      if (cursorState !== "hidden") {
        setCursorState("click");
      }
    };

    const handleMouseUp = () => {
      // Reset to appropriate state based on current target
      const target = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
      updateCursorState(target);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile, prefersReducedMotion, cursorState, updateCursorState]);

  // Animation loop
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const animate = () => {
      // Lerp cursor position for smooth physics-based movement
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;

      // Update main cursor position
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }

      // Update dot position (follows mouse directly for precision)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }

      // Update trail positions with cascading lerp
      if (enableTrail) {
        for (let i = 0; i < trailLength; i++) {
          const prevPos = i === 0 ? cursorPos.current : trailPositions.current[i - 1];
          const trailLerp = lerpFactor * (1 - i * 0.08); // Gradually slower for each segment

          trailPositions.current[i] = {
            x: trailPositions.current[i].x + (prevPos.x - trailPositions.current[i].x) * trailLerp,
            y: trailPositions.current[i].y + (prevPos.y - trailPositions.current[i].y) * trailLerp,
          };

          const trailEl = trailRefs.current[i];
          if (trailEl) {
            trailEl.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile, prefersReducedMotion, lerpFactor, enableTrail, trailLength]);

  // Hide native cursor when component is active
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    document.body.style.cursor = "none";

    // Also hide cursor on all interactive elements
    const style = document.createElement("style");
    style.id = "intelligent-cursor-style";
    style.textContent = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = "";
      const existingStyle = document.getElementById("intelligent-cursor-style");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isMobile, prefersReducedMotion]);

  // Don't render on mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  const isLight = theme === "light";

  // Cursor state styles
  const getCursorStyles = () => {
    const baseSize = 40;
    const baseStyles = {
      width: baseSize,
      height: baseSize,
      borderColor: isLight ? "rgba(99, 102, 241, 0.6)" : "rgba(139, 92, 246, 0.6)",
      backgroundColor: "transparent",
      scale: 1,
      borderWidth: 1.5,
    };

    switch (cursorState) {
      case "hover":
        return {
          ...baseStyles,
          width: baseSize * 1.5,
          height: baseSize * 1.5,
          borderColor: isLight ? "rgba(99, 102, 241, 0.8)" : "rgba(139, 92, 246, 0.8)",
          backgroundColor: isLight ? "rgba(99, 102, 241, 0.08)" : "rgba(139, 92, 246, 0.1)",
          scale: 1,
        };
      case "click":
        return {
          ...baseStyles,
          width: baseSize * 0.8,
          height: baseSize * 0.8,
          borderColor: isLight ? "rgba(99, 102, 241, 1)" : "rgba(168, 85, 247, 1)",
          backgroundColor: isLight ? "rgba(99, 102, 241, 0.15)" : "rgba(168, 85, 247, 0.2)",
          scale: 0.9,
        };
      case "text":
        return {
          ...baseStyles,
          width: 3,
          height: 24,
          borderColor: isLight ? "rgba(99, 102, 241, 0.8)" : "rgba(139, 92, 246, 0.8)",
          backgroundColor: isLight ? "rgba(99, 102, 241, 0.8)" : "rgba(139, 92, 246, 0.8)",
          borderWidth: 0,
        };
      case "drag":
        return {
          ...baseStyles,
          width: baseSize * 1.2,
          height: baseSize * 1.2,
          borderColor: isLight ? "rgba(236, 72, 153, 0.8)" : "rgba(236, 72, 153, 0.8)",
          backgroundColor: isLight ? "rgba(236, 72, 153, 0.1)" : "rgba(236, 72, 153, 0.15)",
        };
      case "hidden":
        return {
          ...baseStyles,
          scale: 0,
        };
      default:
        return baseStyles;
    }
  };

  const styles = getCursorStyles();

  return (
    <>
      {/* Trail elements */}
      {enableTrail &&
        Array.from({ length: trailLength }).map((_, i) => (
          <div
            key={`trail-${i}`}
            ref={(el) => { trailRefs.current[i] = el; }}
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
            style={{
              width: 8 - i * 0.5,
              height: 8 - i * 0.5,
              marginLeft: -(8 - i * 0.5) / 2,
              marginTop: -(8 - i * 0.5) / 2,
              backgroundColor: isLight
                ? `rgba(99, 102, 241, ${0.3 - i * 0.03})`
                : `rgba(139, 92, 246, ${0.4 - i * 0.04})`,
              opacity: isVisible && cursorState !== "hidden" ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
            aria-hidden="true"
          />
        ))}

      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-[width,height,background-color,border-color,opacity] duration-200 ease-out"
        style={{
          width: styles.width,
          height: styles.height,
          marginLeft: -styles.width / 2,
          marginTop: -styles.height / 2,
          borderWidth: styles.borderWidth,
          borderStyle: "solid",
          borderColor: styles.borderColor,
          backgroundColor: styles.backgroundColor,
          opacity: isVisible ? 1 : 0,
          transform: `scale(${styles.scale})`,
          boxShadow:
            cursorState === "hover" || cursorState === "click"
              ? isLight
                ? "0 0 20px rgba(99, 102, 241, 0.3)"
                : "0 0 25px rgba(139, 92, 246, 0.4)"
              : "none",
        }}
        aria-hidden="true"
      />

      {/* Precision dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full transition-opacity duration-150"
        style={{
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          backgroundColor: isLight ? "rgba(99, 102, 241, 0.9)" : "rgba(139, 92, 246, 0.9)",
          opacity: isVisible && cursorState !== "text" && cursorState !== "hidden" ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}
