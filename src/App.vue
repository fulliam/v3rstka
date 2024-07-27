<template>
  <div class="tabs">
    <button :class="{ active: currentTab === 'ally' }" @click="currentTab = 'ally'">Ally</button>
    <button :class="{ active: currentTab === 'enemy' }" @click="currentTab = 'enemy'">Enemy</button>
  </div>
  {{ isConnected }}<br/>
  {{ socketStore.users }}<br/>
  {{ ownUserId }}<br/>
  <div class="viewers">
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
import { useSocketStore } from './stores/socket';

const currentTab = ref<'ally' | 'enemy'>('ally');
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

<style scoped>
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
    }
  }
}

.viewers {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
</style>
