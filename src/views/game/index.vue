<template>
  <div v-if="true">
    <p>Connected: {{ isConnected }}</p>
    <div class="tabs">
      <button :class="{ active: currentTab === 'Gameplay' }" @click="currentTab = 'Gameplay'">Gameplay</button>
      <button :class="{ active: currentTab === 'enemy' }" @click="currentTab = 'enemy'">Enemy</button>
      <button :class="{ active: currentTab === 'chat' }" @click="currentTab = 'chat'">Chat</button>
    </div>

    <div class="chat-wrapper" v-if="currentTab === 'chat'">
      <div class="user-list">
        <div v-for="user in usersInSameLocation" :key="user.userId" class="user-card">
          <div class="user-chat-image"></div>
          <p>{{ user.userId }}</p>
          <p><strong>Character:</strong> {{ user.character.info.character }}</p>
          <p><strong>Action:</strong> {{ user.character.state.action }}</p>
          <p><strong>Location:</strong> {{ user.character.info.location }}</p>
        </div>
      </div>
      <ChatViewer />
    </div>

    <div class="menu">
      <button
        v-for="character in characters"
        :key="character"
        @click="selectCharacter(character)"
      >
        {{ character }}
      </button>
    </div>
  </div>

  <div class="viewers" v-if="currentTab === 'Gameplay'">
    <CharacterViewer
      v-for="user in usersInSameLocation"
      :key="user.userId"
      :user-id="user.userId"
      :is-own="user.userId === ownUserId"
      :character="user.character"
    />
  </div>

  <Dungeon />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import CharacterViewer from '@/components/CharacterViewer.vue';
import ChatViewer from '@/components/ChatViewer.vue';
import Dungeon from '@/components/Dungeon.vue';
import { useSocketStore } from '@/stores/socket';
import animations from '@/animations.json';

const currentUserId = ref<string>('');
const determineUserId = () => {
  const users = ['Kelly', 'Roh'];
  const randomIndex = Math.floor(Math.random() * users.length);
  currentUserId.value = users[randomIndex];
  if (!currentUserId.value) {
    return users[randomIndex];
  } else {
    if (currentUserId.value === 'Kelly') return 'Roh'
    else return 'Kelly'
  }
};

const currentTab = ref<'Gameplay' | 'enemy' | 'chat'>('Gameplay');
const socketStore = useSocketStore();
const ownUserId = ref<string>(determineUserId());

const characters = ref(Object.keys((animations as any).char['ally']));

const selectCharacter = (character: string) => {
  socketStore.updateUserCharacter(currentUserId.value, character);
};

onMounted(() => {
  socketStore.connect(ownUserId.value);
});

onUnmounted(() => {
  socketStore.disconnect();
});

const isConnected = computed(() => socketStore.isConnected);

const usersInSameLocation = computed(() => {
  const ownUser = socketStore.users.find(user => user.userId === ownUserId.value);
  if (!ownUser) return [];
  const location = ownUser.character.info.location;
  return socketStore.users.filter(user => user.character.info.location === location);
});
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  & button {
    margin: 5px;
    padding: 10px;
    cursor: pointer;

    &.active {
      background-color: blueviolet;
      color: white;
      border: none;
      border-radius: 4px;
    }
  }
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.user-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.user-chat-image {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 5px;
  width: 48px;
  height: 48px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-card p {
  margin: 5px 0;
}

.viewers {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
}

.chat-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
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

</style>
