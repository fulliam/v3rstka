<template>
  <section>
    <Menu style="z-index: 100" />
    <PracticleCube />
    <!-- <ModelViewe :url="'@/assets/3D/character.obj'" /> -->
  </section>
</template>

<script setup lang="ts">
import Menu from '@/components/partials/menu/index.vue';
import PracticleCube from '@/components/partials/animations/3D_practicle_cube/index.vue';
// import ModelViewe from '@/components/partials/animations/3D_model_view/index.vue';
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
  background-color: white;
}
</style>
