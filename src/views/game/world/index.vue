<template>
  <World
    ref="world"
    :scenes="actsData['ActI']"
  >
    <template #character>
      <Player
        :character="player.info.character"
        :action="player.state.action"
        :style="characterStyle"
      />
    </template>
  </World>
</template>

<script setup lang="ts">
import World from '@/components/templates/world/index.vue';
import { actsData } from './assets';
import Player from '@/components/templates/character/offline/ally/index.vue';
import { usePlayerStore } from '@/stores/player';
import useActions from '@/composables/actions';
import type { Position, Direction } from '@/types';

const world = ref<InstanceType<typeof World> | null>();

const moveBackground = (direction: 'left' | 'right', speed: number) => {
  world.value?.moveBackground(direction, speed);
};

const playerStore = usePlayerStore();
playerStore.initializePlayer();
const player = computed(() => playerStore.getPlayer);
const direction = computed(() => player.value?.state.direction === 'left');
let characterSize: number = 500;
const { keys, actionList } = useActions(false);
const animationFrame = ref<number | null>(null);

const screenScale = computed(() => {
  const baseWidth = 1920; // Базовая ширина, от которой вы хотите масштабировать
  const baseHeight = 1080; // Базовая высота
  const widthScale = window.innerWidth / baseWidth;
  const heightScale = window.innerHeight / baseHeight;
  return Math.min(widthScale, heightScale); // Минимальный масштаб для сохранения пропорций
});

const characterStyle = computed(() => {
  const scale = screenScale.value;
  return {
    position: 'fixed',
    zIndex: 9999,
    width: `${characterSize * scale}px`,
    height: `${characterSize * scale}px`,
    transform: `${direction.value ? 'scaleX(-1)' : ''}`,
    top: `${characterSize}px`,
    left: `${characterSize * scale}px`,
  };
});

const startMovement = () => {
  if (!animationFrame.value) {
    handleMovement();
  }
};

const stopMovement = () => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = null;
  }
};

const handleMovement = () => {
  if (player.value.state.action === 'dead') return;

  let newPosition: Position = { ...player.value.state.position };
  let direction: Direction = player.value.state.direction;

  const speedType =
    keys.value.ShiftLeft || keys.value.ShiftRight ? 'running' : 'walking';
  const speed = player.value.stats.speed[speedType] / 3;
  moveBackground(direction, speed);
  const updatePosition = (deltaX: number, newDirection: Direction) => {
    const newX = newPosition.x + deltaX;
    newPosition = { x: newX, y: newPosition.y };
    direction = newDirection;
  };

  actionList.value.forEach((action: { name: string; key: string }) => {
    if (keys.value[action.key]) {
      if (action.name.includes('walk')) {
        if (action.name === 'walk left') updatePosition(-speed, 'left');
        if (action.name === 'walk right') updatePosition(speed, 'right');
      }
      // Другие действия, такие как "run", можно добавить сюда
    }
  });

  playerStore.updatePlayerPosition(newPosition, direction);
  animationFrame.value = requestAnimationFrame(handleMovement);
};

watch(
  () => keys.value,
  (newKeys) => {
    const anyMovementKeyPressed = actionList.value.some(
      (action) => newKeys[action.key] && action.name.includes('walk')
    );
    if (anyMovementKeyPressed) {
      startMovement();
    } else {
      stopMovement();
    }
  },
  { deep: true }
);

onMounted(() => {
  onBeforeUnmount(() => {
    if (animationFrame.value) cancelAnimationFrame(animationFrame.value);
  });
});
</script>

<style scoped lang="scss"></style>
