import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "~/lib/terminal";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-white">
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
