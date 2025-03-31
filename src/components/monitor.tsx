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
            <div className="col-span-2 col-start-11 flex justify-start pl-8">
              <div
                className={cn(
                  "monitor-power-led absolute -top-2 -right-1 h-1.5 w-1.5 rounded-full transition-all",
                  isPowered ? "bg-green-500" : "bg-neutral-600",
                )}
              />
              <button
                onClick={onPowerClick}
                className="monitor-power-button relative h-6 w-6 cursor-pointer rounded border-none bg-neutral-800 transition-colors hover:bg-neutral-700 active:bg-neutral-900"
              ></button>
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
