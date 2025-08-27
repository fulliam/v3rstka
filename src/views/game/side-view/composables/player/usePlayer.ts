import { ref, computed, onMounted, watch, Ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import type { Acts } from '@/views/game/side-view/types';
import { useJumpAnimation } from './useJumpAnimation';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const roadOffsetFromBottom: Record<string, number> = {
  ActI: 600,
  ActII: 180,
  ActIII: 170,
  ActIV: 160,
  ActV: 150,
  ActVI: 170,
};

const characterSize = ref(300);

export function usePlayer(acts: Acts, currentAct: Ref<string>) {
  const playerStore = usePlayerStore();

  playerStore.initializePlayer();

  const player = computed(() => playerStore.getPlayer);
  const direction = computed(() => player.value?.state?.direction === 'left');

  const canMoveTo = computed(() => {
    const sceneCount = acts[currentAct.value]?.length ?? 1;
    const worldWidth = DESIGN_WIDTH * sceneCount;
    const margin = characterSize.value / 10;
    return (x: number) => x >= margin && x <= worldWidth - margin;
  });

  // numeric offset для прыжка (анимируется)
  const playerOffsetY = ref(0);

  // --- playerContainerStyle как computed (использует playerOffsetY) ---
  const playerContainerStyle = computed(() => {
    const pos = player.value?.state?.position;
    if (!pos) {
      return {
        display: 'none',
      } as Record<string, any>;
    }

    const roadOffset = roadOffsetFromBottom[currentAct.value] ?? 170;
    const roadDesignY = DESIGN_HEIGHT - roadOffset;

    const yWithOffset = Math.round(roadDesignY + (playerOffsetY.value || 0));
    return {
      position: 'absolute',
      width: `${characterSize.value}px`,
      height: `${characterSize.value}px`,
      transform: `translate3d(${Math.round(pos.x)}px, ${yWithOffset}px, 0)`,
      zIndex: 1000,
      transformOrigin: 'bottom center',
    } as Record<string, any>;
  });

  // При монтировании — инициализация позиции и стиль
  onMounted(() => {
    const initialPlayerPosition = {
      x: DESIGN_WIDTH * 0.1,
      y: 0,
    };
    playerStore.updatePlayerPosition(initialPlayerPosition, 'right');
    // playerContainerStyle вычисляется автоматически, потому здесь ничего вручную менять не нужно
  });

  // Следим за изменениями игрока/акта — computed обновит стиль
  watch(player, () => {}, { deep: true });
  watch(currentAct, () => {}, {});

  // --- Подключаем анимацию прыжка, теперь передаём playerOffsetY ---
  const { playJump, setJumpPhysics } = useJumpAnimation(playerOffsetY, {
    height: 150,
    upDuration: 0.45,
    downDuration: 0.45,
    easeUp: 'power2.out',
    easeDown: 'bounce.out',
    onComplete: () => {
      const currentAction = playerStore.getPlayer?.state?.action;
      if (currentAction === 'jump') {
        const isMoving = keys.value['ArrowLeft'] ||
                         keys.value['ArrowRight'] ||
                         keys.value['KeyA'] ||
                         keys.value['KeyD'];
        playerStore.updatePlayerAction(isMoving ? 'walk' : 'idle');
      }
    }
  });

  setJumpPhysics(150, 0.45);

  watch(
    () => player.value?.state?.action,
    (action) => {
      console.log('Player action changed:', action);
      if (action === 'jump') {
        console.log('Playing jump animation...');
        playJump();
      }
    }
  );

  const playerStyle = computed(() => {
    const flip = direction.value ? ' scaleX(-1)' : '';
    return {
      position: 'absolute',
      width: `${characterSize.value}px`,
      height: `${characterSize.value}px`,
      bottom: '0',
      left: '0',
      transform: flip,
      zIndex: 1,
      transformOrigin: 'bottom center',
    } as Record<string, any>;
  });

  return {
    player,
    direction,
    characterSize,
    canMoveTo,
    playerContainerStyle, // computed style — можно подать прямо в :style
    playerStyle,
    // экспортируем реф смещения, если нужно управление извне
    playerOffsetY,
  };
}
