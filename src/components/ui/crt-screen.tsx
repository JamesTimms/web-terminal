import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { cn } from "~/lib/utils";

export type ChromaticStrength = "subtle" | "normal" | "strong" | "extreme";
export type BloomType = "strong" | "subtle";

export interface CrtScreenProps {
  children: React.ReactNode;
  className?: string;
  chromaticStrength?: ChromaticStrength;
  bloomType?: BloomType;
  onPowerOff?: () => void;
}

export interface CrtScreenHandle {
  powerOff: () => void;
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
  strength = "normal",
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

const CrtScreen = forwardRef<CrtScreenHandle, CrtScreenProps>(
  (
    {
      children,
      className,
      chromaticStrength = "subtle",
      bloomType = "subtle",
      onPowerOff,
      ...props
    },
    ref,
  ) => {
    const [powerState, setPowerState] = useState<
      "off" | "on" | "turning-on" | "turning-off"
    >("off");

    useImperativeHandle(ref, () => ({
      powerOff: () => {
        setPowerState("turning-off");
        setTimeout(() => {
          setPowerState("off");
          if (onPowerOff) onPowerOff();
        }, 600); // Match animation duration
      },
    }));

    useEffect(() => {
      const timer = setTimeout(() => {
        setPowerState("turning-on");
        setTimeout(() => {
          setPowerState("on");
        }, 1500); // Match animation duration
      }, 300);

      return () => clearTimeout(timer);
    }, []);

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
          className={cn(
            "rounded-md bg-slate-950",
            "aspect-video h-full w-full",
          )}
          {...props}
        ></div>
      );
    }

    return (
      <>
        <ChromaticAberrationFilter strength={chromaticStrength} />
        <TextBloomFilter type={bloomType} />

        <div
          className={cn(
            "bg-slate-950",
            "h-full w-full sm:aspect-video",
            getAnimationClass(),
            className,
          )}
          style={{
            filter: getFilterString(),
            position: "relative",
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
      </>
    );
  },
);
CrtScreen.displayName = "CrtScreen";

export { CrtScreen, ChromaticAberrationFilter, TextBloomFilter };
export default CrtScreen;
