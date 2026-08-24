// Per-league football draft board — localStorage persistence, linear + snake formats
import { useState, useCallback, useMemo, useEffect } from 'react';
import { ALL_STARTUP_TARGETS, getFootballLeague } from '../data/footballLeagues.js';
import { INDUSTRY_SEED_VERSION } from '../data/industryFootball.js';
import { SPORTS_AND_FUN_SEED_VERSION } from '../data/sportsAndFun.js';

const STORAGE_PREFIX = 'sbf_football_draft_';

const SEED_VERSIONS = {
  'industry-football': INDUSTRY_SEED_VERSION,
  'sports-and-fun': SPORTS_AND_FUN_SEED_VERSION,
};

function storageKey(leagueId) {
  return `${STORAGE_PREFIX}${leagueId}`;
}

function loadState(leagueId) {
  try {
    const raw = localStorage.getItem(storageKey(leagueId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(leagueId, state) {
  try {
    localStorage.setItem(storageKey(leagueId), JSON.stringify(state));
  } catch {
    // fail silently
  }
}

function pickSlot(overallPick, totalTeams, order) {
  const pickInRound = ((overallPick - 1) % totalTeams) + 1;
  if (order === 'linear') return pickInRound;
  const round = Math.ceil(overallPick / totalTeams);
  const isOddRound = round % 2 === 1;
  return isOddRound ? pickInRound : totalTeams - pickInRound + 1;
}

function getTeamNames(league) {
  if (league.getTeamName) {
    return Array.from({ length: league.teamCount }, (_, i) => league.getTeamName(i + 1));
  }
  return Array.from({ length: league.teamCount }, (_, i) => `Team ${i + 1}`);
}

function initFromSeed(league) {
  if (!league.getDraftSeed) return null;
  const seed = league.getDraftSeed();
  return {
    currentPick: seed.currentPick ?? 1,
    draftLog: seed.draftLog ?? [],
    myRoster: seed.myRoster ?? seed.myDraftPicks ?? [],
    queuedIds: [],
  };
}

export function useFootballDraft(leagueId) {
  const league = getFootballLeague(leagueId);
  const totalTeams = league?.draft?.teamCount || league?.teamCount || 12;
  const totalRounds = league?.draft?.rounds || 20;
  const order = league?.draft?.format === 'linear' ? 'linear' : 'snake';
  const myPick = league?.draft?.mySlot || league?.draft?.myPick || Math.ceil(totalTeams / 2);

  const teamNames = useMemo(() => getTeamNames(league || {}), [league]);

  const [currentPick, setCurrentPick] = useState(1);
  const [draftLog, setDraftLog] = useState([]);
  const [myRoster, setMyRoster] = useState([]);
  const [queuedIds, setQueuedIds] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Hydrate from localStorage or seed on first load
  useEffect(() => {
    if (!leagueId || !league) return;

    const saved = loadState(leagueId);
    const seedVersion = league.getDraftSeed ? (SEED_VERSIONS[leagueId] ?? null) : null;
    const savedStale = saved && seedVersion != null && saved.seedVersion !== seedVersion;

    if (saved && !savedStale) {
      setCurrentPick(saved.currentPick ?? 1);
      setDraftLog(saved.draftLog ?? []);
      setMyRoster(saved.myRoster ?? league.myTeam?.roster ?? []);
      setQueuedIds(saved.queuedIds ?? []);
    } else if (league.getDraftSeed) {
      const seed = initFromSeed(league);
      if (seed) {
        setCurrentPick(seed.currentPick);
        setDraftLog(seed.draftLog);
        setMyRoster(seed.myRoster);
        setQueuedIds(seed.queuedIds);
        saveState(leagueId, { ...seed, seedVersion });
      }
    } else if (league.myTeam?.roster) {
      setMyRoster(league.myTeam.roster);
    }
    setInitialized(true);
  }, [leagueId, league]);

  // Persist on change
  useEffect(() => {
    if (!leagueId || !initialized) return;
    const seedVersion = SEED_VERSIONS[leagueId];
    saveState(leagueId, {
      currentPick,
      draftLog,
      myRoster,
      queuedIds,
      ...(seedVersion != null ? { seedVersion } : {}),
    });
  }, [leagueId, currentPick, draftLog, myRoster, queuedIds, initialized]);

  const takenIds = useMemo(() => new Set(draftLog.map(d => d.player?.id)), [draftLog]);
  const takenNames = useMemo(() => new Set(draftLog.map(d => d.player?.name?.toLowerCase())), [draftLog]);

  const available = useMemo(() => {
    const pool = league?.draft?.status === 'in_progress'
      ? ALL_STARTUP_TARGETS.filter(p => !takenNames.has(p.name.toLowerCase()))
      : ALL_STARTUP_TARGETS.filter(p => !takenIds.has(p.id));
    return pool;
  }, [takenIds, takenNames, league?.draft?.status]);

  const isMyTurn = pickSlot(currentPick, totalTeams, order) === myPick;

  const getPickOwner = useCallback((overallPick) => {
    const slot = pickSlot(overallPick, totalTeams, order);
    return teamNames[slot - 1] || `Team ${slot}`;
  }, [totalTeams, order, teamNames]);

  const draftPlayer = useCallback((player) => {
    const round = Math.ceil(currentPick / totalTeams);
    const pickInRound = ((currentPick - 1) % totalTeams) + 1;
    const slot = pickSlot(currentPick, totalTeams, order);
    const myTurn = slot === myPick;
    const team = getPickOwner(currentPick);

    setDraftLog(prev => [...prev, {
      overallPick: currentPick,
      round,
      pickInRound,
      slot,
      team,
      player,
      isMyPick: myTurn,
    }]);
    if (myTurn) setMyRoster(prev => [...prev, player]);
    setCurrentPick(prev => prev + 1);
  }, [currentPick, totalTeams, order, myPick, getPickOwner]);

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
      if (pickSlot(p, totalTeams, order) === myPick) picks.push(p);
      if (picks.length >= 3) break;
    }
    return picks;
  }, [currentPick, totalTeams, totalRounds, order, myPick]);

  const queuedPlayers = useMemo(
    () => queuedIds.map(id => ALL_STARTUP_TARGETS.find(p => p.id === id)).filter(Boolean),
    [queuedIds]
  );

  const displayRoster = myRoster.length > 0 ? myRoster : (league?.myTeam?.roster ?? []);

  return {
    league,
    currentPick,
    draftLog,
    available,
    myRoster: displayRoster,
    myDraftPicks: draftLog.filter(d => d.isMyPick).map(d => d.player),
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
    draftOrder: order,
    initialized,
  };
}

// Back-compat alias
export const useFootballDraftState = useFootballDraft;
