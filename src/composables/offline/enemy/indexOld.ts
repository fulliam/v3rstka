import { ref, onMounted, onUnmounted } from 'vue';
import { useEnemyStore } from '@/stores/enemy';
import { useDungeonStore } from '@/stores/dungeon';
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
  const animationFrame = ref<number | null>(null);
  const lastActionChangeTime = ref<Record<string, number>>({});
  const actionChangeIntervals = ref<Record<string, number>>({});
  const lastMovementDirection = ref<Record<string, string>>({});

  const moveEnemy = (
    enemyId: string,
    currentPosition: Position,
    speed: number
  ) => {
    let newPosition: Position = { ...currentPosition };
    let hitWall = false;
    let movementDirection =
      lastMovementDirection.value[enemyId] || randomDirection();

    // Проверяем наличие стены на 20 пикселей вперед
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

    // Проверяем, есть ли стена на 20 пикселей вперед
    if (checkWallAhead(movementDirection)) {
      lastMovementDirection.value[enemyId] = randomDirection(); // Изменяем направление, если стена впереди
      return {
        newPosition,
        movementDirection: lastMovementDirection.value[enemyId],
        hitWall: true,
      };
    }

    // Перемещение по текущему направлению
    const updatePosition = (deltaX: number, deltaY: number) => {
      const newX = newPosition.x + deltaX;
      const newY = newPosition.y + deltaY;

      const cellType = dungeonStore.getCellType(newX, newY);

      if (cellType !== 'wall') {
        newPosition = { x: newX, y: newY };
      } else {
        hitWall = true;
      }
    };

    switch (movementDirection) {
      case 'left':
        updatePosition(-speed, 0);
        break;
      case 'right':
        updatePosition(speed, 0);
        break;
      case 'up':
        updatePosition(0, -speed);
        break;
      case 'down':
        updatePosition(0, speed);
        break;
      case 'up-left':
        updatePosition(-speed, -speed);
        break;
      case 'up-right':
        updatePosition(speed, -speed);
        break;
      case 'down-left':
        updatePosition(-speed, speed);
        break;
      case 'down-right':
        updatePosition(speed, speed);
        break;
    }

    if (!hitWall) {
      enemyStore.updateEnemyPosition(enemyId, newPosition);
      lastMovementDirection.value[enemyId] = movementDirection;
    }

    return { newPosition, movementDirection, hitWall };
  };

  const updateEnemies = () => {
    const currentTime = Date.now();

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

      if (action === 'walk' || action === 'run') {
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
