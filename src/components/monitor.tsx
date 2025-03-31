import { ReactNode, forwardRef, HTMLAttributes } from "react";

import "./monitor.styles.css";
import { cn } from "~/lib/utils";

interface MonitorProps extends HTMLAttributes<HTMLDivElement> {
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

export const Monitor = forwardRef<HTMLDivElement, MonitorProps>(
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
        <div className="monitor-frame rounded-xl bg-gray-200 p-8">
          <div
            className={`relative aspect-[4/3] overflow-hidden rounded bg-black md:h-[${height}px] md:w-[${width}px]`}
          >
            {children}
          </div>
          <div className="mt-2.5 grid grid-cols-12 grid-rows-2 items-center px-2 py-0.5">
            <div className="font-helvetica col-start-0 text-center text-sm font-bold text-gray-700">
              Timmstech
            </div>
            <div className="col-span-2 col-start-6 row-span-2 flex justify-center gap-2">
              <ControlButton />
              <ControlButton />
              <ControlButton />
              <ControlButton />
            </div>
            <div className="font-helvetica col-span-4 col-start-11 text-center text-xs text-gray-700">
              TinkMaster 750s
            </div>
            <div className="col-span-2 col-start-11 flex items-center justify-start gap-2">
              <div
                className={cn(
                  "h-2 w-4 rounded-[20%] transition-all duration-300",
                  isPowered ? "monitor-power-led-on" : "monitor-power-led-off",
                )}
              />
              <button onClick={onPowerClick} className="monitor-power-button" />
            </div>
          </div>
        </div>
        <div className="monitor-stand mx-auto h-[60px] w-[300px] rounded-b-[50%] bg-gray-900"></div>
      </div>
    );
  },
);
Monitor.displayName = "Monitor";

export default Monitor;
