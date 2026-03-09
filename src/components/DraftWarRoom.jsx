import { useState, useMemo } from 'react';
import { useDraftState } from '../hooks/useDraftState.js';
import { POSITIONS_FILTER } from '../data/playerPool.js';
import { ACTIVE_POSITIONS, MY_TURN_ALERTS } from '../data/blueDream.js';
import RulesDrawer from './RulesDrawer.jsx';
import AdvisorPanel from './AdvisorPanel.jsx';

function filledCounts(myRoster) {
  const counts = {};
  myRoster.forEach(p => {
    p.positions?.forEach(pos => { counts[pos] = (counts[pos] || 0) + 1; });
  });
  return counts;
}

function getPositionNeed(slot, count, myRoster) {
  const filled = filledCounts(myRoster);
  const have = filled[slot] || 0;
  if (have < count) return 'need';
  if (have === count) return 'filled';
  return 'extra';
}

function StatBadge({ player }) {
  if (player.type === 'pitcher') {
    return (
      <span className="text-[10px] font-mono text-[#555]">
        {player.stats.ERA > 0 ? `ERA ${player.stats.ERA}` : ''}
        {player.stats.K > 0  ? ` K ${player.stats.K}` : ''}
        {player.stats.S > 0  ? ` SV ${player.stats.S}` : ''}
      </span>
    );
  }
  return (
    <span className="text-[10px] font-mono text-[#555]">
      {player.stats.HR > 0  ? `HR ${player.stats.HR}` : ''}
      {player.stats.RBI > 0 ? ` RBI ${player.stats.RBI}` : ''}
      {player.stats.SB > 0  ? ` SB ${player.stats.SB}` : ''}
      {player.stats.AVG > 0 ? ` .${String(Math.round(player.stats.AVG * 1000)).padStart(3, '0')}` : ''}
    </span>
  );
}

const TIER_COLORS = {
  1: 'text-[#DFFF00] bg-[#DFFF00]/10',
  2: 'text-[#BF00FF] bg-[#BF00FF]/10',
  3: 'text-[#888] bg-[#1a1a1a]',
  4: 'text-[#444] bg-[#111]',
};

