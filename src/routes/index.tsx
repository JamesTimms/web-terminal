import { useRef, useMemo, useCallback } from "react";
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
  ResponsiveOptions,
} from "~/lib/commands";
import { useIsDesktop } from "~/hooks/useScreenSize";

export const Route = createFileRoute("/")({
  component: () => {
    const crtScreenRef = useRef<CrtScreenHandle>(null);

    const isDesktop = useIsDesktop();

    const terminalDimensions = useMemo(
      () => ({
        cols: isDesktop ? 120 : 60,
        rows: 36,
      }),
      [isDesktop],
    );

    const handleShutdown = useCallback(() => {
      if (!crtScreenRef.current) return;
      crtScreenRef.current.powerOff();
    }, []);

    const responsiveOptions = useMemo<ResponsiveOptions>(
      () => ({
        isMobile: !isDesktop,
      }),
      [isDesktop],
    );

    const commands = useMemo(
      () => [
        ...default_commands(responsiveOptions),
        buildSkillCommand(skills, responsiveOptions),
        buildWorkExperienceCommand(workExperience, responsiveOptions),
        buildCertificationsCommand(certifications, responsiveOptions),
        buildAchievementsCommand(achievements, responsiveOptions),
        createShutdownCommand(handleShutdown),
      ],
      [responsiveOptions, handleShutdown],
    );

    const terminalOptions = useMemo(
      () => ({
        theme: {
          background: "#1a1b26",
          foreground: "#a9b1d6",
          cursor: "#c0caf5",
        },
        fontSize: isDesktop ? 14 : 12,
        cursorBlink: true,
        fontFamily: '"VT323", "Press Start 2P", monospace',
        lineHeight: 1.2,
        letterSpacing: isDesktop ? 1.5 : 1,
        cols: terminalDimensions.cols,
        rows: terminalDimensions.rows,
      }),
      [isDesktop, terminalDimensions.cols, terminalDimensions.rows],
    );

    return (
      <div className="min-h-screen min-w-screen bg-slate-700 py-4 sm:py-12">
        <div className="container mx-auto px-1 sm:px-4 sm:py-4 md:px-4 md:py-4">
          <div className="crt-wrapper mx-auto border-2 border-slate-500 shadow-lg md:h-[768px] md:w-[1024px]">
            <CrtScreen ref={crtScreenRef}>
              <DesktopBackground className="h-full w-full bg-slate-800">
                <Terminal
                  className="rounded-lg border border-slate-600"
                  options={terminalOptions}
                  commands={commands}
                />
              </DesktopBackground>
            </CrtScreen>
          </div>
        </div>
      </div>
    );
  },
});
