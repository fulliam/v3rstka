import { usePlayerStore } from '@/stores/player';
import type { ActsData } from '@/views/game/side-view/data';
import type { HTMLAttributes, ReservedProps } from 'vue';

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

export function usePlayer(actsData: ActsData, currentAct: Ref<string>) {
  const playerStore = usePlayerStore();

  playerStore.initializePlayer();

  onMounted(() => {
    const initialPlayerPosition = {
      x: DESIGN_WIDTH * 0.1,
      y: 0,
    };
    playerStore.updatePlayerPosition(initialPlayerPosition, 'right');
  });

  const player = computed(() => playerStore.getPlayer);
  const direction = computed(() => player.value?.state?.direction === 'left');

  const canMoveTo = computed(() => {
    const sceneCount = actsData[currentAct.value]?.length ?? 1;
    const worldWidth = DESIGN_WIDTH * sceneCount;
    const margin = characterSize.value / 10;
  
    return (x: number) => x >= margin && x <= worldWidth - margin;
  });

  const playerContainerStyle = computed(() => {
    const pos = player.value?.state?.position;
    if (!pos) return { display: 'none' };
  
    const roadOffset = roadOffsetFromBottom[currentAct.value] ?? 170;
    const roadDesignY = DESIGN_HEIGHT - roadOffset;
  
    const containerY = roadDesignY - 40;
  
    return {
      position: 'absolute',
      width: `${characterSize.value}px`,
      height: `${characterSize.value + 40}px`,
      transform: `translate(${pos.x}px, ${containerY}px)`,
      zIndex: 1000,
    } as HTMLAttributes & ReservedProps & Record<string, unknown> || { display: 'none' };
  }) as any;

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
    } as HTMLAttributes & ReservedProps & Record<string, unknown> || { display: 'none' };
  });

  return {
    player,
    direction,
    characterSize,
    canMoveTo,
    playerContainerStyle,
    playerStyle,
  };
}