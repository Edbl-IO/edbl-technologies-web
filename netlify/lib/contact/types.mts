// Shared types for the contact form's CRM providers (see index.mts).

export type ContactSubmission = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submittedAt: Date;
};

export type Env = Record<string, string | undefined>;

export interface ContactProvider {
  id: ProviderId;
  /** Saves the contact and their message. Throws ProviderError if the message wasn't saved. */
  save(submission: ContactSubmission): Promise<void>;
}

export type ProviderId = "brevo" | "hubspot";

// Plain fields rather than constructor parameter properties, which Node's built-in
// TypeScript support (used by `npm test`) can't run.
export class ProviderError extends Error {
  readonly status: number | undefined;
  readonly detail: string | undefined;

  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
    this.detail = detail;
  }
}

/** Reads a response body for logging without ever throwing. */
export async function responseText(response: Response) {
  return response.text().catch(() => "");
}
