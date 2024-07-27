import { defineStore } from 'pinia';
import createWebSocket from '../../plugins/socket';

interface User {
  userId: string;
  character: string;
  action: string;
}

interface Message {
  userId: string;
  content: string;
}

interface SocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  users: User[];
}

interface MessageState {
  messages: Message[];
}

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    socket: null,
    isConnected: false,
    users: [],
  }),
  actions: {
    connect(userId: string) {
      if (this.socket) {
        this.disconnect();
      }

      this.socket = createWebSocket(userId);

      this.socket.onopen = () => {
        this.isConnected = true;
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.users = [];
      };

      this.socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === "users") {
          this.users = data.data;
        } else if (data.type === "messages") {
          useMessageStore().setMessages(data.data);
        }
      };
    },
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.isConnected = false;
        this.socket = null;
      }
    },
    sendMessage(message: string) {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify({ type: "message", content: message }));
      }
    },
    updateUser(userId: string, character: string, action: string) {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify({ type: "action", userId, character, action }));
      }
    },
  },
});

export const useMessageStore = defineStore('message', {
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
