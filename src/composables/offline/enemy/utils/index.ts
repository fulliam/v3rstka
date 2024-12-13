import type { Position } from '@/types';

// Функция для выбора случайного направления
const randomDirection = () => {
  const directions = [
    'left',
    'right',
    'up',
    'down',
    'up-left',
    'up-right',
    'down-left',
    'down-right',
  ];
  return directions[Math.floor(Math.random() * directions.length)];
};

// Функция для выбора случайного действия
const randomAction = () => {
  const actions = ['walk', 'idle', 'run'];
  return actions[Math.floor(Math.random() * actions.length)];
};

// Генерация случайного интервала в заданном диапазоне
const randomInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Проверка, находится ли цель в пределах заданного радиуса
const isInRange = (firstPos: Position, secondPos: Position, range: number) => {
  const dx = firstPos.x - secondPos.x;
  const dy = firstPos.y - secondPos.y;
  return Math.sqrt(dx * dx + dy * dy) <= range;
};

const convertToScreenCoordinates = (
  cellPos: Position,
  cellSize: number,
  shiftX: number,
  shiftY: number
): Position => {
  return {
    x: cellPos.x * cellSize + shiftX,
    y: cellPos.y * cellSize + shiftY,
  };
};

const directionToTarget = (position: Position, target: Position) => {
  if (!target) return randomDirection();
  const dx = target.x - position.x;
  const dy = target.y - position.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
};

export {
  directionToTarget,
  randomDirection,
  randomAction,
  randomInterval,
  isInRange,
  convertToScreenCoordinates,
};
