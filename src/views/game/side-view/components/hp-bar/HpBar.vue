<template>
  <div class="hp-bar-container">
    <div class="hp-bar-wrapper">
      <div 
        class="hp-bar-background"
        :class="{ danger: healthPercentage <= 30 }"
      >
        <div 
          class="hp-bar-fill"
          :style="{ width: `${healthPercentage}%` }"
          :class="{
            'low': healthPercentage <= 30,
            'medium': healthPercentage > 30 && healthPercentage <= 60,
            'high': healthPercentage > 60
          }"
        ></div>
      </div>
      <div class="hp-bar-text">
        {{ Math.round(player.state.health.current) }} / {{ player.state.health.max }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@/types';

const props = defineProps<{ player: Player }>();

const healthPercentage = computed(() => {
  const current = props.player.state.health.current;
  const max = props.player.state.health.max;
  return Math.max(0, Math.min(100, (current / max) * 100));
});
</script>

<style scoped lang="scss">
@use './HpBar.scss';
</style>