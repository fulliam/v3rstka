export interface Position {
  x: number;
  y: number;
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface Resource {
  max: number;
  current: number;
  recovery: number;
}

export interface Health extends Resource {}
export interface Mana extends Resource {}
export interface Stamina extends Resource {}

export interface Crit {
  chance: number;
  factor: number;
}

export interface Attack {
  damage: number;
  type: string;
  range: number;
  level: number;
}

export interface Money {
  coins: Record<string, number>;
  gems: Record<string, number>;
}

export interface Params {
  strength: number;
  agility: number;
  intelligence: number;
  stamina: number;
  luck: number;
}

export type StatKeys =
  | 'strength'
  | 'agility'
  | 'intelligence'
  | 'stamina'
  | 'luck';

export interface Skill {
  damage: number;
  type: string;
  range: number;
  level: number;
}

export interface Skills {
  fireshtorm: Skill;
  lighting: Skill;
  poisonshtorm: Skill;
}

export interface CharacterInfo {
  category: string;
  group?: string;
  character: string;
  location: string;
  level: number;
  experience: number;
  levelUpExperience: number;
}

export interface CharacterState {
  position: Position;
  direction: Direction;
  action: string;
  health: Health;
  mana: Mana;
  stamina: Stamina;
  armor: number;
}

export interface CharacterStats {
  speed: Record<string, number>;
  params: Params;
  skills: Skills;
  skillPoints: number;
  statPoints: number;
  damage: Record<string, number>;
  attacks: Record<string, Attack>;
  attackSpeed: number;
  crit: Crit;
}

export type Rarity = 'common' | 'rare' | 'unique' | 'mythic' | 'legendary';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'jewelry' | 'material' | 'quest' | 'book';

export interface InventoryItem {
  id: number;
  quantity: number | '?';
  image: string | null;
  rarity?: Rarity;
  description?: string;
  name?: string;
  type?: ItemType;
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
    speed?: number;
    crit?: number;
  };
}

export type Inventory = InventoryItem[];

export interface CharacterInventory {
  money: Money;
  bag: Inventory;
}

export interface Player {
  info: CharacterInfo;
  state: CharacterState;
  stats: CharacterStats;
  inventory: CharacterInventory;
}

export type Cell = {
  cellType: 'wall' | 'empty';
  wallType?: string;
  floorImage?: string;
  x?: number;
  y?: number;
};

export interface Room {
  h: number;
  w: number;
  row: number;
  col: number;
}

export interface DungeonGeneratorConfig {
  rows?: number;
  cols?: number;
  maxRoomSize?: number;
  minRoomSize?: number;
  padding?: number;
  maxAttempts?: number;
  rooms?: number;
}

export interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  visible: boolean;
}
