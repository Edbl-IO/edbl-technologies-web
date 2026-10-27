import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  CircleUserRound,
  CreditCard,
  Heart,
  Leaf,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
  Wine,
} from "lucide-react";
import { FeatureCarousel } from "@/components/feature-carousel";
import {
  BrandMark,
  EdnaMark,
  EdnaName,
  PhoneMockup,
  StoreBadges,
  ThemeSwitch,
  coreDinerGroups,
  coreVenueGroups,
  screens,
  useTheme,
  withEdnaFont,
} from "@/components/home-shared";

export const Route = createFileRoute("/home-alt")({
  head: () => ({
    meta: [
      { title: "edbl - AI-Powered Hospitality Intelligence Platform" },
      {
        name: "description",
        content: "Order, book, and discover amazing dining experiences with edbl and your AI concierge, Edna.",
      },
      { property: "og:title", content: "edbl - AI-Powered Hospitality Intelligence Platform" },
      { property: "og:description", content: "Order, book, and discover amazing dining experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const features = [
  [Search, "Search like you talk", "Type it how you’d say it. ‘Something spicy for two’ or ‘gluten-free dinner near me’ — we’ll find places that fit."],
  [Sparkles, "Meet Edna, your dining companion", "A friendly AI that suggests dishes, answers menu questions, and can book or order for you."],
  [ShieldCheck, "Eat with confidence", "Filter by allergy or diet and mean it. ‘Nut-free’ actually excludes the nuts, and every dish shows what it contains."],
  [Leaf, "Nutrition, Made Comparable", "Compare dishes side by side on calories and nutrition, and keep a personal nutrition profile that travels with you across venues."],
  [Utensils, "Order Your Way", "Pre-order ahead so it’s ready when you arrive, or scan the table QR code and order right from your seat."],
  [Users, "Effortless Table & Group Booking", "Book in seconds — or organize a group dinner where every guest picks their own items and pays their own share via a private payment link."],
  [Wine, "Trending & Curated Discovery", "See what’s trending right now, browse dedicated wine lists with pairing detail, and catch venue promotions before they’re gone."],
  [Heart, "One Account, Every Venue", "Your favorites, order history, bookings, and preferences follow you — no re-entering your allergies at every restaurant."],
] as const;

function HomePage() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="logo" href="#top" aria-label="edbl home"><BrandMark /><span>edbl</span></a>
        <nav aria-label="Main navigation">
          <a href="#features">Features</a><a href="#edna"><EdnaName /></a><a href="#core-manager">Core Manager</a><a href="#how-it-works">How it works</a><a href="#download">Download</a>
        </nav>
        <div className="header-actions">
          <ThemeSwitch theme={theme} onChange={setTheme} />
          <a className="button button-small" href="#download">Get the app <ArrowRight size={16} /></a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy reveal">
            <div className="eyebrow"><Sparkles size={15} />AI-Powered Hospitality Intelligence</div>
            <h1>Your table.<br />Your order.<br /><em>Your rules.</em></h1>
            <p>Find somewhere good to eat, book a table, and order ahead, all in one place. <EdnaName /> knows your allergies, your taste, and what you fancy tonight.</p>
            <div className="hero-actions"><a className="button" href="#download">Get edbl — it’s free <ArrowRight size={18} /></a><a className="button button-ghost" href="#how-it-works">Show me how it works</a></div>
            <span className="microcopy"><Check size={14} /> Built for iOS & Android</span>
          </div>
          <div className="hero-visual reveal" aria-hidden="true">
            <div className="hero-orbit orbit-one"><Sparkles size={17} /> Ask <EdnaName /></div>
            <div className="hero-orbit orbit-two"><ShieldCheck size={17} /> Allergen-aware</div>
            <PhoneMockup />
          </div>
        </section>

        <section className="trust-bar" aria-label="Platform highlights">
          <div><Sparkles />Search like you talk</div><div><ShieldCheck />Allergy-savvy</div><div><Utensils />Real menus, honest details</div><div><CircleUserRound />Free on iPhone & Android</div>
        </section>

        <section className="section-pad" id="features">
          <div className="section-heading reveal"><span className="kicker">One app. Every occasion.</span><h2>Everything dining,<br /><em>in one app.</em></h2><p>From the first “where shall we eat?” to the last round, we’ve taken the fuss out of every step.</p></div>
          <FeatureCarousel className="reveal" label="edbl app features" slideClass="carousel-slide-thirds">
            {features.map(([Icon, title, copy], index) => <article className={`feature-card ${index === 1 ? "featured" : ""}`} key={title}><span className="icon-box"><Icon /></span><h3>{withEdnaFont(title)}</h3><p>{withEdnaFont(copy)}</p>{index === 1 && <a href="#edna">Meet <EdnaName /> <ArrowRight size={15} /></a>}</article>)}
          </FeatureCarousel>
        </section>

        <section className="edna-section section-pad" id="edna">
          <div className="edna-copy reveal"><div className="edna-title"><EdnaMark /><div><span className="kicker">Your AI dining sidekick</span><h2>Meet <EdnaName />.</h2></div></div><p className="large-copy"><EdnaName /> remembers what you like, asks the right questions, and takes you from “I’m starving” to a table worth sitting at.</p><ul><li><Check />Suggests dishes you’ll love, around your taste and diet</li><li><Check />Answers questions about the actual menu, no guesswork</li><li><Check />Takes you straight to ordering or booking</li></ul></div>
          <div className="chat-card reveal"><div className="chat-head"><EdnaMark /><div><strong><EdnaName /></strong><span><i /> Online</span></div><button aria-label="More conversation options">•••</button></div><div className="chat-body"><div className="bubble user">I’m after a dairy-free dessert — something rich, not fruity.</div><div className="bubble edna">The dark chocolate tahini tart at Ember & Vine is marked dairy-free by the kitchen. Rich, toasty, and finished with sesame. Just what you asked for.</div><div className="dish-result"><div className="dish-art">🍫</div><div><strong>Chocolate tahini tart</strong><span>Ember & Vine · 0.8 mi</span><small><ShieldCheck /> Marked dairy-free by the kitchen</small></div></div><div className="bubble user short">Perfect. Can you book for two?</div><div className="typing"><i /><i /><i /></div></div><div className="chat-input"><span>Ask <EdnaName /> anything…</span><ArrowRight /></div></div>
        </section>

        <section className="group-section section-pad">
          <div className="section-heading centered reveal"><span className="kicker">Dinner together, minus the admin</span><h2>One table. <em>No awkward maths.</em></h2><p>One person books, everyone pays for their own plate. Nobody’s stuck splitting the bill.</p></div>
          <div className="group-flow reveal">
            <article><span className="step-num">01</span><span className="flow-icon"><CalendarCheck /></span><h3>You invite</h3><p>Pick the place, time, and party size, then send a private invite.</p></article><ArrowRight className="flow-arrow" />
            <article><span className="step-num">02</span><span className="flow-icon"><Users /></span><h3>Friends pick & pay</h3><p>Everyone chooses their own dishes and pays their share through a secure link.</p></article><ArrowRight className="flow-arrow" />
            <article><span className="step-num">03</span><span className="flow-icon"><CreditCard /></span><h3>Everyone turns up</h3><p>Nobody fronts the bill and nobody fiddles with receipts. Just turn up and enjoy.</p></article>
          </div>
        </section>

        <section className="cm-section" id="core-manager">
          <div className="section-heading centered reveal">
            <span className="kicker"><Server size={15} />For restaurant owners</span>
            <h2>Everything your restaurant<br /><em>needs, in one place.</em></h2>
            <p>Core Manager sits behind the app and looks after your menus, bookings, orders, and events, so you can spend more time with your guests.</p>
          </div>
          <div className="cm-group reveal">
            <h3 className="cm-subtitle"><Utensils aria-hidden="true" />For venues</h3>
            <FeatureCarousel label="Core Manager features for venues" slideClass="carousel-slide-quarters">
              {coreVenueGroups.map(([Icon, title, items]) => (
                <article className="cm-card" key={title}>
                  <span className="icon-box"><Icon /></span>
                  <h4>{title}</h4>
                  <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </FeatureCarousel>
          </div>
          <div className="cm-group reveal">
            <h3 className="cm-subtitle"><Search aria-hidden="true" />For diners</h3>
            <FeatureCarousel label="Core Manager features for diners" slideClass="carousel-slide-thirds">
              {coreDinerGroups.map(([Icon, title, items]) => (
                <article className="cm-card" key={title}>
                  <span className="icon-box"><Icon /></span>
                  <h4>{title}</h4>
                  <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </FeatureCarousel>
          </div>
        </section>

        <section className="how-section section-pad" id="how-it-works">
          <div className="section-heading reveal"><span className="kicker">How it works</span><h2>From craving to <em>confirmed.</em></h2></div>
          <ol className="how-list reveal"><li><span>1</span><div><strong>Tell us what you fancy</strong><p>Say what you’re craving, however you’d naturally put it.</p></div></li><li><span>2</span><div><strong>Narrow it down</strong><p>Filter by diet, allergy, or mood and see only real matches.</p></div></li><li><span>3</span><div><strong>Pick your way</strong><p>Book a table, start a group order, or pre-order ahead.</p></div></li><li><span>4</span><div><strong>Simply show up</strong><p>Or scan the QR at your table. Everything else is sorted.</p></div></li></ol>
        </section>

        <section className="showcase section-pad">
          <div className="section-heading centered reveal"><span className="kicker">The app, at a glance</span><h2>Dining, designed <em>around you.</em></h2><p>One calm place for every decision, from where to eat to what’s next.</p></div>
          <div className="screen-gallery reveal">
            {screens.map(({ name }) => <figure key={name}><PhoneMockup compact screen={name} /><figcaption>{withEdnaFont(name)}</figcaption>{/* TODO: Replace this mockup with the real screenshot file for this named screen. */}</figure>)}
          </div>
        </section>

        <section className="faq section-pad">
          <div className="section-heading reveal"><span className="kicker">Good to know</span><h2>Questions, <em>answered.</em></h2></div>
          <div className="faq-list reveal">
            {[
              ["Is edbl free to download?", "Yes. edbl is free to download and explore."],
              ["Which platforms is edbl available on?", "edbl is built for both iOS and Android devices."],
              ["How does Edna know about my allergies?", "Set your dietary and allergy preferences once in your Account. Edna uses those preferences to guide searches and recommendations."],
              ["How do group payments work?", "Each guest independently chooses their items and receives a secure payment link for their own share — the host never has to front the full bill."],
              ["How safe is my data?", "Your preferences are used to personalize your experience. Full details will be available in the edbl Privacy Policy."],
            ].map(([question, answer]) => <details key={question}><summary><span className="faq-question">{withEdnaFont(question)}</span><ChevronDown /></summary><p>{withEdnaFont(answer)}</p></details>)}
          </div>
        </section>

        <section className="download section-pad" id="download">
          <div className="download-inner reveal"><div><span className="kicker">Dinner’s waiting</span><h2>Less scrolling.<br />More <em>tasting.</em></h2><p>Find, book, and order your next favourite meal. Download edbl and let <EdnaName /> sort the details.</p><StoreBadges /></div><div className="download-phone" aria-hidden="true"><PhoneMockup /></div></div>
        </section>
      </main>

      <footer><div className="footer-brand"><a className="logo" href="#top"><BrandMark /><span>edbl</span></a><p>Good food, sorted.</p></div><div><strong>Product</strong><a href="#features">Features</a><a href="#core-manager">Core Manager</a><a href="#how-it-works">How it works</a><a href="#download">Download</a></div><div><strong>Company</strong>{/* TODO: Replace placeholder destinations when About and Contact pages exist. */}<a href="#top">About</a><a href="#top">Contact</a></div><div><strong>Legal</strong>{/* TODO: Replace placeholder destinations when legal pages exist. */}<a href="#top">Privacy Policy</a><a href="#top">Terms</a></div><p className="copyright">© edbl. All rights reserved.</p></footer>
    </div>
  );
}