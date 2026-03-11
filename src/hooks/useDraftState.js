import { useState, useCallback, useMemo } from 'react';
import { ALL_PLAYERS } from '../data/playerPool.js';
import { MY_TURN_ALERTS } from '../data/blueDream.js';

const MY_POSITION = 4; // draft pick #4 (1-indexed)
const TOTAL_TEAMS = 16;
const TOTAL_ROUNDS = 20;

// Indexed by draft position (0-indexed), position 4 = Scribbles at index 3
const TEAMS_16 = [
  'Kershaw4Prez', '!!!!!!!!!!', 'DoyersBlue', 'Scribbles',
  'HRs per Hot Dog', 'Cosmodelic', 'Homework', 'Slugs',
  'Five Tools', 'Lunchadores', 'Foots Zeckelman', 'Antitrust Exemption',
  'Beavers', 'TOKYO GODZILLAS', 'Blue Monsters', 'DH 4 LIFE',
];

function pickPosition(overallPick) {
  const round = Math.ceil(overallPick / TOTAL_TEAMS);
  const pickInRound = overallPick - (round - 1) * TOTAL_TEAMS;
  const isOddRound = round % 2 === 1;
  return isOddRound ? pickInRound : TOTAL_TEAMS - pickInRound + 1;
}

function getPickOwner(overallPick) {
  return TEAMS_16[pickPosition(overallPick) - 1];
}

function isMyPick(overallPick) {
  return pickPosition(overallPick) === MY_POSITION;
}

// ── My current roster (keepers + R1P4 draft pick as of 3/25/2026) ──────────
const MY_ROSTER_INIT = [
  // R1P4 draft pick
  { id: 'kyle-tucker-lad',    name: 'Kyle Tucker',    team: 'LAD', positions: ['RF', 'OF'], type: 'batter',  projectedStats: { BA: .283, R: 101, HR: 25, RBI: 80, SB: 24 } },
  // Keepers
  { id: 'jackson-merrill-sd', name: 'Jackson Merrill', team: 'SD',  positions: ['CF', 'OF'], type: 'batter',  projectedStats: { BA: .297, R: 83,  HR: 25, RBI: 97, SB: 8  } },
  { id: 'tyler-black-mil',    name: 'Tyler Black',    team: 'MIL', positions: ['1B'],        type: 'batter',  projectedStats: { BA: .256, R: 42,  HR: 11, RBI: 45, SB: 5  } },
  { id: 'noelvi-marte-cin',   name: 'Noelvi Marte',   team: 'CIN', positions: ['3B', 'RF'],  type: 'batter',  projectedStats: { BA: .276, R: 63,  HR: 26, RBI: 70, SB: 13 } },
  { id: 'otto-lopez-mia',     name: 'Otto Lopez',     team: 'MIA', positions: ['2B', 'SS'],  type: 'batter',  projectedStats: { BA: .261, R: 63,  HR: 17, RBI: 72, SB: 14 } },
  { id: 'blake-perkins-mil',  name: 'Blake Perkins',  team: 'MIL', positions: ['CF', 'OF'],  type: 'batter',  projectedStats: { BA: .234, R: 52,  HR: 8,  RBI: 45, SB: 17 } },
  { id: 'eric-haase-sf',      name: 'Eric Haase',     team: 'SF',  positions: ['C'],          type: 'batter',  projectedStats: { BA: .256, R: 43,  HR: 13, RBI: 47, SB: 2  } },
  { id: 'tommy-troy-ari',     name: 'Tommy Troy',     team: 'ARI', positions: ['SS', '2B'],  type: 'batter',  projectedStats: { BA: .260, R: 65,  HR: 13, RBI: 55, SB: 21 }, status: 'minors' },
  { id: 'aaron-nola-phi',     name: 'Aaron Nola',     team: 'PHI', positions: ['SP'],         type: 'pitcher', projectedStats: { ERA: 4.14, WHIP: 1.25, W: 10, K: 150, S: 0 } },
  { id: 'edward-cabrera-chc', name: 'Edward Cabrera', team: 'CHC', positions: ['SP'],         type: 'pitcher', projectedStats: { ERA: 3.31, WHIP: 1.15, W: 8,  K: 145, S: 0 } },
  { id: 'david-peterson-nym', name: 'David Peterson', team: 'NYM', positions: ['SP'],         type: 'pitcher', projectedStats: { ERA: 3.60, WHIP: 1.31, W: 10, K: 131, S: 0 } },
];

