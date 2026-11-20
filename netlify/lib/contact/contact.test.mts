// Tests for /api/contact and both CRM providers, with fetch stubbed (no network).
// Run with `npm test`.

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import handler from "../../functions/contact.mts";

type Call = { method: string; url: string; body: unknown };
let calls: Call[];
let respond: (call: Call) => Response;

const ENV_KEYS = [
  "CONTACT_PROVIDER",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
  "HUBSPOT_ACCESS_TOKEN",
  "HUBSPOT_LIST_ID",
  "HUBSPOT_OWNER_ID",
];

function setEnv(values: Record<string, string>) {
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, values);
}

function post(body: Record<string, unknown>) {
  return handler(
    new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) }),
  );
}

const valid = { name: "Sam Lee Jones", email: "Sam@Example.com ", message: "Hi <there>\nThanks" };
const json = (status: number, body: unknown) => Response.json(body, { status });

beforeEach(() => {
  calls = [];
  respond = () => new Response(null, { status: 201 });
  mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    const call = {
      method: init.method ?? "GET",
      url,
      body: init.body ? JSON.parse(String(init.body)) : undefined,
    };
    calls.push(call);
    return respond(call);
  });
  for (const level of ["info", "warn", "error"] as const) mock.method(console, level, () => {});
});

afterEach(() => mock.restoreAll());

describe("request handling", () => {
  beforeEach(() => setEnv({ BREVO_API_KEY: "k", BREVO_LIST_ID: "2" }));

  it("rejects non-POST requests", async () => {
    const response = await handler(new Request("http://localhost/api/contact"));
    assert.equal(response.status, 405);
  });

  it("validates name, message and email", async () => {
    assert.equal((await post({ ...valid, name: "" })).status, 400);
    assert.equal((await post({ ...valid, message: " " })).status, 400);
    assert.equal((await post({ ...valid, email: "not-an-email" })).status, 400);
    assert.equal(calls.length, 0);
  });

  it("drops honeypot submissions without calling the CRM", async () => {
    const response = await post({ ...valid, hp_check: "spam" });
    assert.equal(response.status, 200);
    assert.equal(calls.length, 0);
  });
});

describe("provider selection", () => {
  it("defaults to Brevo", async () => {
    setEnv({ BREVO_API_KEY: "k", BREVO_LIST_ID: "2" });
    assert.equal((await post(valid)).status, 200);
    assert.match(calls[0]!.url, /api\.brevo\.com/);
  });

  it("returns 500 for an unknown provider", async () => {
    setEnv({ CONTACT_PROVIDER: "mailchimp" });
    const response = await post(valid);
    assert.equal(response.status, 500);
    assert.equal(calls.length, 0);
  });

  it("returns 500 when the chosen provider's settings are missing", async () => {
    setEnv({ CONTACT_PROVIDER: "hubspot", BREVO_API_KEY: "k", BREVO_LIST_ID: "2" });
    assert.equal((await post(valid)).status, 500);
    setEnv({ CONTACT_PROVIDER: "brevo", BREVO_API_KEY: "k", BREVO_LIST_ID: "abc" });
    assert.equal((await post(valid)).status, 500);
    assert.equal(calls.length, 0);
  });
});

