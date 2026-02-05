"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
}

interface AmbientParticlesProps {
  /** Number of particles (auto-scales on mobile) */
  count?: number;
  /** Maximum particle speed */
  maxSpeed?: number;
  /** Particle connection distance */
  connectionDistance?: number;
  /** Mouse attraction strength (0 to disable) */
  mouseAttraction?: number;
  /** Whether to show connection lines between particles */
  showConnections?: boolean;
  /** Z-index for the canvas */
  zIndex?: number;
}

export default function AmbientParticles({
  count = 80,
  maxSpeed = 0.3,
  connectionDistance = 120,
  mouseAttraction = 0.00015,
  showConnections = true,
  zIndex = -1,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  const { theme } = useTheme();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for reduced motion and mobile
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Check for mobile - use screen width and pointer capability, NOT touch support
    // Many desktop browsers report ontouchstart for trackpad support
    const checkMobile = () => {
      const isNarrow = window.innerWidth < 768;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoHover = window.matchMedia("(hover: none)").matches;
      return isNarrow && (hasCoarsePointer || hasNoHover);
    };
    setIsMobile(checkMobile());

    const handleResize = () => {
      const isNarrow = window.innerWidth < 768;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoHover = window.matchMedia("(hover: none)").matches;
      setIsMobile(isNarrow && (hasCoarsePointer || hasNoHover));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Get colors based on theme
  const getColors = useCallback(() => {
    if (theme === "light") {
      return {
        particle: "99, 102, 241", // Indigo RGB
        connection: "99, 102, 241",
        particleOpacity: 0.7,
        connectionOpacity: 0.15,
      };
    }
    return {
      particle: "99, 102, 241", // Indigo RGB
      connection: "139, 92, 246", // Purple RGB
      particleOpacity: 0.85,
      connectionOpacity: 0.2,
    };
  }, [theme]);

  // Initialize particles
  const initParticles = useCallback(
    (width: number, height: number) => {
      // Reduce count on mobile
      const actualCount = isMobile ? Math.floor(count * 0.4) : count;
      const particles: Particle[] = [];

      for (let i = 0; i < actualCount; i++) {
        const baseOpacity = Math.random() * 0.4 + 0.6; // Range: 0.6-1.0 (was 0.3-0.8)
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * maxSpeed * 2,
          vy: (Math.random() - 0.5) * maxSpeed * 2,
          radius: Math.random() * 2 + 1, // Range: 1-3px (was 0.5-2px)
          opacity: baseOpacity,
          baseOpacity,
        });
      }

      particlesRef.current = particles;
    },
    [count, maxSpeed, isMobile]
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisibleRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const colors = getColors();
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Calculate scroll-based modifiers
    const scrollProgress = Math.min(scrollRef.current / (window.innerHeight * 2), 1);
    const speedMultiplier = 1 - scrollProgress * 0.5; // Slow down as user scrolls
    const opacityMultiplier = 1 - scrollProgress * 0.15; // Gentle fade as user scrolls

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse attraction (only on desktop)
      if (!isMobile && mouse.x > 0 && mouse.y > 0 && mouseAttraction > 0) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const force = (200 - distance) * mouseAttraction;
          p.vx += dx * force;
          p.vy += dy * force;
        }
      }

      // Apply velocity with scroll-based speed modifier
      p.x += p.vx * speedMultiplier;
      p.y += p.vy * speedMultiplier;

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Ensure minimum velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed < maxSpeed * 0.1) {
        const angle = Math.random() * Math.PI * 2;
        p.vx = Math.cos(angle) * maxSpeed * 0.2;
        p.vy = Math.sin(angle) * maxSpeed * 0.2;
      }

      // Boundary wrapping
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Draw particle
      const particleOpacity = p.baseOpacity * colors.particleOpacity * opacityMultiplier;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors.particle}, ${particleOpacity})`;
      ctx.fill();

      // Draw connections (skip on mobile for performance)
      if (showConnections && !isMobile) {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const lineOpacity =
              (1 - distance / connectionDistance) * colors.connectionOpacity * opacityMultiplier;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${colors.connection}, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [getColors, isMobile, maxSpeed, mouseAttraction, showConnections, connectionDistance]);

  // Setup canvas and start animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // Cap DPR for performance
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Reinitialize particles on resize
      initParticles(width, height);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Visibility tracking for performance
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, animate, initParticles]);

  // Don't render if reduced motion is preferred
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
}
