<template>
  <Teleport to="body">
    <div
      class="modal"
      :class="{ modal__active: modal.isOpen }"
    >
      <div
        class="overlay"
        @click="modal.close({ confirmed: false })"
      />
      
      <div
        id="modal"
        class="window"
      >
        <component
          :is="modal.entry.component"
          v-if="modal.entry"
          v-bind="modal.entry.props"
          @close="modal.close"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modal';

const modal = useModalStore();
</script>

<style lang="scss">
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

  &__active {
    display: flex;
    opacity: 1;
    visibility: visible;
    overflow: hidden;
    animation: fadeIn 0.12s forwards linear;
  }
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 99;
  color: black;
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
