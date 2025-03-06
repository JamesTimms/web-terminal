import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">About</h1>
        <p className="text-gray-600">
          This is the about page. Here you can learn more about TechyTimms and
          what we do.
        </p>
      </div>
    </div>
  ),
});
