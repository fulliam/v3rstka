export type BgMoveCb = (
  deltaPx: number,
  direction: 'left' | 'right',
  ts: number
) => void;

export type BgContext = {
  backgroundPositionX: Ref<number>;
  scale: Ref<number>;
  registerOnBackgroundMove?: (cb: BgMoveCb) => () => void;
};

export interface MoneyItem {
  currencyId: string;
  images: string[];
  initialPositionX: number;
  type: string;
}

export type Money = {
  [key: string]: MoneyItem[];
};

export type AnimationSrc = string;

export interface SceneLayer {
  src?: AnimationSrc;
  alt?: string;
  class?: string;
  style?: Record<string, string | number>;
  parallaxSpeed: number;
}

export type Scene = SceneLayer[];
export type Act = Scene[];
export type Acts = Record<string, Act>;
