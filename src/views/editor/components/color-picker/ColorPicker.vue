<template>
  <div
    class="color-picker-overlay"
    @click="$emit('close')"
  >
    <div
      class="custom-color-picker glass-panel-enhanced"
      @click.stop
    >
      <div class="color-picker-header">
        <h3>Color Picker</h3>
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

      <div class="color-picker-content">
        <!-- HSV Color Picker -->
        <div class="hsv-picker">
          <div
            ref="hsvPicker"
            class="hue-saturation-picker"
            :style="{ backgroundColor: `hsl(${hsvColor.h}, 100%, 50%)` }"
            @mousedown="startHSVPicking"
            @mousemove="updateHSVPicking"
            @mouseup="stopHSVPicking"
          >
            <div class="saturation-overlay"></div>
            <div class="value-overlay"></div>
            <div
              class="hsv-cursor"
              :style="{
                left: hsvColor.s * 200 + 'px',
                top: (1 - hsvColor.v) * 200 + 'px',
              }"
            ></div>
          </div>

          <div class="hue-slider-container">
            <input
              v-model.number="hsvColor.h"
              type="range"
              min="0"
              max="360"
              class="hue-slider glass-slider"
              @input="updateColorFromHSV"
            />
          </div>
        </div>

        <!-- Color Preview and Values -->
        <div class="color-preview-section">
          <div
            class="color-preview-large"
            :style="{ backgroundColor: currentColor }"
          ></div>
          <div class="color-inputs-section">
            <div class="color-input-group">
              <label>Hex</label>
              <input
                v-model="hexInput"
                type="text"
                class="color-input-field glass-input"
                placeholder="#000000"
                @input="updateColorFromHex"
              />
            </div>
            <div class="color-input-group">
              <label>RGB</label>
              <div class="rgb-inputs">
                <input
                  v-model.number="rgbColor.r"
                  type="number"
                  min="0"
                  max="255"
                  class="color-input-field glass-input"
                  @input="updateColorFromRGB"
                />
                <input
                  v-model.number="rgbColor.g"
                  type="number"
                  min="0"
                  max="255"
                  class="color-input-field glass-input"
                  @input="updateColorFromRGB"
                />
                <input
                  v-model.number="rgbColor.b"
                  type="number"
                  min="0"
                  max="255"
                  class="color-input-field glass-input"
                  @input="updateColorFromRGB"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Color Picker Actions -->
        <div class="color-picker-actions">
          <button
            class="glass-button"
            @click="$emit('addToPalette')"
          >
            Add to Palette
          </button>
          <button
            class="glass-button glass-button-primary"
            @click="$emit('applyColor')"
          >
            Apply Color
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { HSVColor, RGBColor } from '../../types';

interface Props {
  currentColor: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  applyColor: [];
  addToPalette: [];
  updateColor: [color: string];
}>();

const hsvPicker = ref<HTMLDivElement>();
const hexInput = ref('#000000');
const hsvColor = ref<HSVColor>({ h: 0, s: 0, v: 0 });
const rgbColor = ref<RGBColor>({ r: 0, g: 0, b: 0 });
const isHSVPicking = ref(false);

// Initialize color picker with current color
onMounted(() => {
  updateColorPickerFromHex(props.currentColor);
});

watch(
  () => props.currentColor,
  (newColor) => {
    updateColorPickerFromHex(newColor);
  }
);

function updateColorPickerFromHex(hex: string) {
  hexInput.value = hex;
  const rgb = hexToRgb(hex);
  rgbColor.value = { r: rgb.r, g: rgb.g, b: rgb.b };
  hsvColor.value = rgbToHsv(rgb.r, rgb.g, rgb.b);
}

function updateColorFromHSV() {
  const rgb = hsvToRgb(hsvColor.value.h, hsvColor.value.s, hsvColor.value.v);
  rgbColor.value = rgb;
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  hexInput.value = hex;
  emit('updateColor', hex);
}

function updateColorFromHex() {
  if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
    const rgb = hexToRgb(hexInput.value);
    rgbColor.value = rgb;
    hsvColor.value = rgbToHsv(rgb.r, rgb.g, rgb.b);
    emit('updateColor', hexInput.value);
  }
}

function updateColorFromRGB() {
  const hex = rgbToHex(rgbColor.value.r, rgbColor.value.g, rgbColor.value.b);
  hexInput.value = hex;
  hsvColor.value = rgbToHsv(
    rgbColor.value.r,
    rgbColor.value.g,
    rgbColor.value.b
  );
  emit('updateColor', hex);
}

function startHSVPicking(event: MouseEvent) {
  isHSVPicking.value = true;
  updateHSVFromMouse(event);
}

function updateHSVPicking(event: MouseEvent) {
  if (isHSVPicking.value) {
    updateHSVFromMouse(event);
  }
}

function stopHSVPicking() {
  isHSVPicking.value = false;
}

function updateHSVFromMouse(event: MouseEvent) {
  if (!hsvPicker.value) return;

  const rect = hsvPicker.value.getBoundingClientRect();
  const x = Math.max(0, Math.min(200, event.clientX - rect.left));
  const y = Math.max(0, Math.min(200, event.clientY - rect.top));

  hsvColor.value.s = x / 200;
  hsvColor.value.v = 1 - y / 200;

  updateColorFromHSV();
}

// Color conversion utilities
function rgbToHsv(r: number, g: number, b: number): HSVColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = max === 0 ? 0 : diff / max;
  let v = max;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, v };
}

function hsvToRgb(h: number, s: number, v: number): RGBColor {
  h /= 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      }
    : { r: 0, g: 0, b: 0, a: 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
</script>

<style scoped lang="scss">
@use './ColorPicker.scss';
</style>
