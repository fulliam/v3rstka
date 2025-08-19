import animations from '@/animations.json';

export interface MoneyItem {
  currencyId: string;
  images: string[];
  initialPositionX: number;
  type: string;
}

export type Money = {
  [key: string]: MoneyItem[];
};

function getImagesArray(imagesObj: Record<string, string>): string[] {
  return Object.values(imagesObj);
}

export const money: Money = {
  ActI: [
    {
      currencyId: 'silver',
      images: getImagesArray(animations.currencies.coins.silver),
      initialPositionX: 600,
      type: 'coin',
    },
    {
        currencyId: 'red',
        images: getImagesArray(animations.currencies.coins.red),
        initialPositionX: 680,
        type: 'coin',
      },
      {
        currencyId: 'gold',
        images: getImagesArray(animations.currencies.coins.gold),
        initialPositionX: 720,
        type: 'coin',
      },
  ],
  ActII: [],
  ActIII: [],
  ActIV: [],
  ActV: [],
  ActVI: [],
};
