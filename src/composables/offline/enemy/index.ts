import { ref, onMounted, onUnmounted } from 'vue';
import { useEnemyStore } from '@/stores/enemy';
import { useDungeonStore } from '@/stores/dungeon';
import { usePlayerStore } from '@/stores/player';
import type { Position } from '@/types';

const randomDirection = () => {
  const directions = [
    'left',
    'right',
    'up',
    'down',
    'up-left',
    'up-right',
    'down-left',
    'down-right',
  ];
  return directions[Math.floor(Math.random() * directions.length)];
};

const randomAction = () => {
  const actions = ['walk', 'idle', 'run'];
  return actions[Math.floor(Math.random() * actions.length)];
};

const randomInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function useEnemyAI() {
  const enemyStore = useEnemyStore();
  const dungeonStore = useDungeonStore();
  const playerStore = usePlayerStore();
  const animationFrame = ref<number | null>(null);
  const lastActionChangeTime = ref<Record<string, number>>({});
  const actionChangeIntervals = ref<Record<string, number>>({});
  const lastMovementDirection = ref<Record<string, string>>({});

  const isPlayerInSight = (
    enemyPosition: Position,
    playerPosition: Position,
    range: number
  ) => {
    const dx = playerPosition.x - enemyPosition.x;
    const dy = playerPosition.y - enemyPosition.y;
    return Math.sqrt(dx * dx + dy * dy) <= range;
  };

  const moveEnemy = (
    enemyId: string,
    currentPosition: Position,
    speed: number,
    targetPosition?: Position
  ) => {
    let newPosition: Position = { ...currentPosition };
    let hitWall = false;
    let movementDirection =
      lastMovementDirection.value[enemyId] || randomDirection();

    const checkWallAhead = (direction: string) => {
      let futureX = newPosition.x;
      let futureY = newPosition.y;

      switch (direction) {
        case 'left':
          futureX -= 20;
          break;
        case 'right':
          futureX += 20;
          break;
        case 'up':
          futureY -= 20;
          break;
        case 'down':
          futureY += 20;
          break;
        case 'up-left':
          futureX -= 20;
          futureY -= 20;
          break;
        case 'up-right':
          futureX += 20;
          futureY -= 20;
          break;
        case 'down-left':
          futureX -= 20;
          futureY += 20;
          break;
        case 'down-right':
          futureX += 20;
          futureY += 20;
          break;
      }

      return dungeonStore.getCellType(futureX, futureY) === 'wall';
    };

    if (targetPosition) {
      const dx = targetPosition.x - currentPosition.x;
      const dy = targetPosition.y - currentPosition.y;
      const angle = Math.atan2(dy, dx);
      newPosition.x += Math.cos(angle) * speed;
      newPosition.y += Math.sin(angle) * speed;

      const cellType = dungeonStore.getCellType(newPosition.x, newPosition.y);
      if (cellType === 'wall') hitWall = true;
    } else {
      if (checkWallAhead(movementDirection)) {
        lastMovementDirection.value[enemyId] = randomDirection();
        return {
          newPosition,
          movementDirection: lastMovementDirection.value[enemyId],
          hitWall: true,
        };
      }
    }

    if (!hitWall) {
      enemyStore.updateEnemyPosition(enemyId, newPosition);
      lastMovementDirection.value[enemyId] = movementDirection;
    }

    return { newPosition, movementDirection, hitWall };
  };

  const updateEnemies = () => {
    const currentTime = Date.now();
    const playerPosition = playerStore.getPlayerState.position;

    enemyStore.getEnemies.forEach((enemy) => {
      let { position, direction, action } = enemy.state;
      const speed = action === 'run' ? 1.5 : 1;

      if (!actionChangeIntervals.value[enemy.id]) {
        actionChangeIntervals.value[enemy.id] = randomInterval(500, 5000);
        lastActionChangeTime.value[enemy.id] = currentTime;
      }

      if (
        currentTime - lastActionChangeTime.value[enemy.id] >
        actionChangeIntervals.value[enemy.id]
      ) {
        action = randomAction();
        lastActionChangeTime.value[enemy.id] = currentTime;
        enemyStore.updateEnemyAction(enemy.id, action);

        actionChangeIntervals.value[enemy.id] = randomInterval(2000, 5000);
      }

      if (isPlayerInSight(position, playerPosition, 300)) {
        action = 'run';
        if (enemy.state.action !== action) {
          enemyStore.updateEnemyAction(enemy.id, action);
        }

        const { newPosition, movementDirection, hitWall } = moveEnemy(
          enemy.id,
          position,
          1.5,
          playerPosition
        );

        if (hitWall) {
          lastMovementDirection.value[enemy.id] = randomDirection();
        }

        enemyStore.updateEnemyPosition(enemy.id, newPosition);

        const visualDirection = movementDirection.includes('left')
          ? 'left'
          : movementDirection.includes('right')
            ? 'right'
            : direction;
        enemyStore.updateEnemyDirection(enemy.id, visualDirection);

        if (isPlayerInSight(position, playerPosition, 10)) {
          action = 'attack';

          if (enemy.state.action !== action) {
            enemyStore.updateEnemyAction(enemy.id, action);
          }
        }
      } else if (action === 'walk' || action === 'run') {
        const { newPosition, movementDirection, hitWall } = moveEnemy(
          enemy.id,
          position,
          speed
        );

        if (hitWall) {
          lastMovementDirection.value[enemy.id] = randomDirection();
        }

        enemyStore.updateEnemyPosition(enemy.id, newPosition);

        const visualDirection = movementDirection.includes('left')
          ? 'left'
          : movementDirection.includes('right')
            ? 'right'
            : direction;
        enemyStore.updateEnemyDirection(enemy.id, visualDirection);
      }

      if (action === 'idle') {
        enemyStore.updateEnemyAction(enemy.id, 'idle');
      }
    });

    animationFrame.value = requestAnimationFrame(updateEnemies);
  };

  onMounted(() => {
    animationFrame.value = requestAnimationFrame(updateEnemies);
  });

  onUnmounted(() => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
    }
  });
}
