import type { Component } from 'vue';

export type ModalConfig = {
  titleText?: string;
  contentText?: string | string[];
  promptText?: string;
  cancelText?: string;
  submitText?: string;
  buttonAccessTheme?:
    | 'blue'
    | 'green'
    | 'black'
    | 'blue-outline'
    | 'gray'
    | 'red'
    | 'icon'
    | 'white';
  subTitle?: {
    topText?: string;
    bottomText?: string;
    enableCheckbox?: boolean;
    tooltipText?: string;
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
      document.body.classList.add('no-scroll');
    });
  }

  function close<T = boolean>(result?: T) {
    entry.value?.resolve(result);
    isOpen.value = false;
    document.body.classList.remove('no-scroll');
    entry.value = null;
  }

  return { isOpen, entry, open, close };
});
