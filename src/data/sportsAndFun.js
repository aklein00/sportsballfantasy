// Sports and Fun — CBS Sports Dynasty
// My team · Draft slot 5 · 10-team
// Roster seeded from CBS screenshots (2026-08-24)
// Scoring / starter rules: not confirmed by the owner — do not invent them here.

export const LEAGUE = {
  id: 'sports-and-fun',
  name: 'Sports and Fun',
  platform: 'CBS Sports',
  format: 'Dynasty',
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
    player('saf-geno-smith', 'Geno Smith', 'QB', 'NYJ'),
    player('saf-jerome-ford', 'Jerome Ford', 'RB', 'WAS', { status: 'Q' }),
    player('saf-najee-harris', 'Najee Harris', 'RB', 'NYG'),
    player('saf-rhamondre-stevenson', 'Rhamondre Stevenson', 'RB', 'NE'),
    player('saf-garrett-wilson', 'Garrett Wilson', 'WR', 'NYJ', { note: 'alpha' }),
    player('saf-jayden-reed', 'Jayden Reed', 'WR', 'GB'),
    player('saf-cedric-tillman', 'Cedric Tillman', 'WR', 'CLE', { status: 'Q' }),
    player('saf-tre-tucker', 'Tre Tucker', 'WR', 'LV'),
    player('saf-christian-kirk', 'Christian Kirk', 'WR', 'SF', { status: 'Q' }),
    player('saf-joshua-palmer', 'Joshua Palmer', 'WR', 'BUF'),
    player('saf-kavontae-turpin', 'KaVontae Turpin', 'WR', 'DAL'),
    player('saf-dalton-kincaid', 'Dalton Kincaid', 'TE', 'BUF', { note: 'TE1' }),
    player('saf-dawson-knox', 'Dawson Knox', 'TE', 'BUF'),
  ],
};

// Owner reported these four rookies already off the board. Exact 1.01–1.04 slot
// order was not given — ADP order used only so the log has four rows.
// "Jordan Love" mapped to Jeremiyah Love (2026 RB). Jordan Love is a veteran QB.
// "M. Washington" mapped to Mike Washington Jr. (RB, LV) — the 2026 rookie Washington.
export const TAKEN_ROOKIES = [
  player('saf-jeremiyah-love', 'Jeremiyah Love', 'RB', 'ARI'),
  player('saf-jadarian-price', 'Jadarian Price', 'RB', 'SEA'),
  player('saf-carnell-tate', 'Carnell Tate', 'WR', 'TEN'),
  player('saf-mike-washington', 'Mike Washington Jr.', 'RB', 'LV'),
];

export const DRAFT_PICKS = TAKEN_ROOKIES.map((p, i) => {
  const overallPick = i + 1;
  return {
    overallPick,
    round: 1,
    pickInRound: overallPick,
    slot: overallPick,
    team: teamName(overallPick),
    isMyPick: false,
    player: p,
    orderUnconfirmed: true,
  };
});

// Remaining names at 1.05 — ranked by 2026 dynasty rookie consensus (FantasyPros Aug 2026),
// not by this league's scoring (unknown).
export const REMAINING_BOARD = [
  player('saf-jordyn-tyson', 'Jordyn Tyson', 'WR', 'NO', { ecr: 3, verdict: 'TAKE', why: 'Best remaining prospect. Young WR1 talent next to Garrett Wilson.' }),
  player('saf-makai-lemon', 'Makai Lemon', 'WR', 'PHI', { ecr: 4, verdict: 'CLOSE 2ND', why: 'Same tier as Tyson. First-round capital; PHI has more mouths to feed.' }),
  player('saf-kc-concepcion', 'KC Concepcion', 'WR', 'CLE', { ecr: 5, verdict: 'REACH', why: 'Next WR down. Still on the board later — Tyson/Lemon are the 1.05 names.' }),
  player('saf-kenyon-sadiq', 'Kenyon Sadiq', 'TE', 'NYJ', { ecr: 7, verdict: 'PASS', why: 'Class TE1, but you already have Dalton Kincaid.' }),
  player('saf-omar-cooper', 'Omar Cooper Jr.', 'WR', 'NYJ', { ecr: 8, verdict: 'LATER', why: 'Solid WR5 of the class. Not 1.05 over Tyson/Lemon.' }),
  player('saf-fernando-mendoza', 'Fernando Mendoza', 'QB', 'LV', { ecr: 9, verdict: 'ONLY IF 2QB', why: 'QB1 of the class. You have Geno. Unknown whether this league starts two QBs — do not assume it.' }),
  player('saf-denzel-boston', 'Denzel Boston', 'WR', 'CLE', { ecr: 10, verdict: 'LATER', why: 'Volume WR. Fine in the next round, not this one.' }),
  player('saf-jonah-coleman', 'Jonah Coleman', 'RB', 'DEN', { ecr: 12, verdict: 'NEED REACH', why: 'Next RB after Love/Price/Washington. Real roster hole, clear talent drop from 1.05 WRs.' }),
  player('saf-nicholas-singleton', 'Nicholas Singleton', 'RB', 'TEN', { ecr: 15, verdict: 'LATER', why: 'RB4 of the class. Wait unless Tyson and Lemon are both gone.' }),
];

export const PICK_COMPARISON = {
  overallPick: 5,
  takenOrderUnconfirmed: true,
  taken: TAKEN_ROOKIES,
  recommendation: {
    name: 'Jordyn Tyson',
    positions: ['WR'],
    team: 'NO',
    line: 'Hit commit on Tyson. Lemon if Tyson is gone. Do not reach RB or TE from here.',
  },
  candidates: REMAINING_BOARD.filter(p =>
    ['Jordyn Tyson', 'Makai Lemon', 'Kenyon Sadiq', 'Fernando Mendoza', 'Jonah Coleman'].includes(p.name)
  ),
};

/** Bump when seed data changes so localStorage re-seeds */
export const SPORTS_AND_FUN_SEED_VERSION = 2;

/** Seed draft board state for first visit (localStorage empty) */
export function sportsAndFunDraftSeed() {
  return {
    currentPick: DRAFT.currentPick,
    draftLog: DRAFT_PICKS,
    myDraftPicks: [],
    myRoster: MY_TEAM.roster,
    seedVersion: SPORTS_AND_FUN_SEED_VERSION,
  };
}

export function getSportsAndFunTeamName(slot) {
  return teamName(slot);
}

export function getSportsAndFunRookiePool() {
  return REMAINING_BOARD;
}
