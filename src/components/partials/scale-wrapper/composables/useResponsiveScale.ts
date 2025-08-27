export function useResponsiveScale(
  designWidth: number,
  designHeight: number,
  maxScale: number | null = null
) {
  const scale = ref(1);
  const scaleOrigin = ref('center center');

  const calculateScale = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scaleW = w / designWidth;
    const scaleH = h / designHeight;
    let s = Math.min(scaleW, scaleH);

    // Не увеличиваем больше 1, если не задано иначе
    s = Math.min(s, 1);

    if (maxScale !== null) {
      s = Math.min(s, maxScale);
    }

    scale.value = s;
    scaleOrigin.value = 'center center';
  };

  onMounted(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calculateScale);
  });

  // Пересчитываем при изменении design-размеров
  watch([() => designWidth, () => designHeight], () => {
    calculateScale();
  });

  return {
    scale,
    scaleOrigin,
    calculateScale, // можно вызвать вручную
  };
}