describe("Brevo", () => {
  beforeEach(() =>
    setEnv({
      CONTACT_PROVIDER: "brevo",
      BREVO_API_KEY: "k",
      BREVO_LIST_ID: "2",
      CONTACT_TO_EMAIL: "team@example.com",
      CONTACT_FROM_EMAIL: "web@example.com",
    }),
  );

  it("upserts the contact with the message, then emails the team", async () => {
    assert.equal((await post(valid)).status, 200);
    assert.equal(calls.length, 2);
    const contact = calls[0]!.body as Record<string, any>;
    assert.equal(calls[0]!.url, "https://api.brevo.com/v3/contacts");
    assert.equal(contact["email"], "sam@example.com");
    assert.deepEqual(contact["listIds"], [2]);
    assert.equal(contact["updateEnabled"], true);
    assert.equal(contact["attributes"].FIRSTNAME, "Sam");
    assert.equal(contact["attributes"].LASTNAME, "Lee Jones");
    assert.equal(contact["attributes"].CONTACT_MESSAGE, "Hi <there>\nThanks");
    assert.match(contact["attributes"].CONTACT_DATE, /^\d{4}-\d{2}-\d{2}$/);
    const mail = calls[1]!.body as Record<string, any>;
    assert.equal(calls[1]!.url, "https://api.brevo.com/v3/smtp/email");
    assert.deepEqual(mail["replyTo"], { name: "Sam Lee Jones", email: "sam@example.com" });
  });

  it("returns 502 when the contact can't be saved", async () => {
    respond = () => json(401, { code: "unauthorized" });
    assert.equal((await post(valid)).status, 502);
    assert.equal(calls.length, 1);
  });

  it("still succeeds when only the notification email fails", async () => {
    respond = (call) =>
      call.url.endsWith("/smtp/email")
        ? json(403, { code: "permission_denied" })
        : new Response(null, { status: 204 });
    assert.equal((await post(valid)).status, 200);
  });
});

describe("HubSpot", () => {
  beforeEach(() =>
    setEnv({
      CONTACT_PROVIDER: "hubspot",
      HUBSPOT_ACCESS_TOKEN: "pat-test",
      HUBSPOT_LIST_ID: "42",
      HUBSPOT_OWNER_ID: "7",
    }),
  );

  it("updates an existing contact, adds a note and adds them to the list", async () => {
    respond = (call) =>
      call.method === "PATCH" ? json(200, { id: "101" }) : json(201, { id: "9" });
    assert.equal((await post(valid)).status, 200);
    assert.deepEqual(
      calls.map((call) => `${call.method} ${call.url.replace("https://api.hubapi.com", "")}`),
      [
        "PATCH /crm/v3/objects/contacts/sam%40example.com?idProperty=email",
        "POST /crm/v3/objects/notes",
        "PUT /crm/v3/lists/42/memberships/add",
      ],
    );
    assert.deepEqual((calls[0]!.body as any).properties, {
      email: "sam@example.com",
      firstname: "Sam",
      lastname: "Lee Jones",
      hubspot_owner_id: "7",
    });
    const note = calls[1]!.body as any;
    assert.equal(note.properties.hs_note_body.includes("Hi &lt;there&gt;<br>Thanks"), true);
    assert.deepEqual(note.associations[0], {
      to: { id: "101" },
      types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
    });
    assert.deepEqual(calls[2]!.body, ["101"]);
  });

  it("creates the contact when the email isn't in HubSpot yet", async () => {
    respond = (call) =>
      call.method === "PATCH"
        ? json(404, { category: "OBJECT_NOT_FOUND" })
        : json(201, { id: "55" });
    assert.equal((await post(valid)).status, 200);
    assert.equal(calls[1]!.method, "POST");
    assert.match(calls[1]!.url, /\/crm\/v3\/objects\/contacts$/);
    assert.equal((calls[2]!.body as any).associations[0].to.id, "55");
  });

  it("returns 502 when the note can't be saved", async () => {
    respond = (call) =>
      call.url.includes("/notes")
        ? json(403, { category: "MISSING_SCOPES" })
        : json(200, { id: "1" });
    assert.equal((await post(valid)).status, 502);
    assert.equal(
      calls.some((call) => call.url.includes("/lists/")),
      false,
    );
  });

  it("still succeeds when only the list update fails", async () => {
    respond = (call) => (call.url.includes("/lists/") ? json(400, {}) : json(200, { id: "1" }));
    assert.equal((await post(valid)).status, 200);
  });

  it("skips the list and owner when they aren't set", async () => {
    setEnv({ CONTACT_PROVIDER: "hubspot", HUBSPOT_ACCESS_TOKEN: "pat-test" });
    respond = () => json(200, { id: "1" });
    assert.equal((await post(valid)).status, 200);
    assert.equal(calls.length, 2);
    assert.equal("hubspot_owner_id" in (calls[0]!.body as any).properties, false);
  });
});
