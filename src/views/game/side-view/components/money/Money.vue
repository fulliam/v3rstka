<template>
  <img
    v-if="!isCollected"
    ref="moneyImgRef"
    :src="currentImage"
    alt="Money"
    :style="[moneyPosition, filterStyle]"
    class="money"
    @animationend="onAnimationEnd"
  />
</template>

<script setup lang="ts">
import {
  useMoneyAnimation,
  useMoneyCollection,
} from '@/views/game/side-view/composables';

interface Props {
  images: string[];
  currentAct: string;
  positionX: number;
  moneyId: string;
  type: string;
}

const props = defineProps<Props>();

const moneyImgRef = ref<HTMLImageElement | null>(null);
const { stopAnimation, isAnimating, currentImage, onAnimationEnd } =
  useMoneyAnimation(props.images, props.moneyId, moneyImgRef);

const { moneyPosition, isCollected } = useMoneyCollection({
  currentAct: props.currentAct,
  positionX: props.positionX,
  moneyId: props.moneyId,
  type: props.type,
  moneyImgRef,
  stopAnimation,
  isAnimating,
});

const filterStyle = computed(() => {
  const filterMap: Record<string, string> = {
    gemYellow: 'drop-shadow(0 0 0.75rem rgba(255, 213, 0, 0.637))',
    gemGreen: 'drop-shadow(0 0 0.75rem rgba(26, 255, 0, 0.637))',
    gemBlue: 'drop-shadow(0 0 0.75rem rgba(0, 149, 255, 0.637))',
    gemRed: 'drop-shadow(0 0 0.75rem rgba(255, 55, 0, 0.637))',
    gemBGrey: 'drop-shadow(0 0 0.75rem rgba(162, 162, 162, 0.637))',
  };

  const filterValue =
    Object.entries(filterMap).find(([key]) =>
      props.moneyId.includes(key)
    )?.[1] || 'none';

  return { filter: filterValue };
});
</script>

<style scoped lang="scss">
@use './Money.scss';
</style>
