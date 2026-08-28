// Sports and Fun — CBS Sports Dynasty
// Roster = three CBS screenshots, minus Stevenson (traded), plus 1.05 Lemon, 2.05 Singleton, 2.09 Cooper.
// Draft board from CBS screenshots (picks 5–19). Picks 1–4 named by owner, order unconfirmed.
// Evidence from the board: 16 teams, linear (1.05 then 2.05). Scoring not confirmed.

export const LEAGUE = {
  id: 'sports-and-fun',
  name: 'Sports and Fun',
  platform: 'CBS Sports',
  format: 'Dynasty',
  season: 2026,
  teamCount: 16,
};

export const DRAFT = {
  format: 'linear',
  type: 'rookie',
  teamCount: 16,
  rounds: 22,
  mySlot: 5,
  status: 'in_progress',
  currentPick: 36,
  myNextPick: 37,
};

const TEAM_NAME = 'Scribbles';

const TEAM_BY_SLOT = {
  5: 'Scribbles',
  6: 'FREEBIRDS',
  7: 'New York Andre the...',
  8: 'Pip Fontaine',
  9: 'Joan Nico Collins',
  10: 'Todd Hartwig',
  11: 'Goodfellas',
  12: 'Team Topher',
  13: 'Krazy Killah Donutz!',
  14: 'TeSlaa On Fire',
  15: 'Under Construction',
  16: 'BB and the Starfish',
};

function teamName(slot) {
  return TEAM_BY_SLOT[slot] || `Team ${slot}`;
}

function player(id, name, positions, team, meta = {}) {
  return { id, name, positions: Array.isArray(positions) ? positions : [positions], team, ...meta };
}

function pick(overallPick, team, p, extra = {}) {
  const round = Math.ceil(overallPick / 16);
  const pickInRound = ((overallPick - 1) % 16) + 1;
  return {
    overallPick,
    round,
    pickInRound,
    slot: pickInRound,
    team,
    isMyPick: team === TEAM_NAME,
    player: p,
    ...extra,
  };
}

// Screenshot 1 — Active Players (starters).
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
  player('saf-garrett-wilson', 'Garrett Wilson', 'WR', 'NYJ', { active: false, slot: 'RWT', proj: 139.3 }),
  player('saf-makai-lemon', 'Makai Lemon', 'WR', 'PHI', { active: false, slot: 'BN', rookie: true, draftPick: '1.05' }),
  player('saf-omar-cooper', 'Omar Cooper Jr.', 'WR', 'NYJ', { active: false, slot: 'BN', rookie: true, draftPick: '2.09' }),
  player('saf-nicholas-singleton', 'Nicholas Singleton', 'RB', 'TEN', { active: false, slot: 'BN', rookie: true, draftPick: '2.05' }),
];

export const MY_TEAM = {
  name: TEAM_NAME,
  owner: null,
  draftSlot: 5,
  roster: [...ACTIVE, ...REST],
};

