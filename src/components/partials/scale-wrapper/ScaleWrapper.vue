<template>
  <div
    ref="viewportRef"
    class="scale-wrapper-viewport"
  >
    <div
      class="scale-wrapper-inner"
      :style="{
        transform: `scale(${scale})`,
        transformOrigin: scaleOrigin,
      }"
    >
      <div
        class="scale-wrapper-content"
        :style="{
          width: `${designWidth}px`,
          height: `${designHeight}px`,
        }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResponsiveScale } from './composables';

interface Props {
  designWidth?: number;
  designHeight?: number;
  maxScale?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  designWidth: 1920,
  designHeight: 1080,
  maxScale: null,
  background: 'transparent',
});

const { scale, scaleOrigin } = useResponsiveScale(
  props.designWidth,
  props.designHeight,
  props.maxScale
);

const viewportRef = ref<HTMLElement | null>(null);
</script>

<style scoped lang="scss">
.scale-wrapper-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.scale-wrapper-inner {
  will-change: transform;
  transform-style: preserve-3d;
}

.scale-wrapper-content {
  position: relative;
  overflow: visible;
  display: block;
}
</style>