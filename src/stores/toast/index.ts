import type { Toast } from '@/types';

export const useToastStore = defineStore('toast', () => {
  const toastList = ref<Toast[]>([]);
  const maxToastCount = 5;
  let toastIndex = 0;
  const timeouts: NodeJS.Timeout[] = [];

  const addToast = (
    message: string,
    type: Toast['type'] = 'info',
    position: Toast['position'] = 'top-right',
    duration = 3000
  ) => {
    if (toastList.value.length >= maxToastCount) {
      toastList.value.shift();
    }

    const toast: Toast = {
      message,
      type,
      position,
      visible: true,
      id: toastIndex++,
    };

    toastList.value.push(toast);

    const hideTimeout = setTimeout(() => {
      toast.visible = false;

      const removeTimeout = setTimeout(() => {
        const index = toastList.value.findIndex((t) => t.id === toast.id);
        if (index !== -1) {
          toastList.value.splice(index, 1);
        }
      }, 300);

      timeouts.push(removeTimeout);
    }, duration);

    timeouts.push(hideTimeout);
  };

  onBeforeUnmount(() => {
    timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  });

  return { toastList, addToast };
});
