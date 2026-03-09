// Vercel Serverless Function — The Warden AI Advisor
// Calls Google Gemini API with NL-only fantasy baseball context

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// System prompt for The Warden
const WARDEN_SYSTEM_PROMPT = `You are The Warden, Guardian of the NL Realm — an ancient fantasy baseball advisor who speaks in cryptic wisdom but knows the NL-only scoring categories cold (BA/HR/R/RBI/SB + ERA/K/S/W/WHIP). 

RESPONSE FORMAT:
- Exactly 3 short lines of advice
- Up to 3 bullet suggestions (can be fewer)
- Under 120 words total
- Address the owner as "son" or "friend"
- Never mention AL teams or AL players
- Speak in omens, runes, and mystical metaphors mixed with practical fantasy advice

VOICE: Ancient, cryptic, deeply NL-loyal. You've kept these records since the first NL game was played.

SCORING CATEGORIES (sacred):
Batting: BA, HR, R, RBI, SB
Pitching: ERA, K, S, W, WHIP

Remember: This is an NL-only league. Players traded to AL teams mid-season do not accumulate stats. The owner calls you "The Warden" and you guard their NL realm with ancient wisdom.`;

export default async function handler(request, response) {
  // CORS headers for local dev
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tab, roster, needs, question, available, currentPick } = request.body;

    if (!tab) {
      return response.status(400).json({ error: 'Missing required field: tab' });
    }

    // Build context-aware prompt based on tab
    let userPrompt = '';
    
    switch (tab) {
      case 'draft':
        userPrompt = buildDraftPrompt(roster, needs, currentPick, available);
        break;
      case 'lineup':
        userPrompt = buildLineupPrompt(roster, needs);
        break;
      case 'freeagent':
        userPrompt = buildFreeAgentPrompt(roster, needs, available);
        break;
      case 'prospects':
        userPrompt = buildProspectsPrompt(roster, needs);
        break;
      case 'ask':
        userPrompt = buildAskPrompt(question, roster, needs);
        break;
      default:
        userPrompt = buildLineupPrompt(roster, needs);
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`${WARDEN_SYSTEM_PROMPT}\n\n${userPrompt}`);
    const geminiResponse = result.response.text();

    // Parse response into structured format
    const parsed = parseGeminiResponse(geminiResponse);

    // Track API usage (optional — for cost monitoring)
    console.log(`[Warden API] Tab: ${tab}, Words: ${parsed.line1.split(' ').length + parsed.line2.split(' ').length + parsed.line3.split(' ').length}`);

    return response.status(200).json(parsed);

  } catch (error) {
    console.error('[Warden API Error]:', error.message);
    return response.status(500).json({
      error: 'The spirits are silent. Try again, friend.',
      details: error.message
    });
  }
}

// Build context-aware prompts for each tab

function buildDraftPrompt(roster, needs, currentPick, available) {
  const round = currentPick ? Math.ceil(currentPick / 16) : '?';
  const pickInRound = currentPick ? ((currentPick - 1) % 16) + 1 : '?';
  const needsList = Object.entries(needs || {}).filter(([_, v]) => v === 'need').map(([k]) => k);
  const rosterNames = (roster || []).map(p => `${p.name} (${p.positions?.join('/')})`).join(', ') || 'none yet';
  const top10 = (available || []).slice(0, 10).map(p =>
    `- ${p.name} (${p.positions?.join('/')}, ${p.team || 'NL'}) Tier ${p.tier || '?'} — BA:${p.stats?.avg || '?'} HR:${p.stats?.hr || '?'} SB:${p.stats?.sb || '?'}`
  ).join('\n');

  return `Snake draft in progress. NL-only league. 20 rounds, 16 teams.
Current pick: #${currentPick || '?'} (Round ${round}, pick ${pickInRound} in round)
Roster so far (${roster?.length || 0} players): ${rosterNames}
Unfilled positions needed: ${needsList.length > 0 ? needsList.join(', ') : 'none — looking for best available'}

Top 10 available players:
${top10 || 'None provided'}

Advice needed: Recommend my top 3 picks right now. Explain why each fits my roster and addresses my positional needs. Consider NL-only eligibility, category contribution (BA/HR/R/RBI/SB for hitters; ERA/K/S/W/WHIP for pitchers), and round value.`;
}

function buildLineupPrompt(roster, needs) {
  const rosterCount = roster?.length || 0;
  const needsList = Object.entries(needs || {}).filter(([_, v]) => v === 'need').map(([k]) => k);
  
  return `Current roster: ${rosterCount}/21 players
Positional needs: ${needsList.length > 0 ? needsList.join(', ') : 'none'}
Advice needed: Lineup optimization for this week's H2H period.
Which starters should I set? Any injury concerns? Category matchups?`;
}

function buildFreeAgentPrompt(roster, needs, available) {
  const needsList = Object.entries(needs || {}).filter(([_, v]) => v === 'need').map(([k]) => k);
  const topAvailable = (available || []).slice(0, 10).map(p => 
    `- ${p.name} (${p.positions?.join('/')}) — ${p.tier ? `Tier ${p.tier}` : ''}`
  ).join('\n');

  return `Current roster: ${roster?.length || 0}/21 players
Positional needs: ${needsList.length > 0 ? needsList.join(', ') : 'none'}
Top available free agents:
${topAvailable || 'None provided'}

Advice needed: Which free agent(s) should I target on waivers this week? Consider FAB budget ($100), positional need, and NL-only eligibility.`;
}

function buildProspectsPrompt(roster, needs) {
  const needsList = Object.entries(needs || {}).filter(([_, v]) => v === 'need').map(([k]) => k);

  return `Current roster: ${roster?.length || 0}/21 players
Positional needs: ${needsList.length > 0 ? needsList.join(', ') : 'none'}
Advice needed: Which minor league prospects should I monitor? Keeper league implications. Call-up watch. Games played eligibility clocks.`;
}

function buildAskPrompt(question, roster, needs) {
  return `Owner's question: "${question || 'General advice'}"
Current roster: ${roster?.length || 0}/21 players
Positional needs: ${Object.entries(needs || {}).filter(([_, v]) => v === 'need').length} positions need filling

The spirits await your query, friend. Speak, and The Warden shall advise.`;
}

// Parse Gemini's free-form response into structured format

function parseGeminiResponse(text) {
  const lines = text.trim().split('\n').filter(line => line.trim().length > 0);
  
  const result = {
    line1: lines[0] || 'The runes speak, but the message is unclear...',
    line2: lines[1] || 'Seek wisdom in the numbers, friend.',
    line3: lines[2] || 'The stars align for your NL realm.',
    suggestions: []
  };

  // Extract bullet suggestions (lines starting with - or • or *)
  const suggestionPatterns = [/^[-•*]\s*(.+)/, /^\d+\.\s*(.+)/];
  
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    for (const pattern of suggestionPatterns) {
      const match = line.match(pattern);
      if (match) {
        result.suggestions.push(match[1]);
        break;
      }
    }
  }

  // If no bullets found, use remaining lines as suggestions
  if (result.suggestions.length === 0 && lines.length > 3) {
    result.suggestions = lines.slice(3, 6).map(s => s.replace(/^[-•*\d.]+\s*/, ''));
  }

  // Limit to 3 suggestions
  result.suggestions = result.suggestions.slice(0, 3);

  return result;
}
