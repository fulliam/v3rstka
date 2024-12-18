import { defineStore } from 'pinia';
import { createDefaultPlayer } from '@/plugins/generators/character/player';
import {
  calculateHealth,
  calculateMana,
  calculateStamina,
  calculateCrit,
  calculateDamage,
} from '@/plugins/generators/character/params';
import type { Player, Position, Direction } from '@/types';

const STORAGE_KEY = 'playerData';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    player: {} as Player,
  }),

  getters: {
    getPlayer: (state) => state.player,
    getPlayerHealth: (state) => state.player.state.health,
    getPlayerMana: (state) => state.player.state.mana,
    getPlayerStamina: (state) => state.player.state.stamina,
    getPlayerInventory: (state) => state.player.inventory,
    getPlayerStats: (state) => state.player.stats,
    getPlayerState: (state) => state.player.state,
    getCurrentCharacter: (state) => state.player.info.character,
  },

  actions: {
    initializePlayer() {
      const storedPlayer = localStorage.getItem(STORAGE_KEY);
      if (storedPlayer) {
        this.player = JSON.parse(storedPlayer);
      } else {
        this.createPlayer('wizard');
      }
    },

    resetPlayer() {
      this.player = {} as Player;
      this.savePlayer();
    },

    savePlayer() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.player));
    },

    createPlayer(characterType: string) {
      this.player = createDefaultPlayer(characterType);
      this.updateDerivedAttributes();
    },

    setPlayerState(newState: Partial<Player['state']>) {
      this.player.state = { ...this.player.state, ...newState };
      this.updateDerivedAttributes();
    },

    addItemToInventory(item: any) {
      this.player.inventory.inventory.push(item);
      this.savePlayer();
    },

    updatePlayerPosition(newPosition: Position, direction: Direction) {
      this.player.state.position = { ...newPosition };
      this.player.state.direction = direction;
      this.savePlayer();
    },

    updatePlayerAction(newAction: string) {
      if (this.player.state) {
        this.player.state.action = newAction;
        this.savePlayer();
      }
    },

    updatePlayerStats(
      newStats: Partial<Player['stats'] & { statPoints?: number }>
    ) {
      this.player.stats = {
        ...this.player.stats,
        ...newStats,
      };
      this.updateDerivedAttributes();
    },

    updateDerivedAttributes() {
      const { strength, agility, intelligence, stamina, luck } =
        this.player.stats.params;
      const level = this.player.info.level;

      this.player.state.health = calculateHealth(stamina, level);
      this.player.state.mana = calculateMana(intelligence, level);
      this.player.state.stamina = calculateStamina(stamina, agility, level);

      this.player.stats.crit = calculateCrit(luck, agility);

      Object.keys(this.player.stats.attacks).forEach((attackKey) => {
        const attack = this.player.stats.attacks[attackKey];
        attack.damage = calculateDamage(
          strength,
          agility,
          intelligence,
          attack
        );
      });

      this.savePlayer();
    },
  },
});
