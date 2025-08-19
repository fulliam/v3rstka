<template>
  <div class="hp-bar-container">
    <Hearts :hearts="hearts" />
  </div>
</template>

<script setup lang="ts">
import type { Health } from '@/types';
import { Hearts } from '@/components/partials/hearts';

const props = defineProps<{ health: Health }>();

const hearts = computed(() => {
  const current = props.health.current;
  const max = props.health.max;
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  const heartCount = 8;
  const heartsArray = [];

  for (let i = 0; i < heartCount; i++) {
    const heartValue = (percentage / 100) * heartCount;
    const fill = Math.max(0, Math.min(100, (heartValue - i) * 100));
    heartsArray.push({ fill });
  }

  return heartsArray;
});
</script>

<style scoped lang="scss">
@use './HpBar.scss';
</style>