export default function DraftWarRoom({ playerData }) {
  const {
    currentPick, draftLog, available, myRoster,
    isMyTurn, alertForThisPick, upcomingMyPicks,
    draftPlayer, advancePick,
    sessionToken, setSessionToken,
    leagueId, setLeagueId,
    totalPlayers,
  } = useDraftState();

  const { getInjury, getNews } = playerData || {};

  const [posFilter, setPosFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All'); // All / Batters / Pitchers
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const currentRound = Math.ceil(currentPick / 16);
  const pickInRound = currentPick - (currentRound - 1) * 16;

  const filteredPlayers = useMemo(() => {
    let pool = available;
    if (typeFilter === 'Batters')  pool = pool.filter(p => p.type === 'batter');
    if (typeFilter === 'Pitchers') pool = pool.filter(p => p.type === 'pitcher');
    if (posFilter !== 'All') pool = pool.filter(p => p.positions?.includes(posFilter));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.team?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'rank') pool = [...pool].sort((a, b) => (a.cbsRank || 9999) - (b.cbsRank || 9999));
    if (sortBy === 'tier') pool = [...pool].sort((a, b) => (a.tier || 9) - (b.tier || 9));
    if (sortBy === 'name') pool = [...pool].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'hr')   pool = [...pool].sort((a, b) => (b.stats?.HR || 0) - (a.stats?.HR || 0));
    if (sortBy === 'era')  pool = [...pool].sort((a, b) => (a.stats?.ERA || 99) - (b.stats?.ERA || 99));
    if (sortBy === 'k')    pool = [...pool].sort((a, b) => (b.stats?.K || 0) - (a.stats?.K || 0));
    return pool;
  }, [available, posFilter, typeFilter, searchQuery, sortBy]);

  const visiblePlayers = filteredPlayers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filteredPlayers.length / PAGE_SIZE);

  // reset page when filters change
  const setFilter = (fn) => { fn(); setPage(0); };

  return (
    <div className="ink-bleed-in h-full">

      {/* === PICK STATUS BAR === */}
      <div className={`flex items-center justify-between px-6 py-3 border-b border-[#2a2a2a] transition-all ${
        isMyTurn || alertForThisPick ? 'alert-blink bg-[#0d0d00]' : 'bg-[#0a0a0a]'
      }`}>
        <div className="flex items-center gap-5 text-xs font-mono">
          <div>
            <span className="text-[#555]">PICK </span>
            <span className="text-[#DFFF00] font-bold text-base">{currentPick}</span>
            <span className="text-[#333]">/320</span>
          </div>
          <div><span className="text-[#555]">RND </span><span className="text-white font-bold">{currentRound}</span></div>
          <div><span className="text-[#555]">SLOT </span><span className="text-white font-bold">{pickInRound}</span></div>
          <div><span className="text-[#555]">POOL </span><span className="text-[#BF00FF] font-bold">{filteredPlayers.length.toLocaleString()}</span></div>
          {isMyTurn && (
            <div className="px-3 py-1 bg-[#DFFF00] text-black font-bold text-xs pick-pulse">
              ⚡ YOUR PICK
            </div>
          )}
          {alertForThisPick && !isMyTurn && (
            <div className="px-3 py-1 bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E] font-bold text-xs pick-pulse">
              🔔 {alertForThisPick.label} — GET READY
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#555] font-mono">MY NEXT PICKS:</span>
          {upcomingMyPicks.map(p => (
            <span key={p} className="text-[10px] font-mono text-[#BF00FF] border border-[#BF00FF]/40 px-1.5 py-0.5">
              #{p}
            </span>
          ))}
          <AdvisorPanel myRoster={myRoster} currentPick={currentPick} available={available} />
          <RulesDrawer />
          <button
            onClick={advancePick}
            className="px-3 py-1.5 text-[10px] font-mono bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#2a2a2a] transition-all border border-[#2a2a2a]"
          >
            Advance Pick →
          </button>
        </div>
      </div>

      {/* === CBS SYNC STRIP === */}
      <div className="px-6 py-2 bg-[#050505] border-b border-[#1a1a1a] flex items-center gap-3">
        <span className="text-[10px] text-[#444] font-mono uppercase tracking-widest">CBS Live Sync</span>
        <input
          placeholder="Session Token"
          value={sessionToken}
          onChange={e => setSessionToken(e.target.value)}
          className="bg-[#0a0a0a] border border-[#2a2a2a] text-[#888] text-[10px] font-mono px-3 py-1 w-52 placeholder-[#333] focus:outline-none focus:border-[#BF00FF]"
        />
        <input
          placeholder="League ID"
          value={leagueId}
          onChange={e => setLeagueId(e.target.value)}
          className="bg-[#0a0a0a] border border-[#2a2a2a] text-[#888] text-[10px] font-mono px-3 py-1 w-28 placeholder-[#333] focus:outline-none focus:border-[#BF00FF]"
        />
        <button className="px-3 py-1 text-[10px] font-mono border border-[#BF00FF] text-[#BF00FF] hover:bg-[#BF00FF] hover:text-black transition-all">
          SYNC
        </button>
        <span className="text-[10px] text-[#222] font-mono">
          {totalPlayers.toLocaleString()} NL players loaded from CBS export · {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* === THREE COLUMN LAYOUT === */}
      <div className="grid grid-cols-[280px_1fr_280px]" style={{ height: 'calc(100vh - 185px)' }}>

        {/* ─── LEFT: GRAVEYARD ─── */}
        <div className="border-r border-[#2a2a2a] flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="text-[10px] text-[#555] font-mono tracking-widest">THE GRAVEYARD</div>
            <div className="text-[11px] text-[#888] font-mono">{draftLog.length} taken</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[...draftLog].reverse().map((entry, i) => (
              <div
                key={i}
                className={`px-4 py-2.5 border-b border-[#111] text-xs font-mono ${
                  entry.isMyPick ? 'bg-[#DFFF00]/5 acid-bar' : ''
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold truncate ${entry.isMyPick ? 'text-[#DFFF00]' : 'text-[#ccc]'}`}>
                      {entry.player?.name}
                    </div>
                    <div className="text-[#555] text-[10px]">
                      {entry.player?.positions?.join('/')} · {entry.player?.team}
                    </div>
                    <div className="text-[#333] text-[10px]">{entry.team}</div>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <div className="text-[#BF00FF] text-[10px]">#{entry.overallPick}</div>
                    <div className="text-[#333] text-[9px]">R{entry.round}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CENTER: AVAILABLE TALENTS ─── */}
        <div className="border-r border-[#2a2a2a] flex flex-col">
          {/* Filter bar */}
          <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#0a0a0a] space-y-2">
            <div className="flex gap-2">
              <input
                placeholder="Search player or team..."
                value={searchQuery}
                onChange={e => setFilter(() => setSearchQuery(e.target.value))}
                className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] text-white text-xs font-mono px-3 py-1.5 placeholder-[#333] focus:outline-none focus:border-[#DFFF00]"
              />
              <select
                value={sortBy}
                onChange={e => setFilter(() => setSortBy(e.target.value))}
                className="bg-[#0d0d0d] border border-[#2a2a2a] text-[#888] text-[10px] font-mono px-2 focus:outline-none focus:border-[#BF00FF]"
              >
                <option value="rank">CBS Rank</option>
                <option value="tier">Tier</option>
                <option value="name">Name</option>
                <option value="hr">HR</option>
                <option value="era">ERA</option>
                <option value="k">K</option>
              </select>
            </div>

            {/* Type toggle */}
            <div className="flex gap-1">
              {['All', 'Batters', 'Pitchers'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(() => setTypeFilter(t))}
                  className={`px-3 py-0.5 text-[10px] font-mono transition-all ${
                    typeFilter === t
                      ? 'bg-[#BF00FF] text-black font-bold'
                      : 'bg-[#1a1a1a] text-[#555] hover:text-[#BF00FF]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Position filter */}
            <div className="flex gap-1 flex-wrap">
              {POSITIONS_FILTER.map(pos => (
                <button
                  key={pos}
                  onClick={() => setFilter(() => setPosFilter(pos))}
                  className={`px-2 py-0.5 text-[9px] font-mono transition-all ${
                    posFilter === pos
                      ? 'bg-[#DFFF00] text-black font-bold'
                      : 'bg-[#111] text-[#444] hover:text-[#DFFF00]'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Player list */}
          <div className="flex-1 overflow-y-auto">
            {visiblePlayers.map(player => {
              const injury = getInjury?.(player.name);
              return (
                <div
                  key={player.id}
                  className={`stat-row flex items-center gap-3 px-4 py-2.5 border-b border-[#111] group ${injury ? 'opacity-60' : ''}`}
                >
                  <div className={`text-[9px] font-bold px-1 py-0.5 shrink-0 ${TIER_COLORS[player.tier] || TIER_COLORS[4]}`}>
                    T{player.tier}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white truncate">{player.name}</span>
                      <span className="text-[9px] text-[#444] font-mono shrink-0">#{player.cbsRank}</span>
                      {injury && (
                        <span
                          className="text-[9px] font-bold px-1 py-0.5 shrink-0"
                          style={{ color: injury.color, background: `${injury.color}18` }}
                          title={injury.label}
                        >
                          {injury.icon} {injury.label}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#555] font-mono">
                      {player.positions?.join('/')} · <span className="text-[#666]">{player.team}</span>
                    </div>
                  </div>
                  <div className="hidden lg:block"><StatBadge player={player} /></div>
                  {isMyTurn && (
                    <button
                      onClick={() => draftPlayer(player)}
                      className="shrink-0 px-3 py-1 text-[10px] font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      DRAFT
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-2 border-t border-[#2a2a2a] bg-[#0a0a0a] flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-[10px] font-mono text-[#555] hover:text-[#DFFF00] disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-[10px] font-mono text-[#555]">
                {page + 1} / {totalPages} · {filteredPlayers.length.toLocaleString()} players
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="text-[10px] font-mono text-[#555] hover:text-[#DFFF00] disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* ─── RIGHT: MY ROSTER ─── */}
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#0a0a0a]">
            <div className="text-[10px] text-[#555] font-mono tracking-widest">MY ROSTER</div>
            <div className="text-xs font-bold text-[#DFFF00] font-mono">
              Scribbles · {myRoster.length}/21
            </div>
          </div>

          {/* Positional needs grid */}
          <div className="px-3 py-3 border-b border-[#2a2a2a]">
            <div className="text-[9px] text-[#555] font-mono mb-2 tracking-widest">NEEDS</div>
            <div className="grid grid-cols-4 gap-0.5">
              {ACTIVE_POSITIONS.map(({ slot, count }) => {
                const need = getPositionNeed(slot, count, myRoster);
                return (
                  <div
                    key={slot}
                    className={`text-center text-[8px] font-mono py-1 ${
                      need === 'need'   ? 'bg-[#BF00FF]/20 text-[#BF00FF] border border-[#BF00FF]/40' :
                      need === 'filled' ? 'bg-[#111] text-[#333]' :
                                          'bg-[#39FF14]/10 text-[#39FF14]'
                    }`}
                  >
                    {slot}{count > 1 ? `×${count}` : ''}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-1.5 text-[8px] font-mono">
              <span className="text-[#BF00FF]">■ Need</span>
              <span className="text-[#333]">■ OK</span>
              <span className="text-[#39FF14]">■ Extra</span>
            </div>
          </div>

          {/* Drafted players */}
          <div className="flex-1 overflow-y-auto">
            {myRoster.length === 0 ? (
              <div className="p-4 text-[10px] text-[#333] font-mono">No picks yet...</div>
            ) : (
              myRoster.map((player, i) => (
                <div key={player.id} className="px-4 py-2.5 border-b border-[#111] acid-bar">
                  <div className="text-xs font-bold text-white font-mono truncate">{player.name}</div>
                  <div className="text-[10px] text-[#555] font-mono">
                    {player.positions?.join('/')} · {player.team}
                  </div>
                  <div className="text-[9px] text-[#333] font-mono mt-0.5">
                    R{Math.ceil((draftLog.find(d => d.player?.id === player.id)?.overallPick || 4) / 16)} ·
                    Pick #{draftLog.find(d => d.player?.id === player.id)?.overallPick || 4}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
