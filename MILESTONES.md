# SportsBallFantasy — Milestones

_Updated: 2026-03-08_

---

## Foundation

- [x] **Project structure** — `Baseball/`, `Football/` directories, `CLAUDE.md` with style guide
- [x] **CLAUDE.md** — Thrasher-Wizard aesthetic documented (colors, fonts, mascots, don'ts)
- [x] **Blue Dream league rules** — Full CBS Sports settings parsed and documented in CLAUDE.md
- [x] **React app scaffolded** — Vite + React + Tailwind CSS (`app/`)
- [x] **Punk-magic CSS system** — ink-bleed transitions, glitch, alert-blink, halftone textures, custom scrollbars
- [x] **Crystal Ball Dashboard** — scoring cats, roster limits, prize structure, key dates, football placeholders
- [x] **Rules Drawer** — slide-out sidebar with Roster / Scoring / Schedule / House Rules tabs
- [x] **Draft War Room UI** — 3-column layout: Graveyard / Available Talents / My Roster
- [x] **Snake draft logic** — 16-team, 20-round pick calculator with owner assignment
- [x] **Kyle Tucker seeded** — R1 Pick 4, pre-loaded in Scribbles roster
- [x] **2/3 Turn alerts** — picks #29 and #36 trigger blinking border + alert banner
- [x] **Real NL player pool** — 4,043 players parsed from CBS Sports FA export (batters + pitchers)
- [x] **Position filter, search, sort, pagination** — 50 players/page, CBS rank / tier / stat sorts
- [x] **CBS Sync module** — Session Token + League ID UI ready (not yet wired to live API)
- [x] **AI Advice spec written** — characters, data sources, architecture, phases, cost estimate

---

## Phase 1 — Advisor UI Shell
_No API calls. Hardcoded The Warden quips. Just the UI._

- [x] `AdvisorPanel.jsx` — slide-out panel with character avatar and response area
- [x] **The Warden** character — voice, avatar emoji, draft-mode static responses
- [x] "🔮 Get Advice" button in War Room toolbar triggers panel
- [x] Panel tabs: Draft Advice / Pickups / Lineup / Ask Augur
- [x] Inject current roster + positional needs into prompt context (visible in context section)

---

## UX Redesign — New Shell (2026-03-08)
_Rebuilt app shell: sidebar nav, My Team primary view, inline Warden, FA browser, prospect watchlist._

- [x] **New grid shell** — `App.jsx` restructured: `64px topbar / sidebar / main` grid layout
- [x] `TopBar.jsx` — logo + live data status + breadcrumb (league › section); no tabs
- [x] `LeagueSidebar.jsx` — collapsible 240px sidebar; section nav (My Team / Draft / Free Agents / League Info) + league switcher with sport icons; collapses to 56px icons-only
- [x] `src/utils/wardenAdvice.js` — shared advisor logic extracted (`WARDEN`, `getStaticAdvice`, `calcPositionNeeds`); imported by both AdvisorPanel and WardenCard
- [x] `WardenCard.jsx` — permanent inline advisor card at top of Team view; collapsed by default with 2-line preview; expanded shows Lineup / Pickups / Prospects / Ask tabs + chat input
- [x] `TeamView.jsx` — primary view replacing Dashboard; left col: WardenCard + compact roster table (POS / Name / Injury / Team / Key stat / hover news) + Bench/IL/Minors cards; right col: FreeAgentsSection + MinorLeagueWatch
- [x] `FreeAgentsSection.jsx` — position filter tabs + sorted FA list (positional need match first); Warden Pick badge on top pick; no-op Claim button
- [x] `MinorLeagueWatch.jsx` — prospect watchlist with search (tier 3-4 default); persisted to localStorage; per-player injury badge + games played; green-bar accent
- [x] `.green-bar` CSS utility added to `index.css`
- [x] `RulesDrawer.jsx` — minimal update: accepts optional `open`/`onClose` props for sidebar-triggered control; standalone button still works in DraftWarRoom
- [x] `AdvisorPanel.jsx` — updated to import shared `getStaticAdvice` / `calcPositionNeeds` / `WARDEN` from `wardenAdvice.js`
- [x] Dashboard.jsx, Roster.jsx, DraftWarRoom.jsx, all data files, hooks, services — **unchanged**
- [x] Build verified: zero errors (`npm run build`)

---

## Phase 2 — Live Data Layer
_Real stats and news. No AI yet._

- [x] `mlbApi.js` — MLB Stats API: active player index, injury status, name-matching
- [x] `newsRss.js` — Rotowire RSS feed parser, player name matching, age formatting
- [x] `dataCache.js` — localStorage cache with 4-hour TTL
- [x] Vite proxy config — `/mlb` → statsapi.mlb.com, `/rss/rotowire` → rotowire.com
- [x] `usePlayerData.js` — hook: loads MLB index + RSS on mount, exposes `getInjury` / `getNews`
- [x] Header live status — green dot when loaded, pulse while loading, red + retry on error
- [x] Injury badges on War Room player cards — ⚠ yellow (DTD/Q) / ✕ red (IL)
- [x] News on hover in Roster view — inline news items with timestamp
- [x] `usePlayerStats.js` — hook: resolves MLB ID from index, fetches live hitting/pitching stats
- [x] `PlayerStatCard.jsx` — reusable card: live stats (gold) vs projected (dim), injury badge, latest news
- [x] Dashboard "Scribbles Live Stats" section — renders a PlayerStatCard for every rostered player

---

## Phase 3 — Live AI Advice
_Real Gemini API calls. Vercel serverless proxy._

- [ ] Vercel project set up (`vercel.json`, `api/` directory)
- [ ] `api/advice.js` — serverless function: receives roster context, calls Gemini, returns response
- [ ] `GEMINI_API_KEY` added to Vercel env vars (from Google AI Studio)
- [ ] Install `@google/generative-ai` SDK
- [ ] The Warden system prompt wired to `gemini-1.5-flash`
- [ ] Draft Advice: real-time pick recommendation based on roster needs + available pool
- [ ] Free Agent Advice: weekly waiver targets ranked by positional need + projected stats
- [ ] Lineup Advice: daily "start/sit" based on injury status + matchup
- [ ] "Deep Dive" button on any player → Gemini with grounding/search for recent news
- [ ] Cost guardrail: warn if >1,400 advice calls/day (localStorage counter, well under free tier limit)

---

## Phase 4 — Football Season
_Duplicate architecture for football leagues._

- [ ] Add Football league 1 data (league rules, team, draft position)
- [ ] Chad Dominator character — system prompt, avatar, football voice
- [ ] `nflApi.js` — nflverse data or ESPN unofficial API for stats + injuries
- [ ] Weekly advice mode (vs daily for baseball)
- [ ] Football roster schema (QB/RB/WR/TE/K/DEF positions)
- [ ] Football War Room with weekly scoring period context
- [ ] Repeat for Football leagues 2 and 3

---

## Stretch Goals

- [ ] Deploy to `sportsball.utilityinfielder.com` via Vercel
- [ ] FantasyPros consensus CSV import (drop file into `public/data/`)
- [ ] Standings tracker — manually enter weekly H2H results
- [ ] Trade analyzer — input proposed trade, Scout McGee evaluates
- [ ] Keeper tracker — which players are keeper-eligible, deadline countdown
- [ ] Season-long record vs each opponent
- [ ] Mobile-responsive layout (currently desktop-first)
- [ ] Dark/punk mascot illustrations (generate via generate-image skill)
- [ ] Basketball league support (future)
- [ ] Hockey league support (future)

---

## Notes

- **AI spec reference:** See last message in session from 2026-03-07 for full data source breakdown, character voice notes, system prompt template, and cost estimates.
- **Player pool:** `app/src/data/playerPool.js` — 4,043 NL players from CBS FA export, tiered by CBS rank. Refresh before each draft season.
- **Draft pick math:** My pick = position 4. R2 = pick 29, R3 = pick 36 (snake). Alerts fire on those picks.
- **Run app:** `cd app && npm run dev`
