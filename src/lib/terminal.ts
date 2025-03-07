import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import {
  Terminal as XTerm,
  ITerminalOptions,
  ITerminalInitOnlyOptions,
} from "@xterm/xterm";

export interface Command {
  name: string;
  description: string;
  execute: (args: string[], terminal: TerminalService) => void;
}

export class TerminalService {
  private terminal: XTerm;
  private fitAddon: FitAddon;
  private commandBuffer = "";
  private hasInitalised = false;
  public commands: Map<string, Command> = new Map();

  constructor(
    options: ITerminalOptions & ITerminalInitOnlyOptions = {},
    commands: Command[] = [],
  ) {
    this.terminal = new XTerm(options);

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    this.setupKeyHandlers();
    this.registerDefaultCommands(commands);
  }

  private registerDefaultCommands(commands: Command[]) {
    for (const command of commands) {
      this.registerCommand(command);
    }
  }

  public registerCommand(command: Command) {
    this.commands.set(command.name, command);
  }

  public removeCommand(name: string) {
    this.commands.delete(name);
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
    this.returnLine();

    if (this.commandBuffer.trim()) {
      this.processCommand(this.commandBuffer);
    }

    this.commandBuffer = "";
    this.writePrompt();
  }

  private processCommand(input: string) {
    const parts = input.trim().split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = this.commands.get(commandName);

    if (command) {
      command.execute(args, this);
    } else {
      this.writeLine(`Command not found: ${commandName}`);
      this.writeLine(`Type 'help' to see available commands`);
    }
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
    this.returnLine();
  }

  public writeLine(text: string = "") {
    this.terminal.writeln(text);
  }

  public returnLine() {
    this.terminal.write("\r\n");
  }

  public write(text: string) {
    this.terminal.write(text);
  }

  public clear() {
    this.terminal.clear();
  }

  public fit() {
    this.fitAddon.fit();
  }
}
