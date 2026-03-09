// Blue Dream — CBS Sports NL-Only Baseball League
// Season 2026 | 16 Teams, 4 Divisions

export const LEAGUE = {
  id: 'blue-dream',
  name: 'Blue Dream',
  sport: 'baseball',
  platform: 'CBS Sports',
  url: 'https://bluedream.baseball.cbssports.com',
  email: 'bluedream@baseball.cbssports.com',
  season: 2026,
  entryFee: 100,
  teamCount: 16,
  divisionCount: 4,
  playerPool: 'NL',
};

export const ROSTER_LIMITS = {
  active: { min: 21, max: 21 },
  reserve: { min: 0, max: 2 },
  injured: { min: 0, max: 14 },
  minors: { min: 0, max: 5 },
  total: { min: 21, max: 42 },
};

export const ACTIVE_POSITIONS = [
  { slot: 'C',  count: 2, label: 'Catcher' },
  { slot: '1B', count: 1, label: 'First Base' },
  { slot: '2B', count: 1, label: 'Second Base' },
  { slot: '3B', count: 1, label: 'Third Base' },
  { slot: 'SS', count: 1, label: 'Shortstop' },
  { slot: 'LF', count: 1, label: 'Left Field' },
  { slot: 'CF', count: 1, label: 'Center Field' },
  { slot: 'RF', count: 1, label: 'Right Field' },
  { slot: 'OF', count: 1, label: 'OF Flex' },
  { slot: 'U',  count: 2, label: 'Utility' },
  { slot: 'SP', count: 3, label: 'Starting Pitcher' },
  { slot: 'RP', count: 3, label: 'Relief Pitcher' },
  { slot: 'P',  count: 3, label: 'Pitcher Flex' },
];

export const SCORING = {
  format: 'Head-to-Head, Most Categories',
  tiebreaker: 'None',
  playoffTiebreaker: 'XBH (Extra Base Hits)',
  batting: [
    { stat: 'BA',  label: 'Batting Average',      type: 'rate', lowerIsBetter: false },
    { stat: 'HR',  label: 'Home Runs',             type: 'count', lowerIsBetter: false },
    { stat: 'R',   label: 'Runs',                  type: 'count', lowerIsBetter: false },
    { stat: 'RBI', label: 'Runs Batted In',        type: 'count', lowerIsBetter: false },
    { stat: 'SB',  label: 'Stolen Bases',          type: 'count', lowerIsBetter: false },
  ],
  pitching: [
    { stat: 'ERA',  label: 'Earned Run Average',   type: 'rate', lowerIsBetter: true },
    { stat: 'K',    label: 'Strikeouts',            type: 'count', lowerIsBetter: false },
    { stat: 'S',    label: 'Saves',                 type: 'count', lowerIsBetter: false },
    { stat: 'W',    label: 'Wins',                  type: 'count', lowerIsBetter: false },
    { stat: 'WHIP', label: 'Walks + Hits / Inning', type: 'rate', lowerIsBetter: true },
  ],
};

export const SCHEDULE = {
  seasonStart: '2026-03-25',
  periodLength: 'Weekly',
  periodsStartDay: 'Monday',
  lineupDeadline: '5 min before first game of period per player',
  playoffsStartPeriod: 21,
  playoffsLength: 3,
  tradeDeadline: '2026-08-01',
  keeperDeadline: '2026-03-06',
};

export const DRAFT = {
  format: 'Extended Draft',
  order: 'Snake',
  date: '2026-03-07T15:00:00-05:00',
  rounds: 20,
  robot: false,
  myPick: 4,
  myTeamName: 'Scribbles',
  // Snake draft turn calculation
  getTurnPicks: (pickInRound, totalTeams = 16, totalRounds = 20) => {
    const picks = [];
    for (let round = 0; round < totalRounds; round++) {
      const isOdd = round % 2 === 0;
      const pick = isOdd
        ? (round * totalTeams) + pickInRound
        : (round * totalTeams) + (totalTeams - pickInRound + 1);
      picks.push({ round: round + 1, overallPick: pick });
    }
    return picks;
  },
};

export const WAIVERS = {
  type: 'FAB',
  budget: 100,
  runsOn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  resetRule: 'Never resets (based on prior waiver activity)',
  minDays: 1,
  zeroOffersAllowed: false,
  winningOffersCarryOver: false,
};

export const PAYOUTS = {
  regularSeason: [
    { place: 'Best Record',                       prize: 200 },
    { place: 'Division Winner (x3)',              prize: 100 },
  ],
  playoffs: [
    { place: '1st Place',  prize: 600 },
    { place: '2nd Place',  prize: 200 },
    { place: '3rd Place',  prize: 100 },
  ],
};

export const PLAYOFFS = {
  qualifiers: 6,
  structure: 'All 4 division winners + 2 Wild Cards (best record regardless of division)',
  byes: 2,
  byeRule: 'Top 2 records receive first-round byes',
  wildCardMatchup: 'WC teams play #3 and #4 seeded division winners; lowest WC plays #3 seed',
};

