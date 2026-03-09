// Reusable live stat card for any player
// Usage: <PlayerStatCard player={...} mlbIndex={...} getInjury={...} getNews={...} />
import {
  usePlayerStats,
  formatStat,
  getStatLabel,
  SCORING_HITTING_KEYS,
  SCORING_PITCHING_KEYS,
} from '../hooks/usePlayerStats.js';

const TIER_COLORS = { 1: '#DFFF00', 2: '#BF00FF', 3: '#888', 4: '#444' };

export default function PlayerStatCard({ player, mlbIndex, getInjury, getNews, compact = false }) {
  const { stats, loading, error, isPitcher } = usePlayerStats(
    player?.name,
    mlbIndex,
    player?.positions || []
  );

  const injury = getInjury?.(player?.name);
  const news   = getNews?.(player?.name, 1) || [];

  const scoringKeys = isPitcher ? SCORING_PITCHING_KEYS : SCORING_HITTING_KEYS;

  if (!player) return null;

  return (
    <div className="punk-card p-4 acid-bar">
      {/* Player header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono">{player.name}</span>
            {injury && (
              <span
                className="text-[9px] font-bold px-1 py-0.5"
                style={{ color: injury.color, background: `${injury.color}18` }}
              >
                {injury.icon} {injury.label}
              </span>
            )}
          </div>
          <div className="text-[10px] text-[#555] font-mono mt-0.5">
            {player.positions?.join(' / ')} · {player.team}
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-[10px] font-bold font-mono"
            style={{ color: TIER_COLORS[player.tier] || '#555' }}
          >
            Tier {player.tier}
          </div>
          <div className="text-[9px] text-[#444] font-mono">CBS #{player.cbsRank}</div>
        </div>
      </div>

      {/* Live stats — scoring cats */}
      <div className="mb-3">
        <div className="text-[9px] text-[#555] font-mono tracking-widest mb-1.5 uppercase">
          2026 Season Stats {loading ? '· fetching...' : stats ? '· live' : '· projected'}
        </div>
        {error && !stats ? (
          <div className="text-[9px] text-[#555] font-mono">Showing CBS projections</div>
        ) : null}
        <div className="grid grid-cols-5 gap-1">
          {scoringKeys.map(key => {
            const liveVal = stats?.[key];
            const val     = liveVal != null ? formatStat(key, liveVal, isPitcher) : '—';
            const label   = getStatLabel(key, isPitcher);
            const isLive  = liveVal != null;
            return (
              <div key={key} className="text-center bg-[#0d0d0d] px-1 py-2">
                <div
                  className="text-sm font-bold font-mono"
                  style={{ color: isLive ? '#DFFF00' : '#444' }}
                >
                  {loading ? '…' : val}
                </div>
                <div className="text-[8px] text-[#555] font-mono uppercase">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CBS projections row (always shown for comparison) */}
      {!compact && (
        <div className="mb-3">
          <div className="text-[9px] text-[#444] font-mono tracking-widest mb-1">PROJECTED</div>
          <div className="grid grid-cols-5 gap-1">
            {isPitcher ? (
              <>
                <StatPill label="ERA"  value={player.stats?.ERA}  />
                <StatPill label="K"    value={player.stats?.K}    />
                <StatPill label="W"    value={player.stats?.W}    />
                <StatPill label="SV"   value={player.stats?.S}    />
                <StatPill label="WHIP" value={player.stats?.WHIP} />
              </>
            ) : (
              <>
                <StatPill label="AVG" value={player.stats?.AVG} />
                <StatPill label="HR"  value={player.stats?.HR}  />
                <StatPill label="RBI" value={player.stats?.RBI} />
                <StatPill label="R"   value={player.stats?.R}   />
                <StatPill label="SB"  value={player.stats?.SB}  />
              </>
            )}
          </div>
        </div>
      )}

      {/* Latest news */}
      {news.length > 0 && (
        <div className="border-t border-[#1a1a1a] pt-2">
          <div className="text-[9px] text-[#BF00FF] font-mono mb-1">LATEST NEWS</div>
          {news.map((item, i) => (
            <div key={i} className="text-[9px] text-[#888] font-mono leading-relaxed">
              <span className="text-[#555] mr-1">{item.age}</span>{item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="text-center bg-[#0a0a0a] px-1 py-1.5">
      <div className="text-[10px] font-mono text-[#555]">{value ?? '—'}</div>
      <div className="text-[8px] text-[#333] font-mono uppercase">{label}</div>
    </div>
  );
}
