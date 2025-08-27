<template>
  <div
    v-if="showControls"
    class="audio-player"
  >
    <div class="controls">
      <button
        class="btn"
        @click="toggleMute"
      >
        {{ muted ? 'Unmute' : 'Mute' }}
      </button>
      <label class="vol">
        Volume
        <input
          v-model.number="localVolume"
          type="range"
          min="0"
          max="1"
          step="0.01"
        />
      </label>
    </div>
    <div class="library">
      <strong>Registered sounds:</strong>
      <ul>
        <li
          v-for="(srcs, id) in registeredList"
          :key="id"
        >
          {{ id }} — {{ srcs.length }} source(s)
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAudio } from '@/composables/sound';

// Props
const props = withDefaults(
  defineProps<{
    sounds?: Record<string, string | string[]>;
    preload?: boolean;
    showControls?: boolean;
    initialVolume?: number;
  }>(),
  {
    initialVolume: 1,
    showControls: false,
    preload: false,
  }
);

// Use audio composable
const { register, preload, setVolume, setMuted, getMuted, registered } =
  useAudio();

// State
const localVolume = ref(props.initialVolume);
const muted = ref(false);
const showControls = computed(() => props.showControls);
const registeredList = computed(() => registered());

// Lifecycle
onMounted(() => {
  if (props.sounds) {
    register(props.sounds);
  }
  setVolume(localVolume.value);
  if (props.preload) {
    preload();
  }
});

watch(localVolume, (v) => {
  setVolume(v);
});

watch(muted, (m) => {
  setMuted(m);
});

// Methods
function toggleMute() {
  muted.value = !muted.value;
}

// Expose API for parent refs (optional)
defineExpose({
  play: (
    id: string,
    opts?: { volume?: number; loop?: boolean; srcIndex?: number }
  ) => useAudio().play(id, opts),
  register: (
    map: Record<string, string | string[]>,
    opts?: { overwrite?: boolean }
  ) => useAudio().register(map, opts),
});
</script>

<style scoped lang="scss">
.audio-player {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  padding: 0.5rem;

  .controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    .btn {
      padding: 0.35rem 0.6rem;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: rgba(0, 0, 0, 0.02);
      cursor: pointer;
    }

    .vol {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .library {
    margin-top: 0.5rem;
    font-size: 0.9rem;

    ul {
      margin: 0.25rem 0 0;
      padding-left: 1rem;
    }
  }
}
</style>
