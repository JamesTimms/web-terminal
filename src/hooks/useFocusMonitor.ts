import { useState, useEffect, useCallback, useRef } from "react";
import {
  useSmoothInterpolation,
  type SmoothInterpolationOptions,
} from "~/hooks/useSmoothInterpolation";

export interface UseBackgroundSizeOptions {
  debounce?: number;
  baseWidth?: number;
  baseHeight?: number;
  minZoom?: number;
  maxZoom?: number;
  targetZoom?: number;
  smoothOptions?: Partial<Omit<SmoothInterpolationOptions, "initialValue">>;
}

export function useFocusMonitor(options: UseBackgroundSizeOptions = {}) {
  const {
    debounce = 100,
    baseWidth = 2400,
    baseHeight = 1350,
    minZoom = 1,
    maxZoom = 1.75,
    targetZoom = 1.75,
    smoothOptions = {
      speed: 3,
      fps: 60,
      threshold: 0.0005,
    },
  } = options;
  const prevInitialZoomRef = useRef<number>(1);
  const [initialZoom, setInitialZoom] = useState<number>(1);
  const [resetKey, setResetKey] = useState<number>(0);

  const calculateDelta = useCallback(() => {
    if (typeof window === "undefined") return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const widthRatio = screenWidth / baseWidth;
    const heightRatio = screenHeight / baseHeight;

    // Use the larger ratio to ensure full coverage
    const coverRatio = Math.max(widthRatio, heightRatio);

    const optimalZoom = Math.min(Math.max(coverRatio, minZoom), maxZoom);

    // Check if the zoom value has changed significantly (requiring a reset)
    if (Math.abs(prevInitialZoomRef.current - optimalZoom) > 0.01) {
      prevInitialZoomRef.current = optimalZoom;
      // Force reset of the interpolation hook
      setResetKey((prev) => prev + 1);
    }

    setInitialZoom(optimalZoom);
  }, [baseWidth, baseHeight, minZoom, maxZoom]);

  useEffect(() => {
    calculateDelta();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateDelta, debounce);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [calculateDelta, debounce]);

  const { position: currentZoom, updateTarget } = useSmoothInterpolation({
    initialValue: initialZoom,
    ...smoothOptions,
    key: resetKey,
  });

  // Convenience methods for power state changes
  const focusMonitor = useCallback(() => {
    updateTarget(targetZoom);
  }, [updateTarget, targetZoom]);

  const unfocusMonitor = useCallback(() => {
    updateTarget(initialZoom);
  }, [updateTarget, initialZoom]);

  // For compatibility with existing code
  const backgroundSize = { width: baseWidth, height: baseHeight };

  return {
    backgroundSize,
    initialZoom,
    currentZoom,
    focusMonitor,
    unfocusMonitor,
  };
}

export default useFocusMonitor;
