// Shared Warden advisor logic — used by WardenCard and AdvisorPanel
export const WARDEN = {
  name: 'The Warden',
  title: 'Guardian of the NL Realm',
  emoji: '🧙',
  voice: 'ancient NL-only guardian',
};

export function calcPositionNeeds(myRoster) {
  const filledCounts = {};
  myRoster.forEach(p => {
    p.positions?.forEach(pos => {
      filledCounts[pos] = (filledCounts[pos] || 0) + 1;
    });
  });

  return {
    C:  filledCounts['C']  < 2 ? 'need' : 'filled',
    '1B': filledCounts['1B'] < 1 ? 'need' : 'filled',
    '2B': filledCounts['2B'] < 1 ? 'need' : 'filled',
    '3B': filledCounts['3B'] < 1 ? 'need' : 'filled',
    SS: filledCounts['SS'] < 1 ? 'need' : 'filled',
    OF: filledCounts['OF'] < 4 ? 'need' : 'filled',
    SP: filledCounts['SP'] < 3 ? 'need' : 'filled',
    RP: filledCounts['RP'] < 3 ? 'need' : 'filled',
  };
}

export function getStaticAdvice(tab, roster, needs, currentPick, available) {
  const needsList = Object.entries(needs)
    .filter(([_, status]) => status === 'need')
    .map(([pos]) => pos)
    .slice(0, 3);

  const topAvailable = (available || []).slice(0, 5);

  const responses = {
    draft: {
      line1: `Son, I've been scrying the crystal ball and I see some things...`,
      line2:
        needsList.length > 0
          ? `You're thin at ${needsList.join(', ')} — that's where the stars align for you.`
          : `You've got a well-rounded squad so far. Look for depth and upside.`,
      line3: `At pick #${currentPick || '?'}, I'd be watching...`,
      suggestions: topAvailable.slice(0, 3).map(p => `${p.name} (${p.positions.join('/')}) — tier ${p.tier}`),
    },
    freeagent: {
      line1: `The spirits whisper of waiver opportunities...`,
      line2: needsList.length > 0
        ? `Your needs spell it plain: ${needsList.join(', ')}. Hunt for those positions on waivers.`
        : `You're solid across the board. Seek upside and volume.`,
      line3: `This week, I'd chase...`,
      suggestions: topAvailable.slice(0, 3).map(p => `${p.name} (${p.team})`),
    },
    lineup: {
      line1: `The runes favor your starters this period.`,
      line2: `Kyle Tucker looks strong. Watch for injury flags before locktime.`,
      line3: `Set 'em early, check back before first pitch.`,
      suggestions: roster.slice(0, 3).map(p => `${p.name} — ready to roll`),
    },
    prospects: {
      line1: `The minors hold tomorrow's stars. Guard your watchlist well.`,
      line2: needsList.length > 0
        ? `Keep an eye on prospects who can fill ${needsList.join(', ')} — keeper leagues favor the patient.`
        : `With your roster filled, monitor service time and call-up windows.`,
      line3: `Top prospects I'd track this week...`,
      suggestions: ['Monitor gamesPlayed eligibility clocks', 'Check IL-to-roster call-ups daily', 'NL-only restrictions apply to keepers'],
    },
    ask: {
      line1: `Ask away, friend. The spirits are listening.`,
      line2: `What vexes ye about your roster?`,
      line3: `(Phase 1 shell — real AI advice coming Phase 3)`,
      suggestions: [],
    },
  };

  return responses[tab] || responses.lineup;
}
