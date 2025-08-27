<template>
  <teleport to="body">
    <div
      v-show="tooltipVisible"
      ref="tooltipRef"
      class="tooltip"
      :style="tooltipStyle"
      v-html="tooltipText"
    />
  </teleport>
</template>

<script setup lang="ts">
const tooltipRef = ref<HTMLElement | null>(null);
const tooltipText = ref('');
const tooltipStyle = ref<Record<string, string>>({
  top: '0px',
  left: '0px',
  opacity: '0',
});
const tooltipVisible = ref(false);
let moveHandler: ((e: MouseEvent) => void) | null = null;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

async function updateTooltipPosition(clientX: number, clientY: number) {
  await nextTick();

  const el = tooltipRef.value as HTMLElement | null;
  const rect = el ? el.getBoundingClientRect() : { width: 0, height: 0 };

  const tooltipW = rect.width || 0;
  const tooltipH = rect.height || 0;

  const offsetX = 12;
  const offsetY = 12;
  const margin = 8;

  let left = clientX + offsetX;
  if (left + tooltipW + margin > window.innerWidth) {
    left = clientX - offsetX - tooltipW;
    if (left < margin)
      left = Math.max(window.innerWidth - tooltipW - margin, margin);
  }
  left = clamp(
    left,
    margin,
    Math.max(window.innerWidth - tooltipW - margin, margin)
  );

  let top = clientY + offsetY;
  if (top + tooltipH + margin > window.innerHeight) {
    top = clientY - offsetY - tooltipH;
    if (top < margin) top = margin;
  }
  top = clamp(
    top,
    margin,
    Math.max(window.innerHeight - tooltipH - margin, margin)
  );

  tooltipStyle.value = {
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    opacity: '1',
  };
}

function showTooltip(mouseEvent: MouseEvent, text: string) {
  const cx =
    mouseEvent && typeof (mouseEvent as any).clientX === 'number'
      ? mouseEvent.clientX
      : (mouseEvent as any).pageX || 0;
  const cy =
    mouseEvent && typeof (mouseEvent as any).clientY === 'number'
      ? mouseEvent.clientY
      : (mouseEvent as any).pageY || 0;

  tooltipText.value = text;
  tooltipVisible.value = true;

  tooltipStyle.value = { left: '0px', top: '0px', opacity: '0' };

  updateTooltipPosition(cx, cy);

  if (!moveHandler) {
    moveHandler = (ev: MouseEvent) => {
      updateTooltipPosition(ev.clientX, ev.clientY);
    };
    window.addEventListener('mousemove', moveHandler);
  }
}

function hideTooltip() {
  tooltipVisible.value = false;
  tooltipText.value = '';
  tooltipStyle.value = { top: '0px', left: '0px', opacity: '0' };

  if (moveHandler) {
    window.removeEventListener('mousemove', moveHandler);
    moveHandler = null;
  }
}

defineExpose({
  showTooltip,
  hideTooltip,
});
</script>

<style lang="scss">
@use './AutoTooltip.scss';
</style>
