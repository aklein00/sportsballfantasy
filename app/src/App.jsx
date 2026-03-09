import { useState, useEffect } from 'react';
import { ALL_LEAGUES } from './data/leagues.js';
import TopBar from './components/TopBar.jsx';
import LeagueSidebar from './components/LeagueSidebar.jsx';
import TeamView from './components/TeamView.jsx';
import DraftWarRoom from './components/DraftWarRoom.jsx';
import RulesDrawer from './components/RulesDrawer.jsx';
import { useDraftState } from './hooks/useDraftState.js';
import { usePlayerData } from './hooks/usePlayerData.js';

function App() {
  const [activeLeagueId, setActiveLeagueId]   = useState('blue-dream');
  const [activeSection,  setActiveSection]    = useState('team');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rulesOpen, setRulesOpen]             = useState(false);
  const [prospectWatchlist, setProspectWatchlist] = useState(
    () => JSON.parse(localStorage.getItem('sbf_watchlist') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('sbf_watchlist', JSON.stringify(prospectWatchlist));
  }, [prospectWatchlist]);

  const draftState  = useDraftState();
  const playerData  = usePlayerData();
  const activeLeague = ALL_LEAGUES.find(l => l.id === activeLeagueId);

  return (
    <div className="grid h-screen overflow-hidden" style={{ gridTemplateRows: '64px 1fr' }}>
      <TopBar
        activeLeague={activeLeague}
        activeSection={activeSection}
        playerData={playerData}
      />

      <div className="grid overflow-hidden" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <LeagueSidebar
          activeLeagueId={activeLeagueId}
          setActiveLeagueId={setActiveLeagueId}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLeagueInfo={() => setRulesOpen(true)}
        />

        <main className="overflow-hidden">
          {activeSection === 'team' && (
            <TeamView
              myRoster={draftState.myRoster}
              playerData={playerData}
              prospectWatchlist={prospectWatchlist}
              setProspectWatchlist={setProspectWatchlist}
            />
          )}
          {activeSection === 'draft' && (
            <div className="h-full overflow-y-auto">
              <DraftWarRoom playerData={playerData} />
            </div>
          )}
          {activeSection === 'freeagents' && (
            <TeamView
              myRoster={draftState.myRoster}
              playerData={playerData}
              prospectWatchlist={prospectWatchlist}
              setProspectWatchlist={setProspectWatchlist}
            />
          )}
        </main>
      </div>

      <RulesDrawer open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

export default App;
