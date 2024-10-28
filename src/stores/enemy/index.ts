import { defineStore } from 'pinia';
import { createRandomEnemy } from '@/plugins/generators/character/enemy';
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
  }),

  actions: {
    createEnemy(group?: keyof typeof groups, name?: string) {
      const newEnemy: Enemy = {
        ...createRandomEnemy(group, name),
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
  },

  getters: {
    enemyCount: (state) => state.enemies.length,
    getEnemies: (state) => state.enemies,
    getEnemyById: (state) => (id: string) =>
      state.enemies.find((enemy) => enemy.id === id),
  },
});
