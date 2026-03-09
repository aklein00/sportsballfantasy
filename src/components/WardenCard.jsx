import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
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
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const needs = calcPositionNeeds(myRoster);
  const needCount = Object.values(needs).filter(s => s === 'need').length;

  const fetchAdvice = useCallback(async (tab, question = '') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab, roster: myRoster, needs, available, question }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAdvice(data);
    } catch {
      setAdvice(getStaticAdvice(tab, myRoster, needs, null, available));
    } finally {
      setIsLoading(false);
    }
  }, [myRoster, needs, available]);

  // Fetch when expanded and tab changes (except 'ask' — user-triggered)
  useEffect(() => {
    if (!expanded) return;
    if (activeTab !== 'ask') {
      fetchAdvice(activeTab);
    } else {
      setAdvice(getStaticAdvice('ask', myRoster, needs, null, available));
    }
  }, [expanded, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayAdvice = advice || getStaticAdvice(activeTab, myRoster, needs, null, available);

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
                "{displayAdvice.line1}"
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
                onClick={() => { setActiveTab(tab.id); setAskInput(''); setAdvice(null); }}
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
            {isLoading ? (
              <div className="flex items-center gap-2 py-6 justify-center">
                <Loader2 size={16} className="animate-spin text-[#BF00FF]" />
                <span className="text-[10px] text-[#555] font-mono tracking-widest">CONSULTING THE RUNES...</span>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <p className="text-sm text-[#ccc] font-mono leading-relaxed">{displayAdvice.line1}</p>
                  <p className="text-xs text-[#999] font-mono leading-relaxed">{displayAdvice.line2}</p>
                  <p className="text-[11px] text-[#555] font-mono italic">{displayAdvice.line3}</p>
                </div>

                {displayAdvice.suggestions.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-[#1a1a1a]">
                    <div className="text-[9px] text-[#444] font-mono tracking-wider uppercase">Suggestions</div>
                    {displayAdvice.suggestions.map((s, i) => (
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
                        onKeyDown={e => e.key === 'Enter' && askInput.trim() && fetchAdvice('ask', askInput)}
                        className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-mono px-3 py-2 placeholder-[#333] focus:outline-none focus:border-[#DFFF00]"
                      />
                      <button
                        onClick={() => askInput.trim() && fetchAdvice('ask', askInput)}
                        disabled={!askInput.trim()}
                        className="px-4 py-2 text-xs font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      >
                        CONSULT →
                      </button>
                    </div>
                  </div>
                )}
              </>
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
