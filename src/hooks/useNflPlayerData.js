// NFL player data from Sleeper API
import { useState, useEffect, useCallback } from 'react';
import { fetchNflPlayers, resolvePlayerByName } from '../services/sleeperApi.js';

export function useNflPlayerData() {
  const [playerIndex, setPlayerIndex] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const index = await fetchNflPlayers();
      setPlayerIndex(index);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getPlayer = useCallback(
    (name) => resolvePlayerByName(name, playerIndex),
    [playerIndex]
  );

  const getInjury = useCallback(
    (name) => {
      const p = resolvePlayerByName(name, playerIndex);
      if (!p?.injuryStatus) return null;
      const status = p.injuryStatus.toUpperCase();
      if (status === 'OUT' || status === 'IR') {
        return { icon: 'IR', color: '#FF006E', label: p.injuryStatus };
      }
      if (status === 'DOUBTFUL' || status === 'QUESTIONABLE') {
        return { icon: 'Q', color: '#DFFF00', label: p.injuryStatus };
      }
      return { icon: 'D', color: '#888', label: p.injuryStatus };
    },
    [playerIndex]
  );

  return { playerIndex, loading, lastUpdated, error, getPlayer, getInjury, refresh: load };
}
