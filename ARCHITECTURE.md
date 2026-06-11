# Nightlight — Technical Architecture Document

## 1. Project Details

**App name:** Nightlight
**Primary purpose:** A mobile-first loyalty app for nightlife/bar-goers in European student cities (Paris, Milan, Barcelona, Vienna, Lisbon). Members earn points and tier status (Bronze/Silver/Gold) by visiting partner venues, unlock rewards, track visit history, and now place group orders directly from their table.

**Target users:** University/MiM students aged 18-25 in major European cities, who frequent bars and nightlife venues and want a digital loyalty card plus social features (friend tagging, group ordering).

**Core features (current):**
1. **Digital membership card** — tier-based (Bronze/Silver/Gold), QR/ID-based identity
2. **Rewards & points system** — points accumulate per visit, unlock tier perks
3. **Venue directory** — browse partner bars by city, see deals
4. **Visit history & companion tagging** — past visits, who you went with
5. **Group ordering** — start/join a shared table cart, order drinks individually, one ticket to the bar, QR pickup, "free round" conversion nudge for non-members

---

## 2. Technical Architecture

### Folder Structure

```
consumer-app/
├── src/
│   ├── App.jsx                  # Router + route guards + layout shell
│   ├── main.jsx                 # React root mount
│   ├── App.css / index.css      # Global styles
│   ├── styles/
│   │   └── globals.css          # CSS custom properties (theme tokens)
│   ├── assets/                  # Images (hero.png, svg icons)
│   ├── lib/
│   │   └── member.js            # localStorage data layer (member, companions)
│   ├── data/                    # Static "seed" datasets (no backend)
│   │   ├── menu.js               # Drink menu (categories, items, brands, prices)
│   │   ├── venues.js             # Partner venue directory + cities
│   │   ├── rewards.js            # Tier definitions, perks, welcome bonus
│   │   ├── visits.js             # Simulated visit history
│   │   └── networkMembers.js     # Demo "friends"/companions
│   ├── components/               # Reusable UI components
│   │   ├── BottomNav.jsx
│   │   ├── Navbar.jsx
│   │   ├── MemberCard.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── TierBadge.jsx
│   │   └── VenueCard.jsx
│   └── pages/                    # Route-level screens
│       ├── Landing.jsx
│       ├── SignUp.jsx
│       ├── Dashboard.jsx
│       ├── Rewards.jsx
│       ├── Venues.jsx
│       ├── History.jsx
│       ├── Profile.jsx
│       └── GroupOrder.jsx        # Largest file (1077 lines) — multi-step group ordering flow
├── index.html
├── vite.config.js
└── package.json
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│                                                           │
│  ┌─────────────┐    ┌──────────────────────────────┐    │
│  │ BrowserRouter│───▶│         App.jsx              │    │
│  └─────────────┘    │  - RequireAuth (guard)        │    │
│                      │  - ProtectedLayout (BottomNav)│    │
│                      └───────────┬────────────────────┘  │
│                                   │                       │
│           ┌───────────────────────┼───────────────────┐  │
│           ▼                       ▼                   ▼  │
│      Public routes          Protected routes      404 →/ │
│      ┌─────────┐    ┌────────────────────────────────┐   │
│      │ Landing │    │ Dashboard │ Rewards │ Venues    │   │
│      │ SignUp  │    │ History │ Profile │ GroupOrder  │   │
│      └─────────┘    └────────────────────────────────┘   │
│                                   │                       │
│                                   ▼                       │
│                      ┌─────────────────────────┐         │
│                      │   src/lib/member.js      │         │
│                      │   (data access layer)    │         │
│                      └────────────┬──────────────┘        │
│                                   ▼                       │
│                      ┌─────────────────────────┐         │
│                      │     localStorage          │         │
│                      │  - nl_member               │         │
│                      │  - nl_companions            │         │
│                      └─────────────────────────┘         │
│                                                           │
│      ┌─────────────────────────────────────────┐        │
│      │  Static data modules (src/data/*.js)      │        │
│      │  MENU, VENUES, TIERS, VISITS, NETWORK     │        │
│      │  → imported directly into components      │        │
│      └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘

No network calls. No backend. Build → static bundle → Vercel CDN.
```

