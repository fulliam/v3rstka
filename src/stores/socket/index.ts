import { defineStore } from 'pinia';
import createWebSocket from '@/plugins/socket';
import type { Player, Position } from '@/types';
import { useChatStore } from '@/stores/chat';

interface User {
  userId: string;
  character: Player;
}

interface SocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  users: User[];
}

interface WebSocketMessage {
  type:
    | 'users'
    | 'messages'
    | 'action'
    | 'move'
    | 'change_character'
    | 'location';
  data?: any;
  update?: any;
  userId?: string;
}

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    socket: null,
    isConnected: false,
    users: [],
  }),
  actions: {
    findUserById(userId: string): User | undefined {
      return this.users.find((user) => user.userId === userId);
    },

    handleUsersUpdate(data: any) {
      this.users = data;
    },

    handleMessagesUpdate(data: any) {
      useChatStore().setMessages(data);
    },

    handleActionUpdate(update: any) {
      const user = this.findUserById(update.userId);
      if (user) {
        user.character.state.action = update.action;
      }
    },

    handleMoveUpdate(update: any) {
      const user = this.findUserById(update.userId);
      if (user) {
        user.character.state.position = update.coords;
        user.character.state.direction = update.direction;
      }
    },

    handleCharacterChange(update: any) {
      const user = this.findUserById(update.userId);
      if (user) {
        user.character.info.character = update.character;
      }
    },

    handleLocationUpdate(data: any) {
      const user = this.findUserById(data.userId);
      if (user) {
        user.character.info.location = data.location;
      }
    },

    connect(userId: string, token: string) {
      if (this.socket) {
        this.disconnect();
      }

      this.socket = createWebSocket(userId, token);

      this.socket.onopen = () => {
        this.isConnected = true;
        // console.log(`WebSocket подключен как ${userId}`);
      };

      this.socket.onclose = (event) => {
        this.isConnected = false;
        setTimeout(() => this.connect(userId, token), 5000);
        console.log(`WebSocket закрыт: ${event.code}, ${event.reason}`);
      };

      this.socket.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          const actionMap: Record<WebSocketMessage['type'], Function> = {
            users: this.handleUsersUpdate,
            messages: this.handleMessagesUpdate,
            action: this.handleActionUpdate,
            move: this.handleMoveUpdate,
            change_character: this.handleCharacterChange,
            location: this.handleLocationUpdate,
          };

          const handler = actionMap[data.type];
          if (handler) {
            handler.call(this, data.update || data.data || data);
          } else {
            // console.warn(`Неизвестный тип сообщения: ${data.type}`);
          }
        } catch (error) {
          console.error('Ошибка обработки сообщения WebSocket:', error);
        }
      };
    },

    disconnect() {
      console.log('WebSocket отключен');
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      this.isConnected = false;
      this.users = [];
    },

    sendUpdate(type: string, data: any) {
      if (
        this.socket &&
        this.isConnected &&
        this.socket.readyState === WebSocket.OPEN
      ) {
        this.socket.send(JSON.stringify({ type, ...data }));
      }
    },

    updateUserAction(userId: string, character: string, action: string) {
      this.sendUpdate('action', { userId, character, action });
    },

    updateUserLocation(userId: string, location: string) {
      this.sendUpdate('location', { userId, location });
    },

    updateUserPosition(
      userId: string,
      position: Position,
      direction: 'left' | 'right'
    ) {
      this.sendUpdate('move', { userId, position, direction });
    },

    updateUserCharacter(userId: string, character: string) {
      this.sendUpdate('change_character', { userId, character });
    },
  },
});
