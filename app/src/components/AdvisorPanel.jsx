import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { WARDEN as AUGUR_MCGEE, getStaticAdvice, getGeminiAdvice, calcPositionNeeds } from '../utils/wardenAdvice.js';

export default function AdvisorPanel({ myRoster, currentPick, available }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('draft');
  const [askInput, setAskInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(getStaticAdvice('draft', [], calcPositionNeeds([]), null, []));
  const [askAdvice, setAskAdvice] = useState(null);

  // Calculate positional needs
  const positionNeeds = calcPositionNeeds(myRoster);

  // Handle CONSULT button click
  const handleConsult = () => {
    if (!askInput.trim() || loading) return;
    
    setLoading(true);
    getGeminiAdvice('ask', myRoster, positionNeeds, askInput, available).then(result => {
      setAskAdvice(result);
      setLoading(false);
    });
  };

  // Fetch advice when tab changes or panel opens
  useEffect(() => {
    if (!open) return;
    
    let cancelled = false;
    
    const fetchAdvice = async () => {
      setLoading(true);
      const result = await getGeminiAdvice(activeTab, myRoster, positionNeeds, null, available);
      if (!cancelled) {
        setAdvice(result);
        setLoading(false);
      }
    };

    fetchAdvice();
    return () => { cancelled = true; };
  }, [activeTab, open, myRoster.length, available.length]);

  const tabs = [
    { id: 'draft', label: 'Draft Advice' },
    { id: 'freeagent', label: 'Pickups' },
    { id: 'lineup', label: 'Lineup' },
    { id: 'ask', label: 'Ask Augur' },
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
                <div className="text-3xl">{AUGUR_MCGEE.emoji}</div>
                <div>
                  <div className="text-sm font-bold text-[#DFFF00] font-mono uppercase">
                    {AUGUR_MCGEE.name}
                  </div>
                  <div className="text-[10px] text-[#555] font-mono">
                    {AUGUR_MCGEE.title}
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
              {/* Advice text */}
              <div className="space-y-2">
                {loading ? (
                  <>
                    <p className="text-sm text-[#666] font-mono leading-relaxed animate-pulse">Consulting the crystal ball...</p>
                    <p className="text-sm text-[#444] font-mono leading-relaxed">The runes shuffle in the void.</p>
                    <p className="text-xs text-[#333] font-mono italic">Patience, friend.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-[#ccc] font-mono leading-relaxed">
                      {advice.line1}
                    </p>
                    <p className="text-sm text-[#999] font-mono leading-relaxed">
                      {advice.line2}
                    </p>
                    <p className="text-xs text-[#666] font-mono italic leading-relaxed">
                      {advice.line3}
                    </p>
                  </>
                )}
              </div>

              {/* Suggestions list */}
              {!loading && advice.suggestions.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#1a1a1a]">
                  <div className="text-[10px] text-[#555] font-mono tracking-wider uppercase">Suggestions</div>
                  {advice.suggestions.map((sugg, i) => (
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
                    onKeyDown={e => e.key === 'Enter' && handleConsult()}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-mono px-3 py-2 placeholder-[#333] focus:outline-none focus:border-[#DFFF00]"
                    disabled={loading}
                  />
                  <button
                    onClick={handleConsult}
                    disabled={loading || !askInput.trim()}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳' : 'CONSULT'} →
                  </button>
                  {askAdvice && (
                    <div className="space-y-2 pt-2 border-t border-[#1a1a1a] ink-bleed-in">
                      <p className="text-sm text-[#ccc] font-mono">{askAdvice.line1}</p>
                      <p className="text-sm text-[#999] font-mono">{askAdvice.line2}</p>
                      <p className="text-xs text-[#666] font-mono italic">{askAdvice.line3}</p>
                      {askAdvice.suggestions.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] text-[#555] font-mono tracking-wider uppercase">Suggestions</div>
                          {askAdvice.suggestions.map((s, i) => (
                            <div key={i} className="text-xs text-[#DFFF00] font-mono pl-2 border-l border-[#DFFF00]/30">
                              • {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
