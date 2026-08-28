// NFL Dynasty Leagues — 2026 Startup Season
// Structured league data for Californian Dynasty (Sleeper), Industry Football (CBS), Sports and Fun (CBS)

import {
  MY_TEAM as INDUSTRY_MY_TEAM,
  industryFootballDraftSeed,
  getIndustryTeamName,
} from './industryFootball.js';
import {
  MY_TEAM as SAF_MY_TEAM,
  sportsAndFunDraftSeed,
  getSportsAndFunTeamName,
  getSportsAndFunRookiePool,
  PICK_COMPARISON as SAF_PICK_COMPARISON,
  SPORTS_AND_FUN_SEED_VERSION,
} from './sportsAndFun.js';

export { SPORTS_AND_FUN_SEED_VERSION };

export const californianDynasty = {
  id: 'californian-dynasty',
  name: 'Californian Dynasty',
  sport: 'football',
  platform: 'Sleeper',
  format: 'Dynasty',
  season: 2026,
  status: 'startup',
  active: true,
  url: null,
  sleeperLeagueId: null, // set via SleeperConnect
  myTeam: {
    name: 'TBD',
    owner: 'Scribbles',
  },
  teamCount: 12,
  entryFee: 50,
  rosterLimits: {
    starters: { min: 9, max: 9 },
    bench: { min: 0, max: 15 },
    taxi: { min: 0, max: 4 },
    ir: { min: 0, max: 3 },
    total: { min: 9, max: 31 },
  },
  starterSlots: [
    { slot: 'QB', count: 1, label: 'Quarterback' },
    { slot: 'RB', count: 2, label: 'Running Back' },
    { slot: 'WR', count: 2, label: 'Wide Receiver' },
    { slot: 'TE', count: 1, label: 'Tight End' },
    { slot: 'FLEX', count: 2, label: 'RB/WR/TE Flex' },
    { slot: 'SUPERFLEX', count: 1, label: 'Superflex (QB eligible)' },
  ],
  scoring: {
    format: 'Half-PPR Dynasty',
    passing: [
      { stat: 'PASS_YDS', label: 'Passing Yards', ptsPer: 0.04 },
      { stat: 'PASS_TD', label: 'Passing TD', ptsPer: 4 },
      { stat: 'INT', label: 'Interception', ptsPer: -2 },
    ],
    rushing: [
      { stat: 'RUSH_YDS', label: 'Rushing Yards', ptsPer: 0.1 },
      { stat: 'RUSH_TD', label: 'Rushing TD', ptsPer: 6 },
    ],
    receiving: [
      { stat: 'REC', label: 'Reception (Half-PPR)', ptsPer: 0.5 },
      { stat: 'REC_YDS', label: 'Receiving Yards', ptsPer: 0.1 },
      { stat: 'REC_TD', label: 'Receiving TD', ptsPer: 6 },
    ],
    misc: [
      { stat: 'FUM_LOST', label: 'Fumble Lost', ptsPer: -2 },
      { stat: '2PT', label: '2-Point Conversion', ptsPer: 2 },
    ],
  },
  draft: {
    format: 'Startup Snake',
    type: 'startup',
    date: '2026-08-15T12:00:00-07:00',
    rounds: 25,
    order: 'Snake',
    myPick: null,
    status: 'pre-draft',
  },
  schedule: {
    seasonStart: '2026-09-10',
    tradeDeadline: '2026-11-25',
    playoffsStart: '2026-12-15',
    playoffTeams: 6,
  },
  rules: [
    {
      name: 'Dynasty Format',
      summary: 'Full dynasty — rosters carry over year to year. No redraft reset.',
      detail: 'Startup draft establishes initial rosters. Taxi squad holds up to 4 rookies/2nd-year players.',
    },
    {
      name: 'Superflex',
      summary: 'One Superflex slot — QBs, RBs, WRs, and TEs all eligible.',
      detail: 'Premium on QB value. Plan roster construction around positional scarcity.',
    },
    {
      name: 'Taxi Squad',
      summary: 'Up to 4 taxi slots for rookies and 2nd-year players only.',
      detail: 'Cannot start taxi players. Promote to bench/active when eligible.',
    },
  ],
};

