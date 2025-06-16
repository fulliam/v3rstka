<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let cw = window.innerWidth;
let ch = window.innerHeight;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

class SpeedLine {
  x: number;
  y: number;
  speed: number;
  life: number;
  curLife: number;
  alpha: number;
  angle: number;
  size: number;
  inRadius: number;
  outRadius: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.speed = rand(2, 4);
    this.life = this.curLife = rand(500, 900);
    this.alpha = rand(0.25, 1);
    this.angle = Math.PI * rand(0, 2);
    this.size = rand(20, 40);
    this.inRadius = rand(200, 400);
    this.outRadius = cw;
  }

  update() {
    this.curLife -= this.speed;
    this.inRadius += this.speed * 4;
    this.alpha *= this.curLife / this.life;
    this.size *= this.curLife / this.life;
    this.draw();
  }

  draw() {
    if (!ctx) return;
    const { x, y, size, angle, alpha, inRadius, outRadius } = this;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, inRadius);
    ctx.lineTo(size, outRadius);
    ctx.lineTo(-size, outRadius);
    ctx.closePath();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }
}

let lines: SpeedLine[] = [];
const MAX_LINES = 300;

function updateLines() {
  lines.forEach((line, i) => {
    if (line.curLife < 0) lines[i] = new SpeedLine(cw / 2, ch / 2);
    lines[i].update();
  });
}

function animate() {
  if (!ctx) return;
  ctx.clearRect(0, 0, cw, ch);
  updateLines();
  requestAnimationFrame(animate);
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = cw;
    canvas.value.height = ch;
    ctx = canvas.value.getContext('2d');

    for (let i = 0; i < MAX_LINES; i++) {
      lines.push(new SpeedLine(cw / 2, ch / 2));
    }

    animate();

    window.addEventListener('resize', () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      if (canvas.value) {
        canvas.value.width = cw;
        canvas.value.height = ch;
      }
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {});
});
</script>

<style scoped lang="scss">
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
}
</style>
