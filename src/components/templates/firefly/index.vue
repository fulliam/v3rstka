<template>
  <div id="firefly"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { initFireflies } from '@/plugins/generators/firefly';

onMounted(() => {
  const container = document.querySelector('#firefly') as HTMLElement;
  if (container) {
    initFireflies(container);
  }
});
</script>

<style scoped>
#firefly {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
