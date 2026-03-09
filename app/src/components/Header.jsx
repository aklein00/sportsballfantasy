export default function Header({ activeTab, setActiveTab, playerData }) {
  const { loading, lastUpdated, error, refresh } = playerData || {};

  const tabs = [
    { id: 'dashboard', label: '◈ Crystal Ball' },
    { id: 'draft',     label: '⚡ Draft War Room' },
    { id: 'roster',    label: '⚾ My Roster' },
  ];

  return (
    <header className="border-b border-[#2a2a2a] bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a]">
        <div className="glitch flex items-center gap-3">
          <span
            className="text-2xl font-black tracking-tight text-[#DFFF00] uppercase"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em' }}
          >
            SportsBall<span className="text-[#BF00FF]">Fantasy</span>
          </span>
          <span className="text-[10px] text-[#BF00FF] border border-[#BF00FF] px-1.5 py-0.5 font-mono">
            PUNK·MAGIC
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#555] font-mono">
          {/* Live data status */}
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DFFF00] inline-block animate-pulse" />
              FETCHING DATA...
            </span>
          ) : error ? (
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 text-[#FF006E] hover:text-white transition-colors"
              title={error}
            >
              <span className="w-2 h-2 rounded-full bg-[#FF006E] inline-block" />
              DATA ERROR · RETRY
            </button>
          ) : (
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 hover:text-[#DFFF00] transition-colors"
              title={lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
            >
              <span className="w-2 h-2 rounded-full bg-[#39FF14] inline-block" style={{ boxShadow: '0 0 6px #39FF14' }} />
              LIVE · {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
            </button>
          )}
          <span>DRAFT: <span className="text-[#DFFF00]">MAR 7 · 3:00PM ET</span></span>
        </div>
      </div>

      <nav className="flex px-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest border-b-2 transition-all
              ${activeTab === tab.id
                ? 'text-[#DFFF00] border-[#DFFF00]'
                : 'text-[#555] border-transparent hover:text-[#BF00FF] hover:border-[#BF00FF]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
