import { defineStore } from 'pinia';
import { Cell, Position } from '@/types';

interface DungeonState {
  dungeon: Cell[][];
  spawnPoint: Position;
}

export const useDungeonStore = defineStore('dungeon', {
  state: (): DungeonState => ({
    dungeon: [],
    spawnPoint: { x: 0, y: 0 },
  }),
  actions: {
    setDungeon(map: Cell[][]) {
      this.dungeon = map;
    },
    setSpawnPoint(coords: Position) {
      this.spawnPoint = coords;
    },
  },
});
