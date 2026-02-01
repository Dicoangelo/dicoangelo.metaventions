'use client';

import { forwardRef } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spin' | 'pulse' | 'dots';
  color?: 'primary' | 'secondary' | 'white';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const colorClasses = {
  primary: {
    border: 'border-[#6366f1]',
    borderMuted: 'border-[#6366f1]/20',
    bg: 'bg-[#6366f1]',
    bgMuted: 'bg-[#6366f1]/20',
  },
  secondary: {
    border: 'border-[#8b5cf6]',
    borderMuted: 'border-[#8b5cf6]/20',
    bg: 'bg-[#8b5cf6]',
    bgMuted: 'bg-[#8b5cf6]/20',
  },
  white: {
    border: 'border-white',
    borderMuted: 'border-white/20',
    bg: 'bg-white',
    bgMuted: 'bg-white/20',
  },
};

const dotSizeClasses = {
  sm: 'w-1 h-1',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

const dotGapClasses = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
};

/**
 * Spinner component with multiple variants, sizes, and colors
 *
 * @example
 * // Basic spin variant
 * <Spinner />
 *
 * @example
 * // Large pulse with label
 * <Spinner size="lg" variant="pulse" label="Loading content..." />
 *
 * @example
 * // White dots for dark backgrounds
 * <Spinner variant="dots" color="white" />
 */
const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'spin',
      color = 'primary',
      label,
      className = '',
    },
    ref
  ) => {
    const colors = colorClasses[color];
    const sizeClass = sizeClasses[size];

    // Render spin variant - rotating circle with gap
    const renderSpinVariant = () => (
      <div className={`relative ${sizeClass} ${className}`}>
        <div
          className={`absolute inset-0 rounded-full border-2 ${colors.borderMuted}`}
        />
        <div
          className={`absolute inset-0 rounded-full border-2 ${colors.border} border-t-transparent animate-spinner-spin`}
        />
      </div>
    );

    // Render pulse variant - pulsing circle
    const renderPulseVariant = () => (
      <div
        className={`${sizeClass} rounded-full ${colors.bg} animate-spinner-pulse ${className}`}
      />
    );

    // Render dots variant - three bouncing dots
    const renderDotsVariant = () => (
      <div className={`flex items-center ${dotGapClasses[size]} ${className}`}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${dotSizeClasses[size]} rounded-full ${colors.bg} animate-spinner-bounce`}
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    );

    const variantRenderers = {
      spin: renderSpinVariant,
      pulse: renderPulseVariant,
      dots: renderDotsVariant,
    };

    return (
      <div
        ref={ref}
        className="inline-flex flex-col items-center gap-2"
        role="status"
        aria-busy="true"
      >
        {variantRenderers[variant]()}
        {label && (
          <span
            className="text-sm text-[var(--muted)]"
            aria-live="polite"
          >
            {label}
          </span>
        )}
        {/* Hidden text for screen readers when no label provided */}
        {!label && <span className="sr-only">Loading...</span>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
export { Spinner };
export type { SpinnerProps };
