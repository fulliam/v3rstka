<template>
  <div
    class="mobile-menu-overlay"
    @click="$emit('close')"
  >
    <div
      class="mobile-menu glass-panel-enhanced"
      @click.stop
    >
      <div class="mobile-menu-header">
        <h3>Tools & Options</h3>
        <button
          class="close-btn glass-button"
          @click="$emit('close')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </button>
      </div>
      <div class="mobile-menu-content">
        <!-- Mobile color palette -->
        <div class="mobile-section">
          <h4>Colors</h4>
          <div class="mobile-color-section">
            <div class="mobile-current-colors">
              <div class="color-display">
                <div
                  class="primary-color"
                  :style="{ backgroundColor: primaryColor }"
                  @click="$emit('showColorPicker')"
                ></div>
                <div
                  class="secondary-color"
                  :style="{ backgroundColor: secondaryColor }"
                ></div>
              </div>
              <div class="color-values">
                <div class="color-value">{{ primaryColor.toUpperCase() }}</div>
              </div>
            </div>

            <div class="mobile-palette-grid">
              <div
                v-for="color in colorPalette"
                :key="color"
                :class="['palette-color', { active: primaryColor === color }]"
                :style="{ backgroundColor: color }"
                @click="$emit('selectColor', color, 'primary')"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  primaryColor: string;
  secondaryColor: string;
  colorPalette: string[];
}

defineProps<Props>();

defineEmits<{
  close: [];
  selectColor: [color: string, target: 'primary' | 'secondary'];
  showColorPicker: [];
}>();
</script>

<style scoped lang="scss">
@use './MobileMenu.scss';
</style>
