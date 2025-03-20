import { Command, CommandOption, TerminalService } from "./terminal";

export interface ResponsiveOptions {
  isMobile: boolean;
}

export interface AboutInfo {
  paragraphs: string[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

export interface Certification {
  name: string;
  year: string;
}

export interface Achievement {
  title: string;
  description: string;
  icon?: string;
}

export const default_commands = (options: ResponsiveOptions): Command[] => [
  {
    name: "help",
    description: "Display available commands",
    execute: (_args, terminal) => {
      terminal.writeLine("Available commands:");
      terminal.writeLine("");

      const sortedCommands = Array.from(terminal.commands.values()).sort(
        (left, right) => left.name.localeCompare(right.name),
      );

      if (options.isMobile) {
        for (const command of sortedCommands) {
          terminal.writeLine(`\x1b[1;33m${command.name}\x1b[0m`);
          terminal.writeLine(`  ${command.description}`);
          if (command.aliases) {
            terminal.writeLine(`  aliases: ${command.aliases.join(", ")}`);
          }
          terminal.writeLine("");
        }
        terminal.writeLine("");
        return;
      }

      const longestNameWithAliases = sortedCommands.reduce((max, command) => {
        const aliasesStr = command.aliases
          ? `, ${command.aliases.join(", ")}`
          : "";
        return Math.max(max, command.name.length + aliasesStr.length);
      }, 0);

      for (const command of sortedCommands) {
        const aliasesStr = command.aliases
          ? `, ${command.aliases.join(", ")}`
          : "";
        const commandWithAliases = `${command.name}${aliasesStr}`;

        const padding = " ".repeat(
          longestNameWithAliases - commandWithAliases.length + 4,
        );
        terminal.writeLine(
          `  ${commandWithAliases}${padding}${command.description}`,
        );
      }
      terminal.writeLine("");
    },
  },
  {
    name: "clear",
    description: "Clear the terminal screen",
    aliases: ["cls"],
    execute: (_args, terminal) => {
      terminal.clear();
    },
  },
  {
    name: "about",
    description: "Learn more about James",
    execute: (_args, terminal) => {
      terminal.writeLine(
        "I'm a founder, hacker, gamer, occasional apple tree climber, and newly minted dog dad. I love solving problems and drinking bubble tea🧋",
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

export const buildAboutCommand = (aboutInfo: AboutInfo): Command => {
  const command: Command = {
    name: "about",
    description: "Learn more about James",
    execute: (_args, terminal) => {
      for (const paragraph of aboutInfo.paragraphs) {
        terminal.writeLine(paragraph);
        terminal.writeLine("");
      }
    },
  };

  return withHelpOption(command);
};

export const buildCertificationsCommand = (
  certifications: Certification[],
  options: ResponsiveOptions,
): Command => {
  const command: Command = {
    name: "certifications",
    description: "Display my professional certifications",
    aliases: ["certs"],
    execute: (_args, terminal) => {
      terminal.writeLine("\x1b[1;36m🏆 CERTIFICATIONS\x1b[0m");

      const separator = options.isMobile
        ? "\x1b[90m─────────────────────\x1b[0m"
        : "\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m";

      terminal.writeLine(separator);
      terminal.writeLine("");

      for (const cert of certifications) {
        terminal.writeLine(`\x1b[1;33m${cert.name}\x1b[0m`);
        terminal.writeLine(`\x1b[90m${cert.year}\x1b[0m`);
        terminal.writeLine("");
      }
    },
  };

  return withHelpOption(command);
};

export const buildWorkExperienceCommand = (
  experiences: WorkExperience[],
  options: ResponsiveOptions,
): Command => {
  const command: Command = {
    name: "experience",
    description: "Display my work experience",
    aliases: ["exp"],
    options: [
      {
        name: "--summary",
        alias: "-s",
        description: "Show only a summary of each position",
      },
      {
        name: "--company",
        alias: "-c",
        description: "Filter by company name",
      },
      {
        name: "--year",
        alias: "-y",
        description: "Filter experience by year",
      },
    ],
    examples: [
      "experience",
      "experience --summary",
      "experience --company=Mappa",
      "experience --year=2023",
    ],
    execute: (args, terminal) => {
      const showSummary = args.includes("--summary") || args.includes("-s");

      const companyArg = args.find(
        (arg) => arg.startsWith("--company=") || arg.startsWith("-c="),
      );
      const companyFilter = companyArg
        ? companyArg.split("=")[1].toLowerCase()
        : null;

      const yearArg = args.find(
        (arg) => arg.startsWith("--year=") || arg.startsWith("-y="),
      );
      const yearFilter = yearArg ? yearArg.split("=")[1] : null;

      let filteredExperiences = [...experiences];

      if (companyFilter) {
        filteredExperiences = filteredExperiences.filter((exp) =>
          exp.company.toLowerCase().includes(companyFilter),
        );
      }

      if (yearFilter) {
        filteredExperiences = filteredExperiences.filter((exp) =>
          exp.period.includes(yearFilter),
        );
      }

      terminal.writeLine("\x1b[1;36m🚀 WORK EXPERIENCE\x1b[0m");

      const separator = options.isMobile
        ? "\x1b[90m─────────────────────\x1b[0m"
        : "\x1b[90m─────────────────────────────────────\x1b[0m";

      terminal.writeLine(separator);
      terminal.writeLine("");

      if (filteredExperiences.length === 0) {
        terminal.writeLine("\x1b[1;31mNo matching experiences found.\x1b[0m");
        terminal.writeLine("");
        return;
      }

      for (const exp of filteredExperiences) {
        if (showSummary) {
          terminal.writeLine(
            `\x1b[1;33m${exp.company}\x1b[0m \x1b[1m${exp.role}\x1b[0m \x1b[37m${exp.period}\x1b[0m`,
          );
          continue;
        }

        if (options.isMobile) {
          terminal.writeLine(`\x1b[1;33m${exp.company}\x1b[0m`);
          terminal.writeLine(`\x1b[1m${exp.role}\x1b[0m`);
          terminal.writeLine(`\x1b[37m${exp.period}\x1b[0m`);
          terminal.writeLine(`\x1b[37m${exp.location}\x1b[0m`);
        } else {
          terminal.writeLine(
            `\x1b[1;33m${exp.company}\x1b[0m - \x1b[1m${exp.role}\x1b[0m`,
          );
          terminal.writeLine(`\x1b[37m${exp.period} | ${exp.location}\x1b[0m`);
        }

        terminal.writeLine("");

        for (const line of exp.description) {
          terminal.writeLine(`• ${line}`);
        }
        terminal.writeLine("");

        terminal.writeLine(separator);
        terminal.writeLine("");
      }
    },
  };
  return withHelpOption(command);
};

export const buildSkillCommand = (
  skills: (Skill | "break")[],
  options: ResponsiveOptions,
): Command => {
  const command: Command = {
    name: "skills",
    description: "Display my skills with visual ratings",
    options: [
      {
        name: "--category",
        alias: "-c",
        description: "Filter skills by category name",
      },
      {
        name: "--sort",
        alias: "-s",
        description: "Sort skills by level or name (e.g. --sort=level)",
      },
    ],
    examples: ["skills", "skills --category=python", "skills --sort=level"],
    execute: (_args, terminal) => {
      const levels = [
        { name: "Beginner", symbol: "⭐" },
        { name: "Elementary", symbol: "⭐ ⭐" },
        { name: "Intermediate", symbol: "⭐ ⭐ ⭐" },
        { name: "Advanced", symbol: "⭐ ⭐ ⭐ ⭐" },
        { name: "Expert", symbol: "⭐ ⭐ ⭐ ⭐ ⭐" },
      ];

      if (options.isMobile) {
        terminal.writeLine("\x1b[1;36m💡 SKILLS\x1b[0m");
        terminal.writeLine("\x1b[90m─────────────────────\x1b[0m");
        terminal.writeLine("");

        for (const skill of skills) {
          if (skill === "break") {
            terminal.writeLine("");
            continue;
          }

          terminal.writeLine(`\x1b[1m${skill.name}\x1b[0m`);
          terminal.writeLine(`${levels[skill.level].symbol}`);
          terminal.writeLine("");
        }
        return;
      }

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

  return withHelpOption(command);
};

export const buildAchievementsCommand = (
  achievements: Achievement[],
  options: ResponsiveOptions,
): Command => {
  const command: Command = {
    name: "achievements",
    description: "Display my achievements and hobbies",
    aliases: ["ach"],
    execute: (_args, terminal) => {
      terminal.writeLine("\x1b[1;35m🌟 ACHIEVEMENTS & HOBBIES\x1b[0m");

      const separator = options.isMobile
        ? "\x1b[90m─────────────────────\x1b[0m"
        : "\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m";

      terminal.writeLine(separator);
      terminal.writeLine("");

      for (const achievement of achievements) {
        terminal.writeLine(
          `\x1b[1;33m${achievement.icon || "✨"} ${achievement.title}\x1b[0m`,
        );
        terminal.writeLine(`${achievement.description}`);
        terminal.writeLine("");
      }
    },
  };

  return withHelpOption(command);
};

export const createShutdownCommand = (onShutdown: () => void): Command => {
  const command: Command = {
    name: "shutdown",
    description: "Shutdown the terminal",
    aliases: ["exit"],
    execute: (_args, terminal) => {
      terminal.writeLine("Shutting down...");

      if (!onShutdown) return;
      setTimeout(onShutdown, 300);
    },
  };

  return withHelpOption(command);
};

export function printCommandHelp(
  command: Command,
  terminal: TerminalService,
): void {
  terminal.writeLine(
    `\x1b[1;36m${command.name}\x1b[0m - ${command.description}`,
  );

  if (command.aliases) {
    terminal.writeLine(`\x1b[90mAliases: ${command.aliases.join(", ")}\x1b[0m`);
  }

  terminal.writeLine("");

  let usage = `\x1b[1;33mUsage:\x1b[0m ${command.name}`;

  if (command.options) {
    usage += " [options]";
  }

  if (command.arguments) {
    command.arguments.forEach((arg) => {
      if (arg.optional) {
        usage += ` [${arg.name}]`;
      } else {
        usage += ` <${arg.name}>`;
      }
    });
  }

  terminal.writeLine(usage);
  terminal.writeLine("");

  if (command.options) {
    terminal.writeLine(`\x1b[1;33mOptions:\x1b[0m`);

    const longestOption = command.options.reduce((max, opt) => {
      const optLength = opt.alias
        ? opt.name.length + opt.alias.length + 2
        : opt.name.length;
      return Math.max(max, optLength);
    }, 0);

    command.options.forEach((opt) => {
      let optText = opt.name;
      if (opt.alias) {
        optText += `, ${opt.alias}`;
      }

      const padding = " ".repeat(longestOption - optText.length + 4);
      terminal.writeLine(`  ${optText}${padding}${opt.description}`);
    });

    terminal.writeLine("");
  }

  if (command.arguments) {
    terminal.writeLine(`\x1b[1;33mArguments:\x1b[0m`);

    const longestArg = command.arguments.reduce((max, arg) => {
      return Math.max(max, arg.name.length);
    }, 0);

    command.arguments.forEach((arg) => {
      const padding = " ".repeat(longestArg - arg.name.length + 4);
      let argText = arg.name;
      if (arg.optional) {
        argText = `[${arg.name}]`;
      }
      terminal.writeLine(`  ${argText}${padding}${arg.description}`);
    });

    terminal.writeLine("");
  }

  if (command.examples) {
    terminal.writeLine(`\x1b[1;33mExamples:\x1b[0m`);
    command.examples.forEach((example) => {
      terminal.writeLine(`  ${example}`);
    });
    terminal.writeLine("");
  }
}

export function withHelpOption(command: Command): Command {
  const originalCommand = command.execute;

  const commandWithHelp = (args: string[], terminal: TerminalService) => {
    if (args.includes("--help") || args.includes("-h")) {
      printCommandHelp(command as Command, terminal);
      return;
    }

    originalCommand(args, terminal);
  };

  const helpOption: CommandOption = {
    name: "--help",
    alias: "-h",
    description: "Display help information for this command",
  };

  const commandOptions: CommandOption[] = [
    helpOption,
    ...((command.options as CommandOption[]) || []),
  ];

  return {
    ...command,
    options: commandOptions,
    execute: commandWithHelp,
  };
}
