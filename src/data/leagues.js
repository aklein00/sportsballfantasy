// Master league registry — all sports, all leagues
import { LEAGUE as blueDream, MY_TEAM as blueDreamTeam } from './blueDream.js';
import { FOOTBALL_LEAGUES } from './footballLeagues.js';

export const ALL_LEAGUES = [
  {
    ...blueDream,
    myTeam: blueDreamTeam,
    active: true,
  },
  ...FOOTBALL_LEAGUES.map(league => ({
    ...league,
    active: league.active !== false,
  })),
];

export const SPORT_ICONS = {
  baseball: '⚾',
  football: '🏈',
  basketball: '🏀',
  hockey: '🏒',
};

export function isFootballLeague(id) {
  return FOOTBALL_LEAGUES.some(l => l.id === id);
}

export function getLeagueById(id) {
  return ALL_LEAGUES.find(l => l.id === id) || null;
}
