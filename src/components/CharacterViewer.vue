<template>
  <div class="character-viewer" v-if="category">
    <div class="menu" v-if="isOwn">
      <button
        v-for="character in characters"
        :key="character"
        @click="selectCharacter(character)"
      >
        {{ character }}
      </button>
    </div>

    <div class="animation" :style="{position: 'relative', left: `${props.position.x}`, top: `${props.position.y}`}">
      <img :src="currentFrame" alt="Character Animation Frame" />
    </div>
    {{ position }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useSocketStore } from '../stores/socket';
import animations from '../animations.json';

const props = defineProps({
  category: {
    type: String,
    required: true,
    default: 'ally',
  },
  userId: {
    type: String,
    required: true,
  },
  isOwn: {
    type: Boolean,
    required: true,
  },
  character: {
    type: Object,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  }
});

const socketStore = useSocketStore();

const characters = ref(Object.keys((animations as any).char[props.category]));
const actions = ref(Object.keys((animations as any).char[props.category][props.character.info.character]));

const frames = ref<string[]>([]);
const currentFrame = ref<string>('');
let frameIndex = 0;
let animationInterval: NodeJS.Timeout;

const preloadImages = (frameList: string[]) => {
  const promises = frameList.map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image ${src}`));
    });
  });

  return Promise.all(promises);
};

const updateFrames = async () => {
  frames.value = Object.values((animations as any).char[props.category][props.character.info.character][props.action]);
  await preloadImages(frames.value);
  currentFrame.value = frames.value[0];
  frameIndex = 0;
};

const startAnimation = () => {
  let lastTime = 0;
  const frameDuration = 1000 / 10; // 10 fps

  const animate = (timestamp: number) => {
    if (lastTime === 0) lastTime = timestamp;

    const deltaTime = timestamp - lastTime;

    if (deltaTime >= frameDuration) {
      frameIndex = (frameIndex + 1) % frames.value.length;
      currentFrame.value = frames.value[frameIndex];
      lastTime = timestamp;
    }

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const selectCharacter = (character: string) => {
  actions.value = Object.keys((animations as any).char[props.category][character]);
  socketStore.updateUserAction(props.userId, character, 'idle');
};

const startAction = (action: string) => {
  socketStore.updateUserAction(props.userId, props.character.info.character, action);
};

const stopAction = () => {
  socketStore.updateUserAction(props.userId, props.character.info.character, 'idle');
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.isOwn) return;

  handleMovement(event);

  const actionMap: { [key: string]: string } = {
    KeyW: 'jump',
    KeyA: 'walk',
    KeyS: 'walk', 
    KeyD: 'walk',
    Space: 'attack',
    KeyX: 'jump',
  };

  const combinedActionMap: { [key: string]: string } = {
    'Space+Shift': 'attack',
    'Space+Control': 'attack2',
    'KeyA+Shift': 'run',
    'KeyD+Shift': 'run',
  };

  let action = actionMap[event.code];

  if (!action) {
    const combinedAction = `${event.code}${event.shiftKey ? '+Shift' : ''}${event.ctrlKey ? '+Control' : ''}`;
    action = combinedActionMap[combinedAction];
  }

  if (action) {
    startAction(action);
  }
};

const handleMovement = (event: KeyboardEvent) => {
    if (!props.isOwn) return;

    let newPosition = { ...props.character.state.position };

    switch (event.code) {
        case 'KeyW':
            newPosition.y -= 1;
            break;
        case 'KeyS':
            newPosition.y += 1;
            break;
        case 'KeyA':
            newPosition.x -= 1;
            break;
        case 'KeyD':
            newPosition.x += 1;
            break;
    }

    socketStore.updateUserPosition(props.userId, newPosition);
};

const handleKeyUp = () => {
  stopAction();
};

watch(() => props.character, (newCharacter) => {
  actions.value = Object.keys((animations as any).char[props.category][newCharacter.info.character]);
  updateFrames();
});

watch(() => props.action, () => {
  updateFrames();
});

watch(() => props.category, () => {
  characters.value = Object.keys((animations as any).char[props.category]);
  actions.value = Object.keys((animations as any).char[props.category][props.character.info.character]);
  updateFrames();
});

onMounted(() => {
  updateFrames();
  startAnimation();
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  clearInterval(animationInterval);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>

<style scoped>
.character-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
  margin-bottom: 20px;
}

.menu button {
  margin: 0 5px;
}

.actions {
  margin-bottom: 20px;
}

.actions button {
  margin: 0 5px;
}

.animation img {
  width: 100px;
  height: auto;
}

.messages {
  margin-top: 20px;
}

.messages input {
  margin-top: 10px;
}
</style>
