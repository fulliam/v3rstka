import { createEnemy } from '@/plugins/generators/character/enemy';
import type { Player, Direction } from '@/types/index';

interface Enemy extends Player {
  id: string;
}

const groups = {
  orcs: ['warrior', 'berserk', 'shaman'],
  slimes: ['red', 'green', 'blue'],
};

export const useEnemyStore = defineStore('enemy', {
  state: () => ({
    enemies: [] as Enemy[],
    enemyPaths: [] as { id: string; path: { x: number; y: number }[] }[],
  }),

  actions: {
    createEnemy(group?: keyof typeof groups, name?: string) {
      const newEnemy: Enemy = {
        ...createEnemy(group, name),
        id: this.generateUniqueId(),
      };
      this.enemies.push(newEnemy);
    },

    removeEnemy(id: string) {
      this.enemies = this.enemies.filter((enemy) => enemy.id !== id);
    },

    clearEnemies() {
      this.enemies = [];
    },

    isPositionOccupied(x: number, y: number, excludeId?: string) {
      return this.getEnemies.some(
        (enemy) =>
          enemy.state.position.x === x &&
          enemy.state.position.y === y &&
          enemy.id !== excludeId
      );
    },

    updateEnemyState(id: string, newState: Partial<Enemy>) {
      const enemy = this.enemies.find((enemy) => enemy.id === id);
      if (enemy) {
        Object.assign(enemy, newState);
      }
    },

    updateEnemyPosition(id: string, newPosition: { x: number; y: number }) {
      const enemy = this.enemies.find((enemy) => enemy.id === id);
      if (enemy) {
        enemy.state.position = newPosition;
      }
    },

    updateEnemyDirection(id: string, newDirection: Direction) {
      const enemy = this.enemies.find((enemy) => enemy.id === id);
      if (enemy) {
        enemy.state.direction = newDirection;
      }
    },

    updateEnemyAction(id: string, newAction: string) {
      const enemy = this.enemies.find((enemy) => enemy.id === id);
      if (enemy) {
        enemy.state.action = newAction;
      }
    },

    generateUniqueId(): string {
      return `enemy-${Math.random().toString(36).substr(2, 9)}`;
    },

    setEnemyPaths(path: { id: string; path: { x: number; y: number }[] }) {
      const existingIndex = this.enemyPaths.findIndex((p) => p.id === path.id);
      if (existingIndex !== -1) {
        this.enemyPaths[existingIndex] = path;
      } else {
        this.enemyPaths.push(path);
      }
    },
  },

  getters: {
    enemyCount: (state) => state.enemies.length,
    getEnemies: (state) => state.enemies,
    getEnemyById: (state) => (id: string) =>
      state.enemies.find((enemy) => enemy.id === id),
  },
});
