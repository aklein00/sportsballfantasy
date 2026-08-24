// Sports and Fun — CBS Sports Dynasty Superflex
// My team · Draft slot 5 · 10-team Half-PPR
// Roster seeded from CBS screenshots (2026-08-24)

export const LEAGUE = {
  id: 'sports-and-fun',
  name: 'Sports and Fun',
  platform: 'CBS Sports',
  format: 'Dynasty Superflex',
  season: 2026,
  teamCount: 10,
};

export const DRAFT = {
  format: 'snake',
  type: 'rookie',
  teamCount: 10,
  rounds: 22,
  mySlot: 5,
  status: 'in_progress',
  currentPick: 5,
  myNextPick: 5,
};

function teamName(slot) {
  return slot === 5 ? 'Scribbles' : `Team ${slot}`;
}

function player(id, name, positions, team, meta = {}) {
  return { id, name, positions: Array.isArray(positions) ? positions : [positions], team, ...meta };
}

export const MY_TEAM = {
  name: 'Scribbles',
  owner: 'Scribbles',
  draftSlot: 5,
  roster: [
    // QB — thin for Superflex (only Geno)
    player('saf-geno-smith', 'Geno Smith', 'QB', 'NYJ'),
    // RB — aging / committee; need young blood
    player('saf-jerome-ford', 'Jerome Ford', 'RB', 'WAS', { status: 'Q' }),
    player('saf-najee-harris', 'Najee Harris', 'RB', 'NYG'),
    player('saf-rhamondre-stevenson', 'Rhamondre Stevenson', 'RB', 'NE'),
    // WR — G. Wilson is the alpha; Reed/Tillman upside
    player('saf-garrett-wilson', 'Garrett Wilson', 'WR', 'NYJ', { note: 'alpha' }),
    player('saf-jayden-reed', 'Jayden Reed', 'WR', 'GB'),
    player('saf-cedric-tillman', 'Cedric Tillman', 'WR', 'CLE', { status: 'Q' }),
    player('saf-tre-tucker', 'Tre Tucker', 'WR', 'LV'),
    player('saf-christian-kirk', 'Christian Kirk', 'WR', 'SF', { status: 'Q' }),
    player('saf-joshua-palmer', 'Joshua Palmer', 'WR', 'BUF'),
    player('saf-kavontae-turpin', 'KaVontae Turpin', 'WR', 'DAL'),
    // TE — Kincaid is a dynasty TE1
    player('saf-dalton-kincaid', 'Dalton Kincaid', 'TE', 'BUF', { note: 'TE1' }),
    player('saf-dawson-knox', 'Dawson Knox', 'TE', 'BUF'),
  ],
};

/** Bump when seed data changes so localStorage re-seeds */
export const SPORTS_AND_FUN_SEED_VERSION = 1;

/** Seed draft board state for first visit (localStorage empty) */
export function sportsAndFunDraftSeed() {
  return {
    currentPick: DRAFT.currentPick,
    draftLog: [],
    myDraftPicks: [],
    myRoster: MY_TEAM.roster,
    seedVersion: SPORTS_AND_FUN_SEED_VERSION,
  };
}

export function getSportsAndFunTeamName(slot) {
  return teamName(slot);
}