export const industryFootball = {
  id: 'industry-football',
  name: 'Industry Football',
  sport: 'football',
  platform: 'CBS Sports',
  format: 'Dynasty',
  season: 2026,
  status: 'in_progress',
  active: true,
  url: null,
  myTeam: {
    name: INDUSTRY_MY_TEAM.name,
    owner: INDUSTRY_MY_TEAM.owner,
    draftSlot: INDUSTRY_MY_TEAM.draftSlot,
    roster: INDUSTRY_MY_TEAM.roster,
  },
  teamCount: 16,
  entryFee: 75,
  getTeamName: getIndustryTeamName,
  getDraftSeed: industryFootballDraftSeed,
  rosterLimits: {
    starters: { min: 8, max: 8 },
    bench: { min: 0, max: 12 },
    ir: { min: 0, max: 2 },
    total: { min: 8, max: 22 },
  },
  starterSlots: [
    { slot: 'QB', count: 1, label: 'Quarterback' },
    { slot: 'RB', count: 2, label: 'Running Back' },
    { slot: 'WR', count: 2, label: 'Wide Receiver' },
    { slot: 'TE', count: 1, label: 'Tight End' },
    { slot: 'FLEX', count: 1, label: 'RB/WR/TE Flex' },
    { slot: 'K', count: 1, label: 'Kicker' },
  ],
  scoring: {
    format: 'Standard PPR Dynasty',
    passing: [
      { stat: 'PASS_YDS', label: 'Passing Yards', ptsPer: 0.04 },
      { stat: 'PASS_TD', label: 'Passing TD', ptsPer: 4 },
      { stat: 'INT', label: 'Interception', ptsPer: -1 },
    ],
    rushing: [
      { stat: 'RUSH_YDS', label: 'Rushing Yards', ptsPer: 0.1 },
      { stat: 'RUSH_TD', label: 'Rushing TD', ptsPer: 6 },
    ],
    receiving: [
      { stat: 'REC', label: 'Reception (PPR)', ptsPer: 1 },
      { stat: 'REC_YDS', label: 'Receiving Yards', ptsPer: 0.1 },
      { stat: 'REC_TD', label: 'Receiving TD', ptsPer: 6 },
    ],
    kicking: [
      { stat: 'FG', label: 'Field Goal', ptsPer: 3 },
      { stat: 'XP', label: 'Extra Point', ptsPer: 1 },
    ],
    misc: [
      { stat: 'FUM_LOST', label: 'Fumble Lost', ptsPer: -2 },
    ],
  },
  draft: {
    format: 'linear',
    type: 'rookie',
    date: '2026-08-19T10:00:00-04:00',
    teamCount: 16,
    rounds: 22,
    mySlot: 8,
    status: 'in_progress',
    currentPick: 41,
    myNextPick: 56,
  },
  schedule: {
    seasonStart: '2026-09-10',
    tradeDeadline: '2026-11-25',
    playoffsStart: '2026-12-15',
    playoffTeams: 6,
  },
  rules: [
    {
      name: 'Dynasty Format',
      summary: 'Multi-year dynasty league on CBS Sports. Rosters persist across seasons.',
      detail: 'Startup draft in summer 2026. Keeper/trade rules per CBS league constitution.',
    },
    {
      name: 'PPR Scoring',
      summary: 'Full point per reception. Rewards pass-catching volume.',
      detail: 'Standard CBS PPR scoring with custom dynasty roster limits.',
    },
    {
      name: 'Rookie Draft',
      summary: '16-team linear rookie draft in progress. Same slot every round.',
      detail: 'Scoundrels hold 1.08 (KC Concepcion), 2.08 (Eli Stowers), 3.08 (Chris Brazzell — IR). Next pick: 4.08 (#56).',
    },
  ],
};

