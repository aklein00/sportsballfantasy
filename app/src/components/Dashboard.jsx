import { ALL_LEAGUES } from '../data/leagues.js';
import { SCORING, PAYOUTS } from '../data/blueDream.js';
import PlayerStatCard from './PlayerStatCard.jsx';

export default function Dashboard({ playerData, myRoster }) {
  const footballLeagues = ALL_LEAGUES.filter(l => l.sport === 'football');
  const { mlbIndex, getInjury, getNews } = playerData || {};

  return (
    <div className="ink-bleed-in p-6 space-y-6">

      {/* === CRYSTAL BALL HEADER === */}
      <div className="punk-card p-6 acid-bar">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-[#BF00FF] font-mono tracking-widest mb-1">◈ CRYSTAL BALL DASHBOARD</div>
            <h2 className="text-3xl font-black text-[#DFFF00] uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>
              Blue Dream
            </h2>
            <div className="text-xs text-[#555] font-mono mt-1">
              CBS Sports · NL Only · 16 Teams · Season 2026
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#555] font-mono">MY TEAM</div>
            <div className="text-xl font-bold text-white font-mono">Scribbles</div>
            <div className="text-xs text-[#DFFF00] font-mono mt-1">Draft Pick #4</div>
          </div>
        </div>
      </div>

      {/* === KEY DATES === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Draft', value: 'MAR 7 · 3PM ET', color: '#DFFF00' },
          { label: 'Season Start', value: 'MAR 25, 2026', color: '#BF00FF' },
          { label: 'Trade Deadline', value: 'AUG 1, 2026', color: '#FF006E' },
          { label: 'Playoffs Begin', value: 'PERIOD 21', color: '#39FF14' },
        ].map(item => (
          <div key={item.label} className="punk-card p-4 text-center">
            <div className="text-[10px] text-[#555] font-mono tracking-widest mb-1">{item.label}</div>
            <div className="text-sm font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* === MAIN GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SCORING CATEGORIES */}
        <div className="punk-card p-5">
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-4">SCORING SYSTEM</div>
          <div className="text-xs text-[#555] mb-3 font-mono">H2H · MOST CATEGORIES</div>

          <div className="mb-4">
            <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">BATTING</div>
            <div className="space-y-1">
              {SCORING.batting.map(s => (
                <div key={s.stat} className="stat-row flex justify-between px-2 py-1 text-xs font-mono">
                  <span className="text-[#DFFF00] font-bold">{s.stat}</span>
                  <span className="text-[#888]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#BF00FF] font-mono tracking-wider mb-2">PITCHING</div>
            <div className="space-y-1">
              {SCORING.pitching.map(s => (
                <div key={s.stat} className="stat-row flex justify-between px-2 py-1 text-xs font-mono">
                  <span className="text-[#BF00FF] font-bold">{s.stat}</span>
                  <span className="text-[#888]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROSTER BREAKDOWN */}
        <div className="punk-card p-5">
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-4">ROSTER LIMITS</div>
          <div className="space-y-2 mb-4">
            {[
              { label: 'ACTIVE',   value: '21', color: '#DFFF00' },
              { label: 'RESERVE',  value: '0–2', color: '#BF00FF' },
              { label: 'INJ. LIST',value: '0–14', color: '#FF006E' },
              { label: 'MINORS',   value: '0–5', color: '#39FF14' },
              { label: 'MAX TOTAL',value: '42', color: '#555' },
            ].map(row => (
              <div key={row.label} className="stat-row flex justify-between px-2 py-1.5 text-xs font-mono border-b border-[#1a1a1a]">
                <span className="text-[#888]">{row.label}</span>
                <span className="font-bold" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">ACTIVE SLOTS</div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { s: 'C×2' }, { s: '1B' }, { s: '2B' },
              { s: '3B' }, { s: 'SS' }, { s: 'LF' },
              { s: 'CF' }, { s: 'RF' }, { s: 'OF' },
              { s: 'U×2' }, { s: 'SP×3' }, { s: 'RP×3' },
              { s: 'P×3' },
            ].map(({ s }) => (
              <span key={s} className="text-center text-[10px] font-mono bg-[#1a1a1a] px-2 py-1 text-[#DFFF00]">{s}</span>
            ))}
          </div>
        </div>

        {/* PAYOUTS & PLAYOFFS */}
        <div className="punk-card p-5">
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-4">PRIZE STRUCTURE</div>

          <div className="mb-4">
            <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">REGULAR SEASON</div>
            {PAYOUTS.regularSeason.map(p => (
              <div key={p.place} className="stat-row flex justify-between px-2 py-1.5 text-xs font-mono border-b border-[#1a1a1a]">
                <span className="text-[#888]">{p.place}</span>
                <span className="text-[#DFFF00] font-bold">${p.prize}</span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-[#BF00FF] font-mono tracking-wider mb-2">PLAYOFFS</div>
            {PAYOUTS.playoffs.map(p => (
              <div key={p.place} className="stat-row flex justify-between px-2 py-1.5 text-xs font-mono border-b border-[#1a1a1a]">
                <span className="text-[#888]">{p.place}</span>
                <span className="font-bold" style={{ color: p.prize >= 600 ? '#DFFF00' : p.prize >= 200 ? '#BF00FF' : '#888' }}>
                  ${p.prize}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#1a1a1a] p-3 text-xs font-mono text-[#555]">
            <div className="text-[#DFFF00] mb-1 text-[10px] tracking-wider">PLAYOFF FORMAT</div>
            6 teams · 4 Div Winners + 2 WC<br />
            Top 2 records get BYE<br />
            Tiebreaker: XBH
          </div>
        </div>
      </div>

      {/* === FOOTBALL PLACEHOLDERS === */}
      <div>
        <div className="text-[10px] text-[#555] font-mono tracking-widest mb-3">FOOTBALL LEAGUES — COMING SOON</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {footballLeagues.map((league, i) => (
            <div key={league.id} className="punk-card p-5 border-dashed opacity-40 hover:opacity-60 transition-opacity" style={{ borderColor: '#2a2a2a' }}>
              <div className="text-3xl mb-2">🏈</div>
              <div className="text-xs text-[#555] font-mono">FOOTBALL LEAGUE {i + 1}</div>
              <div className="text-lg font-bold text-[#BF00FF] mt-1">???</div>
              <div className="text-[10px] text-[#333] font-mono mt-2">Awaiting league data...</div>
            </div>
          ))}
        </div>
      </div>

      {/* === WAIVERS === */}
      <div className="punk-card p-5 purple-bar">
        <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-3">TRANSACTION RULES</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="text-[#555] mb-1">SYSTEM</div>
            <div className="text-white">FAB Waivers</div>
          </div>
          <div>
            <div className="text-[#555] mb-1">BUDGET</div>
            <div className="text-[#DFFF00] font-bold">$100</div>
          </div>
          <div>
            <div className="text-[#555] mb-1">RUNS</div>
            <div className="text-white">Every Night</div>
          </div>
          <div>
            <div className="text-[#555] mb-1">PLAYER POOL</div>
            <div className="text-[#BF00FF] font-bold">NL ONLY</div>
          </div>
        </div>
      </div>

      {/* === MY ROSTER LIVE STATS === */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-[#DFFF00] font-mono tracking-widest">
            SCRIBBLES — LIVE STATS
          </div>
          <div className="text-[9px] text-[#555] font-mono">
            Gold = live MLB · dim = projected only
          </div>
        </div>

        {myRoster && myRoster.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myRoster.map(player => (
              <PlayerStatCard
                key={player.id}
                player={player}
                mlbIndex={mlbIndex}
                getInjury={getInjury}
                getNews={getNews}
              />
            ))}
          </div>
        ) : (
          <div className="punk-card p-6 text-center text-[#333] text-xs font-mono">
            No players drafted yet — head to the Draft War Room
          </div>
        )}
      </div>

    </div>
  );
}
