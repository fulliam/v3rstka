import { ref, onMounted, onUnmounted } from 'vue';
import { useSocketStore } from '@/stores/socket';
import { usePlayerStore } from '@/stores/player';

export default function useActions(
  online: boolean,
  character?: any,
  userId?: string,
  isOwn?: boolean
) {
  let socketStore: any;
  let playerStore: any;
  if (online) {
    socketStore = useSocketStore();
  } else {
    playerStore = usePlayerStore();
  }

  const keys = ref<{ [key: string]: boolean }>({});
  const actionList = ref<{ name: string; key: string }[]>([
    { name: 'attack', key: 'KeyZ' },
    { name: 'attack2', key: 'KeyX' },
    { name: 'attack3', key: 'KeyC' },
    { name: 'walk up', key: 'ArrowUp' },
    { name: 'walk down', key: 'ArrowDown' },
    { name: 'walk left', key: 'ArrowLeft' },
    { name: 'walk right', key: 'ArrowRight' },
    { name: 'jump', key: 'Space' },
  ]);

  const initializeKeys = () => {
    keys.value = {};
    actionList.value.forEach((action) => {
      keys.value[action.key] = false;
    });
  };

  const startAction = (action: string) => {
    if (online) {
      socketStore.updateUserAction(userId, character.info.character, action);
    } else {
      playerStore.updatePlayerAction(action);
    }
  };

  const stopAction = () => {
    if (online) {
      socketStore.updateUserAction(userId, character.info.character, 'idle');
    } else {
      playerStore.updatePlayerAction('idle');
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (online && !isOwn) return;
  
    if (keys.value.hasOwnProperty(event.code)) {
      keys.value[event.code] = true;
    }
  
    const actionEntry = actionList.value.find((a) => a.key === event.code);
    if (actionEntry) {
      const action = actionEntry.name.includes('walk') ? 'walk' : actionEntry.name;
      const isRunning = (keys.value['ShiftLeft'] || keys.value['ShiftRight']) && action === 'walk';
      startAction(isRunning ? 'run' : action);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (online && !isOwn) return;

    if (keys.value.hasOwnProperty(event.code)) {
      keys.value[event.code] = false;
    }

    if (!Object.keys(keys.value).some((key) => keys.value[key])) {
      stopAction();
    } else {
      const activeWalkKeys = Object.keys(keys.value).filter(
        (key) => keys.value[key] && actionList.value.find((a) => a.key === key)?.name === 'walk'
      );
      if (activeWalkKeys.length > 0) {
        const action = keys.value['ShiftLeft'] || keys.value['ShiftRight'] ? 'run' : 'walk';
        startAction(action);
      }
    }
  };

  const registerKeyEvents = () => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  };

  const unregisterKeyEvents = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };

  const addActionMapping = (newKey: string, actionName: string) => {
    const action = actionList.value.find((a) => a.name === actionName);
    if (action) {
      const oldKey = action.key;
      action.key = newKey;
      
      keys.value[newKey] = keys.value[oldKey] || false;
      delete keys.value[oldKey];
  
      localStorage.setItem('actionList', JSON.stringify(actionList.value));
      initializeKeys();
  
      unregisterKeyEvents();
      registerKeyEvents();
    }
  };

  onMounted(() => {
    const storedActionList = localStorage.getItem('actionList');
    if (storedActionList) {
      actionList.value = JSON.parse(storedActionList);
    }
    initializeKeys();
    registerKeyEvents();
  });

  onUnmounted(() => {
    unregisterKeyEvents();
  });

  return {
    keys,
    actionList,
    addActionMapping,
  };
}
