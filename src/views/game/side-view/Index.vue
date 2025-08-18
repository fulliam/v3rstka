<template>
  <Bg ref="bgRef" :scenes="actsData[currentAct]">
    <template #character>
      <Player
        :character="player.info.character"
        :action="player.state.action"
        :style="playerStyle"
      />
    </template>
  </Bg>
</template>

<script setup lang="ts">
import Bg from './bg/Index.vue';
import actsData from './data';
import Player from '@/components/templates/character/offline/ally/index.vue';
import { usePlayerStore } from '@/stores/player';
import { useSideMovement } from '@/composables/offline/ally/movement';

const bgRef = ref<InstanceType<typeof Bg> | null>(null);
const currentAct = ref<keyof typeof actsData>('ActI');

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

let characterSize = 300;

const canMoveTo = computed(() => {
  const sceneCount = actsData[currentAct.value]?.length ?? 1;
  const worldWidth = DESIGN_WIDTH * sceneCount;
  const margin = characterSize / 10;

  return (x: number) => x >= margin && x <= worldWidth - margin;
});

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

const playerStyle = computed(() => {
  const pos = player.value?.state?.position;
  if (!pos) return { display: 'none' };

  const roadOffset = roadOffsetFromBottom[currentAct.value] ?? 170;
  const roadDesignY = DESIGN_HEIGHT - roadOffset;

  const flip = direction.value ? ' scaleX(-1)' : '';

  return {
    position: 'absolute',
    width: `${characterSize}px`,
    height: `${characterSize}px`,
    transform: `translate(${pos.x}px, ${roadDesignY}px)${flip}`,
    zIndex: 1000,
  };
});

useSideMovement({
  canMoveTo: (x: number) => canMoveTo.value(x),
  acceleration: 3500,
  deceleration: 5000,
  autoStart: true,
  onMoveBackground: (dir: 'left' | 'right', deltaPx: number) => {
    bgRef.value?.moveBackground(dir, deltaPx);
  },
});
</script>