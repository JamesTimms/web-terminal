import { useEffect, useRef, forwardRef, HTMLAttributes } from "react";
import { ITerminalOptions, ITerminalInitOnlyOptions } from "@xterm/xterm";

import { cn } from "~/lib/utils";
import { Command, TerminalService } from "~/lib/terminal";

interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  options?: ITerminalOptions & ITerminalInitOnlyOptions;
  commands?: Command[];
}

export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  ({ options, commands, className, ...props }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const serviceRef = useRef<TerminalService | null>(null);

    useEffect(() => {
      if (serviceRef.current || !terminalRef.current) return;

      const service = new TerminalService(options, commands);
      serviceRef.current = service;

      service.mount(terminalRef.current);
      service.fit();

      if (terminalRef.current) {
        const style = document.createElement("style");
        style.textContent = `
          .xterm-viewport::-webkit-scrollbar { 
            width: 0px !important;
            height: 0px !important;
          }
          .xterm-viewport {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `;
        terminalRef.current.appendChild(style);
      }

      const handleResize = () => service.fit();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        service.dispose();
        serviceRef.current = null;
      };
    }, [options]);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border-2 border-slate-500 p-3 shadow-lg",
          className,
        )}
        style={{
          backgroundColor: options?.theme?.background || "#1a1b26",
        }}
        {...props}
      >
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    );
  },
);

Terminal.displayName = "Terminal";
