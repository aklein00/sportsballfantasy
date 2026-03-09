import { useState } from 'react';
import { WARDEN, getStaticAdvice, calcPositionNeeds } from '../utils/wardenAdvice.js';

const TABS = [
  { id: 'lineup',    label: 'Lineup' },
  { id: 'freeagent', label: 'Pickups' },
  { id: 'prospects', label: 'Prospects' },
  { id: 'ask',       label: 'Ask' },
];

export default function WardenCard({ myRoster = [], available = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('lineup');
  const [askInput, setAskInput] = useState('');

  const needs = calcPositionNeeds(myRoster);
  const advice = getStaticAdvice(activeTab, myRoster, needs, null, available);

  const needCount = Object.values(needs).filter(s => s === 'need').length;

  return (
    <div className="punk-card acid-bar mb-4">
      {/* Collapsed header (always visible) */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#DFFF00]/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{WARDEN.emoji}</span>
          <div>
            <div className="text-[11px] font-bold text-[#DFFF00] font-mono uppercase tracking-widest">
              {WARDEN.name} · {WARDEN.title}
            </div>
            {!expanded && (
              <div className="text-[10px] text-[#888] font-mono mt-0.5 max-w-md truncate">
                "{advice.line1}"
              </div>
            )}
          </div>
        </div>
        <span className="text-[10px] text-[#555] font-mono shrink-0 ml-4">
          {expanded ? 'COLLAPSE ▲' : 'EXPAND ▼'}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[#1a1a1a]">
          {/* Tabs */}
          <div className="flex border-b border-[#1a1a1a] px-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setAskInput(''); }}
                className={`flex-1 py-2.5 text-[10px] font-mono tracking-widest uppercase transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[#DFFF00] border-[#DFFF00]'
                    : 'text-[#444] border-transparent hover:text-[#BF00FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Advice */}
          <div className="p-4 space-y-3">
            <div className="space-y-1.5">
              <p className="text-sm text-[#ccc] font-mono leading-relaxed">{advice.line1}</p>
              <p className="text-xs text-[#999] font-mono leading-relaxed">{advice.line2}</p>
              <p className="text-[11px] text-[#555] font-mono italic">{advice.line3}</p>
            </div>

            {advice.suggestions.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-[#1a1a1a]">
                <div className="text-[9px] text-[#444] font-mono tracking-wider uppercase">Suggestions</div>
                {advice.suggestions.map((s, i) => (
                  <div key={i} className="text-xs text-[#DFFF00] font-mono pl-2 border-l border-[#DFFF00]/30">
                    • {s}
                  </div>
                ))}
              </div>
            )}

            {/* Ask input */}
            {activeTab === 'ask' && (
              <div className="pt-2 border-t border-[#1a1a1a] space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask The Warden anything..."
                    value={askInput}
                    onChange={e => setAskInput(e.target.value)}
                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-mono px-3 py-2 placeholder-[#333] focus:outline-none focus:border-[#DFFF00]"
                  />
                  <button className="px-4 py-2 text-xs font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all shrink-0">
                    CONSULT →
                  </button>
                </div>
                <div className="text-[9px] text-[#333] font-mono">(Phase 1 shell — Gemini AI coming Phase 3)</div>
              </div>
            )}

            {/* Context footer */}
            <div className="pt-2 border-t border-[#1a1a1a] flex gap-4 text-[9px] text-[#444] font-mono">
              <span>Roster {myRoster.length}/21</span>
              <span>{needCount} positions needed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
