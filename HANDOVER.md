# Nightlight / Quarter — Context Handover Document
_Generated 2026-06-11_

## 1. Project Overview

**Nightlight** is a consumer loyalty app for bars/nightlife venues (currently scoped to **Paris only** for phase 1, with Milan/Barcelona/Amsterdam/Berlin planned for later phases). It's a prototype, not yet live with real users or venues.

Consumer-side features:
- Membership card with tier system (Bronze → Silver → Gold) based on points
- Venue directory with detail pages (photos, menu, offers, reviews) and an interactive map with geolocation ("bars near me")
- In-app group/table ordering: QR-based table join (camera-style scanner UI), shared menu/order, host flow
- "Crew" / companion network — visit history shows who you went out with, social FOMO loop on the dashboard
- Points/rewards: earn points per visit/drink, redeem for perks
- Bilingual: English + French, with a first-launch language picker and an in-app switcher

**Quarter** is the B2B side — a brand analytics dashboard (separate repo: `adityasurve-arch/QuarterXNightlight`, deployed via GitHub Pages at `adityasurve-arch.github.io/QuarterXNightlight/dashboard.html`). It visualizes the kind of consumer/transaction data Nightlight could surface to spirits brands (e.g., Absolut vs. Grey Goose preference shifts, cross-venue consumer behavior). This is also a prototype/dashboard only — not connected to live data.

Both projects are part of a larger student venture; not yet a registered company (avoid "Founder" title — frame as a project/initiative).

---

## 2. Current Tech Stack & Architecture

- **React 19 + Vite 8**, React Router v7
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — **no `tailwind.config.js`**
- **No backend** — all state in `localStorage`:
  - `nl_member` — member profile
  - `nl_companions` — crew/companion tags per visit
  - `nl_lang` — language preference (`en` | `fr`)
  - `nl_venue` — last-selected venue context for ordering