export const HOUSE_RULES = [
  {
    name: 'The Mookie Betts Rule 2.0',
    summary: 'NL Players Only. Any player not on CBS draft list at draft start is ineligible. AL players added mid-draft: if drafted, removed post-draft. Draft not rolled back for illegal picks.',
    detail: 'Always keep players queued. CBS will not add players to the free agent pool during the draft.',
  },
  {
    name: 'The Sean Manaea Rule 3.0',
    summary: 'Draft rolled back exactly ONCE for auto-draft owners who accidentally select a player that appears on the board incorrectly.',
    detail: 'Does not limit liberal rollbacks outside this rule. Mookie Betts Rule picks lose that draft slot — AL player dropped post-draft.',
  },
  {
    name: 'The Joc Pederson / AL Traded Compensation Rule',
    summary: 'Keeper players (traded any time) and top-5 round picks (traded during season) earn Pick of Picks (PoP) chips.',
    detail: 'Chips apply only if PoP Draft is held. Owner responsibility to post losses on main board and remind the exec committee.',
  },
  {
    name: 'Championship Perks',
    summary: 'Winner renames all divisions (tastefully) and selects the league homepage image (tastefully).',
    detail: '',
  },
  {
    name: 'Draft Speed Bonus',
    summary: '3 fastest drafters earn 2 extra PoP chips each (if PoP Draft held).',
    detail: '',
  },
  {
    name: 'AL Trade Loss Bonus',
    summary: 'Losing a top-5 pick to the AL (during season only) earns 2 extra PoP chips.',
    detail: '',
  },
];

// My team — Scribbles — 2026 keepers (10 players, deadline March 6, 2026)
export const MY_TEAM = {
  name: 'Scribbles',
  owner: 'Arthur Klein',
  draftPosition: 4,
  picks: [
    {
      round: 1,
      overallPick: 4,
      keeper: true,
      player: {
        id: 'jackson-merrill',
        name: 'Jackson Merrill',
        team: 'SD',
        positions: ['CF'],
        status: 'active',
        projectedStats: { BA: '.275', HR: 25, R: 90, RBI: 85, SB: 15 },
      },
    },
    {
      round: 3,
      overallPick: 36,
      keeper: true,
      player: {
        id: 'aaron-nola',
        name: 'Aaron Nola',
        team: 'PHI',
        positions: ['SP'],
        status: 'active',
        projectedStats: { ERA: '3.50', K: 195, W: 13, S: 0, WHIP: '1.15' },
      },
    },
    {
      round: 6,
      overallPick: 93,
      keeper: true,
      player: {
        id: 'noelvi-marte',
        name: 'Noelvi Marte',
        team: 'CIN',
        positions: ['3B', 'RF'],
        status: 'active',
        projectedStats: { BA: '.255', HR: 26, R: 82, RBI: 88, SB: 13 },
      },
    },
    {
      round: 7,
      overallPick: 100,
      keeper: true,
      player: {
        id: 'edward-cabrera',
        name: 'Edward Cabrera',
        team: 'CHC',
        positions: ['SP'],
        status: 'active',
        projectedStats: { ERA: '3.31', K: 155, W: 11, S: 0, WHIP: '1.15' },
      },
    },
    {
      round: 8,
      overallPick: 125,
      keeper: true,
      player: {
        id: 'otto-lopez',
        name: 'Otto Lopez',
        team: 'MIA',
        positions: ['2B', 'SS'],
        status: 'active',
        projectedStats: { BA: '.265', HR: 5, R: 68, RBI: 52, SB: 25 },
      },
    },
    {
      round: 9,
      overallPick: 132,
      keeper: true,
      player: {
        id: 'david-peterson',
        name: 'David Peterson',
        team: 'NYM',
        positions: ['SP'],
        status: 'active',
        projectedStats: { ERA: '3.80', K: 150, W: 10, S: 0, WHIP: '1.20' },
      },
    },
    {
      round: 10,
      overallPick: 157,
      keeper: true,
      player: {
        id: 'tommy-troy',
        name: 'Tommy Troy',
        team: 'ARI',
        positions: ['2B'],
        status: 'minors',
        projectedStats: { BA: '.260', HR: 13, R: 65, RBI: 55, SB: 21 },
        note: 'Top-100 prospect, 2026 call-up expected',
      },
    },
    {
      round: 11,
      overallPick: 164,
      keeper: true,
      player: {
        id: 'eric-haase',
        name: 'Eric Haase',
        team: 'SF',
        positions: ['C'],
        status: 'active',
        projectedStats: { BA: '.235', HR: 16, R: 50, RBI: 58, SB: 2 },
      },
    },
    {
      round: 12,
      overallPick: 189,
      keeper: true,
      player: {
        id: 'tyler-black',
        name: 'Tyler Black',
        team: 'MIL',
        positions: ['1B'],
        status: 'active',
        projectedStats: { BA: '.260', HR: 15, R: 65, RBI: 70, SB: 8 },
      },
    },
    {
      round: 13,
      overallPick: 196,
      keeper: true,
      player: {
        id: 'blake-perkins',
        name: 'Blake Perkins',
        team: 'MIL',
        positions: ['CF'],
        status: 'active',
        projectedStats: { BA: '.255', HR: 5, R: 70, RBI: 40, SB: 17 },
      },
    },
  ],
  roster: {
    active: [],
    reserve: [],
    injured: [],
    minors: ['tommy-troy'],
  },
};

// Alert picks: the 2/3 turn in a 16-team snake draft
// Round 2 pick 29 (pick 13 in round = position 16-4+1=13 → overall: 16+13=29)
// Round 3 pick 33 (pick 4 in round 3 → overall: 32+4=36... wait, snake:
//   R1: picks 1-16 (my pick = 4)
//   R2: picks 17-32 (snake, so position 4 from end = pick 17 + (16-4) = 17+12=29)
//   R3: picks 33-48 (back to forward, so pick = 32+4=36)
// Actually: R2 pick = 16 + (16 - 4 + 1) = 16 + 13 = 29 ✓
//           R3 pick = 32 + 4 = 36
export const MY_TURN_ALERTS = [
  { round: 2, overallPick: 29, label: '2/3 Turn — Round 2' },
  { round: 3, overallPick: 36, label: '2/3 Turn — Round 3' },
];
