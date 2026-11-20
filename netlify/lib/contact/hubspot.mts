// HubSpot provider, using the CRM v3 API with a service key (or legacy private app token).
// Env: HUBSPOT_ACCESS_TOKEN (required); HUBSPOT_LIST_ID, HUBSPOT_OWNER_ID (optional).
//
// Each submission:
//   1. updates the contact by email, or creates it if it doesn't exist
//   2. adds the message as a Note on the contact, so every message is kept
//   3. adds the contact to HUBSPOT_LIST_ID (a manual or snapshot list), if set
// HUBSPOT_OWNER_ID assigns the contact to a HubSpot user, who is notified by HubSpot.

import {
  ProviderError,
  responseText,
  type ContactProvider,
  type ContactSubmission,
  type Env,
} from "./types.mts";

const HUBSPOT_API = "https://api.hubapi.com";
// HubSpot-defined association type for note → contact.
const NOTE_TO_CONTACT = 202;

/** Lists what's missing or invalid in the HubSpot settings (variable names only, never values). */
export function hubspotConfigProblems(env: Env) {
  const problems: string[] = [];
  if (!env["HUBSPOT_ACCESS_TOKEN"]) problems.push("HUBSPOT_ACCESS_TOKEN is not set");
  const listId = env["HUBSPOT_LIST_ID"];
  if (listId && !/^\d+$/.test(listId)) problems.push("HUBSPOT_LIST_ID must be a list ID number");
  const ownerId = env["HUBSPOT_OWNER_ID"];
  if (ownerId && !/^\d+$/.test(ownerId))
    problems.push("HUBSPOT_OWNER_ID must be an owner ID number");
  return problems;
}

export function createHubspotProvider(env: Env): ContactProvider {
  const token = env["HUBSPOT_ACCESS_TOKEN"] ?? "";
  const listId = env["HUBSPOT_LIST_ID"];
  const ownerId = env["HUBSPOT_OWNER_ID"];

  const hubspot = (method: string, path: string, payload: unknown) =>
    fetch(`${HUBSPOT_API}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

  return {
    id: "hubspot",
    async save(submission: ContactSubmission) {
      const { firstName, lastName, email, message, submittedAt } = submission;
      const properties: Record<string, string> = {
        email,
        firstname: firstName,
        lastname: lastName,
      };
      if (ownerId) properties["hubspot_owner_id"] = ownerId;

      // 1. Update the existing contact by email; create it if there isn't one.
      let contact = await hubspot(
        "PATCH",
        `/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
        { properties },
      );
      let created = false;
      if (contact.status === 404) {
        contact = await hubspot("POST", "/crm/v3/objects/contacts", { properties });
        created = true;
      }
      if (!contact.ok) {
        throw new ProviderError(
          "HubSpot contact error",
          contact.status,
          await responseText(contact),
        );
      }
      const { id: contactId } = (await contact.json()) as { id: string };
      console.info(`[contact] hubspot: ${created ? "created" : "updated"} contact ${contactId}`);

      // 2. Keep the message as a Note, so HubSpot has every message, not just the latest.
      const note = await hubspot("POST", "/crm/v3/objects/notes", {
        properties: {
          hs_timestamp: submittedAt.toISOString(),
          hs_note_body: noteBody(message),
          ...(ownerId ? { hubspot_owner_id: ownerId } : {}),
        },
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: NOTE_TO_CONTACT }],
          },
        ],
      });
      if (!note.ok) {
        throw new ProviderError("HubSpot note error", note.status, await responseText(note));
      }
      console.info(`[contact] hubspot: added message note to contact ${contactId}`);

      // 3. Add to the list. The contact and message are already saved, so only log failures.
      if (listId) {
        const membership = await hubspot("PUT", `/crm/v3/lists/${listId}/memberships/add`, [
          contactId,
        ]);
        if (!membership.ok) {
          console.error(
            "[contact] hubspot: list error",
            membership.status,
            await responseText(membership),
          );
        } else {
          console.info(`[contact] hubspot: added contact ${contactId} to list ${listId}`);
        }
      }
    },
  };
}

// HubSpot shows note bodies as rich text, so escape the message and keep its line breaks.
function noteBody(message: string) {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
  return `<p><strong>Website contact form</strong></p><p>${escaped}</p>`;
}
