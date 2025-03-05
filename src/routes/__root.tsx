import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  ),
});
