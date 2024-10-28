<template>
  <div class="dungeon-map" :class="{ shake: props.shake }">
    <div v-for="(row, rowIndex) in dungeonMap" :key="rowIndex" class="row">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="cell"
        :class="[cell.cellType, cell.wallType]"
        :style="getCellStyle(cell)"
      />
    </div>

    <slot name="characters"></slot>
    <slot name="enemies"></slot>
    <slot name="overlay"></slot>
    <slot name="skills"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DungeonGenerator from '@/plugins/generators/dungeon';
import { useDungeonStore } from '@/stores/dungeon';
import { Cell } from '@/types';

const props = defineProps({
  seed: {
    type: String,
    required: true,
  },
  shake: {
    type: Boolean,
    required: false,
  },
  centerX: {
    type: Number,
    // required: true,
  },
  centerY: {
    type: Number,
    // required: true,
  },
});

const dungeonStore = useDungeonStore();
const dungeonMap = ref<Cell[][]>([]);
const spawnPoint = ref<{ x: number; y: number } | undefined>(undefined);
const randomPoints = ref<{ x: number; y: number }[] | undefined>(undefined);

const config = {
  rows: 31,
  cols: 51,
  maxRoomSize: 20,
  minRoomSize: 5,
  padding: 0,
  maxAttempts: 500,
  // rooms: 4,
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

const updateMapPosition = (centerX: number, centerY: number) => {
  const dungeonMapEl = document.querySelector('.dungeon-map') as HTMLElement;
  if (dungeonMapEl) {
    const offsetX = centerX;
    const offsetY = centerY;

    dungeonMapEl.style.setProperty('--translate-x', `-${offsetX}px`);
    dungeonMapEl.style.setProperty('--translate-y', `-${offsetY}px`);
  }
};

onMounted(() => {
  updateCellSize();
  const dungeonMapEl = document.querySelector('.dungeon-map') as HTMLElement;
  dungeonMapEl.style.setProperty('--cell-size', `${dungeonStore.cellSize}px`);

  dungeonMap.value = DungeonGenerator.generate(config /*, +props.seed */);
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

  if (props.centerX && props.centerY) {
    updateMapPosition(props.centerX, props.centerY);
  }
});

watch(
  [() => props.centerX, () => props.centerY],
  ([newCenterX, newCenterY]) => {
    if (props.centerX && props.centerY) {
      updateMapPosition(Number(newCenterX), Number(newCenterY));
    }
  }
);

const getCellStyle = (cell: Cell) => {
  if (cell.cellType === 'empty') {
    return { backgroundImage: `url(/src/assets/floor/${cell.floorImage})` };
  }
  return {};
};

// const getCellStyle = (cell: Cell) => {
//   if (cell.cellType === 'empty') {
//     return { backgroundImage: `url(/src/assets/floor/grass/${cell.floorImage})` };
//   }
//   return {};
// };
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
