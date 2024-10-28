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
import { ref, computed, watch } from 'vue';
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
const location = player.value?.info.location || '';

usePlayerMovement();
useEnemyAI();

const generateEnemies = (enemyCount: number) => {
  enemyStore.clearEnemies();
  const randomPoints = dungeonStore.randomPoints;

  const maxEnemies = Math.min(enemyCount, randomPoints.length);

  const randomIndices = new Set<number>();

  while (randomIndices.size < maxEnemies) {
    const randomIndex = Math.floor(Math.random() * randomPoints.length);
    randomIndices.add(randomIndex);
  }

  randomIndices.forEach((index) => {
    const position = randomPoints[index];
    // enemyStore.createEnemy('slimes', 'green');
    enemyStore.createEnemy();
    const enemyId = enemyStore.enemies[enemyStore.enemies.length - 1].id;
    enemyStore.updateEnemyPosition(enemyId, position);
  });
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
    generateEnemies(3);
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
</script>
