<template>
  <button
    :disabled="isLoading || disabled"
    class="btn"
    :class="`btn--${type} ${disabled ? 'loading' : ''}`"
    @click="handleClick"
  >
    <span
      v-if="isLoading"
      class="loader"
    />
    <span :style="isLoading ? 'opacity: 0' : ''">
      <slot name="icon" />
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
interface Button {
  label?: string;
  type?: 'primary' | 'secondary' | 'danger' | 'base';
  action?: () => Promise<void>;
  disabled?: boolean;
}

const props = defineProps<Button>();

const emit = defineEmits<{
  (e: 'action-complete'): void;
}>();

const isLoading = ref(false);

const handleClick = async () => {
  if (props.disabled || isLoading.value) return;

  if (props.action) {
    isLoading.value = true;
    try {
      await props.action();
      emit('action-complete');
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<style scoped lang="scss">
@use './Button.scss';
</style>
