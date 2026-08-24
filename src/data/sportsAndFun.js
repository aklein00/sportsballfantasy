// Sports and Fun — CBS Sports Dynasty
// Roster = ONLY the players in the three CBS screenshots (2026-08-24).
// Image 1 = Active Players. Images 2–3 = rest of the roster (not a different team).
// Scoring not confirmed by the owner — do not invent it.

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

const TEAM_NAME = 'the sports and fun team';

function teamName(slot) {
  return slot === 5 ? TEAM_NAME : `Team ${slot}`;
}

function player(id, name, positions, team, meta = {}) {
  return { id, name, positions: Array.isArray(positions) ? positions : [positions], team, ...meta };
}

// Screenshot 1 — Active Players (starters). Teams/slots as shown on CBS.
const ACTIVE = [
  player('saf-cj-stroud', 'C.J. Stroud', 'QB', 'HOU', { active: true, slot: 'QB', proj: 310.8 }),
  player('saf-travis-etienne', 'Travis Etienne', 'RB', 'NO', { active: true, slot: 'RB', proj: 173.1 }),
  player('saf-breece-hall', 'Breece Hall', 'RB', 'NYJ', { active: true, slot: 'RB', proj: 165.1, status: 'Q' }),
  player('saf-jamarr-chase', "Ja'Marr Chase", 'WR', 'CIN', { active: true, slot: 'WR', proj: 207.3 }),
  player('saf-michael-wilson', 'Michael Wilson', 'WR', 'ARI', { active: true, slot: 'WR', proj: 106.2 }),
  player('saf-juwan-johnson', 'Juwan Johnson', 'TE', 'NO', { active: true, slot: 'TE', proj: 100.1 }),
  player('saf-michael-pittman', 'Michael Pittman Jr.', 'WR', 'PIT', { active: true, slot: 'RWT', proj: 94.2, status: 'Q' }),
  player('saf-cam-little', 'Cam Little', 'K', 'JAC', { active: true, slot: 'K', proj: 135.0 }),
  player('saf-commanders', 'Commanders', 'DST', 'WAS', { active: true, slot: 'DST', proj: 138.0 }),
];

// Screenshots 2–3 — continuation of the same roster (bench / remaining names).
const REST = [
  player('saf-geno-smith', 'Geno Smith', 'QB', 'NYJ', { active: false, slot: 'QB', proj: 248.7 }),
  player('saf-jerome-ford', 'Jerome Ford', 'RB', 'WAS', { active: false, slot: 'RB', proj: 19.0, status: 'Q' }),
  player('saf-najee-harris', 'Najee Harris', 'RB', 'NYG', { active: false, slot: 'RB', proj: 48.0 }),
  player('saf-christian-kirk', 'Christian Kirk', 'WR', 'SF', { active: false, slot: 'WR', proj: 79.1, status: 'Q' }),
  player('saf-jayden-reed', 'Jayden Reed', 'WR', 'GB', { active: false, slot: 'WR', proj: 101.2 }),
  player('saf-cedric-tillman', 'Cedric Tillman', 'WR', 'CLE', { active: false, slot: 'WR', proj: 59.1, status: 'Q' }),
  player('saf-tre-tucker', 'Tre Tucker', 'WR', 'LV', { active: false, slot: 'WR', proj: 84.1 }),
  player('saf-kavontae-turpin', 'KaVontae Turpin', 'WR', 'DAL', { active: false, slot: 'WR', proj: 36.1 }),
  player('saf-dalton-kincaid', 'Dalton Kincaid', 'TE', 'BUF', { active: false, slot: 'TE', proj: 111.2 }),
  player('saf-dawson-knox', 'Dawson Knox', 'TE', 'BUF', { active: false, slot: 'TE', proj: 50.1 }),
  player('saf-joshua-palmer', 'Joshua Palmer', 'WR', 'BUF', { active: false, slot: 'RWT', proj: 51.1 }),
  player('saf-rhamondre-stevenson', 'Rhamondre Stevenson', 'RB', 'NE', { active: false, slot: 'RWT', proj: 133.1 }),
  player('saf-garrett-wilson', 'Garrett Wilson', 'WR', 'NYJ', { active: false, slot: 'RWT', proj: 139.3 }),
];

