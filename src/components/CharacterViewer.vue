<template>
  <div 
    class="character" 
    :style="{
      position: 'relative', 
      left: `${props.character.state.position.x - 25}px`, 
      top: `${props.character.state.position.y + 10}px`,
    }"
  >
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
import animations from '@/animations.json';
import { useDungeonStore } from '@/stores/dungeon';

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
let frameIndex = 0;
let animationFrameId: number | null = null;

const preloadImages = (frameList: string[]) => {
  const promises = frameList.map(src => {
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
  frames.value = Object.values((animations as any).char[props.character.info.category][props.character.info.character][props.character.state.action]);
  await preloadImages(frames.value);
  currentFrame.value = frames.value[0];
  frameIndex = 0;
};

const startAnimation = () => {
  const frameDuration = 1000 / 10; // 10 fps

  const animate = () => {
    frameIndex = (frameIndex + 1) % frames.value.length;
    currentFrame.value = frames.value[frameIndex];
    setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, frameDuration);
  };

  animationFrameId = requestAnimationFrame(animate);
};

const startAction = (action: string) => {
  socketStore.updateUserAction(props.userId, props.character.info.character, action);
};

const stopAction = () => {
  socketStore.updateUserAction(props.userId, props.character.info.character, 'idle');
};

const direction = computed(() => {
  return props.character.state.direction === 'left';
});

const keys = ref<{ [key: string]: boolean }>({
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  ShiftLeft: false,
  ShiftRight: false,
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.isOwn) return;

  if (keys.value.hasOwnProperty(event.code)) {
    keys.value[event.code] = true;
  }

  const actionMap: { [key: string]: string } = {
    KeyZ: 'attack',
    KeyX: 'attack2',
    KeyC: 'attack3', 
    ArrowRight: 'walk',
    ArrowLeft: 'walk',
    ArrowUp: 'walk',
    ArrowDown: 'walk',
    Space: 'jump',
  };

  let action = actionMap[event.code];

  if (action) {
    if ((keys.value.ShiftLeft || keys.value.ShiftRight) && ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
      action = 'run';
    }
    startAction(action);
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (!props.isOwn) return;

  if (keys.value.hasOwnProperty(event.code)) {
    keys.value[event.code] = false;
  }

  if (!Object.values(keys.value).some(key => key)) {
    stopAction();
  } else {
    if (keys.value.ArrowUp || keys.value.ArrowDown || keys.value.ArrowLeft || keys.value.ArrowRight) {
      const action = (keys.value.ShiftLeft || keys.value.ShiftRight) ? 'run' : 'walk';
      startAction(action);
    }
  }
};

const handleMovement = () => {
  if (!props.isOwn) return;

  let newPosition = { ...props.character.state.position };
  let direction: 'left' | 'right' = props.character.state.direction;

  const speedType = (keys.value.ShiftLeft || keys.value.ShiftRight) ? 'running' : 'walking';
  const speed = props.character.stats.speed[speedType];

  if (keys.value.ArrowUp) {
    const newY = newPosition.y - (speed / 3);
    if (dungeonMap[Math.floor(newY / 20)][Math.floor(newPosition.x / 20)].cellType !== 'wall') {
      newPosition.y = newY;
    }
  }
  if (keys.value.ArrowDown) {
    const newY = newPosition.y + (speed / 3);
    if (dungeonMap[Math.floor(newY / 20)][Math.floor(newPosition.x / 20)].cellType !== 'wall') {
      newPosition.y = newY;
    }
  }
  if (keys.value.ArrowLeft) {
    const newX = newPosition.x - (speed / 3);
    if (dungeonMap[Math.floor(newPosition.y / 20)][Math.floor(newX / 20)].cellType !== 'wall') {
      newPosition.x = newX;
      direction = 'left';
    }
  }
  if (keys.value.ArrowRight) {
    const newX = newPosition.x + (speed / 3);
    if (dungeonMap[Math.floor(newPosition.y / 20)][Math.floor(newX / 20)].cellType !== 'wall') {
      newPosition.x = newX;
      direction = 'right';
    }
  }

  socketStore.updateUserPosition(props.userId, newPosition, direction);

  requestAnimationFrame(handleMovement);
};

watch(() => props.character.info.character, () => {
  updateFrames();
});

watch(() => props.character.state.action, () => {
  updateFrames();
});

onMounted(() => {
  socketStore.updateUserPosition(props.userId, spawnPoint, 'right');
  updateFrames();
  startAnimation();
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  requestAnimationFrame(handleMovement);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>

<style scoped lang="scss">
.character {
  position: absolute;
  display: block;

  &__img {
    width: 50px;
    height: auto;
  }
}
</style>
