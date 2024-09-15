<template>
  <button
    :disabled="isLoading || disabled"
    class="btn pixel-border"
    :class="`btn--${type}`"
    @click="handleClick"
  >
    <span v-if="isLoading" class="loader"></span>
    <span :style="isLoading ? 'opacity: 0' : ''">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Button {
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
  action: () => Promise<void>;
  disabled?: boolean;
}

const props = defineProps<Button>();

const emit = defineEmits<{
  (e: 'action-complete'): void;
}>();

const isLoading = ref(false);
const buttonWidth = ref(0);
const buttonHeight = ref(0);

const handleClick = async () => {
  isLoading.value = true;
  try {
    await props.action();
    emit('action-complete');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
$primary-color: #3498db;
$primary-text-color: #fff;
$secondary-color: #2ecc71;
$secondary-text-color: #fff;
$danger-color: #e74c3c;
$danger-text-color: #fff;
$loader-color: #fff;
$loader-border-color: rgba(255, 255, 255, 0.2);

.btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  position: relative;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  span {
    margin: 0 8px;
  }

  .loader {
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 20px);
    border: 4px solid $loader-border-color;
    border-top: 4px solid $loader-color;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }

  &--primary {
    color: $primary-text-color;
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $background-color: $primary-color
    );
  }

  &--secondary {
    color: $secondary-text-color;
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $background-color: $secondary-color
    );
  }

  &--danger {
    color: $danger-text-color;
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $background-color: $danger-color
    );
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
