<template>
  <section>
    <div class="header">
      <Input
        style="
          min-width: 400px;
          min-height: 50px;
          font-size: 24px;
          color: #cd6e3f;
        "
        :label-style="{ color: '#cd6e3f', fontSize: '24px' }"
        v-model="nickname"
        label="Enter your nickname or generate:"
        :error="nicknameError"
        :clickDice="debounceGenerateNickname"
        @input="clearError('nickname')"
        :dice="true"
        required
      />
      <TextScramble
        style="display: none"
        v-if="updateScramble"
        :phrases="[generatedNickname]"
        enable-return-value
        @output="handleUpdateNickename"
      />
    </div>

    <Carousel :cards="cards" @change="changeCard" />

    <div class="menu">
      <table>
        <thead>
          <tr>
            <th><h2 style="color: #666">Skills</h2></th>
            <th>
              <h2>
                <TextScramble
                  v-if="playScramble"
                  :phrases="[currentCharacter]"
                />
                <span v-else>{{ currentCharacter }}</span>
              </h2>
            </th>
            <th><h2 style="color: #666">Attacks</h2></th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td class="skills">
              <Chart
                :size="[400, 300]"
                :step="1"
                :values="{
                  JavaScript: 4.1,
                  'Node.js': 3.5,
                  'Vue.js': 4,
                  PHP: 3,
                  'C++': 2.5,
                  'Problem Solving': 3.5,
                  DHTML: 4,
                }"
                :showAxisLabels="true"
                :animate="playScramble"
              />
            </td>

            <td class="stats">
              <div class="points">
                <p>Skill Points: {{ userCharacterStats.skillPoints }}</p>
                <p>Stat Points: {{ userCharacterStats.statPoints }}</p>
              </div>

              <ul>
                <li
                  v-for="(value, stat) in userCharacterStats.params"
                  :key="stat"
                >
                  <span>{{ stat }}:</span>
                  <div>
                    <button :disabled="value <= 1" @click="decreaseStat(stat)">
                      -
                    </button>
                    <span>{{ value }}</span>
                    <button
                      :disabled="userCharacterStats.statPoints === 0"
                      @click="increaseStat(stat)"
                    >
                      +
                    </button>
                  </div>
                </li>
              </ul>
            </td>

            <td class="attacks">
              <div class="attacks-wrapper">
                <Tooltip
                  v-for="(attack, index) in attacks[currentCharacter]"
                  :key="index"
                  @mouseenter="currentAction = attack.action"
                  @mouseleave="currentAction = 'idle'"
                >
                  <div class="attack">
                    <img
                      class="attack"
                      :key="currentCharacter"
                      :src="`/src/assets/char/ally/${currentCharacter}/skills/${attack.image}`"
                      :alt="attack.name"
                    />
                    <img
                      class="sparkles"
                      :src="`/src/assets/images/sparkles.webp`"
                      alt="sparkles"
                    />
                  </div>

                  <template #tooltip>
                    <div>
                      <h3>{{ attack.name }}</h3>
                      <Hearths
                        :hearts="attack.damage"
                        style="--color-heart-background: #828282"
                      />
                      <p>{{ attack.description }}</p>
                    </div>
                  </template>
                </Tooltip>
              </div>

              <Button
                style="
                  min-width: 200px;
                  min-height: 50px;
                  font-size: 24px;
                  position: absolute;
                  bottom: 100px;
                  right: 100px;
                "
                type="base"
                :label="'CONTINUE'"
                :action="() => console.log('Continue')"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import Carousel from '@/components/partials/carousel/index.vue';
import { useSocketStore } from '@/stores/socket';
import { useAuthStore } from '@/stores/auth';
import animations from '@/animations.json';
import TextScramble from '@/components/partials/animations/scramble/index.vue';
import type { CharacterStats } from '@/types';
import { debounce } from '@/lib/helpers/debounce';
import Chart from '@/components/partials/chart/index.vue';
import Animation from '@/components/templates/animation/index.vue';
import Hearths from '@/components/partials/hearths/index.vue';
import { attacks } from './attacksData';

const socketStore = useSocketStore();
const authStore = useAuthStore();

const userId = ref<string>('');

const nickname = ref<string>('');
const nicknameError = ref<string>('');
const generatedNickname = ref('');
const playScramble = ref(false);
let scrambleInterval: NodeJS.Timeout | null = null;
const updateScramble = ref(false);

