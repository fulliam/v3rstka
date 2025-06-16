<template>
  <div
    ref="miniMapContainer"
    class="mini-map"
  >
    <!-- Карта -->
    <div
      v-for="(row, rowIndex) in dungeonMap"
      :key="rowIndex"
      class="mini-map-row"
    >
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="mini-map-cell"
        :class="cell.cellType"
      ></div>
    </div>

    <!-- Игрок -->
    <div
      class="mini-map-player"
      :style="{
        transform: `translate(${playerPosition.x * scale}px, ${playerPosition.y * scale}px)`,
      }"
    ></div>

    <!-- Враги -->
    <div
      v-for="(enemy, index) in enemyPositions"
      :key="index"
      class="mini-map-enemy"
      :style="{
        transform: `translate(${enemy.x * scale}px, ${enemy.y * scale}px)`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { Cell, Position } from '@/types';

const props = defineProps({
  dungeonMap: {
    type: Array as PropType<Cell[][]>,
    required: true,
  },
  playerPosition: {
    type: Object as PropType<Position>,
    required: true,
  },
  enemyPositions: {
    type: Array as PropType<Position[]>,
    required: false,
    default: () => [],
  },
  cellSize: {
    type: Number,
    required: true,
  },
});

const scale = ref(1);
const miniMapContainer = ref<HTMLDivElement | null>(null);

const updateScale = () => {
  if (miniMapContainer.value && props.dungeonMap.length > 0) {
    const containerWidth = miniMapContainer.value.clientWidth;
    const containerHeight = miniMapContainer.value.clientHeight;
    console.log(containerWidth, containerHeight);
    const mapWidth = props.dungeonMap[0].length;
    const mapHeight = props.dungeonMap.length;

    scale.value =
      Math.min(
        containerWidth / (mapWidth * props.cellSize),
        containerHeight / (mapHeight * props.cellSize)
      ) * 2.2; // TODO: magic (2.2), find a better way
  }
};

onMounted(() => {
  // Initialize ResizeObserver to monitor the container size
  const resizeObserver = new ResizeObserver(updateScale);
  if (miniMapContainer.value) {
    resizeObserver.observe(miniMapContainer.value);
  }

  // Cleanup observer on unmount
  onBeforeUnmount(() => {
    if (miniMapContainer.value) {
      resizeObserver.unobserve(miniMapContainer.value);
    }
  });

  updateScale(); // Initial scale calculation
});
</script>

<style scoped lang="scss">
$primary-color: #c7c7c56d;

.mini-map {
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  grid-template-columns: repeat(auto-fill, auto);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  @include pixel-box(
    $corner-size: 2,
    $border-size: 2px,
    $background-color: $primary-color
  );

  opacity: 0.5;
}

.mini-map-row {
  display: flex;
}

.mini-map-cell {
  width: 100%;
  height: 100%;
}

.mini-map-cell.wall {
  background-color: #1f1f1f;
}

.mini-map-cell.empty {
  background-color: transparent;
}

/* Игрок */
.mini-map-player {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #09ff00da;
  z-index: 10;
}

/* Враг */
.mini-map-enemy {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ff00008d;
  border-radius: 50%;
  z-index: 9;
}
</style>
