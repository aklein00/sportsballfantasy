export default function TopBar({ activeLeague, activeSection, playerData }) {
  const { loading, lastUpdated, error, refresh } = playerData || {};

  const sectionLabels = {
    team:        'My Team',
    draft:       'Draft War Room',
    freeagents:  'Free Agents',
  };

  return (
    <header className="h-16 border-b border-[#2a2a2a] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0">
      {/* Logo */}
      <div className="glitch flex items-center gap-3">
        <span
          className="text-2xl font-black tracking-tight text-[#DFFF00] uppercase"
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em' }}
        >
          SportsBall<span className="text-[#BF00FF]">Fantasy</span>
        </span>
        <span className="text-[10px] text-[#BF00FF] border border-[#BF00FF] px-1.5 py-0.5 font-mono hidden sm:inline">
          PUNK·MAGIC
        </span>
      </div>

      {/* Breadcrumb */}
      {activeLeague && (
        <div className="text-xs font-mono text-[#555] hidden md:flex items-center gap-1">
          <span className="text-[#BF00FF]">{activeLeague.name}</span>
          <span className="text-[#333] mx-1">›</span>
          <span className="text-[#DFFF00]">{sectionLabels[activeSection] || activeSection}</span>
        </div>
      )}

      {/* Live status */}
      <div className="flex items-center gap-4 text-xs text-[#555] font-mono">
        {loading ? (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DFFF00] inline-block animate-pulse" />
            FETCHING...
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
        <span className="hidden sm:inline">
          DRAFT: <span className="text-[#DFFF00]">MAR 7 · 3:00PM ET</span>
        </span>
      </div>
    </header>
  );
}
