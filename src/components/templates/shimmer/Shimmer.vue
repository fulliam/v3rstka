<template>
  <div
    ref="containerRef"
    class="pixel-shimmer-overlay"
    :style="{ borderRadius: borderRadius }"
  >
    <canvas
      ref="canvasRef"
      class="pixel-shimmer-overlay__canvas"
    />
    <div class="pixel-shimmer-overlay__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    cellSize?: number;
    fps?: number;
    animated?: boolean;
    borderRadius?: string;
    direction?: 'tl-br' | 'tr-bl';
    // массив полос (несколько полос с разными параметрами)
    bands?: Array<{
      color?: string;
      width?: number; // толщина полосы в пикселях
      speed?: number; // пикселей в секунду (направление вдоль диагонали)
      period?: number; // интервал между повторяющимися полосами вдоль диагонали
      offset?: number; // начальная позиция в пикселях (фаза)
      opacity?: number;
      glow?: boolean;
    }>;
  }>(),
  {
    cellSize: 12,
    fps: 60,
    animated: true,
    borderRadius: '8px',
    direction: 'tl-br',
    // пример трёх полос по-умолчанию
    bands: [
      {
        color: '#08030370',
        width: 64,
        speed: 220,
        period: 600,
        offset: 0,
        opacity: 0.95,
        glow: true,
      },
      {
        color: '#fff',
        width: 36,
        speed: 280,
        period: 420,
        offset: 180,
        opacity: 0.3,
        glow: false,
      },
      {
        color: '#fff',
        width: 36,
        speed: 200,
        period: 420,
        offset: 180,
        opacity: 0.3,
        glow: false,
      },
      {
        color: '#08030370',
        width: 20,
        speed: 240,
        period: 320,
        offset: 80,
        opacity: 0.6,
        glow: false,
      },
    ],
  }
);

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let rafId: number | null = null;
let lastTime = 0;
let resizeObserver: ResizeObserver | null = null;

const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

function resizeCanvas() {
  const el = containerRef.value;
  const canvas = canvasRef.value;
  if (!el || !canvas) return;

  const rect = el.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));

  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function mod(a: number, n: number) {
  let r = a % n;
  if (r < 0) r += n;
  return r;
}

function draw(now: number) {
  const canvas = canvasRef.value;
  const el = containerRef.value;
  if (!canvas || !el) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = el.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const interval = 1000 / props.fps;
  if (now - lastTime < interval) return;
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  ctx.clearRect(0, 0, width, height);

  // направление диагонали как единичный вектор
  let ux = 1 / Math.sqrt(2);
  let uy = 1 / Math.sqrt(2);
  if (props.direction === 'tr-bl') {
    ux = -1 / Math.sqrt(2);
    uy = 1 / Math.sqrt(2);
  }

  // диагональная длина для расчётов period по-умолчанию
  const diagLen = Math.hypot(width, height);

  // время в секундах
  const t = now / 1000;

  // предварительно вычислим параметры полос (без allocate внутри клеток)
  const bands = (props.bands || []).map((b) => {
    const color = b.color || '#0af';
    const widthPx = typeof b.width === 'number' ? b.width : 48;
    const speed = typeof b.speed === 'number' ? b.speed : 120;
    const period =
      typeof b.period === 'number' ? b.period : diagLen + widthPx + 40;
    const offset = typeof b.offset === 'number' ? b.offset : 0;
    const opacity = typeof b.opacity === 'number' ? b.opacity : 0.9;
    const glow = !!b.glow;
    // центр полосы для текущего времени
    const center = mod(offset + speed * t, period);
    return { color, widthPx, period, center, opacity, glow };
  });

  // будем перебирать ячейки по сетке cellSize — это даёт пиксельный эффект
  const cols = Math.ceil(width / props.cellSize);
  const rows = Math.ceil(height / props.cellSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = x * props.cellSize + props.cellSize / 2;
      const cy = y * props.cellSize + props.cellSize / 2;

      // проекция центра ячейки на диагональ
      const proj = cx * ux + cy * uy;

      // проверим для каждой полосы, попадает ли центр ячейки в любую из повторяющихся полос
      let drawColor: string | null = null;
      let drawOpacity = 1;
      let drawGlow = false;

      for (const b of bands) {
        const rel = mod(proj - b.center, b.period); // [0, period)
        // расстояние до ближайшей копии полосы вдоль диагонали
        const dist = Math.min(rel, b.period - rel);
        if (dist <= b.widthPx / 2) {
          // если несколько полос перекрываются — выберем ту с максим "важностью" (шире или ярче)
          // простая логика: если уже есть цвет, смешиваем (оставляем существующий с наложением) —
          // но для простоты возьмём полосы в порядке списка (позже перерисуют предыдущие)
          drawColor = b.color;
          drawOpacity = b.opacity;
          drawGlow = b.glow;
          // не break — allow later bands to override (user can order them)
        }
      }

      if (drawColor) {
        ctx.globalAlpha = drawOpacity;
        if (drawGlow) {
          ctx.shadowColor = drawColor;
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = drawColor;
        ctx.fillRect(
          Math.floor(x * props.cellSize),
          Math.floor(y * props.cellSize),
          props.cellSize,
          props.cellSize
        );
      }
    }
  }
}

function loop(t: number) {
  draw(t);
  if (props.animated) rafId = requestAnimationFrame(loop);
}

onMounted(() => {
  const el = containerRef.value;
  if (el) {
    const style = getComputedStyle(el);
    if (style.position === 'static') el.style.position = 'relative';
  }

  resizeCanvas();
  resizeObserver = new ResizeObserver(() => resizeCanvas());
  if (containerRef.value) resizeObserver.observe(containerRef.value);

  lastTime = performance.now();
  if (props.animated) rafId = requestAnimationFrame(loop);
  else draw(performance.now());
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (resizeObserver && containerRef.value)
    resizeObserver.unobserve(containerRef.value);
});
</script>

<style scoped lang="scss">
.pixel-shimmer-overlay {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.pixel-shimmer-overlay__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  image-rendering: pixelated;
  z-index: 1;
}

.pixel-shimmer-overlay__content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
