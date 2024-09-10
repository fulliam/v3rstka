<template>
  <div class="chat-container">
    <div ref="messagesContainer" class="messages">
      <div
        v-for="message in messages"
        :key="message.userId + message.content"
        class="message"
      >
        <strong style="color: blueviolet">{{ message.userId }}:</strong>
        {{ message.content }}
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUpdated } from 'vue';
import { useSocketStore } from '@/stores/socket';
import { useChatStore } from '@/stores/chat';

const socketStore = useSocketStore();
const chatStore = useChatStore();
const newMessage = ref<string>('');

const messages = computed(() => chatStore.messages);
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onUpdated(() => {
  scrollToBottom();
});

const sendMessage = () => {
  if (newMessage.value.trim()) {
    socketStore.sendUpdate('message', { content: newMessage.value });
    newMessage.value = '';
    scrollToBottom();
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  min-height: 300px;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  max-height: 200px;
}

.message {
  margin-bottom: 5px;
  text-align: start;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
