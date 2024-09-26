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
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
