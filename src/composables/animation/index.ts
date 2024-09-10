import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import animations from '@/animations.json';

export default function useAnimation(character: Record<string, any>) {
  const frames = ref<string[]>([]);
  const currentFrame = ref<string>('');
  let animationFrameId: number | null = null;
  let frameIndex = 0;

  const direction = computed(() => character.state.direction === 'left');

  const preloadImages = (frameList: string[]) => {
    const promises = frameList.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image ${src}`));
      });
    });

    return Promise.all(promises);
  };

  const updateFrames = async () => {
    frames.value = Object.values(
      (animations as any).char[character.info.category][
        character.info.character
      ][character.state.action]
    );
    await preloadImages(frames.value);
    currentFrame.value = frames.value[0];
    frameIndex = 0;
  };

  const startAnimation = () => {
    const frameDuration = 1000 / 10;
    const animate = () => {
      frameIndex = (frameIndex + 1) % frames.value.length;
      currentFrame.value = frames.value[frameIndex];
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate);
      }, frameDuration);
    };

    animationFrameId = requestAnimationFrame(animate);
  };

  watch(() => character.info.character, updateFrames);

  watch(() => character.state.action, updateFrames);

  onMounted(() => {
    updateFrames();
    startAnimation();
  });

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return { currentFrame, direction };
}
