// Master league registry — all sports, all leagues
import { LEAGUE as blueDream, MY_TEAM as blueDreamTeam } from './blueDream.js';

export const ALL_LEAGUES = [
  {
    ...blueDream,
    myTeam: blueDreamTeam,
    active: true,
  },
  // Football placeholders
  {
    id: 'football-1',
    name: 'Coming Soon',
    sport: 'football',
    platform: 'TBD',
    season: 2026,
    active: false,
    myTeam: null,
  },
  {
    id: 'football-2',
    name: 'Coming Soon',
    sport: 'football',
    platform: 'TBD',
    season: 2026,
    active: false,
    myTeam: null,
  },
  {
    id: 'football-3',
    name: 'Coming Soon',
    sport: 'football',
    platform: 'TBD',
    season: 2026,
    active: false,
    myTeam: null,
  },
];

export const SPORT_ICONS = {
  baseball: '⚾',
  football: '🏈',
  basketball: '🏀',
  hockey: '🏒',
};
