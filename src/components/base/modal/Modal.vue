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
@use './Modal.scss';
</style>
