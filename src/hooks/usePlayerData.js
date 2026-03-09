// Enriches our static player pool with live MLB API data and RSS news
import { useState, useEffect, useCallback } from 'react';
import { fetchActivePlayerIndex, resolveInjuryStatus } from '../services/mlbApi.js';
import { fetchPlayerNews, getPlayerNews } from '../services/newsRss.js';

export function usePlayerData() {
  const [mlbIndex, setMlbIndex] = useState({});
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [index, news] = await Promise.all([
        fetchActivePlayerIndex(),
        fetchPlayerNews(),
      ]);
      setMlbIndex(index);
      setAllNews(news);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Get injury status for a player by name
  const getInjury = useCallback(
    (playerName) => resolveInjuryStatus(playerName, mlbIndex),
    [mlbIndex]
  );

  // Get recent news for a player by name
  const getNews = useCallback(
    (playerName, max = 2) => getPlayerNews(playerName, allNews, max),
    [allNews]
  );

  return { mlbIndex, allNews, loading, lastUpdated, error, getInjury, getNews, refresh: load };
}
