<template>
  <div class="step-two">
    <table>
      <thead>
        <tr>
          <th>
            <h2><span class="title">Skills</span></h2>
          </th>
          <th>
            <h2>
              <TextScramble
                v-if="playScramble"
                :phrases="[currentCharacter]"
              />
              <span v-else>{{ currentCharacter }}</span>
            </h2>
          </th>
          <th>
            <h2><span class="title">Attacks</span></h2>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="skills">
            <Chart
              style="scale: 1.3"
              :size="[400, 300]"
              :step="1"
              :values="normalizedStats"
              :showAxisLabels="true"
              :animate="playScramble"
            />
          </td>
          <td class="stats">
            <div class="points">
              <p>Stat Points: {{ playerStore.getPlayerStats?.statPoints }}</p>
            </div>
            <ul>
              <li
                v-for="(value, stat) in playerStore.getPlayerStats.params"
                :key="stat"
              >
                <span class="stat-name">{{ stat }}:</span>
                <div>
                  <button
                    :disabled="value <= 2"
                    @click="decreaseStat(stat)"
                  >
                    -
                  </button>
                  <span class="stat-value">{{ value }}</span>
                  <button
                    :disabled="playerStore.getPlayerStats.statPoints === 0"
                    @click="increaseStat(stat)"
                  >
                    +
                  </button>
                </div>
              </li>
            </ul>
          </td>
          <td class="attacks">
            <div
              v-for="(attack, index) in attacks[currentCharacter]"
              :key="index"
              class="attacks-wrapper"
            >
              <div class="attack">
                <img
                  class="attack-image"
                  :src="`/src/assets/char/ally/${currentCharacter}/skills/${attack.image}`"
                  :alt="attack.name"
                />
                <img
                  class="sparkles"
                  :src="`/src/assets/images/sparkles.webp`"
                  alt="sparkles"
                />
              </div>

              <Hearths
                :hearts="attack.damage"
                style="--color-heart-background: #828282"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="buttons">
    <Button
      class="continue-button"
      type="base"
      :label="'BACK'"
      :action="goToStepOne"
    />
    <Button
      class="continue-button"
      type="base"
      :label="'CONTINUE'"
      :action="() => $router.push('/offline_game')"
      :disabled="playerStore.getPlayerStats?.statPoints > 0"
    />
  </div>

  <!-- <div style="display: flex; gap: 40px">
    <JsonView :json-data="playerStore.getPlayerState" />
    <JsonView :json-data="playerStore.getPlayerStats" />
  </div> -->
</template>

<script setup lang="ts">
import Chart from '@/components/partials/chart/index.vue';
import TextScramble from '@/components/partials/animations/scramble/index.vue';
import Hearths from '@/components/partials/hearths/index.vue';
import { attacks } from './data/attacks';
import { usePlayerStore } from '@/stores/player';
import type { StatKeys } from '@/types';

const playerStore = usePlayerStore();

const emit = defineEmits(['step']);

const currentCharacter = ref('');
const playScramble = ref(false);
let scrambleInterval: NodeJS.Timeout | null = null;

const increaseStat = (stat: StatKeys) => {
  if (playerStore.getPlayerStats.statPoints > 0) {
    const newStatValue = (playerStore.getPlayerStats.params[stat] += 1);
    const newStatPoints = (playerStore.getPlayerStats.statPoints -= 1);

    playerStore.updatePlayerStats({
      [stat]: newStatValue,
      statPoints: newStatPoints,
    });
  }
};

const decreaseStat = (stat: StatKeys) => {
  if (playerStore.getPlayerStats.params[stat] > 1) {
    const newStatValue = (playerStore.getPlayerStats.params[stat] -= 1);
    const newStatPoints = (playerStore.getPlayerStats.statPoints += 1);

    playerStore.updatePlayerStats({
      [stat]: newStatValue,
      statPoints: newStatPoints,
    });
  }
};

const playerCharacterStats = computed(() => {
  return {
    health: playerStore.getPlayerState?.health.max / 10 || 0,
    mana: playerStore.getPlayerState?.mana.max / 10 || 0,
    stamina: playerStore.getPlayerState?.stamina.max / 10 || 0,
    crit: playerStore.getPlayerStats?.crit.chance || 0,
    damage: playerStore.getPlayerStats?.attacks['attack'].damage || 0,
  };
});

const normalizedStats = computed(() => {
  return Object.entries(playerCharacterStats.value).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value / 5,
    }),
    {}
  );
});

const goToStepOne = () => {
  emit('step', 1);
};

onMounted(() => {
  playScramble.value = true;
  scrambleInterval = setTimeout(() => {
    playScramble.value = false;
  }, 1000);

  currentCharacter.value = playerStore.getCurrentCharacter;
});

onUnmounted(() => {
  if (scrambleInterval) {
    clearTimeout(scrambleInterval);
  }
});
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
