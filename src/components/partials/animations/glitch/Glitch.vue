<!-- @/components/ui/GlitchContainer.vue -->
<template>
  <div class="glitch-container">
    <div class="glitch">
      <h1 class="glitch-inner">
        {{ glitchText }}
      </h1>
    </div>

    <!-- Основной контент -->
    <div class="glitch-inner-2">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// Пропс: текст для глитча (можно кастомизировать)
const props = defineProps({
  text: {
    type: String,
    default: 'GLITCH',
  },
});

// Используем пропс или делаем заглавными
const glitchText = props.text.toUpperCase();
</script>

<style lang="scss">
@use './Glitch.scss';
</style>