### Frameworks / Libraries

| Layer | Tech | Version |
|---|---|---|
| UI framework | React | 19.2.6 |
| Bundler/dev server | Vite | 8.0.13 |
| Routing | React Router (DOM) | 7.15.1 |
| Styling | Tailwind CSS (via @tailwindcss/vite plugin) | 4.3.0 |
| Linting | ESLint + react-hooks/react-refresh plugins | 10.x |
| Type checking | None (plain JS/JSX, @types packages present but unused — no `.ts`/`.tsx` files) | — |

### State Management

- **No global state library** (no Redux/Zustand/Context for app-wide state)
- **Local component state** via `useState`/`useEffect` in each page
- **Persistence layer**: `src/lib/member.js` wraps `localStorage` with two keys:
  - `nl_member` — the signed-in member object (profile, points, tier, ID)
  - `nl_companions` — map of `visitId → [companion member IDs]`
- Pages call `getMember()` on mount and `saveMember()`/`updateMember()` to persist changes — this is effectively a synchronous "local database" pattern
- `RequireAuth` wrapper in `App.jsx` checks `getMember()` to gate protected routes (acts as a poor-man's auth context)

### Component Hierarchy

```
App
├── BrowserRouter
│   ├── Landing (public, "/")
│   ├── SignUp (public, "/signup")
│   └── RequireAuth → ProtectedLayout
│       ├── Dashboard ("/dashboard")
│       │   ├── MemberCard
│       │   ├── ProgressBar
│       │   └── TierBadge
│       ├── Rewards ("/rewards")
│       │   └── TierBadge (per tier)
│       ├── Venues ("/venues")
│       │   └── VenueCard (per venue)
│       ├── History ("/history")
│       │   └── (visit list items, companion chips)
│       ├── Profile ("/profile")
│       │   └── MemberCard
│       ├── GroupOrder ("/order")
│       │   ├── HomeScreen
│       │   ├── JoinScreen (camera scanner UI)
│       │   ├── HostQRScreen
│       │   ├── MenuScreen
│       │   ├── CartScreen
│       │   └── OrderPlacedScreen (+ free-round banner)
│       └── BottomNav (persistent across all protected pages)
```

### External APIs / Services

**None currently integrated.** The app is fully self-contained:
- No backend API
- No payment processor
- No auth provider
- No analytics SDK
- `mapsUrl` fields in `venues.js` are plain links to Google Maps (opened externally, not an API integration)

---

## 3. Type System & Data

There is **no formal type system** — this is plain JavaScript/JSX (despite `@types/react` being present as a dev dependency, likely just for editor IntelliSense). Below are the **de facto shapes** of the core data objects as used throughout the code.

### Member object (`localStorage: nl_member`)

```js
{
  firstName: string,
  lastName: string,
  email: string,
  city: string,            // 'Paris' | 'Milan' | 'Barcelona' | 'Vienna' | 'Lisbon'
  memberId: string,        // format: "NL-XXXX-XXXX"
  points: number,
  tier: 'Bronze' | 'Silver' | 'Gold',
  verified: boolean,
  signupDate: string,      // ISO date
  faceId: boolean,
  dob?: string,
  gender?: string,
  university?: string,
  referral?: string,
  emailOptIn?: boolean,
  smsOptIn?: boolean,
  phone?: string,
}
```

### Companions map (`localStorage: nl_companions`)

```js
{
  [visitId: string]: string[]   // array of network member IDs
}
```

### Menu item (`src/data/menu.js`)

```js
{
  category: string,    // 'Vodka' | 'Gin' | 'Cocktails' | 'Beer' | ...
  emoji: string,
  items: [
    {
      id: string,        // e.g. 'v1'
      name: string,
      description: string,
      price: number,     // EUR
      brand: string,     // brand name used for Quarter analytics mapping
    }
  ]
}
```

### Venue (`src/data/venues.js`)

```js
{
  id: string,           // e.g. 'par-01'
  name: string,
  city: string,
  address: string,
  hours: string,
  deal: string,         // current promo text
  mapsUrl: string,
}
```

### Tier (`src/data/rewards.js`)

```js
{
  name: 'Bronze' | 'Silver' | 'Gold',
  min: number,           // points threshold
  max: number,
  color: string,         // hex
  bgClass: string,       // tailwind class
  icon: string,          // emoji
  perks: string[],
}
```

### Visit (`src/data/visits.js`)

Array of simulated past visits — shape includes venue reference, date, points earned, drinks ordered (used to populate History page).

### Network member / companion (`src/data/networkMembers.js`)

```js
{
  id: string,       // 'NL-XXXX-X'
  name: string,
  initials: string,
  tier: 'Bronze' | 'Silver' | 'Gold',
}
```

### Data Flow

```
Static seed data (src/data/*.js)
        │
        ▼
Page component reads on mount (import + useState)
        │
        ▼
User interaction (e.g. place order, sign up)
        │
        ▼
lib/member.js writes to localStorage (nl_member / nl_companions)
        │
        ▼
Next page read re-hydrates state from localStorage via getMember()
```

There is **no server round-trip anywhere**. Every "transaction" (group order, sign-up, points update) is simulated client-side and persisted only to the browser's localStorage — meaning data does not sync across devices and is wiped if the user clears site data.

---

## 4. Current Patterns

### Design Patterns
- **Route guard pattern** — `RequireAuth` HOC-style wrapper checks for a member in localStorage before rendering protected pages
- **Layout wrapper pattern** — `ProtectedLayout` wraps all authenticated pages with consistent padding + `BottomNav`
- **Local data-access-object pattern** — `lib/member.js` centralizes all localStorage reads/writes (get/save/update/clear)
- **Multi-step wizard pattern** — `SignUp.jsx` (4 steps) and `GroupOrder.jsx` (6+ screens) both use a `step` state variable with conditional screen rendering — no router sub-routes for these flows
- **Inline component generation** — small presentational helpers (e.g. `QRCode`, `JoinScreen`) defined as local functions within the same file rather than separate component files

### Component Structure
- Function components only, using hooks (`useState`, `useEffect`)
- Pages are large, monolithic files containing multiple "screen" sub-components defined in the same file (especially `GroupOrder.jsx` at 1077 lines and `SignUp.jsx` at 544 lines)
- Shared/reusable visual elements (cards, badges, progress bars) are extracted to `src/components/`

### Styling Approach
- **Inline style objects** (`style={{ ... }}`) are the dominant pattern for layout, colors, and spacing — used heavily for dynamic/conditional styling
- **CSS custom properties** defined in `src/styles/globals.css` for theme tokens (colors, spacing) — referenced via `var(--bg)`, `var(--accent)`, `var(--text)`, `var(--muted)`, `var(--border)`, `var(--surface)`
- **Tailwind CSS v4** present (via `@tailwindcss/vite`, no `tailwind.config.js` needed in v4) — used for some utility classes (`bgClass` in tier definitions) but inline styles dominate for the custom dark theme
- **Inline `<style>` tags with `@keyframes`** for animations (e.g. scan line, pulse, slide-up) — embedded directly in component JSX rather than a shared stylesheet
- Mobile-first phone-shell layout (max-width ~430px container)

### Error Handling
- Minimal — try/catch only around `localStorage` JSON parsing in `lib/member.js` (returns `null`/`{}` on failure)
- Form validation in `SignUp.jsx` via an `errors` state object, checked before step transitions
- No error boundaries, no global error handler, no user-facing error states for data failures (since there's no network layer to fail)

---

## 5. Performance & Optimization

### Current Bundle Size (measured via `vite build`)

```
dist/index.html                   1.16 kB │ gzip:  0.58 kB
dist/assets/index-*.css          19.61 kB │ gzip:  4.78 kB
dist/assets/index-*.js          326.46 kB │ gzip: 95.08 kB
```

**Total gzipped: ~100 kB** — small and fast for a mobile web app, well within acceptable range for 4G load times.

### Bottlenecks / Observations
- **No code splitting** — all routes/pages bundle into a single JS chunk (43 modules → one file). Not yet a problem at 95 kB gzipped, but `GroupOrder.jsx` (1077 lines) is the largest contributor and will only grow
- **Inline `<style>` + `@keyframes` per component** — re-injects style tags on every render of `JoinScreen`/`OrderPlacedScreen`; harmless at this scale but not reusable
- **No image optimization pipeline** — `hero.png` is bundled as-is; no responsive/format variants
- **No memoization** (`useMemo`/`useCallback`) anywhere — fine given component sizes, but `GroupOrder.jsx`'s cart calculations re-run on every render

### Optimizations Already in Place
- Vite's native ESM dev server + Rollup production build (tree-shaking, minification)
- Small dependency footprint (only 3 runtime deps: react, react-dom, react-router-dom)
- CSS is shipped as a single 19.6 kB file, gzipped to 4.78 kB

### Recommended Further Optimizations
1. **Route-based code splitting** via `React.lazy()` + `Suspense` — especially for `GroupOrder` and `History`, the two largest pages
2. **Extract animation keyframes** to `globals.css` instead of inline `<style>` tags per component
3. **Split `GroupOrder.jsx`** into separate files per screen (`HomeScreen.jsx`, `JoinScreen.jsx`, `CartScreen.jsx`, etc.) — 1077 lines in one file will become unmaintainable
4. **Extract repeated inline style objects** into shared style constants or Tailwind utility classes to reduce duplication and bundle size
5. **Image optimization** — convert `hero.png` to WebP/AVIF with `<picture>` fallback

---

## 6. Testing & Quality

- **No test suite present** — no `*.test.js`, no Jest/Vitest/Testing Library config
- **Type safety**: none — pure JavaScript, no TypeScript, no PropTypes, no runtime schema validation (e.g. Zod)
- **Code quality tooling**: ESLint configured (`eslint.config.js` implied by `"lint"` script) with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` — catches hook rule violations and Fast Refresh issues
- **Manual QA only** — no CI pipeline visible beyond Vercel's build-on-push

---

## 7. Tech Stack Summary

| Category | Choice |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + inline styles + CSS custom properties |
| State | Local component state + localStorage (no global store) |
| Backend | None |
| Database | None (localStorage only) |
| Auth | None (presence of `nl_member` in localStorage = "logged in") |
| Payments | None |
| Testing | None |
| Type checking | None |
| Deployment | Vercel (auto-deploy on push to `main`) |
| Bundle size (gzip) | ~100 kB total |

---

## 8. Recommended Improvements (Prioritized)

### Before adding more features
1. **Split `GroupOrder.jsx`** (1077 lines) into per-screen files — it's becoming the hardest file to maintain and will keep growing as ordering features expand
2. **Introduce a lightweight global state** (React Context for the member/session) to avoid every page independently calling `getMember()`/re-reading localStorage

### Before going from prototype to real product
3. **Replace localStorage with Supabase** — real accounts, cross-device sync, and critically: this is what turns simulated "data" into the real behavioral dataset Quarter is built to sell
4. **Add Stripe for payments** in the GroupOrder cart/checkout flow
5. **Add Supabase Realtime** for the live group cart (multiple phones updating one shared cart)
6. **Add a route guard context** — replace the `getMember()`-on-every-render pattern in `RequireAuth` with a proper auth context that updates reactively

### Code quality
7. **Add basic tests** — at minimum, unit tests for `lib/member.js` (the core data layer) and the tier-calculation logic in `rewards.js`
8. **Consider TypeScript** — given the growing complexity of `GroupOrder.jsx`'s state machine (steps, cart, table members), type safety would catch real bugs (e.g. mismatched member ID shapes between `networkMembers.js` and `member.js`)
9. **Extract shared inline styles** into a small style-constants module or convert to Tailwind utilities consistently — current mix of both makes the styling approach inconsistent

### Performance (low priority at current scale)
10. **Lazy-load `GroupOrder` and `History`** routes via `React.lazy()` once bundle size grows past ~150 kB gzipped
