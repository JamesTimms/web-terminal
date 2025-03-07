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
  {
    name: "about",
    description: "Learn more about James",
    execute: (_args, terminal) => {
      terminal.writeLine(
        "James is a fun loving workaholic who enjoys solving problems and building stuff.",
      );
      terminal.writeLine("Found of RaavaVPN, Mappa, and software engineer!");
      terminal.writeLine(
        "Currently two years deep into a PropTech rabbit hole 🐇",
      );
      terminal.writeLine("");
      terminal.writeLine("Career Journey:");
      terminal.writeLine(
        "- Started making videogames at a small studio in Aberystwyth",
      );
      terminal.writeLine("- Co-founded the Devyard for indie game development");
      terminal.writeLine("- Created RaavaVPN, a VPN service provider");
      terminal.writeLine(
        "- Worked at EE and BT for five years on projects ranging from",
      );
      terminal.writeLine("  SIM card cryptography to datacenter automation");
      terminal.writeLine(
        "- Transitioned to smaller companies doing DevOps & SRE",
      );
      terminal.writeLine("- Founded PropTech startup Reebric");
      terminal.writeLine("- Participated in Y Combinator founder school");
      terminal.writeLine("- Currently working with Wayhome 🏡");
      terminal.writeLine("");
      terminal.writeLine("Based in and in love with Bristol.");
      terminal.writeLine("");
    },
  },
];
