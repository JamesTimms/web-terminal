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
        "I'm a hacker, gamer, occasional apple tree climber, and newly minted dog dad. I love solving problems and drinking bubble tea🧋",
      );
      terminal.writeLine("");
      terminal.writeLine(
        "Founder of RaavaVPN, Mappa and other startups. Loyal to a fault. Strong ally. Environmental Vegan.",
      );
      terminal.writeLine("");
      terminal.writeLine(
        "Started life making video games, continued as a sys admin, moved into DevOps, and now a full-stack engineer. Startup founder at heart and hacker for life!",
      );
      terminal.writeLine("");
    },
  },
];

interface Skill {
  name: string;
  level: number;
}

export const buildSkillCommand = (skills: (Skill | "break")[]): Command => {
  return {
    name: "skills",
    description: "Display my skills with visual ratings",
    execute: (_args, terminal) => {
      const levels = [
        { name: "Beginner", symbol: "⭐" },
        { name: "Elementary", symbol: "⭐ ⭐" },
        { name: "Intermediate", symbol: "⭐ ⭐ ⭐" },
        { name: "Advanced", symbol: "⭐ ⭐ ⭐ ⭐" },
        { name: "Expert", symbol: "⭐ ⭐ ⭐ ⭐ ⭐" },
      ];

      const longestName = skills.reduce(
        (max, skill) =>
          skill === "break" ? max : Math.max(max, skill.name.length),
        0,
      );
      const totalWidth = longestName + 26;
      const border = "*".repeat(totalWidth);
      const sideBorder = "|";
      const emptyLine = `${sideBorder}${" ".repeat(totalWidth - 2)}${sideBorder}`;

      terminal.writeLine(border);
      terminal.writeLine(
        `${sideBorder}${" ".repeat(Math.floor((totalWidth - 12) / 2))}MY SKILLS${" ".repeat(Math.ceil((totalWidth - 12) / 2) + 1)}${sideBorder}`,
      );
      terminal.writeLine(border);
      terminal.writeLine(emptyLine);

      for (const skill of skills) {
        if (skill === "break") {
          terminal.writeLine(emptyLine);
          continue;
        }

        const leftSpace = " ".repeat(3);
        const padding = " ".repeat(longestName - skill.name.length + 5);
        const levelSymbol = levels[skill.level].symbol;
        const rightSpace = Math.max(
          0,
          totalWidth - longestName - levelSymbol.length - 11,
        );

        terminal.writeLine(
          `${sideBorder}${leftSpace}${skill.name}${padding}${levelSymbol} ${" ".repeat(rightSpace)}${sideBorder}`,
        );
      }

      terminal.writeLine(emptyLine);
      terminal.writeLine(border);
      terminal.writeLine("");
    },
  };
};
