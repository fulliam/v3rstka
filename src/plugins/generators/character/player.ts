import {
  Player,
  Position,
  Health,
  Mana,
  Stamina,
  Crit,
  Attack,
  Money,
  Params,
  Skill,
  Skills,
  CharacterInfo,
  CharacterState,
  CharacterStats,
  CharacterInventory,
} from '@/types';
import { inventory } from '@/views/game/side-view/data/inventory';

export function createDefaultPlayer(characterType: string): Player {
  const defaultPosition: Position = { x: 0, y: 0 };

  const defaultHealth: Health = {
    max: 100,
    current: 100,
    recovery: 1.0,
  };

  const defaultMana: Mana = {
    max: 100,
    current: 100,
    recovery: 1.0,
  };

  const defaultStamina: Stamina = {
    max: 100,
    current: 100,
    recovery: 1.0,
  };

  const defaultCrit: Crit = {
    chance: 0.1,
    factor: 2.0,
  };

  const defaultAttack: Attack = {
    damage: 10,
    type: 'physic',
    range: 100,
    level: 1,
  };

  const defaultMoney: Money = {
    coins: { silver: 0, gold: 0, red: 0 },
    gems: { blue: 0, yellow: 0, green: 0, grey: 0, red: 0 },
  };

  const defaultParams: Params = {
    strength: 5,
    agility: 5,
    intelligence: 5,
    stamina: 5,
    luck: 5,
  };

  const defaultSkills: Skills = {
    fireshtorm: <Skill>{ damage: 10, type: 'magic', range: 500, level: 1 },
    lighting: <Skill>{ damage: 10, type: 'magic', range: 500, level: 1 },
    poisonshtorm: <Skill>{ damage: 10, type: 'magic', range: 500, level: 1 },
  };

  const defaultInfo: CharacterInfo = {
    category: 'ally',
    character: characterType,
    location: '12345',
    level: 1,
    experience: 0,
    levelUpExperience: 100,
  };

  const defaultState: CharacterState = {
    position: defaultPosition,
    direction: 'left',
    action: 'idle',
    health: defaultHealth,
    mana: defaultMana,
    stamina: defaultStamina,
    armor: 0,
  };

  const defaultStats: CharacterStats = {
    // for dungeon need walk = 5 run = 10
    speed: { walking: 30, running: 60 },
    params: defaultParams,
    skills: defaultSkills,
    skillPoints: 5,
    statPoints: 5,
    damage: { physic: 10, magic: 5 },
    attacks: {
      attack: defaultAttack,
      attack2: { damage: 15, type: 'physic', range: 100, level: 1 },
      attack3: { damage: 20, type: 'physic', range: 100, level: 1 },
    },
    attackSpeed: 1,
    crit: defaultCrit,
  };

  if (characterType === 'archer') {
    defaultStats.params.agility += 3;
    defaultStats.attackSpeed += 0.2;
  } else if (characterType === 'wizard') {
    defaultStats.params.intelligence += 3;
    defaultState.mana = { ...defaultMana, max: 150 };
  } else if (characterType === 'skeleton') {
    defaultStats.params.strength += 3;
    defaultState.armor += 10;
  } else if (characterType === 'swordsman') {
    defaultStats.params.strength += 3;
    defaultStats.damage.physic += 5;
  }

  const defaultInventory: CharacterInventory = {
    money: defaultMoney,
    bag: inventory,
  };

  return {
    info: defaultInfo,
    state: defaultState,
    stats: defaultStats,
    inventory: defaultInventory,
  };
}
