import { createFileRoute } from "@tanstack/react-router";

import { Terminal } from "~/components/ui/terminal";
import { CrtFilters } from "~/components/CrtFilters";
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
        <div className="terminal-wrapper chromatic-filter-subtle">
          <CrtFilters />
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
            className="overflow-hidden rounded-lg border-2 p-8 shadow-lg"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                rgba(255,0,0,1.0),
                rgba(255,0,0,1.0) 20px,
                rgba(0,255,0,1.0) 20px,
                rgba(0,255,0,1.0) 40px,
                rgba(0,0,255,1.0) 40px,
                rgba(0,0,255,1.0) 60px
              )`,
            }}
          >
            <div className="h-[800px] w-full" />
          </div> */}
          <div className="crt-glow blue-white"></div>
          <div className="crt-rgb"></div>
          <div className="crt-scanlines"></div>
          <div className="crt-curvature"></div>
          <div className="crt-flicker white-phosphor"></div>
        </div>
      </div>
    </div>
  ),
});
