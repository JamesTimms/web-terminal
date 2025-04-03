import { useState, useRef, useCallback } from "react";

export type ZoomState = "zooming-in" | "zooming-out" | "zoomed" | "normal";

export interface ZoomAnimationOptions {
  duration?: number;
  startScale?: number;
  endScale?: number;
}

export interface UseZoomAnimationProps {
  options?: ZoomAnimationOptions;
}

export interface UseZoomAnimationReturn {
  zoomState: ZoomState;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

export function useZoomAnimation({
  options = {},
}: UseZoomAnimationProps = {}): UseZoomAnimationReturn {
  const { duration = 750, startScale = 1, endScale = 1.5 } = options;

  const [zoomState, setZoomState] = useState<ZoomState>("normal");

  const animationTimeoutRef = useRef<number | null>(null);

  const clearPendingAnimations = useCallback(() => {
    if (!animationTimeoutRef.current) return;
    window.clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = null;
  }, []);

  const handleZoomIn = useCallback(() => {
    clearPendingAnimations();

    setZoomState("zooming-in");

    animationTimeoutRef.current = window.setTimeout(() => {
      setZoomState("zoomed");
      animationTimeoutRef.current = null;
    }, duration);
  }, [clearPendingAnimations, duration, endScale]);

  const handleZoomOut = useCallback(() => {
    clearPendingAnimations();

    setZoomState("zooming-out");

    animationTimeoutRef.current = window.setTimeout(() => {
      setZoomState("normal");
      animationTimeoutRef.current = null;
    }, duration);
  }, [clearPendingAnimations, duration, startScale]);

  return {
    zoomState,
    handleZoomIn,
    handleZoomOut,
  };
}

export default useZoomAnimation;
