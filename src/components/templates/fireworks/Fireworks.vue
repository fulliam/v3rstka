<template>
  <div
    ref="wrapper"
    class="fw-wrapper"
    :class="{ 'fw-fullscreen': fullscreen }"
    :style="{ borderRadius }"
  >
    <canvas
      ref="canvas"
      class="fw-canvas"
    />
    <div class="fw-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  fullscreen?: boolean;
  pixelScale?: number;
  trailAlpha?: number;
  particleCount?: number;
  particlePixelSize?: number;
  palette?: string[];
  bgColor?: string;
  maxParticles?: number;
  autoLaunch?: boolean;
  autoInterval?: number;
  targetVerticalLimit?: number;
  ignorePointerEvents?: boolean;
  borderRadius?: string;
};

const props = withDefaults(defineProps<Props>(), {
  fullscreen: false,
  pixelScale: 4,
  trailAlpha: 0.22,
  particleCount: 32,
  particlePixelSize: 1,
  palette: [
    '#ff3b30',
    '#ff9500',
    '#ffcc00',
    '#34c759',
    '#5ac8fa',
    '#007aff',
    '#5856d6',
    '#ff2d55',
    '#8e8e93',
    '#ff9f0a',
    '#00c7be',
    '#c644fc',
    '#32d74b',
    '#ff375f',
  ],
  bgColor: '#000000',
  maxParticles: 2000,
  autoLaunch: false,
  autoInterval: 2200,
  targetVerticalLimit: 0.5,
  ignorePointerEvents: true,
  borderRadius: '0px',
});

// === Refs & state ===
const wrapper = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

let offCanvas: HTMLCanvasElement | null = null;
let offCtx: CanvasRenderingContext2D | null = null;

let cw = 0;
let ch = 0;
let offW = 0;
let offH = 0;

let rafId: number | null = null;
let lastTime = 0;
let autoTimer: number | null = null;

const fireworks: any[] = [];
const particles: any[] = [];

