import { ALL_LEAGUES, SPORT_ICONS } from '../data/leagues.js';

const SECTIONS = [
  { id: 'team',       label: 'My Team',       icon: '◈' },
  { id: 'draft',      label: 'Draft War Room', icon: '⚡' },
  { id: 'freeagents', label: 'Free Agents',    icon: '⚾' },
];

export default function LeagueSidebar({
  activeLeagueId,
  setActiveLeagueId,
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
  onLeagueInfo,
}) {
  return (
    <aside
      className="flex flex-col border-r border-[#2a2a2a] bg-[#0a0a0a] overflow-hidden transition-all duration-200 shrink-0"
      style={{ width: collapsed ? 56 : 240 }}
    >
      {/* Section Nav */}
      <nav className="flex flex-col pt-3 flex-1">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            title={collapsed ? s.label : ''}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all border-l-2 ${
              activeSection === s.id
                ? 'border-[#DFFF00] text-[#DFFF00] bg-[#DFFF00]/5'
                : 'border-transparent text-[#444] hover:text-[#BF00FF] hover:border-[#BF00FF]'
            }`}
          >
            <span className="text-base shrink-0">{s.icon}</span>
            {!collapsed && <span className="truncate">{s.label}</span>}
          </button>
        ))}

        {/* Separator */}
        <div className="mx-4 my-2 border-t border-[#1a1a1a]" />

        {/* League Info */}
        <button
          onClick={onLeagueInfo}
          title={collapsed ? 'League Info' : ''}
          className="flex items-center gap-3 px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all border-l-2 border-transparent text-[#444] hover:text-[#BF00FF] hover:border-[#BF00FF]"
        >
          <span className="text-base shrink-0">📖</span>
          {!collapsed && <span className="truncate">League Info</span>}
        </button>
      </nav>

      {/* League Switcher */}
      <div className="border-t border-[#1a1a1a] pt-2 pb-1">
        {!collapsed && (
          <div className="px-4 pb-1 text-[9px] text-[#333] font-mono tracking-widest uppercase">Leagues</div>
        )}
        {ALL_LEAGUES.map(league => {
          const icon = SPORT_ICONS[league.sport] || '•';
          const isActive = league.id === activeLeagueId;
          return (
            <button
              key={league.id}
              onClick={() => league.active && setActiveLeagueId(league.id)}
              title={collapsed ? league.name : ''}
              className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-mono transition-all border-l-2 ${
                isActive
                  ? 'border-[#DFFF00] text-[#DFFF00]'
                  : league.active
                  ? 'border-transparent text-[#444] hover:text-[#888]'
                  : 'border-transparent text-[#2a2a2a] cursor-default'
              }`}
              style={{ opacity: league.active ? 1 : 0.4 }}
            >
              <span className="shrink-0">{icon}</span>
              {!collapsed && (
                <span className="truncate">{league.name}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-center h-10 border-t border-[#1a1a1a] text-[#333] hover:text-[#DFFF00] transition-colors font-mono text-xs"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹ COLLAPSE'}
      </button>
    </aside>
  );
}
