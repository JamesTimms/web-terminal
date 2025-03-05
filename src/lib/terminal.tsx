import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

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
      fontSize: options.fontSize ?? 16,
      fontFamily: options.fontFamily ?? "monospace",
      theme: {
        background: options.theme?.background ?? "#1a1b26",
        foreground: options.theme?.foreground ?? "#a9b1d6",
        cursor: options.theme?.cursor ?? "#c0caf5",
      },
      convertEol: true,
      scrollback: 1000,
      rows: 24,
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
      "\x1b[1;36mWelcome to TechyTimms Terminal v0.0.1\x1b[0m"
    );
    this.terminal.writeln(
      "\x1b[90m─────────────────────────────────────\x1b[0m"
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

interface TerminalProps {
  options?: TerminalOptions;
}

export function Terminal({ options }: TerminalProps) {
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
      ref={terminalRef}
      className="h-[600px] w-full p-4 rounded-lg overflow-hidden bg-[#1a1b26] border border-gray-700 shadow-lg relative"
    />
  );
}
