import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { WARDEN, getStaticAdvice, calcPositionNeeds } from '../utils/wardenAdvice.js';

export default function AdvisorPanel({ myRoster, currentPick, available }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('draft');
  const [askInput, setAskInput] = useState('');
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const positionNeeds = calcPositionNeeds(myRoster);

  const fetchAdvice = useCallback(async (tab, question = '') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab,
          roster: myRoster,
          needs: positionNeeds,
          available,
          currentPick,
          question,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAdvice(data);
    } catch {
      // Fallback to static advice on error
      setAdvice(getStaticAdvice(tab, myRoster, positionNeeds, currentPick, available));
    } finally {
      setIsLoading(false);
    }
  }, [myRoster, positionNeeds, available, currentPick]);

  // Fetch when panel opens or tab changes (not for 'ask' — user triggers that manually)
  useEffect(() => {
    if (open && activeTab !== 'ask') {
      fetchAdvice(activeTab);
    }
    if (open && activeTab === 'ask') {
      // Show static prompt state for ask tab until user submits
      setAdvice(getStaticAdvice('ask', myRoster, positionNeeds, currentPick, available));
    }
  }, [open, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayAdvice = advice || getStaticAdvice(activeTab, myRoster, positionNeeds, currentPick, available);

  const tabs = [
    { id: 'draft',     label: 'Draft Advice' },
    { id: 'freeagent', label: 'Pickups' },
    { id: 'lineup',    label: 'Lineup' },
    { id: 'ask',       label: 'Ask Warden' },
  ];

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-[#BF00FF] border border-[#BF00FF] hover:bg-[#BF00FF] hover:text-black transition-all uppercase tracking-widest"
      >
        <Sparkles size={14} />
        Get Advice
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/80" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="w-[480px] bg-[#0a0a0a] border-l border-[#2a2a2a] flex flex-col ink-bleed-in">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a] bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{WARDEN.emoji}</div>
                <div>
                  <div className="text-sm font-bold text-[#DFFF00] font-mono uppercase">
                    {WARDEN.name}
                  </div>
                  <div className="text-[10px] text-[#555] font-mono">
                    {WARDEN.title}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#555] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2a2a2a] px-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setAskInput('');
                    setAdvice(null);
                  }}
                  className={`flex-1 py-3 text-[11px] font-mono tracking-widest uppercase transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-[#DFFF00] border-[#DFFF00]'
                      : 'text-[#555] border-transparent hover:text-[#BF00FF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={20} className="animate-spin text-[#BF00FF]" />
                  <div className="text-[11px] text-[#555] font-mono tracking-widest">THE WARDEN CONSULTS THE RUNES...</div>
                </div>
              ) : (
                <>
                  {/* Advice text */}
                  <div className="space-y-2">
                    <p className="text-sm text-[#ccc] font-mono leading-relaxed">
                      {displayAdvice.line1}
                    </p>
                    <p className="text-sm text-[#999] font-mono leading-relaxed">
                      {displayAdvice.line2}
                    </p>
                    <p className="text-xs text-[#666] font-mono italic leading-relaxed">
                      {displayAdvice.line3}
                    </p>
                  </div>

                  {/* Suggestions list */}
                  {displayAdvice.suggestions.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[#1a1a1a]">
                      <div className="text-[10px] text-[#555] font-mono tracking-wider uppercase">Suggestions</div>
                      {displayAdvice.suggestions.map((sugg, i) => (
                        <div key={i} className="text-xs text-[#DFFF00] font-mono pl-2 border-l border-[#DFFF00]/30">
                          • {sugg}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ask input */}
                  {activeTab === 'ask' && (
                    <div className="pt-4 border-t border-[#1a1a1a] space-y-2">
                      <input
                        type="text"
                        placeholder="Ask The Warden something..."
                        value={askInput}
                        onChange={e => setAskInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && askInput.trim() && fetchAdvice('ask', askInput)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-mono px-3 py-2 placeholder-[#333] focus:outline-none focus:border-[#DFFF00]"
                      />
                      <button
                        onClick={() => askInput.trim() && fetchAdvice('ask', askInput)}
                        disabled={!askInput.trim()}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        CONSULT
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Roster context indicator */}
              <div className="pt-4 border-t border-[#1a1a1a] space-y-1">
                <div className="text-[10px] text-[#555] font-mono tracking-widest uppercase">Context</div>
                <div className="text-[10px] text-[#666] font-mono">
                  Roster: {myRoster.length}/21<br />
                  Pick: #{currentPick}<br />
                  Needs: {Object.values(positionNeeds).filter(s => s === 'need').length} positions
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#1a1a1a] text-[9px] text-[#333] font-mono">
              🔮 The Warden has kept these records since the first NL game was played.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
