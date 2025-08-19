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
import { gsap } from 'gsap';
import { usePlayerStore } from '@/stores/player';

interface Props {
  images: string[];
  currentAct: string;
  positionX: number;
  moneyId: string;
  type: string;
}

const props = defineProps<Props>();

// Store
const playerStore = usePlayerStore();

// Refs
const moneyImgRef = ref<HTMLImageElement | null>(null);
const currentImageIndex = ref(0);
const animationIntervalId = ref<number | null>(null);
const moneyPositionX = ref(props.positionX);
const moneyPositionY = ref(0);
const isCollected = ref(false);
const isAnimating = ref(true);

const DROP_RANGE = 150;
const COLLECTION_DISTANCE = 50;

const currentImage = computed(() => {
  return props.images[currentImageIndex.value];
});

const moneyPosition = computed(() => {
  const bottomPercentage = props.currentAct === 'ActVI' ? '11%' : '25%';

  return {
    position: 'absolute' as const,
    left: `calc(${moneyPositionX.value}px + ${DROP_RANGE}px)`,
    bottom: `calc(${bottomPercentage} - ${moneyPositionY.value}px)`,
    zIndex: 999,
  };
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

const createDropAnimation = () => {
  if (!moneyImgRef.value) return;

  const randomY = Math.random() * -90;

  gsap.to(moneyImgRef.value, {
    duration: 0.65,
    y: randomY,
    ease: 'power1.out',
    onComplete: () => {
      if (!moneyImgRef.value) return;

      gsap.to(moneyImgRef.value, {
        duration: 0.8,
        y: 0,
        ease: 'bounce.out',
      });
    },
  });
};

const startAnimation = () => {
  const intervalSpeed = props.moneyId.includes('gem') ? 150 : 100;
  animationIntervalId.value = window.setInterval(changeImage, intervalSpeed);
};

const stopAnimation = () => {
  if (animationIntervalId.value !== null) {
    clearInterval(animationIntervalId.value);
    animationIntervalId.value = null;
  }
};

const changeImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length;
};

const unsubscribe = playerStore.$subscribe((mutation, state) => {
  const playerPosition = state.player?.state?.position?.x;
  const playerDirection = state.player?.state?.direction;

  if (playerPosition !== undefined && playerDirection) {
    const leftEdge = 0;
    const rightEdge = 1920;
    const speed = 5;

    if (playerDirection === 'right' && playerPosition < rightEdge) {
      moneyPositionX.value -= speed;
    } else if (playerDirection === 'left' && playerPosition > leftEdge) {
      moneyPositionX.value += speed;
    }
  }
});

const handleCollection = () => {
  stopAnimation();
  isCollected.value = true;
  isAnimating.value = false;

  console.log(`Collected: ${props.moneyId} (${props.type})`);
  // playerStore.collectMoney(props.moneyId, props.type);
};

const checkCollection = () => {
  const playerPosition = playerStore.getPlayer?.state?.position?.x;
  if (playerPosition !== undefined) {
    const distance = Math.abs(playerPosition - moneyPositionX.value);
    if (distance <= COLLECTION_DISTANCE) {
      handleCollection();
    }
  }
};

const onAnimationEnd = () => {
  isAnimating.value = false;
};

watch(() => playerStore.getPlayer?.state?.position?.x, checkCollection);
watch(moneyPositionX, checkCollection);

onMounted(() => {
  startAnimation();
  createDropAnimation();
});

onBeforeUnmount(() => {
  stopAnimation();
  if (unsubscribe) unsubscribe();
});
</script>

<style scoped lang="scss">
@use './Money.scss';
</style>
