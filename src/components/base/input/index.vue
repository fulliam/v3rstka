<template>
  <div
    class="input"
    :class="{ dark, error, disabled, big, full, colored, small }"
  >
    <div
      v-if="label || hint"
      class="text"
    >
      <label
        v-if="label"
        :class="{ required }"
        :style="labelStyle"
        :for="inputId"
      >
        {{ label }}
      </label>
      <p v-if="hint">{{ hint }}</p>
    </div>
    <div class="input__container">
      <input
        v-bind="$attrs"
        :id="inputId"
        v-model="currentInput"
        v-maska
        :data-maska="maska"
        :placeholder="placeholder"
        :type="isHide ? type : 'text'"
        :disabled="disabled"
        :maxlength="maxLength"
        :max="`'${max}'`"
      />
      <button
        v-if="dice"
        class="dice-icon"
        @click="clickDice"
      >
        <Icon.Dice />
      </button>
      <button
        v-if="type === 'password' && !dice"
        class="password-icon"
        :disabled="!currentInput"
        @click="toggleHide"
      >
        <Icon.Eye
          v-if="!isHide"
          class=""
        />
        <Icon.CrossEye
          v-else
          class=""
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup generic="T = 'string'">
import { Icon } from '@/assets/icons/index';
import { vMaska } from 'maska/vue';

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

interface IInput {
  label?: string;
  modelValue?: T;
  error?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  dark?: boolean;
  hint?: string;
  big?: boolean;
  small?: boolean;
  full?: boolean;
  colored?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: number | string;
  max?: number | string;
  type?: string;
  value?: any;
  maska?: string;
  dice?: boolean;
  clickDice?: () => Promise<void>;
  labelStyle?: any;
}

const props = defineProps<IInput>();
const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change']);

const isHide = ref<boolean>(true);
const toggleHide = () => (isHide.value = !isHide.value);

const currentInput = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('change', value);
    emit('update:modelValue', value);
  },
});

defineOptions({
  inheritAttrs: false,
});

watch(currentInput, () => {
  if (!currentInput.value) {
    isHide.value = true;
  }
});
</script>

<style lang="scss" scoped>
$color-input-bg: #5bcbac2b;
$color-input-border: #5bcbac2b;
$color-input-bg-error: rgb(255, 102, 102);
$color-label-default: #b0b0b0;
$color-label-dark: #ffffff;
$color-input-text: #ffffff;
$color-placeholder-text: #ffffff;
$box-shadow-color: rgba(0, 0, 0, 0.5);

.input {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;

  .text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-weight: 400;
      font-size: 14px;
      color: var(--label-color, $color-label-default);
      line-height: 120%;
    }

    p {
      font-weight: 400;
      font-size: 12px;
      color: $color-placeholder-text;
    }
  }

  input {
    width: 100%;
    padding: 0 9px;
    height: var(--input-height, 35px);
    background-color: $color-input-bg;
    // border: 1px solid var(--input-border, $color-input-border);
    border-radius: 8px;
    text-overflow: ellipsis;
    // box-shadow: 0px 0px 40px 0px $box-shadow-color;
    font-weight: 400;
    font-size: 14px;
    color: $color-input-text;
    line-height: 120%;

    @include pixel-borders(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: $color-input-border
    );

    &::placeholder {
      color: $color-placeholder-text;
    }

    &:focus {
      outline: none;
    }
  }

  input[type='time']::-webkit-calendar-picker-indicator {
    display: none;
  }

  &__container {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;

    .password-icon {
      height: 100%;
      width: fit-content;
      padding: 0;
      margin: 0;

      position: absolute;
      right: 20px;

      background: none;
      cursor: pointer;
      border: none;

      display: flex;
      justify-content: center;
      align-items: center;

      &:disabled {
        opacity: 0.35;
      }
    }

    .dice-icon {
      width: 42px;
      height: 42px;

      position: absolute;
      right: 20px;

      background: none;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.8;
      transition: opacity 0.5s;
      overflow: hidden;

      svg {
        cursor: pointer;
      }

      &:hover {
        opacity: 1;
      }
    }
  }

  &.dark {
    --label-color: #{$color-label-dark};
  }

  &.error {
    // --input-border: 1px solid #{$color-input-bg-error};
    input {
      // border: 1px solid $color-input-bg-error;
      @include pixel-borders(
        $corner-size: 2,
        $border-size: 2px,
        $border-color: $color-input-bg-error
      );
    }
  }

  &.colored {
    input {
      border: unset;
      border-radius: 8px;
      background: $color-input-bg;
    }
  }

  &.disabled {
    opacity: 0.35;
    cursor: not-allowed;

    input {
      cursor: not-allowed;
    }
  }

  &.big {
    --input-height: 37px;

    label {
      font-weight: 500;
      font-size: 16px;
      color: $color-label-default;
      line-height: 120%;
    }
  }

  &.full {
    width: 100%;
  }

  &.small {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
  }
}
</style>
