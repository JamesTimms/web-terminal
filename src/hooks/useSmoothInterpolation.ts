import { useCallback, useEffect, useRef, useState } from "react";

export interface SmoothInterpolationOptions {
  initialValue: number;
  targetValue?: number;
  speed?: number;
  fps?: number;
  threshold?: number;
  key?: string;
}

export interface UseExponentialSmoothingReturn {
  position: number;
  updateTarget: (newValue: number) => void;
}

export function useSmoothInterpolation({
  initialValue,
  targetValue,
  speed = 2,
  fps = 30,
  threshold = 0.0005,
  key = "default",
}: SmoothInterpolationOptions): UseExponentialSmoothingReturn {
  const positionRef = useRef<number>(initialValue);
  const targetRef = useRef<number>(targetValue ?? initialValue);

  // Track time between frames
  const previousTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const frameDuration = 1000 / fps;
  const nextFrameTimeRef = useRef<number>(0);

  const [renderPosition, setRenderPosition] = useState<number>(initialValue);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
        nextFrameTimeRef.current = time + frameDuration;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      const dt = (time - previousTimeRef.current) / 1000;

      if (time >= nextFrameTimeRef.current) {
        console.log("animate", time);
        nextFrameTimeRef.current = time + frameDuration;

        // Exponential smoothing, https://lisyarus.github.io/blog/posts/exponential-smoothing.html
        // position += (target - position) * (1 - exp(-dt * speed))
        positionRef.current +=
          (targetRef.current - positionRef.current) *
          (1 - Math.exp(-dt * speed));

        if (Math.abs(renderPosition - positionRef.current) > threshold) {
          setRenderPosition(positionRef.current);
        }

        previousTimeRef.current = time;

        const isAtTarget =
          Math.abs(positionRef.current - targetRef.current) < threshold;

        if (isAtTarget) {
          positionRef.current = targetRef.current;
          setRenderPosition(targetRef.current);

          if (!requestRef.current) return;
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
          previousTimeRef.current = null;
          return;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    },
    [renderPosition, speed, frameDuration],
  );

  useEffect(() => {
    positionRef.current = initialValue;
    targetRef.current = targetValue ?? initialValue;
    setRenderPosition(initialValue);

    // Stop any running animation
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    previousTimeRef.current = null;

    // Restart animation
    requestRef.current = requestAnimationFrame(animate);
  }, [key, initialValue]);

  const setTarget = useCallback(
    (newTarget: number) => {
      if (targetRef.current === newTarget) return;
      targetRef.current = newTarget;

      if (!requestRef.current) {
        // If animation is not running, restart it
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [animate],
  );

  return {
    position: renderPosition,
    updateTarget: setTarget,
  };
}

export default useSmoothInterpolation;
