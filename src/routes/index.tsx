import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  CircleHelp,
  CircleUserRound,
  CreditCard,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  Scale,
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

// Alternative home page following the brand & homepage messaging spec
// ("Food choice, reimagined."). The original home page stays at /.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "edbl - Food choice, reimagined" },
      {
        name: "description",
        content: "Discover meals and venues that better match your dietary needs, preferences and values. Know what's edbl." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "edbl - Food choice, reimagined" },
      { property: "og:description", content: "There’s more to choosing food than what’s on the menu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeAltPage,
});

const heroAttributes = ["Allergens", "Ingredients", "Nutrition", "Portion sizes", "Sustainability", "Accessibility"];

const beforeYouBite = [
  [Utensils, "What’s actually in your food?"],
  [Check, "Does it meet your dietary needs?"],
  [ShieldCheck, "Could it contain an allergen?"],
  [Leaf, "Does it fit your nutritional goals?"],
  [Scale, "Are you getting the portion you paid for?"],
  [Heart, "Does the restaurant share your sustainability values?"],
  [Accessibility, "Can you access and enjoy the venue comfortably?"],
] as const;

const foodFeatures = [
  [ShieldCheck, "Allergens, out in the open", "Filter by allergen or diet and see what each dish is marked as containing. When it matters, check with the venue before you order."],
  [Sparkles, "Ask Edna about the menu", "Edna answers questions about the actual menu and suggests dishes around your taste and diet."],
  [Leaf, "Nutrition, made comparable", "Compare dishes side by side on calories and nutrition, and keep a personal nutrition profile that travels with you across venues."],
  [Search, "Search like you talk", "Type it how you’d say it. ‘Something spicy for two’ or ‘gluten-free dinner near me’ — we’ll find places that fit."],
  [Heart, "Your needs, remembered", "Set your dietary preferences once. Your favourites, bookings and preferences follow you, so you don’t start from scratch at every venue."],
  [Wine, "Trending & curated discovery", "See what’s trending right now, browse wine lists with pairing detail, and catch venue promotions before they’re gone."],
] as const;

const placeFeatures = [
  [MapPin, "The venue, at a glance", "Opening hours, live availability, meal of the day and what each place offers, all on the venue page."],
  [MessageCircle, "Ask before you go", "Message the venue directly in the app to check access, ingredients or anything else that matters to you."],
  [CalendarCheck, "Book a table in a few taps", "See availability by time slot, and change your own booking within the venue’s policy."],
  [Utensils, "Order your way", "Pre-order ahead so it’s ready when you arrive, or scan the table QR code and order right from your seat."],
  [Users, "Dinner with friends, made easy", "One person books, every guest picks their own dishes and pays their own share through a private link."],
] as const;

