import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { HOUSE_RULES, SCORING, ROSTER_LIMITS, SCHEDULE } from '../data/blueDream.js';

export default function RulesDrawer({ open: externalOpen, onClose }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [section, setSection] = useState('roster');

  // Support both controlled (from sidebar) and uncontrolled (standalone button) usage
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOpen !== undefined ? (v => { if (!v) onClose?.(); }) : setInternalOpen;

  const sections = [
    { id: 'roster',    label: 'Roster' },
    { id: 'scoring',   label: 'Scoring' },
    { id: 'schedule',  label: 'Schedule' },
    { id: 'rules',     label: 'House Rules' },
  ];

  return (
    <>
      {/* Trigger button — only shown when used standalone (not controlled externally) */}
      {externalOpen === undefined && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-[#BF00FF] border border-[#BF00FF] hover:bg-[#BF00FF] hover:text-black transition-all uppercase tracking-widest"
        >
          <BookOpen size={14} />
          League Rules
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/80" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="w-96 bg-[#0a0a0a] border-l border-[#2a2a2a] flex flex-col ink-bleed-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
              <div>
                <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest">RULE REFERENCE</div>
                <div className="text-lg font-bold text-[#DFFF00] font-mono">Blue Dream</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#555] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Section tabs */}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {section === 'roster' && (
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
              )}

              {section === 'scoring' && (
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
              )}

              {section === 'schedule' && (
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
              )}

              {section === 'rules' && (
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
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
