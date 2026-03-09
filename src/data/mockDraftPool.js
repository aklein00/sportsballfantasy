// Mock NL player pool for Draft War Room prototype
// Will be replaced by live CBS API data once session token is provided

export const PLAYER_POOL = [
  // Catchers
  { id: 'will-smith', name: 'Will Smith', team: 'LAD', positions: ['C'], tier: 2, projectedStats: { BA: '.258', HR: 18, R: 60, RBI: 65, SB: 1, ERA: null, K: null, S: null, W: null, WHIP: null } },
  { id: 'sean-murphy', name: 'Sean Murphy', team: 'ATL', positions: ['C'], tier: 2, projectedStats: { BA: '.240', HR: 20, R: 55, RBI: 68, SB: 0 } },
  { id: 'tyler-stephenson', name: 'Tyler Stephenson', team: 'CIN', positions: ['C'], tier: 3, projectedStats: { BA: '.262', HR: 13, R: 48, RBI: 55, SB: 2 } },
  { id: 'gabriel-moreno', name: 'Gabriel Moreno', team: 'ARI', positions: ['C'], tier: 3, projectedStats: { BA: '.270', HR: 10, R: 45, RBI: 50, SB: 4 } },
  { id: 'daulton-varsho', name: 'Daulton Varsho', team: 'TOR', positions: ['C', 'OF'], tier: 2, projectedStats: { BA: '.235', HR: 20, R: 65, RBI: 60, SB: 12 } },

  // First Base
  { id: 'freddie-freeman', name: 'Freddie Freeman', team: 'LAD', positions: ['1B'], tier: 1, projectedStats: { BA: '.297', HR: 22, R: 90, RBI: 90, SB: 10 } },
  { id: 'pete-alonso', name: 'Pete Alonso', team: 'NYM', positions: ['1B'], tier: 1, projectedStats: { BA: '.245', HR: 38, R: 80, RBI: 100, SB: 2 } },
  { id: 'christian-walker', name: 'Christian Walker', team: 'ARI', positions: ['1B'], tier: 2, projectedStats: { BA: '.258', HR: 26, R: 75, RBI: 80, SB: 4 } },
  { id: 'bryce-harper', name: 'Bryce Harper', team: 'PHI', positions: ['1B', 'OF'], tier: 1, projectedStats: { BA: '.285', HR: 28, R: 88, RBI: 90, SB: 8 } },

  // Second Base
  { id: 'ketel-marte', name: 'Ketel Marte', team: 'ARI', positions: ['2B', 'OF'], tier: 1, projectedStats: { BA: '.280', HR: 22, R: 82, RBI: 78, SB: 12 } },
  { id: 'ozzie-albies', name: 'Ozzie Albies', team: 'ATL', positions: ['2B'], tier: 2, projectedStats: { BA: '.255', HR: 20, R: 78, RBI: 72, SB: 8 } },
  { id: 'luis-arraez', name: 'Luis Arraez', team: 'SDP', positions: ['2B', '1B', '3B'], tier: 2, projectedStats: { BA: '.330', HR: 5, R: 65, RBI: 55, SB: 3 } },

  // Third Base
  { id: 'manny-machado', name: 'Manny Machado', team: 'SDP', positions: ['3B', 'SS'], tier: 2, projectedStats: { BA: '.275', HR: 24, R: 78, RBI: 80, SB: 5 } },
  { id: 'nolan-arenado', name: 'Nolan Arenado', team: 'STL', positions: ['3B'], tier: 2, projectedStats: { BA: '.268', HR: 22, R: 70, RBI: 82, SB: 2 } },
  { id: 'alec-bohm', name: 'Alec Bohm', team: 'PHI', positions: ['3B', '1B'], tier: 3, projectedStats: { BA: '.278', HR: 18, R: 68, RBI: 75, SB: 3 } },

  // Shortstop
  { id: 'francisco-lindor', name: 'Francisco Lindor', team: 'NYM', positions: ['SS'], tier: 1, projectedStats: { BA: '.270', HR: 25, R: 88, RBI: 85, SB: 18 } },
  { id: 'dansby-swanson', name: 'Dansby Swanson', team: 'CHC', positions: ['SS'], tier: 2, projectedStats: { BA: '.248', HR: 18, R: 72, RBI: 70, SB: 14 } },
  { id: 'bo-bichette', name: 'Bo Bichette', team: 'TOR', positions: ['SS'], tier: 2, projectedStats: { BA: '.275', HR: 18, R: 78, RBI: 72, SB: 10 } },

  // Outfield
  { id: 'kyle-tucker', name: 'Kyle Tucker', team: 'CHC', positions: ['OF', 'RF'], tier: 1, projectedStats: { BA: '.280', HR: 29, R: 88, RBI: 90, SB: 20 }, draftedBy: 'me', round: 1, pick: 4 },
  { id: 'cody-bellinger', name: 'Cody Bellinger', team: 'CHC', positions: ['OF', '1B'], tier: 2, projectedStats: { BA: '.265', HR: 22, R: 78, RBI: 72, SB: 10 } },
  { id: 'fernando-tatis', name: 'Fernando Tatis Jr.', team: 'SDP', positions: ['OF', 'SS'], tier: 1, projectedStats: { BA: '.270', HR: 30, R: 88, RBI: 88, SB: 28 } },
  { id: 'ronald-acuna', name: 'Ronald Acuña Jr.', team: 'ATL', positions: ['OF'], tier: 1, projectedStats: { BA: '.285', HR: 28, R: 95, RBI: 85, SB: 50 } },
  { id: 'christian-yelich', name: 'Christian Yelich', team: 'MIL', positions: ['OF'], tier: 2, projectedStats: { BA: '.275', HR: 18, R: 72, RBI: 68, SB: 15 } },
  { id: 'teoscar-hernandez', name: 'Teoscar Hernandez', team: 'LAD', positions: ['OF'], tier: 2, projectedStats: { BA: '.265', HR: 28, R: 78, RBI: 85, SB: 8 } },

  // Starting Pitchers
  { id: 'zack-wheeler', name: 'Zack Wheeler', team: 'PHI', positions: ['SP'], tier: 1, projectedStats: { BA: null, HR: null, R: null, RBI: null, SB: null, ERA: '2.95', K: 210, S: 0, W: 15, WHIP: '1.05' } },
  { id: 'blake-snell', name: 'Blake Snell', team: 'SFG', positions: ['SP'], tier: 1, projectedStats: { ERA: '3.10', K: 200, S: 0, W: 13, WHIP: '1.12' } },
  { id: 'spencer-strider', name: 'Spencer Strider', team: 'ATL', positions: ['SP'], tier: 1, projectedStats: { ERA: '3.05', K: 225, S: 0, W: 14, WHIP: '1.02' } },
  { id: 'logan-webb', name: 'Logan Webb', team: 'SFG', positions: ['SP'], tier: 1, projectedStats: { ERA: '3.25', K: 180, S: 0, W: 14, WHIP: '1.10' } },
  { id: 'corbin-burnes', name: 'Corbin Burnes', team: 'BAL', positions: ['SP'], tier: 1, projectedStats: { ERA: '2.92', K: 215, S: 0, W: 15, WHIP: '1.04' } },
  { id: 'dylanjj-cease', name: 'Dylan Cease', team: 'SDP', positions: ['SP'], tier: 2, projectedStats: { ERA: '3.40', K: 195, S: 0, W: 12, WHIP: '1.18' } },
  { id: 'michael-king', name: 'Michael King', team: 'SDP', positions: ['SP'], tier: 2, projectedStats: { ERA: '3.55', K: 170, S: 0, W: 11, WHIP: '1.20' } },

  // Relief Pitchers
  { id: 'ryan-helsley', name: 'Ryan Helsley', team: 'STL', positions: ['RP'], tier: 1, projectedStats: { ERA: '2.50', K: 88, S: 38, W: 4, WHIP: '0.95' } },
  { id: 'felix-bautista', name: 'Félix Bautista', team: 'BAL', positions: ['RP'], tier: 1, projectedStats: { ERA: '2.70', K: 80, S: 36, W: 3, WHIP: '1.00' } },
  { id: 'camilo-doval', name: 'Camilo Doval', team: 'SFG', positions: ['RP'], tier: 2, projectedStats: { ERA: '3.10', K: 72, S: 30, W: 4, WHIP: '1.10' } },
  { id: 'alexis-diaz', name: 'Alexis Díaz', team: 'CIN', positions: ['RP'], tier: 2, projectedStats: { ERA: '3.05', K: 70, S: 32, W: 3, WHIP: '1.08' } },
];

export const POSITIONS = ['All', 'C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP'];

export const TEAMS_16 = [
  'Scribbles', 'Team 2', 'Team 3', 'Team 4',
  'Team 5', 'Team 6', 'Team 7', 'Team 8',
  'Team 9', 'Team 10', 'Team 11', 'Team 12',
  'Team 13', 'Team 14', 'Team 15', 'Team 16',
];
