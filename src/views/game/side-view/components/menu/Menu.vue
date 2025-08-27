<!-- @/components/templates/menu/Menu.vue -->
<template>
  <!-- Иконки в левом нижнем углу -->
  <div class="menu-bar">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="menu-tab"
      @click="openModal(tab)"
    >
      <img
        :src="tab.path"
        class="tab-icon"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores';
import { usePlayerStore } from '@/stores/player';
import animations from '@/animations.json';
import { Info } from '@/components/templates/modals/player/info';
import { Congratulations } from '@/components/templates/modals/congratulation';
import { Inventory } from '@/components/templates/modals/player/inventory';
import SkillTree from '@/components/templates/modals/skilltree/index.vue';
import { tree } from '@/views/tmp/treeData';

const speechBoxData = {
  img: { src: 'src/assets/items/books/blue.png', alt: 'Ham' },
  title: 'Заголовок речевого блока',
  text: 'Тут можно описывать то на что кликнули',
};

const modal = useModalStore();
const playerStore = usePlayerStore();

const icons = animations.items.icons;

const tabs = [
  {
    id: 'profile',
    path: icons.wallet,
    modal: Info, // defineAsyncComponent(() => import('@/components/templates/modals/player')),
    props: {
      player: playerStore.getPlayer
    }
  },
  {
    id: 'items',
    path: icons.bag,
    modal: Inventory,
    props: {
      player: playerStore.getPlayer
    }
  },
  {
    id: 'skills',
    path: icons.forge,
    modal: SkillTree,
    props: {
      tree,
      speechBox: speechBoxData
    }
  },
  // {
  //   id: 'quests',
  //   path: icons.money,
  //   modal: {}, // defineAsyncComponent(() => import('@/components/templates/modals/QuestsModal.vue')),
  // },
  {
    id: 'congrats',
    path: icons.money,
    modal: Congratulations,
  },
];

function openModal(tab: (typeof tabs)[number]) {
  if (!tab.modal) return;

  const props: Record<string, any> = {};

  if (tab.props) {
    Object.assign(props, tab.props);
  }

  modal.open(tab.modal, {
    ...props
  });
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/collection/_mixins.scss' as *;

.menu-bar {
  position: absolute !important;
  left: 20px !important;
  bottom: 20px !important;
  width: 500px !important;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  backdrop-filter: blur(4px);

  @include pixel-box(
    $corner-size: 2,
    $border-size: 8px,
    $background-color: #08030370,
    $background-color-hover: #0f0e0e0b,
    $border-color: #0707079c
  );
}

.menu-tab {
  width: 72px;
  height: 72px;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.95);
  }
}

.tab-icon {
  min-width: 100%;
  min-height: 100%;

  :deep(img) {
    width: 100%;
    height: 100%;
    image-rendering: crisp-edges;
    object-fit: contain;
  }
}
</style>
