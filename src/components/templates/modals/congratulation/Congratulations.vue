<template>
  <Shimmer
    color="#fff"
    :glow="true"
    borderRadius="12px"
  >
    <Fireworks
      :pixelScale="3"
      :autoLaunch="true"
      :autoInterval="500"
      :fullscreen="true"
    />
    
    <div class="congratulations-modal">
      <div class="content">
        <div class="chest-animation-container">
          <Ghost
            class="shake"
            style="scale: 0.4"
          />
        </div>

        <h1
          class="title"
          :class="{ visible: titleVisible }"
        >
          <TextScramble :phrases="[`CONGRATULATIONS!`]" />
        </h1>
      </div>
    </div>
  </Shimmer>
</template>

<script setup>
import Fireworks from '@/components/templates/fireworks/Fireworks.vue';
import { Ghost } from '@/components/templates/ghost';
import { Shimmer } from '@/components/templates/shimmer';
import TextScramble from '@/components/partials/animations/scramble/index.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Congratulations!',
  },
  action: {
    type: String,
    default: 'idle',
  },
  autoCloseDelay: {
    type: Number,
    default: 5000,
  },
});

const titleVisible = ref(false);

const openSound = new Audio(
  new URL('@/sounds/JDSherbert - Ultimate UI SFX Pack/Free/Stereo/mp3/JDSherbert - Ultimate UI SFX Pack - Cursor - 3.mp3', import.meta.url).href
);

openSound.volume = 0.5;

const playSound = () => {
  openSound.currentTime = 0;
  openSound.play().catch(() => {
    console.warn('Аудио не воспроизведено — требуется взаимодействие.');
  });
};

playSound();

onMounted(() => {
  setTimeout(() => {
    setTimeout(() => {
      titleVisible.value = true;
    }, 600);
  }, 800);

  if (props.autoCloseDelay > 0) {
    setTimeout(() => {}, props.autoCloseDelay);
  }
});


</script>

<style scoped lang="scss">
@use './Congratulations.scss';

.shake {
  animation: shake 2s ease-in-out infinite;
}
</style>
