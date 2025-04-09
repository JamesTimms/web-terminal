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
import { Screen } from "~/features/Screen";
import { usePowerCycle } from "~/hooks/usePowerCycle";
import { Monitor, MonitorInterface } from "~/features/Monitor";
import { useIsDesktop } from "~/hooks/useScreenSize";
import useFocusMonitor from "~/hooks/useFocusMonitor";

export type PowerState = "on" | "off";

export const Route = createFileRoute("/")({
  component: () => {
    const crtScreenRef = useRef<CrtScreenInterface>(null);
    const isDesktop = useIsDesktop();

    const imageSize = useMemo(() => {
      let width = 2400;
      let height = 1350;
      if (!isDesktop) {
        width = 746;
        height = 1024;
      }
      return { width, height };
    }, [isDesktop]);

    const {
      currentZoom,
      originPercentage,
      monitorBoundingBox,
      terminalBoundingBox,
      offsetFrom,
      focusMonitor,
      unfocusMonitor,
    } = useFocusMonitor({
      imageSize,
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
      <Monitor
        currentZoom={currentZoom}
        originPercentage={originPercentage}
        imageSize={imageSize}
        offsetFrom={offsetFrom}
      >
        <MonitorInterface
          monitorBoundingBox={monitorBoundingBox}
          terminalBoundingBox={terminalBoundingBox}
          isPowered={isOn}
          onPowerClick={isOn ? onMonitorOff : onMonitorOn}
        >
          <Screen
            ref={crtScreenRef}
            terminalOptions={terminalOptions}
            commands={commands}
            realResolution={{
              width: terminalBoundingBox.width,
              height: terminalBoundingBox.height,
            }}
            desiredResolution={{
              width: 960,
              height: 720,
            }}
          />
        </MonitorInterface>
      </Monitor>
    );
  },
});
