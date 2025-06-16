export const useModalStore = defineStore('modalStore', () => {
  const modals = ref<Array<{ id: string; content: any }>>([]);

  const openModal = (id: string, content: any) => {
    modals.value.push({ id, content });
  };

  const closeModal = (id: string) => {
    modals.value = modals.value.filter((modal) => modal.id !== id);
  };

  return {
    modals,
    openModal,
    closeModal,
  };
});
