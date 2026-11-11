# edbl - Corporate Website
The public website for **edbl** (edbl Xperience), an AI-powered hospitality
intelligence platform that lets diners search, order and book dining experiences, with an
AI concierge named **Edna**.

The site is a showcase for the app and its job is to drive downloads (App Store, Google Play
and the PWA). It is not the app itself: there is no login, cart or backend. The only server code is a small
Netlify Function for the contact form, which adds people to Brevo.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19) with file-based routing via TanStack Router,
  **prerendered to static HTML at build time** (no page rendering at runtime)
- [Vite](https://vite.dev) 8
- [Tailwind CSS](https://tailwindcss.com) v4, with shadcn/ui for components (add more with the shadcn CLI; `components.json` is kept)
- Hosted on [Netlify](https://www.netlify.com) as a static site, plus one Netlify Function (`/api/contact`)
- [Brevo](https://www.brevo.com) for contact-form contacts, mailing lists and the notification email
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
    privacy.tsx        Privacy Policy (/privacy)
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
netlify/functions/
  contact.mts          Contact form handler (/api/contact): adds the sender to Brevo, emails the team
netlify.toml           Netlify build, publish dir, headers, functions and `netlify dev` settings
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

## Contact form and Brevo

The footer's **Contact** link (and any URL ending in `#contact`) opens a modal form
([src/components/contact-dialog.tsx](src/components/contact-dialog.tsx)). It posts JSON to
`/api/contact`, the Netlify Function in [netlify/functions/contact.mts](netlify/functions/contact.mts), which:

1. Rejects bots that fill in the hidden honeypot field, and validates name, email and message.
2. Creates the contact in Brevo, or updates it if the email already exists (`POST /v3/contacts`
   with `updateEnabled`), and adds it to the `BREVO_LIST_ID` list. It stores these contact attributes:

   | Attribute         | Type | Holds                                   |
   | ----------------- | ---- | --------------------------------------- |
   | `FIRSTNAME`       | Text | First word of the name (built in)       |
   | `LASTNAME`        | Text | Rest of the name (built in)             |
   | `CONTACT_MESSAGE` | Text | Their latest message                    |
   | `CONTACT_DATE`    | Date | The day that message was sent           |

   If someone writes again, their contact is updated and the new message replaces the old one. The
   notification email in step 3 keeps every message.
3. Emails the message to `CONTACT_TO_EMAIL` through Brevo's transactional email
   (`POST /v3/smtp/email`), with the sender set as reply-to, so you can answer directly.

The Brevo API key exists only in the function's environment. It never reaches the browser.

### Setting up Brevo

1. **Create a Brevo account** at [brevo.com](https://www.brevo.com). The free plan includes contacts,
   lists and 300 emails a day.
2. **Authenticate your sending domain.** Go to *Settings > Senders, Domains & Dedicated IPs > Domains*,
   add your domain and add the DKIM, DMARC and Brevo code DNS records it gives you. Then, under *Senders*, add the address the
   notification email will come from (for example `website@yourdomain`). This becomes `CONTACT_FROM_EMAIL`.
3. **Create the contact list.** Go to *Contacts > Lists > Create a list* and name it, for example,
   "Website contact form". Every person who sends a message is added to it. Its ID (the number
   shown next to the list in *Contacts > Lists*) is `BREVO_LIST_ID`.
4. **Create the message attributes.** Go to *Contacts > Settings > Contact attributes > Add a new
   attribute* and create two normal attributes, named exactly:
   - `CONTACT_MESSAGE`, type **Text**
   - `CONTACT_DATE`, type **Date**

   `FIRSTNAME` and `LASTNAME` already exist. Once a message comes in, it shows on the contact's page
   in Brevo, and you can add `CONTACT_MESSAGE` / `CONTACT_DATE` as columns in the list view.
5. **Create an API key.** Go to *SMTP & API > API keys > Generate a new API key*. Copy it once. Brevo doesn't show it again.
6. **Allow requests from Netlify.** Brevo can restrict API keys to authorised IP addresses
   (*Security > Authorised IPs*). Netlify Functions don't have fixed IPs, so turn that restriction off for the
   API. Otherwise every request fails with `401 unauthorized`.
7. **Add the environment variables in Netlify.** Go to *Site configuration > Environment variables*.
   Mark `BREVO_API_KEY` as a secret and scope it to Functions:

   | Variable             | Required             | Value                                 |
   | -------------------- | -------------------- | ------------------------------------- |
   | `BREVO_API_KEY`      | Yes                  | The API key from step 5               |
   | `BREVO_LIST_ID`      | Yes                  | ID of the contact list from step 3    |
   | `CONTACT_TO_EMAIL`   | No                   | Inbox that is emailed each message    |
   | `CONTACT_FROM_EMAIL` | If `CONTACT_TO_EMAIL` | Verified sender from step 2           |

   If `CONTACT_TO_EMAIL` isn't set, contacts and messages are still saved in Brevo but no email is sent.
8. **Redeploy.** Environment variables only apply to new deploys. Then send a test message and check
   that the contact appears in the list with the message filled in, and that the email arrives.
   If something fails, check the Netlify Function logs (*Logs > Functions > contact*) for the Brevo error.

Contact-form senders haven't agreed to receive marketing. Don't add this list to newsletter campaigns
unless you add an explicit opt-in to the form and update the Privacy Policy.

### Running the form locally

`npm run dev` also serves the contact function at `/api/contact`, using a dev-only middleware in
[vite.config.ts](vite.config.ts) that runs the same `contact.mts` file. To make it reach Brevo, copy
[.env.example](.env.example) to `.env` (it's git-ignored), fill in the values, and restart `npm run dev`.

Without a `.env`, the form shows "The contact form isn't available right now." Real submissions go
to your Brevo account, so use a test list.

`npx netlify dev` (on <http://localhost:8888>) also works if you want to test with the Netlify CLI.

On Netlify, the form only works once `netlify/functions/contact.mts` is committed and deployed, and
the environment variables are set on the site. If the browser console shows a 404 for
`/api/contact`, the function isn't deployed. Check *Logs > Functions* in Netlify for `contact`.

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

- Set up Brevo and the Netlify environment variables (see [Setting up Brevo](#setting-up-brevo)).
  Until then the contact form shows "The contact form isn't available right now."
- Have the [Privacy Policy](src/routes/privacy.tsx) reviewed. In particular, confirm the 2-year
  retention period for enquiries, and add the company registration number if wanted. Update the policy
  and its "Last updated" date whenever the site adds a new service (analytics, a new form, a new provider).
- The footer's Terms link is still a placeholder.
- `/` is set to `noindex` in [src/routes/index.tsx](src/routes/index.tsx), and `/home-alt` is indexable.
  Decide which page should be indexed.
- No `og:image` or `twitter:image` is set, so link previews show no image.
  `archive/assets/og-image.png` could be used.
- The sitemap is disabled in `vite.config.ts`. Enable it with `host` once the production domain is known.
- `npm run lint` currently fails on Prettier errors. Most come from Windows (CRLF) line endings.
  Add `"endOfLine": "auto"` to `.prettierrc`, or run `npm run format` once.
- `license.txt` is the MIT license from the original Tailwind Toolbox template. Check whether it still applies.
