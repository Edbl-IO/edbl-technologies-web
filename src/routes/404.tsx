import { createFileRoute } from "@tanstack/react-router";

import { NotFoundComponent } from "./__root";

// Prerendered to /404.html, which the static host serves for unknown paths.
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [{ title: "Page not found - edbl" }, { name: "robots", content: "noindex" }],
  }),
  component: NotFoundComponent,
});
