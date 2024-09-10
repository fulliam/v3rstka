import { defineStore } from 'pinia';

interface Message {
  userId: string;
  content: string;
}

interface MessageState {
  messages: Message[];
}

export const useChatStore = defineStore('chat', {
  state: (): MessageState => ({
    messages: [],
  }),
  actions: {
    setMessages(messages: Message[]) {
      this.messages = messages;
    },
    addMessage(message: Message) {
      this.messages.push(message);
    },
  },
});
