<template>
  <aside
    class="sidebar sidebar-left glass-panel-enhanced"
    :class="{ collapsed }"
  >
    <button
      class="sidebar-toggle glass-button"
      @click="$emit('toggleCollapsed')"
    >
      <svg
        v-if="!collapsed"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="icon"
      >
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="currentColor"
        class="icon"
      >
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </button>

    <div
      v-if="!collapsed"
      class="sidebar-content"
    >
      <!-- Current Colors Display -->
      <div class="panel glass-panel-inner">
        <h3 class="panel-title">Current Colors</h3>
        <div class="current-colors-enhanced">
          <div class="color-display-enhanced">
            <div
              class="primary-color-enhanced"
              :style="{ backgroundColor: primaryColor }"
              :title="`Primary: ${primaryColor.toUpperCase()}`"
              @click="$emit('showColorPicker')"
            ></div>
            <div
              class="secondary-color-enhanced"
              :style="{ backgroundColor: secondaryColor }"
              :title="`Secondary: ${secondaryColor.toUpperCase()}`"
            ></div>
            <button
              class="swap-colors-btn glass-button-icon"
              title="Swap Colors (X)"
              @click="$emit('swapColors')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                class="icon-small"
              >
                <path
                  d="M12,2A2,2 0 0,1 14,4V8A2,2 0 0,1 12,10A2,2 0 0,1 10,8V4A2,2 0 0,1 12,2M21,9V7L15,13L13,15L15,17L21,11V9M10,15L8,13L2,19V21L10,15M15,8A2,2 0 0,1 17,10A2,2 0 0,1 15,12A2,2 0 0,1 13,10A2,2 0 0,1 15,8Z"
                />
              </svg>
            </button>
          </div>
          <div class="color-values-enhanced">
            <div class="color-value-enhanced primary">
              {{ primaryColor.toUpperCase() }}
            </div>
            <div class="color-value-enhanced secondary">
              {{ secondaryColor.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Main Color Palette -->
      <div class="panel glass-panel-inner">
        <h3 class="panel-title">
          Color Palette
          <button
            class="glass-button glass-button-small glass-button-danger"
            title="Clear Palette"
            @click="$emit('clearPalette')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon-small"
            >
              <path
                d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
              />
            </svg>
          </button>
        </h3>
        <div class="palette-grid-enhanced">
          <div
            v-for="color in colorPalette"
            :key="color"
            :class="[
              'palette-color-enhanced',
              {
                'active-primary': primaryColor === color,
                'active-secondary': secondaryColor === color,
              },
            ]"
            :style="{ backgroundColor: color }"
            :title="color.toUpperCase()"
            @click="$emit('selectColor', color, 'primary')"
            @contextmenu.prevent="$emit('selectColor', color, 'secondary')"
          ></div>

          <!-- Add Color Button -->
          <button
            class="add-color-btn-enhanced glass-button-icon"
            title="Add Custom Color"
            @click="$emit('showColorPicker')"
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
      </div>

      <!-- Extended Color Palette -->
      <div class="panel glass-panel-inner">
        <h3 class="panel-title">Extended Palette</h3>
        <div class="extended-palette-grid">
          <div
            v-for="color in extendedColorPalette"
            :key="color"
            :class="[
              'palette-color-small',
              {
                'active-primary': primaryColor === color,
                'active-secondary': secondaryColor === color,
              },
            ]"
            :style="{ backgroundColor: color }"
            :title="color.toUpperCase()"
            @click="$emit('selectColor', color, 'primary')"
            @contextmenu.prevent="$emit('selectColor', color, 'secondary')"
          ></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  collapsed: boolean;
  primaryColor: string;
  secondaryColor: string;
  colorPalette: string[];
  extendedColorPalette: string[];
}

defineProps<Props>();

defineEmits<{
  toggleCollapsed: [];
  selectColor: [color: string, target: 'primary' | 'secondary'];
  clearPalette: [];
  showColorPicker: [];
  swapColors: [];
}>();
</script>

<style scoped lang="scss">
@use './ColorPalette.scss';
</style>
