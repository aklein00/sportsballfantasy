# SportsBallFantasy — CLAUDE.md

## Project Vision

**SportsBallFantasy** is a punk-magic fantasy sports dashboard — a hub for managing multiple fantasy leagues across baseball, football, and beyond. The aesthetic is aggressive, chaotic, and beautiful: think Thrasher Magazine meets a wizard's grimoire.

This is the owner's personal command center. It should feel like wielding dark magic with sports data.

---

## Visual Identity & Style System

### Aesthetic: Punk-Magic / Thrasher-Wizard

- **Vibe:** Chaotic ink, zine energy, arcane power. High contrast. Never soft.
- **Mascots:** Athletic wizards and faeries — competitive, scrappy, magical. Not cute. Not corporate.
- **Typography:** Bold, distressed, high-contrast. Blackletter or heavy condensed display fonts for headers. Mono for data/stats.
- **Layout:** Intentionally asymmetric. Grid-breaking elements. Torn edges, ink splatter, overlapping layers.
- **Texture:** Rough paper, screen-print halftones, spray paint effects.

### Color System

| Role | Color | Hex |
|------|-------|-----|
| Primary | Electric Yellow | `#FFE600` |
| Secondary | Deep Purple | `#4B0082` |
| Background | Void Black | `#0A0A0A` |
| Accent | Hot Magenta | `#FF006E` |
| Data / Stats | Off-White | `#F0EDE0` |
| Warning | Skate Red | `#FF2200` |
| Success | Acid Green | `#39FF14` |

### UI Rules

- Dark backgrounds always. No light mode.
- Yellow on black for primary headings.
- Purple used for section dividers, card borders, team identifiers.
- Stats displayed in monospace font — they are sacred data, not decoration.
- Buttons should feel like stickers or stamps, not pills.
- Hover states: ink-bleed effect or glow.
- Never use Bootstrap defaults or Material Design idioms. Build raw or use a minimal utility system.

---

## Tech Stack (Planned)

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS (custom config) or CSS Modules with custom properties
- **State:** TBD (likely Zustand or Context)
- **Data:** Static JSON to start, API integrations later
- **AI:** Google Gemini API (`gemini-1.5-flash` for advisor features) — free tier: 1,500 req/day, 1M TPM. Use `@google/generative-ai` SDK. Key stored in Vercel env vars as `GEMINI_API_KEY`.
- **Deployment:** Vercel (subdomain of utilityinfielder.com per subdomain-project-setup skill)
- **Future Google integrations:** Google Sheets (league data export/import), Google Maps (stadium/travel context), Google Docs (league constitution)

---

## Project Structure

```
SportsBallFantasy/
├── CLAUDE.md               ← this file
├── Baseball/
│   └── BlueDream/
│       └── RawDocs/        ← source PDFs and league exports
├── Football/               ← future leagues
└── src/                    ← React app (to be scaffolded)
```

---

## Baseball Leagues

### Blue Dream (CBS Sports)

**URL:** https://bluedream.baseball.cbssports.com
**Season:** 2026 | **Platform:** CBS Sports
**Entry Fee:** $100/team | **Teams:** 16 | **Divisions:** 4

#### Player Pool
- **NL Players only**
- Players traded to AL teams mid-season: stats do not accumulate

#### Draft
| Setting | Value |
|---------|-------|
| Format | Extended Draft |
| Order | Snake |
| Date | March 7, 2026 @ 3:00 PM ET |
| Rounds | 20 |
| Robot | Disabled (no time limit between picks) |

#### Roster Construction

| Slot | Min | Max |
|------|-----|-----|
| Active Players | 21 | 21 |
| Reserve | 0 | 2 |
| Injured List | 0 | 14 |
| Minors | 0 | 5 |
| **Total** | **21** | **42** |

**Active Roster Positions:**

| Position | Count |
|----------|-------|
| C | 2 |
| 1B | 1 |
| 2B | 1 |
| 3B | 1 |
| SS | 1 |
| LF | 1 |
| CF | 1 |
| RF | 1 |
| OF (flex) | 1 |
| UTIL | 2 |
| SP | 3 |
| RP | 3 |
| P (flex) | 3 |

**Player Eligibility:** Primary position + positions played 10 games last year or 1 game this year.

#### Scoring System

**Format:** Head-to-Head, Most Categories
**Tiebreaker:** None — ties allowed

**Batting Categories:**
- BA (Batting Average)
- HR (Home Runs)
- R (Runs)
- RBI (Runs Batted In)
- SB (Stolen Bases)

