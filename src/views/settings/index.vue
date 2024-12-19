<template>
  <section>
    <h1>Настройки управления</h1>
    <div v-for="(action, index) in actionList" :key="index" class="binding">
      <span class="binding-name">{{ action.name }}</span>
      <Button
        @click="awaitKeyInput(action)"
        :class="['binding-button', { active: awaitingKeyInput === action }]"
        :label="action.key"
        type="base"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useActions from '@/composables/actions';

const { addActionMapping } = useActions(false);

const actionList = ref<{ name: string; key: string }[]>([
  { name: 'attack', key: 'KeyZ' },
  { name: 'attack2', key: 'KeyX' },
  { name: 'attack3', key: 'KeyC' },
  { name: 'walk', key: 'ArrowUp' },
  { name: 'walk', key: 'ArrowDown' },
  { name: 'walk', key: 'ArrowLeft' },
  { name: 'walk', key: 'ArrowRight' },
  { name: 'jump', key: 'Space' },
]);

const awaitingKeyInput = ref<{ name: string; key: string } | null>(null);

const updateBinding = (
  action: { name: string; key: string },
  newKey: string
) => {
  const existingAction = actionList.value.find((a) => a.key === newKey);
  if (existingAction) {
    existingAction.key = '';
  }

  const currentKeyIndex = actionList.value.findIndex(
    (a) => a.key === action.key
  );
  if (currentKeyIndex !== -1) {
    actionList.value[currentKeyIndex].key = '';
  }

  action.key = newKey;
  addActionMapping(newKey, action.name);
  awaitingKeyInput.value = null;

  localStorage.setItem('actionList', JSON.stringify(actionList.value));
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (awaitingKeyInput.value) {
    updateBinding(awaitingKeyInput.value, event.code);
    window.removeEventListener('keydown', handleKeyPress);
  }
};

const awaitKeyInput = (action: { name: string; key: string }) => {
  awaitingKeyInput.value = action;
  window.addEventListener('keydown', handleKeyPress);
};

onMounted(() => {
  const storedActionList = localStorage.getItem('actionList');
  if (storedActionList) {
    actionList.value = JSON.parse(storedActionList);
  }
});
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.active {
  border: 2px solid #4caf50;
  animation: pulse 1s infinite;
}

.binding {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 30%;
  justify-content: space-between;

  &-name {
    font-size: 32px;
  }

  &-button {
    min-height: 43px;
    min-width: 150px;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
  }
}
</style>
