import { defineStore } from 'pinia';
import createWebSocket from '../../plugins/socket';

interface User {
  userId: string;
  character: string;
  action: string;
}

interface SocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  messages: string[];
  users: User[];
}

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    socket: null,
    isConnected: false,
    messages: [],
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
        this.addUser({ userId, character: 'wizard', action: 'idle' });
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.removeUser(userId);
      };

      this.socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === "users") {
          this.users = data.data;
        } else {
          this.messages.push(data.message);
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
        this.socket.send(message);
      }
    },
    addUser(user: User) {
      if (!this.users.some(u => u.userId === user.userId)) {
        this.users.push(user);
      }
    },
    removeUser(userId: string) {
      this.users = this.users.filter(user => user.userId !== userId);
    },
  },
});
