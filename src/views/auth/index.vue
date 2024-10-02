<template>
  <section class="auth">
    <Auth />
    <Firefly />
  </section>
</template>

<script setup lang="ts">
import Auth from '@/components/templates/auth/index.vue';
import Firefly from '@/components/templates/firefly/index.vue';
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
