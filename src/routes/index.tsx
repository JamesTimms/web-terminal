import { createFileRoute } from "@tanstack/react-router";

import { cn } from "~/lib/utils";
import { Terminal } from "~/lib/terminal";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="bg-retro-black min-h-screen min-w-screen py-12">
      <div className="container mx-auto max-w-5xl px-4 py-4">
        <h1
          className={cn(
            "font-pixel text-center text-4xl font-bold",
            "mb-8",
            "bg-retro-gradient retro-text-glow bg-clip-text text-transparent",
          )}
        >
          TECHY TIMMS OS v0.1
        </h1>
        <div className="mb-6 text-center">
          <p className="font-terminal text-retro-cyan mb-2 text-lg">
            BOOTING FROM DISK... SYSTEM READY
          </p>
        </div>
        <Terminal
          className="relative mx-auto mb-8 h-[500px] w-full max-w-4xl rounded-lg"
          options={{
            theme: {
              background: "#000000",
              foreground: "#00ff00",
              cursor: "#ff00ff",
            },
            fontSize: 18,
            fontFamily: '"VT323", "Press Start 2P", monospace',
          }}
        />
        <div className="mb-6 text-center">
          <p className="font-terminal text-retro-magenta text-xl">
            © 1986 TECHY INDUSTRIES - ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </div>
  ),
});
