<template>
  <div class="tabs">
    <button :class="{ active: currentTab === 'ally' }" @click="currentTab = 'ally'">Ally</button>
    <button :class="{ active: currentTab === 'enemy' }" @click="currentTab = 'enemy'">Enemy</button>
    <button :class="{ active: currentTab === 'chat' }" @click="currentTab = 'chat'">Chat</button>
  </div>

  <div class="chat-wrapper" v-if="currentTab === 'chat'">
    <div class="user-list">
      <div v-for="user in socketStore.users" :key="user.userId" class="user-card">
        <div class="user-chat-image">

        </div>
        <p>{{ user.userId }}</p>
        <p><strong>Character:</strong> {{ user.character }}</p>
        <p><strong>Action:</strong> {{ user.action }}</p>
      </div>
    </div>
    <ChatViewer />
  </div>
{{ socketStore.users }}
  <div class="viewers" v-if="currentTab === 'ally'">
    <CharacterViewer
      v-for="user in socketStore.users"
      :key="user.userId"
      :user-id="user.userId"
      :category="currentTab"
      :is-own="user.userId === ownUserId"
      :character="user.character"
      :action="user.action"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import CharacterViewer from './components/CharacterViewer.vue';
import ChatViewer from './components/ChatViewer.vue';
import { useSocketStore } from './stores/socket';

const currentTab = ref<'ally' | 'enemy' | 'chat'>('ally');
const socketStore = useSocketStore();
const ownUserId = ref<string>(String(Math.random()));

onMounted(() => {
  socketStore.connect(ownUserId.value);
});

onUnmounted(() => {
  socketStore.disconnect();
});

const isConnected = computed(() => socketStore.isConnected);
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
</style>
