import { useState, useMemo } from 'react';
import { useFootballDraftState } from '../hooks/useFootballDraftState.js';
import { useNflPlayerData } from '../hooks/useNflPlayerData.js';

const TIER_COLORS = {
  1: 'text-[#DFFF00] bg-[#DFFF00]/10',
  2: 'text-[#BF00FF] bg-[#BF00FF]/10',
};

const POS_FILTERS = ['All', 'QB', 'RB', 'WR', 'TE'];

export default function FootballDraftRoom({ leagueId }) {
  const {
    league, currentPick, draftLog, available, myRoster,
    isMyTurn, upcomingMyPicks, draftPlayer, advancePick,
    queuePlayer, dequeuePlayer, queuedPlayers,
    totalTeams, totalRounds, myPick, getPickOwner,
  } = useFootballDraftState(leagueId);

  const nflData = useNflPlayerData();
  const [posFilter, setPosFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('tier');

  const currentRound = Math.ceil(currentPick / totalTeams);
  const pickInRound = currentPick - (currentRound - 1) * totalTeams;

  const filteredPlayers = useMemo(() => {
    let pool = available;
    if (posFilter !== 'All') {
      pool = pool.filter(p => p.positions?.includes(posFilter));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(p => p.name.toLowerCase().includes(q));
    }
    if (sortBy === 'tier') pool = [...pool].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
    if (sortBy === 'age') pool = [...pool].sort((a, b) => (a.age || 99) - (b.age || 99));
    if (sortBy === 'pos') pool = [...pool].sort((a, b) => (a.positions?.[0] || '').localeCompare(b.positions?.[0] || ''));
    return pool;
  }, [available, posFilter, searchQuery, sortBy]);

  if (!league) {
    return <div className="p-6 text-[#555] font-mono text-xs">League not found.</div>;
  }

  return (
    <div className="h-full flex flex-col ink-bleed-in">
      {/* Draft header */}
      <div className="p-4 border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest">
              STARTUP DRAFT · {league.name.toUpperCase()}
            </div>
            <div className="text-xl font-black text-[#DFFF00] font-mono mt-1">
              PICK {currentPick} · ROUND {currentRound}
            </div>
            <div className="text-xs text-[#555] font-mono mt-1">
              On clock: <span className="text-white">{getPickOwner(currentPick)}</span>
              {isMyTurn && (
                <span className="ml-2 text-[#39FF14] animate-pulse">YOUR PICK</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#555] font-mono">MY PICK SLOT</div>
            <div className="text-lg font-bold text-[#DFFF00] font-mono">#{myPick}</div>
            <div className="text-[10px] text-[#444] font-mono mt-1">
              Next: {upcomingMyPicks.slice(0, 3).map(p => `#${p}`).join(', ') || '—'}
            </div>
          </div>
        </div>

        {league.draft?.status === 'pre-draft' && (
          <div className="mt-3 px-3 py-2 bg-[#BF00FF]/10 border border-[#BF00FF]/30 text-[10px] font-mono text-[#BF00FF]">
            PLANNING MODE — Startup draft not yet live. Mock picks for strategy planning.
            {league.draft?.date && (
              <span className="text-[#888] ml-2">
                Draft: {new Date(league.draft.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Player pool */}
        <div className="flex flex-col overflow-hidden border-r border-[#2a2a2a]">
          {/* Filters */}
          <div className="p-3 border-b border-[#1a1a1a] flex flex-wrap gap-2 shrink-0">
            {POS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setPosFilter(f)}
                className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                  posFilter === f
                    ? 'bg-[#DFFF00] text-black'
                    : 'border border-[#333] text-[#555] hover:border-[#BF00FF] hover:text-[#BF00FF]'
                }`}
              >
                {f}
              </button>
            ))}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ml-auto bg-[#111] border border-[#333] px-2 py-1 text-[10px] font-mono text-white w-32 focus:border-[#DFFF00] outline-none"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#111] border border-[#333] px-2 py-1 text-[10px] font-mono text-[#888] outline-none"
            >
              <option value="tier">Sort: Tier</option>
              <option value="age">Sort: Age</option>
              <option value="pos">Sort: Position</option>
            </select>
          </div>

          {/* Player list */}
          <div className="flex-1 overflow-y-auto">
            {filteredPlayers.map(player => {
              const injury = nflData.getInjury?.(player.name);
              const isQueued = queuedPlayers.some(q => q.id === player.id);
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-2 px-3 py-2 border-b border-[#1a1a1a] stat-row hover:bg-[#111]"
                >
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 ${TIER_COLORS[player.tier] || 'text-[#444]'}`}>
                    T{player.tier}
                  </span>
                  <span className="text-[9px] font-bold font-mono w-8 text-[#DFFF00]">
                    {player.positions?.[0]}
                  </span>
                  <span className="text-xs text-white font-mono flex-1 truncate">{player.name}</span>
                  {injury && (
                    <span className="text-[8px] font-bold" style={{ color: injury.color }}>{injury.icon}</span>
                  )}
                  <span className="text-[9px] text-[#555] font-mono w-8">{player.team}</span>
                  <span className="text-[9px] text-[#444] font-mono w-8">{player.age}y</span>
                  <button
                    onClick={() => isQueued ? dequeuePlayer(player.id) : queuePlayer(player.id)}
                    className={`text-[9px] font-mono px-2 py-0.5 border transition-all ${
                      isQueued
                        ? 'border-[#DFFF00] text-[#DFFF00]'
                        : 'border-[#333] text-[#555] hover:border-[#BF00FF] hover:text-[#BF00FF]'
                    }`}
                  >
                    {isQueued ? 'QUEUED' : 'QUEUE'}
                  </button>
                  <button
                    onClick={() => draftPlayer(player)}
                    disabled={!isMyTurn}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 transition-all ${
                      isMyTurn
                        ? 'bg-[#DFFF00] text-black hover:bg-white'
                        : 'bg-[#1a1a1a] text-[#333] cursor-not-allowed'
                    }`}
                  >
                    DRAFT
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col overflow-hidden">
          {/* My roster */}
          <div className="flex-1 overflow-y-auto border-b border-[#2a2a2a]">
            <div className="px-3 py-2 bg-[#111] border-b border-[#1a1a1a]">
              <span className="text-[10px] text-[#DFFF00] font-mono tracking-widest">MY ROSTER ({myRoster.length})</span>
            </div>
            {myRoster.length === 0 ? (
              <div className="p-4 text-[10px] text-[#333] font-mono text-center">No picks yet</div>
            ) : (
              myRoster.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1a1a1a] text-xs font-mono">
                  <span className="text-[#DFFF00] w-8">{p.positions?.[0]}</span>
                  <span className="text-white flex-1 truncate">{p.name}</span>
                  <span className="text-[#555]">{p.team}</span>
                </div>
              ))
            )}
          </div>

          {/* Queue */}
          <div className="h-40 overflow-y-auto border-b border-[#2a2a2a]">
            <div className="px-3 py-2 bg-[#111] border-b border-[#1a1a1a]">
              <span className="text-[10px] text-[#BF00FF] font-mono tracking-widest">QUEUE</span>
            </div>
            {queuedPlayers.length === 0 ? (
              <div className="p-4 text-[10px] text-[#333] font-mono text-center">Queue players from the board</div>
            ) : (
              queuedPlayers.map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1a1a1a] text-xs font-mono">
                  <span className="text-[#BF00FF] w-8">{p.positions?.[0]}</span>
                  <span className="text-white flex-1 truncate">{p.name}</span>
                  <button onClick={() => dequeuePlayer(p.id)} className="text-[#555] hover:text-[#FF006E]">×</button>
                </div>
              ))
            )}
          </div>

          {/* Draft log */}
          <div className="h-48 overflow-y-auto">
            <div className="px-3 py-2 bg-[#111] border-b border-[#1a1a1a] flex justify-between">
              <span className="text-[10px] text-[#555] font-mono tracking-widest">DRAFT LOG</span>
              <button
                onClick={advancePick}
                className="text-[9px] font-mono text-[#555] hover:text-[#DFFF00]"
              >
                SKIP →
              </button>
            </div>
            {[...draftLog].reverse().slice(0, 20).map(entry => (
              <div
                key={entry.overallPick}
                className={`px-3 py-1 border-b border-[#1a1a1a] text-[10px] font-mono ${
                  entry.isMyPick ? 'bg-[#DFFF00]/5' : ''
                }`}
              >
                <span className="text-[#555]">#{entry.overallPick}</span>
                <span className="text-[#888] mx-1">{entry.team}</span>
                <span className={entry.isMyPick ? 'text-[#DFFF00]' : 'text-white'}>
                  {entry.player?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
