<template>
  <div class="scrumble">
    <div ref="textEl" class="text"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  phrases: string[];
  enableReturnValue?: boolean;
}>();

const emit = defineEmits(['output']);

class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: {
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }[];
  frameRequest?: number;
  frame: number;
  resolve!: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
    this.queue = [];
    this.frame = 0;
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    return new Promise<void>((resolve) => {
      this.resolve = resolve;
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest || 0);
      this.frame = 0;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
        if (props.enableReturnValue) {
          emit('output', textEl.value?.innerText);
        }
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const textEl = ref<HTMLElement | null>(null);
let fx: TextScramble | null = null;

const counter = ref(0);
const nextPhrase = () => {
  if (fx && props.phrases.length > 0) {
    fx.setText(props.phrases[counter.value]).then(() => {
      setTimeout(nextPhrase, 1000);
    });
    counter.value = (counter.value + 1) % props.phrases.length;
  }
};

onMounted(() => {
  if (textEl.value) {
    fx = new TextScramble(textEl.value);
    nextPhrase();
  }
});

onUnmounted(() => {
  if (fx && fx.frameRequest) {
    cancelAnimationFrame(fx.frameRequest);
  }
});
</script>

<style scoped lang="scss">
.scrumble {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

// .text {
// font-weight: 100;
// font-size: 28px;
// color: #fafafa;
// }

.dud {
  color: #757575;
}
</style>
