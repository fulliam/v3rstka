import { useSocketStore } from '@/stores/socket';
import { usePlayerStore } from '@/stores/player';
import { useAudio } from '@/composables/sound';

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

  const { play, register } = useAudio();

  onMounted(() => {
    register(
      {
        jump: '/src/sounds/RPG_Essentials_Free/12_Player_Movement_SFX/30_Jump_03.wav',
        land: '/src/sounds/RPG_Essentials_Free/12_Player_Movement_SFX/45_Landing_01.wav',
        attack: [
          '/src/sounds/RPG_Essentials_Free/10_Battle_SFX/22_Slash_04.wav',
          '/src/sounds/RPG_Essentials_Free/10_Battle_SFX/03_Claw_03.wav',
        ],
        attack_magic:
          '/src/sounds/RPG_Essentials_Free/8_Atk_Magic_SFX/18_Thunder_02.wav',
        fireball:
          '/src/sounds/RPG_Essentials_Free/8_Atk_Magic_SFX/04_Fire_explosion_04_medium.wav',
        heal: '/src/sounds/RPG_Essentials_Free/8_Buffs_Heals_SFX/02_Heal_02.wav',
        menu_open:
          '/src/sounds/RPG_Essentials_Free/10_UI_Menu_SFX/092_Pause_04.wav',
        menu_close:
          '/src/sounds/RPG_Essentials_Free/10_UI_Menu_SFX/098_Unpause_04.wav',
        click:
          '/src/sounds/RPG_Essentials_Free/10_UI_Menu_SFX/001_Hover_01.wav',
        confirm:
          '/src/sounds/RPG_Essentials_Free/10_UI_Menu_SFX/013_Confirm_03.wav',
        deny: '/src/sounds/RPG_Essentials_Free/10_UI_Menu_SFX/029_Decline_09.wav',
      },
      { overwrite: true }
    );
  });

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

  const playSoundForAction = (action: string) => {
    const soundMap: Record<string, string> = {
      jump: 'jump',
      attack: 'attack',
      attack2: 'attack_magic',
      attack3: 'fireball',
      heal: 'heal',
    };

    const soundId = soundMap[action];
    if (!soundId) return;

    const audio = play(soundId);
    if (audio) {
      audio.addEventListener(
        'ended',
        () => {
          console.log(`[Sound] ${soundId} ended`);
        },
        { once: true }
      );
    }
  };

  const startAction = (action: string) => {
    // 🔹 Проверяем текущее состояние игрока
    const currentAction = playerStore.getPlayer?.state?.action;

    // 🔸 Если уже в прыжке — не меняем действие на walk/run
    if (currentAction === 'jump' && (action === 'walk' || action === 'run')) {
      return; // игнорируем
    }
      
    if (online) {
      socketStore.updateUserAction(userId, character?.info?.character, action);
    } else {
      playerStore.updatePlayerAction(action);
    }

    playSoundForAction(action);
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

    keys.value[event.code] = true;

    const actionEntry = actionList.value.find((a) => a.key === event.code);
    if (actionEntry) {
      const action = actionEntry.name.toLowerCase().includes('walk')
        ? 'walk'
        : actionEntry.name;
      const isRunning =
        !!(
          keys.value['ShiftLeft'] ||
          keys.value['ShiftRight'] ||
          keys.value['Shift']
        ) && action === 'walk';
      startAction(isRunning ? 'run' : action);
    } else {
      if (
        event.code === 'ShiftLeft' ||
        event.code === 'ShiftRight' ||
        event.code === 'Shift'
      ) {
        const anyWalkPressed =
          actionList.value.some(
            (a) => a.name.toLowerCase().includes('walk') && keys.value[a.key]
          ) ||
          keys.value.ArrowLeft ||
          keys.value.ArrowRight ||
          keys.value.KeyA ||
          keys.value.KeyD;
        if (anyWalkPressed) startAction('run');
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (online && !isOwn) return;

    keys.value[event.code] = false;

    if (!Object.keys(keys.value).some((k) => keys.value[k])) {
      stopAction();
      return;
    }

    const activeWalkKeys = Object.keys(keys.value).filter((key) => {
      if (!keys.value[key]) return false;
      const mapped = actionList.value.find((a) => a.key === key);
      return !!(mapped && mapped.name.toLowerCase().includes('walk'));
    });

    const fallbackWalkActive = !!(
      keys.value.ArrowLeft ||
      keys.value.ArrowRight ||
      keys.value.KeyA ||
      keys.value.KeyD
    );

    if (activeWalkKeys.length > 0 || fallbackWalkActive) {
      const action =
        keys.value['ShiftLeft'] ||
        keys.value['ShiftRight'] ||
        keys.value['Shift']
          ? 'run'
          : 'walk';
      startAction(action);
    } else {
      const activeOther = Object.keys(keys.value).find((k) => {
        return (
          keys.value[k] &&
          actionList.value.some(
            (a) => a.key === k && !a.name.toLowerCase().includes('walk')
          )
        );
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
    (window as any).keys = keys.value;
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
