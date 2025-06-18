<template>
  <div
    ref="canvasAreaRef"
    class="canvas-area"
  >
    <div
      ref="canvasWrapper"
      class="canvas-wrapper"
      :class="{ panning: isPanning || tempHandTool }"
      @wheel="handleWheel"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousemove="updateBrushIndicator"
      @mouseleave="showBrushIndicator = false"
    >
      <div
        ref="canvasInner"
        class="canvas-inner"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          width: canvasWidth * pixelSize + 'px',
          height: canvasHeight * pixelSize + 'px',
        }"
      >
        <!-- Background checkerboard -->
        <div
          class="canvas-background"
          :style="backgroundStyle"
        ></div>

        <!-- Layer canvases -->
        <canvas
          v-for="(layer, index) in layers"
          :key="`layer-${layer.id}-${canvasKey}`"
          :ref="(el) => setLayerCanvasRef(el, index)"
          class="layer-canvas"
          :class="{ 'current-layer': index === currentLayer }"
          :width="canvasWidth * pixelSize"
          :height="canvasHeight * pixelSize"
          :style="{
            opacity: layer.visible ? layer.opacity : 0,
            zIndex: index + 1,
          }"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @mouseleave="handleCanvasMouseLeave"
          @contextmenu.prevent
        />

        <!-- Grid overlay -->
        <div
          v-if="showGrid"
          class="grid-overlay"
          :style="gridStyle"
        ></div>
      </div>

      <!-- Brush indicator -->
      <div
        v-if="
          showBrushIndicator &&
          (currentTool === 'pencil' || currentTool === 'eraser')
        "
        class="brush-indicator"
        :class="{ 'eraser-indicator': currentTool === 'eraser' }"
        :style="brushIndicatorStyle"
      ></div>
    </div>

    <!-- Canvas controls -->
    <div class="canvas-controls glass-panel">
      <div class="zoom-controls">
        <button
          class="glass-button glass-button-small"
          title="Zoom Out (-)"
          @click="$emit('zoomOut')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path d="M19,13H5V11H19V13Z" />
          </svg>
        </button>
        <span class="zoom-display">{{ Math.round(zoom * 100) }}%</span>
        <button
          class="glass-button glass-button-small"
          title="Zoom In (+)"
          @click="$emit('zoomIn')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
      </div>

      <div class="view-controls">
        <button
          class="glass-button glass-button-small"
          title="Reset Zoom (0)"
          @click="$emit('resetZoom')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"
            />
          </svg>
        </button>
        <button
          class="glass-button glass-button-small"
          title="Fit to Screen"
          @click="$emit('fitToScreen')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M9,9H15V15H9V9M11,11V13H13V11H11M2,3V9H4V5H8V3H2M22,3V9H20V5H16V3H22M2,15V21H8V19H4V15H2M22,15V21H16V19H20V15H22Z"
            />
          </svg>
        </button>
        <button
          class="glass-button glass-button-small"
          title="Center Canvas"
          @click="$emit('centerCanvas')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"
            />
          </svg>
        </button>
      </div>

      <div class="grid-controls">
        <button
          :class="['glass-button', 'glass-button-small', { active: showGrid }]"
          title="Toggle Grid"
          @click="$emit('toggleGrid')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M10,4V8H14V4H16V8H20V10H16V14H20V16H16V20H14V16H10V20H8V16H4V14H8V10H4V8H8V4H10M10,10V14H14V10H10Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import type { Layer } from '../../types';

interface Props {
  layers: Layer[];
  currentLayer: number;
  currentFrame?: number; // Made optional with default
  canvasWidth: number;
  canvasHeight: number;
  pixelSize: number;
  zoom: number;
  panX: number;
  panY: number;
  currentTool: string;
  brushSize: number;
  primaryColor: string;
  secondaryColor: string;
  isPanning: boolean;
  tempHandTool: boolean;
  showGrid: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentFrame: 0, // Default value
});

const emit = defineEmits<{
  updateZoom: [zoom: number];
  updatePan: [pan: { x: number; y: number }];
  updateIsPanning: [isPanning: boolean];
  saveHistory: [];
  toggleGrid: [];
  zoomIn: [];
  zoomOut: [];
  resetZoom: [];
  fitToScreen: [];
  centerCanvas: [];
  pickColor: [color: string];
  canvasChanged: [];
}>();

