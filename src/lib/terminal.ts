import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import {
  Terminal as XTerm,
  ITerminalOptions,
  ITerminalInitOnlyOptions,
} from "@xterm/xterm";
import { WebLinksAddon } from "@xterm/addon-web-links";

export interface CommandOption {
  name: string; // e.g. "--summary"
  alias?: string; // e.g. "-s"
  description: string;
}

export interface CommandArgument {
  name: string; // e.g. "category"
  description: string;
  optional?: boolean;
}

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  options?: CommandOption[];
  arguments?: CommandArgument[];
  examples?: string[];
  hidden?: boolean;
  execute: (args: string[], terminal: TerminalService) => void;
}

export class TerminalService {
  private terminal: XTerm;
  private fitAddon: FitAddon;
  private commandBuffer = "";
  private cursorPosition = 0;
  private hasInitalised = false;
  public commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();
  private commandHistory: string[] = [];
  private historyIndex: number = -1;
  private currentInputBuffer: string = "";
  private bootCommands: string[] = [];

  constructor(
    options: ITerminalOptions & ITerminalInitOnlyOptions = {},
    commands: Command[] = [],
    bootCommands: string[] = ["welcome"],
  ) {
    this.terminal = new XTerm(options);

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(new WebLinksAddon());

    this.bootCommands = bootCommands;
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

    if (command.aliases && command.aliases.length > 0) {
      for (const alias of command.aliases) {
        this.aliases.set(alias, command.name);
      }
    }
  }

  public removeCommand(name: string) {
    const command = this.commands.get(name);

    if (command?.aliases) {
      for (const alias of command.aliases) {
        this.aliases.delete(alias);
      }
    }

    this.commands.delete(name);
  }

  private setupKeyHandlers() {
    this.terminal.onKey(({ key, domEvent }) => {
      const ev = domEvent as KeyboardEvent;

      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "End",
          " ",
        ].includes(ev.key)
      ) {
        ev.preventDefault();
      }

      const isModifer = ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey;
      if (isModifer) {
        // Prevent default to avoid double input
        ev.preventDefault();
      }

      switch (ev.key) {
        case "Enter":
          this.handleEnter();
          break;
        case "Backspace":
          this.handleBackspace();
          break;
        case "Delete":
          this.handleDelete();
          break;
        case "ArrowUp":
          this.handleArrowUp();
          break;
        case "ArrowDown":
          this.handleArrowDown();
          break;
        case "ArrowLeft":
          this.handleArrowLeft();
          break;
        case "ArrowRight":
          this.handleArrowRight();
          break;
        case "Home":
          this.handleHome();
          break;
        case "End":
          this.handleEnd();
          break;
        default:
          this.handleCharacter(key);
      }
    });
  }

  public handleEnter() {
    this.returnLine();

    if (this.commandBuffer.trim()) {
      this.commandHistory.push(this.commandBuffer);
      this.historyIndex = -1;
      this.currentInputBuffer = "";

      this.processCommand(this.commandBuffer);
    }

    this.commandBuffer = "";
    this.cursorPosition = 0;
    this.writePrompt();
  }

  public processCommand(input: string) {
    const parts = input.trim().split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const actualCommandName = this.aliases.get(commandName) || commandName;
    const command = this.commands.get(actualCommandName);

    if (!command) {
      this.writeLine(`Command not found: ${commandName}`);
      this.writeLine(`Type 'help' to see available commands`);
      return;
    }

    command.execute(args, this);
  }

  public handleBackspace() {
    if (this.cursorPosition <= 0) return;

    const beforeCursor = this.commandBuffer.substring(
      0,
      this.cursorPosition - 1,
    );
    const afterCursor = this.commandBuffer.substring(this.cursorPosition);
    this.commandBuffer = beforeCursor + afterCursor;

    this.terminal.write("\b");
    this.cursorPosition--;

    this.terminal.write(afterCursor + " ");

    this.terminal.write("\b".repeat(afterCursor.length + 1));
  }

  public handleDelete() {
    if (this.cursorPosition >= this.commandBuffer.length) return;

    const beforeCursor = this.commandBuffer.substring(0, this.cursorPosition);
    const afterCursor = this.commandBuffer.substring(this.cursorPosition + 1);
    this.commandBuffer = beforeCursor + afterCursor;

    this.terminal.write(afterCursor + " ");

    this.terminal.write("\b".repeat(afterCursor.length + 1));
  }

  private handleCharacter(char: string) {
    const beforeCursor = this.commandBuffer.substring(0, this.cursorPosition);
    const afterCursor = this.commandBuffer.substring(this.cursorPosition);
    this.commandBuffer = beforeCursor + char + afterCursor;

    this.terminal.write(char);
    this.cursorPosition++;

    if (afterCursor.length <= 0) return;

    this.terminal.write(afterCursor);
    this.terminal.write("\b".repeat(afterCursor.length));
  }

  private handleArrowLeft() {
    if (this.cursorPosition <= 0) return;

    this.cursorPosition--;
    this.terminal.write("\b");
  }

  private handleArrowRight() {
    if (this.cursorPosition >= this.commandBuffer.length) return;

    this.terminal.write(this.commandBuffer[this.cursorPosition]);
    this.cursorPosition++;
  }

  private handleHome() {
    this.terminal.write("\b".repeat(this.cursorPosition));
    this.cursorPosition = 0;
  }

  private handleEnd() {
    if (this.cursorPosition >= this.commandBuffer.length) return;

    const remainingText = this.commandBuffer.substring(this.cursorPosition);
    this.terminal.write(remainingText);
    this.cursorPosition = this.commandBuffer.length;
  }

  private handleArrowUp() {
    if (this.historyIndex === -1) {
      this.currentInputBuffer = this.commandBuffer;
    }

    if (this.historyIndex >= this.commandHistory.length - 1) return;

    this.historyIndex++;
    this.replaceCommandBuffer(
      this.commandHistory[this.commandHistory.length - 1 - this.historyIndex],
    );
  }

  private handleArrowDown() {
    if (this.historyIndex < 0) return;
    if (this.historyIndex === 0) {
      this.historyIndex = -1;
      this.replaceCommandBuffer(this.currentInputBuffer);
      return;
    }

    this.historyIndex--;
    this.replaceCommandBuffer(
      this.commandHistory[this.commandHistory.length - 1 - this.historyIndex],
    );
  }

  private replaceCommandBuffer(newCommand: string) {
    this.terminal.write("\b".repeat(this.cursorPosition));
    this.terminal.write(" ".repeat(this.commandBuffer.length));
    this.terminal.write("\b".repeat(this.commandBuffer.length));

    this.commandBuffer = newCommand;
    this.terminal.write(newCommand);
    this.cursorPosition = newCommand.length;
  }

  private writePrompt() {
    this.terminal.write("$ ");
  }

  public mount(container: HTMLElement) {
    if (!this.terminal) return;

    this.terminal.open(container);
    this.fitAddon.fit();

    container.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    });

    if (!this.hasInitalised) {
      this.runInitializationCommands();
      this.hasInitalised = true;
    }

    this.writePrompt();
  }

  private runInitializationCommands() {
    for (const commandName of this.bootCommands) {
      this.processCommand(commandName);
    }
  }

  public dispose() {
    this.terminal.dispose();
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

  public handleMobileInput(text: string) {
    for (const char of text) {
      this.commandBuffer += char;
      this.terminal.write(char);
    }
  }
}
