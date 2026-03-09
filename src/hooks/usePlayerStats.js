// Fetches live MLB season stats for any player by name
// Uses the mlbIndex from usePlayerData to resolve MLB IDs
import { useState, useEffect } from 'react';
import { fetchPlayerStats } from '../services/mlbApi.js';

function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

// Map MLB API hitting stat keys → our display labels
const HITTING_MAP = {
  avg:          { label: 'AVG',  format: v => v ? Number(v).toFixed(3).replace(/^0/, '') : '—' },
  homeRuns:     { label: 'HR',   format: v => v ?? '—' },
  rbi:          { label: 'RBI',  format: v => v ?? '—' },
  runs:         { label: 'R',    format: v => v ?? '—' },
  stolenBases:  { label: 'SB',   format: v => v ?? '—' },
  gamesPlayed:  { label: 'G',    format: v => v ?? '—' },
  atBats:       { label: 'AB',   format: v => v ?? '—' },
  obp:          { label: 'OBP',  format: v => v ? Number(v).toFixed(3).replace(/^0/, '') : '—' },
  slg:          { label: 'SLG',  format: v => v ? Number(v).toFixed(3).replace(/^0/, '') : '—' },
};

// Map MLB API pitching stat keys → our display labels
const PITCHING_MAP = {
  era:            { label: 'ERA',   format: v => v ? Number(v).toFixed(2) : '—' },
  strikeOuts:     { label: 'K',     format: v => v ?? '—' },
  wins:           { label: 'W',     format: v => v ?? '—' },
  saves:          { label: 'SV',    format: v => v ?? '—' },
  whip:           { label: 'WHIP',  format: v => v ? Number(v).toFixed(2) : '—' },
  inningsPitched: { label: 'IP',    format: v => v ?? '—' },
  gamesPlayed:    { label: 'G',     format: v => v ?? '—' },
  losses:         { label: 'L',     format: v => v ?? '—' },
};

export const SCORING_HITTING_KEYS  = ['avg', 'homeRuns', 'rbi', 'runs', 'stolenBases'];
export const SCORING_PITCHING_KEYS = ['era', 'strikeOuts', 'wins', 'saves', 'whip'];

export function formatStat(key, value, isPitcher) {
  const map = isPitcher ? PITCHING_MAP : HITTING_MAP;
  return map[key]?.format(value) ?? value ?? '—';
}

export function getStatLabel(key, isPitcher) {
  const map = isPitcher ? PITCHING_MAP : HITTING_MAP;
  return map[key]?.label ?? key;
}

export function usePlayerStats(playerName, mlbIndex, positions = []) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mlbId, setMlbId] = useState(null);

  const isPitcher = positions.some(p => ['SP', 'RP', 'P'].includes(p));
  const statGroup = isPitcher ? 'pitching' : 'hitting';

  useEffect(() => {
    if (!playerName || !mlbIndex || Object.keys(mlbIndex).length === 0) return;

    const key = normalizeName(playerName);
    const mlbPlayer = mlbIndex[key];
    if (!mlbPlayer) {
      setError('Player not found in MLB index');
      return;
    }

    setMlbId(mlbPlayer.mlbId);
    setLoading(true);
    setError(null);

    fetchPlayerStats(mlbPlayer.mlbId, statGroup)
      .then(s => {
        setStats(s);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [playerName, mlbIndex, statGroup]);

  return { stats, loading, error, mlbId, isPitcher };
}
