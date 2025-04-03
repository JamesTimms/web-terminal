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
import { cn } from "~/lib/utils";
import { Screen } from "~/features/Screen";
import { useIsDesktop } from "~/hooks/useScreenSize";
import { MonitorOverlay } from "~/components/monitor";
import { usePowerCycle } from "~/hooks/usePowerCycle";
import { useZoomAnimation } from "~/hooks/useZoomAnimation";

export type PowerState = "on" | "off";

export const Route = createFileRoute("/")({
  component: () => {
    const crtScreenRef = useRef<CrtScreenInterface>(null);
    const isDesktop = useIsDesktop();
    const [endScale, setEndScale] = useState(1.5);

    const { zoomState, handleZoomIn, handleZoomOut } = useZoomAnimation({
      options: {
        duration: 1500,
        startScale: 1.08,
        endScale: endScale,
      },
    });
    const { powerState, onPowerOn, onPowerOff } = usePowerCycle(crtScreenRef);

    const onMonitorOn = useCallback(() => {
      onPowerOn();
      handleZoomIn();
    }, [onPowerOn, handleZoomIn]);

    const onMonitorOff = useCallback(() => {
      onPowerOff();
      handleZoomOut();
    }, [onPowerOff, handleZoomOut]);

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

    return isDesktop ? (
      <div
        className={cn(
          "min-h-screen min-w-screen bg-slate-700 py-4 sm:py-12",
          "bg-[#8B5E3C]",
          "bg-[url(desk.jpeg)] bg-[length:2400px_1350px] bg-fixed bg-top bg-no-repeat",
          "fixed top-0 right-0 bottom-0 left-0 overflow-hidden",
          zoomState === "zooming-in" && "zoom-in-animation",
          zoomState === "zooming-out" && "zoom-out-animation",
          (zoomState === "zooming-in" || zoomState === "zooming-out") &&
            "zoom-transition",
        )}
        style={{
          transformOrigin: "center center",
          transform: `scale(${zoomState === "zoomed" ? endScale : 1})`,
        }}
      >
        <MonitorOverlay
          className="crt-wrapper mx-auto border-slate-500"
          width={1024}
          height={768}
          isPowered={powerState === "on"}
          onPowerClick={powerState === "on" ? onMonitorOff : onMonitorOn}
        >
          <Screen
            ref={crtScreenRef}
            terminalOptions={terminalOptions}
            commands={commands}
          />
        </MonitorOverlay>
      </div>
    ) : (
      <div className="fixed top-0 right-0 bottom-0 left-0 min-h-screen min-w-screen overflow-hidden bg-slate-600">
        {powerState === "off" ? (
          <div className="flex h-[768px] items-center justify-center">
            <button
              onClick={onPowerOn}
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
      </div>
    );
  },
});
