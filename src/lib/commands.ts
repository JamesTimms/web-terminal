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

export interface Skill {
  name: string;
  level: number;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Certification {
  name: string;
  year: string;
}

export const buildCertificationsCommand = (
  certifications: Certification[],
): Command => {
  return {
    name: "certifications",
    description: "Display my professional certifications",
    execute: (_args, terminal) => {
      terminal.writeLine("\x1b[1;36m🏆 CERTIFICATIONS\x1b[0m");
      terminal.writeLine(
        "\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m",
      );
      terminal.writeLine("");

      for (const cert of certifications) {
        terminal.writeLine(`\x1b[1;33m${cert.name}\x1b[0m`);
        terminal.writeLine(`\x1b[90m${cert.year}\x1b[0m`);
        terminal.writeLine("");
      }
    },
  };
};

export const buildWorkExperienceCommand = (
  experiences: WorkExperience[],
): Command => {
  return {
    name: "experience",
    description: "Display my work experience",
    execute: (_args, terminal) => {
      terminal.writeLine("\x1b[1;36m🚀 WORK EXPERIENCE\x1b[0m");
      terminal.writeLine(
        "\x1b[90m─────────────────────────────────────\x1b[0m",
      );
      terminal.writeLine("");

      for (const exp of experiences) {
        terminal.writeLine(
          `\x1b[1;33m${exp.company}\x1b[0m - \x1b[1m${exp.role}\x1b[0m`,
        );
        terminal.writeLine(`\x1b[90m${exp.period}\x1b[0m`);
        terminal.writeLine("");

        for (const line of exp.description) {
          terminal.writeLine(`• ${line}`);
        }

        terminal.writeLine("");
        terminal.writeLine(
          "\x1b[90m─────────────────────────────────────\x1b[0m",
        );
        terminal.writeLine("");
      }
    },
  };
};

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
