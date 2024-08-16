<template>
  <div class="dungeon-map">
    <div 
      v-for="(row, rowIndex) in dungeonMap" 
      :key="rowIndex" 
      class="row"
    >
      <div 
        v-for="(cell, colIndex) in row" 
        :key="colIndex" 
        :class="[cell.cellType, cell.wallType]" 
        :style="getCellStyle(cell)"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DungeonGenerator from '../plugins/dungeonGenerator';
import { useDungeonStore } from '../stores/dungeon';

const dungeonStore = useDungeonStore();

type Cell = { cellType: 'wall' | 'empty', wallType?: string, floorImage?: string };
const dungeonMap = ref<Cell[][]>([]);
const spawnPoint = ref<{ x: number, y: number } | undefined>(undefined);

onMounted(() => {
    const config = {
        rows: 31,
        cols: 51,
        maxRoomSize: 20,
        minRoomSize: 5,
        padding: 0,
        maxAttempts: 500,
        rooms: 50
    };
    // const seed = 12345;
    dungeonMap.value = DungeonGenerator.generate(config /*, seed*/);
    spawnPoint.value = DungeonGenerator.getSpawnPoint();
    dungeonStore.setDungeon(dungeonMap.value);
    if (spawnPoint.value) {
      dungeonStore.setSpawnPoint(spawnPoint.value);
    }
});

const getCellStyle = (cell: Cell) => {
  if (cell.cellType === 'empty') {
    return { backgroundImage: `url(/src/assets/${cell.floorImage})` };
  }
  return {};
};
</script>

<style scoped>
.dungeon-map {
  --cell-size: 20px;
  display: grid;
  grid-template-columns: repeat(51, var(--cell-size));
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
  width: var(--cell-size);
  height: var(--cell-size);
}

.topWall {
  background-color: #8B0000;
}

.bottomWall {
  background-color: #FF4500;
}

.leftWall {
  background-color: #2E8B57;
}

.rightWall {
  background-color: #4682B4;
}

.cornerTopLeft {
  background-color: #FF6347;
}

.cornerTopRight {
  background-color: #FFD700;
}

.cornerBottomLeft {
  background-color: #8A2BE2;
}

.cornerBottomRight {
  background-color: #DAA520;
}
</style>