**Pitching Categories:**
- ERA (Earned Run Average)
- K (Strikeouts)
- S (Saves)
- W (Wins)
- WHIP (Walks + Hits / Innings Pitched)

#### Schedule

| Event | Date/Period |
|-------|------------|
| Season Start | Wed, March 25, 2026 |
| Scoring Period | Weekly (starts Monday) |
| Lineup Deadline | 5 min before first game of period per player |
| Playoffs Start | Period 21 |
| Playoff Length | 3 periods |
| Trade Deadline | 11:59 PM ET, August 1, 2026 |
| Keeper Deadline | March 6, 2026 |

#### Playoffs & Payouts

**Playoff Qualifier (6 teams):**
- All 4 division winners (automatic)
- 2 Wild Cards (best records regardless of division)

**Bracket:**
- Top 2 records: BYE in round 1
- Wild Cards play division winners seeded 3rd and 4th
- Lowest WC record plays the 3rd-seed division winner

**Playoff Tiebreaker:** Better XBH (Extra Base Hits)

**Payout Structure:**

| Award | Amount |
|-------|--------|
| Best Regular Season Record | $200 |
| 3 other Division Winners | $100 each |
| Playoff 1st Place | $600 |
| Playoff 2nd Place | $200 |
| Playoff 3rd Place | $100 |

*Total pool: $1,600 from $1,600 entry ($100 × 16 teams)*

#### Transactions & Waivers

| Setting | Value |
|---------|-------|
| Add/Drop | Waivers process |
| Waivers Run | Every night (Sun–Sat) |
| Waiver Order | Never resets (based on prior waiver activity) |
| Waiver Period | Players on waivers minimum 1 day |
| FAB Budget | $100 per team |
| Winning Offers | Do not save |
| Zero Offers | Not allowed |
| Trade Processing | Immediate |
| Offseason Trades | Allowed |

#### Special Rules (House Rules)

**The Mookie Betts Rule 2.0**
Any player NOT on the CBS draft list when the draft starts is ineligible to be drafted. Any AL/non-NL player added mid-draft by CBS: if drafted, they are removed after the draft concludes. The draft will not be rolled back for an illegal pick. Always keep players queued to avoid auto-selecting an ineligible player.

**The Sean Manaea Rule 3.0**
The draft will be rolled back exactly ONE time for a player who appears on the board for an owner on auto-draft (to prevent them from being screwed). This does not limit liberal use of rollbacks outside of this rule. If you drafted a Mookie Betts Rule player, you lose that pick — the AL transfer player is dropped post-draft.

**No players will be added to the Free Agent pool during the draft.**

**The Joc Pederson / AL Traded Compensation Rule**
- Keeper players (traded at any time) and players from the first 5 rounds (traded during the season only) earn Pick of Picks (PoP) chip compensation
- Chips apply only if a PoP Draft is held
- Owner responsibility: post player losses on the main board, remind the exec committee and PoP volunteer
- Tab is tracked collectively, but individual owners must advocate for their own chips

**Winning Team Bonus**
The championship team gets to:
- Rename all divisions (tastefully)
- Select the league's homepage image (tastefully)

**Draft Speed Bonus**
The 3 fastest drafters earn 2 extra PoP chips (if PoP Draft is held).

**AL Trade Loss Bonus**
Losing a top-5 pick to the AL (during the season only) earns 2 extra PoP chips.

#### Keeper Policy
- Individual team managers select their own keepers
- Deadline: March 6, 2026
- NL-only restriction applies to keepers
- Players acquired via waivers who came from non-NL teams (post-draft trades/signings) cannot be kept

---

## Football Leagues

*(To be added — structure TBD)*

---

## Development Guidelines

- Build features league by league. Blue Dream baseball is the pilot.
- Keep league rules as structured data (JSON) — don't hardcode them into components.
- Roster logic should be configurable per league.
- Scoring categories should be pluggable.
- Mascot/wizard/faerie art assets: generate via generate-image skill with consistent punk-magic style.
- When adding a new fantasy sport or league, create a subdirectory and add its rules section to this file.

---

## Style Don'ts

- No pastels, no rounded "friendly" corners on primary elements
- No default browser fonts without customization
- No light backgrounds
- No blue-link defaults
- No corporate SaaS look (no Stripe, no Linear, no Notion vibes)
- No emoji in UI (they break the aesthetic) unless used as deliberate punk decoration
