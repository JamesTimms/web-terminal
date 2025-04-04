import { ReactNode, forwardRef, HTMLAttributes } from "react";

import "./monitor.styles.css";
import { cn } from "~/lib/utils";

interface MonitorOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  isPowered?: boolean;
  onPowerClick?: () => void;
}

export const ControlButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "monitor-button h-4 w-4 cursor-pointer rounded-full border-none bg-gray-400",
        className,
      )}
    />
  );
});

export const MonitorOverlay = forwardRef<HTMLDivElement, MonitorOverlayProps>(
  (
    {
      children,
      className,
      width = 1024,
      height = 768,
      isPowered = false,
      onPowerClick,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative mx-auto w-fit", className)}
        {...props}
      >
        <div className={`relative md:h-[${height}px] md:w-[${width}px]`}>
          <div className="monitor-screen-mask">{children}</div>
        </div>
        <div className="mt-[53px] mr-[53px] grid grid-cols-12 items-center">
          <div className="col-start-12 flex flex-col items-center justify-start gap-2.5">
            <div
              className={cn(
                "h-4 w-6 rounded-[20%] transition-all duration-300",
                isPowered ? "monitor-power-led-on" : "monitor-power-led-off",
              )}
            />
            <button onClick={onPowerClick} className="monitor-power-button" />
          </div>
        </div>
      </div>
    );
  },
);
MonitorOverlay.displayName = "Monitor";

export default MonitorOverlay;
