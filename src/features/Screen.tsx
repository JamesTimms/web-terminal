import { forwardRef } from "react";

import { type Command } from "~/lib/terminal";
import { type TerminalOptions } from "~/components/ui/terminal";
import { Terminal, DesktopBackground } from "~/components/ui/terminal";
import { CrtScreen, CrtScreenInterface } from "~/components/ui/crt-screen";

interface ScreenProps {
  powerState: "on" | "off";
  terminalOptions: TerminalOptions;
  commands: Command[];
}

export const Screen = forwardRef<CrtScreenInterface, ScreenProps>(
  ({ powerState, terminalOptions, commands }, ref) => {
    if (powerState !== "on") return null;

    return (
      <CrtScreen ref={ref}>
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
    );
  },
);

Screen.displayName = "Screen";
