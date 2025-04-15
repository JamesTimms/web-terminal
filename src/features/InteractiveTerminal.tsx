import { useMemo, useCallback } from "react";
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
import { useIsDesktop } from "~/hooks/useScreenSize";
import useFocusMonitor from "~/hooks/useFocusMonitor";
import { usePowerCycle } from "~/hooks/usePowerCycle";
import { Monitor as ZoomMonitor, PopupMonitor, Desk } from "~/features/Monitor";

export const InteractiveTerminal = () => {
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

  const { powerState, onPowerOn, onPowerOff, isOn, isTurningOn } =
    usePowerCycle();

  const onMonitorOn = useCallback(() => {
    onPowerOn();
    if (!isDesktop) return;
    focusMonitor();
  }, [onPowerOn, focusMonitor, isDesktop]);

  const onMonitorOff = useCallback(() => {
    onPowerOff();
    if (!isDesktop) return;
    unfocusMonitor();
  }, [onPowerOff, unfocusMonitor, isDesktop]);

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

  const margin = 16; // Based on PopupMonitor padding
  let width = window.innerWidth - margin * 2;
  let height = (window.innerHeight * 3) / 5 - margin * 2;
  if (isDesktop) {
    width = terminalBoundingBox.width;
    height = terminalBoundingBox.height;
  }

  let Monitor = isOn ? PopupMonitor : ZoomMonitor;

  if (isDesktop) {
    Monitor = ZoomMonitor;
  }

  return (
    <Desk
      currentZoom={currentZoom}
      originPercentage={originPercentage}
      imageSize={imageSize}
      offsetFrom={offsetFrom}
    >
      <Monitor
        monitorBoundingBox={monitorBoundingBox}
        terminalBoundingBox={terminalBoundingBox}
        isPowered={isOn || isTurningOn}
        onPowerClick={isOn ? onMonitorOff : onMonitorOn}
      >
        <Screen
          powerState={powerState}
          terminalOptions={terminalOptions}
          commands={commands}
          realResolution={{
            width,
            height,
          }}
          desiredResolution={{
            width: isDesktop ? 960 : width,
            height: isDesktop ? 720 : height,
          }}
        />
      </Monitor>
    </Desk>
  );
};
