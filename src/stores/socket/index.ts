import { defineStore } from 'pinia';
import createWebSocket from '../../plugins/socket';
import type { Player, Position } from '../../types/types';

interface User {
  userId: string;
  character: Player;
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
        if (data.type === 'users') {
          this.users = data.data;
        } else if (data.type === 'messages') {
          useMessageStore().setMessages(data.data);
        } else if (data.type === 'action') {
          const userIndex = this.users.findIndex(user => user.userId === data.update.userId);
          if (userIndex !== -1) {
            this.users[userIndex].character.state.action = data.update.action;
          }
        } else if (data.type === 'move') {
          const userIndex = this.users.findIndex(user => user.userId === data.update.userId);
          if (userIndex !== -1) {
            this.users[userIndex].character.state.position = data.update.coords;
          }
        } else if (data.type === 'location') {
          const userIndex = this.users.findIndex(user => user.userId === data.userId);
          if (userIndex !== -1) {
            this.users[userIndex].character.info.location = data.location;
          }
        }
      };
    },
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
      this.isConnected = false;
      this.users = [];
    },
    updateUserAction(userId: string, character: string, action: string) {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: 'action',
            userId,
            character,
            action,
          })
        );
      }
    },
    updateUserLocation(userId: string, location: string) {
      if (this.socket) {
        this.socket.send(
          JSON.stringify({
            type: 'location',
            userId,
            location,
          })
        );
      }
    },
    updateUserPosition(userId: string, position: Position) {
      if (this.socket) {
          this.socket.send(
              JSON.stringify({
                  type: 'move',
                  userId,
                  position,
              })
          );
      }
    },
    sendMessage(message: string) {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify({ type: "message", content: message }));
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
