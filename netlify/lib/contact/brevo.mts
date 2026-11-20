// Brevo provider. Env: BREVO_API_KEY, BREVO_LIST_ID (required);
// CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL (optional notification email).
//
// Brevo contact attributes this writes (CONTACT_MESSAGE and CONTACT_DATE must be created in Brevo):
//   FIRSTNAME, LASTNAME  built-in
//   CONTACT_MESSAGE      Text, the sender's latest message
//   CONTACT_DATE         Date, when that message was sent

import {
  ProviderError,
  responseText,
  type ContactProvider,
  type ContactSubmission,
  type Env,
} from "./types.mts";

const BREVO_API = "https://api.brevo.com/v3";

/** Lists what's missing or invalid in the Brevo settings (variable names only, never values). */
export function brevoConfigProblems(env: Env) {
  const problems: string[] = [];
  if (!env["BREVO_API_KEY"]) problems.push("BREVO_API_KEY is not set");
  if (!isPositiveInteger(env["BREVO_LIST_ID"]))
    problems.push("BREVO_LIST_ID must be a list ID number");
  return problems;
}

function isPositiveInteger(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

export function createBrevoProvider(env: Env): ContactProvider {
  const apiKey = env["BREVO_API_KEY"] ?? "";
  const listId = Number(env["BREVO_LIST_ID"]);

  return {
    id: "brevo",
    async save(submission: ContactSubmission) {
      const { name, firstName, lastName, email, message, submittedAt } = submission;

      // Creates the contact, or updates it if the email is already in Brevo. A new
      // message replaces the previous one on the contact; the team email keeps the history.
      const contact = await brevo(apiKey, "/contacts", {
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          CONTACT_MESSAGE: message,
          CONTACT_DATE: submittedAt.toISOString().slice(0, 10),
        },
        listIds: [listId],
        updateEnabled: true,
      });
      if (!contact.ok) {
        throw new ProviderError("Brevo contact error", contact.status, await responseText(contact));
      }
      // 201 = new contact created, 204 = existing contact updated.
      console.info(`[contact] brevo: saved contact to list ${listId} (HTTP ${contact.status})`);

      const to = env["CONTACT_TO_EMAIL"];
      const from = env["CONTACT_FROM_EMAIL"];
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
          console.error("[contact] brevo: email error", mail.status, await responseText(mail));
        } else {
          console.info("[contact] brevo: sent notification email");
        }
      }
    },
  };
}

function brevo(apiKey: string, path: string, payload: unknown) {
  return fetch(`${BREVO_API}${path}`, {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });
}
