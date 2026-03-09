// MLB Stats API — free, official, no key required
// Docs: https://statsapi.mlb.com/api/v1/
import { cache } from './dataCache.js';

const BASE = '/mlb/api/v1';

// NL team IDs (2026)
const NL_TEAM_IDS = new Set([
  109, // ARI
  144, // ATL
  112, // CHC
  113, // CIN
  115, // COL
  119, // LAD
  146, // MIA
  158, // MIL
  121, // NYM
  143, // PHI
  134, // PIT
  135, // SDP
  137, // SFG
  138, // STL
  120, // WSH
]);

// Normalize a name for fuzzy matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z\s]/g, '')
    .trim();
}

// Fetch all active MLB players with injury/status info
export async function fetchActivePlayerIndex() {
  const cacheKey = 'mlb_active_players_2026';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${BASE}/sports/1/players?season=2026&gameType=R&hydrate=currentTeam`
    );
    if (!res.ok) throw new Error(`MLB API ${res.status}`);
    const data = await res.json();

    // Build a name → player map for fast lookup
    const index = {};
    for (const p of data.people || []) {
      const key = normalizeName(p.fullName);
      index[key] = {
        mlbId: p.id,
        name: p.fullName,
        teamId: p.currentTeam?.id,
        teamName: p.currentTeam?.name,
        teamAbbr: p.currentTeam?.abbreviation,
        status: p.status?.code || 'A', // A=Active, DL=Injured, etc.
        statusDescription: p.status?.description || 'Active',
        isNL: NL_TEAM_IDS.has(p.currentTeam?.id),
      };
    }

    cache.set(cacheKey, index);
    return index;
  } catch (err) {
    console.warn('MLB API unavailable:', err.message);
    return {};
  }
}

// Fetch live stats for a specific MLB player ID
export async function fetchPlayerStats(mlbId, type = 'hitting') {
  const cacheKey = `mlb_stats_${mlbId}_${type}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${BASE}/people/${mlbId}/stats?stats=season&season=2026&group=${type}`
    );
    if (!res.ok) throw new Error(`MLB stats ${res.status}`);
    const data = await res.json();
    const stats = data.stats?.[0]?.splits?.[0]?.stat || {};
    cache.set(cacheKey, stats, 30 * 60 * 1000); // 30-min TTL for live stats
    return stats;
  } catch (err) {
    console.warn('MLB stats fetch failed:', err.message);
    return {};
  }
}

// Map CBS status codes to display info
export function getInjuryDisplay(statusCode) {
  const map = {
    'D7':   { label: '7-Day IL',  color: '#FF006E', icon: '✕' },
    'D10':  { label: '10-Day IL', color: '#FF006E', icon: '✕' },
    'D15':  { label: '15-Day IL', color: '#FF2200', icon: '✕' },
    'D60':  { label: '60-Day IL', color: '#FF2200', icon: '✕' },
    'DL':   { label: 'IL',        color: '#FF2200', icon: '✕' },
    'DTD':  { label: 'Day-to-Day', color: '#DFFF00', icon: '⚠' },
    'O':    { label: 'Out',        color: '#FF2200', icon: '✕' },
    'Q':    { label: 'Questionable', color: '#DFFF00', icon: '⚠' },
  };
  return map[statusCode] || null;
}

// Resolve a player name from our pool to their MLB injury status
export function resolveInjuryStatus(playerName, mlbIndex) {
  const key = normalizeName(playerName);
  const mlbPlayer = mlbIndex[key];
  if (!mlbPlayer) return null;
  return getInjuryDisplay(mlbPlayer.status);
}
