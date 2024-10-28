<template>
  <div class="click-parent" @click="setPosition">
    <div v-if="isActive" ref="dotRef" class="dot" :style="containerStyle">
      <slot></slot>
    </div>
    <div v-if="isPositioningMode" class="pulse-mouse" :style="pulseStyle" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from 'vue';
import { useDungeonStore } from '@/stores/dungeon';

const dungeonStore = useDungeonStore();

const props = defineProps({
  duration: {
    type: Number,
    default: 1000,
  },
});

const emit = defineEmits(['dot']);

const isActive = ref(false);
const isPositioningMode = ref(false);
const position = ref({ x: 0, y: 0 });
const containerSize = ref({ width: 0, height: 0 });
const dotRef = ref<HTMLElement | null>(null);
const pulse = ref({ x: 0, y: 0 });

const activate = (event: MouseEvent) => {
  event.stopPropagation();
  if (!isPositioningMode.value) {
    isPositioningMode.value = true;
    document.addEventListener('mousemove', updateCursorPosition);
  }
};

const setPosition = async (event: MouseEvent) => {
  if (!isPositioningMode.value) return;
  const cellType = dungeonStore.getCellType(pulse.value.x, pulse.value.y);
  if (cellType === 'wall') return;
  isActive.value = true;

  await nextTick();
  updateContainerSize();

  position.value.x = event.clientX - containerSize.value.width / 2;
  position.value.y = event.clientY - containerSize.value.height / 2;

  emit('dot', position.value);
  endPositioningMode();

  setTimeout(() => (isActive.value = false), props.duration);
};

const updateContainerSize = () => {
  if (dotRef.value) {
    const rect = dotRef.value.getBoundingClientRect();
    containerSize.value.width = rect.width;
    containerSize.value.height = rect.height;
  }
};

const endPositioningMode = () => {
  isPositioningMode.value = false;
  document.removeEventListener('mousemove', updateCursorPosition);
};

const updateCursorPosition = (event: MouseEvent) => {
  pulse.value.x = event.clientX;
  pulse.value.y = event.clientY;
};

const containerStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}));

const pulseStyle = computed(() => ({
  left: `${pulse.value.x - 50}px`,
  top: `${pulse.value.y - 50}px`,
  backgroundColor:
    dungeonStore.getCellType(pulse.value.x, pulse.value.y) === 'wall'
      ? 'rgba(231, 57, 57, 0.33)'
      : 'rgba(57, 231, 57, 0.33)',
}));

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', updateCursorPosition);
});

defineExpose({
  activate,
});
</script>

<style scoped lang="scss">
.click-parent {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
}

.dot {
  position: absolute;
  transition: opacity 0.3s ease;
}

.pulse-mouse {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
</style>
