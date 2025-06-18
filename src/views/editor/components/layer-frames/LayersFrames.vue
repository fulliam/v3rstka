<template>
  <aside
    class="sidebar sidebar-right glass-panel-enhanced"
    :class="{ collapsed }"
  >
    <button
      class="sidebar-toggle right glass-button"
      @click="$emit('toggleCollapsed')"
    >
      <svg
        v-if="!collapsed"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="icon"
      >
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="currentColor"
        class="icon"
      >
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>

    <div
      v-if="!collapsed"
      class="sidebar-content"
    >
      <div class="panel glass-panel-inner">
        <h3 class="panel-title">Frames</h3>
        <div class="frame-controls">
          <button
            class="glass-button glass-button-small"
            title="Add Frame (⌘⇧N)"
            @click="$emit('addFrame')"
          >
            Add
          </button>
          <button
            class="glass-button glass-button-small"
            @click="$emit('duplicateFrame')"
          >
            Duplicate
          </button>
          <button
            class="glass-button glass-button-danger glass-button-small"
            :disabled="frames.length <= 1"
            @click="$emit('deleteFrame')"
          >
            Delete
          </button>
        </div>
        <div class="frame-list">
          <div
            v-for="(frame, index) in frames"
            :key="frame.id"
            :class="['frame-item-enhanced', { active: currentFrame === index }]"
            @click="$emit('switchFrame', index)"
          >
            <span class="frame-label">Frame {{ index + 1 }}</span>
            <canvas
              :ref="(el) => (framePreviewRefs[index] = el)"
              class="frame-preview-enhanced"
              :width="32"
              :height="32"
            ></canvas>
          </div>
        </div>
        <div class="animation-controls">
          <button
            class="glass-button glass-button-small"
            @click="$emit('toggleAnimation')"
          >
            {{ isAnimating ? 'Stop' : 'Play' }}
          </button>
          <label class="fps-control">
            FPS:
            <input
              type="range"
              :value="animationFPS"
              min="1"
              max="30"
              class="fps-slider glass-slider"
              @input="
                $emit(
                  'updateFps',
                  parseInt(($event.target as HTMLInputElement).value)
                )
              "
            />
            {{ animationFPS }}
          </label>
        </div>
      </div>

      <div class="panel glass-panel-inner">
        <h3 class="panel-title">Layers</h3>
        <div class="layer-controls">
          <button
            class="glass-button glass-button-small"
            title="Add Layer (⌘⇧L)"
            @click="$emit('addLayer')"
          >
            Add
          </button>
          <button
            class="glass-button glass-button-small"
            @click="$emit('duplicateLayer')"
          >
            Duplicate
          </button>
          <button
            class="glass-button glass-button-danger glass-button-small"
            :disabled="layers.length <= 1"
            @click="$emit('deleteLayer')"
          >
            Delete
          </button>
          <button
            class="glass-button glass-button-small"
            :disabled="currentLayer >= layers.length - 1"
            @click="$emit('moveLayerUp')"
          >
            ↑
          </button>
          <button
            class="glass-button glass-button-small"
            :disabled="currentLayer <= 0"
            @click="$emit('moveLayerDown')"
          >
            ↓
          </button>
        </div>
        <div class="layer-list">
          <div
            v-for="(layer, index) in layers.slice().reverse()"
            :key="layer.id"
            :class="[
              'layer-item-redesigned',
              {
                active: currentLayer === layers.length - 1 - index,
                visible: layer.visible,
              },
            ]"
            @click="$emit('selectLayer', layers.length - 1 - index)"
          >
            <!-- Layer Preview Thumbnail -->
            <div class="layer-preview-container">
              <canvas
                :ref="
                  (el) => (layerPreviewRefs[layers.length - 1 - index] = el)
                "
                class="layer-preview-canvas"
                :width="32"
                :height="32"
              ></canvas>
              <div
                v-if="!layer.visible"
                class="layer-preview-overlay"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon-tiny"
                >
                  <path
                    d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"
                  />
                </svg>
              </div>
            </div>

            <!-- Layer Info -->
            <div class="layer-info-container">
              <div class="layer-header-redesigned">
                <button
                  class="visibility-btn-redesigned glass-button-icon"
                  :class="{ visible: layer.visible }"
                  :title="layer.visible ? 'Hide Layer' : 'Show Layer'"
                  @click.stop="
                    $emit('toggleLayerVisibility', layers.length - 1 - index)
                  "
                >
                  <svg
                    v-if="layer.visible"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="icon-tiny"
                  >
                    <path
                      d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="icon-tiny"
                  >
                    <path
                      d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"
                    />
                  </svg>
                </button>

                <input
                  :value="layer.name"
                  class="layer-name-input-redesigned glass-input"
                  :placeholder="`Layer ${layers.length - index}`"
                  @input="
                    $emit(
                      'updateLayerName',
                      layers.length - 1 - index,
                      ($event.target as HTMLInputElement).value
                    )
                  "
                  @click.stop
                />

                <div class="layer-opacity-display">
                  {{ Math.round(layer.opacity * 100) }}%
                </div>
              </div>

              <div
                class="layer-footer-redesigned"
                @click.stop
              >
                <input
                  type="range"
                  :value="layer.opacity"
                  min="0"
                  max="1"
                  step="0.05"
                  class="opacity-slider-redesigned glass-slider"
                  @input="
                    $emit(
                      'updateLayerOpacity',
                      layers.length - 1 - index,
                      $event
                    )
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import type { Layer, Frame } from '../../types';

