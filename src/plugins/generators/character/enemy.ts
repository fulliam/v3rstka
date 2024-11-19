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
} from '@/types/index';

const groups = {
  orcs: ['warrior', 'berserk', 'shaman'],
  slimes: ['red', 'green', 'blue'],
};

const noGroupCharacters = ['warrior', 'paladin', 'warmor', 'spirit'];
const groupChance = 0.5;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function createEnemy(
  group?: keyof typeof groups,
  name?: string
): Player {
  let randomGroup: keyof typeof groups | undefined = group;
  let randomCharacter: string | undefined = name;

  if (!group && Math.random() < groupChance) {
    randomGroup = getRandomElement(
      Object.keys(groups) as Array<keyof typeof groups>
    );
    randomCharacter = getRandomElement(groups[randomGroup]);
  } else if (!name) {
    randomCharacter = getRandomElement(noGroupCharacters);
  }

  const defaultPosition: Position = { x: 0, y: 0 };
  const defaultHealth: Health = {
    max: 10,
    current: 10,
    recovery: 1.0,
  };
  const defaultMana: Mana = {
    max: 0,
    current: 0,
    recovery: 0,
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
    strength: 1,
    agility: 1,
    intelligence: 1,
    stamina: 1,
    luck: 1,
  };
  const defaultSkills: Skills = {
    fireshtorm: <Skill>{ damage: 5, type: 'magic', range: 500, level: 1 },
    lighting: <Skill>{ damage: 5, type: 'magic', range: 500, level: 1 },
    poisonshtorm: <Skill>{ damage: 5, type: 'magic', range: 500, level: 1 },
  };

  const defaultInfo: CharacterInfo = {
    category: 'enemy',
    group: randomGroup,
    character: String(randomCharacter),
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
    speed: { walking: 1, running: 3 },
    params: defaultParams,
    skills: defaultSkills,
    skillPoints: 0,
    statPoints: 0,
    damage: { physic: 10, magic: 5 },
    attacks: {
      attack: defaultAttack,
      attack2: { damage: 15, type: 'physic', range: 100, level: 1 },
      attack3: { damage: 20, type: 'physic', range: 100, level: 1 },
    },
    attackSpeed: 1,
    crit: defaultCrit,
  };

  const defaultInventory: CharacterInventory = {
    money: defaultMoney,
    inventory: [],
  };

  return {
    info: defaultInfo,
    state: defaultState,
    stats: defaultStats,
    inventory: defaultInventory,
  };
}
