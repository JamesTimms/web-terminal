import { useEffect, useRef, forwardRef, HTMLAttributes } from "react";
import { ITerminalOptions, ITerminalInitOnlyOptions } from "@xterm/xterm";

import { cn } from "~/lib/utils";
import { Command, TerminalService } from "~/lib/terminal";
import { welcomeCommand } from "~/lib/commands";

export type TerminalOptions = ITerminalOptions & ITerminalInitOnlyOptions;

interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  options?: TerminalOptions;
  commands?: Command[];
  bootCommands?: string[];
  onShutdown?: () => void;
  screenScale?: {
    width: number;
    height: number;
  };
}

const DesktopBackground = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-full w-full bg-slate-800", className)}
      {...props}
    >
      {children}
    </div>
  );
});
DesktopBackground.displayName = "Background";

const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      options,
      commands,
      bootCommands = [welcomeCommand.name],
      onShutdown,
      className,
      screenScale = {
        width: 1,
        height: 1,
      },
      ...props
    },
    ref,
  ) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const serviceRef = useRef<TerminalService | null>(null);

    useEffect(() => {
      const mountTerminal = async () => {
        if (serviceRef.current || !terminalRef.current) return;

        if (terminalRef.current) {
          // HACK: Hide scrollbar and ensure full width
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

        const service = new TerminalService(
          options,
          commands,
          bootCommands,
          onShutdown,
        );
        serviceRef.current = service;

        await service.mount(terminalRef.current);
        service.fit();

        const handleResize = () => service.fit();
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          service.dispose();
          serviceRef.current = null;
        };
      };

      mountTerminal();
    }, [options, onShutdown]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-full w-full overflow-hidden p-6 pr-0 md:p-8 md:pr-2",
          // HACK: Terminal reserves 23px for scrollbar, as we're not using the
          // scrollbar, adjust padding to account for this.
          className,
        )}
        style={{
          backgroundColor: options?.theme?.background || "#1a1b26",
          transformOrigin: "top left",
          transform: `scale(${screenScale.width}, ${screenScale.height})`,
        }}
        onTouchMove={(event) => {
          event.preventDefault();
        }}
        {...props}
      >
        <div
          aria-label="Terminal input"
          onInput={(event) => {
            const target = event.target as HTMLTextAreaElement;
            const value = target.value;

            if (!value || !serviceRef.current) return;
            serviceRef.current.handleInput(value);
            target.value = "";
          }}
          onKeyDown={async (event) => {
            if (!serviceRef.current) return;
            if (event.key === "Enter") {
              await serviceRef.current.handleEnter();
              event.preventDefault();
            } else if (event.key === "Backspace") {
              serviceRef.current.handleBackspace();
              event.preventDefault();
            }
          }}
          onTouchMove={(event) => {
            event.preventDefault();
          }}
          ref={terminalRef}
          className="h-full w-full"
        />
      </div>
    );
  },
);
Terminal.displayName = "Terminal";

export { DesktopBackground, Terminal };
export default Terminal;
