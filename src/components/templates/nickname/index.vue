<template>
  <div class="nickname">
    <Input
      v-model="nickname"
      style="
        min-width: 400px;
        min-height: 50px;
        font-size: 24px;
        color: #cd6e3f;
      "
      :label-style="{ color: '#cd6e3f', fontSize: '24px' }"
      label="Enter your nickname or generate:"
      :error="nicknameError"
      :clickDice="debounceGenerateNickname"
      :dice="true"
      required
      @input="nicknameError = ''"
    />
    <TextScramble
      v-if="updateScramble"
      style="display: none"
      :phrases="[generatedNickname]"
      enable-return-value
      @output="handleUpdateNickname"
    />
  </div>
</template>

<script setup lang="ts">
import { debounce } from '@/lib/helpers/debounce';
import TextScramble from '@/components/partials/animations/scramble/index.vue';

const nickname = ref<string>('');
const nicknameError = ref<string>('');
const generatedNickname = ref('');
const updateScramble = ref(false);
let scrambleInterval: NodeJS.Timeout;

const handleUpdateNickname = (value: string) => {
  nickname.value = value;
  nicknameError.value = '';
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
  scrambleInterval = setTimeout(() => {
    updateScramble.value = false;
  }, 1200);
};

const debounceGenerateNickname = debounce(generateNickname, 1000);

onMounted(() => {
  generateNickname();
});

onBeforeUnmount(() => {
  if (scrambleInterval) {
    clearTimeout(scrambleInterval);
  }
});
</script>

<style scoped lang="scss">
.nickname {
  display: flex;
  align-self: center;
  justify-content: center;
  position: relative;
  top: -30px;
}
</style>
