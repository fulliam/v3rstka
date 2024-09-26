<template>
  <div class="modal" :class="{ active: isActive }" v-if="isActive">
    <div class="overlay" @click="handleClose"></div>
    <div id="modal" class="window">
      <Icon.Cross class="close" @click="handleClose" />
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/assets/icons';
import { useModalStore } from '@/stores/modal';
import { ref, computed, watch, onBeforeUnmount } from 'vue';

const props = defineProps<{ id: string }>();
const emit = defineEmits(['close']);

const modalStore = useModalStore();
const active = ref<boolean>(false);
const isActive = computed(() => {
  active.value = modalStore.modals.some((modal) => modal.id === props.id);
  return active.value;
});

const toggleScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
};

watch(active, (newVal) => {
  toggleScroll(newVal);
});

const handleClose = () => {
  modalStore.closeModal(props.id);
  emit('close');
};

onBeforeUnmount(() => {
  toggleScroll(false);
});
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  min-height: 100vh;
  width: 100vw;

  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition:
    visibility 0.2s,
    opacity 0.2s;
  overflow: auto;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 99;
}

.active {
  display: flex;
  opacity: 1;
  visibility: visible;
  overflow: hidden;
  animation: fadeIn 0.12s forwards linear;
}

.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(21, 21, 21, 0.4);
}

.window {
  position: absolute;
  z-index: 99;
  flex-shrink: 0;
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
