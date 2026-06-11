# Nightlight — UX + Retention Playbook

Audience: 18–25 year old students in Paris, Milan, Barcelona, Vienna, Lisbon.
Goal: make the app engaging, visually cohesive, and habit-forming — and convert table-order guests into members.

---

## Part 1 — UX Audit

### Flow 1: Landing → SignUp (4 steps)

**What works:** Demo mode removes all friction for pitching. Dark theme fits the context. CTA hierarchy exists.

**Friction points:**
| Step | Problem | Fix |
|---|---|---|
| Landing | Old headline ("Drink smarter") described philosophy, not benefit | ✅ Fixed: "Order. Earn. Go VIP." — 3 words, shimmer on the aspiration |
| Landing | CTA was visually equal to demo button | ✅ Fixed: primary CTA now glows (`nl-glow`), larger, bolder |
| SignUp step 1 | Asks name + email + DOB + gender at once — heaviest step first | Reorder: email-only first step; collect name at step 2, DOB only at verification |
| SignUp step 4 | ID verification before any reward shown | Show "50 welcome points waiting" banner *during* verification, not after |
| All steps | Progress shown but reward for finishing isn't | Persistent footer: "Finishing = 50 pts + free first-order discount" |

**Biggest drop-off risk:** step 4 (ID scan). Mitigation: make verification skippable with a "verify later, points locked until then" state — never block the funnel on the scariest step.

### Flow 2: Dashboard → Rewards/Venues/History

**What works:** Member card up top is correct — the card IS the product identity. Quick links are clear.

**Problems found:**
- Dashboard had no path to `/order` — the core revenue feature wasn't reachable from the home screen (✅ fixed: hero "Order with your table" button)
- Points framed only in pts; users think in nights out, not arithmetic (✅ fixed: "About 2 nights out away from Gold")
- Zero social presence on the dashboard — no reason to come back when not at a bar (✅ fixed: crew activity card with FOMO copy)
- Apple Wallet button sits above the fold doing nothing real yet — demote it below points once `.pkpass` exists

### Flow 3: GroupOrder (6+ screens)

**What works:** The happy path (start → QR → friends join → order → pickup) is genuinely novel. Free-round conversion banner is well-placed at the order-placed moment (peak emotional high).

**Confusion risks:**
- "Start a Table" vs "Join a Table" — first-timers don't know which they are. Add one line under each: "I'm getting us set up" / "Someone already has a QR up"
- MenuScreen has no images — drinks are an emotional purchase; names alone undersell. Add per-category hero imagery at minimum
- CartScreen should show **who** ordered **what** with avatars — social proof inside the cart pressures the one friend who hasn't ordered yet
- OrderPlacedScreen status ("preparing") needs motion — a static label feels broken after 30s. Add stepper: Sent → Preparing → **Ready, scan to pick up** with the QR pulsing at Ready

### Flow 4: Companion tagging in History

**Problem:** It's the stickiest data feature (crew = Quarter's social layer) but it's buried behind a "+ Tag friends" link on past visits — retroactive and chore-like.

**Fixes:**
- Group orders should auto-tag companions (the table members ARE the companions — zero manual work, better data)
- After a visit, push one prompt: "Who were you with last night at Le Cercle?" — tagging as memory, not admin
- Reward it: +5 pts per tagged companion (capped per visit). Tagging is data entry for Quarter; pay for it in points

---

## Part 2 — Design System

### Color palette (now in `globals.css`)

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0E0E10` | App background — near-black, eye-friendly in dark bars |
| `--surface` / `--surface2` | `#1A1A1E` / `#24242A` | Cards, sheets |
| `--accent` | `#534AB7` | Brand purple — actions, nav, identity |
| `--accent-light` | `#9B93E8` | Accent text on dark surfaces |
| `--accent-soft` / `--accent-glow` | 14% / 45% alpha | Tints + glows |
| `--amber` | `#FBBF24` | **Conversion moments only** — free rounds, urgency, unlocks. Scarcity color; if everything is amber, nothing is |
| `--tier-bronze` | `#C4843A` | Earned warmth |
| `--tier-silver` | `#8C9FD4` | Cool, clean |
| `--tier-gold` | `#E8B923` | The aspiration — used in shimmer text |
| `--success` | `#4ADE80` | Confirmations, "Unlocked ✓" |

**Rule:** purple = brand and actions. Amber = money moments. Gold = status. Never mix roles.

### Typography scale

| Level | Size / weight | Use |
|---|---|---|
| Display | 36px / 800 | Landing headline only |
| H1 | 24px / 700 | Page titles |
| H2 | 15px / 600 | Card titles, section headers |
| Body | 14px / 400 | Descriptions |
| Caption | 12px / 400–600 | Meta, chips, nav labels |
| Micro | 10–11px / 600 | Badges, tab labels |

Font: Inter (already set). Don't add a second typeface — premium feel comes from weight contrast (400 vs 700/800), not font variety.

### Component specs

