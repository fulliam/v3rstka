import { defineStore } from 'pinia';
import { Cell, Position } from '@/types';
import DungeonGenerator from '@/plugins/generators/dungeon';

interface DungeonState {
  dungeon: Cell[][];
  spawnPoint: Position;
  randomPoints: Position[];
  cellSize: number;
}

export const useDungeonStore = defineStore('dungeon', {
  state: (): DungeonState => ({
    dungeon: [],
    spawnPoint: { x: 0, y: 0 },
    randomPoints: [],
    cellSize: 50,
  }),
  actions: {
    updateRandomPoints(points: Position[]) {
      this.randomPoints.push(...points);
    },

    generateDungeon(config: any, seed?: number) {
      this.dungeon = DungeonGenerator.generate(config, seed);
      this.spawnPoint = DungeonGenerator.getRandomPoints(
        this.dungeon,
        1,
        this.cellSize
      )[0];
      this.randomPoints = DungeonGenerator.getRandomPoints(
        this.dungeon,
        100,
        this.cellSize
      );
      console.log('Dungeon generated');
    },
  },

  getters: {
    getDungeon: (state) => state.dungeon,
    getCellType:
      (state) =>
      (x: number, y: number): string => {
        return state.dungeon[Math.floor(y / state.cellSize)][
          Math.floor(x / state.cellSize)
        ].cellType;
      },
  },
});