// helpers
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const choose = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// Firework and Particle classes (pixelated drawing on offscreen)
class Firework {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  speed: number;
  accel: number;
  angle: number;
  trail: [number, number][];
  brightness: number;
  targetRadius: number;
  done = false;
  constructor(sx: number, sy: number, tx: number, ty: number) {
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.x = sx;
    this.y = sy;
    this.speed = rand(3.5, 6.5);
    this.accel = rand(1.01, 1.05);
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.trail = [];
    this.brightness = rand(50, 70);
    this.targetRadius = 1;
  }
  update() {
    this.trail.unshift([this.x, this.y]);
    if (this.trail.length > 6) this.trail.pop();
    this.speed *= this.accel;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    const distToTarget = Math.hypot(this.tx - this.x, this.ty - this.y);
    if (distToTarget < this.speed * 1.5) {
      this.done = true;
      createParticles(this.tx, this.ty);
    }
  }
  draw(ctx2d: CanvasRenderingContext2D) {
    ctx2d.beginPath();
    const t = this.trail;
    if (t.length > 1) {
      const [lx, ly] = t[t.length - 1];
      ctx2d.moveTo(Math.round(lx), Math.round(ly));
      ctx2d.lineTo(Math.round(this.x), Math.round(this.y));
      ctx2d.lineWidth = 1;
      ctx2d.strokeStyle = `hsl(${Math.round(rand(0, 360))},100%,${this.brightness}%)`;
      ctx2d.stroke();
    } else {
      ctx2d.fillStyle = `hsl(${Math.round(rand(0, 360))},100%,${this.brightness}%)`;
      ctx2d.fillRect(Math.round(this.x), Math.round(this.y), 1, 1);
    }
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  decay: number;
  alpha: number;
  hue: string;
  size: number;
  constructor(x: number, y: number, colorHex?: string) {
    this.x = x;
    this.y = y;
    const speed = rand(0.6, 4.5);
    const angle = rand(0, Math.PI * 2);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.decay = rand(0.008, 0.03);
    this.alpha = 1;
    this.hue = colorHex || choose(props.palette!);
    this.size = Math.max(1, props.particlePixelSize!);
  }
  update() {
    this.vx *= 0.98;
    this.vy *= 0.99;
    this.vy += 0.06;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }
  draw(ctx2d: CanvasRenderingContext2D) {
    ctx2d.globalAlpha = Math.max(0, this.alpha);
    ctx2d.fillStyle = this.hue;
    ctx2d.fillRect(
      Math.round(this.x),
      Math.round(this.y),
      this.size,
      this.size
    );
    ctx2d.globalAlpha = 1;
  }
}

function createParticles(x: number, y: number) {
  const palette = props.palette!;
  const count = props.particleCount!;
  for (let i = 0; i < count; i++) {
    if (particles.length >= props.maxParticles!) break;
    const usePal = Math.random() < 0.7;
    const color = usePal ? choose(palette) : choose(palette);
    particles.push(new Particle(x, y, color));
  }
}

// API to launch
function launchAt(clientX: number, clientY: number) {
  if (!wrapper.value) return;
  const rect = wrapper.value.getBoundingClientRect();
  const localX = (clientX - rect.left) / (props.pixelScale || 1);
  const localY = (clientY - rect.top) / (props.pixelScale || 1);
  const sx = offW / 2;
  const sy = offH;
  const tx = Math.max(5, Math.min(offW - 5, Math.round(localX)));
  const ty = Math.max(
    5,
    Math.min(
      Math.round(offH * (props.targetVerticalLimit || 0.5)),
      Math.round(localY)
    )
  );
  fireworks.push(new Firework(sx, sy, tx, ty));
}
function launchRandom() {
  if (!offW || !offH) return;
  const sx = offW / 2;
  const sy = offH;
  const tx = Math.round(rand(10, offW - 10));
  const ty = Math.round(rand(10, offH * (props.targetVerticalLimit || 0.5)));
  fireworks.push(new Firework(sx, sy, tx, ty));
}
defineExpose({ launchAt, launchRandom });

// Canvas setup
function setupCanvases() {
  const el = wrapper.value!;
  const rect = el.getBoundingClientRect();
  cw = Math.max(1, Math.floor(rect.width));
  ch = Math.max(1, Math.floor(rect.height));
  const scale = Math.max(1, Math.floor(props.pixelScale || 1));
  offW = Math.max(1, Math.floor(cw / scale));
  offH = Math.max(1, Math.floor(ch / scale));

  if (!canvas.value) return;
  canvas.value.width = cw;
  canvas.value.height = ch;
  canvas.value.style.width = `${cw}px`;
  canvas.value.style.height = `${ch}px`;
  ctx = canvas.value.getContext('2d');
  if (ctx) ctx.imageSmoothingEnabled = false;

  if (!offCanvas) {
    offCanvas = document.createElement('canvas');
    offCtx = offCanvas.getContext('2d');
  }
  offCanvas.width = offW;
  offCanvas.height = offH;
  if (offCtx) {
    offCtx.imageSmoothingEnabled = false;
    offCtx.fillStyle = props.bgColor!;
    offCtx.fillRect(0, 0, offW, offH);
  }
}

// loop
function loop(t: number) {
  if (!ctx || !offCtx) {
    rafId = requestAnimationFrame(loop);
    return;
  }
  if (!lastTime) lastTime = t;
  const dt = t - lastTime;
  lastTime = t;

  offCtx.globalCompositeOperation = 'destination-out';
  offCtx.fillStyle = `rgba(0,0,0,${props.trailAlpha})`;
  offCtx.fillRect(0, 0, offW, offH);
  offCtx.globalCompositeOperation = 'lighter';

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i];
    f.update();
    f.draw(offCtx);
    if (f.done) fireworks.splice(i, 1);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(offCtx);
    if (p.alpha <= 0 || p.y > offH + 10) particles.splice(i, 1);
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offCanvas!, 0, 0, cw, ch);

  rafId = requestAnimationFrame(loop);
}

// lifecycle
let ro: ResizeObserver | null = null;
onMounted(() => {
  if (!wrapper.value) return;
  if (canvas.value) {
    canvas.value.style.pointerEvents = props.ignorePointerEvents
      ? 'none'
      : 'auto';
  }
  setupCanvases();
  ro = new ResizeObserver(() => setupCanvases());
  ro.observe(wrapper.value);
  rafId = requestAnimationFrame(loop);
  if (props.autoLaunch) {
    autoTimer = window.setInterval(() => launchRandom(), props.autoInterval);
  }
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (autoTimer) clearInterval(autoTimer);
  if (ro) ro.disconnect();
});

watch(
  () => props.pixelScale,
  () => nextTick(setupCanvases)
);
</script>

<style scoped>
.fw-wrapper {
  position: relative;
  display: block;
  overflow: hidden;
}
.fw-fullscreen {
  position: fixed !important;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
.fw-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  image-rendering: pixelated;
}
.fw-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
