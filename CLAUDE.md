# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build (output: dist/)
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

No test suite is configured yet.

## Architecture

**Stack:** React 19 + Vite 8, React Router v7, Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed), no backend.

---

### Mobile app shell (`src/styles/globals.css`)

The app is designed as a mobile-first phone shell:
- `body` background is `#000`; `#root` is `display: flex; justify-content: center` — this centres the shell on desktop
- `.app-shell` (wraps the entire app in `App.jsx`): `max-width: 430px`, `min-height: 100vh`, `background: var(--bg)`, subtle purple box-shadow. On desktop this looks like a phone sitting on a black surface; on a real mobile device it goes full-screen
- All `input / select / textarea` are locked at `font-size: 16px` to prevent iOS zoom-on-focus
- `.no-scrollbar` utility class hides scrollbars on horizontally scrolling tab rows

---

### Routing & auth guard (`src/App.jsx`)

- **Public routes:** `/` (Landing), `/signup`
- **Protected routes:** `/dashboard`, `/rewards`, `/venues`, `/history`, `/profile`
- `RequireAuth` — redirects unauthenticated users to `/`
- `ProtectedLayout` — wraps every protected route with `<BottomNav />` and a `pb-[64px]` content spacer
- `Navbar.jsx` is **no longer used** — it still exists in the repo but is not imported anywhere

---

### Navigation (`src/components/BottomNav.jsx`)

Replaced the old top `Navbar`. Fixed bottom bar, 64px tall, `safe-area-inset-bottom`-aware for iPhone notch.

| Tab | Route |
|-----|-------|
| Card | `/dashboard` |
| History | `/history` |
| Venues | `/venues` |
| Rewards | `/rewards` |
| Profile | `/profile` |

Active tab colour: `var(--accent)`. Inactive: `var(--muted)`. Each tab has a custom inline SVG icon whose `strokeWidth` increases when active.

---

### Persistence (`src/lib/member.js`)

All state lives in `localStorage` — no API or database.

| Function | Key | Purpose |
|----------|-----|---------|
| `getMember()` / `saveMember()` / `clearMember()` / `updateMember()` | `pernod_member` | Member object |
| `getCompanions()` | `pernod_companions` | `{ [visitId]: [networkMemberId, ...] }` |
| `setVisitCompanions(visitId, memberIds)` | `pernod_companions` | Persist companion tags for one visit |
| `clearCompanions()` | `pernod_companions` | Clear all tags |

Companion data in `localStorage` **overrides** the `defaultCompanions` array hardcoded on each visit in `visits.js`. Always read via `getCompanions()` before falling back to `visit.defaultCompanions`.

---

### Data files (no network calls, fully hardcoded)

**`src/data/venues.js`** — 15 partner venues across Paris, Milan, Barcelona, Vienna, Lisbon. Fields: `id, name, city, address, hours, deal, mapsUrl`.

**`src/data/rewards.js`** — Tier definitions (Bronze 0–499, Silver 500–1499, Gold 1500+), `WELCOME_BONUS = 50`, helpers: `getTier(points)`, `getNextTier(points)`, `progressToNextTier(points)`.

**`src/data/visits.js`** — 15 synthetic visits spanning Mar–May 2025. Each visit:
```js
{
  id,            // 'V001' … 'V015'
  date,          // 'YYYY-MM-DD'
  venueName,
  city,
  drinks: [{ name, brand, category }],
  defaultCompanions: ['NM001', ...],  // overridden by localStorage
  pointsEarned,
}
```
Exports `VISIT_CITIES = ['All', 'Paris', 'Milan', 'Barcelona', 'Vienna', 'Lisbon']`.

**`src/data/networkMembers.js`** — 13 mock Pernod Network members (simulating a real member registry). Each:
```js
{ id, firstName, lastName, city, tier, memberId }
```
Exports:
- `TIER_COLORS` — `{ Bronze: '#C4843A', Silver: '#8C9FD4', Gold: '#C4A93A' }`
- `findMembers(query)` — searches by first name, last name, or member ID (case-insensitive substring match)

---

### Pages

**`Landing.jsx`** — Mobile-first splash: full-height hero, prominent CTA button, 2-column stats strip, stacked feature cards, footer.

**`SignUp.jsx`** — 4-step wizard: Personal → Location → Preferences → Verify ID. Step 4 simulates doc scanning (2 s timeout) and optional Face ID with a separate GDPR Art. 9 biometric consent checkbox. On completion writes member object to `localStorage` and redirects to `/dashboard`. The `verified` boolean controls the card badge.

**`Dashboard.jsx`** — Member card, Apple Wallet button (info modal only — no real `.pkpass`), verification nudge when `verified: false`, points + tier progress bar, quick-link grid to all 5 sections.

**`Rewards.jsx`** — Tier banner with progress bar, earn-points rules, all-tier perks list, locked redemption items.

**`Venues.jsx`** — City filter tabs, single-column venue card list, "My city" shortcut button.

**`History.jsx`** — Visit history page. Key behaviours:
- Shows **2 most recent visits** by default; a "See past visits (N more)" button expands to all
- `showAll` state resets to `false` when the city filter changes
- Visit cards show: date pill, venue + city badge, points earned, companion chips (`MemberChip`), drink chips
- **`MemberChip`** — renders a tagged network member with a tier-colour dot
- **`TagSheet`** — bottom drawer that opens when tapping `+ Tag friends` / `Edit` on a card. Searches `networkMembers` in real time, tap to select/deselect, saves to `localStorage` via `setVisitCompanions`
- **"Group activity" button** — purple accent card above the city filter tabs; shows crew count preview (`13 network members · Sofia, Luca +11`); navigates to `/profile?section=crew`

**`Profile.jsx`** — Initials avatar (from member name), member details table, **"Your crew" section** (built by `buildCrew()` — counts outings per network member across all visits using `getCompanions()` merged with `defaultCompanions`, sorted by frequency, shows name / city / tier / outing count). When arriving via `?section=crew` in the URL, the page auto-scrolls to the crew section using a `ref` + `scrollIntoView`. Sign-out clears localStorage and redirects to `/`.

---

### Brand tokens (`src/styles/globals.css`)

CSS custom properties — use via inline `style` props, **not** Tailwind colour utilities (Tailwind v4 doesn't resolve CSS vars at build time):

| Token | Value |
|-------|-------|
| `--bg` | `#0E0E10` |
| `--surface` | `#1A1A1E` |
| `--surface2` | `#24242A` |
| `--accent` | `#534AB7` |
| `--text` | `#F0F0F5` |
| `--muted` | `#8888A0` |
| `--border` | `#2E2E38` |

City colours (used in venue cards, visit date pills): Paris `#B08C5A`, Milan `#5A8CB0`, Barcelona `#B05A5A`, Vienna `#5AB08C`, Lisbon `#8C5AB0`.

---

### Apple Wallet

The "Add to Apple Wallet" button on `/dashboard` opens an info modal. Actual `.pkpass` generation requires an Apple Developer certificate + a backend signing service — neither exists yet.
