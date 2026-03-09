import { useState } from 'react';
import { ACTIVE_POSITIONS } from '../data/blueDream.js';

export default function Roster({ myRoster, playerData }) {
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const { getInjury, getNews } = playerData || {};

  const getPlayersForSlot = (slot) => myRoster.filter(p => p.positions?.includes(slot));

  function PlayerRow({ slot, player, slotColor }) {
    const injury = player ? getInjury?.(player.name) : null;
    const isHovered = hoveredPlayer === player?.id;
    const news = isHovered ? getNews?.(player?.name) || [] : [];

    return (
      <div
        className="stat-row flex flex-col px-3 py-2 border-b border-[#1a1a1a]"
        onMouseEnter={() => player && setHoveredPlayer(player.id)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold font-mono w-8 shrink-0" style={{ color: slotColor }}>
            {slot}
          </span>
          {player ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-mono">{player.name}</span>
                {injury && (
                  <span
                    className="text-[9px] font-bold px-1 shrink-0"
                    style={{ color: injury.color, background: `${injury.color}18` }}
                  >
                    {injury.icon} {injury.label}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#555] font-mono">{player.team}</div>
            </div>
          ) : (
            <div className="flex-1 text-[10px] text-[#BF00FF] font-mono border border-[#BF00FF]/30 px-2 py-1">
              EMPTY — NEEDS FILL
            </div>
          )}
        </div>
        {/* Inline news on hover */}
        {news.length > 0 && (
          <div className="mt-1.5 ml-11 space-y-1">
            {news.map((item, n) => (
              <div key={n} className="text-[9px] text-[#888] font-mono border-l-2 border-[#BF00FF]/40 pl-2">
                <span className="text-[#BF00FF] mr-1">{item.age}</span>{item.title}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ink-bleed-in p-6">
      <div className="punk-card p-5 acid-bar mb-6">
        <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-1">MY ACTIVE ROSTER</div>
        <div className="text-2xl font-black text-[#DFFF00] font-mono">Scribbles</div>
        <div className="text-xs text-[#555] font-mono mt-1">
          {myRoster.length}/21 active · NL Only · Blue Dream 2026
        </div>
        <div className="text-[10px] text-[#333] font-mono mt-1">Hover a player to see latest news</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BATTERS */}
        <div className="punk-card p-4">
          <div className="text-[10px] text-[#DFFF00] font-mono tracking-widest mb-3">BATTING LINEUP</div>
          <div className="space-y-0">
            {ACTIVE_POSITIONS.filter(p => !['SP', 'RP', 'P'].includes(p.slot)).map(({ slot, count }) => {
              const players = getPlayersForSlot(slot);
              return Array.from({ length: count }).map((_, i) => (
                <PlayerRow key={`${slot}-${i}`} slot={slot} player={players[i]} slotColor="#DFFF00" />
              ));
            })}
          </div>
        </div>

        {/* PITCHERS */}
        <div className="punk-card p-4">
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-3">PITCHING STAFF</div>
          <div className="space-y-0">
            {ACTIVE_POSITIONS.filter(p => ['SP', 'RP', 'P'].includes(p.slot)).map(({ slot, count }) => {
              const players = getPlayersForSlot(slot);
              return Array.from({ length: count }).map((_, i) => (
                <PlayerRow key={`${slot}-${i}`} slot={slot} player={players[i]} slotColor="#BF00FF" />
              ));
            })}
          </div>
        </div>
      </div>

      {/* Reserve / IL / Minors */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { label: 'RESERVE',      max: 2,  color: '#BF00FF' },
          { label: 'INJURED LIST', max: 14, color: '#FF006E' },
          { label: 'MINORS',       max: 5,  color: '#39FF14' },
        ].map(({ label, max, color }) => (
          <div key={label} className="punk-card p-4">
            <div className="text-[10px] font-mono tracking-widest mb-2" style={{ color }}>{label}</div>
            <div className="text-xs text-[#333] font-mono">Empty · Max {max}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
