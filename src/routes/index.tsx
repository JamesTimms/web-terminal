import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="mx-auto max-w-2xl w-full">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to TechyTimms
        </h1>
        <p className="text-gray-600">
          This is your new React application with TanStack Router. Start
          building something amazing!
        </p>
      </div>
    </div>
  ),
});
