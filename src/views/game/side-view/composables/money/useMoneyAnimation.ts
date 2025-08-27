import { gsap } from 'gsap';

export function useMoneyAnimation(
  images: string[],
  moneyId: string,
  moneyImgRef: any
) {
  const isAnimating = ref(true);
  const currentImageIndex = ref(0);
  const animationIntervalId = ref<number | null>(null);

  const currentImage = computed(() => images[currentImageIndex.value]);

  const changeImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  };

  const startAnimation = () => {
    const intervalSpeed = moneyId.includes('gem') ? 150 : 100;

    currentImageIndex.value = Math.floor(Math.random() * images.length);

    animationIntervalId.value = window.setInterval(changeImage, intervalSpeed);
  };

  const stopAnimation = () => {
    if (animationIntervalId.value !== null) {
      clearInterval(animationIntervalId.value);
      animationIntervalId.value = null;
    }
  };

  const createDropAnimation = () => {
    if (!moneyImgRef.value) return;
    const randomY = Math.random() * -90;

    gsap.to(moneyImgRef.value, {
      duration: 0.65,
      y: randomY,
      ease: 'power1.out',
      onComplete: () => {
        if (!moneyImgRef.value) return;
        gsap.to(moneyImgRef.value, {
          duration: 0.8,
          y: 0,
          ease: 'bounce.out',
        });
      },
    });
  };

  const onAnimationEnd = () => {
    isAnimating.value = false;
  };

  onMounted(() => {
    startAnimation();
    createDropAnimation();
  });

  onBeforeUnmount(() => {
    stopAnimation();
  });

  return {
    isAnimating,
    currentImage,
    startAnimation,
    stopAnimation,
    createDropAnimation,
    onAnimationEnd,
  };
}