export const sportsAndFun = {
  id: 'sports-and-fun',
  name: 'Sports and Fun',
  sport: 'football',
  platform: 'CBS Sports',
  format: 'Dynasty',
  season: 2026,
  status: 'in_progress',
  active: true,
  url: null,
  myTeam: {
    name: SAF_MY_TEAM.name,
    owner: SAF_MY_TEAM.owner,
    draftSlot: SAF_MY_TEAM.draftSlot,
    roster: SAF_MY_TEAM.roster,
  },
  teamCount: 16,
  entryFee: 100,
  getTeamName: getSportsAndFunTeamName,
  getDraftSeed: sportsAndFunDraftSeed,
  getAvailablePool: getSportsAndFunRookiePool,
  pickComparison: SAF_PICK_COMPARISON,
  rosterLimits: {
    starters: { min: 9, max: 9 },
  },
  starterSlots: [
    { slot: 'QB', count: 1, label: 'Quarterback' },
    { slot: 'RB', count: 2, label: 'Running Back' },
    { slot: 'WR', count: 2, label: 'Wide Receiver' },
    { slot: 'TE', count: 1, label: 'Tight End' },
    { slot: 'RWT', count: 1, label: 'RB/WR/TE Flex' },
    { slot: 'K', count: 1, label: 'Kicker' },
    { slot: 'DST', count: 1, label: 'Defense / ST' },
  ],
  scoring: null,
  draft: {
    format: 'linear',
    type: 'rookie',
    date: '2026-08-01T14:00:00-04:00',
    teamCount: 16,
    rounds: 22,
    order: 'Linear',
    mySlot: 5,
    status: 'in_progress',
    currentPick: 38,
    myNextPick: 53,
  },
  schedule: {
    seasonStart: '2026-09-10',
    tradeDeadline: '2026-11-25',
    playoffsStart: '2026-12-15',
    playoffTeams: 4,
  },
  rules: [
    {
      name: 'Dynasty Format',
      summary: 'Casual-competitive dynasty on CBS. Rosters carry over indefinitely.',
      detail: 'Startup draft establishes initial rosters. Commissioner sets constitution on CBS.',
    },
    {
      name: 'Rookie Draft',
      summary: '16-team linear. Scribbles hold slot #5 — next pick 4.05 (#53).',
      detail: '1.05 Makai Lemon. 2.05 Nicholas Singleton. 2.09 Omar Cooper Jr. 3.05 Eli Stowers. 4.05 hunt a 2026 veteran RB.',
    },
  ],
};

export const FOOTBALL_LEAGUES = [californianDynasty, industryFootball, sportsAndFun];

export function getFootballLeague(id) {
  return FOOTBALL_LEAGUES.find(l => l.id === id) || null;
}

export function isFootballLeague(id) {
  return FOOTBALL_LEAGUES.some(l => l.id === id);
}

// Top dynasty startup targets for pre-draft planning
export const STARTUP_TIER_1 = [
  { id: '4881', name: 'Patrick Mahomes', team: 'KC', positions: ['QB'], age: 30, tier: 1 },
  { id: '6794', name: 'Josh Allen', team: 'BUF', positions: ['QB'], age: 29, tier: 1 },
  { id: '6904', name: 'Ja\'Marr Chase', team: 'CIN', positions: ['WR'], age: 25, tier: 1 },
  { id: '7564', name: 'Bijan Robinson', team: 'ATL', positions: ['RB'], age: 23, tier: 1 },
  { id: '8130', name: 'CeeDee Lamb', team: 'DAL', positions: ['WR'], age: 26, tier: 1 },
  { id: '8150', name: 'Justin Jefferson', team: 'MIN', positions: ['WR'], age: 26, tier: 1 },
  { id: '9221', name: 'Jahmyr Gibbs', team: 'DET', positions: ['RB'], age: 23, tier: 1 },
  { id: '9224', name: 'Marvin Harrison Jr.', team: 'ARI', positions: ['WR'], age: 23, tier: 1 },
  { id: '9509', name: 'Brock Bowers', team: 'LV', positions: ['TE'], age: 22, tier: 1 },
  { id: '11560', name: 'Ashton Jeanty', team: 'LV', positions: ['RB'], age: 21, tier: 1 },
];

export const STARTUP_TIER_2 = [
  { id: '4984', name: 'Lamar Jackson', team: 'BAL', positions: ['QB'], age: 28, tier: 2 },
  { id: '5849', name: 'Christian McCaffrey', team: 'SF', positions: ['RB'], age: 29, tier: 2 },
  { id: '6813', name: 'Amon-Ra St. Brown', team: 'DET', positions: ['WR'], age: 25, tier: 2 },
  { id: '7523', name: 'Nico Collins', team: 'HOU', positions: ['WR'], age: 26, tier: 2 },
  { id: '8146', name: 'Jonathan Taylor', team: 'IND', positions: ['RB'], age: 26, tier: 2 },
  { id: '8151', name: 'Tee Higgins', team: 'CIN', positions: ['WR'], age: 26, tier: 2 },
  { id: '9226', name: 'Malik Nabers', team: 'NYG', positions: ['WR'], age: 22, tier: 2 },
  { id: '9508', name: 'Brian Thomas Jr.', team: 'JAX', positions: ['WR'], age: 22, tier: 2 },
  { id: '9758', name: 'Ladd McConkey', team: 'LAC', positions: ['WR'], age: 23, tier: 2 },
  { id: '11584', name: 'Travis Hunter', team: 'JAX', positions: ['WR', 'CB'], age: 22, tier: 2 },
];

export const ALL_STARTUP_TARGETS = [...STARTUP_TIER_1, ...STARTUP_TIER_2];
