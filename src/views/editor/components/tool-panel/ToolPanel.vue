<template>
  <div
    class="floating-tool-panel-compact glass-panel-enhanced"
    :class="{ expanded }"
  >
    <div
      class="tool-panel-toggle-compact"
      @click="$emit('toggleExpanded')"
    >
      <div class="tool-toggle-content">
        <svg
          v-if="!expanded"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon"
        >
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
        <span class="current-tool-indicator">
          {{ currentTool.charAt(0).toUpperCase() + currentTool.slice(1) }}
        </span>
      </div>
    </div>

    <div
      v-if="expanded"
      class="tool-panel-content-compact"
    >
      <div class="tool-grid-compact">
        <!-- Pencil Tool -->
        <button
          :class="[
            'tool-btn-compact',
            'glass-button-tool',
            { active: currentTool === 'pencil' },
          ]"
          title="Pencil Tool (P)"
          @click="$emit('selectTool', 'pencil')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="tool-icon-compact"
          >
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </button>

        <!-- Eraser Tool -->
        <button
          :class="[
            'tool-btn-compact',
            'glass-button-tool',
            { active: currentTool === 'eraser' },
          ]"
          title="Eraser Tool (E)"
          @click="$emit('selectTool', 'eraser')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="tool-icon-compact"
          >
            <path
              d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-6.36-6.36-3.54 3.36z"
            />
          </svg>
        </button>

        <!-- Fill Tool -->
        <button
          :class="[
            'tool-btn-compact',
            'glass-button-tool',
            { active: currentTool === 'fill' },
          ]"
          title="Fill Tool (F)"
          @click="$emit('selectTool', 'fill')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="tool-icon-compact"
          >
            <path d="M19,11H5V13H19V11Z" />
          </svg>
        </button>

        <!-- Color Picker Tool -->
        <button
          :class="[
            'tool-btn-compact',
            'glass-button-tool',
            { active: currentTool === 'picker' },
          ]"
          title="Color Picker (I)"
          @click="$emit('selectTool', 'picker')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="tool-icon-compact"
          >
            <path
              d="M2.5,4.27L3.91,2.86L8.5,7.45L7.09,8.86L2.5,4.27M16,12.15L11.85,8L20.07,2.42L21.5,3.85L16,12.15M8.3,8.3L4.27,12.33C3.5,13.1 3.5,14.34 4.27,15.11L8.89,19.73C9.66,20.5 10.9,20.5 11.67,19.73L15.7,15.7L8.3,8.3Z"
            />
          </svg>
        </button>

        <!-- Hand Tool -->
        <button
          :class="[
            'tool-btn-compact',
            'glass-button-tool',
            { active: currentTool === 'hand' },
          ]"
          title="Hand Tool (H)"
          @click="$emit('selectTool', 'hand')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="tool-icon-compact"
          >
            <path
              d="M13,6V8H9V6H13M9,10H13V14H11V12H9V10M15,4H7V6H15V4M15,8H7V10H15V8M7,12V14H15V12H7Z"
            />
          </svg>
        </button>
      </div>

      <!-- Compact Brush Size Control -->
      <div
        v-if="currentTool === 'pencil' || currentTool === 'eraser'"
        class="brush-controls-compact"
      >
        <div class="brush-size-compact">
          <span class="brush-label-compact">Size: {{ brushSize }}</span>
          <input
            type="range"
            :value="brushSize"
            min="1"
            max="20"
            class="brush-slider-compact glass-slider"
            @input="
              $emit(
                'updateBrushSize',
                parseInt(($event.target as HTMLInputElement).value)
              )
            "
          />
          <div class="brush-preview-compact">
            <div
              class="brush-preview-square-compact"
              :style="{
                width: Math.max(4, brushSize * 2) + 'px',
                height: Math.max(4, brushSize * 2) + 'px',
                backgroundColor:
                  currentTool === 'eraser' ? 'transparent' : primaryColor,
                border:
                  currentTool === 'eraser'
                    ? '1px dashed rgba(255, 107, 107, 0.8)'
                    : '1px solid rgba(255, 255, 255, 0.3)',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  expanded: boolean;
  currentTool: string;
  brushSize: number;
  primaryColor: string;
}

defineProps<Props>();

defineEmits<{
  toggleExpanded: [];
  selectTool: [tool: string];
  updateBrushSize: [size: number];
}>();
</script>

<style scoped lang="scss">
@use './ToolPanel.scss';
</style>
