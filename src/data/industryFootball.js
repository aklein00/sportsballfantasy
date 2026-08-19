// Industry Football — CBS Sports Dynasty
// My team: Scoundrels (Arthur Klein) · Draft slot 8 · Linear 16-team rookie draft

export const LEAGUE = {
  id: 'industry-football',
  name: 'Industry Football',
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
  mySlot: 8,
  status: 'in_progress',
  currentPick: 25,
  myNextPick: 40,
};

function teamName(slot) {
  return slot === 8 ? 'Scoundrels' : `Team ${slot}`;
}

function player(id, name, positions, team, meta = {}) {
  return { id, name, positions: Array.isArray(positions) ? positions : [positions], team, ...meta };
}

// Rookie draft picks 1–24 (from CBS, as of 2026-08-19)
export const DRAFT_PICKS = [
  { overallPick: 1,  round: 1, pickInRound: 1,  slot: 1,  team: teamName(1),  isMyPick: false, player: player('if-jeremiyah-love',      'Jeremiyah Love',      'RB', 'ARI') },
  { overallPick: 2,  round: 1, pickInRound: 2,  slot: 2,  team: teamName(2),  isMyPick: false, player: player('if-jadarian-price',      'Jadarian Price',      'RB', 'ND') },
  { overallPick: 3,  round: 1, pickInRound: 3,  slot: 3,  team: teamName(3),  isMyPick: false, player: player('if-fernando-mendoza',    'Fernando Mendoza',    'QB', 'LV') },
  { overallPick: 4,  round: 1, pickInRound: 4,  slot: 4,  team: teamName(4),  isMyPick: false, player: player('if-carnell-tate',        'Carnell Tate',        'WR', 'OSU') },
  { overallPick: 5,  round: 1, pickInRound: 5,  slot: 5,  team: teamName(5),  isMyPick: false, player: player('if-makai-lemon',         'Makai Lemon',         'WR', 'USC') },
  { overallPick: 6,  round: 1, pickInRound: 6,  slot: 6,  team: teamName(6),  isMyPick: false, player: player('if-jordyn-tyson',        'Jordyn Tyson',        'WR', 'ASU') },
  { overallPick: 7,  round: 1, pickInRound: 7,  slot: 7,  team: teamName(7),  isMyPick: false, player: player('if-dezhaun-stribling',   "De'Zhaun Stribling",  'WR', 'MIA') },
  { overallPick: 8,  round: 1, pickInRound: 8,  slot: 8,  team: 'Scoundrels', isMyPick: true,  player: player('if-kc-concepcion',       'KC Concepcion',       'WR', 'CLE', { draftPick: '1.08' }) },
  { overallPick: 9,  round: 1, pickInRound: 9,  slot: 9,  team: teamName(9),  isMyPick: false, player: player('if-kenyon-sadiq',        'Kenyon Sadiq',        'TE', 'ORE') },
  { overallPick: 10, round: 1, pickInRound: 10, slot: 10, team: teamName(10), isMyPick: false, player: player('if-jakobi-lane',         "Ja'Kobi Lane",        'WR', 'BAL') },
  { overallPick: 11, round: 1, pickInRound: 11, slot: 11, team: teamName(11), isMyPick: false, player: player('if-denzel-boston',       'Denzel Boston',       'WR', 'WAS') },
  { overallPick: 12, round: 1, pickInRound: 12, slot: 12, team: teamName(12), isMyPick: false, player: player('if-chris-douglas',       'Chris Douglas',       'WR', 'UNC') },
  { overallPick: 13, round: 1, pickInRound: 13, slot: 13, team: teamName(13), isMyPick: false, player: player('if-omar-cooper',         'Omar Cooper Jr.',     'WR', 'IND') },
  { overallPick: 14, round: 1, pickInRound: 14, slot: 14, team: teamName(14), isMyPick: false, player: player('if-jonah-coleman',       'Jonah Coleman',       'RB', 'WAS') },
  { overallPick: 15, round: 1, pickInRound: 15, slot: 15, team: teamName(15), isMyPick: false, player: player('if-antonio-williams',    'Antonio Williams',    'RB', 'CLEM') },
  { overallPick: 16, round: 1, pickInRound: 16, slot: 16, team: teamName(16), isMyPick: false, player: player('if-ty-simpson',          'Ty Simpson',          'QB', 'ALA') },
  { overallPick: 17, round: 2, pickInRound: 1,  slot: 1,  team: teamName(1),  isMyPick: false, player: player('if-nick-singleton',      'Nick Singleton',      'RB', 'PSU') },
  { overallPick: 18, round: 2, pickInRound: 2,  slot: 2,  team: teamName(2),  isMyPick: false, player: player('if-kaleb-black',         'Kaleb Black',         'WR', 'TAMU') },
  { overallPick: 19, round: 2, pickInRound: 3,  slot: 3,  team: teamName(3),  isMyPick: false, player: player('if-chris-bell',          'Chris Bell',          'WR', 'LOU') },
  { overallPick: 20, round: 2, pickInRound: 4,  slot: 4,  team: teamName(4),  isMyPick: false, player: player('if-mark-washington',     'Mark Washington',     'WR', 'UGA') },
  { overallPick: 21, round: 2, pickInRound: 5,  slot: 5,  team: teamName(5),  isMyPick: false, player: player('if-emmett-johnson',      'Emmett Johnson',      'RB', 'NEB') },
  { overallPick: 22, round: 2, pickInRound: 6,  slot: 6,  team: teamName(6),  isMyPick: false, player: player('if-antwain-randall',     'Antwain Randall',     'WR', 'RUT') },
  { overallPick: 23, round: 2, pickInRound: 7,  slot: 7,  team: teamName(7),  isMyPick: false, player: player('if-malachi-fields',      'Malachi Fields',      'WR', 'NYG') },
  { overallPick: 24, round: 2, pickInRound: 8,  slot: 8,  team: 'Scoundrels', isMyPick: true,  player: player('if-eli-stowers',         'Eli Stowers',         'TE', 'PHI', { draftPick: '2.08' }) },
];

