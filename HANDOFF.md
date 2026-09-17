# Quarter — Build Handoff (for Emergent)

**Goal for this project:** Rebuild **Quarter** as a *social place-discovery app* — "your city, by the people you trust." The existing codebase in this repo is the **reference and starting point**; the target experience is the discovery app described below (feed · map · ask · profile), inspired by apps like Corner/BOM but with its own identity.

---

## 0. Links & context

- **This repo (starting point):** `github.com/adityasurve-arch/nightlightappeurope`
- **Live current app (Vercel):** https://nightlightappeurope.vercel.app
- **Interactive design concept to build toward:** https://claude.ai/code/artifact/8dec0f41-3a6a-4e1f-9120-be067e6ad38a
  *(clickable prototype of the 4 target screens + the day / "blue hour" theme — treat this as the visual/UX spec)*

The current app is a nightlife **membership + QR-ordering** app ("Quarter"). Reuse its brand, data, and components, but the product direction is now **discovery-first**.

---

## 1. What to build — the 4 core surfaces

A mobile-first web app (phone-shell layout, ~390px, breaks out to desktop). Bottom floating nav switches between:

1. **Feed** — "for you / friends" tabs. Your friends' saves are the algorithm.
   - Invite card ("your friends are the algorithm")
   - "What you missed" stream: friend posts with a place card (name · category · neighbourhood · price), photo, save/like/comment/share, and a "favourite / want to try" chip
   - Curated **list** cards ("Rooftops for blue hour — 6 places")

2. **Map** — a **real, interactive map** (this is the priority — see §3).
   - Pins for places, a bottom **sheet** for the selected place with social proof ("3 friends want to try")
   - Category chip rail (top picks · eat · cafés · bars · nightlife · shops · stays)
   - "Friends / everyone" filter + "open now" toggle + recenter + "near me"

3. **Ask** — AI "ask the city" search.
   - Prompt chips ("natural wine, no reservation", "rooftops for blue hour", "a perfect Saturday in the 11th")
   - "Ask for anything" input + voice affordance
   - Ranked answer card ("from your circle") explaining *why* each result ("Jake & Noor both saved this")
   - **Requires an LLM backend** to be real — see §5.

4. **Profile ("You")** — lists, imports, stats.
   - Import cards: **Instagram/TikTok saves, Google Maps lists, Notes/text** → parse into places
   - City filter (Paris / Mumbai), stat tiles (places / to try / loved / lists), streak
   - Grid of the user's lists

---

## 2. Design system (from the concept artifact)

- **Concept:** "Quarter" = *le quartier* (a neighbourhood). Premium editorial city-guide meets social app.
- **Palette (day):** warm ivory paper `#F4F0E7`, espresso ink `#19150F`, **signal** spritz-orange `#F0472A` (CTAs / active / pins), evening-blue `#1B2942` (secondary surfaces), sage `#DCE8C6` (friend-loved highlights), warm grey `#8C867A`.
- **Palette (blue hour / dark):** ground `#0F131C`, card `#181D2A`, ink `#F2EEE4`, signal `#FF5C3C`. **Both themes are first-class** — a going-out app lives at dusk. Toggle stamps `data-theme` on root; also honour `prefers-color-scheme`.
- **Type:** heavy grotesque display (system stack, tight tracking) + a **monospace utility face** for prices/neighbourhoods/data (gives the "listing" texture).
- **System:** 8px spacing scale, radii — cards 20–22px, pills 999px, buttons 14–16px, sheet 24px. Restrained drawn glyphs, not emoji-as-icons.

---

## 3. The map (highest-priority feature)

The concept's map is stylised because its sandbox blocks map tiles; **in the real app use a real map.** The current repo already has this working:

- **Library:** `leaflet` (^1.9.4) with **OpenStreetMap / CARTO dark tiles** (no API key needed). See `src/components/VenueMap.jsx`.
- Currently shows **5 Paris bars** with real lat/lng (`src/data/venues.js`), amber cocktail pins, popups, "bars near me" geolocation, nearest-venue logic.
- **For discovery:** promote the map to its own primary **Map tab**, add the bottom sheet + category chips from the concept, and expand pins as more places are added. If richer maps are wanted later, swap tiles for **Mapbox or Google Maps** (needs an API key in env).

---

## 4. Tech stack & architecture (current)

- **React 19 + Vite 8**, **React Router v7**, **Tailwind CSS v4** (`@tailwindcss/vite`, no config file). CSS custom properties for theming (Tailwind v4 doesn't resolve CSS vars — use inline `style` with `var(--token)`).
- **Leaflet** for maps. **Chart.js** for the B2B "Quarter" brand dashboard (`/quarter`).
- **No backend right now** — it's a public demo: auth is faked via `localStorage` (`src/lib/member.js`), and `RequireAuth` in `src/App.jsx` auto-provisions a demo member so every route is explorable. Deployed on **Vercel** (`vercel.json` rewrites all routes → `index.html`).
- **Routes:** `/` landing, `/signup`, `/login`, and protected `/dashboard` (card), `/venues` (+ map), `/order`, `/rewards`, `/history`, `/profile`, `/venues/:id`, `/events/:id`, `/quarter` (brand dashboard).
- Key components: `BottomNav`, `MemberCard`, `VenueCard`, `VenueMap`; i18n (EN/FR) in `src/lib/i18n.jsx`.

---

## 5. What's done vs. roadmap

**Done (reusable):**
- Rebrand Nightlight → Quarter (all user-facing copy, EN + FR)
- QR-scan order flow (scan venue → start/join table or go solo → menu → cart → payment method → pickup QR) in `src/pages/GroupOrder.jsx`
- Real Leaflet map with 5 Paris bars
- Backend-free demo + Vercel deploy

**To build for the discovery app:**
1. The 4 discovery screens above, matching the concept's design system
2. Real **Map tab** as a primary surface (bottom sheet + category chips)
3. **Ask** — wire to an LLM (e.g. an API route) so "ask the city" returns ranked, explained results from the place set + friends' saves
4. **Social layer** — friends, follows, feed, saves/lists shared between users → needs a **real backend + DB** (Postgres/Supabase). The repo has stale Supabase stubs that were removed for the demo; re-introduce properly.
5. **Imports** — parse Instagram/TikTok saves, Google Maps lists, and pasted notes into places
6. Auth (email + Google), user profiles

---

## 6. Constraints / non-negotiables

- **Mobile-first**, phone-shell UI; must work at ~390px and scale up.
- **EU / GDPR** — Paris-first audience; explicit consent for any data sharing, minimal data in URLs, "decline non-essential" defaults.
- Keep **day + blue-hour theming** and the editorial identity — don't flatten it into a generic template.
- Keep it **lightweight** — don't over-load screens (e.g. the map shows a focused set of places, not everything).

---

*Owner: Aditya Surve (@aditya_s). This file is the canonical build brief — an older `HANDOVER.md` in the repo, if present, is superseded by this.*
