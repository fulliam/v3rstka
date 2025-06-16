<template>
  <div style="position: absolute; right: 47%; top: 190px; z-index: 999">
    <Bat />
  </div>
  <SpeedLines />
  <Keyboards />
  <section>
    <div>
      <button @click="openNewModal">Открыть модальное окно</button>

      <Modal
        v-for="modal in modalStore.modals"
        :id="modal.id"
        :key="modal.id"
      >
        <div style="background-color: #666">
          {{ modal.content }}
          <SkillTree
            :tree="tree"
            :speech-box="speechBoxData"
          />
        </div>
      </Modal>

      <div>
        <Animation :path="animations.decorations.effects.runSmoke" />
        <Animation :path="animations.decorations.effects.groundSmoke" />
        <Animation :path="animations.decorations.effects.explosionSmoke" />
        <Animation :path="animations.decorations.explosion.fire" />
        <Animation :path="animations.decorations.explosion.lightning" />
        <Animation :path="animations.decorations.lightning.cycle" />
        <Animation :path="animations.decorations.lightning.linear" />
        <Animation :path="animations.decorations.dots.green" />
        <Animation :path="animations.decorations.dots.pink" />
      </div>

      <StarShine
        style="width: 200px; height: 200px"
        :starCount="20"
        :sparkleDuration="10"
        :image-src="'src/assets/items/icons/letter.png'"
        :alt="'letter'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import SkillTree from '@/components/templates/modals/skilltree/index.vue';
import Animation from '@/components/templates/animation/index.vue';
import { useModalStore } from '@/stores/modal';
import { tree } from './treeData';
import animations from '@/animations.json';
import StarShine from '@/components/partials/animations/starshine/index.vue';
import SpeedLines from '@/components/partials/animations/speedlines/index.vue';
import Bat from '@/components/partials/animations/bat/index.vue';
import Keyboards from '@/components/partials/keyboards/index.vue';

const modalStore = useModalStore();
const modalCount = ref(0);

const openNewModal = () => {
  modalCount.value++;
  modalStore.openModal(
    `modal-${modalCount.value}`,
    `Контент модального окна ${modalCount.value}`
  );
};

const speechBoxData = {
  img: { src: 'src/assets/items/books/blue.png', alt: 'Ham' },
  title: 'Заголовок речевого блока',
  text: 'Тут можно описывать то на что кликнули',
};
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  padding-top: 100px;
}
</style>
