// Picks the CRM the contact form saves to. CONTACT_PROVIDER=brevo|hubspot, default brevo.
// Switching provider is a config change plus a redeploy; the website form is the same for both.

import { brevoConfigProblems, createBrevoProvider } from "./brevo.mts";
import { createHubspotProvider, hubspotConfigProblems } from "./hubspot.mts";
import type { ContactProvider, Env, ProviderId } from "./types.mts";

export { ProviderError, type ContactSubmission } from "./types.mts";

const providers: Record<
  ProviderId,
  { problems: (env: Env) => string[]; create: (env: Env) => ContactProvider }
> = {
  brevo: { problems: brevoConfigProblems, create: createBrevoProvider },
  hubspot: { problems: hubspotConfigProblems, create: createHubspotProvider },
};

export type ProviderResult =
  { provider: ContactProvider; problems?: never } | { provider?: never; problems: string[] };

export function getProvider(env: Env = process.env): ProviderResult {
  const id = (env["CONTACT_PROVIDER"] || "brevo").trim().toLowerCase();
  if (!Object.hasOwn(providers, id)) {
    return { problems: [`CONTACT_PROVIDER must be "brevo" or "hubspot" (got "${id}")`] };
  }
  const entry = providers[id as ProviderId];
  const problems = entry.problems(env);
  return problems.length ? { problems } : { provider: entry.create(env) };
}
