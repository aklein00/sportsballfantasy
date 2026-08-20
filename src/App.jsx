import { useState, useEffect, useCallback } from 'react';
import { ALL_LEAGUES, isFootballLeague } from './data/leagues.js';
import TopBar from './components/TopBar.jsx';
import LeagueSidebar from './components/LeagueSidebar.jsx';
import TeamView from './components/TeamView.jsx';
import DraftWarRoom from './components/DraftWarRoom.jsx';
import FootballTeamView from './components/FootballTeamView.jsx';
import FootballDraftRoom from './components/FootballDraftRoom.jsx';
import SleeperConnect, { getSleeperConfig } from './components/SleeperConnect.jsx';
import RulesDrawer from './components/RulesDrawer.jsx';
import { useDraftState } from './hooks/useDraftState.js';
import { usePlayerData } from './hooks/usePlayerData.js';
import { useNflPlayerData } from './hooks/useNflPlayerData.js';
import { useSleeperLeague } from './hooks/useSleeperLeague.js';
import { useFootballDraft } from './hooks/useFootballDraft.js';

function App() {
  const [activeLeagueId, setActiveLeagueId]   = useState('californian-dynasty');
  const [activeSection,  setActiveSection]    = useState('team');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rulesOpen, setRulesOpen]             = useState(false);
  const [prospectWatchlist, setProspectWatchlist] = useState(
    () => JSON.parse(localStorage.getItem('sbf_watchlist') || '[]')
  );
  const [sleeperConfig, setSleeperConfig] = useState(null);

  const isFootball = isFootballLeague(activeLeagueId);

  useEffect(() => {
    localStorage.setItem('sbf_watchlist', JSON.stringify(prospectWatchlist));
  }, [prospectWatchlist]);

  useEffect(() => {
    if (activeLeagueId === 'californian-dynasty') {
      setSleeperConfig(getSleeperConfig('californian-dynasty'));
    } else {
      setSleeperConfig(null);
    }
  }, [activeLeagueId]);

  const handleSleeperConnect = useCallback((config) => {
    setSleeperConfig(config);
  }, []);

  const draftState  = useDraftState();
  const playerData  = usePlayerData();
  const nflData     = useNflPlayerData();
  const footballDraft = useFootballDraft(isFootball ? activeLeagueId : null);
  const sleeperLeague = useSleeperLeague(
    sleeperConfig?.sleeperLeagueId || null,
    null
  );

  const activeLeague = ALL_LEAGUES.find(l => l.id === activeLeagueId);
  const liveData = isFootball ? nflData : playerData;

  return (
    <div className="grid h-screen overflow-hidden" style={{ gridTemplateRows: '64px 1fr' }}>
      <TopBar
        activeLeague={activeLeague}
        activeSection={activeSection}
        playerData={liveData}
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
          {!isFootball && activeSection === 'team' && (
            <TeamView
              myRoster={draftState.myRoster}
              playerData={playerData}
              prospectWatchlist={prospectWatchlist}
              setProspectWatchlist={setProspectWatchlist}
            />
          )}
          {!isFootball && activeSection === 'draft' && (
            <div className="h-full overflow-y-auto">
              <DraftWarRoom playerData={playerData} />
            </div>
          )}
          {!isFootball && activeSection === 'freeagents' && (
            <TeamView
              myRoster={draftState.myRoster}
              playerData={playerData}
              prospectWatchlist={prospectWatchlist}
              setProspectWatchlist={setProspectWatchlist}
            />
          )}

          {isFootball && activeSection === 'team' && (
            <div className="h-full overflow-y-auto">
              {activeLeagueId === 'californian-dynasty' && (
                <div className="p-6 pb-0">
                  <SleeperConnect leagueId="californian-dynasty" onConnect={handleSleeperConnect} />
                </div>
              )}
              <FootballTeamView
                leagueId={activeLeagueId}
                myRoster={footballDraft.myRoster}
                sleeperRoster={sleeperLeague.myRoster}
              />
            </div>
          )}
          {isFootball && activeSection === 'draft' && (
            <FootballDraftRoom leagueId={activeLeagueId} />
          )}
          {isFootball && activeSection === 'connect' && activeLeagueId === 'californian-dynasty' && (
            <div className="p-6">
              <SleeperConnect leagueId="californian-dynasty" onConnect={handleSleeperConnect} />
              {sleeperConfig?.sleeperLeagueId && (
                <div className="mt-4 punk-card p-4">
                  <div className="text-[10px] text-[#DFFF00] font-mono tracking-widest mb-2">LEAGUE DATA</div>
                  {sleeperLeague.loading ? (
                    <div className="text-xs font-mono text-[#555]">Loading Sleeper data...</div>
                  ) : sleeperLeague.league ? (
                    <div className="text-xs font-mono text-[#888] space-y-1">
                      <div>Name: <span className="text-white">{sleeperLeague.league.name}</span></div>
                      <div>Teams: <span className="text-[#DFFF00]">{sleeperLeague.league.total_rosters}</span></div>
                      <div>Status: <span className="text-[#BF00FF]">{sleeperLeague.league.status}</span></div>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-[#FF006E]">
                      {sleeperLeague.error || 'Could not load league — verify league ID'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <RulesDrawer
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        activeLeague={activeLeague}
      />
    </div>
  );
}

export default App;
