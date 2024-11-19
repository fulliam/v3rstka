import { ref, onMounted, onUnmounted } from 'vue';
import { useEnemyStore } from '@/stores/enemy';
import { useDungeonStore } from '@/stores/dungeon';
import { usePlayerStore } from '@/stores/player';
import type { Position } from '@/types';
import {
  randomDirection,
  randomAction,
  randomInterval,
  isInRange,
} from './utils';
// import AStarPathfinder from './utils/astar';
// import { AStarFinder } from '@/lib/a-star';

export function useEnemyAI() {
  const enemyStore = useEnemyStore();
  const dungeonStore = useDungeonStore();
  const playerStore = usePlayerStore();
  const animationFrame = ref<number | null>(null);
  const lastActionChangeTime = ref<Record<string, number>>({});
  const actionChangeIntervals = ref<Record<string, number>>({});
  const lastMovementDirection = ref<Record<string, string>>({});
  const enemyStates = ref<Record<string, 'patrol' | 'chase' | 'attack'>>({});

  const ATTACK_DISTANCE = 20;
  const CHASE_DISTANCE = 100;
  const AVOIDANCE_DISTANCE = 3;

  const moveEnemy = (
    enemyId: string,
    currentPosition: Position,
    speed: number,
    targetPosition?: Position
  ) => {
    let newPosition: Position = { ...currentPosition };
    let hitWall = false;

    const directionToTarget = () => {
      if (!targetPosition) return randomDirection();
      const dx = targetPosition.x - currentPosition.x;
      const dy = targetPosition.y - currentPosition.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
      } else {
        return dy > 0 ? 'down' : 'up';
      }
    };

    const isTooCloseToOtherEnemy = (pos: Position) => {
      return enemyStore.getEnemies.some((otherEnemy) => {
        if (otherEnemy.id !== enemyId) {
          const dx = otherEnemy.state.position.x - pos.x;
          const dy = otherEnemy.state.position.y - pos.y;
          return Math.sqrt(dx * dx + dy * dy) < AVOIDANCE_DISTANCE;
        }
        return false;
      });
    };

    const tryMoveInDirection = (direction: string): boolean => {
      let deltaX = 0;
      let deltaY = 0;

      switch (direction) {
        case 'left':
          deltaX = -speed;
          break;
        case 'right':
          deltaX = speed;
          break;
        case 'up':
          deltaY = -speed;
          break;
        case 'down':
          deltaY = speed;
          break;
        case 'up-left':
          deltaX = -speed;
          deltaY = -speed;
          break;
        case 'up-right':
          deltaX = speed;
          deltaY = -speed;
          break;
        case 'down-left':
          deltaX = -speed;
          deltaY = speed;
          break;
        case 'down-right':
          deltaX = speed;
          deltaY = speed;
          break;
      }

      const newX = newPosition.x + deltaX;
      const newY = newPosition.y + deltaY;

      if (
        dungeonStore.getCellType(newX, newY) !== 'wall' &&
        !enemyStore.isPositionOccupied(newX, newY, enemyId) &&
        !isTooCloseToOtherEnemy({ x: newX, y: newY })
      ) {
        newPosition = { x: newX, y: newY };
        return true;
      }

      return false;
    };

    let movementDirection =
      enemyStates.value[enemyId] === 'chase'
        ? directionToTarget()
        : lastMovementDirection.value[enemyId] || randomDirection();

    if (!tryMoveInDirection(movementDirection)) {
      let attempts = 0;
      hitWall = true;
      while (hitWall && attempts < 8) {
        movementDirection = randomDirection();
        hitWall = !tryMoveInDirection(movementDirection);
        attempts++;
      }
    }

    if (!hitWall) {
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

      if (isInRange(position, playerPosition, ATTACK_DISTANCE)) {
        enemyStates.value[enemy.id] = 'attack';
      } else if (isInRange(position, playerPosition, CHASE_DISTANCE)) {
        enemyStates.value[enemy.id] = 'chase';
      } else {
        enemyStates.value[enemy.id] = 'patrol';
      }

      if (enemyStates.value[enemy.id] === 'chase') {
        action = 'run';
        enemyStore.updateEnemyAction(enemy.id, action);

        const { newPosition, movementDirection, hitWall } = moveEnemy(
          enemy.id,
          position,
          speed,
          playerPosition
        );

        // const path = AStarPathfinder.findPath(
        //   dungeonStore.dungeon,
        //   {x: Math.floor(position.x), y: Math.floor(position.y)},
        //   {x: Math.floor(playerPosition.x), y: Math.floor(playerPosition.y)},
        //   dungeonStore.cellSize
        // );
        // console.log('dungeon', dungeonStore.dungeon);
        // console.log('position', position);
        // console.log('playerPosition', playerPosition);
        // console.log('path', path);
        // console.log('cellCoordinates', dungeonStore.cellCoordinates);

        if (hitWall) {
          lastMovementDirection.value[enemy.id] = randomDirection();
        } else {
          enemyStore.updateEnemyPosition(enemy.id, newPosition);
        }

        const visualDirection = movementDirection.includes('left')
          ? 'left'
          : movementDirection.includes('right')
            ? 'right'
            : direction;
        enemyStore.updateEnemyDirection(enemy.id, visualDirection);
      } else if (enemyStates.value[enemy.id] === 'attack') {
        action = 'attack';
        enemyStore.updateEnemyAction(enemy.id, action);
      } else {
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
          } else {
            enemyStore.updateEnemyPosition(enemy.id, newPosition);
          }

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
