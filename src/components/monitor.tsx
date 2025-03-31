import { ReactNode, forwardRef, HTMLAttributes } from "react";

import "./monitor.styles.css";
import { cn } from "~/lib/utils";

interface MonitorProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export const Monitor = forwardRef<HTMLDivElement, MonitorProps>(
  ({ children, className, width = 1024, height = 768, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative mx-auto w-fit", className)}
        {...props}
      >
        <div className="monitor-frame rounded-100 bg-gray-200">
          <div
            className={`relative aspect-[4/3] overflow-hidden rounded bg-black md:h-[${height}px] md:w-[${width}px]`}
          >
            {children}
          </div>
          <div className="mt-2.5 flex items-center justify-between px-5 py-2.5">
            <div className="font-helvetica text-sm font-bold text-gray-700">
              Timmstech
            </div>
            <div className="flex gap-2">
              <button className="monitor-button bg-gray-400"></button>
              <button className="monitor-button bg-gray-400"></button>
              <button className="monitor-button bg-gray-400"></button>
              <button className="monitor-button bg-gray-400"></button>
            </div>
            <div className="font-helvetica text-xs text-gray-700">
              TinkMaster 750s
            </div>
          </div>
        </div>
        <div className="monitor-stand bg-gray-900"></div>
      </div>
    );
  },
);
Monitor.displayName = "Monitor";

export default Monitor;
