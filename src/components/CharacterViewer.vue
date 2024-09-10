<template>
  <div 
    class="character" 
    :style="{
      position: 'absolute', 
      left: `${props.character.state.position.x - 25}px`, 
      top: `${props.character.state.position.y - 50}px`,
    }"
  >
    <div
      class="character__health"
      :style="{}"
    >
    
      <div class="character__health-inner" :style="{width: healthPercentage + '%'}">
        <!-- <span>{{ props.character.state.health.max }}/{{ props.character.state.health.current }}</span> -->
      </div>
    </div>
    <img 
      class="character__img"
      :src="currentFrame" 
      :style="direction ? 'transform: scaleX(-1)' : ''"
      alt="Character Animation Frame"
    />
  </div>
  {{props.character}}
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSocketStore } from '@/stores/socket';
import { useDungeonStore } from '@/stores/dungeon';
import useAnimation from '@/composables/animation';
import useActions from '@/composables/actions';

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

const { currentFrame, direction } = useAnimation(props.character);
const socketStore = useSocketStore();
const dungeonStore = useDungeonStore();
const dungeonMap = dungeonStore.dungeon;
const spawnPoint = dungeonStore.spawnPoint;

const healthPercentage = computed(() => {
  return Math.floor(props.character.state.health.max / props.character.state.health.current * 100);
});

const { keys, addActionMapping } = useActions(props.userId, props.isOwn, props.character);

// addActionMapping('KeyV', 'specialMove'); // Example of adding a new action

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

const setSpawnPoint = () => {
  if (!props.character.state.position || (props.character.state.position.x === 0 && props.character.state.position.y === 0)) {
    socketStore.updateUserPosition(props.userId, spawnPoint, 'right');
  }
};

onMounted(() => {
  setSpawnPoint();
  requestAnimationFrame(handleMovement);
});
</script>

<style scoped lang="scss">
.character {
  position: absolute;
  display: block;
  z-index: 999;

  &__img {
    width: 50px;
    height: auto;
  }

  &__health {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 5px;
    background: linear-gradient(to bottom,
        rgba(82, 5, 5, 0.55) 18%, rgba(240, 0, 0, 0.55) 100%);
    border: 1px solid black;
    border-radius: 7px;
    overflow: hidden;

    &-inner {
      height: 100%;
      width: 100%;
      border-radius: 7px;
      border: 1px solid black;
      border-left: none;
      background: linear-gradient(to bottom,
          rgb(60, 92, 56) 18%, rgb(2, 189, 2) 100%);
      text-align: left;
      position: relative;
      top: -1px;
    }
  }
}
</style>
