import { usePlayerStore } from '@/stores/player';
import type { BgContext } from '@/views/game/side-view/types';
import { randomInt } from '@/lib/helpers/randomInt';

export function useMoneyCollection(props: {
  currentAct: string;
  positionX: number;
  moneyId: string;
  type: string;
  moneyImgRef: Ref<HTMLImageElement | null>;
  stopAnimation: () => void;
  isAnimating: Ref<boolean>;
}) {
  const DROP_RANGE = 0;
  const COLLECTION_DISTANCE = 15;

  const playerStore = usePlayerStore();
  const bgContext = inject<BgContext | null>('bgContext', null);

  const isCollected = ref(false);

  const coinParallaxFactor = props.type.includes('gem') ? 0.95 : 1.0;

  const moneyPositionX = ref(props.positionX);
  // const moneyPositionY = ref(-20);

  const screenX = computed(() => {
    const bgX = bgContext?.backgroundPositionX?.value ?? 0;
    return moneyPositionX.value + bgX * coinParallaxFactor;
  });

  const moneyPosition = computed(() => {
    const bottomPercentage = props.currentAct === 'ActVI' ? '11%' : '25%';

    return {
      position: 'absolute' as const,
      left: `calc(${screenX.value}px + ${DROP_RANGE}px)`,
      bottom: `calc(${bottomPercentage} - ${randomInt(0, -40)}px)`,
      zIndex: 999,
    };
  });

  const handleCollection = () => {
    props.stopAnimation();
    isCollected.value = true;
    props.isAnimating.value = false;

    console.log(`Collected: ${props.moneyId} (${props.type})`);
    // playerStore.collectMoney(props.moneyId, props.type);
  };

  const checkCollection = () => {
    try {
      const playerEl = document.querySelector(
        '.player-container'
      ) as HTMLElement | null;

      const moneyEl = props.moneyImgRef.value;

      if (!moneyEl || !playerEl) {
        const playerWorldX = playerStore.getPlayer?.state?.position?.x;
        if (playerWorldX !== undefined) {
          const bgX = bgContext?.backgroundPositionX?.value ?? 0;
          const playerScreenX = playerWorldX + bgX * 1;
          const moneyScreenX = moneyPositionX.value + bgX * coinParallaxFactor;
          const screenDistance = Math.abs(playerScreenX - moneyScreenX);
          if (screenDistance <= COLLECTION_DISTANCE) handleCollection();
        }
        return;
      }

      const rPlayer = playerEl.getBoundingClientRect();
      const rMoney = moneyEl.getBoundingClientRect();

      const cxPlayer = rPlayer.left + rPlayer.width / 2;
      const cxMoney = rMoney.left + rMoney.width / 2;

      const dx = cxPlayer - cxMoney;
      if (Math.abs(dx) <= COLLECTION_DISTANCE) {
        handleCollection();
      }
      //   else {
      //     console.debug(
      //       'not collected: screenDist=',
      //       dx.toFixed(1),
      //       'threshold=',
      //       COLLECTION_DISTANCE
      //     );
      //   }
    } catch (e) {
      const playerWorldX = playerStore.getPlayer?.state?.position?.x;
      if (playerWorldX !== undefined) {
        const bgX = bgContext?.backgroundPositionX?.value ?? 0;
        const playerScreenX = playerWorldX + bgX * 1;
        const moneyScreenX = moneyPositionX.value + bgX * coinParallaxFactor;
        const screenDistance = Math.abs(playerScreenX - moneyScreenX);
        if (screenDistance <= COLLECTION_DISTANCE) handleCollection();
      }
    }
  };

  watch(() => playerStore.getPlayer?.state?.position?.x, checkCollection);
  watch(() => bgContext?.backgroundPositionX?.value, checkCollection);

  onMounted(() => window.addEventListener('resize', checkCollection));
  onBeforeUnmount(() => window.removeEventListener('resize', checkCollection));

  return { moneyPosition, isCollected, checkCollection };
}
