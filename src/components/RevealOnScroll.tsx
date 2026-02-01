"use client";

import React, { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface RevealOnScrollProps {
  /** Content to reveal on scroll */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Animation delay in milliseconds. Default: 0 */
  delay?: number;
  /** Direction of reveal animation. Default: 'up' */
  direction?: "up" | "down" | "left" | "right";
  /** Scroll reveal options */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Only animate once per page load. Default: true */
  once?: boolean;
}

/**
 * Component that reveals its children with animation when scrolled into view
 *
 * @example
 * ```tsx
 * <RevealOnScroll direction="up" delay={200}>
 *   <h2>This fades in and slides up</h2>
 * </RevealOnScroll>
 * ```
 */
export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.2,
  rootMargin = "0px",
  once = true,
}: RevealOnScrollProps) {
  const { ref, isVisible } = useScrollReveal({ threshold, rootMargin, once });

  // Generate direction-specific class
  const directionClass = `reveal-${direction}`;

  // Combine classes based on visibility state
  const combinedClassName = [
    "reveal-base",
    directionClass,
    isVisible ? "reveal-visible" : "reveal-hidden",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Apply delay via inline style
  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={combinedClassName}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper for staggering multiple RevealOnScroll children
 * Automatically applies increasing delays to each child
 */
export interface StaggeredRevealProps {
  children: ReactNode[];
  /** Base delay for first item in ms. Default: 0 */
  baseDelay?: number;
  /** Delay increment between items in ms. Default: 100 */
  staggerDelay?: number;
  /** Direction of reveal animation. Default: 'up' */
  direction?: "up" | "down" | "left" | "right";
  /** Additional CSS classes for each item */
  itemClassName?: string;
  /** Scroll reveal threshold */
  threshold?: number;
}

export function StaggeredReveal({
  children,
  baseDelay = 0,
  staggerDelay = 100,
  direction = "up",
  itemClassName = "",
  threshold = 0.2,
}: StaggeredRevealProps) {
  return (
    <>
      {children.map((child, index) => (
        <RevealOnScroll
          key={index}
          direction={direction}
          delay={baseDelay + index * staggerDelay}
          className={itemClassName}
          threshold={threshold}
        >
          {child}
        </RevealOnScroll>
      ))}
    </>
  );
}
