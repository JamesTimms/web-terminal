import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Terminal, DesktopBackground } from "~/components/ui/terminal";
import { CrtScreen, CrtScreenHandle } from "~/components/ui/crt-screen";
import {
  skills,
  achievements,
  certifications,
  workExperience,
} from "~/data/james";
import {
  default_commands,
  buildSkillCommand,
  buildAchievementsCommand,
  buildCertificationsCommand,
  buildWorkExperienceCommand,
  createShutdownCommand,
} from "~/lib/commands";

export const Route = createFileRoute("/")({
  component: () => {
    const crtScreenRef = useRef<CrtScreenHandle>(null);

    const handleShutdown = () => {
      if (!crtScreenRef.current) return;
      crtScreenRef.current.powerOff();
    };

    return (
      <div className="min-h-screen min-w-screen bg-slate-700 py-4 sm:py-12">
        <div className="container mx-auto px-1 sm:px-4 sm:py-4 md:px-4 md:py-4">
          <div className="crt-wrapper mx-auto border-2 border-slate-500 shadow-lg md:h-[768px] md:w-[1024px]">
            <CrtScreen ref={crtScreenRef}>
              <DesktopBackground className="h-full w-full bg-slate-800">
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
                  commands={[
                    ...default_commands,
                    buildSkillCommand(skills),
                    buildWorkExperienceCommand(workExperience),
                    buildCertificationsCommand(certifications),
                    buildAchievementsCommand(achievements),
                    createShutdownCommand(handleShutdown),
                  ]}
                />
              </DesktopBackground>
            </CrtScreen>
          </div>
        </div>
      </div>
    );
  },
});
