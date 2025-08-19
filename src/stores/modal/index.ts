import type { Component } from 'vue';

export type ModalConfig = {
  titleText?: string;
  contentText?: string | string[];
  promptText?: string;
  cancelText?: string;
  submitText?: string;
  buttonAccessType?: 'primary' | 'secondary' | 'danger' | 'base';
  subTitle?: {
    topText?: string;
    bottomText?: string;
  };
};

export interface ModalEntry<T = boolean> {
  component: Component;
  props?: Record<string, unknown>;
  resolve: (value: T | PromiseLike<T>) => void;
}

export const useModalStore = defineStore('modalStore', () => {
  const entry = shallowRef<ModalEntry<any> | null>(null);
  const isOpen = ref(false);

  function open<T = { confirmed: boolean; removeRelated?: boolean }>(
    component: Component,
    props?: Record<string, unknown>,
    listeners?: Record<string, unknown>
  ): Promise<T> {
    return new Promise((resolve) => {
      entry.value = {
        component: markRaw(component),
        props: reactive({ ...(props || {}), ...(listeners || {}) }),
        resolve,
      };
      isOpen.value = true;
      // PAUSE GAME IF NEEDED
    });
  }

  function close<T = boolean>(result?: T) {
    entry.value?.resolve(result);
    isOpen.value = false;
    entry.value = null;
    // RESUME GAME IF NEEDED
  }

  return { isOpen, entry, open, close };
});
