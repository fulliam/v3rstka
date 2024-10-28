import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useDungeonStore } from '@/stores/dungeon';
import useActions from '@/composables/actions';
import type { Position, Direction } from '@/types';

export function usePlayerMovement() {
  const playerStore = usePlayerStore();
  const dungeonStore = useDungeonStore();
  const { keys } = useActions(false); // false for offline mode
  const animationFrame = ref<number | null>(null);

  const player = computed(() => playerStore.getPlayer);

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

    const updatePosition = (
      deltaX: number,
      deltaY: number,
      newDirection: Direction
    ) => {
      const newX = newPosition.x + deltaX;
      const newY = newPosition.y + deltaY;

      const cellType = dungeonStore.getCellType(newX, newY);

      if (cellType !== 'wall') {
        newPosition = { x: newX, y: newY };
        direction = newDirection;
      }
    };

    if (keys.value.ArrowUp) updatePosition(0, -speed, direction);
    if (keys.value.ArrowDown) updatePosition(0, speed, direction);
    if (keys.value.ArrowLeft) updatePosition(-speed, 0, 'left');
    if (keys.value.ArrowRight) updatePosition(speed, 0, 'right');

    playerStore.updatePlayerPosition(newPosition, direction);
    animationFrame.value = requestAnimationFrame(handleMovement);
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
      if (animationFrame.value) cancelAnimationFrame(animationFrame.value);
    });
  });
}
