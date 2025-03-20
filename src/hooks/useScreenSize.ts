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
