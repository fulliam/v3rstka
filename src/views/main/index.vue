<template>
  <section>
    <Menu />
  </section>
</template>

<script setup lang="ts">
import Menu from '@/components/partials/menu/index.vue';
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 100vh;
}
</style>
