<template>
  <div class="step-one">
    <NickNameInput />
    <Carousel
      :cards="cards"
      @change="changeCard"
    />
    <Button
      class="continue-button"
      type="base"
      :label="'CONTINUE'"
      :action="goToStepTwo"
    />
  </div>
</template>

<script setup lang="ts">
import Carousel from '@/components/partials/carousel/index.vue';
import NickNameInput from '@/components/templates/nickname/index.vue';
import Animation from '@/components/templates/animation/index.vue';
import animations from '@/animations.json';
import { usePlayerStore } from '@/stores/player';

const emit = defineEmits(['step', 'data']);
const playerStore = usePlayerStore();

const characterTypes = ref(Object.keys((animations as any).char['ally']));
const currentCharacter = ref('');
const cards = computed(() =>
  characterTypes.value.map((character) => ({
    id: `card-${character}`,
    component: Animation,
    props: {
      path: (animations as any).char.ally[character]['idle'],
      enable: currentCharacter.value === character,
    },
  }))
);

const changeCard = (index: number) => {
  currentCharacter.value = characterTypes.value[index];
};

const goToStepTwo = () => {
  emit('step', 2);
  emit('data', currentCharacter.value);

  playerStore.createPlayer(currentCharacter.value);
};
</script>

<style scoped lang="scss">
.step-one {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s ease-in-out;
}
</style>
