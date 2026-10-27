import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  CalendarRange,
  CircleUserRound,
  CreditCard,
  Heart,
  MapPin,
  Megaphone,
  MessageCircle,
  Moon,
  Palette,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import darkLogo from "@/assets/edbl-logo-dark.png";
import lightLogo from "@/assets/edbl-logo-light.png";
import iosBadge from "@/assets/ios-badge.svg";
import googlePlayBadge from "@/assets/google-play-badge.png";
import pwaBadge from "@/assets/pwa-badge.png";

// Building blocks shared by the home page variants (/ and /home-alt).

export const screens = [
  { name: "Search", title: "What are you craving?", icon: Search },
  { name: "Venue detail", title: "The Green Room", icon: MapPin },
  { name: "Edna chat", title: "Ask Edna", icon: Sparkles },
  { name: "Group booking", title: "Friday dinner", icon: Users },
  { name: "Order tracking", title: "Being prepared", icon: Utensils },
];

export const coreVenueGroups = [
  [Sparkles, "Menus that come together fast", [
    "Import a whole menu from a file instead of typing it in by hand",
    "AI dish analysis suggests allergens and estimates nutrition, with staff review before anything goes live",
    "Dish photo galleries and a meal of the day you can manage",
  ]],
  [CalendarCheck, "Bookings, sorted", [
    "Seat, move, resize, or cancel bookings quickly, even on a slammed Friday.",
    "Set your own booking policies, opening hours and capacity",
    "Bulk import guest lists",
    "Automatic booking confirmations and notification emails",
  ]],
  [CreditCard, "Orders and payments, simplified", [
    "Follow every pre-order and live order, step by step.",
    "Pre-orders convert to orders automatically on the day",
    "Take payments and handle refunds without the faff.",
    "Payments go into the venue’s own Stripe account",
  ]],
  [CalendarRange, "Events and tickets", [
    "Create free or paid events and manage attendees",
    "Check guests in at the door with a quick QR scan.",
    "Send emails to attendees",
  ]],
  [Megaphone, "Promotions and marketing", [
    "Promotions and special offers with images, terms and linked menu items",
    "Track how often each promo code is used",
    "Bulk-generate QR codes from printable templates and see how many scans each one gets",
  ]],
  [BarChart3, "Analytics and insight", [
    "Revenue overview, sales by category and top-performing items",
    "Customer traffic, including busiest hours",
    "Search demand that shows what diners are looking for, with an allergen breakdown",
    "How promotions and events perform",
    "Forecasts and target setting",
  ]],
  [Palette, "Your brand", [
    "Upload a logo and cover image and choose a theme for your venue page",
    "An open/closed status toggle for your venue",
  ]],
  [ShieldCheck, "Team and security", [
    "Invite staff and give each person a role with its own permissions",
    "Audit logs and user activity tracking",
    "Built-in monitoring, plus account deletion and data management tools that support GDPR requests",
  ]],
] as const;

export const coreDinerGroups = [
  [Search, "Find your perfect plate", [
    "Search venues and menus with filters for allergens, dietary preferences, price range, category, availability and special features",
    "Allergen and nutrition information on every dish",
    "Trending dishes, meal of the day, promotions and special offers at each venue",
  ]],
  [CalendarCheck, "Book a table in a few taps", [
    "Live availability by time slot — available, limited or fully booked",
    "Change your own booking: reschedule, change party size or request a cancellation within the venue’s policy",
    "Book events and get a QR code ticket for check-in",
  ]],
  [Users, "Dinner with friends, made easy", [
    "Group bookings with deposits",
    "Each guest pre-orders their own meal and pays their own share through a personal payment link",
    "Automatic reminder emails before the booking date",
  ]],
  [QrCode, "Scan, order, pay", [
    "Table and venue QR codes open the menu straight away",
    "Secure card payments through Stripe for deposits, orders, events and guest shares",
  ]],
  [MessageCircle, "Talk to the venue", [
    "Message the restaurant directly in the app",
  ]],
] as const;

export function EdnaName() {
  return <span className="edna-name">Edna</span>;
}

