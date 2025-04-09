import { forwardRef, useMemo } from "react";

import { type Command } from "~/lib/terminal";
import { type TerminalOptions } from "~/components/ui/terminal";
import { Terminal, DesktopBackground } from "~/components/ui/terminal";
import { CrtScreen, CrtScreenInterface } from "~/components/ui/crt-screen";
import { cn } from "~/lib/utils";

interface ScreenProps {
  terminalOptions: TerminalOptions;
  commands: Command[];
  className?: string;
  realResolution: {
    width: number;
    height: number;
  };
  desiredResolution: {
    width: number;
    height: number;
  };
}

export const Screen = forwardRef<CrtScreenInterface, ScreenProps>(
  (
    { terminalOptions, commands, className, realResolution, desiredResolution },
    ref,
  ) => {
    const screenScale = useMemo(() => {
      return {
        width: realResolution.width / desiredResolution.width,
        height: realResolution.height / desiredResolution.height,
      };
    }, [realResolution, desiredResolution]);
    return (
      <CrtScreen
        ref={ref}
        className={cn(className)}
        screenSize={{
          // Adjust for the screen scale
          width: realResolution.width * (1 / screenScale.width),
          height: realResolution.height * (1 / screenScale.height),
        }}
      >
        <DesktopBackground className="h-full w-full bg-slate-800">
          <Terminal
            className="rounded-lg border border-slate-600"
            options={terminalOptions}
            commands={commands}
            bootCommands={[
              "sleep 1000 -s",
              // "boot",
              "sleep 250 -s",
              "clear -s",
              "sleep 250 -s",
              "welcome",
            ]}
            screenScale={screenScale}
          />
        </DesktopBackground>
      </CrtScreen>
    );
  },
);

Screen.displayName = "Screen";
