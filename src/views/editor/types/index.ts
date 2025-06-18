export interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}

export interface Frame {
  id: number;
  layers: Layer[];
}

export interface Tool {
  name: string;
  shortcut: string;
}

export interface HistoryState {
  layers: Layer[];
  currentLayer: number;
  currentFrame: number;
}

export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}
