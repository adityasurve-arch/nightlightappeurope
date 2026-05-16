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

**Persistence:** All member state lives in `localStorage` via `src/lib/member.js` (`getMember`, `saveMember`, `clearMember`, `updateMember`). There is no API or database.

**Routing & auth guard** (`src/App.jsx`): Public routes are `/` and `/signup`. The `RequireAuth` component redirects unauthenticated users to `/`. Protected routes (`/dashboard`, `/rewards`, `/venues`) render inside `ProtectedLayout` which includes `Navbar`.

**Sign-up flow** (`src/pages/SignUp.jsx`): 4-step wizard (Personal → Location → Preferences → Verify ID). Step 4 simulates document scanning (2 s timeout) and optional Face ID with a separate biometric consent checkbox (GDPR Art. 9 requirement). On completion, a member object is written to localStorage and the user is redirected to `/dashboard`. The `verified` boolean on the member object controls the card badge.

**Data files** (no network calls, fully hardcoded):
- `src/data/venues.js` — 15 venues across 5 cities (Paris, Milan, Barcelona, Vienna, Lisbon) with deal text, hours, and Google Maps URLs.
- `src/data/rewards.js` — tier definitions (Bronze/Silver/Gold), `getTier(points)`, `getNextTier(points)`, `progressToNextTier(points)` helpers. Welcome bonus is 50 pts.

**Brand tokens** are CSS custom properties defined in `src/styles/globals.css` (`--bg`, `--surface`, `--surface2`, `--accent` #534AB7, `--text`, `--muted`, `--border`). Use these via inline `style` props rather than Tailwind colour utilities, since Tailwind v4 doesn't know about them.

**Apple Wallet:** The "Add to Apple Wallet" button on `/dashboard` opens an info modal. Actual `.pkpass` generation requires an Apple Developer certificate + a backend signing service — neither exists yet.
