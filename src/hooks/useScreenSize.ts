import { useState, useEffect, useCallback } from "react";

export const breakpoints = {
  // TailwindCSS default breakpoints in pixels
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useScreenSizeAbove(
  breakpoint: number,
  debounce = 100,
): boolean {
  const [isAbove, setIsAbove] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const checkSize = useCallback(() => {
    if (typeof window === "undefined") return;
    const isAboveBreakpoint = window.innerWidth >= breakpoint;
    setIsAbove(isAboveBreakpoint);

    if (!initialized) setInitialized(true);
  }, [breakpoint, initialized]);

  useEffect(() => {
    checkSize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkSize, debounce);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [checkSize]);

  return isAbove;
}

export function useIsScreenAboveSm(): boolean {
  return useScreenSizeAbove(breakpoints.sm);
}
export function useIsScreenAboveMd(): boolean {
  return useScreenSizeAbove(breakpoints.md);
}
export function useIsScreenAboveLg(): boolean {
  return useScreenSizeAbove(breakpoints.lg);
}
export function useIsScreenAboveXl(): boolean {
  return useScreenSizeAbove(breakpoints.xl);
}
export function useIsScreenAbove2Xl(): boolean {
  return useScreenSizeAbove(breakpoints["2xl"]);
}
export function useBreakpoints() {
  const isSm = useIsScreenAboveSm();
  const isMd = useIsScreenAboveMd();
  const isLg = useIsScreenAboveLg();
  const isXl = useIsScreenAboveXl();
  const is2Xl = useIsScreenAbove2Xl();

  return { isSm, isMd, isLg, isXl, is2Xl };
}
export function useIsDesktop(): boolean {
  return useIsScreenAboveMd();
}

export function useBackgroundSize(
  options: {
    debounce?: number;
    aspectRatio?: number;
    minWidth?: number;
    minHeight?: number;
    scale?: number;
  } = {},
) {
  const {
    debounce = 100,
    aspectRatio = 16 / 9,
    minWidth = 960,
    minHeight = 540,
    scale = 1,
  } = options;

  const [backgroundSize, setBackgroundSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 2400,
    height: 1350,
  });

  const calculateSize = useCallback(() => {
    if (typeof window === "undefined") return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const screenRatio = screenWidth / screenHeight;

    let width, height;

    if (screenRatio >= aspectRatio) {
      // Screen is wider than our image aspect ratio
      // Size by width to ensure full coverage
      width = Math.max(screenWidth * scale, minWidth);
      height = width / aspectRatio;
    } else {
      // Screen is taller than our image aspect ratio
      // Size by height to ensure full coverage
      height = Math.max(screenHeight * scale, minHeight);
      width = height * aspectRatio;
    }

    // Round to nearest pixel
    setBackgroundSize({
      width: Math.round(width),
      height: Math.round(height),
    });
  }, []);

  useEffect(() => {
    calculateSize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateSize, debounce);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [calculateSize, debounce]);

  return backgroundSize;
}
