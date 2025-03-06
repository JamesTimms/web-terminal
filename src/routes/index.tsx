import { createFileRoute } from "@tanstack/react-router";

import { cn } from "~/lib/utils";
import { Terminal } from "~/lib/terminal";

export const Route = createFileRoute("/")({
  component: () => (
    <div
      className={cn(
        "min-h-screen min-w-screen py-12",
        `bg-red-200 bg-[radial-gradient(circle_at_center,rgba(120,0,170,0.15)_0,rgba(0,0,0,0.75)_100%),linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:100%_100%,40px_40px,40px_40px]`,
      )}
    >
      <div className="container mx-auto max-w-5xl px-4 py-4">
        <h1 className="mb-8 bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff00ff] bg-clip-text text-center font-['Press_Start_2P',monospace] text-4xl font-bold text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
          TECHY TIMMS OS v0.1
        </h1>
        <div className="mb-6 text-center">
          <p className="mb-2 font-['VT323',monospace] text-xl text-[#00ffff]">
            BOOTING FROM DISK... SYSTEM READY
          </p>
        </div>
        <div className="relative mx-auto mb-8 max-w-4xl">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff00ff] opacity-75 blur"></div>
          <Terminal
            className="relative h-[500px] w-full rounded-lg"
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
        </div>
        <div className="mb-6 text-center">
          <p className="font-['VT323',monospace] text-xl text-[#ff00ff]">
            © 1986 TECHY INDUSTRIES - ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </div>
  ),
});
