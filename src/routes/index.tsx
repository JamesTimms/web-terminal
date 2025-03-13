import { createFileRoute } from "@tanstack/react-router";

import { Terminal } from "~/components/ui/terminal";
import { CrtScreen } from "~/components/ui/crt-screen";
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
      <div className="container mx-auto max-w-[1024px] px-4 py-4">
        <div className="terminal-wrapper rounded-lg border-2 border-slate-500 shadow-lg">
          <CrtScreen>
            <Terminal
              className="rounded-lg border border-slate-600"
              options={{
                theme: {
                  background: "#1a1b26",
                  foreground: "#a9b1d6",
                  cursor: "#c0caf5",
                },
                fontSize: 14,
                cursorBlink: true,
                fontFamily: '"VT323", "Press Start 2P", monospace',
                lineHeight: 1.2,
                letterSpacing: 1.5,
                cols: 120,
                rows: 30,
              }}
              // style={{
              //   filter: "blur(0.25px) brightness(1.1)",
              //   textShadow: "0 0 1px currentColor",
              // }}
              commands={[
                ...default_commands,
                buildSkillCommand(skills),
                buildWorkExperienceCommand(workExperience),
                buildCertificationsCommand(certifications),
                buildAchievementsCommand(achievements),
              ]}
            />
          </CrtScreen>
        </div>
      </div>
    </div>
  ),
});
