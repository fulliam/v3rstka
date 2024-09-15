<template>
  <div>
    <div
      v-for="position in toastPositions"
      :key="position"
      :class="['toast-wrapper', `toast-wrapper--${position}`]"
    >
      <div
        v-for="toast in toastsByPosition(position)"
        :key="toast.id"
        :class="[
          'toast',
          toastTypeClass(toast.type),
          `toast--${toast.position}`,
          { 'toast--visible': toast.visible },
        ]"
        :style="{
          backgroundColor: toastColors[toast.type].backgroundColor,
          color: toastColors[toast.type].textColor,
        }"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToastStore } from '@/stores/toast';
import type { Toast } from '@/types';

interface ToastColors {
  backgroundColor: string;
  textColor: string;
}

const toastStore = useToastStore();
const toastList = computed<Toast[]>(() => toastStore.toastList);

const toastColors: Record<Toast['type'], ToastColors> = {
  info: { backgroundColor: '#d9f7ff', textColor: '#003a8c' },
  success: { backgroundColor: '#b7eb8f', textColor: '#389e0d' },
  warning: { backgroundColor: '#fffbe6', textColor: '#ad8b00' },
  error: { backgroundColor: '#ffa39e', textColor: '#cf1322' },
};

const toastPositions: Toast['position'][] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

const toastsByPosition = (position: Toast['position']) => {
  return toastList.value.filter((toast) => toast.position === position);
};

const toastTypeClass = (type: Toast['type']) => {
  return `toast--${type}`;
};
</script>

<style scoped lang="scss">
.toast-wrapper {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &--top-left {
    top: 10px;
    left: 10px;
    align-items: flex-start;
  }

  &--top-right {
    top: 10px;
    right: 10px;
    align-items: flex-end;
  }

  &--bottom-left {
    bottom: 10px;
    left: 10px;
    align-items: flex-start;
  }

  &--bottom-right {
    bottom: 10px;
    right: 10px;
    align-items: flex-end;
  }
}

.toast {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  max-width: 300px;
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &--visible {
    opacity: 1;
  }

  &--top-left {
    top: 10px;
    left: 10px;
    animation: slide-in-top-left 0.3s ease forwards;
  }

  &--top-right {
    top: 10px;
    right: 10px;
    animation: slide-in-top-right 0.3s ease forwards;
  }

  &--bottom-left {
    bottom: 10px;
    left: 10px;
    animation: slide-in-bottom-left 0.3s ease forwards;
  }

  &--bottom-right {
    bottom: 10px;
    right: 10px;
    animation: slide-in-bottom-right 0.3s ease forwards;
  }
}

@keyframes slide-in-top-left {
  0% {
    opacity: 0;
    transform: translate(-100%, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes slide-in-top-right {
  0% {
    opacity: 0;
    transform: translate(100%, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes slide-in-bottom-left {
  0% {
    opacity: 0;
    transform: translate(0, 100%);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes slide-in-bottom-right {
  0% {
    opacity: 0;
    transform: translate(0, 100%);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}
</style>
