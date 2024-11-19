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
      // Вычисляем путь до игрока
      enemy.state.path = findPath(position, playerPosition);
      enemy.state.pathIndex = 0; // начальная точка в пути
    } else {
      enemyStates.value[enemy.id] = 'patrol';
    }

    if (enemyStates.value[enemy.id] === 'chase' && enemy.state.path) {
      action = 'run';
      enemyStore.updateEnemyAction(enemy.id, action);

      // Берем текущую цель в пути
      const targetPosition = enemy.state.path[enemy.state.pathIndex];
      const { newPosition, movementDirection, hitWall } = moveEnemy(
        enemy.id,
        position,
        speed,
        { x: targetPosition[0], y: targetPosition[1] }
      );

      // Проверяем, достигли ли мы текущей точки пути
      if (
        Math.abs(newPosition.x - targetPosition[0]) < 1 &&
        Math.abs(newPosition.y - targetPosition[1]) < 1
      ) {
        enemy.state.pathIndex++; // Переходим к следующей точке пути
      }

      if (hitWall || enemy.state.pathIndex >= enemy.state.path.length) {
        lastMovementDirection.value[enemy.id] = randomDirection();
        enemy.state.path = undefined; // Сбрасываем путь, если достигли конца или столкнулись со стеной
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
    // остальные условия и действия (патрулирование, атака и т.д.)
  });

  animationFrame.value = requestAnimationFrame(updateEnemies);
};
