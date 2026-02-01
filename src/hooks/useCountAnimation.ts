import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Easing function: easeOutExpo
 * Creates a natural deceleration effect where the animation
 * starts fast and gradually slows down
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Hook for animating numbers from start to end value
 * @param end - Target value to animate to
 * @param duration - Animation duration in milliseconds (default: 2000)
 * @param start - Starting value (default: 0)
 * @param shouldAnimate - Whether to animate or show final value immediately
 * @param decimals - Number of decimal places to preserve (default: 0 for integers)
 */
export function useCountAnimation(
  end: number,
  duration: number = 2000,
  start: number = 0,
  shouldAnimate: boolean = true,
  decimals: number = 0
) {
  const [count, setCount] = useState(start);
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);

      // Apply easeOutExpo for natural deceleration
      const easedProgress = easeOutExpo(linearProgress);

      // Calculate current value with proper decimal handling
      const currentValue = easedProgress * (end - start) + start;

      if (decimals > 0) {
        setCount(parseFloat(currentValue.toFixed(decimals)));
      } else {
        setCount(Math.floor(currentValue));
      }

      if (linearProgress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        // Ensure we end exactly on the target value
        setCount(end);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  }, [end, start, duration, decimals]);

  useEffect(() => {
    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (!shouldAnimate) {
      setCount(end);
      return;
    }

    // Reset to start value and begin animation
    setCount(start);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration, start, shouldAnimate, decimals, animate]);

  return count;
}
