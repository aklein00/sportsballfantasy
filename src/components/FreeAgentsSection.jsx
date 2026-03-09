import { useState } from 'react';
import { calcPositionNeeds } from '../utils/wardenAdvice.js';

const FILTER_POSITIONS = ['All', 'C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP'];

export default function FreeAgentsSection({ myRoster = [], available = [], playerData }) {
  const [posFilter, setPosFilter] = useState('All');
  const { getInjury } = playerData || {};

  const needs = calcPositionNeeds(myRoster);

  // Filter by position
  const filtered = posFilter === 'All'
    ? available
    : available.filter(p => p.positions?.includes(posFilter));

  // Sort: positional need match first, then by tier
  const sorted = [...filtered].sort((a, b) => {
    const aNeed = a.positions?.some(pos => needs[pos] === 'need') ? 0 : 1;
    const bNeed = b.positions?.some(pos => needs[pos] === 'need') ? 0 : 1;
    if (aNeed !== bNeed) return aNeed - bNeed;
    return (a.tier || 99) - (b.tier || 99);
  });

  const topPick = sorted[0];
  const displayed = sorted.slice(0, 9);

  return (
    <div className="punk-card purple-bar">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest uppercase">Free Agents</div>
        <div className="text-[9px] text-[#333] font-mono">FAB $100 · NL Only</div>
      </div>

      {/* Position filter tabs */}
      <div className="flex flex-wrap gap-1 px-4 pb-3">
        {FILTER_POSITIONS.map(pos => (
          <button
            key={pos}
            onClick={() => setPosFilter(pos)}
            className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase transition-all ${
              posFilter === pos
                ? 'bg-[#BF00FF] text-black'
                : 'border border-[#2a2a2a] text-[#444] hover:border-[#BF00FF] hover:text-[#BF00FF]'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Player list */}
      <div className="divide-y divide-[#1a1a1a]">
        {displayed.length === 0 ? (
          <div className="px-4 py-3 text-[10px] text-[#333] font-mono">No available players at this position</div>
        ) : (
          displayed.map(player => {
            const injury = getInjury?.(player.name);
            const isNeed = player.positions?.some(pos => needs[pos] === 'need');
            const isTop  = topPick && player.id === topPick.id;
            return (
              <div key={player.id} className="flex items-center gap-2 px-4 py-2 stat-row">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-mono text-white truncate">{player.name}</span>
                    {isTop && (
                      <span className="text-[8px] font-bold bg-[#BF00FF] text-black px-1 shrink-0">
                        WARDEN PICK
                      </span>
                    )}
                    {injury && (
                      <span className="text-[8px] font-bold shrink-0" style={{ color: injury.color }}>
                        {injury.icon} {injury.label}
                      </span>
                    )}
                    {isNeed && !isTop && (
                      <span className="text-[8px] text-[#DFFF00] font-mono shrink-0">NEED</span>
                    )}
                  </div>
                  <div className="text-[9px] text-[#555] font-mono">
                    {player.positions?.join('/')} · {player.team} · Tier {player.tier}
                  </div>
                </div>
                <button className="shrink-0 text-[9px] font-mono font-bold px-2 py-1 border border-[#BF00FF]/40 text-[#BF00FF] hover:bg-[#BF00FF] hover:text-black transition-all">
                  + CLAIM
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-2 text-[9px] text-[#333] font-mono border-t border-[#1a1a1a]">
        {sorted.length} available · Waiver runs nightly
      </div>
    </div>
  );
}
