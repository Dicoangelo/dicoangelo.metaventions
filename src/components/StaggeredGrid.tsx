"use client";

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';

interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
  /**
   * Selector for items to stagger
   * Default: "> *" (direct children)
   */
  itemSelector?: string;
  /**
   * Stagger delay between items in seconds
   */
  stagger?: number;
  /**
   * Animation duration per item
   */
  duration?: number;
}

/**
 * Grid container with staggered fade-in animation
 *
 * Usage:
 * ```tsx
 * <StaggeredGrid className="grid grid-cols-3 gap-4">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggeredGrid>
 * ```
 */
export function StaggeredGrid({
  children,
  className = '',
  itemSelector = '> *',
  stagger = 0.15,
  duration = 0.6,
}: StaggeredGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;

      const items = itemSelector === '> *'
        ? Array.from(gridRef.current.children)
        : gridRef.current.querySelectorAll(itemSelector);

      if (items.length === 0) return;

      gsap.from(items, {
        y: 80,
        opacity: 0,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { dependencies: [itemSelector, stagger, duration] }
  );

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  );
}
