import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ContactLink } from "@/components/contact-dialog";
import { BrandMark, ThemeSwitch, useTheme } from "@/components/home-shared";

// Privacy policy for this marketing website only. The edbl app has its own policy.
// Keep it in step with what the site actually does: the contact form
// (netlify/functions/contact.mts → Brevo), Netlify hosting, Google Fonts and the
// browser storage used by useTheme and lib/stale-module-recovery.ts.

const LAST_UPDATED = "29 October 2026";
const CONTACT_EMAIL = "hello@edbl.app";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - edbl" },
      {
        name: "description",
        content: "How edbl Ltd collects and uses personal data on this website.",
      },
      { property: "og:title", content: "Privacy Policy - edbl" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="logo" href="/" aria-label="edbl home">
          <BrandMark />
          <span>edbl</span>
        </a>
        <div className="header-actions">
          <ThemeSwitch theme={theme} onChange={setTheme} />
          <a className="button button-small button-ghost" href="/">
            <ArrowLeft size={16} /> Back to home
          </a>
        </div>
      </header>

      <main id="top" className="legal section-pad">
        <span className="kicker">Legal</span>
        <h1>
          Privacy <em>Policy.</em>
        </h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>

        <p>
          This policy explains what personal data edbl Ltd collects when you use this website, why
          we collect it and what your rights are. It covers this website only. The edbl app has its
          own privacy policy, which you can read in the app.
        </p>

        <h2>Who we are</h2>
        <p>
          edbl Ltd is the controller of personal data collected through this website. Our address is
          20 Wenlock Road, London, England, N1 7GU, United Kingdom. For anything about this policy
          or your data, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>What we collect and why</h2>
        <h3>When you contact us</h3>
        <p>
          If you use the contact form, we collect your name, email address and your message, and
          save them as a contact in our customer contact list. We use this to reply to you and keep
          a record of your enquiry. Our lawful basis is our legitimate interest in responding to
          people who get in touch. We don’t add you to a marketing mailing list unless you ask us
          to.
        </p>

        <h3>When you visit the site</h3>
        <p>
          Like most websites, our hosting provider automatically records technical information about
          requests to the site, such as your IP address, browser type and the pages requested. This
          is used to deliver the site, keep it secure and fix problems. Our lawful basis is our
          legitimate interest in running a secure, working website.
        </p>
        <p>
          We don’t use analytics, advertising or tracking cookies, and we don’t sell your personal
          data.
        </p>

        <h2>Cookies and browser storage</h2>
        <p>
          This site doesn’t set cookies. It stores two small items in your browser, which never
          leave your device:
        </p>
        <ul>
          <li>
            <strong>Theme preference</strong> (local storage): remembers whether you chose the light
            or dark theme.
          </li>
          <li>
            <strong>Reload marker</strong> (session storage): briefly set after the site updates, so
            an out-of-date page reloads once instead of breaking. It’s cleared when you close the
            tab.
          </li>
        </ul>
        <p>
          Both are needed for features you use, so we don’t ask for consent for them. You can clear
          them at any time in your browser settings.
        </p>

        <h2>Who we share data with</h2>
        <p>
          We use these service providers, who process data on our behalf and only as we instruct:
        </p>
        <ul>
          <li>
            <strong>Brevo</strong> (Sendinblue SAS, France): stores our contact list, including
            contact-form messages, and delivers the emails we send.
          </li>
          <li>
            <strong>Netlify</strong> (Netlify, Inc., United States): hosts the website and runs the
            contact form.
          </li>
          <li>
            <strong>Google Fonts</strong> (Google LLC, United States): serves the fonts the site
            uses. Your browser connects to Google to download them, which shares your IP address
            with Google.
          </li>
        </ul>
        <p>We may also disclose data if the law requires it, or to protect our rights.</p>

        <h2>International transfers</h2>
        <p>
          Some of these providers process data outside the UK. Where they do, the transfer is
          protected by an adequacy decision (such as the UK Extension to the EU–US Data Privacy
          Framework) or by standard data protection contractual clauses approved for UK transfers.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep contact-form enquiries for as long as we need to deal with them, and then for up
          to 2 years in case you get in touch again. Hosting logs are kept by Netlify for a short
          period in line with its own retention policy.
        </p>

        <h2>Your rights</h2>
        <p>Under UK data protection law you have the right to:</p>
        <ul>
          <li>ask for a copy of the personal data we hold about you</li>
          <li>ask us to correct or delete it</li>
          <li>ask us to restrict how we use it, or object to our using it</li>
          <li>ask for your data in a portable format</li>
        </ul>
        <p>
          To use any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          We’ll reply within one month.
        </p>
        <p>
          If you’re unhappy with how we’ve handled your data, you can complain to the Information
          Commissioner’s Office (ICO) at{" "}
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">
            ico.org.uk
          </a>
          . We’d appreciate the chance to put things right first, so please contact us before you go
          to the ICO.
        </p>

        <h2>Children</h2>
        <p>
          This website isn’t aimed at children under 13, and we don’t knowingly collect their
          personal data.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We’ll update this page if the way we handle personal data changes, and change the “Last
          updated” date at the top.
        </p>
      </main>

      <footer className="legal-footer">
        <p className="copyright">© edbl. All rights reserved.</p>
        <div>
          <a href="/">Home</a>
          <ContactLink />
        </div>
      </footer>
    </div>
  );
}
