import createWebSocket from '@/plugins/socket';
import type { Player, Position, Attack, Direction } from '@/types';
import { useChatStore } from '@/stores/chat';
import { useDungeonStore } from '@/stores/dungeon';

interface User {
  userId: string;
  character: Player;
}

interface SocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  users: User[];
  enemies: any[];
}

interface WebSocketMessage {
  type:
    | 'users'
    | 'messages'
    | 'action'
    | 'move'
    | 'change_character'
    | 'location'
    | 'attack'
    | 'health_recovery'
    | 'initial_enemies';
  data?: any;
  update?: any;
  userId?: string;
}

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    socket: null,
    isConnected: false,
    users: [],
    enemies: [],
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

    handleAttackUpdate(update: any) {
      update.affectedUsers.forEach(
        (affectedUser: { userId: string; health: number }) => {
          const user = this.findUserById(affectedUser.userId);
          if (user) {
            user.character.state.health.current = affectedUser.health;
          }
        }
      );
    },

    handleHealthUpdate(update: any) {
      const user = this.findUserById(update.userId);
      if (user) {
        user.character.state.health.current = update.health.current;
        user.character.state.health.max = update.health.max;
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

    handleEnemiesUpdate(data: any) {
      this.enemies = data.enemies;

      const dungeonStore = useDungeonStore();
      const points = dungeonStore.randomPoints.slice();

      this.enemies.forEach((enemy: any) => {
        if (points.length > 0) {
          const randomIndex = Math.floor(Math.random() * points.length);
          const randomPoint = points.splice(randomIndex, 1)[0];
          enemy.state.position = randomPoint;
        } else {
          enemy.state.position = { x: 0, y: 0 };
        }
      });
    },

    async connect(userId: string, token: string) {
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
            attack: this.handleAttackUpdate,
            health_recovery: this.handleHealthUpdate,

            initial_enemies: this.handleEnemiesUpdate,
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

    async disconnect() {
      console.log('WebSocket отключен');
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      this.isConnected = false;
      this.users = [];
    },

    async sendUpdate(type: string, data: any) {
      if (
        this.socket &&
        this.isConnected &&
        this.socket.readyState === WebSocket.OPEN &&
        this.findUserById(data.userId)?.character.state.action !== 'dead'
      ) {
        this.socket.send(JSON.stringify({ type, ...data }));
      }
    },

    async updateUserAttack(userId: string, attack: Attack) {
      this.sendUpdate('attack', { userId, attack });
    },

    async updateUserAction(userId: string, character: string, action: string) {
      await this.sendUpdate('action', { userId, character, action });
    },

    async updateUserLocation(userId: string, location: string) {
      await this.sendUpdate('location', { userId, location });
    },

    async updateUserPosition(
      userId: string,
      position: Position,
      direction: Direction
    ) {
      await this.sendUpdate('move', { userId, position, direction });
    },

    async updateUserCharacter(userId: string, character: string) {
      await this.sendUpdate('change_character', { userId, character });
    },
  },
});
