import { useState } from 'react';
import WardenCard from './WardenCard.jsx';
import FreeAgentsSection from './FreeAgentsSection.jsx';
import MinorLeagueWatch from './MinorLeagueWatch.jsx';
import { PLAYER_POOL } from '../data/mockDraftPool.js';
import { ACTIVE_POSITIONS } from '../data/blueDream.js';
import {
  usePlayerStats,
  formatStat,
  SCORING_HITTING_KEYS,
  SCORING_PITCHING_KEYS,
} from '../hooks/usePlayerStats.js';

// Exclude my team from FA pool (simple check by id)
function getAvailable(myRoster) {
  const myIds = new Set(myRoster.map(p => p.id));
  return PLAYER_POOL.filter(p => !myIds.has(p.id));
}

function CompactPlayerRow({ player, playerData }) {
  const [hovered, setHovered] = useState(false);
  const { getInjury, getNews, mlbIndex } = playerData || {};
  const injury = getInjury?.(player?.name);
  const news = hovered ? (getNews?.(player?.name) || []) : [];

  const isPitcher = player?.positions?.some(p => ['SP', 'RP', 'P'].includes(p));
  const { stats } = usePlayerStats(player?.name, mlbIndex, player?.positions || []);
  const keys = isPitcher ? SCORING_PITCHING_KEYS : SCORING_HITTING_KEYS;
  const keyStat = keys[0];
  const keyVal = stats ? formatStat(keyStat, stats[keyStat], isPitcher) : '—';

  return (
    <div
      className="stat-row border-b border-[#1a1a1a]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="text-[9px] font-bold font-mono w-7 shrink-0 text-[#DFFF00]">
          {player.positions?.[0] || '—'}
        </span>
        <span className="text-xs text-white font-mono flex-1 truncate">{player.name}</span>
        {injury && (
          <span className="text-[8px] font-bold shrink-0" style={{ color: injury.color }}>
            {injury.icon}
          </span>
        )}
        <span className="text-[9px] text-[#555] font-mono shrink-0 w-8 text-right">{player.team}</span>
        <span className="text-[9px] font-mono shrink-0 w-10 text-right" style={{ color: stats ? '#DFFF00' : '#444' }}>
          {keyVal}
        </span>
        <span className="text-[8px] text-[#333] font-mono shrink-0 w-8 text-right">{keyStat}</span>
      </div>
      {news.length > 0 && (
        <div className="mx-3 mb-1.5 space-y-0.5 ml-12">
          {news.map((item, i) => (
            <div key={i} className="text-[9px] text-[#888] font-mono border-l-2 border-[#BF00FF]/40 pl-2">
              <span className="text-[#BF00FF] mr-1">{item.age}</span>{item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptySlotRow({ slot }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1a1a1a] stat-row">
      <span className="text-[9px] font-bold font-mono w-7 shrink-0 text-[#DFFF00]">{slot}</span>
      <span className="text-[9px] text-[#BF00FF]/50 font-mono border border-[#BF00FF]/20 px-1.5">EMPTY — DRAFT</span>
    </div>
  );
}

export default function TeamView({ myRoster, playerData, prospectWatchlist, setProspectWatchlist }) {
  const available = getAvailable(myRoster);

  // Slot players by position for the compact table
  const filledByPos = {};
  myRoster.forEach(p => {
    p.positions?.forEach(pos => {
      if (!filledByPos[pos]) filledByPos[pos] = [];
      filledByPos[pos].push(p);
    });
  });

  // Build ordered slot rows
  const slotRows = [];
  ACTIVE_POSITIONS.forEach(({ slot, count }) => {
    const players = filledByPos[slot] || [];
    for (let i = 0; i < count; i++) {
      slotRows.push({ slot, player: players[i] || null });
    }
  });

  const batSlots    = slotRows.filter(r => !['SP','RP','P'].includes(r.slot));
  const pitchSlots  = slotRows.filter(r => ['SP','RP','P'].includes(r.slot));

  return (
    <div className="ink-bleed-in h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6">

        {/* ── LEFT COLUMN ── */}
        <div className="min-w-0 space-y-4">

          {/* Warden's Crystal Ball */}
          <WardenCard myRoster={myRoster} available={available} />

          {/* Active Roster — compact table */}
          <div className="punk-card acid-bar">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <div className="text-[10px] text-[#DFFF00] font-mono tracking-widest uppercase">Active Roster</div>
              <div className="text-[9px] text-[#555] font-mono">Scribbles · {myRoster.length}/21</div>
            </div>

            {/* Column headers */}
            <div className="flex items-center gap-2 px-3 py-1 border-b border-[#2a2a2a] bg-[#111]">
              <span className="text-[8px] text-[#333] font-mono w-7">POS</span>
              <span className="text-[8px] text-[#333] font-mono flex-1">PLAYER</span>
              <span className="text-[8px] text-[#333] font-mono w-8 text-right">INJ</span>
              <span className="text-[8px] text-[#333] font-mono w-8 text-right">TM</span>
              <span className="text-[8px] text-[#333] font-mono w-10 text-right">STAT</span>
              <span className="text-[8px] text-[#333] font-mono w-8 text-right">CAT</span>
            </div>

            {/* Batters */}
            <div className="text-[9px] text-[#333] font-mono tracking-widest px-3 pt-2 pb-1 uppercase">Batting</div>
            {batSlots.map((row, i) =>
              row.player
                ? <CompactPlayerRow key={`bat-${i}`} player={row.player} playerData={playerData} />
                : <EmptySlotRow key={`bat-empty-${i}`} slot={row.slot} />
            )}

            {/* Pitchers */}
            <div className="text-[9px] text-[#333] font-mono tracking-widest px-3 pt-3 pb-1 uppercase border-t border-[#1a1a1a] mt-1">Pitching</div>
            {pitchSlots.map((row, i) =>
              row.player
                ? <CompactPlayerRow key={`pit-${i}`} player={row.player} playerData={playerData} />
                : <EmptySlotRow key={`pit-empty-${i}`} slot={row.slot} />
            )}

            <div className="px-3 py-2 text-[9px] text-[#333] font-mono">
              Hover player to see latest news
            </div>
          </div>

          {/* Bench / IL / Minors cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'RESERVE', max: 2, color: '#BF00FF' },
              { label: 'INJURED LIST', max: 14, color: '#FF006E' },
              { label: 'MINORS', max: 5, color: '#39FF14' },
            ].map(({ label, max, color }) => (
              <div key={label} className="punk-card p-3">
                <div className="text-[9px] font-mono tracking-widest mb-1" style={{ color }}>{label}</div>
                <div className="text-[9px] text-[#333] font-mono">Empty · Max {max}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-0">
          <FreeAgentsSection
            myRoster={myRoster}
            available={available}
            playerData={playerData}
          />
          <MinorLeagueWatch
            watchlist={prospectWatchlist}
            setWatchlist={setProspectWatchlist}
            playerData={playerData}
          />
        </div>
      </div>
    </div>
  );
}
