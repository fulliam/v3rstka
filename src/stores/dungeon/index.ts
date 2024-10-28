import { defineStore } from 'pinia';
import { Cell, Position } from '@/types';

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
    setDungeon(map: Cell[][]) {
      this.dungeon = map;
    },

    setRandomPoints(points: Position[]) {
      this.randomPoints = points;
    },

    setSpawnPoint(coords: Position) {
      this.spawnPoint = coords;
    },
  },

  getters: {
    getCellType:
      (state) =>
      (x: number, y: number): string => {
        return state.dungeon[Math.floor(y / state.cellSize)][
          Math.floor(x / state.cellSize)
        ].cellType;
      },
  },
});
