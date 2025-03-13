import { forwardRef } from "react";
import { cn } from "~/lib/utils";

export type ChromaticStrength = "subtle" | "normal" | "strong" | "extreme";
export type BloomType = "default" | "green" | "amber" | "blue-white" | "subtle";
export type GlowColor = "green" | "amber" | "blue-white" | "white";
export type PhosphorType =
  | "gradient"
  | "sepia-tone"
  | "green-phosphor"
  | "amber-tone"
  | "blue-green-phosphor"
  | "white-phosphor";

export interface CrtScreenProps {
  children: React.ReactNode;
  className?: string;
  chromaticStrength?: ChromaticStrength;
  bloomType?: BloomType;
  rgbPixelOpacity?: number;
  glowColor?: GlowColor;
  glowOpacity?: number;
  vignetteIntensity?: number;
  scanlineOpacity?: number;
  scanlineSize?: number;
  curvatureIntensity?: number;
  phosphorType?: PhosphorType;
  flickerOpacity?: number;
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

const GlowEffect = ({
  color = "blue-white",
  opacity = 0.7,
}: {
  color?: GlowColor;
  opacity?: number;
}) => {
  const glowColors = {
    green: "10, 255, 10",
    amber: "255, 176, 0",
    "blue-white": "180, 210, 255",
    white: "220, 220, 255",
  };

  const rgb = glowColors[color];

  const glowStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
    zIndex: 9,
    boxShadow: `0 0 10px rgba(${rgb}, 0.4), inset 0 0 15px rgba(${rgb}, 0.4)`,
    borderRadius: "var(--screen-radius)",
    opacity: opacity,
    mixBlendMode: "screen" as const,
  };

  return <div aria-hidden="true" style={glowStyles} />;
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

const TextBloomFilter = ({ type = "default" }: { type?: BloomType }) => {
  // Define the filter parameters for each bloom type
  const bloomParams = {
    default: {
      stdDeviation: 0.8,
      matrix: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 12 -7",
    },
    green: {
      stdDeviation: 0.8,
      matrix: "0 0 0 0 0 0 1 0 0 0.05 0 0 0 0 0 0 0 0 12 -7",
    },
    amber: {
      stdDeviation: 0.8,
      matrix: "1 0 0 0 0.05 0 0.6 0 0 0.02 0 0 0 0 0 0 0 0 12 -7",
    },
    "blue-white": {
      stdDeviation: 0.8,
      matrix: "0.8 0 0 0 0 0 0.9 0 0 0 0 0 1 0 0.05 0 0 0 8 -7",
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

const RgbPixelEffect = ({ opacity = 0.2 }: { opacity?: number }) => {
  const rgbPixelStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.1), rgba(0, 0, 255, 0.1))",
    backgroundSize: "3px 1px",
    pointerEvents: "none" as const,
    opacity: opacity,
    mixBlendMode: "screen" as const,
    zIndex: 11,
  };

  return <div aria-hidden="true" style={rgbPixelStyles} />;
};

const VignetteEffect = ({ intensity = 0.8 }: { intensity?: number }) => {
  const vignetteStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
    zIndex: 10,
    boxShadow: `inset 0 0 ${100 * intensity}px rgba(0, 0, 0, ${intensity})`,
    borderRadius: "var(--screen-radius)",
  };

  return <div aria-hidden="true" style={vignetteStyles} />;
};

const ScanlineEffect = ({
  opacity = 0.15,
  size = 2,
}: {
  opacity?: number;
  size?: number;
}) => {
  const scanlineStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, ${opacity}),
      rgba(0, 0, 0, ${opacity}) 1px,
      transparent 1px,
      transparent ${size}px
    )`,
    pointerEvents: "none" as const,
    zIndex: 12,
  };

  return <div aria-hidden="true" style={scanlineStyles} />;
};

const CurvatureEffect = ({ intensity = 0.8 }: { intensity?: number }) => {
  const curvatureStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(
      circle at center,
      transparent ${80 + (1 - intensity) * 20}%,
      rgba(0, 0, 0, ${intensity}) 100%
    )`,
    pointerEvents: "none" as const,
    zIndex: 13,
    borderRadius: "var(--screen-radius)",
  };

  return <div aria-hidden="true" style={curvatureStyles} />;
};

