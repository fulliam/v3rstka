<template>
  <Animation
    :path="
      animations.char.ally[character as CharacterName][action as ActionName]
    "
  />
</template>

<script setup lang="ts">
import Animation from '@/components/templates/animation/index.vue';
import animations from '@/animations.json';

enum CharacterName {
  Archer = 'archer',
  Swordsman = 'swordsman',
  Wizard = 'wizard',
  Skeleton = 'skeleton',
}

enum ActionName {
  Attack = 'attack',
  Attack2 = 'attack2',
  Attack3 = 'attack3',
  Dead = 'dead',
  Idle = 'idle',
  Walk = 'walk',
  Run = 'run',
}

defineProps(['character', 'action']);
</script>