const characterTypes = ref(Object.keys((animations as any).char['ally']));
const currentCharacter = ref('');
const currentAction = ref('idle');

const cards = computed(() =>
  characterTypes.value.map((character) => ({
    id: `card-${character}`,
    component: Animation,
    props: {
      path: (animations as any).char.ally[character][currentAction.value],
      enable: currentCharacter.value === character,
    },
  }))
);

const userCharacterStats = computed(() => {
  const ownUser = socketStore.users.find(
    (user) => user.userId === userId.value
  );

  return (ownUser?.character.stats as CharacterStats) || {};
});

const changeCard = (index: number) => {
  currentAction.value = 'idle';
  if (currentCharacter.value === characterTypes.value[index]) return;
  else {
    currentCharacter.value = characterTypes.value[index];

    playScramble.value = true;
    scrambleInterval = setTimeout(() => {
      playScramble.value = false;
    }, 1000);
  }
};

const generateNickname = () => {
  const adjectives = ['Brave', 'Mighty', 'Sneaky', 'Swift', 'Fierce'];
  const animals = ['Lion', 'Wolf', 'Falcon', 'Tiger', 'Dragon'];
  const numbers = Math.floor(Math.random() * 1000);

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const newNickname = `${randomAdjective}${randomAnimal}${numbers}`;

  generatedNickname.value = newNickname;
  updateScramble.value = true;
  setTimeout(() => {
    updateScramble.value = false;
  }, 1200);
};

const handleUpdateNickename = (value: string) => {
  nickname.value = value;
  clearError('nickname');
};

const debounceGenerateNickname = debounce(generateNickname, 1000);

const clearError = (field: string) => {
  if (field === 'nickname') nicknameError.value = '';
};

const increaseStat = (stat: string) => {};

const decreaseStat = (stat: string) => {};

watch(currentAction, (newAction) => {
  if (currentCharacter.value) {
    const currentCard = cards.value.find(
      (card) => card.id === `card-${currentCharacter.value}`
    );
    if (currentCard) {
      currentCard.props.path = (animations as any).char.ally[
        currentCharacter.value
      ][newAction];
    }
  }
});

onMounted(async () => {
  playScramble.value = true;
  scrambleInterval = setTimeout(() => {
    playScramble.value = false;
  }, 1000);

  if (authStore.isAuthenticated && authStore.token && authStore.username) {
    userId.value = authStore.username;
    await socketStore.connect(userId.value, authStore.token);
  }
});

onUnmounted(() => {
  socketStore.disconnect();

  if (scrambleInterval) {
    clearTimeout(scrambleInterval);
  }
});
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  padding-top: 100px;
}

.header {
  display: flex;
  align-self: center;
  justify-content: center;
  position: relative;
  top: -30px;
}

h2 {
  text-align: center;
  text-transform: uppercase;
  font-size: 48px;
  color: #cd6e3f;
  margin: 0;
}

.menu {
  display: flex;
  justify-content: space-around;
  background-color: #333;
  color: #fff;

  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    font-size: 24px;
    table-layout: fixed;

    thead {
      tr {
        background: #242424;
      }
    }

    th,
    td {
      padding: 10px;
      width: 33%;
    }
  }

  .points {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .attacks-wrapper {
    display: flex;
    gap: 10px;
    justify-content: center;

    .attack {
      width: 100px;
      height: 100px;
      transition:
        transform,
        opacity,
        filter 0.4s ease-in-out;
      animation: scaleIn 0.3s ease-in-out;
      position: relative;
      overflow: hidden;
      filter: brightness(1.2);

      @include pixel-box(
        $corner-size: 2,
        $border-size: 2px,
        $background-color: #cd6e3f
      );

      &:hover {
        filter: brightness(1.4);
      }
    }

    .sparkles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      opacity: 0.4;
    }
  }

  .stats {
    padding: 0 40px;

    ul {
      list-style-type: none;
      padding: 0;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        div {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        span {
          font-size: 24px;
          font-weight: bold;
          text-transform: uppercase;
        }

        button {
          color: #fff;
          font-weight: 900;
          padding: 5px 10px;
          cursor: pointer;

          @include pixel-box(
            $corner-size: 2,
            $border-size: 2px,
            $background-color: #cd6e3f
          );

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
