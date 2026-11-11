import { defineConfig, loadEnv, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// Dev only: serves netlify/functions/contact.mts at /api/contact during `npm run dev`,
// so the contact form works without the Netlify CLI. Brevo settings come from .env.
// In production Netlify runs the same file as a real Netlify Function.
function contactFunctionDevServer(): Plugin {
  return {
    name: "contact-function-dev-server",
    apply: "serve",
    configureServer(server) {
      Object.assign(
        process.env,
        loadEnv(server.config.mode, process.cwd(), ["BREVO_", "CONTACT_"]),
      );
      server.middlewares.use("/api/contact", async (req, res) => {
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const { default: handler } = (await server.ssrLoadModule(
            "/netlify/functions/contact.mts",
          )) as { default: (request: Request) => Promise<Response> };
          const response = await handler(
            new Request("http://localhost/api/contact", {
              method: req.method ?? "GET",
              headers: { "content-type": req.headers["content-type"] ?? "" },
              ...(req.method === "POST" ? { body: Buffer.concat(chunks) } : {}),
            }),
          );
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          server.config.logger.error(`[contact] ${String(error)}`);
          res.statusCode = 500;
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    contactFunctionDevServer(),
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
        { path: "/privacy" },
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
