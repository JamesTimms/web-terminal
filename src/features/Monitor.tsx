import { ReactNode, forwardRef, type CSSProperties } from "react";

import "./monitor.styles.css";
import { cn } from "~/lib/utils";

interface BaseMonitorProps {
  children?: ReactNode;
  className?: string;
}

interface PowerProps {
  isPowered?: boolean;
  onPowerClick?: () => void;
}

interface DeskProps extends BaseMonitorProps {
  currentZoom: number;
  offsetFrom: {
    left: number;
    top: number;
  };
  imageSize: {
    width: number;
    height: number;
  };
  originPercentage: {
    x: number;
    y: number;
  };
}

interface BoundingBoxProps {
  monitorBoundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  terminalBoundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export const PowerButton = forwardRef<
  HTMLButtonElement,
  PowerProps & { className?: string }
>(({ className, isPowered, onPowerClick }, ref) => {
  return (
    <div className={cn(className)}>
      <div className="flex flex-col items-center justify-start gap-[3px] md:gap-[9px]">
        <div
          className={cn(
            "h-[4px] w-[7px] rounded-[20%] transition-all duration-300 md:h-[10px] md:w-[18px]",
            isPowered ? "monitor-power-led-on" : "monitor-power-led-off",
          )}
        />
        <button
          onClick={onPowerClick}
          ref={ref}
          className={cn(
            "relative h-[16px] w-[17px] cursor-pointer rounded-[10%] md:h-[47px] md:w-[52px]",
            isPowered ? "bg-[rgba(42,42,42,0.25)]" : "bg-[rgba(42,42,42,0.15)]",
            isPowered
              ? "active:bg-[rgba(42,42,42,0.3)]"
              : "active:bg-[rgba(42,42,42,0.2)]",
          )}
        />
      </div>
    </div>
  );
});
PowerButton.displayName = "PowerButton";

export const MonitorInterface = forwardRef<
  HTMLDivElement,
  BaseMonitorProps & PowerProps & Pick<BoundingBoxProps, "monitorBoundingBox">
>(({ monitorBoundingBox, isPowered, onPowerClick }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("absolute")}
      style={{
        top: monitorBoundingBox.top,
        left: monitorBoundingBox.left,
        width: monitorBoundingBox.width,
        height: monitorBoundingBox.height,
        zIndex: 1,
      }}
    >
      <PowerButton
        className="absolute right-[37px] bottom-[8px] md:right-[105px] md:bottom-[23px]"
        isPowered={isPowered}
        onPowerClick={onPowerClick}
      />
    </div>
  );
});
MonitorInterface.displayName = "MonitorInterface";

export const Monitor = ({
  children,
  className,
  terminalBoundingBox,
  monitorBoundingBox,
  isPowered,
  onPowerClick,
}: BaseMonitorProps & PowerProps & BoundingBoxProps) => {
  return (
    <>
      <svg
        width="611.48199"
        height="453.16052"
        viewBox="0 0 611.48199 453.16052"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath
          id="screen-mask"
          clipPathUnits="objectBoundingBox"
          transform="scale(0.001635, 0.002207)"
        >
          <path d="M 7.14,31.258 C 12.372,19.672 15.724,18.145 28.802,15.861 95.173,6.265 192.467,1.419 308.673,0.491 c 80.857,-0.652 148.702,-2.315 269.43,8.66 14.566,2.834 22.307,7.112 24.109,18.665 10.966,56.268 13.133,320.008 1.43,396.222 -4.544,9.71 -13.712,15.961 -25.167,17.936 -100.013,9.523 -191.667,10.934 -281.882,11.185 -101.063,0.073 -253.469,-2.246 -264.41,-8.117 -11.783,-3.085 -18.179,-9.094 -21.385,-18.81 -12.391,-106.357 -14.799,-336.465 -3.66,-394.974 z" />
        </clipPath>
      </svg>
      <MonitorInterface
        monitorBoundingBox={monitorBoundingBox}
        isPowered={isPowered}
        onPowerClick={onPowerClick}
      />
      <div
        className={cn("absolute h-full w-full", className)}
        style={{
          top: terminalBoundingBox.top,
          left: terminalBoundingBox.left,
          width: terminalBoundingBox.width,
          height: terminalBoundingBox.height,
        }}
      >
        <div
          className={cn(
            "monitor-screen-mask relative z-50 h-full w-full overflow-hidden bg-black",
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};
Monitor.displayName = "Monitor";

export const PopupMonitor = forwardRef<
  HTMLDivElement,
  BaseMonitorProps & PowerProps & Pick<BoundingBoxProps, "monitorBoundingBox">
>(
  (
    { children, className, isPowered, onPowerClick, monitorBoundingBox },
    ref,
  ) => {
    return (
      <>
        <MonitorInterface
          monitorBoundingBox={monitorBoundingBox}
          isPowered={isPowered}
          onPowerClick={onPowerClick}
        />
        <div className={cn("relative rounded-xl p-4", className)} ref={ref}>
          <div
            className={cn(
              "relative z-50 h-full w-full overflow-hidden bg-black",
              "rounded-xl border border-slate-300",
              isPowered ? "rounded-xl" : "monitor-screen-mask",
            )}
          >
            {children}
          </div>
        </div>
      </>
    );
  },
);
PopupMonitor.displayName = "PopupMonitor";

// Desk component only needs positioning props
export const Desk = forwardRef<HTMLDivElement, DeskProps>(
  (
    {
      children,
      className,
      currentZoom,
      offsetFrom,
      imageSize,
      originPercentage,
    },
    ref,
  ) => {
    const style: CSSProperties = {
      transformOrigin: `${originPercentage.x}% ${originPercentage.y}%`,
      transform: `scale(${currentZoom})`,
      backgroundSize: `${imageSize.width}px ${imageSize.height}px`,
      backgroundPosition: `left ${offsetFrom.left}px top ${offsetFrom.top}px`,
      position: "fixed",
      inset: `0`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen min-w-screen bg-slate-700",
          "bg-[url(/desk-mobile.jpeg)] bg-fixed bg-no-repeat md:bg-[url(/desk.jpeg)]",
          className,
        )}
        style={style}
      >
        {children}
      </div>
    );
  },
);
Desk.displayName = "Desk";

export default Monitor;
