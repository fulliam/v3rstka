<template>
  <!-- <div v-if="false">
    <p>Connected: {{ isConnected }}</p>
    <div class="tabs">
      <button
        :class="{ active: currentTab === 'Gameplay' }"
        @click="currentTab = 'Gameplay'"
      >
        Gameplay
      </button>
      <button
        :class="{ active: currentTab === 'enemy' }"
        @click="currentTab = 'enemy'"
      >
        Enemy
      </button>
      <button
        :class="{ active: currentTab === 'chat' }"
        @click="currentTab = 'chat'"
      >
        Chat
      </button>
    </div>

    <div class="chat-wrapper" v-if="currentTab === 'chat'">
      <div class="user-list">
        <div
          v-for="user in usersInSameLocation"
          :key="user.userId"
          class="user-card"
        >
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

  <div class="viewers" v-if="currentTab === 'Gameplay'"></div> -->

  <Dungeon :seed="location">
    <template #characters>
      <Character
        v-for="user in usersInSameLocation"
        :key="user.userId"
        :user-id="user.userId"
        :is-own="user.userId === userId"
        :character="user.character"
      />
    </template>
    <template #enemies>
      <BotViewer
        v-for="enemy in enemiesInLocation"
        :key="enemy.id"
        :enemy="enemy"
      />
    </template>
  </Dungeon>
</template>

<script setup lang="ts">
import Character from '@/components/templates/character/online/index.vue';
import BotViewer from '@/views/game/online/tmp/BotViewer.vue';
// import ChatViewer from '@/views/game/online/tmp/ChatViewer.vue';
import Dungeon from '@/components/templates/dungeon/index.vue';
import { useSocketStore } from '@/stores/socket';
import { useAuthStore } from '@/stores/auth'; // may be add userStore for give userId ( now = username )
// import animations from '@/animations.json';

const socketStore = useSocketStore();
const authStore = useAuthStore();

// const currentTab = ref<'Gameplay' | 'enemy' | 'chat'>('Gameplay');
const userId = ref<string>('');
// const isConnected = computed(() => socketStore.isConnected);

// const characters = ref(Object.keys((animations as any).char['ally']));

// const selectCharacter = (character: string) => {
//   socketStore.updateUserCharacter(userId.value, character);
// };

onMounted(async () => {
  if (authStore.isAuthenticated && authStore.token && authStore.username) {
    userId.value = authStore.username;
    await socketStore.connect(userId.value, authStore.token);
  } else {
    console.log('no auth');
  }
});

onUnmounted(() => {
  socketStore.disconnect();
});

const location = ref('');

const usersInSameLocation = computed(() => {
  const ownUser = socketStore.users.find(
    (user) => user.userId === userId.value
  );
  if (!ownUser) return [];
  location.value = ownUser.character.info.location;
  return socketStore.users.filter(
    (user) => user.character.info.location === location.value
  );
});

const enemiesInLocation = computed(() => {
  return socketStore.enemies.filter(
    (enemy) => enemy.info.location === location.value
  );
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

.character-state {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.character-state h3 {
  margin-bottom: 10px;
}

.character-state ul {
  list-style-type: none;
  padding: 0;
}

.character-state li {
  margin-bottom: 5px;
  font-size: 14px;
}
</style>