interface Props {
  collapsed: boolean;
  frames: Frame[];
  currentFrame: number;
  layers: Layer[];
  currentLayer: number;
  isAnimating: boolean;
  animationFPS: number;
}

const props = defineProps<Props>();

defineEmits<{
  toggleCollapsed: [];
  addFrame: [];
  duplicateFrame: [];
  deleteFrame: [];
  switchFrame: [index: number];
  toggleAnimation: [];
  updateFps: [fps: number];
  addLayer: [];
  duplicateLayer: [];
  deleteLayer: [];
  moveLayerUp: [];
  moveLayerDown: [];
  selectLayer: [index: number];
  toggleLayerVisibility: [index: number];
  updateLayerOpacity: [index: number, event: Event];
  updateLayerName: [index: number, name: string];
}>();

const framePreviewRefs = ref<HTMLCanvasElement[]>([]);
const layerPreviewRefs = ref<HTMLCanvasElement[]>([]);

// Update previews when layers or frames change
const updatePreviews = () => {
  nextTick(() => {
    // Update layer previews
    props.layers.forEach((layer, index) => {
      const previewCanvas = layerPreviewRefs.value[index];
      if (previewCanvas && layer.canvas) {
        const ctx = previewCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 32, 32);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            layer.canvas,
            0,
            0,
            layer.canvas.width,
            layer.canvas.height,
            0,
            0,
            32,
            32
          );
        }
      }
    });

    // Update frame previews
    props.frames.forEach((frame, index) => {
      const previewCanvas = framePreviewRefs.value[index];
      if (previewCanvas) {
        const ctx = previewCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 32, 32);
          ctx.imageSmoothingEnabled = false;

          // Composite all visible layers
          frame.layers.forEach((layer) => {
            if (layer.visible && layer.canvas) {
              ctx.globalAlpha = layer.opacity;
              ctx.drawImage(
                layer.canvas,
                0,
                0,
                layer.canvas.width,
                layer.canvas.height,
                0,
                0,
                32,
                32
              );
            }
          });
          ctx.globalAlpha = 1;
        }
      }
    });
  });
};

// Watch for changes and update previews
watch(() => [props.layers, props.frames], updatePreviews, {
  deep: true,
  immediate: true,
});

onMounted(() => {
  updatePreviews();
});

defineExpose({
  framePreviewRefs,
  layerPreviewRefs,
});
</script>

<style scoped lang="scss">
@use './LayersFrames.scss';
</style>
