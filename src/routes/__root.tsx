import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-center">
            <div className="flex gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-gray-900 font-medium">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  ),
});
