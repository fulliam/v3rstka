<template>
  <div class="heart-wrapper">
    <div
      v-for="(heart, index) in hearts"
      :key="index"
      class="heart"
      :class="getHeartClass(heart.fill)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  hearts: {
    fill: number;
  }[];
}>();

const getHeartClass = (fill: number) => {
  if (fill <= 0) return 'heart-0';
  if (fill <= 10) return 'heart-10';
  if (fill <= 20) return 'heart-20';
  if (fill <= 30) return 'heart-30';
  if (fill <= 40) return 'heart-40';
  if (fill <= 50) return 'heart-50';
  if (fill <= 60) return 'heart-60';
  if (fill <= 70) return 'heart-70';
  if (fill <= 80) return 'heart-80';
  if (fill <= 90) return 'heart-90';
  return 'heart-100';
};
</script>

<style scoped lang="scss">
@use './Hearts.scss';
</style>
