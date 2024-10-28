<template>
  <div :class="{ 'radar-chart-container': true, animate: props.animate }">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';

interface RadarChartProps {
  size: [number, number];
  step: number;
  values: Record<string, number>;
  showAxisLabels: boolean;
  animate: boolean;
}

const props = defineProps<RadarChartProps>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const animationFrameId = ref<number | null>(null);

const drawRadarChart = (progress: number = 1) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { size, step, values, showAxisLabels } = props;
  const [width, height] = size;
  canvas.width = width;
  canvas.height = height;

  const spacing = 20;
  let min = 0;
  let max = 0;

  Object.values(values).forEach((val) => {
    if (val < min) min = val;
    if (val > max) max = val;
  });

  min = Math.floor(min);
  max = Math.ceil(max);

  ctx.clearRect(0, 0, width, height);

  for (let i = min; i <= max; i += step) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, step * spacing * i, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e96424';
    ctx.fillStyle = '#fff';
    ctx.stroke();

    if (showAxisLabels) {
      ctx.fillText(
        i.toString(),
        width / 2 + step * spacing * i + 4,
        height / 2 - 2
      );
    }
  }

  const keys = Object.keys(values);
  const sizeKeys = keys.length;

  keys.forEach((key, i) => {
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    const angle = (Math.PI * 2 * i) / sizeKeys;
    const x = width / 2 + Math.cos(angle) * spacing * max;
    const y = height / 2 + Math.sin(angle) * spacing * max;
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  ctx.beginPath();
  keys.forEach((key, i) => {
    const val = values[key] * progress;
    const angle = (Math.PI * 2 * i) / sizeKeys;
    const x = width / 2 + Math.cos(angle) * spacing * val;
    const y = height / 2 + Math.sin(angle) * spacing * val;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#5262e54a');
  grad.addColorStop(1, '#9c52e54a');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.stroke();

  keys.forEach((key, i) => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'yellow';
    ctx.font = 'bold 16px Verdana';
    const val = values[key];
    const angle = (Math.PI * 2 * i) / sizeKeys;
    // const x = width / 2 + Math.cos(angle) * spacing * val;
    // const y = height / 2 + Math.sin(angle) * spacing * val;
    const textX = width / 2 + Math.cos(angle) * spacing * val * 1.2;
    const textY = height / 2 + Math.sin(angle) * spacing * val * 1.2;

    ctx.textAlign = textX < width / 2 ? 'end' : 'start';
    ctx.fillText(key, textX, textY);
  });
};

const animateRadarChart = () => {
  let progress = 0;
  const maxProgress = 1;
  const animationStep = 0.1;

  const animate = () => {
    progress += animationStep;
    if (progress > maxProgress) {
      progress = maxProgress;
    }
    drawRadarChart(progress);

    if (progress < maxProgress) {
      animationFrameId.value = requestAnimationFrame(animate);
    }
  };

  animate();
};

onMounted(() => {
  drawRadarChart();
  if (props.animate) {
    animateRadarChart();
  }
});

watch(
  () => props.values,
  () => {
    drawRadarChart();
    if (props.animate) {
      animateRadarChart();
    }
  }
);

onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});
</script>

<style scoped>
.radar-chart-container {
  position: relative;
  overflow: hidden;
}
</style>
