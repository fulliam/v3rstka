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
    // (опционально) вы можете добавить WASD сюда как маппинги
  ]);

  const initializeKeys = () => {
    keys.value = {};
    // создаём флаги для всех маппингов
    actionList.value.forEach((action) => {
      keys.value[action.key] = false;
    });
    // обязательно добавляем модификаторы/фолбэки, чтобы Shift учитывался
    keys.value['ShiftLeft'] = keys.value['ShiftLeft'] ?? false;
    keys.value['ShiftRight'] = keys.value['ShiftRight'] ?? false;
    keys.value['Shift'] = keys.value['Shift'] ?? false;
    // также можно добавить WASD по умолчанию, если хотите
    keys.value['KeyA'] = keys.value['KeyA'] ?? false;
    keys.value['KeyD'] = keys.value['KeyD'] ?? false;
    keys.value['KeyW'] = keys.value['KeyW'] ?? false;
    keys.value['KeyS'] = keys.value['KeyS'] ?? false;
    keys.value['ArrowLeft'] = keys.value['ArrowLeft'] ?? false;
    keys.value['ArrowRight'] = keys.value['ArrowRight'] ?? false;
    keys.value['ArrowUp'] = keys.value['ArrowUp'] ?? false;
    keys.value['ArrowDown'] = keys.value['ArrowDown'] ?? false;
  };

  const startAction = (action: string) => {
    if (online) {
      socketStore.updateUserAction(userId, character?.info?.character, action);
    } else {
      playerStore.updatePlayerAction(action);
    }
  };

  const stopAction = () => {
    if (online) {
      socketStore.updateUserAction(userId, character?.info?.character, 'idle');
    } else {
      playerStore.updatePlayerAction('idle');
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (online && !isOwn) return;

    // Всегда помечаем клавишу в keys (даже если её не было в actionList).
    // Это позволяет отслеживать Shift и др. служебные клавиши.
    keys.value[event.code] = true;

    const actionEntry = actionList.value.find((a) => a.key === event.code);
    if (actionEntry) {
      // если это walk-left/right/up/down — нормализуем в 'walk'
      const action = actionEntry.name.toLowerCase().includes('walk')
        ? 'walk'
        : actionEntry.name;
      // бег если Shift нажат и это walk
      const isRunning =
        !!(keys.value['ShiftLeft'] || keys.value['ShiftRight'] || keys.value['Shift']) &&
        action === 'walk';
      startAction(isRunning ? 'run' : action);
    } else {
      // если нажата просто Shift (и ранее уже была нажата стрелка), нужно пересчитать действие
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight' || event.code === 'Shift') {
        // если есть активные walk-клавиши — переключаем на run
        const anyWalkPressed = actionList.value.some(
          (a) => a.name.toLowerCase().includes('walk') && keys.value[a.key]
        ) || keys.value.ArrowLeft || keys.value.ArrowRight || keys.value.KeyA || keys.value.KeyD;
        if (anyWalkPressed) startAction('run');
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (online && !isOwn) return;

    // Сбрасываем флаг (если не было — всё равно создадим и сделаем false)
    keys.value[event.code] = false;

    // если больше нет никаких нажатых ключей — стоп
    if (!Object.keys(keys.value).some((k) => keys.value[k])) {
      stopAction();
      return;
    }

    // иначе — проверим, есть ли ещё активные walk-клавиши
    const activeWalkKeys = Object.keys(keys.value).filter((key) => {
      if (!keys.value[key]) return false;
      const mapped = actionList.value.find((a) => a.key === key);
      return !!(mapped && mapped.name.toLowerCase().includes('walk'));
    });

    // fallback: если WASD/Arrow активны — тоже считаем как walk
    const fallbackWalkActive = !!(
      keys.value.ArrowLeft ||
      keys.value.ArrowRight ||
      keys.value.KeyA ||
      keys.value.KeyD
    );

    if (activeWalkKeys.length > 0 || fallbackWalkActive) {
      const action =
        keys.value['ShiftLeft'] || keys.value['ShiftRight'] || keys.value['Shift'] ? 'run' : 'walk';
      startAction(action);
    } else {
      // есть какие-то другие клавиши — выбираем их действия (например атака) или остаёмся idle
      // попробуем найти любую активную кнопку в actionList и запустить её (упрощённо)
      const activeOther = Object.keys(keys.value).find((k) => {
        return keys.value[k] && actionList.value.some((a) => a.key === k && !a.name.toLowerCase().includes('walk'));
      });
      if (activeOther) {
        const mapped = actionList.value.find((a) => a.key === activeOther);
        if (mapped) {
          startAction(mapped.name);
        }
      } else {
        stopAction();
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

      // перенести текущее состояние флага (если было)
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
      try {
        actionList.value = JSON.parse(storedActionList);
      } catch (e) {
        // ignore parse errors
      }
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
