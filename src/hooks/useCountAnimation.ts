import { useEffect, useState } from "react";

export function useCountAnimation(
  end: number,
  duration: number = 2000,
  start: number = 0,
  shouldAnimate: boolean = true
) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, start, shouldAnimate]);

  return count;
}