// ── Draft log: R1 complete + R2 picks 1-12 (actual picks as of 3/25/2026) ──
function stub(id, name, team, positions) {
  return { id, name, team, positions, type: positions[0] === 'SP' || positions[0] === 'RP' ? 'pitcher' : 'batter' };
}
const INITIAL_LOG = [
  // Round 1
  { overallPick:  1, round: 1, pickInRound:  1, team: 'Kershaw4Prez',       isMyPick: false, player: stub('shohei-ohtani-lad',    'Shohei Ohtani',      'LAD', ['U','SP']) },
  { overallPick:  2, round: 1, pickInRound:  2, team: '!!!!!!!!!!',          isMyPick: false, player: stub('ronald-acuna-atl',     'Ronald Acuna Jr.',   'ATL', ['RF']) },
  { overallPick:  3, round: 1, pickInRound:  3, team: 'DoyersBlue',          isMyPick: false, player: stub('juan-soto-nym',        'Juan Soto',          'NYM', ['RF']) },
  { overallPick:  4, round: 1, pickInRound:  4, team: 'Scribbles',           isMyPick: true,  player: MY_ROSTER_INIT[0] },
  { overallPick:  5, round: 1, pickInRound:  5, team: 'HRs per Hot Dog',     isMyPick: false, player: stub('yoshinobu-yamamoto-lad','Yoshinobu Yamamoto', 'LAD', ['SP']) },
  { overallPick:  6, round: 1, pickInRound:  6, team: 'Cosmodelic',          isMyPick: false, player: stub('kyle-schwarber-phi',   'Kyle Schwarber',     'PHI', ['U']) },
  { overallPick:  7, round: 1, pickInRound:  7, team: 'Homework',            isMyPick: false, player: stub('paul-skenes-pit',      'Paul Skenes',        'PIT', ['SP']) },
  { overallPick:  8, round: 1, pickInRound:  8, team: 'Slugs',               isMyPick: false, player: stub('mookie-betts-lad',     'Mookie Betts',       'LAD', ['SS']) },
  { overallPick:  9, round: 1, pickInRound:  9, team: 'Five Tools',          isMyPick: false, player: stub('francisco-lindor-nym', 'Francisco Lindor',   'NYM', ['SS']) },
  { overallPick: 10, round: 1, pickInRound: 10, team: 'Lunchadores',         isMyPick: false, player: stub('manny-machado-sd',     'Manny Machado',      'SD',  ['3B']) },
  { overallPick: 11, round: 1, pickInRound: 11, team: 'Foots Zeckelman',     isMyPick: false, player: stub('rafael-devers-sf',     'Rafael Devers',      'SF',  ['1B']) },
  { overallPick: 12, round: 1, pickInRound: 12, team: 'Antitrust Exemption', isMyPick: false, player: stub('bryce-harper-phi',     'Bryce Harper',       'PHI', ['1B']) },
  { overallPick: 13, round: 1, pickInRound: 13, team: 'Beavers',             isMyPick: false, player: stub('matt-olson-atl',       'Matt Olson',         'ATL', ['1B']) },
  { overallPick: 14, round: 1, pickInRound: 14, team: 'TOKYO GODZILLAS',     isMyPick: false, player: stub('freddie-freeman-lad',  'Freddie Freeman',    'LAD', ['1B']) },
  { overallPick: 15, round: 1, pickInRound: 15, team: 'Blue Monsters',       isMyPick: false, player: stub('austin-riley-atl',     'Austin Riley',       'ATL', ['3B']) },
  { overallPick: 16, round: 1, pickInRound: 16, team: 'DH 4 LIFE',           isMyPick: false, player: stub('mason-miller-sdp',     'Mason Miller',       'SD',  ['RP']) },
  // Round 2 (snake reverses — DH 4 LIFE picks first)
  { overallPick: 17, round: 2, pickInRound: 16, team: 'DH 4 LIFE',           isMyPick: false, player: stub('bo-bichette-nym',      'Bo Bichette',        'NYM', ['SS']) },
  { overallPick: 18, round: 2, pickInRound: 15, team: 'Blue Monsters',       isMyPick: false, player: stub('brice-turang-mil',     'Brice Turang',       'MIL', ['2B']) },
  { overallPick: 19, round: 2, pickInRound: 14, team: 'TOKYO GODZILLAS',     isMyPick: false, player: stub('michael-harris-atl',   'Michael Harris',     'ATL', ['CF']) },
  { overallPick: 20, round: 2, pickInRound: 13, team: 'Beavers',             isMyPick: false, player: stub('cristopher-sanchez-phi','Cristopher Sanchez', 'PHI', ['SP']) },
  { overallPick: 21, round: 2, pickInRound: 12, team: 'Antitrust Exemption', isMyPick: false, player: stub('christian-yelich-mil', 'Christian Yelich',   'MIL', ['LF']) },
  { overallPick: 22, round: 2, pickInRound: 11, team: 'Foots Zeckelman',     isMyPick: false, player: stub('willy-adames-sf',      'Willy Adames',       'SF',  ['SS']) },
  { overallPick: 23, round: 2, pickInRound: 10, team: 'Lunchadores',         isMyPick: false, player: stub('edwin-diaz-lad',       'Edwin Diaz',         'LAD', ['RP']) },
  { overallPick: 24, round: 2, pickInRound:  9, team: 'Five Tools',          isMyPick: false, player: stub('seiya-suzuki-chc',     'Seiya Suzuki',       'CHC', ['LF','RF']) },
  { overallPick: 25, round: 2, pickInRound:  8, team: 'Slugs',               isMyPick: false, player: stub('luis-robert-nym',      'Luis Robert',        'NYM', ['CF']) },
  { overallPick: 26, round: 2, pickInRound:  7, team: 'Homework',            isMyPick: false, player: stub('chris-sale-atl',       'Chris Sale',         'ATL', ['SP']) },
  { overallPick: 27, round: 2, pickInRound:  6, team: 'Cosmodelic',          isMyPick: false, player: stub('eugenio-suarez-cin',   'Eugenio Suarez',     'CIN', ['3B']) },
  { overallPick: 28, round: 2, pickInRound:  5, team: 'HRs per Hot Dog',     isMyPick: false, player: stub('alex-bregman-chc',     'Alex Bregman',       'CHC', ['3B']) },
  // Pick 29 (R2P13 = Scribbles) — Jhoan Duran RP
  { overallPick: 29, round: 2, pickInRound: 4, team: 'Scribbles', isMyPick: true, player: stub('jhoan-duran-phi', 'Jhoan Duran', 'PHI', ['RP']) },
];

