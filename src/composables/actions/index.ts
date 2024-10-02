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

  const keys = ref<{ [key: string]: boolean }>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ShiftLeft: false,
    ShiftRight: false,
  });

  const actionMap: { [key: string]: string } = {
    KeyZ: 'attack',
    KeyX: 'attack2',
    KeyC: 'attack3',
    ArrowRight: 'walk',
    ArrowLeft: 'walk',
    ArrowUp: 'walk',
    ArrowDown: 'walk',
    Space: 'jump',
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

    let action = actionMap[event.code];

    if (action) {
      if (
        (keys.value.ShiftLeft || keys.value.ShiftRight) &&
        ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.code)
      ) {
        action = 'run';
      }

      startAction(action);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (online && !isOwn) return;

    if (keys.value.hasOwnProperty(event.code)) {
      keys.value[event.code] = false;
    }

    if (!Object.values(keys.value).some((key) => key)) {
      stopAction();
    } else {
      if (
        keys.value.ArrowUp ||
        keys.value.ArrowDown ||
        keys.value.ArrowLeft ||
        keys.value.ArrowRight
      ) {
        const action =
          keys.value.ShiftLeft || keys.value.ShiftRight ? 'run' : 'walk';
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

  // Функция для расширения или изменения карты действий
  const addActionMapping = (key: string, action: string) => {
    actionMap[key] = action;
  };

  onMounted(() => {
    registerKeyEvents();
  });

  onUnmounted(() => {
    unregisterKeyEvents();
  });

  return {
    keys,
    addActionMapping,
  };
}
