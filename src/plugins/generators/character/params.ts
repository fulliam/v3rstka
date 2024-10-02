import type { Health, Mana, Stamina, Crit, Attack } from '@/types';

const calculateHealth = (stamina: number, level: number): Health => {
  const maxHealth = stamina * 10 + level * 50;
  const recovery = stamina * 0.5;
  return {
    max: maxHealth,
    current: maxHealth,
    recovery: recovery,
  };
};

const calculateMana = (intelligence: number, level: number): Mana => {
  const maxMana = intelligence * 8 + level * 30;
  const recovery = intelligence * 0.4;
  return {
    max: maxMana,
    current: maxMana,
    recovery: recovery,
  };
};

const calculateStamina = (
  stamina: number,
  agility: number,
  level: number
): Stamina => {
  const maxStamina = stamina * 6 + agility * 2 + level * 20;
  const recovery = stamina * 0.3 + agility * 0.2;
  return {
    max: maxStamina,
    current: maxStamina,
    recovery: recovery,
  };
};

const calculateCrit = (luck: number, agility: number): Crit => {
  const chance = Math.min(50, luck * 0.5 + agility * 0.1);
  const factor = 1.5 + luck * 0.01;
  return {
    chance: chance,
    factor: factor,
  };
};

const calculateDamage = (
  strength: number,
  agility: number,
  intelligence: number,
  attack: Attack
): number => {
  const baseDamage = (strength + agility + intelligence) / 3; // Среднее значение атрибутов

  let finalDamage = baseDamage;

  if (attack.type === 'physic') {
    finalDamage += strength * 0.5;
  } else if (attack.type === 'ranged') {
    finalDamage += agility * 0.3;
  } else if (attack.type === 'magic') {
    finalDamage += intelligence * 0.7;
  }

  finalDamage *= 1 + attack.level * 0.1;

  return finalDamage;
};

export {
  calculateHealth,
  calculateMana,
  calculateStamina,
  calculateCrit,
  calculateDamage,
};
