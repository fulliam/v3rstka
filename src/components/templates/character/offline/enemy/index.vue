<template>
  <Animation
    :path="
      group && character && action
        ? animationsObj.char.enemy[group]?.[character]?.[action]
        : character && action
          ? animationsObj.char.enemy[character]?.[action]
          : ''
    "
  />
</template>

<script setup lang="ts">
import Animation from '@/components/templates/animation/index.vue';
import animations from '@/animations.json';

defineProps({
  group: String,
  character: String,
  action: String,
});

const animationsObj: any = animations;
</script>
