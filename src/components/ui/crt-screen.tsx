import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
  HTMLAttributes,
} from "react";

import "./crt-screen.styles.css";
import { cn } from "~/lib/utils";

export type ChromaticStrength = "subtle" | "normal" | "strong" | "extreme";
export type BloomType = "strong" | "subtle";

export interface CrtScreenProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  chromaticStrength?: ChromaticStrength;
  bloomType?: BloomType;
  screenSize?: {
    width: number;
    height: number;
  };
  onPowerOff?: () => void;
}

export interface CrtScreenInterface {
  powerOff: () => void;
  powerOn: () => void;
}

const hideSvgFilter = {
  position: "absolute" as const,
  width: 0,
  height: 0,
  padding: 0,
  margin: 0,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap" as const,
  border: 0,
};

const ChromaticAberrationFilter = ({
  strength = "subtle",
}: {
  strength?: ChromaticStrength;
}) => {
  const offsets = {
    subtle: 1,
    normal: 2,
    strong: 3,
    extreme: 5,
  };
  const offset = offsets[strength];

  return (
    <svg aria-hidden="true" style={hideSvgFilter}>
      <defs>
        <filter id={`chromatic-aberration-${strength}`}>
          {/* Red Channel - Offset to the left */}
          <feOffset
            in="SourceGraphic"
            dx={-offset}
            dy="0"
            result="red-offset"
          />
          <feColorMatrix
            in="red-offset"
            type="matrix"
            values="1 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
            result="red-channel"
          />

          {/* Blue Channel - Offset to the right */}
          <feOffset
            in="SourceGraphic"
            dx={offset}
            dy="0"
            result="blue-offset"
          />
          <feColorMatrix
            in="blue-offset"
            type="matrix"
            values="0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 1 0 0 
                    0 0 0 1 0"
            result="blue-channel"
          />

          {/* Green Channel - No offset */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0 
                    0 1 0 0 0 
                    0 0 0 0 0 
                    0 0 0 1 0"
            result="green-channel"
          />

          {/* Blend the channels together */}
          <feBlend
            mode="screen"
            in="red-channel"
            in2="green-channel"
            result="red-green"
          />
          <feBlend
            mode="screen"
            in="red-green"
            in2="blue-channel"
            result="output"
          />
        </filter>
      </defs>
    </svg>
  );
};

const TextBloomFilter = ({ type = "subtle" }: { type?: BloomType }) => {
  // Define the filter parameters for each bloom type
  const bloomParams = {
    strong: {
      stdDeviation: 0.8,
      matrix: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 12 -7",
    },
    subtle: {
      stdDeviation: 0.5,
      matrix: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 8 -6",
    },
  };
  const params = bloomParams[type];

  return (
    <svg aria-hidden="true" style={hideSvgFilter}>
      <defs>
        <filter
          id={`text-bloom-${type}`}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          {/* Create a blurred version of the source */}
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={params.stdDeviation}
            result="blur"
          />

          {/* Apply color matrix to create the glow effect */}
          <feColorMatrix
            in="blur"
            type="matrix"
            values={params.matrix}
            result="glow"
          />

          {/* Blend the original source with the glow */}
          <feBlend in="SourceGraphic" in2="glow" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
};

const CrtScreen = forwardRef<CrtScreenInterface, CrtScreenProps>(
  (
    {
      children,
      className,
      chromaticStrength = "subtle",
      bloomType = "subtle",
      screenSize,
      onPowerOff,
      ...props
    },
    ref,
  ) => {
    const [powerState, setPowerState] = useState<
      "off" | "on" | "turning-on" | "turning-off"
    >("off");
    const timeoutRef = useRef<number | null>(null);

    // Clean up timeout when component unmounts
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Clear pending timeouts
    const clearPendingTimeouts = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    useImperativeHandle(ref, () => ({
      powerOff: () => {
        // Clear any pending timeouts first
        clearPendingTimeouts();

        // If we're turning on, we need to interrupt
        if (powerState === "turning-on") {
          setPowerState("turning-off");
        } else if (powerState === "on") {
          setPowerState("turning-off");
        } else {
          // Already turning off or off - do nothing
          return;
        }

        timeoutRef.current = window.setTimeout(() => {
          setPowerState("off");
          if (onPowerOff) onPowerOff();
          timeoutRef.current = null;
        }, 600); // Match animation duration
      },
      powerOn: () => {
        // Clear any pending timeouts first
        clearPendingTimeouts();

        // If we're turning off, we need to interrupt
        if (powerState === "turning-off") {
          setPowerState("turning-on");
        } else if (powerState === "off") {
          setPowerState("turning-on");
        } else {
          // Already turning on or off - do nothing
          return;
        }

        timeoutRef.current = window.setTimeout(() => {
          setPowerState("on");
          timeoutRef.current = null;
        }, 1500); // Match animation duration
      },
    }));

    const getFilterString = () => {
      const filters = [];

      filters.push(`url(#text-bloom-${bloomType})`);
      filters.push(`url(#chromatic-aberration-${chromaticStrength})`);

      return filters.join(" ");
    };

    const getAnimationClass = () => {
      switch (powerState) {
        case "turning-on":
          return "crt-turn-on";
        case "turning-off":
          return "crt-turn-off";
        default:
          return "";
      }
    };

    if (powerState === "off") {
      return (
        <div
          className={cn("relative h-full w-full bg-black", className)}
          {...props}
        >
          <div className="crt-curvature" />
        </div>
      );
    }

    const additionalStyle = screenSize
      ? {
          // Fit to space as full doesn't account for later scaling
          width: `${screenSize.width}px`,
          height: `${screenSize.height}px`,
        }
      : {};

    return (
      <>
        <ChromaticAberrationFilter strength={chromaticStrength} />
        <TextBloomFilter type={bloomType} />
        <div className={cn("relative h-full w-full")}>
          <div
            className={cn(
              "relative h-full w-full bg-slate-900",
              getAnimationClass(),
              className,
            )}
            style={{
              filter: getFilterString(),
              ...additionalStyle,
            }}
            {...props}
          >
            {children}
            <div className="crt-glow" />
            <div className="crt-rgb" />
            <div className="crt-vignette" />
            <div className="crt-scanlines" />
            <div className="crt-curvature" />
            <div className="crt-flicker" />
          </div>
        </div>
      </>
    );
  },
);
CrtScreen.displayName = "CrtScreen";

export { CrtScreen, ChromaticAberrationFilter, TextBloomFilter };
export default CrtScreen;
