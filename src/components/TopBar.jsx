import { isFootballLeague } from '../data/leagues.js';

function formatDraftDate(league) {
  if (!league?.draft?.date) return null;
  const d = new Date(league.draft.date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
    + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toUpperCase();
}

export default function TopBar({ activeLeague, activeSection, playerData }) {
  const { loading, lastUpdated, error, refresh } = playerData || {};
  const isFootball = activeLeague && isFootballLeague(activeLeague.id);

  const sectionLabels = {
    team:        'My Team',
    draft:       isFootball ? 'Startup Draft' : 'Draft War Room',
    freeagents:  'Free Agents',
    connect:     'Sleeper Link',
  };

  const draftLabel = isFootball
    ? (activeLeague?.draft?.status === 'pre-draft' ? 'STARTUP' : 'DRAFT')
    : 'DRAFT';

  const draftDate = isFootball
    ? formatDraftDate(activeLeague)
    : 'MAR 7 · 3:00PM ET';

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
      </div>

      {/* Breadcrumb */}
      {activeLeague && (
        <div className="text-xs font-mono text-[#555] hidden md:flex items-center gap-1">
          <span className="text-[#BF00FF]">{activeLeague.name}</span>
          <span className="text-[#333] mx-1">›</span>
          <span className="text-[#DFFF00]">{sectionLabels[activeSection] || activeSection}</span>
          {isFootball && (
            <>
              <span className="text-[#333] mx-1">·</span>
              <span className="text-[#555]">{activeLeague.platform}</span>
            </>
          )}
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
        {draftDate && (
          <span className="hidden sm:inline">
            {draftLabel}: <span className="text-[#DFFF00]">{draftDate}</span>
          </span>
        )}
      </div>
    </header>
  );
}
