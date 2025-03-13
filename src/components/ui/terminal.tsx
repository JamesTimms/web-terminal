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
        className={cn("relative overflow-hidden p-2 md:p-8", className)}
        style={{
          backgroundColor: options?.theme?.background || "#1a1b26",
        }}
        {...props}
      >
        <div ref={terminalRef} className="h-full w-full" />
        <textarea
          className="absolute inset-0 h-full w-full resize-none opacity-0 sm:hidden"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          autoComplete="off"
          aria-label="Terminal input"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            const value = target.value;

            if (!value || !serviceRef.current) return;
            serviceRef.current.handleMobileInput(value);
            target.value = "";
          }}
          onKeyDown={(e) => {
            if (!serviceRef.current) return;
            if (e.key === "Enter") {
              serviceRef.current.handleEnter();
              e.preventDefault();
            } else if (e.key === "Backspace") {
              serviceRef.current.handleBackspace();
              e.preventDefault();
            }
          }}
        />
      </div>
    );
  },
);

Terminal.displayName = "Terminal";
