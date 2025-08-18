<template>
  <div
    ref="viewportRef"
    class="stage-viewport"
  >
    <div
      class="stage-scale-wrapper"
      :style="{
        transform: `scale(${scale})`,
        transformOrigin: scaleOrigin,
      }"
    >
      <div
        class="act-container"
        :style="{
          width: `${designWidth.value * effectiveSceneCount.value}px`,
          height: `${designHeight.value}px`,
          position: 'relative',
        }"
      >
        <div
          v-for="(layer, layerIndex) in flatStyledLayers"
          :key="`layer-${layerIndex}`"
          :class="['bg-part', layer.class]"
          :style="[partBaseStyle, layer.style]"
        >
          <img
            v-if="layer.src"
            :src="layer.src"
            :alt="layer.alt || 'background layer'"
            :width="designWidth.value"
            :height="designHeight.value"
            draggable="false"
          />
        </div>

        <slot
          name="decorations"
          :scene="currentScene"
        ></slot>
        <slot
          name="enemy"
          :scene="currentScene"
        ></slot>
        <slot
          name="currencies"
          :scene="currentScene"
        ></slot>
        <slot
          name="character"
          :scene="currentScene"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Scene, SceneLayer } from '../data';

interface Props {
  scenes?: Scene[];
  sceneCount?: number;
  designWidth?: number;
  designHeight?: number;
  maxScale?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  scenes: () => [],
  sceneCount: 0,
  designWidth: 1920,
  designHeight: 1080,
  maxScale: null,
});

const { scenes, sceneCount, designWidth, designHeight, maxScale } = toRefs(props);

const backgroundPositionX = ref(0);
const viewportRef = ref<HTMLElement | null>(null);

const effectiveSceneCount = computed(() => {
  return sceneCount.value && sceneCount.value > 0
    ? sceneCount.value
    : scenes.value?.length || 0;
});

const maxScrollPosition = computed(() => {
  const maxOffsetInScreens = effectiveSceneCount.value - 1;
  return -maxOffsetInScreens * designWidth.value;
});

const scale = ref(1);
const scaleOrigin = ref('center center');

function calculateScale() {
  scaleOrigin.value = 'center center';

  const w = window.innerWidth;
  const h = window.innerHeight;

  const scaleW = w / designWidth.value;
  const scaleH = h / designHeight.value;
  let s = Math.min(scaleW, scaleH);

  s = Math.min(s, 1);

  if (maxScale.value && typeof maxScale.value === 'number') {
    s = Math.min(s, maxScale.value);
  }

  scale.value = s;
}

const partBaseStyle = {
  position: 'absolute' as const,
  width: `${designWidth.value}px`,
  height: `${designHeight.value}px`,
  top: '0',
  left: '0',
  margin: '0',
};

const flatStyledLayers = computed(() => {
  const result: (SceneLayer & { style: any })[] = [];

  const screenWidth = window.innerWidth / scale.value;

  const offsetInScreens = -backgroundPositionX.value / designWidth.value;

  scenes.value?.forEach((scene, sceneIndex) => {
    const sceneOffsetX = sceneIndex * designWidth.value;

    scene.forEach((layer) => {
      const speed = layer.parallaxSpeed ?? 1;

      const parallaxOffset = -offsetInScreens * screenWidth * speed;

      const totalX = sceneOffsetX + parallaxOffset;

      const existingStyle = layer.style ? { ...layer.style } : {};
      const transformFromStyle = existingStyle.transform ? `${existingStyle.transform} ` : '';
      existingStyle.transform = `${transformFromStyle} translateX(${totalX}px)`;

      result.push({
        ...layer,
        style: {
          ...existingStyle,
          zIndex: Math.round(speed * 100) + sceneIndex,
        },
      });
    });
  });

  return result.sort((a, b) => (a.parallaxSpeed ?? 1) - (b.parallaxSpeed ?? 1));
});

const progress = computed(() => {
  return -backgroundPositionX.value / (designWidth.value * (effectiveSceneCount.value - 1));
});

const currentSceneIndex = computed(() => {
  return Math.max(0, Math.min(Math.floor(progress.value), effectiveSceneCount.value - 1));
});

const currentScene = computed(() => {
  return scenes.value?.[currentSceneIndex.value] || [];
});

function moveBackground(direction: 'left' | 'right', speed = 100) {
  if (direction === 'right') {
    backgroundPositionX.value = Math.max(
      backgroundPositionX.value - speed,
      maxScrollPosition.value
    );
  } else if (direction === 'left') {
    backgroundPositionX.value = Math.min(
      backgroundPositionX.value + speed,
      0
    );
  }
}

function resetBackgroundPosition() {
  backgroundPositionX.value = 0;
}

function updatePageSize() {
  calculateScale();
}

watch(
  () => props.scenes,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetBackgroundPosition();
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  calculateScale();
  window.addEventListener('resize', updatePageSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePageSize);
});

defineExpose({
  moveBackground,
  resetBackgroundPosition,
  backgroundPositionX,
  scale,
  currentScene,
});
</script>

<style scoped lang="scss">
@use './Index.scss';
</style>