<template>
  <div
    class="enemy"
    :style="{
      position: 'absolute',
      left: `${enemy.state.position.x - 25}px`,
      top: `${enemy.state.position.y - 50}px`,
    }"
  >
    <div class="enemy__health" :style="{}">
      <div
        class="enemy__health-inner"
        :style="{ width: healthPercentage + '%' }"
      >
        <span
          >{{ enemy.state.health.current }}/{{ enemy.state.health.max }}</span
        >
      </div>
    </div>

    <img
      class="enemy__img"
      :src="currentFrame"
      :style="direction ? 'transform: scaleX(-1)' : ''"
      alt="Enemy Animation Frame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import animations from '@/animations.json';

const props = defineProps({
  enemy: {
    type: Object,
    required: true,
  },
});

const frames = ref<string[]>([]);
const currentFrame = ref<string>('');
let animationFrameId: number | null = null;
let frameIndex = 0;

const preloadImages = (frameList: string[]) => {
  const promises = frameList.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image ${src}`));
    });
  });

  return Promise.all(promises);
};

const updateFrames = async () => {
  if (props.enemy.info.group) {
    frames.value = Object.values(
      (animations as any).char['enemy'][props.enemy.info.group][
        props.enemy.info.character
      ][props.enemy.state.action]
    );
  } else {
    frames.value = Object.values(
      (animations as any).char['enemy'][props.enemy.info.character][
        props.enemy.state.action
      ]
    );
  }

  await preloadImages(frames.value);
  currentFrame.value = frames.value[0];
  frameIndex = 0;
};

const startAnimation = () => {
  const frameDuration = 1000 / 10;
  const animate = () => {
    frameIndex = (frameIndex + 1) % frames.value.length;
    currentFrame.value = frames.value[frameIndex];

    setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, frameDuration);
  };

  animationFrameId = requestAnimationFrame(animate);
};

const direction = computed(() => props.enemy.state.direction === 'left');

const healthPercentage = computed(() => {
  return Math.floor(
    (props.enemy.state.health.current / props.enemy.state.health.max) * 100
  );
});

const handleEnemyBehavior = () => {
  // Example of simple AI behavior
  if (props.enemy.state.action === 'idle') {
    // Implement idle behavior
  } else if (props.enemy.state.action === 'attack') {
    // Implement attack behavior
  }
  // More behaviors can be added here
  requestAnimationFrame(handleEnemyBehavior);
};

onMounted(async () => {
  updateFrames();
  startAnimation();
  requestAnimationFrame(handleEnemyBehavior);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped lang="scss">
.enemy {
  position: absolute;
  display: block;
  z-index: 999;

  &__img {
    width: 50px;
    height: auto;
  }

  &__health {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 5px;
    background: linear-gradient(
      to bottom,
      rgba(82, 5, 5, 0.55) 18%,
      rgba(240, 0, 0, 0.55) 100%
    );
    border: 1px solid black;
    border-radius: 7px;
    overflow: hidden;

    &-inner {
      height: 100%;
      width: 100%;
      border-radius: 7px;
      border: 1px solid black;
      border-left: none;
      background: linear-gradient(
        to bottom,
        rgb(60, 92, 56) 18%,
        rgb(2, 189, 2) 100%
      );
      text-align: left;
      position: relative;
      top: -1px;
      display: flex;

      span {
        margin-left: 2px;
        font-size: 4px;
        position: relative;
        top: -0.7px;
      }
    }
  }
}
</style>