**Buttons**
- Primary: `--accent` bg, white, 16px radius-2xl, `nl-press` + `nl-glow` for hero CTAs only
- Secondary: `--accent-soft` bg, `--accent-light` text, accent border at 30%
- Ghost: transparent, `--border` outline, `--muted` text
- Conversion: `--amber` bg, near-black text (free-round banner pattern)

**Cards**
- Standard: `--surface` bg, 1px `--border`, radius 12–16px
- Tier-tinted: gradient `--surface → tierColor at 8%`, border tierColor at 27% (Rewards banner pattern)
- Urgency: `--amber-soft` bg + `--amber-border`

**Badges/chips:** pill radius, 12px semibold, tier chips always show their metal color; status dots use `nl-pulse-dot`.

### Micro-interactions (now in `globals.css`)

| Class | Effect | Use |
|---|---|---|
| `.nl-press` | scale 0.96 on tap | Every tappable element — universal tactile feedback |
| `.nl-glow` | breathing purple glow | One hero CTA per screen, max |
| `.nl-slide-up` | 14px rise + fade, 0.4s | Screen entries, banners |
| `.nl-pop` | overshoot scale-in | Points earned, badge reveals, friend-joined avatars |
| `.nl-shimmer-text` | gold sweep across text | Tier-up moments, Gold status, "Go VIP" |

**Still to build:** tier-up celebration (full-screen takeover: badge `nl-pop` + shimmer name + share button), haptics via `navigator.vibrate(50)` on QR scan success and points earn, points counter that ticks up rather than jumping.

---

## Part 3 — Retention Mechanics

### Habit loop (highest priority)
1. **Visits-away framing** ✅ shipped — "2 nights out from Gold" beats "455 pts needed"
2. **Weekly rhythm push** — Thursday 17:00 local: "Le Cercle has Absolut at parity tonight. Your crew's been twice this month." Thursday is the decision point for the weekend
3. **Countdown perks** — "Free round for new sign-ups until midnight" with a live timer on the venue card

### Social competition
1. **Crew leaderboard** (monthly, opt-in) — points this month among your tagged crew only. Friends, not strangers; comparison stays motivating, not demoralising
2. **Group multiplier** — "4+ at the table = 1.5× points for everyone." Directly monetisable: bars pay for the extra footfall this drives
3. **Crew card on dashboard** ✅ shipped — passive FOMO ("your crew went out without you")

### Scarcity/urgency
- Deals with end times, always rendered with a countdown, always amber
- Flash tier weekends ("Silver weekend: 2× points") announced 48h ahead via push

### Personalization
- "Because you ordered Espresso Martinis at Maison Noire → try Bar Hemingway's espresso list" — drink-level data is the differentiator, use it visibly
- "Your crew is at [venue] now" — requires real check-ins (post-Supabase)

### Celebration/status (viral loop)
- Tier-up generates a share card: dark background, gold shimmer name, tier badge, "NL-XXXX · Gold · Paris" — designed for Instagram Stories portrait
- Share prompt fires ONLY at tier-up and free-round unlock. Never beg for shares at neutral moments

---

## Part 4 — Copy Templates

**Push (urgent, not spam):**
- "🥂 1 night out from Silver. Tonight counts double at Le Cercle."
- "Sofia just hit Gold. You're 240 pts behind her."
- "Your free round expires at midnight. It knows you're home."

**In-app toasts:**
- Points earn: "+25 pts ⚡ {tier} in {n} more nights"
- Friend joins table: "{name} joined your table 🍸" (avatar `nl-pop`)
- Tag saved: "Crew updated — +5 pts"

**Weekly email:** subject "Your week in the network" — crew points total, your delta vs last week, one venue deal, one-tap "plan Thursday."

---

## Part 5 — Metrics

| Metric | Target | Why it matters |
|---|---|---|
| D1 activation (first order ≤24h) | 35%+ | Order = the aha moment |
| D7 retention | 45%+ | One more night out within a week |
| D30 retention | 25%+ | Habit formed |
| Bronze→Silver time | <6 weeks | Tier velocity = engagement health |
| Group vs solo orders | >60% group | Group = more data + more conversion banners seen |
| Companion tags per visit | >1.5 | The Quarter social-layer KPI |
| Free-round conversion (web guest → member) | 20%+ | The entire acquisition engine |

---

## Shipped in this pass
- Design tokens: tier metals, amber conversion color, success green, soft/glow accent variants
- Shared animation library: `nl-press`, `nl-glow`, `nl-slide-up`, `nl-pop`, `nl-shimmer-text`, `nl-pulse-dot`
- Landing: "Order. Earn. Go VIP." headline with gold shimmer, tier ladder preview, glowing primary CTA
- Dashboard: hero "Order with your table" button (revenue feature now one tap from home), "nights out away" tier framing, crew-activity FOMO card
- Rewards: nights-out ETA to next tier, "X away 🔒 / Unlocked ✓" states on redemptions

## Next (in order)
1. Split GroupOrder screens into files, add cart avatars + order-status stepper
2. Tier-up celebration screen + share card
3. SignUp reorder (email first, verification skippable)
4. Empty states (no visits / no crew / no rewards) with point-incentivised CTAs
5. Push notification infra (post-Supabase)