export const MY_TEAM = {
  name: 'Scoundrels',
  owner: 'Arthur Klein',
  draftSlot: 8,
  roster: [
    // QB
    player('if-justin-herbert', 'Justin Herbert', 'QB', 'LAC'),
    player('if-cam-ward',       'Cam Ward',       'QB', 'TEN'),
    // RB
    player('if-omarion-hampton', 'Omarion Hampton', 'RB', 'LAC', { note: 'cornerstone' }),
    player('if-zach-charbonnet', 'Zach Charbonnet', 'RB', 'SEA', { status: 'PUP' }),
    player('if-rachaad-white',   'Rachaad White',   'RB', 'TB'),
    player('if-monangai',        'Monangai',        'RB', 'CHI'),
    // WR
    player('if-justin-jefferson', 'Justin Jefferson', 'WR', 'MIN', { note: 'alpha' }),
    player('if-kc-concepcion',    'KC Concepcion',    'WR', 'CLE', { draftPick: '1.08', rookie: true }),
    player('if-davante-adams',    'Davante Adams',    'WR', 'LAR'),
    player('if-deebo-samuel',     'Deebo Samuel',     'WR', 'WAS'),
    player('if-jalen-mcmillan',   'Jalen McMillan',   'WR', 'TB'),
    player('if-jayden-reed',      'Jayden Reed',      'WR', 'GB'),
    player('if-tyreek-hill',      'Tyreek Hill',      'WR', 'MIA', { note: '0.0 CBS proj — likely cut' }),
    // TE
    player('if-tucker-kraft',  'Tucker Kraft',  'TE', 'GB',  { note: 'TE1' }),
    player('if-eli-stowers',   'Eli Stowers',   'TE', 'PHI', { draftPick: '2.08', rookie: true }),
    player('if-noah-fant',     'Noah Fant',     'TE', 'CIN'),
    player('if-cole-kmet',     'Cole Kmet',     'TE', 'CHI'),
    player('if-irv-smith',     'Irv Smith Jr.', 'TE', 'HOU'),
  ],
};

/** Seed draft board state for first visit (localStorage empty) */
export function industryFootballDraftSeed() {
  const myDraftPicks = DRAFT_PICKS.filter(p => p.isMyPick).map(p => p.player);
  return {
    currentPick: DRAFT.currentPick,
    draftLog: DRAFT_PICKS,
    myDraftPicks,
    myRoster: MY_TEAM.roster,
  };
}

export function getIndustryTeamName(slot) {
  return teamName(slot);
}
