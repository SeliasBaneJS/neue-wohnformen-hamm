export type CharacterData = {
  id: string;
  name: string;
  x: number;
  y: number;
  shirtColor: string;
  hairColor: string;
  gender: 'M' | 'F';
};

export type ItemData = {
  id: string;
  type: 'beer' | 'salad' | 'coal';
  x: number;
  y: number;
};

// Smaller map, closer to satellite image proportions
export const GAME_BOUNDS = { width: 1600, height: 1400 };

export const OBSTACLES = [
  // Vicanus I Building - L-Shape (top right, matching satellite view)
  // Main wing (horizontal, along Kentroper Weg at the top)
  { id: 'house_main', x: 700, y: 0, w: 900, h: 300, type: 'house' },
  // Side wing (vertical, right side going down)
  { id: 'house_wing', x: 1200, y: 300, w: 400, h: 400, type: 'house' },
  
  // Terrasse between the L-wings
  { id: 'terrasse', x: 900, y: 300, w: 300, h: 150, type: 'table' },

  // Parkplatz (bottom center) - asphalt area
  { id: 'parkplatz', x: 500, y: 1100, w: 400, h: 200, type: 'parking' },

  // Tables in the garden
  { id: 'table_main', x: 550, y: 650, w: 180, h: 80, type: 'table' },
  { id: 'stehtisch_1', x: 850, y: 550, w: 50, h: 50, type: 'table' },

  // Trees (left side, matching satellite - forest edge)
  { id: 'tree_1', x: 100, y: 200, w: 70, h: 70, type: 'tree' },
  { id: 'tree_2', x: 50, y: 400, w: 70, h: 70, type: 'tree' },
  { id: 'tree_3', x: 120, y: 600, w: 70, h: 70, type: 'tree' },
  { id: 'tree_4', x: 80, y: 850, w: 70, h: 70, type: 'tree' },
  // Bottom left trees
  { id: 'tree_5', x: 200, y: 1100, w: 70, h: 70, type: 'tree' },
  { id: 'tree_6', x: 100, y: 1200, w: 70, h: 70, type: 'tree' },
  // Right side tree
  { id: 'tree_7', x: 1100, y: 900, w: 70, h: 70, type: 'tree' },

  // The Grill (moved slightly right/down, away from the table)
  { id: 'grill', x: 820, y: 700, w: 80, h: 80, type: 'grill' },
];

export const ITEMS: ItemData[] = [
  { id: 'item_coal', type: 'coal', x: 650, y: 1180 },    // On the Parkplatz!
  { id: 'item_salad', type: 'salad', x: 870, y: 570 },   // At the stehtisch
  { id: 'item_beer', type: 'beer', x: 300, y: 900 },     // Near the bike path
];

export const CHARACTERS: CharacterData[] = [
  // Diana & Jakob together near the terrasse
  { id: 'diana', name: 'Diana', x: 1000, y: 500, shirtColor: '#8a2be2', hairColor: '#4b3621', gender: 'F' },
  { id: 'jakob', name: 'Jakob', x: 1040, y: 510, shirtColor: '#1e90ff', hairColor: '#e5c158', gender: 'M' },
  
  // Edeltraud at the main table
  { id: 'edeltraud', name: 'Edeltraud', x: 520, y: 680, shirtColor: '#ff6347', hairColor: '#dcdcdc', gender: 'F' },
  
  // Jörg & Pe at the grill
  { id: 'joerg', name: 'Jörg', x: 780, y: 710, shirtColor: '#8B0000', hairColor: '#8b4513', gender: 'M' },
  { id: 'petra', name: 'Pe', x: 860, y: 720, shirtColor: '#e0b0ff', hairColor: '#f4a460', gender: 'F' },

  // Hans wandering around the center
  { id: 'hans', name: 'Hans', x: 500, y: 800, shirtColor: '#556b2f', hairColor: '#d3d3d3', gender: 'M' },

  // Sandra & Stephan - relaxing at the far bench
  { id: 'sandra', name: 'Sandra', x: 300, y: 700, shirtColor: '#ff69b4', hairColor: '#8b4513', gender: 'F' },
  { id: 'stephan', name: 'Stephan', x: 340, y: 690, shirtColor: '#008080', hairColor: '#000000', gender: 'M' },

  // Thorsten & Angelika at stehtisch
  { id: 'thorsten', name: 'Thorsten', x: 830, y: 530, shirtColor: '#4682b4', hairColor: '#a9a9a9', gender: 'M' },
  { id: 'angelika', name: 'Angelika', x: 880, y: 540, shirtColor: '#3cb371', hairColor: '#deb887', gender: 'F' },

  // Others at the table area
  { id: 'marlies', name: 'Marlies', x: 560, y: 620, shirtColor: '#dda0dd', hairColor: '#f5f5f5', gender: 'F' },
  { id: 'daniel', name: 'Daniel', x: 600, y: 630, shirtColor: '#ff8c00', hairColor: '#cd853f', gender: 'M' },
  { id: 'irene', name: 'Irene', x: 480, y: 660, shirtColor: '#4169e1', hairColor: '#e6e6fa', gender: 'F' },
  { id: 'karin', name: 'Karin', x: 620, y: 700, shirtColor: '#daa520', hairColor: '#fffafa', gender: 'F' },
];
