export default function RookiePickComparison({ comparison }) {
  if (!comparison) return null;

  const rec = comparison.recommendation;
  const candidates = comparison.candidates || [];

  return (
    <div className="border-b border-[#BF00FF] bg-[#0A0A0A]">
      <div className="px-3 py-2 bg-[#111] border-b border-[#BF00FF]/40 flex items-center justify-between gap-2">
        <span className="text-[10px] text-[#DFFF00] font-mono tracking-widest">
          {comparison.overallPick === 21 ? '2.05 — HIT COMMIT'
            : comparison.overallPick === 25 ? '2.09 — HIT COMMIT'
              : comparison.overallPick === 37 ? '3.05 — NEXT'
                : `${comparison.overallPick} — HIT COMMIT`}
        </span>
        {comparison.takenOrderUnconfirmed && (
          <span className="text-[8px] text-[#555] font-mono">TAKEN 1–4 ORDER UNCONFIRMED</span>
        )}
      </div>

      {rec && (
        <div className="px-3 py-3 border-b border-[#1a1a1a]">
          <div className="text-[8px] text-[#39FF14] font-mono tracking-widest mb-1">TAKE THIS</div>
          <div className="text-lg font-black text-[#DFFF00] uppercase leading-none" style={{ letterSpacing: '-0.03em' }}>
            {rec.name}
          </div>
          <div className="text-[10px] text-[#888] font-mono mt-1">
            {rec.positions?.[0]} · {rec.team}
          </div>
          <p className="text-[11px] text-[#F0EDE0] font-mono mt-2 leading-snug">{rec.line}</p>
        </div>
      )}

      <div className="px-3 py-2 bg-[#111] border-b border-[#1a1a1a]">
        <span className="text-[10px] text-[#BF00FF] font-mono tracking-widest">REMAINING — COMPARE</span>
      </div>

      {candidates.map((p) => (
        <div key={p.id || p.name} className="px-3 py-2 border-b border-[#1a1a1a]">
          <div className="flex items-baseline gap-2">
            <span className="text-[9px] font-bold font-mono text-[#DFFF00] w-8 shrink-0">
              {p.positions?.[0]}
            </span>
            <span className="text-xs text-white font-mono flex-1 truncate">{p.name}</span>
            <span className="text-[9px] text-[#555] font-mono">{p.team}</span>
            <span
              className="text-[8px] font-bold font-mono shrink-0"
              style={{
                color:
                  p.verdict === 'TAKE' ? '#39FF14'
                    : p.verdict === 'CLOSE 2ND' || p.verdict === 'STEAL' ? '#FFE600'
                      : p.verdict === 'NEXT PICK' || p.verdict === 'IF SINGLETON GONE' || p.verdict === '2.06 BACKUP' ? '#FF006E'
                        : p.verdict === 'PASS' || p.verdict === 'LATER' ? '#555'
                          : '#FF006E',
              }}
            >
              {p.verdict}
            </span>
          </div>
          {p.why && (
            <p className="text-[10px] text-[#888] font-mono mt-1 leading-snug pl-8">{p.why}</p>
          )}
        </div>
      ))}

      {comparison.followUp && (
        <>
          <div className="px-3 py-2 bg-[#111] border-b border-[#BF00FF]/40 border-t border-[#BF00FF]/40">
            <span className="text-[10px] text-[#DFFF00] font-mono tracking-widest">
              {comparison.followUp.label || 'NEXT PICK'}
            </span>
          </div>
          {comparison.followUp.recommendation && (
            <div className="px-3 py-3 border-b border-[#1a1a1a]">
              <div className="text-[8px] text-[#39FF14] font-mono tracking-widest mb-1">THEN TAKE</div>
              <p className="text-[11px] text-[#F0EDE0] font-mono leading-snug">
                {comparison.followUp.recommendation.line}
              </p>
            </div>
          )}
          {(comparison.followUp.candidates || []).map((p) => (
            <div key={p.id || p.name} className="px-3 py-2 border-b border-[#1a1a1a]">
              <div className="flex items-baseline gap-2">
                <span className="text-[9px] font-bold font-mono text-[#DFFF00] w-8 shrink-0">
                  {p.positions?.[0]}
                </span>
                <span className="text-xs text-white font-mono flex-1 truncate">{p.name}</span>
                <span className="text-[9px] text-[#555] font-mono">{p.team}</span>
                <span className="text-[8px] font-bold font-mono shrink-0 text-[#FF006E]">
                  {p.verdict}
                </span>
              </div>
              {p.why && (
                <p className="text-[10px] text-[#888] font-mono mt-1 leading-snug pl-8">{p.why}</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