export const MY_TEAM = {
  name: TEAM_NAME,
  owner: null,
  draftSlot: 5,
  roster: [...ACTIVE, ...REST],
};

// Owner reported these four rookies already off the board. Exact 1.01–1.04
// slot order was not given — ADP order used only so the log has four rows.
// "Jordan Love" mapped to Jeremiyah Love (2026 RB).
// "M. Washington" mapped to Mike Washington Jr. (RB, LV).
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

// Remaining names at 1.05 — ranked by 2026 dynasty rookie consensus, not league scoring.
export const REMAINING_BOARD = [
  player('saf-jordyn-tyson', 'Jordyn Tyson', 'WR', 'NO', {
    ecr: 3,
    verdict: 'TAKE',
    why: 'Best remaining player. Take him at 1.05. The young RB comes at 2.06 (#16).',
  }),
  player('saf-makai-lemon', 'Makai Lemon', 'WR', 'PHI', {
    ecr: 4,
    verdict: 'CLOSE 2ND',
    why: 'Same tier as Tyson. First-round capital; PHI is more crowded.',
  }),
  player('saf-kc-concepcion', 'KC Concepcion', 'WR', 'CLE', {
    ecr: 5,
    verdict: 'LATER',
    why: 'Next WR down. You are already loaded at WR (Chase, G. Wilson, Pittman, Reed).',
  }),
  player('saf-kenyon-sadiq', 'Kenyon Sadiq', 'TE', 'NYJ', {
    ecr: 7,
    verdict: 'PASS',
    why: 'Class TE1, but you already have Kincaid and Juwan Johnson.',
  }),
  player('saf-omar-cooper', 'Omar Cooper Jr.', 'WR', 'NYJ', {
    ecr: 8,
    verdict: 'LATER',
    why: 'Not 1.05 over Tyson/Lemon on a Chase / G. Wilson roster.',
  }),
  player('saf-fernando-mendoza', 'Fernando Mendoza', 'QB', 'LV', {
    ecr: 9,
    verdict: 'PASS',
    why: 'You already have C.J. Stroud plus Geno. Do not spend 1.05 on QB.',
  }),
  player('saf-denzel-boston', 'Denzel Boston', 'WR', 'CLE', {
    ecr: 10,
    verdict: 'LATER',
    why: 'Fine later. Not this pick.',
  }),
  player('saf-jonah-coleman', 'Jonah Coleman', 'RB', 'DEN', {
    ecr: 12,
    verdict: 'NEXT PICK',
    why: 'The young RB behind Hall. Love/Price/Washington are gone — Coleman is ~12th, not 5th. Queue him for 2.06 (#16).',
  }),
  player('saf-nicholas-singleton', 'Nicholas Singleton', 'RB', 'TEN', {
    ecr: 15,
    verdict: '2.06 BACKUP',
    why: 'RB4 of the class. Backup plan at #16 if Coleman is gone.',
  }),
];

export const PICK_COMPARISON = {
  overallPick: 5,
  takenOrderUnconfirmed: true,
  taken: TAKEN_ROOKIES,
  recommendation: {
    name: 'Jordyn Tyson',
    positions: ['WR'],
    team: 'NO',
    line: 'Tyson now. Coleman at 2.06. Hall is your RB1; Etienne/Stevenson/Najee/Ford are this year, not the future. Love and Price are gone — do not pay 1.05 for the RB3.',
  },
  candidates: REMAINING_BOARD.filter(p =>
    ['Jordyn Tyson', 'Makai Lemon', 'Jonah Coleman', 'Nicholas Singleton', 'Kenyon Sadiq'].includes(p.name)
  ),
};

/** Bump when seed data changes so localStorage re-seeds */
export const SPORTS_AND_FUN_SEED_VERSION = 3;

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