- **Theming**: CSS custom properties in `src/styles/globals.css` (`--bg`, `--surface`, `--accent`, `--text`, `--muted`, `--border`, plus newer tokens: `--accent-soft`, `--accent-glow`, `--accent-light`, `--amber*`, `--tier-bronze/silver/gold`, `--success`). **Must be used via inline `style` props**, not Tailwind color utilities (Tailwind v4 doesn't resolve CSS vars at build time).
- **i18n**: custom lightweight system at `src/lib/i18n.jsx` — `LanguageProvider` context + `useLang()` hook returning `{ lang, hasChosen, setLang, t }`. Dictionary-based (`STRINGS.en` / `STRINGS.fr`), no external library.
- **Maps**: Leaflet.js + dark CARTO tiles (`{s}.basemaps.cartocdn.com/dark_all/...`), no API key needed. Browser Geolocation API for "bars near me".
- **Images**: Unsplash URLs for venue photos (verified working, all return 200).
- **Mobile shell**: `.app-shell` max-width 430px, centered phone-style layout (`src/styles/globals.css`, `App.jsx`).
- **Animations**: shared keyframes/utilities in `globals.css` — `nl-slide-up`, `nl-pop`, `nl-glow`, `nl-shimmer`, `nl-pulse-dot`, `.nl-press`, `.nl-shimmer-text`.
- **Deployment**: Vercel auto-deploys on push to `main`. **Currently 2 commits ahead of `origin/main`, NOT pushed** (see Rules section).

> ⚠️ Note: `CLAUDE.md` in this repo is **stale** — it describes an older 5-tab nav, 15 venues across 5 cities, `pernod_member` localStorage keys, and a `Navbar.jsx`. None of that reflects current state. Worth regenerating `CLAUDE.md` at some point.

---

## 3. Latest Milestones (just completed)

1. **Paris-first overhaul**:
   - `src/data/venues.js` rewritten — 5 Paris venues only (Le Cercle, Brasserie Lumière, Maison Noire, Le Quartier Latin, Canal Social Club), each with real coordinates, address, hours, deal, rating, photos (5 Unsplash images each), menu/review data
   - `src/data/visits.js` and `networkMembers.js` relabeled to Paris-only venues/cities
   - `CITIES = ['Paris']`, `VISIT_CITIES = ['All', 'Paris']`
   - Removed Milan/Barcelona/Vienna/Lisbon references and the stats row (25K/5/15) from Landing

2. **Bottom nav restructured to 4 tabs**: Venues (now first/landing tab), Order, Card (`/dashboard`), Profile. History & Rewards moved into Profile as menu items.

3. **Venue detail pages** (`VenueDetail.jsx`, new): photo collage + full-screen gallery, ratings, info block, action chips (deal/directions/call), tabs for Offers/Menu/Reviews, sticky CTAs ("Get directions" / "Order here").

4. **Venue-aware ordering**: `GroupOrder.jsx` heavily reworked —
   - `VenueBanner` shows current venue with "Change" option
   - `VenuePickerScreen` ("Where are you?") with back button → `/venues`
   - Venue context flows via `?venue=` query param + `nl_venue` localStorage fallback
   - Camera-style QR join scanner (`JoinScreen`) with animated scan line
   - Removed 3 "Download Nightlight — free round" banners (these are meant for a future standalone web menu for QR-scanning non-members, not inside the app)

5. **Interactive map** (`VenueMap.jsx`, new): Leaflet + dark tiles, custom purple pin markers with venue popups, "Bars near me" geolocation button that finds nearest venue and shows a "Closest to you" card with distance.

6. **Full French i18n pass**: `src/lib/i18n.jsx` (new) with `en`/`fr` dictionaries covering landing, nav, profile, order, dashboard, venues, rewards, history. First-launch language picker on Landing + switcher in Profile. Locale-aware date formatting (`fr-FR` vs `en-GB`).

7. **Removed "parity" jargon** from venue deals — replaced with plain consumer language (e.g., "Absolut for the price of house vodka, all week").

8. **Design system pass**: new color tokens, shared animations, hero "Order with your table" CTA, crew-activity FOMO card on dashboard, locked-reward states with progress framing.

9. **Docs added**: `ARCHITECTURE.md` (technical architecture) and `UX_RETENTION_PLAYBOOK.md` (UX audit + retention mechanics + design system spec).

10. **Local commits made** (NOT pushed):
    - `8211a1b` — "Add architecture doc and UX/retention playbook"
    - `65ccc35` — "Paris-first overhaul: venue details, map, venue-aware ordering, French i18n"
    - Branch status: `main...origin/main [ahead 2]`

---

## 4. Current State of the Codebase / Known Issues

- **Build passes** (`✓ built in 138ms` last verified).
- **Bundle size warning**: Leaflet pushed some chunks over 500kB — code-splitting not yet addressed.
- **`CLAUDE.md` is outdated** (see Section 2 note) — describes old nav/data structure.
- **`Navbar.jsx`** still exists in repo but unused (was already true before this session, per stale CLAUDE.md — worth confirming/removing).
- **Apple Wallet button** is a non-functional info modal (no `.pkpass` generation — needs Apple Developer cert + signing backend).
- **Translation coverage**: UI chrome (nav, profile, order, dashboard, venues, rewards, history) is fully translated. NOT yet translated: venue data content itself (names/addresses/deals are stored in one language — likely fine since they're proper nouns/addresses, but menu items and reviews in `VenueDetail.jsx` are English-only), and the SignUp wizard.
- **Variable shadowing fixed**: `Rewards.jsx` had `TIERS.map(t => ...)` colliding with `t()` from `useLang()` — renamed to `tr`. No other similar issues known but worth a quick grep if adding new `.map()` calls near `useLang()`.
- **No backend/database** — menu data, visits, network members are all hardcoded JS files. User asked about MySQL for menu data — not yet implemented (deferred until a real bar partner is signed).

---

## 5. Immediate Next Steps (before this pause)

Nothing was explicitly queued. Possible next items mentioned in conversation but not started:
- Code-splitting the Leaflet bundle to fix the >500kB chunk warning
- Translating venue menu/review content and the SignUp wizard into French
- Building a standalone web menu page for QR-scanning non-members, including the "free round" download-conversion banner that was removed from the in-app flows
- Setting up a real backend (Supabase or similar) + menu schema (MySQL/Postgres) once a real bar is signed
- Deciding when to push the 2 local commits to `origin/main` (triggers Vercel deploy)
- Updating stale `CLAUDE.md` to reflect current architecture

---

## 6. Established Rules / Conventions

- **Do NOT push to Vercel / origin/main** without explicit user go-ahead. Current state: 2 local commits ahead of `origin/main`, intentionally unpushed. User said "don't push it to vercel yet" — wait for explicit instruction (e.g., "push it") before running `git push`.
- **Don't use Tailwind color utility classes for theme colors** — use inline `style={{ color: 'var(--accent)' }}` etc., since Tailwind v4 doesn't resolve CSS custom properties at build time.
- **Phase 1 = Paris only.** Don't reintroduce Milan/Barcelona/Vienna/Lisbon content until told to start phase 2.
- **No "Founder" title** in any CV/profile copy — project isn't a registered company; frame as "project" or "initiative".
- **Avoid jargon like "parity"** in consumer-facing copy — use plain language a normal consumer understands.
- **The "Download Nightlight" / free-round conversion banners belong on a future external web menu** for QR-scanning non-members — not inside the authenticated in-app flows.
- **i18n**: any new user-facing string must go into `src/lib/i18n.jsx`'s `STRINGS.en` and `STRINGS.fr`, accessed via `t('namespace.key')` — don't hardcode English strings in components.
- **Verify UI changes via preview** (screenshots) before declaring done — this caught the "39 nights to Gold" demotivation issue and the French translation gaps previously.
- **Local git commits are fine as checkpoints**; co-author trailer convention used: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`.