const canvasAreaRef = ref<HTMLDivElement>();
const canvasWrapper = ref<HTMLDivElement>();
const canvasInner = ref<HTMLDivElement>();
const layerCanvasRefs = ref<(HTMLCanvasElement | null)[]>([]);

// Canvas key for forcing re-renders when needed
const canvasKey = computed(() => `${props.currentFrame}-${Date.now()}`);

// Drawing state
const isDrawing = ref(false);
const lastDrawPoint = ref<{ x: number; y: number } | null>(null);
const showBrushIndicator = ref(false);
const brushIndicatorPosition = ref({ x: 0, y: 0 });

// Pan state
const panStartX = ref(0);
const panStartY = ref(0);
const lastTouchDistance = ref(0);

// Set layer canvas ref and sync with layer data
function setLayerCanvasRef(el: HTMLCanvasElement | null, index: number) {
  if (el && props.layers[index]) {
    layerCanvasRefs.value[index] = el;

    const ctx = el.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Update layer references
      props.layers[index].context = ctx;
      props.layers[index].canvas = el;

      // If layer has existing canvas data, draw it
      const existingCanvas = props.layers[index].canvas;
      if (existingCanvas && existingCanvas !== el) {
        ctx.clearRect(0, 0, el.width, el.height);
        ctx.drawImage(existingCanvas, 0, 0);
      }
    }
  }
}

// Computed styles
const backgroundStyle = computed(() => ({
  width: '100%',
  height: '100%',
  // backgroundImage: `
  //   linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
  //   linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
  //   linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
  //   linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
  // `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
}));

