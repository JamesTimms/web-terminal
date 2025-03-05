import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="mx-auto max-w-2xl w-full">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About</h1>
        <p className="text-gray-600">
          This is the about page. Here you can learn more about TechyTimms and
          what we do.
        </p>
      </div>
    </div>
  ),
});
