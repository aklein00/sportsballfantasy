// Football startup draft state — per-league mock + planning mode
import { useState, useCallback, useMemo } from 'react';
import { ALL_STARTUP_TARGETS, getFootballLeague } from '../data/footballLeagues.js';

function pickPosition(overallPick, totalTeams) {
  const round = Math.ceil(overallPick / totalTeams);
  const pickInRound = overallPick - (round - 1) * totalTeams;
  const isOddRound = round % 2 === 1;
  return isOddRound ? pickInRound : totalTeams - pickInRound + 1;
}

function buildTeamNames(count) {
  return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
}

export function useFootballDraftState(leagueId) {
  const league = getFootballLeague(leagueId);
  const totalTeams = league?.teamCount || 12;
  const totalRounds = league?.draft?.rounds || 20;
  const myPick = league?.draft?.myPick || Math.ceil(totalTeams / 2);

  const teamNames = useMemo(() => buildTeamNames(totalTeams), [totalTeams]);

  const [currentPick, setCurrentPick] = useState(1);
  const [draftLog, setDraftLog] = useState([]);
  const [myRoster, setMyRoster] = useState([]);
  const [queuedIds, setQueuedIds] = useState([]);

  const takenIds = useMemo(() => new Set(draftLog.map(d => d.player?.id)), [draftLog]);

  const available = useMemo(
    () => ALL_STARTUP_TARGETS.filter(p => !takenIds.has(p.id)),
    [takenIds]
  );

  const isMyTurn = pickPosition(currentPick, totalTeams) === myPick;

  const getPickOwner = useCallback((overallPick) => {
    const pos = pickPosition(overallPick, totalTeams);
    return teamNames[pos - 1];
  }, [totalTeams, teamNames]);

  const draftPlayer = useCallback((player) => {
    const round = Math.ceil(currentPick / totalTeams);
    const pickInRound = currentPick - (round - 1) * totalTeams;
    const myTurn = pickPosition(currentPick, totalTeams) === myPick;
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
  }, [currentPick, totalTeams, myPick, getPickOwner]);

  const advancePick = useCallback(() => {
    setCurrentPick(prev => prev + 1);
  }, []);

  const queuePlayer = useCallback((playerId) => {
    setQueuedIds(prev => prev.includes(playerId) ? prev : [...prev, playerId]);
  }, []);

  const dequeuePlayer = useCallback((playerId) => {
    setQueuedIds(prev => prev.filter(id => id !== playerId));
  }, []);

  const upcomingMyPicks = useMemo(() => {
    const picks = [];
    for (let p = currentPick; p <= totalTeams * totalRounds; p++) {
      if (pickPosition(p, totalTeams) === myPick) picks.push(p);
      if (picks.length >= 3) break;
    }
    return picks;
  }, [currentPick, totalTeams, totalRounds, myPick]);

  const queuedPlayers = useMemo(
    () => queuedIds.map(id => ALL_STARTUP_TARGETS.find(p => p.id === id)).filter(Boolean),
    [queuedIds]
  );

  return {
    league,
    currentPick,
    draftLog,
    available,
    myRoster,
    isMyTurn,
    upcomingMyPicks,
    draftPlayer,
    advancePick,
    queuePlayer,
    dequeuePlayer,
    queuedPlayers,
    totalTeams,
    totalRounds,
    myPick,
    getPickOwner,
  };
}
