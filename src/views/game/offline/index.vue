<template>
  <Dungeon :seed="location" :shake="shakeDungeon">
    <!-- :center-x="player.state.position.x / 2"
    :center-y="player.state.position.y / 2" -->
    <template #characters>
      <Player
        :character="player.info.character"
        :action="player.state.action"
        :style="{
          position: 'absolute',
          zIndex: Math.floor(player.state.position.y),
          left: `${player.state.position.x - characterSize / 2}px`,
          top: `${player.state.position.y - characterSize}px`,
          width: `${characterSize}px`,
          height: `${characterSize}px`,
          transform: direction ? 'scaleX(-1)' : '',
        }"
      />
    </template>

    <template #enemies>
      <Enemy
        v-for="(enemy, index) in enemies"
        :key="index"
        :character="enemy.info.character"
        :group="enemy.info.group"
        :action="enemy.state.action"
        :style="{
          position: 'absolute',
          zIndex: Math.floor(enemy.state.position.y),
          left: `${enemy.state.position.x - characterSize / 2}px`,
          top: `${enemy.state.position.y - characterSize}px`,
          width: `${characterSize}px`,
          height: `${characterSize}px`,
          transform: enemy.state.direction === 'left' ? 'scaleX(-1)' : '',
        }"
      />
    </template>

    <template #overlay>
      <svg
        width="100vw"
        height="100vh"
        style="position: absolute; z-index: 100000; pointer-events: none;"
      >
        <polyline
          v-if="path.length > 1"
          :points="getPolylinePoints()"
          fill="none"
          stroke="#50b0952b"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </template>

    <!-- <template #overlay>
      <Overlay
        :position="{ x: player.state.position.x, y: player.state.position.y }"
        style="z-index: 99999"
      />
    </template> -->

    <!-- <template #skills>
      <SkillBar />
    </template> -->
  </Dungeon>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';
import Dungeon from '@/components/templates/dungeon/index.vue';
import Player from '@/components/templates/character/offline/ally/index.vue';
import Enemy from '@/components/templates/character/offline/enemy/index.vue';
// import Overlay from '@/components/partials/overlay/index.vue';
// import SkillBar from '@/components/templates/skillbar/index.vue';
import { usePlayerMovement } from '@/composables/offline/ally/movement';
import { useEnemyAI } from '@/composables/offline/enemy';
import { useDungeonStore } from '@/stores/dungeon';
import { usePlayerStore } from '@/stores/player';
import { useEnemyStore } from '@/stores/enemy';
import { Position, Cell } from '@/types';
import { aStarPathfinding } from '@/composables/offline/enemy/utils/astar';

let characterSize: number = 50;

const dungeonStore = useDungeonStore();
let dungeonMap: Cell[][];
const shakeDungeon = ref<boolean>(false);

const playerStore = usePlayerStore();
playerStore.initializePlayer();
const player = computed(() => playerStore.getPlayer);
const direction = computed(() => player.value?.state.direction === 'left');

const enemyStore = useEnemyStore();
const enemies = computed(() => enemyStore.getEnemies);
let enemyGenerationInterval: NodeJS.Timeout | null = null;
const location = player.value?.info.location || '';

usePlayerMovement();
useEnemyAI();

const generateEnemies = (count: number) => {
  const randomPoints = dungeonStore.randomPoints;
  const maxEnemies = Math.min(count, randomPoints.length);
  const randomIndices = new Set<number>();

  while (randomIndices.size < maxEnemies) {
    const randomIndex = Math.floor(Math.random() * randomPoints.length);
    randomIndices.add(randomIndex);
  }

  randomIndices.forEach((index) => {
    const position = randomPoints[index];
    enemyStore.createEnemy();
    const enemyId = enemyStore.enemies[enemyStore.enemies.length - 1].id;
    enemyStore.updateEnemyPosition(enemyId, position);
  });
};

const startEnemyGeneration = () => {
  enemyGenerationInterval = setInterval(() => {
    const count = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    generateEnemies(count);
  }, 5000);
};

watch(
  () => dungeonStore.spawnPoint,
  (newSpawnPoint: Position) => {
    if (
      newSpawnPoint &&
      player.value.state.position.x === 0 &&
      player.value.state.position.y === 0
    ) {
      playerStore.updatePlayerPosition(newSpawnPoint, 'right');
    }
    // startEnemyGeneration();
    generateEnemies(1);
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

onMounted(() => {
  console.log('Game mounted');
});

onBeforeUnmount(() => {
  if (enemyGenerationInterval) {
    clearInterval(enemyGenerationInterval);
  }
});

const path = ref<Position[]>([]);

const generatePath = (start: Position, end: Position) => {
  if (dungeonMap) {
    path.value = aStarPathfinding(start, end, dungeonMap, dungeonStore.cellSize);
  }
};

watch(() =>[player.value.state.position, enemies?.value[0]?.state?.position], ([playerVal, enemyPos]) => {
  if (playerVal) {
    generatePath(playerVal, enemyPos);
  }
});

const getPolylinePoints = () => {
  return path.value
    .map(
      (point) =>
        `${point.x * dungeonStore.cellSize + dungeonStore.cellSize / 2},${point.y * dungeonStore.cellSize + dungeonStore.cellSize / 2}`
    )
    .join(' ') || '';
};
</script>
