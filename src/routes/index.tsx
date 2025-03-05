import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "~/lib/terminal";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          TechyTimms Terminal
        </h1>
        <Terminal
          options={{
            theme: {
              background: "#1a1b26",
              foreground: "#a9b1d6",
              cursor: "#c0caf5",
            },
            fontSize: 16,
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  ),
});
