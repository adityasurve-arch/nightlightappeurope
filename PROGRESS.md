# PROGRESS.md

## Files Created / Modified

### Config & Root
| File | Status | Description |
|---|---|---|
| `vite.config.js` | Modified | Added `@tailwindcss/vite` plugin alongside React plugin |
| `index.html` | Modified | Title → "Pernod Network", added Inter font from Google Fonts |
| `package.json` | Unchanged | Vite 8, React 19, React Router v7, Tailwind v4, ESLint |
| `CLAUDE.md` | Created | Codebase guide for future Claude instances |
| `.claude/launch.json` | Created | Preview server config (npm run dev --prefix consumer-app, port 5173) |

### Source — Entry Points
| File | Status | Description |
|---|---|---|
| `src/main.jsx` | Modified | Replaced `index.css` import with `styles/globals.css` |
| `src/App.jsx` | Replaced | Full rewrite: BrowserRouter, Routes, `RequireAuth` guard, `ProtectedLayout` |

### Source — Styles
| File | Status | Description |
|---|---|---|
| `src/styles/globals.css` | Created | Tailwind `@import`, CSS custom properties (`--bg`, `--surface`, `--accent` #534AB7, etc.) |
| `src/index.css` | Orphaned | Still exists from scaffold, no longer imported |
| `src/App.css` | Orphaned | Still exists from scaffold, no longer imported |

### Source — Data & Lib
| File | Status | Description |
|---|---|---|
| `src/data/venues.js` | Created | 15 partner venues across Paris/Milan/Barcelona/Vienna/Lisbon. Fields: id, name, city, address, hours, deal, mapsUrl |
| `src/data/rewards.js` | Created | Tier definitions (Bronze 0–499, Silver 500–1499, Gold 1500+), welcome bonus (50 pts), helper functions: `getTier`, `getNextTier`, `progressToNextTier` |
| `src/lib/member.js` | Created | localStorage helpers: `getMember`, `saveMember`, `clearMember`, `generateMemberId`, `updateMember` |

### Source — Components
| File | Status | Description |
|---|---|---|
| `src/components/Navbar.jsx` | **Deleted** | Replaced by BottomNav |
| `src/components/BottomNav.jsx` | **Created** | 5-tab bottom navigation (Card, History, Venues, Rewards, Profile) with SVG icons and active-state accent highlight |
| `src/components/MemberCard.jsx` | Created | Credit-card-style visual with gradient, city colour, tier badge, QR placeholder, ✓ Verified / ⚠ Unverified badge |
| `src/components/TierBadge.jsx` | Created | Bronze/Silver/Gold coloured chip, accepts `size` prop (sm/md/lg) |
| `src/components/ProgressBar.jsx` | Created | Thin animated bar, accepts `percent` and `color` |
| `src/components/VenueCard.jsx` | Created | Venue tile with city colour, deal badge, "Get directions" Google Maps link |

### Source — Data
| File | Status | Description |
|---|---|---|
| `src/data/visits.js` | **Created** | 15 synthetic visits across 5 cities (Mar–May 2025), each with venue, drinks array, and pointsEarned |

### Source — Pages
| File | Status | Description |
|---|---|---|
| `src/pages/Landing.jsx` | **Redesigned** | Mobile-first hero: full-width CTA, stats row, stacked feature cards |
| `src/pages/SignUp.jsx` | **Updated** | Removed max-width constraint; input font-size 16px prevents iOS zoom |
| `src/pages/Dashboard.jsx` | **Updated** | Removed max-w-lg; History quick link now active (links to /history) |
| `src/pages/Rewards.jsx` | **Updated** | Removed max-w-lg; full-width mobile layout |
| `src/pages/Venues.jsx` | **Updated** | Single-column venue grid; removed max-w-4xl |
| `src/pages/History.jsx` | **Created** | Visit history with summary strip (visits/drinks/pts), city filter tabs, month-grouped visit cards with drink chips |
| `src/pages/Profile.jsx` | **Created** | Initials avatar, member details table, verify identity button, sign-out |

---

## Current App State

### ✅ Working
- **Mobile app layout** — 430px phone shell centred on desktop (black surround), full-screen on mobile
- **Bottom tab navigation** — Card / History / Venues / Rewards / Profile with active-state highlight
- Full sign-up wizard (4 steps) with field validation
- DOB age check (must be 18+)
- SMS opt-in conditionally reveals phone number input (required field, 7+ digit validation)
- Identity verification step: doc type selector (Passport / National ID / Driver's Licence), 2-second simulated scan, optional Face ID with separate GDPR Art. 9 biometric consent checkbox
- "Skip for now" on verification step → member saved with `verified: false`
- `verified: true` → green **✓ Verified** badge on card; `false` → yellow **⚠ Unverified**
- Auth guard: unauthenticated access to protected routes redirects to `/`
- localStorage persistence: refresh keeps session, sign-out clears it
- Dashboard: member card, Apple Wallet button (opens info modal), verification nudge when unverified, points + tier progress, quick links to all tabs
- Rewards: tier banner, progress bar, earning rules, tier perks, locked redemptions
- Venues: city filter tabs, all 15 venues (single column), "My city" shortcut, "Get directions" links
- **History**: 15 synthetic visits (Mar–May 2025) across 5 cities, grouped by month, city filter, summary strip (visits/drinks/pts), coloured drink chips
- **Profile**: initials avatar, member details, verify identity shortcut, sign-out
- Brand dark theme consistent across all pages (#0E0E10 bg, #534AB7 accent)

### ❌ Not Working / Simulated
- **Document scanning** is fully simulated (2 s timeout, no real camera/OCR). Clicking "Scan" in the preview browser requires a direct JS `.click()` call — React synthetic events don't fire from `preview_click` tool on dynamically-rendered buttons.
- **Face ID** is simulated (same 2 s timeout). No real biometric processing.
- **Apple Wallet** shows a modal with pass contents but cannot generate a real `.pkpass` — requires Apple Developer account + backend signing service.
- **Drink History page** is a "Coming soon" placeholder.
- **Points are static** — 50 welcome bonus only. No real visit/drink logging increments them.
- **SMS/email delivery** is opt-in UI only; no messaging backend exists.
- **Referral tracking** is collected in the form but not used anywhere.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **No backend** | Demo/pitch prototype; localStorage is sufficient to show the full consumer journey without infra cost |
| **CSS custom properties over Tailwind colour utilities** | Tailwind v4 doesn't resolve arbitrary CSS vars at build time; inline `style` props + `var(--token)` is the reliable pattern |
| **Hardcoded venue & rewards data** | Avoids an API dependency for a prototype; easy to swap to a fetch call later |
| **Simulated verification flow** | Real biometric/OCR SDKs (e.g. Onfido, Jumio) require backend webhooks; simulation proves the UX without the integration cost |
| **Separate biometric consent checkbox** | GDPR Article 9 requires explicit, separate consent for biometric data — cannot be bundled with general Terms acceptance |
| **`verified` flag on member object** | Simple boolean; can be extended to `verificationStatus: 'pending' | 'verified' | 'rejected'` when a real KYC provider is integrated |
| **React Router v7 client-side routing** | SPA with no server; all routes return `index.html` in production (needs `--single` flag on `vite preview` or server config) |

---

## Known Bugs / Issues

1. **`src/index.css` and `src/App.css` are orphaned** — Vite scaffold leftovers, not imported anywhere, safe to delete.
2. **Date input on Safari** — `<input type="date">` renders as three spinners (dd/mm/yyyy) rather than a native picker; the `preview_fill` value format (`YYYY-MM-DD`) works programmatically but users on Safari may find it awkward.
3. **`preview_click` tool cannot trigger React synthetic events** on buttons that are conditionally rendered (e.g. the Scan button in step 4). Workaround during testing: use `preview_eval` with `element.dispatchEvent(new MouseEvent('click', {bubbles:true}))` or direct localStorage injection.
4. **No 404 / catch-all page** — `*` route redirects to `/`, which is fine for an SPA but gives no feedback to the user if they type a bad URL.
5. **Phone number field has no country-code selector** — the `+` prefix is static text; international members would need a proper `<select>` for dial codes.
6. **`updateMember` in `lib/member.js` is exported but never called** — added in anticipation of in-app profile edits; currently unused.

---

## Exact Next Steps

### Immediate (UX polish)
- [ ] Replace static `+` prefix on phone input with a country dial-code `<select>` (list of EU codes at minimum: +33 FR, +39 IT, +34 ES, +43 AT, +351 PT)
- [ ] Delete orphaned `src/index.css` and `src/App.css`
- [x] Add a `/profile` page — done (stub with member info + sign-out)
- [x] Add drink history page — done (synthetic visits, city filter, month grouping)
- [ ] Real QR code on member card (replace SVG placeholder with `qrcode` npm package, encode `memberId`)
- [ ] Profile edit — allow members to update name, city, preferences in-app

### Backend / Real integrations (when ready)
- [ ] Integrate a real KYC provider (Onfido or Jumio) for document + face verification — replace the `simulateScan` timeout with their SDK
- [ ] Apple Wallet: set up an Apple Developer account, create a Pass Type ID, build a Node.js/Python backend endpoint that generates and signs `.pkpass` files
- [ ] SMS backend: Twilio or similar — wire up the collected `phone` field
- [ ] Replace localStorage with a real auth system (JWT + database) so member data persists across devices

### Analytics (to connect to the existing dashboard)
- [ ] When members log drinks at venues, write transactions to a backend that feeds `generate_visits_drinks.py`-style data into the Pernod analytics dashboard
- [ ] Add a webhook or API endpoint so venue staff can log a member's visit/drinks by scanning the QR on the membership card

### Legal (before any public launch)
- [ ] Draft Privacy Policy covering GDPR Art. 13/14 disclosures
- [ ] Draft Biometric Data Addendum (separate from main Privacy Policy)
- [ ] Complete a DPIA (Data Protection Impact Assessment) before processing real biometric data at scale
- [ ] Terms of Service per country (France, Italy, Spain, Austria, Portugal)

---

## Features Still Pending

| Feature | Priority | Notes |
|---|---|---|
| Drink / visit history page | ~~High~~ Done | Built with 15 synthetic visits, city filter, month grouping |
| Country dial-code selector on phone input | High | Current static `+` is insufficient |
| Profile / settings page | Partial | Stub built; edit functionality still coming soon |
| Push notifications | Medium | Requires PWA service worker or native app |
| Real QR code on membership card | Medium | Replace SVG placeholder with a generated QR (e.g. `qrcode` npm package) — encode `memberId` |
| Android Wallet / Google Pay passes | Medium | Google Wallet API — separate from Apple PKPass |
| Referral system | Low | Form collects referral source but no referral code / tracking logic exists |
| Admin / venue-staff interface | Low | Needed for real drink logging at partner venues |
| Multi-language support (FR/IT/ES/DE/PT) | Low | All copy is English only |