const gridStyle = computed(() => ({
  width: '100%',
  height: '100%',
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
  `,
  backgroundSize: `${props.pixelSize}px ${props.pixelSize}px`,
  pointerEvents: 'none' as const,
}));

const brushIndicatorStyle = computed(() => ({
  position: 'absolute' as const,
  left:
    brushIndicatorPosition.value.x -
    (props.brushSize * props.pixelSize * props.zoom) / 2 +
    'px',
  top:
    brushIndicatorPosition.value.y -
    (props.brushSize * props.pixelSize * props.zoom) / 2 +
    'px',
  width: props.brushSize * props.pixelSize * props.zoom + 'px',
  height: props.brushSize * props.pixelSize * props.zoom + 'px',
  pointerEvents: 'none' as const,
  zIndex: 1000,
}));

// Canvas operations
function getCanvasCoordinates(
  event: MouseEvent
): { x: number; y: number } | null {
  if (!canvasInner.value) return null;

  const rect = canvasInner.value.getBoundingClientRect();
  const x = Math.floor(
    (event.clientX - rect.left) / (props.pixelSize * props.zoom)
  );
  const y = Math.floor(
    (event.clientY - rect.top) / (props.pixelSize * props.zoom)
  );

  if (x < 0 || y < 0 || x >= props.canvasWidth || y >= props.canvasHeight) {
    return null;
  }

  return { x, y };
}

function drawPixel(x: number, y: number, color: string) {
  const currentLayerCanvas = layerCanvasRefs.value[props.currentLayer];
  if (!currentLayerCanvas) return;

  const ctx = currentLayerCanvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  if (props.currentTool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
  }

  // Draw brush area
  const halfBrush = Math.floor(props.brushSize / 2);
  for (let dx = -halfBrush; dx <= halfBrush; dx++) {
    for (let dy = -halfBrush; dy <= halfBrush; dy++) {
      const pixelX = x + dx;
      const pixelY = y + dy;

      if (
        pixelX >= 0 &&
        pixelX < props.canvasWidth &&
        pixelY >= 0 &&
        pixelY < props.canvasHeight
      ) {
        ctx.fillRect(
          pixelX * props.pixelSize,
          pixelY * props.pixelSize,
          props.pixelSize,
          props.pixelSize
        );
      }
    }
  }

  // Update layer reference
  if (props.layers[props.currentLayer]) {
    props.layers[props.currentLayer].canvas = currentLayerCanvas;
  }

  // Emit canvas changed event
  emit('canvasChanged');
}

function drawLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string
) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let x = x0;
  let y = y0;

  while (true) {
    drawPixel(x, y, color);

    if (x === x1 && y === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

function floodFill(startX: number, startY: number, newColor: string) {
  const currentLayerCanvas = layerCanvasRefs.value[props.currentLayer];
  if (!currentLayerCanvas) return;

  const ctx = currentLayerCanvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(
    0,
    0,
    currentLayerCanvas.width,
    currentLayerCanvas.height
  );
  const data = imageData.data;

  const startPos =
    (startY * props.pixelSize * currentLayerCanvas.width +
      startX * props.pixelSize) *
    4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  // Convert hex color to RGB
  const hex = newColor.replace('#', '');
  const newR = parseInt(hex.substr(0, 2), 16);
  const newG = parseInt(hex.substr(2, 2), 16);
  const newB = parseInt(hex.substr(4, 2), 16);
  const newA = 255;

  if (
    startR === newR &&
    startG === newG &&
    startB === newB &&
    startA === newA
  ) {
    return; // Same color, no need to fill
  }

  const stack = [{ x: startX, y: startY }];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const { x, y } = stack.pop()!;
    const key = `${x},${y}`;

    if (
      visited.has(key) ||
      x < 0 ||
      y < 0 ||
      x >= props.canvasWidth ||
      y >= props.canvasHeight
    ) {
      continue;
    }

    visited.add(key);

    // Check if current pixel matches start color
    const currentPos =
      (y * props.pixelSize * currentLayerCanvas.width + x * props.pixelSize) *
      4;
    const currentR = data[currentPos];
    const currentG = data[currentPos + 1];
    const currentB = data[currentPos + 2];
    const currentA = data[currentPos + 3];

    if (
      currentR !== startR ||
      currentG !== startG ||
      currentB !== startB ||
      currentA !== startA
    ) {
      continue;
    }

    // Fill the pixel area
    for (let dx = 0; dx < props.pixelSize; dx++) {
      for (let dy = 0; dy < props.pixelSize; dy++) {
        const pos =
          ((y * props.pixelSize + dy) * currentLayerCanvas.width +
            (x * props.pixelSize + dx)) *
          4;
        data[pos] = newR;
        data[pos + 1] = newG;
        data[pos + 2] = newB;
        data[pos + 3] = newA;
      }
    }

    // Add neighbors to stack
    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
  }

  ctx.putImageData(imageData, 0, 0);

  // Update layer reference
  if (props.layers[props.currentLayer]) {
    props.layers[props.currentLayer].canvas = currentLayerCanvas;
  }

  // Emit canvas changed event
  emit('canvasChanged');
}

function pickColor(x: number, y: number): string {
  const currentLayerCanvas = layerCanvasRefs.value[props.currentLayer];
  if (!currentLayerCanvas) return props.primaryColor;

  const ctx = currentLayerCanvas.getContext('2d');
  if (!ctx) return props.primaryColor;

  const imageData = ctx.getImageData(
    x * props.pixelSize,
    y * props.pixelSize,
    1,
    1
  );
  const data = imageData.data;

  if (data[3] === 0) return '#ffffff'; // Transparent pixel

  const r = data[0].toString(16).padStart(2, '0');
  const g = data[1].toString(16).padStart(2, '0');
  const b = data[2].toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

// Event handlers
function handleCanvasMouseDown(event: MouseEvent) {
  if (props.currentTool === 'hand' || props.tempHandTool) {
    startPan(event);
    return;
  }

  const coords = getCanvasCoordinates(event);
  if (!coords) return;

  emit('saveHistory');
  isDrawing.value = true;
  lastDrawPoint.value = coords;

  const color = event.button === 2 ? props.secondaryColor : props.primaryColor;

  switch (props.currentTool) {
    case 'pencil':
    case 'eraser':
      drawPixel(coords.x, coords.y, color);
      break;
    case 'fill':
      floodFill(coords.x, coords.y, color);
      break;
    case 'picker':
      const pickedColor = pickColor(coords.x, coords.y);
      emit('pickColor', pickedColor);
      break;
  }
}

function handleCanvasMouseMove(event: MouseEvent) {
  if (props.isPanning) {
    handlePan(event);
    return;
  }

  if (!isDrawing.value || !lastDrawPoint.value) return;

  const coords = getCanvasCoordinates(event);
  if (!coords) return;

  const color = event.buttons === 2 ? props.secondaryColor : props.primaryColor;

  if (props.currentTool === 'pencil' || props.currentTool === 'eraser') {
    drawLine(
      lastDrawPoint.value.x,
      lastDrawPoint.value.y,
      coords.x,
      coords.y,
      color
    );
    lastDrawPoint.value = coords;
  }
}

function handleCanvasMouseUp() {
  isDrawing.value = false;
  lastDrawPoint.value = null;

  if (props.isPanning) {
    stopPan();
  }
}

function handleCanvasMouseLeave() {
  isDrawing.value = false;
  lastDrawPoint.value = null;

  if (props.isPanning) {
    stopPan();
  }
}

function updateBrushIndicator(event: MouseEvent) {
  if (!canvasWrapper.value) return;

  const rect = canvasWrapper.value.getBoundingClientRect();
  brushIndicatorPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  showBrushIndicator.value = true;
}

// Pan functions
function startPan(event: MouseEvent) {
  emit('updateIsPanning', true);
  panStartX.value = event.clientX - props.panX;
  panStartY.value = event.clientY - props.panY;
}

function handlePan(event: MouseEvent) {
  if (!props.isPanning) return;

  const newPanX = event.clientX - panStartX.value;
  const newPanY = event.clientY - panStartY.value;
  emit('updatePan', { x: newPanX, y: newPanY });
}

function stopPan() {
  emit('updateIsPanning', false);
}

// Zoom and view functions
function handleWheel(event: WheelEvent) {
  event.preventDefault();

  const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1;
  const oldZoom = props.zoom;
  const newZoom = Math.max(0.1, Math.min(20, props.zoom + zoomAmount));

  if (canvasWrapper.value) {
    const rect = canvasWrapper.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const zoomRatio = newZoom / oldZoom;
    const newPanX = mouseX - (mouseX - props.panX) * zoomRatio;
    const newPanY = mouseY - (mouseY - props.panY) * zoomRatio;

    emit('updateZoom', newZoom);
    emit('updatePan', { x: newPanX, y: newPanY });
  }
}

// Touch handlers
function handleTouchStart(event: TouchEvent) {
  event.preventDefault();

  if (event.touches.length === 1) {
    const touch = event.touches[0];
    if (props.currentTool === 'hand') {
      startPan({
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
      } as MouseEvent);
    }
  } else if (event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    lastTouchDistance.value = distance;
  }
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault();

  if (event.touches.length === 1) {
    const touch = event.touches[0];
    if (props.isPanning) {
      handlePan({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent);
    }
  } else if (event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );

    if (lastTouchDistance.value > 0) {
      const scale = distance / lastTouchDistance.value;
      const newZoom = Math.max(0.1, Math.min(20, props.zoom * scale));
      emit('updateZoom', newZoom);
    }

    lastTouchDistance.value = distance;
  }
}

function handleTouchEnd(event: TouchEvent) {
  event.preventDefault();

  if (event.touches.length === 0) {
    if (props.isPanning) {
      stopPan();
    }
    lastTouchDistance.value = 0;
  }
}

// Initialize canvases
onMounted(async () => {
  await nextTick();

  // Initialize layer canvases
  layerCanvasRefs.value.forEach((canvas, index) => {
    if (canvas && props.layers[index]) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        props.layers[index].context = ctx;
        props.layers[index].canvas = canvas;
      }
    }
  });
});

// Watch for layer changes to update canvas refs
watch(
  () => props.layers,
  () => {
    nextTick(() => {
      // Ensure we have the right number of canvas refs
      layerCanvasRefs.value.length = props.layers.length;

      layerCanvasRefs.value.forEach((canvas, index) => {
        if (canvas && props.layers[index]) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = false;
            props.layers[index].context = ctx;
            props.layers[index].canvas = canvas;
          }
        }
      });
    });
  },
  { deep: true, immediate: true }
);

// Expose refs for parent component
defineExpose({
  canvasAreaRef,
  canvasWrapper,
  canvasInner,
  layerCanvasRefs,
});
</script>

<style scoped lang="scss">
@use './CanvasArea.scss';
</style>