const FlickerEffect = ({
  phosphorType,
  opacity = 1,
}: {
  phosphorType?: PhosphorType;
  opacity?: number;
}) => {
  // Define phosphor colors and gradients
  const phosphorStyles = {
    gradient: {
      background: `linear-gradient(
        135deg,
        rgba(0, 255, 50, 0.02) 0%,
        rgba(0, 200, 255, 0.01) 50%,
        rgba(255, 100, 200, 0.02) 100%
      )`,
    },
    "sepia-tone": {
      backgroundColor: "rgba(255, 240, 200, 0.04)",
    },
    "green-phosphor": {
      backgroundColor: "rgba(0, 255, 38, 0.04)",
    },
    "amber-tone": {
      backgroundColor: "rgba(255, 176, 0, 0.035)",
    },
    "blue-green-phosphor": {
      backgroundColor: "rgba(0, 235, 200, 0.03)",
    },
    "white-phosphor": {
      backgroundColor: "rgba(220, 230, 255, 0.025)",
    },
  };

  const flickerStyles = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
    zIndex: 14,
    mixBlendMode: "normal" as const,
    backgroundColor: "transparent",
    opacity: opacity,
    ...phosphorStyles[phosphorType || "white-phosphor"],
  };

  return (
    <div aria-hidden="true" className="crt-flicker" style={flickerStyles} />
  );
};

const CrtScreen = forwardRef<HTMLDivElement, CrtScreenProps>(
  (
    {
      children,
      className,
      chromaticStrength,
      bloomType,
      rgbPixelOpacity,
      glowColor,
      glowOpacity,
      vignetteIntensity,
      scanlineOpacity,
      scanlineSize,
      curvatureIntensity,
      phosphorType,
      flickerOpacity,
      ...props
    },
    ref,
  ) => {
    // Build the filter string based on enabled effects
    const getFilterString = () => {
      const filters = [];

      if (bloomType) {
        filters.push(`url(#text-bloom-${bloomType})`);
      }

      if (chromaticStrength) {
        filters.push(`url(#chromatic-aberration-${chromaticStrength})`);
      }

      return filters.join(" ");
    };

    return (
      <>
        {chromaticStrength && (
          <ChromaticAberrationFilter strength={chromaticStrength} />
        )}
        {bloomType && <TextBloomFilter type={bloomType} />}

        <div
          ref={ref}
          className={cn("terminal-wrapper", className)}
          style={{
            filter: getFilterString(),
            position: "relative",
          }}
          {...props}
        >
          {children}

          {vignetteIntensity && (
            <VignetteEffect intensity={vignetteIntensity} />
          )}
          {rgbPixelOpacity && <RgbPixelEffect opacity={rgbPixelOpacity} />}
          {glowColor && <GlowEffect color={glowColor} opacity={glowOpacity} />}
          {scanlineOpacity && (
            <ScanlineEffect opacity={scanlineOpacity} size={scanlineSize} />
          )}
          {curvatureIntensity && (
            <CurvatureEffect intensity={curvatureIntensity} />
          )}
          {(phosphorType || flickerOpacity) && (
            <FlickerEffect
              phosphorType={phosphorType}
              opacity={flickerOpacity}
            />
          )}
        </div>
      </>
    );
  },
);

CrtScreen.displayName = "CrtScreen";

export {
  CrtScreen,
  ChromaticAberrationFilter,
  TextBloomFilter,
  RgbPixelEffect,
  GlowEffect,
  VignetteEffect,
  ScanlineEffect,
  CurvatureEffect,
  FlickerEffect,
};
export default CrtScreen;
