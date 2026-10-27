# edbl - Corporate Website
The public website for **edbl** (edbl Xperience), an AI-powered hospitality
intelligence platform that lets diners search, order and book dining experiences, with an
AI concierge named **Edna**.

The site is a showcase for the app and its job is to drive downloads (App Store, Google Play
and the PWA). It is not the app itself: there is no login, cart or backend.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19) with file-based routing via TanStack Router,
  **prerendered to static HTML at build time** (no server at runtime)
- [Vite](https://vite.dev) 8
- [Tailwind CSS](https://tailwindcss.com) v4, with shadcn/ui for components (add more with the shadcn CLI; `components.json` is kept)
- Hosted on [Netlify](https://www.netlify.com) as a static site
- TypeScript, ESLint and Prettier

## Getting started

Prerequisites: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:4000>.

## Scripts

| Command                  | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Start the Vite dev server on port 4000                    |
| `npm run build`          | Build and prerender the static site into `dist/client/`   |
| `npm run build:dev`      | Build in development mode                                 |
| `npm run preview:static` | Serve `dist/client/` as plain static files, like Netlify  |
| `npm run lint`           | Run ESLint                                                |
| `npm run format`         | Format the codebase with Prettier                         |

## Project structure

```
src/
  routes/              File-based routes (see src/routes/README.md)
    __root.tsx         App shell: <head>, theme boot script, 404 and error components
    index.tsx          Home page (/)
    home-alt.tsx       Alternative home page (/home-alt)
    404.tsx            Not-found page, prerendered to /404.html
    routeTree.gen.ts   Auto-generated route tree (do not edit)
  components/
    home-shared.tsx    Shared home page pieces (brand marks, phone mockup, store badges, theme switch)
    feature-carousel.tsx
    ui/                shadcn/ui components (only button.tsx is used; add more with the shadcn CLI)
  assets/              Logos and store badges
  lib/                 Utilities and stale-module reload recovery
  styles.css           Theme tokens, Tailwind setup and the page styles (see Styling)
public/                Static files copied as-is (favicon, robots.txt)
archive/               The previous static HTML version of the site, kept for reference
netlify.toml           Netlify build, publish dir and headers
```

Pages to prerender are listed in `pages` in [vite.config.ts](vite.config.ts). Links between pages are
also crawled automatically. When you add a route, add it there too.

## Routing

Each `.tsx` file in `src/routes/` becomes a route. Use TanStack conventions (`$id` for dynamic
segments, `__root.tsx` for the shell), not Next.js or Remix ones. `routeTree.gen.ts` is
regenerated automatically by the dev server and build. See
[src/routes/README.md](src/routes/README.md) for the full conventions.

## Styling

The home pages are styled with plain CSS classes in [src/styles.css](src/styles.css) (`.section-heading`,
`.feature-card`, `.download` and so on), not Tailwind utilities. Colors and fonts are CSS variables
at the top of that file, with light-theme overrides.

To keep sections consistent, reuse the shared patterns:

- Section titles use `.section-heading h2`: weight 800, `clamp(2.5rem, 5vw, 4.6rem)`, line height 1.03,
  and 2.6rem on mobile. Any section-specific `h2` rule (such as `.download h2`) should match.
- The highlighted second line of a heading goes in `<em>`, which renders in the primary green.
- Use curly apostrophes and quotes (’ “ ”) in copy.
- Don't give content cards a fixed `height` combined with `overflow: hidden`. Use `min-height` so the
  card can grow on narrow screens instead of clipping its padding.
- The theme is applied before first paint by a small script in `__root.tsx`. Keep it in sync with
  `useTheme` in `home-shared.tsx` if the storage key or classes change.

## Brand notes

- Product name is always lowercase: **edbl**.
- Primary color: emerald `#10B981`. The site is dark-first (background `#121212`), with a light theme toggle.
- Typeface: Outfit.
- Edna has a dedicated logo mark, separate from the main edbl logo.

The original design brief is in [README_old.md](README_old.md).

## Deployment

`npm run build` writes a fully static site to `dist/client/`: one HTML file per page
(`index.html`, `home-alt/index.html`, `404.html`) plus hashed assets. `dist/server/` is only used
during the build for prerendering and is not deployed.

Netlify reads [netlify.toml](netlify.toml): it runs `npm run build` on Node 22, publishes
`dist/client`, serves `404.html` for unknown paths, and caches `/assets/*` as immutable. Connect
the GitHub repo in the Netlify UI and every push to `main` deploys. Pull requests get deploy previews.

Don't install the Netlify TanStack Start adapter. It would turn server rendering back on as Netlify Functions.

The same `dist/client/` output can also be hosted on any static host (for example Azure Static Web Apps,
with a `staticwebapp.config.json` that maps 404s to `/404.html`).

After changing `vite.config.ts` or removing files, restart `npm run dev`. A dev server that was
already running keeps the old config.

## Before launch

- `/` is set to `noindex` in [src/routes/index.tsx](src/routes/index.tsx), and `/home-alt` is indexable.
  Decide which page should be indexed.
- No `og:image` or `twitter:image` is set, so link previews show no image.
  `archive/assets/og-image.png` could be used.
- The sitemap is disabled in `vite.config.ts`. Enable it with `host` once the production domain is known.
- `npm run lint` currently fails on Prettier errors. Most come from Windows (CRLF) line endings.
  Add `"endOfLine": "auto"` to `.prettierrc`, or run `npm run format` once.
- `license.txt` is the MIT license from the original Tailwind Toolbox template. Check whether it still applies.
