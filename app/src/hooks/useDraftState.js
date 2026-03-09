import { useState, useCallback, useMemo } from 'react';
import { ALL_PLAYERS } from '../data/playerPool.js';
import { MY_TURN_ALERTS } from '../data/blueDream.js';

const MY_POSITION = 4; // draft pick #4 (1-indexed)
const TOTAL_TEAMS = 16;
const TOTAL_ROUNDS = 20;

const TEAMS_16 = [
  'Scribbles', 'Team 2', 'Team 3', 'Team 4',
  'Team 5', 'Team 6', 'Team 7', 'Team 8',
  'Team 9', 'Team 10', 'Team 11', 'Team 12',
  'Team 13', 'Team 14', 'Team 15', 'Team 16',
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

// Pre-seed Kyle Tucker as R1P4
const kyleTucker = ALL_PLAYERS.find(p => p.id === 'kyle-tucker-chc')
  || {
    id: 'kyle-tucker-chc',
    name: 'Kyle Tucker',
    team: 'CHC',
    positions: ['OF', 'RF'],
    type: 'batter',
    tier: 1,
    cbsRank: 1,
    stats: { AB: 0, R: 0, HR: 29, RBI: 90, SB: 20, AVG: .280, OBP: .360, SLG: .510 },
  };

const INITIAL_LOG = [
  {
    overallPick: 4,
    round: 1,
    pickInRound: 4,
    team: 'Scribbles',
    player: kyleTucker,
    isMyPick: true,
  },
];

export function useDraftState() {
  const [currentPick, setCurrentPick] = useState(5); // start after Tucker's pick
  const [draftLog, setDraftLog] = useState(INITIAL_LOG);
  const [myRoster, setMyRoster] = useState([kyleTucker]);
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
