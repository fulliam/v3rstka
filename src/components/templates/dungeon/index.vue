<template>
  <div class="dungeon-map">
    <div v-for="(row, rowIndex) in dungeonMap" :key="rowIndex" class="row">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="cell"
        :class="[cell.cellType, cell.wallType]"
        :style="getCellStyle(cell)"
      ></div>
    </div>

    <slot name="characters"></slot>
    <slot name="enemies"></slot>
    <slot name="overlay"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DungeonGenerator from '@/plugins/generators/dungeon';
import { useDungeonStore } from '@/stores/dungeon';
import { Cell } from '@/types';

const props = defineProps({
  seed: {
    type: String,
    required: true,
  },
});

const dungeonStore = useDungeonStore();
const dungeonMap = ref<Cell[][]>([]);
const spawnPoint = ref<{ x: number; y: number } | undefined>(undefined);
const randomPoints = ref<{ x: number; y: number }[] | undefined>(undefined);

const config = {
  rows: 31,
  cols: 51,
  maxRoomSize: 4,
  minRoomSize: 1,
  padding: 0,
  maxAttempts: 500,
  rooms: 4,
};

const updateCellSize = () => {
  const dungeonMapEl = document.querySelector('.dungeon-map') as HTMLElement;
  if (dungeonMapEl) {
    const { innerWidth, innerHeight } = window;
    const cellWidth = innerWidth / config.cols;
    const cellHeight = innerHeight / config.rows;

    const cellSize = Math.min(cellWidth, cellHeight);
    dungeonStore.cellSize = cellSize;

    dungeonMapEl.style.setProperty('--cell-size', `${cellSize}px`);
    dungeonMapEl.style.setProperty(
      'grid-template-columns',
      `repeat(${config.cols}, ${cellSize}px)`
    );
  }
};

onMounted(() => {
  updateCellSize();

dungeonMap.value = DungeonGenerator.generate(config, /* +props.seed */);
  spawnPoint.value = DungeonGenerator.getRandomPoints(
    dungeonMap.value,
    1,
    dungeonStore.cellSize
  )[0];
  randomPoints.value = DungeonGenerator.getRandomPoints(
    dungeonMap.value,
    20,
    dungeonStore.cellSize
  );

  dungeonStore.setDungeon(dungeonMap.value);

  if (spawnPoint.value) {
    dungeonStore.setSpawnPoint(spawnPoint.value);
  }

  if (randomPoints.value.length > 0) {
    dungeonStore.setRandomPoints(randomPoints.value);
  }

});

const getCellStyle = (cell: Cell) => {
  if (cell.cellType === 'empty') {
    return { backgroundImage: `url(/src/assets/floor/${cell.floorImage})` };
  }
  return {};
};
</script>

<style scoped>
.dungeon-map {
  --cell-size: 20px;
  display: grid;
  grid-template-rows: repeat(auto-fill, var(--cell-size));
  grid-template-columns: repeat(auto-fill, var(--cell-size));
  grid-gap: 0px;
  padding: 0;
  margin: 0;
  border: none;
  position: relative;
  width: 100%;
  height: 100vh;
  align-self: center;
}
.row {
  display: contents;
}
.wall {
  background-color: #0e1219;
  width: var(--cell-size);
  height: var(--cell-size);
}
.empty {
  width: var(--cell-size);
  height: var(--cell-size);
}
.cell {
  background-size: cover;
}
.topWall {
  background-image: url('/src/assets/wall/bottomWall.png');
}

.bottomWall {
  background-image: url('/src/assets/wall/topWall.png');
}

.leftWall {
  background-image: url('/src/assets/wall/rightWall.png');
}

.rightWall {
  background-image: url('/src/assets/wall/leftWall.png');
}

.crossWall {
  background-color: #544751;
  background-image: url('/src/assets/wall/crossWall.png');
}

.cornerTopLeft {
  background-color: #544751;
  background-image: url('/src/assets/wall/bottomRightCorner.png');
}

.cornerTopRight {
  background-color: #544751;
  background-image: url('/src/assets/wall/bottomLeftCorner.png');
}

.cornerBottomLeft {
  background-color: #544751;
  background-image: url('/src/assets/wall/rightTopCorner.png');
}

.cornerBottomRight {
  background-color: #544751;
  background-image: url('/src/assets/wall/leftTopCorner.png');
}

.horizontalWall {
  background-image: url('/src/assets/wall/crossVerticalWall.png');
}

.verticalWall {
  background-image: url('/src/assets/wall/crossVerticalWall.png');
  rotate: 90deg;
}

.horizontalEndTop {
  background-image: url('/src/assets/wall/crossVerticalEnd.png');
}

.horizontalEndBottom {
  background-image: url('/src/assets/wall/crossVerticalEnd.png');
  rotate: 180deg;
}

.verticalEndRight {
  background-image: url('/src/assets/wall/crossVerticalEnd.png');
  rotate: 90deg;
}

.verticalEndLeft {
  background-image: url('/src/assets/wall/crossVerticalEnd.png');
  rotate: -90deg;
}

.verticalEndBottom {
  background-image: url('/src/assets/wall/crossVerticalEnd.png');
  rotate: -90deg;
}

.innerCornerTopLeft {
  background-image: url('/src/assets/wall/innerRightBottomCorner.png');
}

.innerCornerBottomLeft {
  background-image: url('/src/assets/wall/rightWall.png');
}

.innerCornerTopRight {
  background-image: url('/src/assets/wall/innerLeftBottomCorner.png');
}

.innerCornerBottomRight {
  background-image: url('/src/assets/wall/leftWall.png');
}
</style>
