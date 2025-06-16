<template>
  <img
    :src="String(currentImage)"
    alt="Animation frame"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  path: {
    type: Object,
    required: true,
  },
  enable: {
    type: Boolean,
    required: false,
    default: true,
  },
  index: {
    type: Number,
    required: false,
    default: 0,
  },
});

const images = Object.values(props.path);
const currentImageIndex = ref(0);
const currentImage = computed(
  () => images[props.index ? props.index : currentImageIndex.value]
);
const animationSpeed = 100;
let animationIntervalId: NodeJS.Timeout | null = null;

const startAnimation = () => {
  if (!animationIntervalId) {
    animationIntervalId = setInterval(() => {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
    }, animationSpeed);
  }
};

const stopAnimation = () => {
  if (animationIntervalId) {
    clearInterval(animationIntervalId);
    animationIntervalId = null;
  }
};

watch(
  () => props.enable,
  (newVal) => {
    if (newVal) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }
);

watch(
  () => props.path,
  (newPath) => {
    images.length = 0;
    images.push(...Object.values(newPath));
    currentImageIndex.value = 0;
    if (props.enable) {
      stopAnimation();
      startAnimation();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.enable) {
    startAnimation();
  }
});

onBeforeUnmount(() => {
  stopAnimation();
});
</script>
