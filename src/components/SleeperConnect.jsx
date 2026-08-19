import { useState, useEffect } from 'react';
import { fetchUserByUsername, fetchUserLeagues } from '../services/sleeperApi.js';

const STORAGE_KEY = 'sbf_sleeper_config';

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export default function SleeperConnect({ leagueId, onConnect }) {
  const [username, setUsername] = useState('');
  const [sleeperLeagueId, setSleeperLeagueId] = useState('');
  const [userLeagues, setUserLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const config = loadConfig();
    const leagueConfig = config[leagueId];
    if (leagueConfig) {
      setUsername(leagueConfig.username || '');
      setSleeperLeagueId(leagueConfig.sleeperLeagueId || '');
      setConnected(!!leagueConfig.sleeperLeagueId);
      onConnect?.(leagueConfig);
    }
  }, [leagueId, onConnect]);

  const lookupUser = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const user = await fetchUserByUsername(username.trim());
      if (!user?.user_id) throw new Error('User not found on Sleeper');
      const leagues = await fetchUserLeagues(user.user_id, '2026');
      setUserLeagues(leagues || []);
      if (!leagues?.length) {
        setError('No 2026 NFL leagues found for this user');
      }
    } catch (err) {
      setError(err.message);
      setUserLeagues([]);
    } finally {
      setLoading(false);
    }
  };

  const connect = (selectedLeagueId = sleeperLeagueId) => {
    if (!selectedLeagueId) return;
    const config = loadConfig();
    const leagueConfig = {
      username: username.trim(),
      sleeperLeagueId: selectedLeagueId,
      connectedAt: new Date().toISOString(),
    };
    config[leagueId] = leagueConfig;
    saveConfig(config);
    setSleeperLeagueId(selectedLeagueId);
    setConnected(true);
    onConnect?.(leagueConfig);
  };

  const disconnect = () => {
    const config = loadConfig();
    delete config[leagueId];
    saveConfig(config);
    setConnected(false);
    setSleeperLeagueId('');
    setUserLeagues([]);
    onConnect?.(null);
  };

  return (
    <div className="punk-card p-5 border border-[#BF00FF]/30">
      <div className="text-[10px] text-[#BF00FF] font-mono tracking-widest mb-3">
        SLEEPER CONNECTION
      </div>

      {connected ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#39FF14]" style={{ boxShadow: '0 0 6px #39FF14' }} />
            <span className="text-xs font-mono text-[#39FF14]">CONNECTED</span>
          </div>
          <div className="text-xs font-mono text-[#888] mb-1">Username: <span className="text-white">{username}</span></div>
          <div className="text-xs font-mono text-[#888] mb-4">League ID: <span className="text-[#DFFF00]">{sleeperLeagueId}</span></div>
          <button
            onClick={disconnect}
            className="text-[10px] font-mono font-bold text-[#FF006E] border border-[#FF006E] px-3 py-1.5 hover:bg-[#FF006E] hover:text-black transition-all uppercase tracking-widest"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-[#555] font-mono tracking-wider block mb-1">SLEEPER USERNAME</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your_sleeper_username"
                className="flex-1 bg-[#111] border border-[#333] px-3 py-2 text-xs font-mono text-white focus:border-[#DFFF00] outline-none"
              />
              <button
                onClick={lookupUser}
                disabled={loading || !username.trim()}
                className="px-3 py-2 text-[10px] font-mono font-bold bg-[#BF00FF] text-black hover:bg-[#DFFF00] transition-all disabled:opacity-40 uppercase tracking-widest"
              >
                {loading ? '...' : 'LOOKUP'}
              </button>
            </div>
          </div>

          {userLeagues.length > 0 && (
            <div>
              <label className="text-[10px] text-[#555] font-mono tracking-wider block mb-1">SELECT LEAGUE</label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {userLeagues.map(l => (
                  <button
                    key={l.league_id}
                    onClick={() => connect(l.league_id)}
                    className="w-full text-left px-3 py-2 text-xs font-mono border border-[#2a2a2a] hover:border-[#DFFF00] hover:text-[#DFFF00] transition-all"
                  >
                    <span className="text-white">{l.name}</span>
                    <span className="text-[#555] ml-2">{l.total_rosters} teams</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] text-[#555] font-mono tracking-wider block mb-1">OR ENTER LEAGUE ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sleeperLeagueId}
                onChange={e => setSleeperLeagueId(e.target.value)}
                placeholder="123456789012345678"
                className="flex-1 bg-[#111] border border-[#333] px-3 py-2 text-xs font-mono text-white focus:border-[#DFFF00] outline-none"
              />
              <button
                onClick={() => connect()}
                disabled={!sleeperLeagueId.trim()}
                className="px-3 py-2 text-[10px] font-mono font-bold bg-[#DFFF00] text-black hover:bg-white transition-all disabled:opacity-40 uppercase tracking-widest"
              >
                CONNECT
              </button>
            </div>
          </div>

          {error && (
            <div className="text-[10px] font-mono text-[#FF006E]">{error}</div>
          )}

          <div className="text-[10px] text-[#444] font-mono leading-relaxed">
            Connect your Sleeper account to pull live rosters and draft data for Californian Dynasty.
            League must exist on Sleeper before connection works.
          </div>
        </div>
      )}
    </div>
  );
}

export function getSleeperConfig(leagueId) {
  const config = loadConfig();
  return config[leagueId] || null;
}
