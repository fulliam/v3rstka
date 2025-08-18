<template>
  <Background ref="bgRef" :scenes="actsData[currentAct]">
    <template #character>
      <div class="player-container" :style="playerContainerStyle">
        <HpBar :player="player" />
        <Player
          :character="player.info.character"
          :action="player.state.action"
          :style="playerStyle"
        />
      </div>
    </template>
  </Background>
</template>

<script setup lang="ts">
import { Background, HpBar } from './components';
import { actsData } from './data';
import { Player } from '@/components/templates/character/offline/ally';
import { useSideMovement } from '@/composables/offline/ally/movement';
import { usePlayer } from './composables';

const bgRef = ref<InstanceType<typeof Background> | null>(null);
const currentAct = ref<keyof typeof actsData>('ActI');

const {
  player,
  playerContainerStyle,
  playerStyle,
  canMoveTo,
} = usePlayer(actsData, currentAct);


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

<style scoped>
.player-container {
  transform-origin: bottom center;
}
</style>