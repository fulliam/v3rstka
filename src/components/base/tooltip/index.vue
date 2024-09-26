<template>
  <div
    ref="trigger"
    class="tooltip-wrapper"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot></slot>

    <div
      ref="tooltip"
      v-show="visible"
      :class="['tooltip', position, visible ? 'visible' : '']"
      role="tooltip"
    >
      <slot name="tooltip"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const trigger = ref<HTMLElement | null>(null);
const tooltip = ref<HTMLElement | null>(null);
const visible = ref(false);
const position = ref<'top' | 'bottom' | 'left' | 'right'>('top');

const showTooltip = async () => {
  visible.value = true;
  await nextTick();
  adjustTooltipPosition();
};

const hideTooltip = () => {
  visible.value = false;
};

const adjustTooltipPosition = () => {
  if (!trigger.value || !tooltip.value) return;

  const triggerRect = trigger.value.getBoundingClientRect();
  const tooltipRect = tooltip.value.getBoundingClientRect();
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;

  const spaceAbove = triggerRect.top;
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceLeft = triggerRect.left;
  const spaceRight = viewportWidth - triggerRect.right;

  // Определяем основную позицию тултипа
  if (spaceBelow >= tooltipRect.height) {
    position.value = 'bottom';
  } else if (spaceAbove >= tooltipRect.height) {
    position.value = 'top';
  } else if (spaceRight >= tooltipRect.width) {
    position.value = 'right';
  } else if (spaceLeft >= tooltipRect.width) {
    position.value = 'left';
  } else {
    position.value = 'bottom';
  }

  // Проверяем выход тултипа за экран по горизонтали для верхней и нижней позиций
  if (position.value === 'top' || position.value === 'bottom') {
    const tooltipLeft =
      triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    const tooltipRight = tooltipLeft + tooltipRect.width;

    if (tooltipLeft < 0) {
      tooltip.value!.style.transform = `translate(${Math.abs(tooltipLeft)}px, 0)`;
    } else if (tooltipRight > viewportWidth) {
      const overflow = tooltipRight - viewportWidth;
      tooltip.value!.style.transform = `translate(calc(-${overflow}px - 50%), 0)`;
    } else {
      tooltip.value!.style.transform = 'translateX(-50%)'; // Стандартное выравнивание
    }
  }

  // Проверяем выход тултипа за экран по вертикали для левой и правой позиций
  if (position.value === 'left' || position.value === 'right') {
    const tooltipTop =
      triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
    const tooltipBottom = tooltipTop + tooltipRect.height;

    if (tooltipTop < 0) {
      tooltip.value!.style.transform = `translateY(${Math.abs(tooltipTop)}px)`;
    } else if (tooltipBottom > viewportHeight) {
      const overflow = tooltipBottom - viewportHeight;
      tooltip.value!.style.transform = `translateY(-${overflow}px)`;
    } else {
      tooltip.value!.style.transform = 'translateY(-50%)'; // Стандартное выравнивание
    }
  }
};

onMounted(() => {
  window.addEventListener('resize', adjustTooltipPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', adjustTooltipPosition);
});
</script>

<style scoped lang="scss">
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  background-color: #000000c5;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  white-space: nowrap;
  z-index: 1000;
  transition: opacity 0.5s ease-in-out;
  opacity: 0;

  @include pixel-borders(
    $corner-size: 2,
    $border-size: 2px,
    $border-color: #cd6e3f
  );
}

.visible {
  opacity: 1;
}

.tooltip.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.tooltip.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.tooltip.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.tooltip.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}
</style>
