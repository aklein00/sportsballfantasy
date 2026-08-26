// Sports and Fun — CBS Sports Dynasty
// Roster = ONLY the players in the three CBS screenshots, plus 1.05 Makai Lemon.
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
  currentPick: 20,
  myNextPick: 21,
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
  player('saf-rhamondre-stevenson', 'Rhamondre Stevenson', 'RB', 'NE', { active: false, slot: 'RWT', proj: 133.1 }),
  player('saf-garrett-wilson', 'Garrett Wilson', 'WR', 'NYJ', { active: false, slot: 'RWT', proj: 139.3 }),
  player('saf-makai-lemon', 'Makai Lemon', 'WR', 'PHI', { active: false, slot: 'BN', rookie: true, draftPick: '1.05' }),
];

export const MY_TEAM = {
  name: TEAM_NAME,
  owner: null,
  draftSlot: 5,
  roster: [...ACTIVE, ...REST],
};

export const DRAFT_PICKS = [
  // 1.01–1.04: owner said these four were gone before 1.05. Slot order unconfirmed.
  pick(1, teamName(1), player('saf-jeremiyah-love', 'Jeremiyah Love', 'RB', 'ARI'), { orderUnconfirmed: true }),
  pick(2, teamName(2), player('saf-jadarian-price', 'Jadarian Price', 'RB', 'SEA'), { orderUnconfirmed: true }),
  pick(3, teamName(3), player('saf-carnell-tate', 'Carnell Tate', 'WR', 'TEN'), { orderUnconfirmed: true }),
  pick(4, teamName(4), player('saf-mike-washington', 'Mike Washington Jr.', 'RB', 'LV'), { orderUnconfirmed: true }),
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
];

// Still on the board at 2.05 (pick 21). 2.04 (#20) has not been logged.
export const REMAINING_BOARD = [
  player('saf-nicholas-singleton', 'Nicholas Singleton', 'RB', 'TEN', {
    ecr: 15,
    verdict: 'TAKE',
    why: 'Best remaining RB. You took WR at 1.05. Hall needs a young partner; Coleman/Allen/Black/Randall are gone.',
  }),
  player('saf-omar-cooper', 'Omar Cooper Jr.', 'WR', 'NYJ', {
    ecr: 8,
    verdict: 'STEAL',
    why: 'Best player left (consensus ~8). Only take him if you refuse to force the RB. You already have Chase, G. Wilson, Lemon.',
  }),
  player('saf-emmett-johnson', 'Emmett Johnson', 'RB', 'KC', {
    ecr: 17,
    verdict: 'IF SINGLETON GONE',
    why: 'Next RB. Chiefs RB2 behind Walker. Take him if #20 grabs Singleton.',
  }),
  player('saf-eli-stowers', 'Eli Stowers', 'TE', 'PHI', {
    ecr: 11,
    verdict: 'PASS',
    why: 'Value TE, but you already have Kincaid and Juwan Johnson.',
  }),
  player('saf-antonio-williams', 'Antonio Williams', 'WR', 'WAS', {
    ecr: 13,
    verdict: 'PASS',
    why: 'More WR. You just took Lemon.',
  }),
  player('saf-chris-bell', 'Chris Bell', 'WR', 'MIA', {
    ecr: 14,
    verdict: 'LATER',
    why: 'Fine in round 3. Not 2.05.',
  }),
  player('saf-germie-bernard', 'Germie Bernard', 'WR', 'PIT', {
    ecr: 16,
    verdict: 'LATER',
    why: 'Round-3 WR. Pass at 2.05.',
  }),
  player('saf-demond-claiborne', 'Demond Claiborne', 'RB', 'MIN', {
    ecr: 28,
    verdict: 'LATER',
    why: 'Depth RB. Only if Singleton and Johnson are both gone.',
  }),
];

export const PICK_COMPARISON = {
  overallPick: 21,
  takenOrderUnconfirmed: true,
  recommendation: {
    name: 'Nicholas Singleton',
    positions: ['RB'],
    team: 'TEN',
    line: 'Take Singleton. You already got Lemon. Coleman is gone — this is the RB. Cooper is the leftover first-round WR if you will not force it.',
  },
  candidates: REMAINING_BOARD.filter(p =>
    ['Nicholas Singleton', 'Omar Cooper Jr.', 'Emmett Johnson', 'Eli Stowers'].includes(p.name)
  ),
  followUp: {
    overallPick: 25,
    label: '2.09 AFTER THE STEVENSON TRADE',
    recommendation: {
      name: 'The other RB',
      positions: ['RB'],
      team: '—',
      line: 'Singleton at 2.05 → Johnson at 2.09. Johnson at 2.05 → Singleton at 2.09. If both are gone: Omar Cooper, then Antonio Williams. Not Stowers. Not a kicker.',
    },
    candidates: [
      player('saf-emmett-johnson-25', 'Emmett Johnson', 'RB', 'KC', {
        verdict: 'TAKE IF SINGLETON AT 2.05',
        why: 'Replaces Stevenson with a second young RB. Chiefs RB2 behind Walker.',
      }),
      player('saf-nicholas-singleton-25', 'Nicholas Singleton', 'RB', 'TEN', {
        verdict: 'TAKE IF JOHNSON AT 2.05',
        why: 'Same idea in reverse. Best remaining Titan back.',
      }),
      player('saf-omar-cooper-25', 'Omar Cooper Jr.', 'WR', 'NYJ', {
        verdict: 'IF BOTH RBs GONE',
        why: 'Best player left. Only if Singleton and Johnson are both off the board.',
      }),
      player('saf-antonio-williams-25', 'Antonio Williams', 'WR', 'WAS', {
        verdict: 'NEXT WR',
        why: 'If Cooper is gone too. Then Chris Bell / Germie Bernard. Skip Stowers — you have Kincaid.',
      }),
    ],
  },
};

export const SPORTS_AND_FUN_SEED_VERSION = 4;

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
