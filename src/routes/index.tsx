import { useRef, useMemo, useCallback, useState } from "react";
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
  ResponsiveOptions,
  buildSourceCommand,
  createShutdownCommand,
  buildAchievementsCommand,
  buildCertificationsCommand,
  buildWorkExperienceCommand,
} from "~/lib/commands";
import { useIsDesktop } from "~/hooks/useScreenSize";
import { usePowerOnSound, usePowerOffSound } from "~/hooks/useSound";
import { Monitor } from "~/components/monitor";

export const Route = createFileRoute("/")({
  component: () => {
    const [powerState, setPowerState] = useState<"on" | "off">("off");
    const crtScreenRef = useRef<CrtScreenHandle>(null);
    const playPowerOnSound = usePowerOnSound();
    const playPowerOffSound = usePowerOffSound();
    const isDesktop = useIsDesktop();

    const terminalDimensions = useMemo(
      () => ({
        cols: isDesktop ? 100 : 60,
        rows: 38,
      }),
      [isDesktop],
    );

    const handleStart = useCallback(() => {
      setPowerState("on");
      playPowerOnSound();
    }, [playPowerOnSound]);

    const handleShutdown = useCallback(() => {
      if (!crtScreenRef.current) return;
      setPowerState("off");
      playPowerOffSound();
      crtScreenRef.current.powerOff();
    }, [playPowerOffSound]);

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
        buildSourceCommand(),
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
          <Monitor
            className="crt-wrapper mx-auto border-slate-500"
            width={1024}
            height={768}
            isPowered={powerState === "on"}
            onPowerClick={powerState === "on" ? handleShutdown : handleStart}
          >
            {powerState === "on" && (
              <CrtScreen ref={crtScreenRef}>
                <DesktopBackground className="h-full w-full bg-slate-800">
                  <Terminal
                    className="rounded-lg border border-slate-600"
                    options={terminalOptions}
                    commands={commands}
                    bootCommands={[
                      "sleep 1000 -s",
                      "boot",
                      "sleep 250 -s",
                      "clear -s",
                      "sleep 250 -s",
                      "welcome",
                    ]}
                  />
                </DesktopBackground>
              </CrtScreen>
            )}
          </Monitor>
        </div>
      </div>
    );
  },
});
