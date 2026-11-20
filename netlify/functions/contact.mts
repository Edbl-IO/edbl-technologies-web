// Contact form handler, served at /api/contact. The site itself is static; this
// is the only server code, and it exists to keep the CRM's secret key out of the browser.
// It validates the form, then saves it with the CRM picked by CONTACT_PROVIDER
// (netlify/lib/contact).
//
// Environment variables (set in Netlify > Site configuration > Environment variables):
//   CONTACT_PROVIDER      optional  "brevo" (default) or "hubspot"
//   Brevo:
//     BREVO_API_KEY       required  Brevo API v3 key
//     BREVO_LIST_ID       required  Brevo list every contact-form sender is added to
//     CONTACT_TO_EMAIL    optional  inbox that is emailed each message (skip the email if unset)
//     CONTACT_FROM_EMAIL  required with CONTACT_TO_EMAIL; a sender verified in Brevo
//   HubSpot:
//     HUBSPOT_ACCESS_TOKEN  required  service key (or legacy private app) access token
//     HUBSPOT_LIST_ID       optional  manual list every contact-form sender is added to
//     HUBSPOT_OWNER_ID      optional  HubSpot owner the contact is assigned to (gets notified)

import { getProvider, ProviderError } from "../lib/contact/index.mts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  hp_check?: unknown;
};

export const config = { path: "/api/contact" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const { provider, problems } = getProvider();
  if (!provider) {
    console.error(`[contact] Contact form is not configured: ${problems.join("; ")}`);
    return json({ error: "The contact form isn't available right now." }, 500);
  }

  let body: ContactRequest;
  try {
    body = (await request.json()) as ContactRequest;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Bots fill in the hidden "hp_check" field; pretend it worked and drop it.
  if (typeof body.hp_check === "string" && body.hp_check.trim()) {
    console.warn("[contact] Honeypot field filled in; submission dropped as spam");
    return json({ ok: true });
  }

  const name = text(body.name, 100);
  const email = text(body.email, 200).toLowerCase();
  const message = text(body.message, 2000);

  if (!name || !message) return json({ error: "Please fill in your name and message." }, 400);
  if (!EMAIL_PATTERN.test(email))
    return json({ error: "Please enter a valid email address." }, 400);

  const [firstName = "", ...rest] = name.split(/\s+/);

  try {
    await provider.save({
      name,
      firstName,
      lastName: rest.join(" "),
      email,
      message,
      submittedAt: new Date(),
    });
  } catch (error) {
    if (error instanceof ProviderError) {
      console.error(`[contact] ${provider.id}: ${error.message}`, error.status, error.detail);
    } else {
      console.error(`[contact] ${provider.id}: unexpected error`, error);
    }
    return json({ error: "We couldn't send your message. Please try again later." }, 502);
  }

  return json({ ok: true });
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}
