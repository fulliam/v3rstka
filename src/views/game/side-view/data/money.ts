import animations from '@/animations.json';
import type { Money } from '@/views/game/side-view/types';

function getImagesArray(imagesObj: Record<string, string>): string[] {
  return Object.values(imagesObj);
}

/**
 * Генератор монет с шагом
 */
function createCoins(
  baseId: string,
  imageKey: keyof typeof animations.currencies.coins,
  startX: number,
  count: number,
  step = 60,
  type: string
): Array<{
  currencyId: string;
  images: string[];
  initialPositionX: number;
  type: string;
}> {
  return Array.from({ length: count }, (_, i) => ({
    currencyId: `${baseId}-${i + 1}`,
    images: getImagesArray(animations.currencies.coins[imageKey]),
    initialPositionX: startX + i * step,
    type,
  }));
}

/**
 * Генератор гемов
 */
function createGems(
  baseId: string,
  color: 'yellow' | 'green' | 'blue' | 'red' | 'grey',
  startX: number,
  count: number,
  step = 80,
  type: string
): Array<{
  currencyId: string;
  images: string[];
  initialPositionX: number;
  type: string;
}> {
  return Array.from({ length: count }, (_, i) => ({
    currencyId: `gem-${color}-${baseId}-${i + 1}`,
    images: getImagesArray(animations.currencies.gems[color]),
    initialPositionX: startX + i * step,
    type,
  }));
}

/**
 * Генератор "кучи" монет — случайно смещённые в небольшом радиусе
 */
function createPile(
  baseId: string,
  imageKey: keyof typeof animations.currencies.coins,
  centerX: number,
  centerY: number,
  count: number,
  spread = 60,
  type: string
): Array<{
  currencyId: string;
  images: string[];
  initialPositionX: number;
  type: string;
  offsetY?: number;
}> {
  return Array.from({ length: count }, (_, i) => {
    // Случайное смещение в пределах круга/квадрата
    const offsetX = Math.random() * spread - spread / 2; // от -30 до +30
    const offsetY = Math.random() * spread - spread / 2; // от -30 до +30

    return {
      currencyId: `${baseId}-pile-${i + 1}`,
      images: getImagesArray(animations.currencies.coins[imageKey]),
      initialPositionX: centerX + offsetX,
      type,
      // offsetY можно использовать позже для визуала (например, в стиле)
    };
  });
}

export const money: Money = {
  ActI: [
    // === БЛИЖНИЙ ЗОНА (0–400px) — приветствие игрока ===
    ...createCoins('silver-near', 'silver', 100, 5, 30, 'coin'),
    ...createCoins('gold-near', 'gold', 250, 3, 40, 'coin'),
    // {
    //   currencyId: 'gem-yellow-start',
    //   images: getImagesArray(animations.currencies.gems.yellow),
    //   initialPositionX: 350,
    //   type: 'yellow',
    // },

    // // === СРЕДНЯЯ ЗОНА (400–800px) — основная активность ===
    // ...createCoins('silver-mid', 'silver', 420, 6, 35, 'coin'),
    // ...createCoins('gold-mid', 'gold', 550, 4, 45, 'coin'),
    // ...createCoins('red-mid', 'red', 650, 3, 50, 'coin'),

    // // Группа гемов по центру
    // ...createGems('cluster-1', 'yellow', 700, 1, 80, 'yellow'),
    // ...createGems('cluster-1', 'green', 780, 1, 80, 'green'),
    // ...createGems('cluster-1', 'blue', 860, 1, 80, 'blue'),

    // // === ДАЛЬНЯЯ ЗОНА (800–1300px) — цель для движения вперёд ===
    // ...createCoins('silver-far', 'silver', 820, 4, 40, 'coin'),
    // ...createCoins('gold-far', 'gold', 980, 3, 50, 'coin'),
    // ...createCoins('red-far', 'red', 1100, 2, 60, 'coin'),

    // // Линия гемов как "награда"
    // ...createGems('far-line', 'yellow', 1200, 2, 70, 'yellow'),
    // ...createGems('far-line', 'green', 1350, 2, 70, 'green'),
    // ...createGems('far-line', 'blue', 1500, 2, 70, 'blue'),
    // ...createGems('far-line', 'red', 1650, 2, 70, 'red'),
    // ...createGems('far-line', 'grey', 1800, 1, 80, 'grey'),

    // // === СКРЫТЫЕ / СЛОЖНЫЕ МЕСТА (требуют прыжка или точного позиционирования) ===
    // {
    //   currencyId: 'gem-yellow-hidden-1',
    //   images: getImagesArray(animations.currencies.gems.yellow),
    //   initialPositionX: 500,
    //   type: 'yellow',
    // },
    // {
    //   currencyId: 'gem-green-hidden-1',
    //   images: getImagesArray(animations.currencies.gems.green),
    //   initialPositionX: 720,
    //   type: 'green',
    // },
    // {
    //   currencyId: 'gem-red-hidden-1',
    //   images: getImagesArray(animations.currencies.gems.red),
    //   initialPositionX: 940,
    //   type: 'red',
    // },

    // // === КУЧА МОНЕТ — сокровище! ===
    // ...createPile('pile-silver', 'silver', 1020, 0, 7, 50, 'coin'),
    // ...createPile('pile-gold', 'gold', 1020, 0, 5, 40, 'coin'),
    // ...createPile('pile-red', 'red', 1020, 0, 3, 30, 'coin'),

    // {
    //   currencyId: 'gem-blue-hidden-1',
    //   images: getImagesArray(animations.currencies.gems.blue),
    //   initialPositionX: 1160,
    //   type: 'blue',
    // },

    // // === СПЕЦИАЛЬНЫЕ КОМБИНАЦИИ ===
    // // Змейка из монет
    // ...Array.from({ length: 8 }, (_, i) => ({
    //   currencyId: `snake-silver-${i + 1}`,
    //   images: getImagesArray(animations.currencies.coins.silver),
    //   initialPositionX: 1300 + i * 30,
    //   type: 'coin',
    // })),
    // ...Array.from({ length: 5 }, (_, i) => ({
    //   currencyId: `snake-gold-${i + 1}`,
    //   images: getImagesArray(animations.currencies.coins.gold),
    //   initialPositionX: 1550 + i * 35,
    //   type: 'coin',
    // })),

    // // Редкий гем в конце
    // {
    //   currencyId: 'gem-grey-legendary',
    //   images: getImagesArray(animations.currencies.gems.grey),
    //   initialPositionX: 1900,
    //   type: 'grey',
    // },

    // // === ДУБЛИРОВАНИЕ ДЛЯ ТЕСТИРОВАНИЯ ===
    // // Ещё один гем в зоне старта
    // {
    //   currencyId: 'gem-yellow-test-1',
    //   images: getImagesArray(animations.currencies.gems.yellow),
    //   initialPositionX: 200,
    //   type: 'yellow',
    // },
    // {
    //   currencyId: 'gem-green-test-1',
    //   images: getImagesArray(animations.currencies.gems.green),
    //   initialPositionX: 230,
    //   type: 'green',
    // },
  ],

  // Остальные акты — пока пустые (или оставь как были)
  ActII: [],
  ActIII: [],
  ActIV: [],
  ActV: [],
  ActVI: [],
};
