// Contact form handler, served at /api/contact. The site itself is static; this
// is the only server code, and it exists to keep the Brevo API key out of the browser.
//
// Environment variables (set in Netlify > Site configuration > Environment variables):
//   BREVO_API_KEY       required  Brevo API v3 key
//   BREVO_LIST_ID       required  Brevo list every contact-form sender is added to
//   CONTACT_TO_EMAIL    optional  inbox that is emailed each message (skip the email if unset)
//   CONTACT_FROM_EMAIL  required with CONTACT_TO_EMAIL; a sender verified in Brevo
//
// Brevo contact attributes this writes (CONTACT_MESSAGE and CONTACT_DATE must be created in Brevo):
//   FIRSTNAME, LASTNAME  built-in
//   CONTACT_MESSAGE      Text, the sender's latest message
//   CONTACT_DATE         Date, when that message was sent

const BREVO_API = "https://api.brevo.com/v3";
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

  const apiKey = process.env["BREVO_API_KEY"];
  const listId = Number(process.env["BREVO_LIST_ID"]);
  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    console.error("BREVO_API_KEY or BREVO_LIST_ID is not set");
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

  const [firstName, ...rest] = name.split(/\s+/);

  // Creates the contact, or updates it if the email is already in Brevo. A new
  // message replaces the previous one on the contact; the team email keeps the history.
  const contact = await brevo(apiKey, "/contacts", {
    email,
    attributes: {
      FIRSTNAME: firstName,
      LASTNAME: rest.join(" "),
      CONTACT_MESSAGE: message,
      CONTACT_DATE: new Date().toISOString().slice(0, 10),
    },
    listIds: [listId],
    updateEnabled: true,
  });
  if (!contact.ok) {
    console.error("Brevo contact error", contact.status, await contact.text());
    return json({ error: "We couldn't send your message. Please try again later." }, 502);
  }
  // 201 = new contact created, 204 = existing contact updated.
  console.info(`[contact] Saved contact to Brevo list ${listId} (HTTP ${contact.status})`);

  const to = process.env["CONTACT_TO_EMAIL"];
  const from = process.env["CONTACT_FROM_EMAIL"];
  if (to && from) {
    const mail = await brevo(apiKey, "/smtp/email", {
      sender: { name: "edbl website", email: from },
      to: [{ email: to }],
      replyTo: { name, email },
      subject: `Website contact from ${name}`,
      textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (!mail.ok) {
      // The contact and message are already saved in Brevo, so don't fail the request.
      console.error("Brevo email error", mail.status, await mail.text());
    } else {
      console.info("[contact] Sent notification email");
    }
  }

  return json({ ok: true });
}

function brevo(apiKey: string, path: string, payload: unknown) {
  return fetch(`${BREVO_API}${path}`, {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });
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
