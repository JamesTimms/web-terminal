import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  useSmoothInterpolation,
  type SmoothInterpolationOptions,
} from "~/hooks/useSmoothInterpolation";
import { useIsDesktop } from "./useScreenSize";

export interface UseBackgroundSizeOptions {
  debounce?: number;
  imageSize?: { width: number; height: number };
  minZoom?: number;
  maxZoom?: number;
  targetZoom?: number;
  smoothOptions?: Partial<Omit<SmoothInterpolationOptions, "initialValue">>;
}

export function useCenterOnMonitor(options: {
  isDesktop: boolean;
  imageSize: { width: number; height: number };
}) {
  const { isDesktop, imageSize } = options;

  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [
    monitorBoundingBox,
    terminalBoundingBox,
    originPercentage,
    offsetFrom,
  ] = useMemo(() => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    let monitorBoundingBox = {
      top: 288,
      left: 245,
      width: 290,
      height: 250,
    };
    let terminalBoundingBox = {
      top: 312,
      left: 270,
      width: 240,
      height: 180,
    };
    let nudgeYCenter = 153;

    if (isDesktop) {
      nudgeYCenter = 140;
      monitorBoundingBox = {
        top: 164,
        left: 792,
        width: 840,
        height: 738,
      };
      terminalBoundingBox = {
        top: 234,
        left: 850,
        width: 720,
        height: 540,
      };
    }

    const screenCenterX = currentWidth / 2;
    const screenCenterY = currentHeight / 2 + nudgeYCenter;

    const boundingBoxCenterX =
      monitorBoundingBox.left + monitorBoundingBox.width / 2;
    const boundingBoxCenterY =
      monitorBoundingBox.top + monitorBoundingBox.height / 2;

    const imageCenterX = imageSize.width / 2;
    const imageCenterY = imageSize.height / 2;

    const offsetToMonitorCenterX = imageCenterX - boundingBoxCenterX;
    const offsetToMonitorCenterY = boundingBoxCenterY - imageCenterY;
    const pixelsFromLeftEdgeToCenter =
      screenCenterX - imageCenterX + offsetToMonitorCenterX;
    const pixelsFromTopEdgeToCenter =
      screenCenterY - imageCenterY + offsetToMonitorCenterY;

    const centerX = (boundingBoxCenterX / imageSize.width) * 100;
    const centerY =
      ((boundingBoxCenterY - nudgeYCenter) / imageSize.height) * 100;

    const boundingBoxCenterPercentage = {
      x: centerX,
      y: centerY,
    };

    const offsetFrom = {
      left: pixelsFromLeftEdgeToCenter,
      top: pixelsFromTopEdgeToCenter,
    };

    if (isDesktop) {
      monitorBoundingBox = {
        top: 164 + pixelsFromTopEdgeToCenter,
        left: 792 + pixelsFromLeftEdgeToCenter,
        width: 840,
        height: 738,
      };
      terminalBoundingBox = {
        top: 234 + pixelsFromTopEdgeToCenter,
        left: 850 + pixelsFromLeftEdgeToCenter,
        width: 720,
        height: 540,
      };
    } else {
      monitorBoundingBox = {
        top: 288 + pixelsFromTopEdgeToCenter,
        left: 245 + pixelsFromLeftEdgeToCenter,
        width: 290,
        height: 250,
      };
      terminalBoundingBox = {
        top: 312 + pixelsFromTopEdgeToCenter,
        left: 270 + pixelsFromLeftEdgeToCenter,
        width: 240,
        height: 180,
      };
    }

    return [
      monitorBoundingBox,
      terminalBoundingBox,
      boundingBoxCenterPercentage,
      offsetFrom,
    ];
  }, [isDesktop, imageSize.height, imageSize.width, forceUpdate]);

  return {
    monitorBoundingBox,
    terminalBoundingBox,
    originPercentage,
    offsetFrom,
  };
}

export function useFocusMonitor(options: UseBackgroundSizeOptions) {
  const {
    debounce = 100,
    imageSize = { width: 2400, height: 1350 },
    minZoom = 1,
    maxZoom = 1.75,
    smoothOptions = {
      speed: 3,
      fps: 60,
      threshold: 0.0005,
    },
  } = options;
  const prevInitialZoomRef = useRef<number>(1);
  const [initialZoom, setInitialZoom] = useState<number>(1);
  const [targetZoom, setTargetZoom] = useState<number>(1);
  const [resetKey, setResetKey] = useState<number>(0);

  const isDesktop = useIsDesktop();

  const {
    monitorBoundingBox,
    terminalBoundingBox,
    originPercentage,
    offsetFrom,
  } = useCenterOnMonitor({
    isDesktop,
    imageSize,
  });

  const calculateZoom = useCallback(() => {
    if (typeof window === "undefined") return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const screenAspect = screenWidth / screenHeight;
    const baseAspect = imageSize.width / imageSize.height;

    let widthRatio = screenWidth / imageSize.width;
    let heightRatio = screenHeight / imageSize.height;

    // If screen is portrait, use height ratio
    // If screen is landscape, use width ratio
    const coverRatio = screenAspect < baseAspect ? heightRatio : widthRatio;

    // Ensure the monitor fits within the viewport
    const optimalInitialZoom = Math.min(Math.max(coverRatio, minZoom), maxZoom);

    // Check if the zoom value has changed significantly (requiring a reset)
    if (Math.abs(prevInitialZoomRef.current - optimalInitialZoom) > 0.01) {
      prevInitialZoomRef.current = optimalInitialZoom;
      setResetKey((prev) => prev + 1);
    }

    setInitialZoom(optimalInitialZoom);
    setTargetZoom(optimalInitialZoom + 0.35);
  }, [imageSize.width, imageSize.height, minZoom, maxZoom]);

  useEffect(() => {
    calculateZoom();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateZoom, debounce);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [calculateZoom, debounce]);

  const { position: currentZoom, updateTarget } = useSmoothInterpolation({
    initialValue: initialZoom,
    ...smoothOptions,
    key: resetKey,
  });

  const focusMonitor = useCallback(() => {
    updateTarget(targetZoom);
  }, [updateTarget, targetZoom]);

  const unfocusMonitor = useCallback(() => {
    updateTarget(initialZoom);
  }, [updateTarget, initialZoom]);

  return {
    initialZoom,
    currentZoom,
    focusMonitor,
    unfocusMonitor,
    originPercentage,
    offsetFrom,
    monitorBoundingBox,
    terminalBoundingBox,
  };
}

export default useFocusMonitor;
