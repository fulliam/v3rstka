import { defineStore } from 'pinia';

interface CharacterState {
  userId: string;
  character: string;
  action: string;
}

export const useCharacterStore = defineStore('character', {
  state: (): CharacterState => ({
    userId: '',
    character: 'wizard',
    action: 'idle',
  }),
  actions: {
    setUserId(userId: string) {
      this.userId = userId;
    },
    selectCharacter(character: string) {
      this.character = character;
    },
    setAction(action: string) {
      this.action = action;
    },
  },
});
