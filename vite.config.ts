import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Keep server-only modules out of the client bundle.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Static site: every page is rendered to HTML at build time into dist/client.
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      pages: [
        { path: "/" },
        { path: "/home-alt" },
        { path: "/404", prerender: { outputPath: "/404.html" } },
      ],
      // Enable with `host` once the production domain is known.
      sitemap: { enabled: false },
    }),
    viteReact(),
  ],
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  server: { host: "::", port: 4000 },
});
