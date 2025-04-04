import { useRef, useMemo, useCallback } from "react";
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
import { cn } from "~/lib/utils";
import { Screen } from "~/features/Screen";
import { useIsDesktop } from "~/hooks/useScreenSize";
import { MonitorOverlay } from "~/components/monitor";
import { usePowerCycle } from "~/hooks/usePowerCycle";
import { useFocusMonitor } from "~/hooks/useFocusMonitor";
export type PowerState = "on" | "off";

export const Route = createFileRoute("/")({
  component: () => {
    const crtScreenRef = useRef<CrtScreenInterface>(null);
    const isDesktop = useIsDesktop();

    const { currentZoom, focusMonitor, unfocusMonitor } = useFocusMonitor({
      baseWidth: 2400,
      baseHeight: 1350,
    });

    const { isOn, onPowerOn, onPowerOff } = usePowerCycle(crtScreenRef);

    const onMonitorOn = useCallback(() => {
      onPowerOn();
      focusMonitor();
    }, [onPowerOn, focusMonitor]);

    const onMonitorOff = useCallback(() => {
      onPowerOff();
      unfocusMonitor();
    }, [onPowerOff, unfocusMonitor]);

    const terminalDimensions = useMemo(
      () => ({
        cols: isDesktop ? 100 : 60,
        rows: 38,
      }),
      [isDesktop],
    );

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
        createShutdownCommand(onMonitorOff),
      ],
      [responsiveOptions, onMonitorOff],
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
      <div
        className={cn(
          "min-h-screen min-w-screen bg-slate-700 py-4 sm:py-12",
          "bg-[#8B5E3C]",
          "bg-[url(desk.jpeg)] bg-fixed bg-top bg-no-repeat",
          "fixed top-0 right-0 bottom-0 left-0 overflow-hidden",
        )}
        style={{
          transformOrigin: "center 27.5%",
          transform: `scale(${currentZoom})`,
          backgroundSize: `${2400}px ${1350}px`,
        }}
      >
        <MonitorOverlay
          className={cn(
            "crt-wrapper mx-auto border-slate-500",
            "scale-[0.70] pt-[62px] pl-[30px]",
          )}
          width={1024}
          height={768}
          isPowered={isOn}
          onPowerClick={isOn ? onMonitorOff : onMonitorOn}
        >
          <Screen
            ref={crtScreenRef}
            terminalOptions={terminalOptions}
            commands={commands}
          />
        </MonitorOverlay>
      </div>
    );
  },
});
