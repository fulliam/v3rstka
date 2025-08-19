import { usePlayerStore } from '@/stores/player';
import { useDungeonStore } from '@/stores/dungeon';
import useActions from '@/composables/actions';
import type { Position, Direction } from '@/types';

export function useDungeonMovement() {
  const playerStore = usePlayerStore();
  const dungeonStore = useDungeonStore();
  const { keys, actionList } = useActions(false); // false for offline mode
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

    actionList.value.forEach((action: { name: string; key: string }) => {
      if (keys.value[action.key]) {
        if (action.name.includes('walk')) {
          if (action.name === 'walk up') updatePosition(0, -speed, 'up');
          if (action.name === 'walk down') updatePosition(0, speed, 'down');
          if (action.name === 'walk left') updatePosition(-speed, 0, 'left');
          if (action.name === 'walk right') updatePosition(speed, 0, 'right');
        }
        // Другие действия, такие как "run", можно добавить сюда
      }
    });

    playerStore.updatePlayerPosition(newPosition, direction);
    animationFrame.value = requestAnimationFrame(handleMovement);
  };

  watch(
    () => keys.value,
    (newKeys) => {
      const anyMovementKeyPressed = actionList.value.some(
        (action) => newKeys[action.key] && action.name.includes('walk')
      );
      if (anyMovementKeyPressed) {
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

export default useDungeonMovement;
