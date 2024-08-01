import { defineStore } from 'pinia';

type Cell = { cellType: 'wall' | 'empty' };

interface DungeonState {
    dungeon: Cell[][];
    spawnPoint: { x: number, y: number };
}

export const useDungeonStore = defineStore('dungeon', {
    state: (): DungeonState => ({
      dungeon: [],
      spawnPoint: { x: 0, y: 0 }
    }),
    actions: {
      setDungeon(map: Cell[][]) {
        this.dungeon = map;
      },
      setSpawnPoint(coords: { x: number, y: number }) {
        this.spawnPoint = coords;
      },
    }
});
  