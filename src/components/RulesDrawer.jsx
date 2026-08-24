import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { HOUSE_RULES, SCORING } from '../data/blueDream.js';
import { getFootballLeague } from '../data/footballLeagues.js';
import { isFootballLeague } from '../data/leagues.js';

function BaseballRulesContent({ section }) {
  if (section === 'roster') {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">ROSTER LIMITS</div>
          {[
            ['Active', '21 (fixed)'],
            ['Reserve', '0–2'],
            ['Injured List', '0–14'],
            ['Minors', '0–5'],
            ['Max Total', '42'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
              <span className="text-[#888]">{k}</span>
              <span className="text-[#DFFF00]">{v}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-wider mb-2">ACTIVE POSITIONS</div>
          {[
            ['C', '2'], ['1B', '1'], ['2B', '1'], ['3B', '1'], ['SS', '1'],
            ['LF', '1'], ['CF', '1'], ['RF', '1'], ['OF flex', '1'], ['UTIL', '2'],
            ['SP', '3'], ['RP', '3'], ['P flex', '3'],
          ].map(([pos, cnt]) => (
            <div key={pos} className="flex justify-between text-xs font-mono py-1 border-b border-[#1a1a1a]">
              <span className="text-[#888]">{pos}</span>
              <span className="text-white">{cnt}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-[#555] font-mono">
          Eligibility: Primary position + 10 games last year or 1 game this year.
        </div>
      </div>
    );
  }

  if (section === 'scoring') {
    return (
      <div className="space-y-4">
        <div className="bg-[#1a1a1a] p-3 text-xs font-mono text-[#BF00FF]">
          Head-to-Head · Most Categories · No tiebreaker (ties allowed)
        </div>
        <div>
          <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">BATTING</div>
          {SCORING.batting.map(s => (
            <div key={s.stat} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
              <span className="text-[#DFFF00] font-bold">{s.stat}</span>
              <span className="text-[#888]">{s.label}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-wider mb-2">PITCHING</div>
          {SCORING.pitching.map(s => (
            <div key={s.stat} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
              <span className="text-[#BF00FF] font-bold">{s.stat}</span>
              <span className="text-[#888]">{s.label}{s.lowerIsBetter ? ' ↓' : ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'schedule') {
    return (
      <div className="space-y-3">
        {[
          ['Season Start', 'Mar 25, 2026'],
          ['Period Length', 'Weekly (Mondays)'],
          ['Lineup Deadline', '5 min before first game'],
          ['Playoffs Start', 'Period 21'],
          ['Playoff Length', '3 Periods'],
          ['Trade Deadline', 'Aug 1, 2026 · 11:59PM ET'],
          ['Keeper Deadline', 'Mar 6, 2026'],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-[#1a1a1a] pb-3">
            <div className="text-[10px] text-[#555] font-mono mb-0.5">{k}</div>
            <div className="text-xs text-white font-mono">{v}</div>
          </div>
        ))}
        <div className="bg-[#1a1a1a] p-3">
          <div className="text-[10px] text-[#DFFF00] font-mono mb-1">WAIVERS</div>
          <div className="text-xs text-[#888] font-mono">
            FAB · $100 budget · Runs every night<br />
            Order never resets · Min 1 day on waivers
          </div>
        </div>
      </div>
    );
  }

  if (section === 'rules') {
    return (
      <div className="space-y-4">
        {HOUSE_RULES.map(rule => (
          <div key={rule.name} className="border border-[#2a2a2a] p-3">
            <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">
              {rule.name}
            </div>
            <div className="text-xs text-[#ccc] font-mono leading-relaxed">
              {rule.summary}
            </div>
            {rule.detail && (
              <div className="text-[10px] text-[#555] font-mono mt-2 leading-relaxed">
                {rule.detail}
              </div>
            )}
          </div>
        ))}
        <div className="border border-[#BF00FF]/30 bg-[#BF00FF]/5 p-3">
          <div className="text-[10px] text-[#BF00FF] font-mono mb-1">PLAYER POOL</div>
          <div className="text-xs text-white font-mono">NL PLAYERS ONLY</div>
          <div className="text-[10px] text-[#555] font-mono mt-1">
            AL transfers during season: stats don't accumulate.
            Cannot keep players acquired via waivers from non-NL teams.
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function FootballRulesContent({ league, section }) {
  if (!league) return null;

  if (section === 'roster') {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">ROSTER LIMITS</div>
          {Object.entries(league.rosterLimits || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
              <span className="text-[#888] capitalize">{k}</span>
              <span className="text-[#DFFF00]">{v.min}–{v.max}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] text-[#BF00FF] font-mono tracking-wider mb-2">STARTER SLOTS</div>
          {(league.starterSlots || []).map(s => (
            <div key={s.slot} className="flex justify-between text-xs font-mono py-1 border-b border-[#1a1a1a]">
              <span className="text-[#888]">{s.label}</span>
              <span className="text-white">×{s.count}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-[#555] font-mono">
          {league.teamCount} teams · ${league.entryFee} entry · {league.format}
        </div>
      </div>
    );
  }

  if (section === 'scoring') {
    const scoring = league.scoring || {};
    if (!league.scoring) {
      return (
        <div className="text-xs font-mono text-[#888]">
          Scoring not confirmed for this league.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="bg-[#1a1a1a] p-3 text-xs font-mono text-[#BF00FF]">
          {scoring.format || 'Dynasty Scoring'}
        </div>
        {['passing', 'rushing', 'receiving', 'kicking', 'misc'].map(cat => {
          const stats = scoring[cat];
          if (!stats?.length) return null;
          return (
            <div key={cat}>
              <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2 uppercase">{cat}</div>
              {stats.map(s => (
                <div key={s.stat} className="flex justify-between text-xs font-mono py-1.5 border-b border-[#1a1a1a]">
                  <span className="text-[#DFFF00] font-bold">{s.stat}</span>
                  <span className="text-[#888]">{s.label} ({s.ptsPer > 0 ? '+' : ''}{s.ptsPer})</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  if (section === 'schedule') {
    const sched = league.schedule || {};
    return (
      <div className="space-y-3">
        {[
          ['Season Start', sched.seasonStart],
          ['Trade Deadline', sched.tradeDeadline],
          ['Playoffs Start', sched.playoffsStart],
          ['Playoff Teams', sched.playoffTeams?.toString()],
          ['Draft Date', league.draft?.date ? new Date(league.draft.date).toLocaleDateString() : 'TBD'],
          ['Draft Rounds', league.draft?.rounds?.toString()],
        ].filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="border-b border-[#1a1a1a] pb-3">
            <div className="text-[10px] text-[#555] font-mono mb-0.5">{k}</div>
            <div className="text-xs text-white font-mono">{v}</div>
          </div>
        ))}
        <div className="bg-[#1a1a1a] p-3">
          <div className="text-[10px] text-[#DFFF00] font-mono mb-1">PLATFORM</div>
          <div className="text-xs text-[#888] font-mono">{league.platform} · Dynasty Startup {league.season}</div>
        </div>
      </div>
    );
  }

  if (section === 'rules') {
    return (
      <div className="space-y-4">
        {(league.rules || []).map(rule => (
          <div key={rule.name} className="border border-[#2a2a2a] p-3">
            <div className="text-[10px] text-[#DFFF00] font-mono tracking-wider mb-2">
              {rule.name}
            </div>
            <div className="text-xs text-[#ccc] font-mono leading-relaxed">
              {rule.summary}
            </div>
            {rule.detail && (
              <div className="text-[10px] text-[#555] font-mono mt-2 leading-relaxed">
                {rule.detail}
              </div>
            )}
          </div>
        ))}
        <div className="border border-[#BF00FF]/30 bg-[#BF00FF]/5 p-3">
          <div className="text-[10px] text-[#BF00FF] font-mono mb-1">DYNASTY FORMAT</div>
          <div className="text-xs text-white font-mono">ROSTERS CARRY OVER YEAR TO YEAR</div>
          <div className="text-[10px] text-[#555] font-mono mt-1">
            Startup draft establishes initial rosters. No redraft reset.
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function RulesDrawer({ open: externalOpen, onClose, activeLeague }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [section, setSection] = useState('roster');

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOpen !== undefined ? (v => { if (!v) onClose?.(); }) : setInternalOpen;

  const isFootball = activeLeague && isFootballLeague(activeLeague.id);
  const footballLeague = isFootball ? getFootballLeague(activeLeague.id) : null;
  const leagueName = activeLeague?.name || 'Blue Dream';

  const sections = [
    { id: 'roster',    label: 'Roster' },
    { id: 'scoring',   label: 'Scoring' },
    { id: 'schedule',  label: 'Schedule' },
    { id: 'rules',     label: isFootball ? 'League Rules' : 'House Rules' },
  ];

  return (
    <>
      {externalOpen === undefined && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-[#BF00FF] border border-[#BF00FF] hover:bg-[#BF00FF] hover:text-black transition-all uppercase tracking-widest"
        >
          <BookOpen size={14} />
          League Rules
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/80" onClick={() => setOpen(false)} />

          <div className="w-96 bg-[#0a0a0a] border-l border-[#2a2a2a] flex flex-col ink-bleed-in">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
              <div>
                <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest">RULE REFERENCE</div>
                <div className="text-lg font-bold text-[#DFFF00] font-mono">{leagueName}</div>
                {isFootball && (
                  <div className="text-[10px] text-[#555] font-mono mt-0.5">
                    {activeLeague.platform} · Dynasty Startup
                  </div>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-[#555] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-[#2a2a2a]">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex-1 py-2 text-[10px] font-mono tracking-wider uppercase transition-all ${
                    section === s.id
                      ? 'text-[#DFFF00] border-b-2 border-[#DFFF00]'
                      : 'text-[#555] hover:text-[#BF00FF]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isFootball ? (
                <FootballRulesContent league={footballLeague} section={section} />
              ) : (
                <BaseballRulesContent section={section} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
