import { useEffect, useRef, forwardRef, HTMLAttributes } from "react";

import { cn } from "~/lib/utils";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal as XTerm } from "@xterm/xterm";

interface TerminalOptions {
  theme?: {
    background?: string;
    foreground?: string;
    cursor?: string;
  };
  fontSize?: number;
  fontFamily?: string;
}

export class TerminalService {
  private terminal: XTerm;
  private fitAddon: FitAddon;
  private commandBuffer = "";
  private hasInitalised = false;

  constructor(options: TerminalOptions = {}) {
    this.terminal = new XTerm({
      cursorBlink: true,
      fontFamily: options.fontFamily || '"VT323", "Press Start 2P", monospace',
      fontSize: options.fontSize || 18,
      theme: {
        background: options.theme?.background || "#000000",
        foreground: options.theme?.foreground || "#00ff00",
        cursor: options.theme?.cursor || "#ff00ff",
        // Add more 80s-style colors
        brightGreen: "#00ff00",
        brightMagenta: "#ff00ff",
        brightCyan: "#00ffff",
        brightYellow: "#ffff00",
        brightBlue: "#0000ff",
        brightRed: "#ff0000",
      },
      allowTransparency: true,
    });

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
      "\x1b[38;5;213m╔════════════════════════════════════════════════════════╗",
    );
    this.terminal.writeln(
      "║                                                        ║",
    );
    this.terminal.writeln(
      "║  \x1b[38;5;51mTECHY TIMMS RETRO TERMINAL v1.0\x1b[38;5;213m                       ║",
    );
    this.terminal.writeln(
      "║  \x1b[38;5;226m© 1986 TECHY INDUSTRIES\x1b[38;5;213m                               ║",
    );
    this.terminal.writeln(
      "║                                                        ║",
    );
    this.terminal.writeln(
      "║  \x1b[38;5;118mType commands and press ENTER\x1b[38;5;213m                         ║",
    );
    this.terminal.writeln(
      "║                                                        ║",
    );
    this.terminal.writeln(
      "╚════════════════════════════════════════════════════════╝\x1b[0m",
    );
    this.terminal.writeln("");
    this.writePrompt();
  }

  public fit() {
    this.fitAddon.fit();
  }
}

interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  options?: TerminalOptions;
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
        ref={(node) => {
          // Handle both refs
          terminalRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "relative overflow-hidden border-4 border-[#ff00ff] bg-black p-4 shadow-[0_0_10px_#ff00ff,0_0_20px_#00ffff]",
          "before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]",
          "before:pointer-events-none before:z-10 before:opacity-40",
          "after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]",
          "after:pointer-events-none after:z-10 after:opacity-20",
          className,
        )}
        {...props}
      />
    );
  },
);

Terminal.displayName = "Terminal";
