import { createFileRoute } from "@tanstack/react-router";

import { Terminal } from "~/components/ui/terminal";
import { default_commands } from "~/lib/commands";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen min-w-screen bg-slate-700 py-12">
      <div className="container mx-auto max-w-5xl px-4 py-4">
        <Terminal
          options={{
            theme: {
              background: "#1a1b26",
              foreground: "#a9b1d6",
              cursor: "#c0caf5",
            },
            fontSize: 16,
            cursorBlink: true,
            fontFamily: '"VT323", "Press Start 2P", monospace',
            lineHeight: 1.2,
            letterSpacing: 0.5,
            cols: 120,
            rows: 30,
          }}
          commands={default_commands}
        />
      </div>
    </div>
  ),
});
