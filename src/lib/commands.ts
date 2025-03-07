import { Command } from "./terminal";

export const default_commands: Command[] = [
  {
    name: "help",
    description: "Display available commands",
    execute: (_args, terminal) => {
      terminal.writeLine("Available commands:");
      terminal.writeLine("");

      const sortedCommands = Array.from(terminal.commands.values()).sort(
        (left, right) => left.name.localeCompare(right.name),
      );

      const longestName = sortedCommands.reduce(
        (max, cmd) => Math.max(max, cmd.name.length),
        0,
      );

      for (const cmd of sortedCommands) {
        const padding = " ".repeat(longestName - cmd.name.length + 2);
        terminal.writeLine(`  ${cmd.name}${padding}${cmd.description}`);
      }

      terminal.writeLine("");
    },
  },
  {
    name: "clear",
    description: "Clear the terminal screen",
    execute: (_args, terminal) => {
      terminal.clear();
    },
  },
];
