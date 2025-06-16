<template>
  <div class="act-container" :style="containerStyle">
    <slot name="decorations" :scene="styledScenes"></slot>
    <slot name="enemy" :scene="styledScenes"></slot>
    <slot name="currencies" :scene="styledScenes"></slot>
    <slot name="character" :scene="styledScenes"></slot>

    <div
      v-for="(styledScene, index) in styledScenes"
      :key="`scene-container-${index}`"
      class="act-scene-container"
    >
      <slot :index="index">
        <div
          v-for="(styledPart, i) in styledScene"
          :key="`part-${index}-${i}`"
          :class="['bg-part', styledPart.class]"
          :style="styledPart.style"
        >
          <img :src="styledPart.src" :alt="styledPart.alt || ' '" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

type ScenePart = {
  src: string;
  alt?: string;
  class?: string;
  style?: Record<string, string>;
  parallaxSpeed?: number;
};

type Scene = ScenePart[];

const props = defineProps({
  scenes: {
    type: Array as () => Scene[],
    default: () => [],
  },
});

const backgroundPositionX = ref(0);
const pageWidth = ref(window.innerWidth);
const pageHeight = ref(window.innerHeight);

// const screenScale = computed(() => {
//   const baseWidth = 1920; // Базовая ширина, от которой вы хотите масштабировать
//   const baseHeight = 1080; // Базовая высота
//   const widthScale = window.innerWidth / baseWidth;
//   const heightScale = window.innerHeight / baseHeight;
//   return Math.min(widthScale, heightScale); // Минимальный масштаб для сохранения пропорций
// });

const styledScenes = computed(() =>
  props.scenes.map((scene) =>
    scene.map((part) => {
      const newStyle = { ...part.style };
      if (part.parallaxSpeed) {
        newStyle.transform = `translateX(${backgroundPositionX.value * part.parallaxSpeed}px)`;
      }
      return {
        ...part,
        style: newStyle,
      };
    })
  )
);

const containerStyle = computed(() => {
  return {
    width: `${props.scenes.length * 100}vw`,
    height: `100vh`,
  };
});

function updatePageSize() {
  pageWidth.value = window.innerWidth;
  pageHeight.value = window.innerHeight;
}

function moveBackground(direction: 'left' | 'right', speed: number) {
  if (direction === 'right') {
    backgroundPositionX.value = Math.max(
      backgroundPositionX.value - speed,
      -pageWidth.value * (props.scenes.length - 1)
    );
  } else if (direction === 'left') {
    backgroundPositionX.value = Math.min(backgroundPositionX.value + speed, 0);
  }
}

onMounted(() => {
  window.addEventListener('resize', updatePageSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePageSize);
});

watch(
  () => props.scenes,
  () => {
    backgroundPositionX.value = 0;
  },
  { immediate: true }
);

defineExpose({ moveBackground });
</script>

<style scoped lang="scss">
.act-container {
  display: flex;
  align-self: center;
}

.act-scene-container {
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: top left;
}

.bg-part {
  position: absolute;
  margin: 0;

  &.firefly-animation {
    animation: fadeInOut 3s ease-in-out infinite;
  }
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
