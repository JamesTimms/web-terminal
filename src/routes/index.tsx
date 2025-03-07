import { createFileRoute } from "@tanstack/react-router";

import { Terminal } from "~/components/ui/terminal";
import { buildSkillCommand, default_commands } from "~/lib/commands";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen min-w-screen bg-slate-700 py-12">
      <div className="container mx-auto max-w-7xl px-4 py-4">
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
            cols: 140,
            rows: 34,
          }}
          commands={[
            ...default_commands,
            buildSkillCommand([
              // Development Skills
              { name: "Python • FastAPI • Pydantic", level: 4 },
              { name: "React • TypeScript • Vite", level: 4 },
              { name: "Git • GitHub Action • GitLab", level: 4 },
              { name: "Unit Testing • Pytest • Vitest", level: 4 },
              { name: "NextJS", level: 3 },
              "break",

              // Cloud & Infrastructure
              { name: "AWS • GCP", level: 4 },
              { name: "Terraform • IaC", level: 4 },
              { name: "Docker • Kubernetes • Helm", level: 4 },
              { name: "Vercel • CloudFlare", level: 4 },
              { name: "Databases • PostgreSQL", level: 3 },
              { name: "AI & LLM Products • RAG", level: 3 },
              "break",

              // Operations
              { name: "DevSecOps • SRE", level: 4 },
              { name: "CI/CD", level: 4 },
              { name: "Security & Compliance", level: 4 },
              { name: "Incident Response", level: 4 },
              { name: "Observability • Monitoring", level: 4 },
              "break",

              // Product & Management
              { name: "Product-led Growth • PostHog", level: 4 },
              { name: "Consumer Products", level: 4 },
              { name: "Agile • Project Delivery", level: 3 },
              { name: "Mentoring • Leadership", level: 3 },
            ]),
          ]}
        />
      </div>
    </div>
  ),
});
