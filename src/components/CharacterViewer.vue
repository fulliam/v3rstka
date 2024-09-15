<template>
  <div
    class="character"
    :style="{
      position: 'absolute',
      left: `${props.character.state.position.x - 25}px`,
      top: `${props.character.state.position.y - 50}px`,
    }"
  >
    <div class="character__health" :style="{}">
      <div
        class="character__health-inner"
        :style="{ width: healthPercentage + '%' }"
      >
        <!-- <span>{{ props.character.state.health.max }}/{{ props.character.state.health.current }}</span> -->
      </div>
    </div>
    
    <img
      class="character__img"
      :src="currentFrame"
      :style="direction ? 'transform: scaleX(-1)' : ''"
      alt="Character Animation Frame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useSocketStore } from '@/stores/socket';
import { useDungeonStore } from '@/stores/dungeon';
import useActions from '@/composables/actions';
import animations from '@/animations.json';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  isOwn: {
    type: Boolean,
    required: true,
  },
  character: {
    type: Object,
    required: true,
  },
});

const socketStore = useSocketStore();
const dungeonStore = useDungeonStore();
const dungeonMap = dungeonStore.dungeon;
const spawnPoint = dungeonStore.spawnPoint;
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
  frames.value = Object.values(
    (animations as any).char[props.character.info.category][
      props.character.info.character
    ][props.character.state.action]
  );
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

const direction = computed(() => props.character.state.direction === 'left');

const healthPercentage = computed(() => {
  return Math.floor(
    (props.character.state.health.max / props.character.state.health.current) *
      100
  );
});

const { keys /*, addActionMapping */ } = useActions(
  props.userId,
  props.isOwn,
  props.character
);

// addActionMapping('KeyV', 'specialMove'); // Example of adding a new action

const handleMovement = () => {
  if (!props.isOwn) return;

  let newPosition = { ...props.character.state.position };
  let direction: 'left' | 'right' = props.character.state.direction;

  const speedType =
    keys.value.ShiftLeft || keys.value.ShiftRight ? 'running' : 'walking';
  const speed = props.character.stats.speed[speedType];

  if (keys.value.ArrowUp) {
    const newY = newPosition.y - speed / 3;
    if (
      dungeonMap[Math.floor(newY / 20)][Math.floor(newPosition.x / 20)]
        .cellType !== 'wall'
    ) {
      newPosition.y = newY;
    }
  }
  if (keys.value.ArrowDown) {
    const newY = newPosition.y + speed / 3;
    if (
      dungeonMap[Math.floor(newY / 20)][Math.floor(newPosition.x / 20)]
        .cellType !== 'wall'
    ) {
      newPosition.y = newY;
    }
  }
  if (keys.value.ArrowLeft) {
    const newX = newPosition.x - speed / 3;
    if (
      dungeonMap[Math.floor(newPosition.y / 20)][Math.floor(newX / 20)]
        .cellType !== 'wall'
    ) {
      newPosition.x = newX;
      direction = 'left';
    }
  }
  if (keys.value.ArrowRight) {
    const newX = newPosition.x + speed / 3;
    if (
      dungeonMap[Math.floor(newPosition.y / 20)][Math.floor(newX / 20)]
        .cellType !== 'wall'
    ) {
      newPosition.x = newX;
      direction = 'right';
    }
  }

  socketStore.updateUserPosition(props.userId, newPosition, direction);
  requestAnimationFrame(handleMovement);
};

const setSpawnPoint = () => {
  if (
    props.character.state.position.x === 0 &&
    props.character.state.position.y === 0
  ) {
    socketStore.updateUserPosition(props.userId, spawnPoint, 'right');
  }
};

watch(
  () => props.character.info.character,
  updateFrames,
  { deep: true }
);

watch(
  () => props.character.state.action,
  updateFrames,
  { deep: true }
);

onMounted(async () => {
  setTimeout(() => {
    setSpawnPoint();
  }, 150);

  updateFrames();
  startAnimation();
  requestAnimationFrame(handleMovement);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped lang="scss">
.character {
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
