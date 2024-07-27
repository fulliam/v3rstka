<template>
  <div class="character-viewer" v-if="category">


    <div class="animation">
      <img :src="currentFrame" alt="Character Animation Frame" />
    </div>

    <div class="menu" v-if="isOwn">
      <button
        v-for="character in characters"
        :key="character"
        @click="selectCharacter(character)"
      >
        {{ character }}
      </button>
    </div>
    
    <div class="actions" v-if="isOwn">
      <button
        v-for="action in actions"
        :key="action"
        @mousedown="startAction(action)"
        @mouseup="stopAction"
        @mouseleave="stopAction"
      >
        {{ action }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
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
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

const socketStore = useSocketStore();

const characters = ref(Object.keys(animations.char[props.category]));
const currentCharacter = ref(props.character);
const currentAnimation = ref(props.action);
const actions = ref(Object.keys(animations.char[props.category][currentCharacter.value]));

const frames = ref<string[]>([]);
const currentFrame = ref<string>('');
let frameIndex = 0;
let animationInterval: NodeJS.Timeout;

const preloadImages = (frameList: string[]) => {
  return frameList.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });
};

const updateFrames = () => {
  frames.value = Object.values(animations.char[props.category][currentCharacter.value][currentAnimation.value]);
  preloadImages(frames.value);
  currentFrame.value = frames.value[0];
  frameIndex = 0;
};

const startAnimation = () => {
  clearInterval(animationInterval);
  animationInterval = setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.value.length;
    currentFrame.value = frames.value[frameIndex];
  }, 1000 / 10); // 10 fps
};

const selectCharacter = (character: string) => {
  currentCharacter.value = character;
  actions.value = Object.keys(animations.char[props.category][character]);
  currentAnimation.value = 'idle';
  socketStore.sendMessage(JSON.stringify({ userId: props.userId, character, action: 'idle' }));
  updateFrames();
};

const startAction = (action: string) => {
  currentAnimation.value = action;
  socketStore.sendMessage(JSON.stringify({ userId: props.userId, character: currentCharacter.value, action }));
  updateFrames();
  startAnimation();
};

const stopAction = () => {
  currentAnimation.value = 'idle';
  socketStore.sendMessage(JSON.stringify({ userId: props.userId, character: currentCharacter.value, action: 'idle' }));
  updateFrames();
  startAnimation();
};

watch(() => props.character, (newCharacter) => {
  currentCharacter.value = newCharacter;
  actions.value = Object.keys(animations.char[props.category][newCharacter]);
  updateFrames();
});

watch(() => props.action, (newAction) => {
  currentAnimation.value = newAction;
  updateFrames();
});

watch(() => props.category, () => {
  characters.value = Object.keys(animations.char[props.category]);
  currentCharacter.value = characters.value[0];
  actions.value = Object.keys(animations.char[props.category][currentCharacter.value]);
  updateFrames();
});

onMounted(() => {
  updateFrames();
  startAnimation();
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
