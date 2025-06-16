<template>
  <section>
    <Firefly />
    <StepOne
      v-if="currentStep === 1"
      @step="setStep"
    />
    <StepTwo
      v-if="currentStep === 2"
      @step="setStep"
    />
  </section>
</template>

<script setup lang="ts">
import Firefly from '@/components/templates/firefly/index.vue';
import StepOne from './steps/one/index.vue';
import StepTwo from './steps/two/index.vue';

const currentStep = ref(1);

const setStep = (step: number) => {
  currentStep.value = step;
};
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
