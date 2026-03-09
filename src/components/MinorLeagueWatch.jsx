import { useState } from 'react';
import { PLAYER_POOL } from '../data/mockDraftPool.js';

export default function MinorLeagueWatch({ watchlist, setWatchlist, playerData }) {
  const [search, setSearch] = useState('');
  const { getInjury } = playerData || {};

  // Show tier 3-4 prospects for search
  const searchResults = search.length >= 2
    ? PLAYER_POOL.filter(p =>
        (p.tier >= 3) &&
        !watchlist.some(w => w.id === p.id) &&
        p.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5)
    : [];

  const addToWatchlist = (player) => {
    setWatchlist(prev => [...prev, { id: player.id, name: player.name, positions: player.positions, team: player.team, tier: player.tier }]);
    setSearch('');
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="punk-card green-bar mt-4">
      <div className="px-4 pt-4 pb-2">
        <div className="text-[10px] text-[#39FF14] font-mono tracking-widest uppercase">Minor League Watch</div>
        <div className="text-[9px] text-[#333] font-mono mt-0.5">Keeper eligibility tracker · NL prospects</div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 relative">
        <input
          type="text"
          placeholder="Search prospects (tier 3-4)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[11px] font-mono px-3 py-1.5 placeholder-[#333] focus:outline-none focus:border-[#39FF14]"
        />
        {searchResults.length > 0 && (
          <div className="absolute left-4 right-4 top-full z-20 bg-[#111] border border-[#2a2a2a] divide-y divide-[#1a1a1a]">
            {searchResults.map(p => (
              <button
                key={p.id}
                onClick={() => addToWatchlist(p)}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#39FF14]/10 transition-colors"
              >
                <div>
                  <div className="text-xs text-white font-mono">{p.name}</div>
                  <div className="text-[9px] text-[#555] font-mono">{p.positions?.join('/')} · {p.team}</div>
                </div>
                <span className="text-[9px] text-[#39FF14] font-mono">+ ADD</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div className="divide-y divide-[#1a1a1a] border-t border-[#1a1a1a]">
        {watchlist.length === 0 ? (
          <div className="px-4 py-4 text-[10px] text-[#333] font-mono">
            No prospects tracked — search above to add
          </div>
        ) : (
          watchlist.map(player => {
            const injury = getInjury?.(player.name);
            return (
              <div key={player.id} className="flex items-center gap-2 px-4 py-2 stat-row">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-white font-mono truncate">{player.name}</span>
                    {injury && (
                      <span className="text-[8px] font-bold shrink-0" style={{ color: injury.color }}>
                        {injury.icon} {injury.label}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-[#555] font-mono">
                    {player.positions?.join('/')} · {player.team} · Tier {player.tier}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-[9px] text-[#39FF14] font-mono text-right">
                    <div>G: —</div>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(player.id)}
                    className="text-[#333] hover:text-[#FF006E] transition-colors text-xs font-mono"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {watchlist.length > 0 && (
        <div className="px-4 py-2 text-[9px] text-[#333] font-mono border-t border-[#1a1a1a]">
          {watchlist.length} prospect{watchlist.length !== 1 ? 's' : ''} tracked · Persisted locally
        </div>
      )}
    </div>
  );
}
