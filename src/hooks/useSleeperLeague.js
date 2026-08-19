// Sleeper league connection — rosters, users, draft state
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchLeague,
  fetchLeagueRosters,
  fetchLeagueUsers,
  fetchLeagueDrafts,
  fetchDraftPicks,
  fetchNflPlayers,
  enrichRosterPlayers,
} from '../services/sleeperApi.js';

export function useSleeperLeague(leagueId, myUserId = null) {
  const [league, setLeague] = useState(null);
  const [rosters, setRosters] = useState([]);
  const [users, setUsers] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [draftPicks, setDraftPicks] = useState([]);
  const [nflPlayersRaw, setNflPlayersRaw] = useState({});
  const [playerIndex, setPlayerIndex] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!leagueId) {
      setLeague(null);
      setRosters([]);
      setUsers([]);
      setDrafts([]);
      setDraftPicks([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [leagueData, rosterData, userData, draftData, playersRaw, index] = await Promise.all([
        fetchLeague(leagueId),
        fetchLeagueRosters(leagueId),
        fetchLeagueUsers(leagueId),
        fetchLeagueDrafts(leagueId),
        fetch('https://api.sleeper.app/v1/players/nfl').then(r => r.json()),
        fetchNflPlayers(),
      ]);

      setLeague(leagueData);
      setRosters(rosterData);
      setUsers(userData);
      setDrafts(draftData);
      setNflPlayersRaw(playersRaw);
      setPlayerIndex(index);

      if (draftData?.length > 0) {
        const picks = await fetchDraftPicks(draftData[0].draft_id);
        setDraftPicks(picks);
      } else {
        setDraftPicks([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => { load(); }, [load]);

  const myRoster = useMemo(() => {
    if (!rosters.length) return null;
    const roster = myUserId
      ? rosters.find(r => r.owner_id === myUserId)
      : rosters[0];
    if (!roster) return null;
    return {
      ...roster,
      players: enrichRosterPlayers(roster.players, playerIndex, nflPlayersRaw),
      starters: enrichRosterPlayers(
        roster.starters?.filter(id => id !== '0') || [],
        playerIndex,
        nflPlayersRaw
      ),
    };
  }, [rosters, myUserId, playerIndex, nflPlayersRaw]);

  const teamMap = useMemo(() => {
    const map = {};
    for (const u of users) {
      map[u.user_id] = u;
    }
    return map;
  }, [users]);

  return {
    league,
    rosters,
    users,
    drafts,
    draftPicks,
    myRoster,
    teamMap,
    loading,
    error,
    refresh: load,
  };
}
