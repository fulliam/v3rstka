<template>
  <div class="modal-card">
    <div class="modal-card__header">
      <span class="modal-card__title">
        {{ titleText || '' }}
      </span>
      <Cross
        class="modal-card__header__close"
        @click="$emit('close', { confirmed: false })"
      />
    </div>

    <div
      v-if="subTitle"
      class="modal-card__option modal-card__content"
    >
      <div class="modal-card__wrapper">
        <p class="modal-card__subtitle">
          {{ subTitle.topText }}
        </p>
      </div>
      <span class="modal-card__text">{{ subTitle.bottomText }}</span>
    </div>

    <p
      v-for="(line, idx) in promptLines"
      :key="idx"
      class="modal-card__subtitle modal-card__content"
    >
      {{ line }}
    </p>

    <div class="modal-card__buttons modal-card__content">
      <Button
        :type="'secondary'"
        :label="cancelText || 'Cancel'"
        @click="$emit('close', { confirmed: false })"
      />

      <Button
        :type="buttonAccessType || 'base'"
        :label="submitText || 'Ok'"
        @click="$emit('close', { confirmed: true })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModalConfig } from '@/stores/modal/index.ts';
import { Button } from '@/components/base/button';
import { Cross } from '@/assets/icons';

const props = defineProps<ModalConfig>();
defineEmits<{
  (e: 'close', result: { confirmed: boolean }): void;
}>();

const promptLines = computed(() => {
  const arr: string[] = [];
  if (props.promptText) arr.push(props.promptText);
  if (props.contentText) {
    const t = props.contentText;
    arr.push(...(Array.isArray(t) ? t : [t]));
  }

  return arr;
});
</script>

<style lang="scss" scoped>
@use './Confirm.scss';
</style>
