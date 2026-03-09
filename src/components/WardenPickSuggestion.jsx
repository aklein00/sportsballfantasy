import { useMemo } from 'react';
import { WARDEN, calcPositionNeeds } from '../utils/wardenAdvice.js';

// Calculate a score for each available player based on roster needs + tier + rank
function calcNeedsScore(player, needs, roster) {
  let score = 0;
  
  // Tier weight (Tier 1 = 100, Tier 2 = 75, Tier 3 = 50, Tier 4 = 25)
  score += (5 - (player.tier || 4)) * 25;
  
  // Position need match (+50 if fills a need)
  player.positions?.forEach(pos => {
    if (needs[pos] === 'need') score += 50;
    if (needs[pos] === 'extra') score -= 20; // Penalize if we have extra
  });
  
  // CBS rank bonus (top 50 = +20pts, top 100 = +10pts)
  if (player.cbsRank && player.cbsRank <= 50) score += 20;
  else if (player.cbsRank && player.cbsRank <= 100) score += 10;
  
  return score;
}

// Generate a Warden-style 1-line scouting report (static for now, can enhance with Gemini later)
function getWardenLine(player, pick, needs) {
  const isNeed = player.positions?.some(pos => needs[pos] === 'need');
  const tier = player.tier || 4;
  
  const lines = {
    tier1: [
      "The spirits whisper... this one burns bright.",
      "A true champion's pick, son.",
      "The runes favor this athletic wizard.",
    ],
    tier2: [
      "The crystal ball shows promise here.",
      "This one could serve your realm well.",
      "The stars align for this pick.",
    ],
    need: [
      "Your roster cries out for this position.",
      "The void fills where it hungers.",
      "Fortune favors the bold at this slot.",
    ],
    default: [
      "The spirits nod in approval.",
      "A cunning choice, friend.",
      "Trust in these numbers.",
    ],
  };
  
  if (tier === 1) return lines.tier1[Math.floor(Math.random() * lines.tier1.length)];
  if (tier === 2) return lines.tier2[Math.floor(Math.random() * lines.tier2.length)];
  if (isNeed) return lines.need[Math.floor(Math.random() * lines.need.length)];
  return lines.default[Math.floor(Math.random() * lines.default.length)];
}

const TIER_COLORS = {
  1: 'text-[#DFFF00] border-[#DFFF00]',
  2: 'text-[#BF00FF] border-[#BF00FF]',
  3: 'text-[#888] border-[#888]',
  4: 'text-[#444] border-[#444]',
};

export default function WardenPickSuggestion({ 
  myRoster = [], 
  available = [], 
  currentPick,
  playerData,
  onDraftPick,
  setSearchQuery,
}) {
  const needs = calcPositionNeeds(myRoster);
  const { getInjury } = playerData || {};

  // Calculate top 3 picks
  const topPicks = useMemo(() => {
    const scored = available.map(player => ({
      player,
      score: calcNeedsScore(player, needs, myRoster)
    }));
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ player }) => ({
        player,
        wardenLine: getWardenLine(player, currentPick, needs)
      }));
  }, [available, myRoster, needs, currentPick]);

  // Handle DRAFT button click
  const handleDraft = (player) => {
    // Auto-fill search to show this player
    setSearchQuery?.(player.name);
    // Trigger the draft
    onDraftPick?.(player);
  };

  if (topPicks.length === 0 || available.length === 0) return null;

  return (
    <div className="punk-card purple-bar">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <span className="text-lg">{WARDEN.emoji}</span>
          <div>
            <div className="text-[10px] text-[#DFFF00] font-mono tracking-widest uppercase">
              The Warden's Scouting Report
            </div>
            <div className="text-[9px] text-[#555] font-mono">
              Pick #{currentPick} — {topPicks.length} recommendations
            </div>
          </div>
        </div>
      </div>

      {/* Pick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3">
        {topPicks.map(({ player, wardenLine }, index) => {
          const injury = getInjury?.(player.name);
          const needTag = player.positions?.some(pos => needs[pos] === 'need') ? 'NEED' : null;
          
          return (
            <div
              key={player.id}
              className={`punk-card border acid-bar p-3 transition-all hover:border-[#DFFF00] hover:bg-[#DFFF00]/5 ${
                TIER_COLORS[player.tier] || TIER_COLORS[4]
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Rank badge */}
              <div className="absolute top-2 right-2 text-[9px] font-mono text-[#333]">
                #{index + 1} PICK
              </div>

              {/* Player info */}
              <div className="mb-2">
                <div className="text-sm font-bold text-white font-mono truncate">
                  {player.name}
                </div>
                <div className="text-[10px] text-[#555] font-mono">
                  {player.positions?.join('/')} · <span className="text-[#666]">{player.team}</span>
                </div>
                {needTag && (
                  <div className="mt-1 inline-block text-[8px] font-bold text-[#DFFF00] bg-[#DFFF00]/10 px-1.5 py-0.5 border border-[#DFFF00]/30">
                    {needTag}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="text-[9px] text-[#666] font-mono mb-2">
                {player.type === 'pitcher' ? (
                  <>
                    {player.stats?.ERA > 0 && <span>ERA {player.stats.ERA} </span>}
                    {player.stats?.K > 0 && <span>K {player.stats.K}</span>}
                  </>
                ) : (
                  <>
                    {player.stats?.HR > 0 && <span>HR {player.stats.HR} </span>}
                    {player.stats?.RBI > 0 && <span>RBI {player.stats.RBI}</span>}
                    {player.stats?.SB > 0 && <span> SB {player.stats.SB}</span>}
                  </>
                )}
              </div>

              {/* Injury badge */}
              {injury && (
                <div 
                  className="text-[8px] font-bold px-1 py-0.5 inline-block mb-2"
                  style={{ color: injury.color, background: `${injury.color}20` }}
                >
                  {injury.icon} {injury.label}
                </div>
              )}

              {/* Warden's line */}
              <div className="text-[10px] text-[#888] font-mono italic leading-tight mb-3 border-l-2 border-[#BF00FF]/40 pl-2">
                "{wardenLine}"
              </div>

              {/* DRAFT button */}
              <button
                onClick={() => handleDraft(player)}
                className="w-full px-2 py-1.5 text-[9px] font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all uppercase tracking-wider"
              >
                DRAFT →
              </button>

              {/* Tier badge */}
              <div className="mt-2 text-[8px] font-mono text-[#444]">
                Tier {player.tier} · Rank #{player.cbsRank || '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#1a1a1a] text-[8px] text-[#444] font-mono">
        Suggestions based on roster needs, player tier, and CBS rankings. Updated as you filter the pool.
      </div>
    </div>
  );
}
