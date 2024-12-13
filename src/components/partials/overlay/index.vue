<template>
  <div class="overlay">
    <div
      class="circle"
      :style="{
        left: `${position.x - 150}px`,
        top: `${position.y - 150}px`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  position: { x: number; y: number };
}>();
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  /* border: none !important; */
  border-color: aliceblue;
  background-color: rgba(0, 0, 0, 0);
  box-shadow:
    0 0 0 9999px rgba(0, 0, 0, 0.7),
    inset 0 0 10px 20px rgba(0, 0, 0, 0.7);
}
</style>
