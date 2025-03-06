import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <main className="flex flex-1 items-center justify-center">
      <Outlet />
    </main>
  ),
});
