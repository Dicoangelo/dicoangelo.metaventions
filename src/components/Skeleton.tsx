'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'animate-shimmer bg-[var(--card-hover)]';

  const variantClasses: Record<string, string> = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : '100%'
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Card skeleton for loading states
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 ${className}`}>
      <Skeleton variant="text" width="40%" className="mb-4" />
      <Skeleton variant="text" lines={3} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

// Metric skeleton for number loading
export function MetricSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`metric-card p-6 rounded-xl ${className}`}>
      <Skeleton variant="text" width="60%" height={20} className="mb-2" />
      <Skeleton variant="text" width="40%" height={36} />
    </div>
  );
}

export default Skeleton;