export const DRAFT_PICKS = [
  // 1.01 / 1.02 / 1.04: Love, Price, Tate — owner named them gone before 1.05; slot order unconfirmed.
  pick(1, teamName(1), player('saf-jeremiyah-love', 'Jeremiyah Love', 'RB', 'ARI'), { orderUnconfirmed: true }),
  pick(2, teamName(2), player('saf-jadarian-price', 'Jadarian Price', 'RB', 'SEA'), { orderUnconfirmed: true }),
  // 1.03 confirmed by owner
  pick(3, teamName(3), player('saf-mike-washington', 'Mike Washington Jr.', 'RB', 'LV')),
  pick(4, teamName(4), player('saf-carnell-tate', 'Carnell Tate', 'WR', 'TEN'), { orderUnconfirmed: true }),
  // 1.05–1.16 and 2.01–2.03 from CBS draft-board screenshots
  pick(5, 'Scribbles', player('saf-makai-lemon', 'Makai Lemon', 'WR', 'PHI', { draftPick: '1.05' })),
  pick(6, 'FREEBIRDS', player('saf-fernando-mendoza', 'Fernando Mendoza', 'QB', 'LV')),
  pick(7, 'New York Andre the...', player('saf-malachi-fields', 'Malachi Fields', 'WR', 'NYG')),
  pick(8, 'Pip Fontaine', player('saf-kenyon-sadiq', 'Kenyon Sadiq', 'TE', 'NYJ')),
  pick(9, 'Joan Nico Collins', player('saf-jordyn-tyson', 'Jordyn Tyson', 'WR', 'NO')),
  pick(10, 'Todd Hartwig', player('saf-dezhaun-stribling', "De'Zhaun Stribling", 'WR', 'SF')),
  pick(11, 'Goodfellas', player('saf-kc-concepcion', 'KC Concepcion', 'WR', 'CLE')),
  pick(12, 'Team Topher', player('saf-kaelon-black', 'Kaelon Black', 'RB', 'SF')),
  pick(13, 'Krazy Killah Donutz!', player('saf-jakobi-lane', "Ja'Kobi Lane", 'WR', 'BAL')),
  pick(14, 'TeSlaa On Fire', player('saf-denzel-boston', 'Denzel Boston', 'WR', 'CLE')),
  pick(15, 'Under Construction', player('saf-kaytron-allen', 'Kaytron Allen', 'RB', 'WAS')),
  pick(16, 'BB and the Starfish', player('saf-adam-randall', 'Adam Randall', 'RB', 'BAL')),
  pick(17, 'FREEBIRDS', player('saf-jonah-coleman', 'Jonah Coleman', 'RB', 'DEN')),
  pick(18, 'FREEBIRDS', player('saf-ty-simpson', 'Ty Simpson', 'QB', 'LAR')),
  pick(19, 'LLESSUR REMLAP', player('saf-d-stevens', 'D. Stevens', 'K', 'WAS')),
  // 2.04 (#20) not logged
  pick(21, 'Scribbles', player('saf-nicholas-singleton', 'Nicholas Singleton', 'RB', 'TEN', { draftPick: '2.05' })),
  // 2.06–2.08 since 2.05, owner-listed order
  pick(22, teamName(6), player('saf-chris-bell', 'Chris Bell', 'WR', 'MIA'), { orderUnconfirmed: true }),
  pick(23, teamName(7), player('saf-ty-johnson', 'Ty Johnson', 'RB', 'BUF'), { orderUnconfirmed: true }),
  pick(24, teamName(8), player('saf-tyler-bass', 'Tyler Bass', 'K', 'BUF'), { orderUnconfirmed: true }),
  pick(25, 'Scribbles', player('saf-omar-cooper', 'Omar Cooper Jr.', 'WR', 'NYJ', { draftPick: '2.09' })),
  // 26–35 from CBS screenshot. Team names as shown on the board (trades mean slot ≠ original owner).
  pick(26, 'Todd Hartwig', player('saf-caleb-douglas', 'Caleb Douglas', 'WR', 'MIA')),
  pick(27, 'Goodfellas', player('saf-ted-hurst', 'Ted Hurst III', 'WR', 'TB')),
  pick(28, 'Team Topher', player('saf-antonio-williams', 'Antonio Williams', 'WR', 'WAS')),
  pick(29, 'La Porta Potty', player('saf-seth-mcgowan', 'Seth McGowan', 'RB', 'IND')),
  pick(30, 'TeSlaa On Fire', player('saf-demond-claiborne', 'Demond Claiborne', 'RB', 'MIN')),
  pick(31, 'Under Construction', player('saf-zachariah-branch', 'Zachariah Branch', 'WR', 'ATL')),
  pick(32, 'BB and the Starfish', player('saf-germie-bernard', 'Germie Bernard', 'WR', 'PIT')),
  pick(33, 'FREEBIRDS', player('saf-elijah-sarratt', 'Elijah Sarratt', 'WR', 'BAL')),
  pick(34, "Soup's Kitchen", player('saf-adonai-mitchell', 'Adonai Mitchell', 'WR', 'NYJ'), { veteranLikely: true }),
  pick(35, 'LLESSUR REMLAP', player('saf-jam-miller', 'Jam Miller', 'RB', 'NE')),
];

// Pick 36 is on the board. Scribbles are next at 3.05 (#37).
// Washington went 1.03. Singleton is already on the roster. 3.05 is Stowers.
export const REMAINING_BOARD = [
  player('saf-eli-stowers', 'Eli Stowers', 'TE', 'PHI', {
    ecr: 12,
    verdict: 'TAKE',
    why: 'Best remaining prospect. 2nd-round TE2 of the class. 2026 is dead (hamstring, likely inactive). 2027 bet after Goedert.',
  }),
  player('saf-eli-raridon', 'Eli Raridon', 'TE', 'NE', {
    ecr: 28,
    verdict: 'IF STOWERS GONE',
    why: 'TE2 in New England after Julian Hill IR. Camp buzz. Take him if 36 (or pick 20) already took Stowers.',
  }),
];

export const PICK_COMPARISON = {
  overallPick: 37,
  takenOrderUnconfirmed: true,
  recommendation: {
    name: 'Eli Stowers',
    positions: ['TE'],
    team: 'PHI',
    line: 'Washington went 1.03. Take Stowers. If he is gone, take Raridon. Do not take a WR, a kicker, or Heidenreich.',
  },
  candidates: REMAINING_BOARD,
};

export const SPORTS_AND_FUN_SEED_VERSION = 8;

export function sportsAndFunDraftSeed() {
  return {
    currentPick: DRAFT.currentPick,
    draftLog: DRAFT_PICKS,
    myDraftPicks: DRAFT_PICKS.filter(p => p.isMyPick).map(p => p.player),
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
