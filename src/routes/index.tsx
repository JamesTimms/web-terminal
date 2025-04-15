import { createFileRoute } from "@tanstack/react-router";
import { InteractiveTerminal } from "~/features/InteractiveTerminal";

export const Route = createFileRoute("/")({
  component: InteractiveTerminal,
});
