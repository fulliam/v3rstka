<template>

  <Dungeon :seed="location">
    <template #characters>
      <Character
        :character="player.info.character"
        :action="player.state.action"
        :style="{
          position: 'absolute',
          left: `${player.state.position.x - (characterSize / 2)}px`,
          top: `${player.state.position.y - characterSize}px`,
          width: `${characterSize}px`,
          height: `${characterSize}px`,
          transform: direction ? 'scaleX(-1)' : ''
        }"
      />
    </template>

    <template #overlay>
        <Overlay
        :position="{x: player.state.position.x, y: player.state.position.y}"
    />
    </template>
  </Dungeon>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';
import Dungeon from '@/components/templates/dungeon/index.vue';
import Character from '@/components/templates/character/offline/index.vue';
import { useDungeonStore } from '@/stores/dungeon';
import { usePlayerStore } from '@/stores/player';
import { Position, Cell } from '@/types';
import useActions from '@/composables/actions';
import Overlay from '@/components/partials/overlay/index.vue';

const dungeonStore = useDungeonStore();
let characterSize: number = 50;
let dungeonMap: Cell[][] = [];

const playerStore = usePlayerStore();
const player = computed(() => playerStore.getPlayer);
const location = player.value?.info.location || '';

watch(
  () => dungeonStore.spawnPoint,
  (newSpawnPoint: Position) => {
    if (newSpawnPoint) {
      playerStore.updatePlayerPosition(newSpawnPoint, 'right');
    }
  },
  { immediate: true }
);

watch(
  () => dungeonStore.dungeon,
  (newDungeon) => {
    if (newDungeon) {
        dungeonMap = newDungeon;
    }
  },
  { immediate: true }
);

watch(
  () => dungeonStore.cellSize,
  (newCellSize) => {
    if (newCellSize) {
        characterSize = newCellSize * 2.25;
    }
  },
  { immediate: true }
);

const { keys } = useActions(false /* is offline */);
const direction = computed(() => player.value?.state.direction === 'left');
let animationFrame: number | null = null;

const handleMovement = () => {
  if (player.value.state.action === 'dead') return;

  let newPosition = { ...player.value.state.position };
  let direction: 'left' | 'right' = player.value.state.direction;

  const speedType = keys.value.ShiftLeft || keys.value.ShiftRight ? 'running' : 'walking';
  const speed = player.value.stats.speed[speedType] / 3;

  const getCellType = (x: number, y: number) =>
    dungeonMap[Math.floor(y / dungeonStore.cellSize)][
      Math.floor(x / dungeonStore.cellSize)
    ].cellType;

  const updatePosition = (
    deltaX: number,
    deltaY: number,
    newDirection: 'left' | 'right'
  ) => {
    const newX = newPosition.x + deltaX;
    const newY = newPosition.y + deltaY;

    if (getCellType(newX, newY) !== 'wall') {
      newPosition = { x: newX, y: newY };
      direction = newDirection;
    }
  };

  if (keys.value.ArrowUp) updatePosition(0, -speed, direction);
  if (keys.value.ArrowDown) updatePosition(0, speed, direction);
  if (keys.value.ArrowLeft) updatePosition(-speed, 0, 'left');
  if (keys.value.ArrowRight) updatePosition(speed, 0, 'right');

  playerStore.updatePlayerPosition(newPosition, direction);

  animationFrame = requestAnimationFrame(handleMovement);
};

const startMovement = () => {
  if (!animationFrame) {
    handleMovement();
  }
};

const stopMovement = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
};

watch(
  () => keys.value,
  (newKeys) => {
    if (
      newKeys.ArrowUp ||
      newKeys.ArrowDown ||
      newKeys.ArrowLeft ||
      newKeys.ArrowRight
    ) {
      startMovement();
    } else {
      stopMovement();
    }
  },
  { deep: true }
);

onMounted(() => {
  onBeforeUnmount(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
});
</script>