function HomeAltPage() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="logo" href="#top" aria-label="edbl home"><BrandMark /><span>edbl</span></a>
        <nav aria-label="Main navigation">
          <a href="#food">Food</a><a href="#places">Places</a><a href="#edna"><EdnaName /></a><a href="#core-manager">Core Manager</a><a href="#how-it-works">How it works</a><a href="#download">Download</a>
        </nav>
        <div className="header-actions">
          <ThemeSwitch theme={theme} onChange={setTheme} />
          <a className="button button-small" href="#download">Get the app <ArrowRight size={16} /></a>
        </div>
      </header>

      <main id="top">
        <section className="hero hero-alt section-pad">
          <div className="hero-copy reveal">
            <div className="eyebrow"><Sparkles size={15} />Food choice, reimagined.</div>
            <p className="hero-tagline">Your food. Your needs. Your choice.</p>
            <h1>There’s more to choosing food than <em>what’s on the menu.</em></h1>
            <ul className="attribute-list" aria-label="What you can know more about">
              {heroAttributes.map((attribute) => <li key={attribute}>{attribute}</li>)}
            </ul>
            <p>You deserve to know everything about the food you're ordering more than what the marketing headlines tell you. You deserve to know if a restaurant is suitable for your dietary needs or allergen concerns. edbl helps you discover meals and venues that fit your needs, your preferences and your life — so you can make informed choices with greater confidence.</p>
            <div className="hero-actions"><a className="button" href="#download">Discover food that works for you <ArrowRight size={18} /></a><a className="button button-ghost" href="#why">Look beyond the menu</a></div>
            <span className="microcopy"><Check size={14} /> Less guesswork. More informed choices.</span>
          </div>
          <div className="hero-visual reveal" aria-hidden="true">
            <div className="hero-orbit orbit-one"><Leaf size={17} /> Nutrition at a glance</div>
            <div className="hero-orbit orbit-two"><ShieldCheck size={17} /> Allergen-aware</div>
            <PhoneMockup />
          </div>
        </section>

        <section className="trust-bar" aria-label="What edbl brings together">
          <div><ShieldCheck />Allergens & ingredients</div><div><Leaf />Nutrition & portions</div><div><MapPin />Venue details</div><div><CircleUserRound />Free on iPhone & Android</div>
        </section>

        <section className="section-pad" id="why">
          <div className="section-heading reveal"><span className="kicker">Look beyond the menu</span><h2>A menu tells you what’s available. <em>But does it tell you what you need to know?</em></h2><p>Ingredients, allergens, nutrition and portion sizes can all influence your decision. Make the information that matters part of the choice.</p></div>
          <div className="question-block reveal">
            <h3>Before you take a bite, shouldn’t you know a little more?</h3>
            <ul className="question-list">
              {beforeYouBite.map(([Icon, question]) => <li key={question}><Icon aria-hidden="true" />{question}</li>)}
            </ul>
            <p>These aren’t extras. They’re part of making the right choice. That’s why there’s edbl: helping people discover more, understand more and choose food and places with greater confidence.</p>
          </div>
        </section>

        <section className="section-pad" id="food">
          <div className="section-heading reveal"><span className="kicker">Food that fits you</span><h2>Your needs aren’t an afterthought. <em>Neither should the information be.</em></h2><p>Explore food with the details you care about, from ingredients and dietary suitability to nutritional information and portion expectations.</p></div>
          <FeatureCarousel className="reveal" label="Food discovery features" slideClass="carousel-slide-thirds">
            {foodFeatures.map(([Icon, title, copy], index) => <article className={`feature-card ${index === 1 ? "featured" : ""}`} key={title}><span className="icon-box"><Icon /></span><h3>{withEdnaFont(title)}</h3><p>{withEdnaFont(copy)}</p>{index === 1 && <a href="#edna">Meet <EdnaName /> <ArrowRight size={15} /></a>}</article>)}
          </FeatureCarousel>
          <div className="section-cta reveal"><a className="button button-ghost" href="#download">Find your kind of food <ArrowRight size={18} /></a></div>
        </section>

        <section className="cm-section" id="places">
          <div className="section-heading reveal"><span className="kicker">Places that welcome you</span><h2>It’s not just about <em>what’s on your plate.</em></h2><p>Discover useful information about venues, too — including accessibility, sustainability and the practical details that help you decide where to dine.</p></div>
          <FeatureCarousel className="reveal" label="Venue discovery features" slideClass="carousel-slide-thirds">
            {placeFeatures.map(([Icon, title, copy]) => <article className="cm-card" key={title}><span className="icon-box"><Icon /></span><h4>{title}</h4><p className="cm-card-copy">{copy}</p></article>)}
          </FeatureCarousel>
          <div className="section-cta reveal"><a className="button button-ghost" href="#download">Find your kind of place <ArrowRight size={18} /></a></div>
        </section>

        <section className="edna-section section-pad" id="edna">
          <div className="edna-copy reveal"><div className="edna-title"><EdnaMark /><div><span className="kicker">Your AI dining sidekick</span><h2>Meet <EdnaName />.</h2></div></div><p className="large-copy"><EdnaName /> remembers what you like, asks the right questions, and helps you find food and places that feel right for you.</p><ul><li><Check />Suggests dishes around your taste and diet</li><li><Check />Answers questions about the actual menu, no guesswork</li><li><Check />Takes you straight to ordering or booking</li></ul></div>
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

        <section className="how-section section-pad" id="how-it-works">
          <div className="section-heading reveal"><span className="kicker">How it works</span><h2>Less searching. Less second-guessing. <em>More confidence.</em></h2><p>Spend less time trying to piece together the information you need and more time discovering meals and places that feel right for you.</p></div>
          <ol className="how-list reveal"><li><span>1</span><div><strong>Tell us what matters</strong><p>Set your dietary needs and preferences once, in your account.</p></div></li><li><span>2</span><div><strong>Explore what matters to you</strong><p>Filter by allergen, diet or mood and see the details on each dish.</p></div></li><li><span>3</span><div><strong>Pick your place</strong><p>Book a table, start a group order, or pre-order ahead.</p></div></li><li><span>4</span><div><strong>Check, then enjoy</strong><p>Anything still to confirm? Message the venue. Then just show up.</p></div></li></ol>
        </section>

        <section className="statement section-pad">
          <div className="section-heading centered reveal"><span className="kicker">Know more and Choose better.</span><h2>More choice is good. <em>Better information is better.</em></h2><p>Fancy eating out or ordering in? You shouldn’t have to play guesswork with your food. Whether you’re avoiding allergens, following a particular diet, keeping an eye on your nutrition, looking for a generous portion, choosing more sustainable options or checking whether a venue meets your accessibility needs, the details matter.</p><p>edbl brings together useful information about meals and venues so you can explore options, understand what matters to you and find places that better match your needs. More transparency. More informed choices. More confidence in what you choose.</p></div>
        </section>

        <section className="cm-section" id="core-manager">
          <div className="section-heading centered reveal">
            <span className="kicker"><Server size={15} />For restaurant owners</span>
            <h2>Everything your restaurant<br /><em>needs, in one place.</em></h2>
            <p>Core Manager sits behind the app and looks after your menus, bookings, orders, and events, so you can share the details diners look for and spend more time with your guests.</p>
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

        <section className="showcase section-pad">
          <div className="section-heading centered reveal"><span className="kicker">The app, at a glance</span><h2>Food choice, <em>on your terms.</em></h2><p>One calm place for every decision, from what to eat to where to go.</p></div>
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
              ["Can edbl tell me a dish is safe for my allergy?", "edbl helps you find allergen and dietary information for dishes and venues, but it can’t guarantee a meal is safe for you. Information is supplied by venues, so if it matters, confirm the details with the venue before you order — you can message them directly in the app."],
              ["How does Edna know about my allergies?", "Set your dietary and allergy preferences once in your Account. Edna uses those preferences to guide searches and recommendations."],
              ["How do group payments work?", "Each guest independently chooses their items and receives a secure payment link for their own share — the host never has to front the full bill."],
              ["How safe is my data?", "Your preferences are used to personalize your experience. Full details will be available in the edbl Privacy Policy."],
            ].map(([question, answer]) => <details key={question}><summary><span className="faq-question">{withEdnaFont(question)}</span><ChevronDown /></summary><p>{withEdnaFont(answer)}</p></details>)}
          </div>
        </section>

        <section className="download section-pad" id="download">
          <div className="download-inner reveal"><div><span className="kicker">Make your next choice edbl</span><h2>Choose with confidence.<br /><em>Eat what’s edbl.</em></h2><p>More clarity. More confidence. More choice. Download edbl and discover food and places where you can eat safely, enjoy a satisfying meal, and derive the most culinary pleasure.</p><StoreBadges /></div><div className="download-phone" aria-hidden="true"><PhoneMockup /></div></div>
        </section>
      </main>

      <footer><div className="footer-brand"><a className="logo" href="#top"><BrandMark /><span>edbl</span></a><p>Know more. Choose better. Eat wha's edbl.</p></div><div><strong>Product</strong><a href="#food">Food</a><a href="#places">Places</a><a href="#core-manager">Core Manager</a><a href="#how-it-works">How it works</a><a href="#download">Download</a></div><div><strong>Company</strong>{/* TODO: Replace placeholder destinations when About and Contact pages exist. */}<a href="#top">About</a><a href="#top">Contact</a></div><div><strong>Legal</strong>{/* TODO: Replace placeholder destinations when legal pages exist. */}<a href="#top">Privacy Policy</a><a href="#top">Terms</a></div><p className="copyright">© edbl. All rights reserved.</p></footer>
    </div>
  );
}
