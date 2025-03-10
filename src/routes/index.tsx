import { createFileRoute } from "@tanstack/react-router";

import { Terminal } from "~/components/ui/terminal";
import {
  achievements,
  certifications,
  skills,
  workExperience,
} from "~/data/james";
import {
  default_commands,
  buildSkillCommand,
  buildCertificationsCommand,
  buildWorkExperienceCommand,
  buildAchievementsCommand,
} from "~/lib/commands";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen min-w-screen bg-slate-700 py-12">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="terminal-wrapper">
          <Terminal
            options={{
              theme: {
                background: "#1a1b26",
                foreground: "#a9b1d6",
                cursor: "#c0caf5",
              },
              fontSize: 16,
              cursorBlink: true,
              fontFamily: '"VT323", "Press Start 2P", monospace',
              lineHeight: 1.25,
              letterSpacing: 1.65,
              cols: 140,
              rows: 34,
            }}
            commands={[
              ...default_commands,
              buildSkillCommand(skills),
              buildWorkExperienceCommand(workExperience),
              buildCertificationsCommand(certifications),
              buildAchievementsCommand(achievements),
            ]}
          />
          {/* <div
            className="overflow-hidden rounded-lg border-2 border-slate-500 p-8 shadow-lg"
            style={{
              backgroundColor: "#1a1b26",
            }}
          >
            <div className="h-[800px] w-full" />
          </div> */}
          <div className="crt-scanlines border-2 border-amber-300"></div>
          <div className="crt-curvature"></div>
        </div>
      </div>
    </div>
  ),
});
