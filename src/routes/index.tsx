import { useRef, useMemo, useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CrtScreenInterface } from "~/components/ui/crt-screen";
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
import { Screen } from "~/features/Screen";

export const Route = createFileRoute("/")({
  component: () => {
    const [powerState, setPowerState] = useState<"on" | "off">("off");
    const crtScreenRef = useRef<CrtScreenInterface>(null);
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
      if (!crtScreenRef.current) return;
      crtScreenRef.current.powerOn();
      playPowerOnSound();
      setPowerState("on");
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
          {isDesktop ? (
            <Monitor
              className="crt-wrapper mx-auto border-slate-500"
              width={1024}
              height={768}
              isPowered={powerState === "on"}
              onPowerClick={powerState === "on" ? handleShutdown : handleStart}
            >
              <Screen
                ref={crtScreenRef}
                terminalOptions={terminalOptions}
                commands={commands}
              />
            </Monitor>
          ) : (
            <>
              {powerState === "off" ? (
                <div className="flex h-[768px] items-center justify-center">
                  <button
                    onClick={handleStart}
                    className="rounded-lg bg-slate-800 px-8 py-4 font-mono text-xl text-slate-200 shadow-lg transition-colors hover:bg-slate-900"
                  >
                    Power On
                  </button>
                </div>
              ) : (
                <div className="crt-wrapper mx-auto border-2 border-slate-500 shadow-lg md:h-[768px] md:w-[1024px]">
                  <Screen
                    ref={crtScreenRef}
                    terminalOptions={terminalOptions}
                    commands={commands}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  },
});
