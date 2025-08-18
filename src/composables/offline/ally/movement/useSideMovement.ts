import { usePlayerStore } from '@/stores/player';
import useActions from '@/composables/actions';
import type { Position, Direction } from '@/types';

export type SideMovementOptions = {
  canMoveTo?: (x: number) => boolean;
  onMoveBackground?: (direction: 'left' | 'right', deltaPx: number) => void;
  speedMultiplier?: number;
  acceleration?: number;
  deceleration?: number;
  stopEpsilon?: number;
  autoStart?: boolean;
};

export default function useSideMovement(options?: SideMovementOptions) {
  const opts: Required<SideMovementOptions> = {
    canMoveTo: (x: number) => true,
    onMoveBackground: () => {},
    speedMultiplier: 1,
    acceleration: 4000,
    deceleration: 5000,
    stopEpsilon: 1,
    autoStart: true,
    ...(options || {}),
  };

  const playerStore = usePlayerStore();
  const { keys, actionList } = useActions(false);

  const animationFrame = ref<number | null>(null);
  const velocity = ref(0);
  const isMoving = ref(false);
  const lastTimestamp = ref<number | null>(null);

  const player = computed(() => playerStore.getPlayer);
  const directionIsLeft = computed(() => player.value?.state?.direction === 'left');

  function getMaxSpeed() {
    const speedStats = player.value?.stats?.speed;
    if (!speedStats) return 300 * opts.speedMultiplier;

    const running = keys.value.ShiftLeft || keys.value.ShiftRight;
    const type = running ? 'running' : 'walking';
    const base = speedStats[type] ?? speedStats.walking ?? 300;

    return base * opts.speedMultiplier;
  }

  function getDesiredDirection(): -1 | 0 | 1 {
    let left = false;
    let right = false;
    actionList.value.forEach((action) => {
      if (!action.name.includes('walk')) return;
      if (keys.value[action.key]) {
        if (action.name.includes('left')) left = true;
        if (action.name.includes('right')) right = true;
      }
    });
    if (left && !right) return -1;
    if (right && !left) return 1;
    return 0;
  }

  function tick(now: number) {
    if (!lastTimestamp.value) {
      lastTimestamp.value = now;
      animationFrame.value = requestAnimationFrame(tick);
      return;
    }

    const dt = (now - lastTimestamp.value) / 1000;
    lastTimestamp.value = now;

    const desiredDir = getDesiredDirection();
    const maxSpeed = getMaxSpeed();
    const desiredVelocity = desiredDir * maxSpeed;

    if (Math.abs(desiredVelocity - velocity.value) > 0.0001) {
      const accel = desiredVelocity !== 0 ? opts.acceleration : opts.deceleration;
      const sign = desiredVelocity > velocity.value ? 1 : -1;
      velocity.value += sign * accel * dt;

      if ((sign > 0 && velocity.value > desiredVelocity) || (sign < 0 && velocity.value < desiredVelocity)) {
        velocity.value = desiredVelocity;
      }
    }

    if (Math.abs(velocity.value) < opts.stopEpsilon) velocity.value = 0;

    if (velocity.value !== 0) {
      const oldPos = player.value?.state.position as Position | undefined;
      if (oldPos) {
        const newX = oldPos.x + velocity.value * dt;

        if (opts.canMoveTo(newX)) {
          const newPos: Position = { ...oldPos, x: newX };
          const newDirection: Direction = velocity.value < 0 ? 'left' : 'right';
          playerStore.updatePlayerPosition(newPos, newDirection);

          if (opts.onMoveBackground) {
            const deltaPx = Math.abs(velocity.value * dt * 6);
            opts.onMoveBackground(newDirection, deltaPx);
          }
        } else {
          velocity.value = 0;
        }
      }
    }

    const running = keys.value.ShiftLeft || keys.value.ShiftRight;
    const movementAction = velocity.value === 0 ? 'idle' : (running ? 'run' : 'walk');

    const currentAction = player.value?.state?.action;
    const isMovementAction = ['walk', 'run', 'idle'].includes(currentAction);

    if (isMovementAction || velocity.value !== 0) {
      playerStore.updatePlayerAction(movementAction);
    }

    isMoving.value = velocity.value !== 0;

    animationFrame.value = requestAnimationFrame(tick);
  }

  function startMovement() {
    if (animationFrame.value) return;
    lastTimestamp.value = null;
    animationFrame.value = requestAnimationFrame(tick);
  }

  function stopMovement() {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
      animationFrame.value = null;
    }
    lastTimestamp.value = null;
  }

  function forceStop() {
    velocity.value = 0;
    isMoving.value = false;
    playerStore.updatePlayerAction('idle');
    stopMovement();
  }

  watch(
    () => keys.value,
    (newKeys) => {
      const anyMovementKeyPressed = actionList.value.some(
        (action) => newKeys[action.key] && action.name.includes('walk')
      );
      if (anyMovementKeyPressed) {
        startMovement();
      } else if (opts.autoStart && Math.abs(velocity.value) <= opts.stopEpsilon) {
        stopMovement();
      }
    },
    { deep: true }
  );

  onMounted(() => {
    if (opts.autoStart) {
      const anyMovementKeyPressed = actionList.value.some(
        (action) => keys.value[action.key] && action.name.includes('walk')
      );
      if (anyMovementKeyPressed) startMovement();
    }
  });

  onBeforeUnmount(() => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
    }
  });

  return {
    velocity,
    isMoving,
    directionIsLeft,
    startMovement,
    stopMovement,
    forceStop,
  };
}