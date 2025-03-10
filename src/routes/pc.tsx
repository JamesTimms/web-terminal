import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "~/components/ui/terminal";
import { default_commands } from "~/lib/commands";

export const Route = createFileRoute("/pc")({
  component: () => (
    <div className="min-h-screen min-w-screen bg-slate-700 py-12">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="terminal-wrapper">
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
              lineHeight: 1.25,
              letterSpacing: 1.65,
              cols: 80,
              rows: 24,
            }}
            commands={[...default_commands]}
          />
          <div className="crt-glow blue-white"></div>
          <div className="crt-rgb"></div>
          <div className="crt-scanlines"></div>
          <div className="crt-curvature"></div>
          <div className="crt-flicker white-phosphor"></div>
        </div>
      </div>
    </div>
  ),
});
