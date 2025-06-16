<template>
  <div class="carousel">
    <div class="carousel-wrapper">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        :class="['card', getCardClass(index)]"
        :style="getCardStyle(index)"
        @click="onCardClick(index)"
      >
        <component
          :is="card.component"
          v-bind="card.props"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Card {
  id: string;
  component: any;
  props?: Record<string, any>;
  style?: Record<string, any>;
}

defineProps<{
  cards: Card[];
}>();

const emit = defineEmits(['change']);

const currentIndex = ref(2);
// const lastScrollTime = ref(0);
// const scrollDelay = 1000;

const getCardClass = (index: number) => {
  if (index < currentIndex.value) return 'left';
  if (index > currentIndex.value) return 'right';
  return 'focused';
};

const getCardStyle = (index: number) => {
  const cardWidth = 360;
  const focusedOffset = 0;
  const distanceBetweenFocusAndNeighbor = 10;
  const distanceBetweenNeighbors = -80;

  let offset = 0;
  if (index === currentIndex.value) {
    offset = focusedOffset;
  } else if (index < currentIndex.value) {
    offset =
      (currentIndex.value - index) *
        (cardWidth + distanceBetweenNeighbors) *
        -1 -
      distanceBetweenFocusAndNeighbor;
  } else {
    offset =
      (index - currentIndex.value) * (cardWidth + distanceBetweenNeighbors) +
      distanceBetweenFocusAndNeighbor;
  }

  // const rotation =
  //   index === currentIndex.value
  //     ? 'rotateY(0)'
  //     : index < currentIndex.value
  //       ? 'rotateY(80deg)'
  //       : 'rotateY(-80deg)';
  const opacity = index === currentIndex.value ? 1 : 0.6;

  return {
    transform: `translateX(${offset}px)`,
    opacity,
    transition: 'transform 0.6s ease, opacity 0.6s ease',
  };
};

// const onScroll = (event: WheelEvent) => {
//   const currentTime = new Date().getTime();
//   if (currentTime - lastScrollTime.value < scrollDelay) return;

//   if (event.deltaY > 0) {
//     currentIndex.value = (currentIndex.value + 1) % props.cards.length;
//   } else if (event.deltaY < 0) {
//     currentIndex.value =
//       (currentIndex.value - 1 + props.cards.length) % props.cards.length;
//   }

//   lastScrollTime.value = currentTime;
// };

const onCardClick = (index: number) => {
  currentIndex.value = index;
  emit('change', index);
};

onMounted(() => {
  //   window.addEventListener('wheel', onScroll);
  emit('change', currentIndex.value);
});
</script>

<style scoped lang="scss">
.carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100vw;
  overflow: hidden;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 400px;
}

.card {
  position: absolute;
  top: 0;
  left: 50%;
  width: 260px;
  height: 360px;
  margin-left: -130px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-size: 24px;
  text-align: center;
  transform-style: preserve-3d;
  transition:
    transform 0.6s ease,
    opacity 0.6s ease,
    border 0.3s ease;
  border-radius: 10px;
  cursor: pointer;
  border: 4px solid transparent;
  background-color: #50b0952b;
}

.focused {
  transform: perspective(400px) rotateY(0);
  @include pixel-borders(
    $corner-size: 2,
    $border-size: 2px,
    $border-color: #cd6e3f
  );
}
</style>
