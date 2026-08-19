import { useState } from 'react';
import { getFootballLeague } from '../data/footballLeagues.js';
import { useNflPlayerData } from '../hooks/useNflPlayerData.js';

function PlayerRow({ player, nflData }) {
  const { getInjury } = nflData || {};
  const injury = getInjury?.(player.name);
  const pos = player.positions?.[0] || player.position || '—';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1a1a1a] stat-row">
      <span className="text-[9px] font-bold font-mono w-10 shrink-0 text-[#DFFF00]">{pos}</span>
      <span className="text-xs text-white font-mono flex-1 truncate">{player.name}</span>
      {injury && (
        <span className="text-[8px] font-bold shrink-0" style={{ color: injury.color }}>
          {injury.icon}
        </span>
      )}
      <span className="text-[9px] text-[#555] font-mono shrink-0 w-8 text-right">{player.team}</span>
      {player.age != null && (
        <span className="text-[9px] text-[#444] font-mono shrink-0 w-8 text-right">{player.age}y</span>
      )}
      {player.tier && (
        <span className={`text-[8px] font-mono shrink-0 px-1 ${
          player.tier === 1 ? 'text-[#DFFF00]' : 'text-[#BF00FF]'
        }`}>
          T{player.tier}
        </span>
      )}
    </div>
  );
}

function EmptySlotRow({ slot }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1a1a1a] stat-row">
      <span className="text-[9px] font-bold font-mono w-10 shrink-0 text-[#DFFF00]">{slot}</span>
      <span className="text-[9px] text-[#BF00FF]/50 font-mono border border-[#BF00FF]/20 px-1.5">
        EMPTY — STARTUP DRAFT
      </span>
    </div>
  );
}

export default function FootballTeamView({ leagueId, myRoster = [], sleeperRoster = null }) {
  const league = getFootballLeague(leagueId);
  const nflData = useNflPlayerData();
  const [tab, setTab] = useState('starters');

  if (!league) {
    return (
      <div className="p-6 text-[#555] font-mono text-xs">League not found.</div>
    );
  }

  const roster = sleeperRoster?.players?.length
    ? sleeperRoster.players
    : myRoster;

  const starters = sleeperRoster?.starters?.length
    ? sleeperRoster.starters
    : [];

  const slots = league.starterSlots || [];
  const flatSlots = slots.flatMap(s => Array(s.count).fill(s.slot));

  return (
    <div className="h-full overflow-y-auto ink-bleed-in">
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-1">
          {league.format?.toUpperCase()} · {league.platform?.toUpperCase()}
        </div>
        <h2 className="text-2xl font-black text-[#DFFF00] uppercase" style={{ letterSpacing: '-0.03em' }}>
          {league.name}
        </h2>
        <div className="text-xs text-[#555] font-mono mt-1">
          {league.teamCount} Teams · {league.scoring?.format} · Season {league.season}
        </div>
        {league.draft?.status === 'pre-draft' && (
          <div className="mt-3 inline-block px-3 py-1 text-[10px] font-mono font-bold text-[#DFFF00] border border-[#DFFF00]/40 bg-[#DFFF00]/5 tracking-widest">
            STARTUP DRAFT — PRE-DRAFT
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a] px-6">
        {['starters', 'roster', 'limits'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[10px] font-mono tracking-wider uppercase transition-all ${
              tab === t
                ? 'text-[#DFFF00] border-b-2 border-[#DFFF00]'
                : 'text-[#555] hover:text-[#BF00FF]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'starters' && (
          <div className="punk-card overflow-hidden">
            <div className="px-3 py-2 bg-[#111] border-b border-[#2a2a2a]">
              <span className="text-[10px] text-[#DFFF00] font-mono tracking-widest">STARTING LINEUP</span>
            </div>
            {starters.length > 0 ? (
              starters.map((p, i) => <PlayerRow key={p.id || i} player={p} nflData={nflData} />)
            ) : (
              flatSlots.map((slot, i) => <EmptySlotRow key={`${slot}-${i}`} slot={slot} />)
            )}
          </div>
        )}

        {tab === 'roster' && (
          <div className="punk-card overflow-hidden">
            <div className="px-3 py-2 bg-[#111] border-b border-[#2a2a2a] flex justify-between">
              <span className="text-[10px] text-[#BF00FF] font-mono tracking-widest">FULL ROSTER</span>
              <span className="text-[10px] text-[#555] font-mono">{roster.length} players</span>
            </div>
            {roster.length > 0 ? (
              roster.map((p, i) => <PlayerRow key={p.id || i} player={p} nflData={nflData} />)
            ) : (
              <div className="p-8 text-center text-[#333] text-xs font-mono">
                No players yet — startup draft has not begun
              </div>
            )}
          </div>
        )}

        {tab === 'limits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="punk-card p-4">
              <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-3">ROSTER LIMITS</div>
              {Object.entries(league.rosterLimits || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
                  <span className="text-[#888] capitalize">{k}</span>
                  <span className="text-[#DFFF00]">{v.min}–{v.max}</span>
                </div>
              ))}
            </div>
            <div className="punk-card p-4">
              <div className="text-[10px] text-[#BF00FF] font-mono tracking-wider mb-3">STARTER SLOTS</div>
              {slots.map(s => (
                <div key={s.slot} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
                  <span className="text-[#888]">{s.label}</span>
                  <span className="text-white">×{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
