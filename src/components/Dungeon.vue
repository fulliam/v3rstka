<template>
  <div class="dungeon-map">
    <div v-for="(row, rowIndex) in dungeonMap" :key="rowIndex" class="row">
      <div v-for="(cell, colIndex) in row" :key="colIndex" :class="cell.cellType"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DungeonGenerator from '../plugins/dungeonGenerator';
import { useDungeonStore } from '../stores/dungeon';

const dungeonStore = useDungeonStore();

type Cell = { cellType: 'wall' | 'empty' };
const dungeonMap = ref<Cell[][]>([]);
const spawnPoint = ref<{ x: number, y: number } | undefined>(undefined);

onMounted(() => {
    const config = {
        rows: 31,
        cols: 51,
        maxRoomSize: 7,
        minRoomSize: 3,
        padding: 0,
        maxAttempts: 500,
        rooms: 15
    };
    dungeonMap.value = DungeonGenerator.generate(config);
    spawnPoint.value = DungeonGenerator.getSpawnPoint();
    dungeonStore.setDungeon(dungeonMap.value);
    if (spawnPoint.value) {
        dungeonStore.setSpawnPoint(spawnPoint.value);
    }
});
</script>

<style scoped>
.dungeon-map {
  --cell-size: 20px; /* default cell size */
  display: grid;
  grid-template-columns: repeat(51, var(--cell-size)); /* Assuming 51 columns */
  grid-gap: 0px;
}
.row {
  display: contents;
}
.wall {
  background-color: #000;
  width: var(--cell-size);
  height: var(--cell-size);
}
.empty {
  background-color: #fff;
  width: var(--cell-size);
  height: var(--cell-size);
}
</style>
