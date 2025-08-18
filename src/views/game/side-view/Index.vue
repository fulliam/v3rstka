<template>
  <Background ref="bgRef" :scenes="actsData[currentAct]">
    <template #decorations>
      <HpBar :health="player.state.health" @click="openConfirm" />
    </template>
    
    <template #character>
      <div class="player-container" :style="playerContainerStyle">
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
import { Confirm } from '@/components/templates/modals/confirm';
import { useModalStore } from '@/stores';

const modal = useModalStore();
async function openConfirm(){
  await modal.open(Confirm, {
    titleText: 'Are you sure?',
    contentText: 'If you confirm, the game will be reset. Current progress will be lost.',
    buttonAccessType: 'danger',
    cancelText: 'CANCEL',
    submitText: 'CONFIRM',
  });
};

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