// Add Duran to my roster
MY_ROSTER_INIT.push({ id: 'jhoan-duran-phi', name: 'Jhoan Duran', team: 'PHI', positions: ['RP'], type: 'pitcher', projectedStats: { ERA: 2.29, WHIP: 1.08, W: 2, K: 72, S: 37 } });

export function useDraftState() {
  const [currentPick, setCurrentPick] = useState(30); // R2P14 — DoyersBlue is on the clock
  const [draftLog, setDraftLog] = useState(INITIAL_LOG);
  const [myRoster, setMyRoster] = useState(MY_ROSTER_INIT);
  const [sessionToken, setSessionToken] = useState('');
  const [leagueId, setLeagueId] = useState('');

  const takenIds = useMemo(() => new Set(draftLog.map(d => d.player?.id)), [draftLog]);

  const available = useMemo(
    () => ALL_PLAYERS.filter(p => !takenIds.has(p.id)),
    [takenIds]
  );

  const isMyTurn = isMyPick(currentPick);
  const alertForThisPick = MY_TURN_ALERTS.find(a => a.overallPick === currentPick);

  const draftPlayer = useCallback((player) => {
    const round = Math.ceil(currentPick / TOTAL_TEAMS);
    const pickInRound = currentPick - (round - 1) * TOTAL_TEAMS;
    const myTurn = isMyPick(currentPick);
    const team = getPickOwner(currentPick);

    setDraftLog(prev => [...prev, {
      overallPick: currentPick,
      round,
      pickInRound,
      team,
      player,
      isMyPick: myTurn,
    }]);
    if (myTurn) setMyRoster(prev => [...prev, player]);
    setCurrentPick(prev => prev + 1);
  }, [currentPick]);

  const advancePick = useCallback(() => {
    setCurrentPick(prev => prev + 1);
  }, []);

  const upcomingMyPicks = useMemo(() => {
    const picks = [];
    for (let p = currentPick; p <= TOTAL_TEAMS * TOTAL_ROUNDS; p++) {
      if (isMyPick(p)) picks.push(p);
      if (picks.length >= 3) break;
    }
    return picks;
  }, [currentPick]);

  return {
    currentPick,
    draftLog,
    available,
    myRoster,
    isMyTurn,
    alertForThisPick,
    upcomingMyPicks,
    draftPlayer,
    advancePick,
    sessionToken,
    setSessionToken,
    leagueId,
    setLeagueId,
    totalPlayers: ALL_PLAYERS.length,
  };
}
