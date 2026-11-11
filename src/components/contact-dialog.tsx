import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";

// Footer "Contact" link plus the contact form modal. Submissions go to the
// Netlify Function at /api/contact, which saves the person and their message in Brevo and emails
// the message to the team (see netlify/functions/contact.mts).

type Status = "idle" | "sending" | "sent" | "error";

export function ContactLink() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const open = () => {
    setStatus((current) => (current === "sent" ? "idle" : current));
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  // Lets #contact links (and shared URLs ending in #contact) open the form.
  useEffect(() => {
    const openFromHash = () => {
      const dialog = dialogRef.current;
      if (window.location.hash === "#contact" && dialog && !dialog.open) dialog.showModal();
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          hp_check: data.get("hp_check"),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Something went wrong. Please try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <a
        href="#contact"
        onClick={(event) => {
          event.preventDefault();
          open();
        }}
      >
        Contact
      </a>
      <dialog
        ref={dialogRef}
        className="contact-dialog"
        aria-labelledby="contact-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onClose={() => {
          if (window.location.hash === "#contact")
            history.replaceState(null, "", window.location.pathname);
        }}
      >
        <div className="contact-panel">
          <button type="button" className="contact-close" onClick={close} aria-label="Close">
            <X />
          </button>
          <span className="kicker">Get in touch</span>
          <h2 id="contact-title">
            Contact <em>edbl.</em>
          </h2>
          {status === "sent" ? (
            <div className="contact-sent" role="status">
              <span className="icon-box">
                <Check />
              </span>
              <p>Thanks — your message is on its way. We’ll get back to you soon.</p>
              <button type="button" className="button" onClick={close}>
                Close
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <p>Questions, partnerships or press? Send us a message and we’ll reply by email.</p>
              <label>
                Name
                <input name="name" autoComplete="name" required maxLength={100} />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required maxLength={200} />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} required maxLength={2000} />
              </label>
              {/* Honeypot: hidden from people, often filled in by bots. Its name and label must
                  not look like a real field (company, website, phone…) or browser autofill fills it
                  and real messages get dropped. */}
              <label className="contact-honeypot" aria-hidden="true">
                Leave this empty
                <input name="hp_check" tabIndex={-1} autoComplete="off" />
              </label>
              {status === "error" && (
                <p className="contact-error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="button" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p className="contact-privacy">
                We use your details to reply to you. See our <a href="/privacy">Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
