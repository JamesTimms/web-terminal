import { useEffect, useRef, forwardRef, HTMLAttributes } from "react";

import { cn } from "~/lib/utils";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import {
  Terminal as XTerm,
  ITerminalOptions,
  ITerminalInitOnlyOptions,
} from "@xterm/xterm";

export class TerminalService {
  private terminal: XTerm;
  private fitAddon: FitAddon;
  private commandBuffer = "";
  private hasInitalised = false;

  constructor(options: ITerminalOptions & ITerminalInitOnlyOptions = {}) {
    this.terminal = new XTerm(options);

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    this.setupKeyHandlers();
  }

  private setupKeyHandlers() {
    this.terminal.onKey(({ key, domEvent }) => {
      const ev = domEvent as KeyboardEvent;

      switch (ev.key) {
        case "Enter":
          this.handleEnter();
          break;
        case "Backspace":
          this.handleBackspace();
          break;
        default:
          if (!ev.ctrlKey && !ev.altKey) {
            this.handleCharacter(key);
          }
      }
    });
  }

  private handleEnter() {
    this.terminal.write("\r\n");
    // Here we'll later add command processing
    this.commandBuffer = "";
    this.writePrompt();
  }

  private handleBackspace() {
    if (this.commandBuffer.length > 0) {
      this.commandBuffer = this.commandBuffer.slice(0, -1);
      this.terminal.write("\b \b");
    }
  }

  private handleCharacter(char: string) {
    this.commandBuffer += char;
    this.terminal.write(char);
  }

  private writePrompt() {
    this.terminal.write("$ ");
  }

  public mount(container: HTMLElement) {
    if (!this.terminal) return;

    this.terminal.open(container);
    this.fitAddon.fit();

    if (!this.hasInitalised) {
      this.writeWelcomeMessage();
      this.hasInitalised = true;
    }

    this.writePrompt();
  }

  public dispose() {
    this.terminal.dispose();
  }

  private writeWelcomeMessage() {
    this.terminal.writeln(
      "\x1b[1;36mWelcome to TechyTimms Terminal v0.0.1\x1b[0m",
    );
    this.terminal.writeln(
      "\x1b[90m─────────────────────────────────────\x1b[0m",
    );
    this.terminal.writeln("🚀  Interactive terminal environment ready!");
    this.terminal.writeln('📝  Type "help" for available commands');
    this.terminal.writeln("🔍  Try typing some commands to get started");
    this.terminal.write("\r\n");
  }

  public fit() {
    this.fitAddon.fit();
  }
}

interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  options?: ITerminalOptions & ITerminalInitOnlyOptions;
}

export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  ({ options, className, ...props }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const serviceRef = useRef<TerminalService | null>(null);

    useEffect(() => {
      if (serviceRef.current || !terminalRef.current) return;

      const service = new TerminalService(options);
      serviceRef.current = service;

      service.mount(terminalRef.current);
      service.fit();

      if (terminalRef.current) {
        // HACK: Hide scrollbar and add padding to the terminal
        const style = document.createElement("style");
        style.textContent = `
          .xterm .xterm-viewport::-webkit-scrollbar { 
            width: 0px !important;
            height: 0px !important;
          }
          .xterm .xterm-viewport {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .xterm-screen {
            padding: 12px !important;
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
          "overflow-hidden rounded-lg border-2 border-slate-500 shadow-lg",
          className,
        )}
        {...props}
      >
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    );
  },
);

Terminal.displayName = "Terminal";
