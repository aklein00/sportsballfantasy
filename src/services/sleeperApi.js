// Sleeper API — free, no auth required for read endpoints
// Docs: https://docs.sleeper.com/
import { cache } from './dataCache.js';

const BASE = 'https://api.sleeper.app/v1';

function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

export async function fetchNflPlayers() {
  const cacheKey = 'sleeper_nfl_players';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${BASE}/players/nfl`);
    if (!res.ok) throw new Error(`Sleeper API ${res.status}`);
    const data = await res.json();

    const index = {};
    for (const [playerId, p] of Object.entries(data)) {
      if (!p || p.active === false) continue;
      const key = normalizeName(p.full_name || p.first_name + ' ' + p.last_name);
      index[key] = {
        sleeperId: playerId,
        name: p.full_name,
        team: p.team || 'FA',
        positions: p.fantasy_positions || [],
        position: p.position,
        age: p.age,
        yearsExp: p.years_exp,
        status: p.status || 'Active',
        injuryStatus: p.injury_status,
        searchRank: p.search_rank,
        depthChartOrder: p.depth_chart_order,
      };
    }

    cache.set(cacheKey, index, 60 * 60 * 1000); // 1 hour TTL
    return index;
  } catch (err) {
    console.warn('Sleeper players API unavailable:', err.message);
    return {};
  }
}

export async function fetchLeague(leagueId) {
  if (!leagueId) return null;
  const cacheKey = `sleeper_league_${leagueId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${BASE}/league/${leagueId}`);
    if (!res.ok) throw new Error(`Sleeper league ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (err) {
    console.warn('Sleeper league fetch failed:', err.message);
    return null;
  }
}

export async function fetchLeagueRosters(leagueId) {
  if (!leagueId) return [];
  const cacheKey = `sleeper_rosters_${leagueId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${BASE}/league/${leagueId}/rosters`);
    if (!res.ok) throw new Error(`Sleeper rosters ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (err) {
    console.warn('Sleeper rosters fetch failed:', err.message);
    return [];
  }
}

export async function fetchLeagueUsers(leagueId) {
  if (!leagueId) return [];
  const cacheKey = `sleeper_users_${leagueId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${BASE}/league/${leagueId}/users`);
    if (!res.ok) throw new Error(`Sleeper users ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (err) {
    console.warn('Sleeper users fetch failed:', err.message);
    return [];
  }
}

export async function fetchLeagueDrafts(leagueId) {
  if (!leagueId) return [];
  try {
    const res = await fetch(`${BASE}/league/${leagueId}/drafts`);
    if (!res.ok) throw new Error(`Sleeper drafts ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Sleeper drafts fetch failed:', err.message);
    return [];
  }
}

export async function fetchDraftPicks(draftId) {
  if (!draftId) return [];
  try {
    const res = await fetch(`${BASE}/draft/${draftId}/picks`);
    if (!res.ok) throw new Error(`Sleeper picks ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Sleeper draft picks fetch failed:', err.message);
    return [];
  }
}

export async function fetchUserByUsername(username) {
  if (!username) return null;
  try {
    const res = await fetch(`${BASE}/user/${username}`);
    if (!res.ok) throw new Error(`Sleeper user ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Sleeper user fetch failed:', err.message);
    return null;
  }
}

export async function fetchUserLeagues(userId, season = '2026', sport = 'nfl') {
  if (!userId) return [];
  try {
    const res = await fetch(`${BASE}/user/${userId}/leagues/${sport}/${season}`);
    if (!res.ok) throw new Error(`Sleeper user leagues ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Sleeper user leagues fetch failed:', err.message);
    return [];
  }
}

export function resolvePlayerByName(name, playerIndex) {
  const key = normalizeName(name);
  return playerIndex[key] || null;
}

export function enrichRosterPlayers(playerIds, playerIndex, nflPlayersRaw) {
  return (playerIds || []).map(id => {
    const raw = nflPlayersRaw?.[id];
    if (raw) {
      return {
        id,
        name: raw.full_name,
        team: raw.team || 'FA',
        positions: raw.fantasy_positions || [raw.position].filter(Boolean),
        age: raw.age,
        yearsExp: raw.years_exp,
        injuryStatus: raw.injury_status,
      };
    }
    const found = Object.values(playerIndex).find(p => p.sleeperId === id);
    return found ? { id, ...found, name: found.name } : { id, name: `Player ${id}`, team: '—', positions: [] };
  });
}