export function withEdnaFont(text: string | undefined) {
  if (!text) return null;
  const parts = text.split("Edna");
  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <EdnaName /> : null}
    </span>
  ));
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img className="brand-mark-light" src={lightLogo} alt="" />
      <img className="brand-mark-dark" src={darkLogo} alt="" />
    </span>
  );
}

export type Theme = "light" | "dark";

export function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      <Button type="button" variant="ghost" size="sm" aria-pressed={theme === "light"} onClick={() => onChange("light")}>
        <Sun aria-hidden="true" /> <span>Light</span>
      </Button>
      <Button type="button" variant="ghost" size="sm" aria-pressed={theme === "dark"} onClick={() => onChange("dark")}>
        <Moon aria-hidden="true" /> <span>Dark</span>
      </Button>
    </div>
  );
}

export function EdnaMark() {
  return (
    // TODO: Replace this placeholder with the real /edna-logo.png asset.
    <span className="edna-mark" aria-hidden="true"><Sparkles size={30} strokeWidth={2.2} /></span>
  );
}

export function StoreBadges() {
  return (
    <div className="store-badges" aria-label="Download options">
      {/* TODO: Replace # with the live edbl App Store URL for app.edbl.xperience. */}
      <a className="store-badge-img" href="#" aria-label="Download edbl on the App Store">
        <img src={iosBadge} alt="Download on the App Store" width="135" height="45" loading="lazy" />
      </a>
      {/* TODO: Replace # with the live edbl Google Play URL for app.edbl.xperience. */}
      <a className="store-badge-img" href="#" aria-label="Get edbl on Google Play">
        <img src={googlePlayBadge} alt="Get it on Google Play" width="135" height="52" loading="lazy" />
      </a>
      {/* PWA / web app launch option — launches the in-browser experience. */}
      <a className="store-badge-img" href="#" aria-label="Launch edbl as a web app">
        <img src={pwaBadge} alt="Launch as Web App" width="135" height="40" loading="lazy" />
      </a>
    </div>
  );
}

export function PhoneMockup({ compact = false, screen = "search" }: { compact?: boolean; screen?: string }) {
  return (
    // TODO: Replace this placeholder UI with the matching real app screenshot inside the device frame.
    <div className={`phone ${compact ? "phone-compact" : ""}`} aria-label={`${screen} app screen preview`}>
      <div className="phone-speaker" />
      <div className="phone-top"><span>9:41</span><span>● ●</span></div>
      <div className="phone-brand"><BrandMark /><span>edbl</span><CircleUserRound size={18} /></div>
      {screen === "Search" || screen === "search" ? (
        <>
          <div className="phone-copy"><span>Good evening</span><strong>What sounds good?</strong></div>
          <div className="fake-search"><Search size={15} /><span>Try “spicy noodles nearby”</span></div>
          <div className="filter-row"><span>Near me</span><span>Open now</span><span>Diet</span></div>
          <div className="food-image"><span>Trending near you</span><strong>Charred miso aubergine</strong><small>4.8 · 12 min away</small></div>
          <div className="mini-list"><span className="mini-thumb" /><span><strong>Ember & Vine</strong><small>Modern British · ££</small></span><Heart size={16} /></div>
        </>
      ) : (
        <>
          <div className="phone-copy"><span>{withEdnaFont(screen)}</span><strong>{withEdnaFont(screens.find((item) => item.name === screen)?.title ?? "")}</strong></div>
          <div className="screen-visual"><span className="screen-icon">{screen === "Edna chat" ? <Sparkles /> : screen === "Group booking" ? <Users /> : screen === "Order tracking" ? <Utensils /> : <MapPin />}</span></div>
          <div className="screen-lines"><i /><i /><i /></div>
          <div className="screen-card"><span /><div><b /> <i /></div></div>
        </>
      )}
      <div className="phone-tabs"><Search size={15} /><Heart size={15} /><CalendarCheck size={15} /><CircleUserRound size={15} /></div>
    </div>
  );
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("edbl-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("edbl-theme", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
