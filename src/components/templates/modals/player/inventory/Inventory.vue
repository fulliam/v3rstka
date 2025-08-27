<template>
  <div
    class="inventory-modal"
    @click.stop
  >
    <div class="inventory-header">
      <h2>🎒 Inventory</h2>
      <Cross 
        class="close-btn"
        @click="$emit('close')"
      />
    </div>

    <!-- Сетка инвентаря -->
    <div class="inventory-grid">
      <div
        v-for="(item, index) in inventory"
        :key="item.id"
        class="inventory-cell"
        :class="[
          { 'drop-target': dragTargetIndex === index },
          item.image ? `inventory-cell--${item.rarity || 'common'}` : '',
        ]"
        @dragover.prevent="onDragOver($event, index)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, index)"
      >
        <!-- Предмет -->
        <div
          v-if="item.image"
          class="item-wrapper"
          @mouseover="(e) => tooltipRef?.showTooltip(e, getTooltipHTML(item))"
          @mouseleave="tooltipRef?.hideTooltip()"
        >
          <img
            :src="item.image"
            :draggable="true"
            :style="{ background: getRarityGradient(item.rarity) }"
            alt=""
            @dragstart="onDragStart($event, index)"
          />
          <!-- Количество -->
          <div
            v-if="item.quantity === '?' || item.quantity > 0"
            class="quantity"
          >
            {{ item.quantity }}
          </div>
        </div>

        <!-- Пустой слот -->
        <div
          v-else
          class="empty-slot"
        ></div>
      </div>
    </div>

    <!-- Статистика -->
    <!-- <div class="item-count">
      {{ filledSlots }} / {{ inventory.length }} slots used
    </div> -->
  </div>

  <AutoTooltip ref="tooltipRef" />
</template>

<script setup lang="ts">
import { Cross } from '@/assets/icons';
import type { InventoryItem, Player } from '@/types';
import { AutoTooltip } from '@/components/base/auto-tooltip';
// import { Shimmer } from '@/components/templates/shimmer';

const props = defineProps<{
  player: Player;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const tooltipRef = ref<InstanceType<typeof AutoTooltip> | null>(null); // ✅

    const getTooltipHTML = (item: InventoryItem) => {
  if (!item.image || !item.name) return '';

  const rarityColors: Record<string, string> = {
    common: '#c0c0c0',
    rare: '#7FFF00',
    unique: '#1E90FF',
    mythic: '#EE82EE',
    legendary: '#FFD700',
  };

  const color = rarityColors[item.rarity || 'common'];

  let statsHTML = '';
  if (item.stats) {
    const statEntries = Object.entries(item.stats)
      .filter(([_, value]) => value !== undefined && value !== 0)
      .map(([key, value]) => {
        const labels: Record<string, string> = {
          attack: '⚔️ Атака',
          defense: '🛡️ Защита',
          health: '❤️ Здоровье',
          mana: '✨ Мана',
          speed: '👟 Скорость',
          crit: '🎯 Крит',
        };
        return `<span style="color: ${color}">${labels[key] || key}: +${value}</span>`;
      });
    statsHTML = statEntries.length ? `<div style="margin-top: 4px; font-size: 11px; line-height: 1.3">${statEntries.join('<br>')}</div>` : '';
  }

  return `
  <div style="
    border-radius: 12px;
    background: rgba(0,0,0,0.9);
    box-shadow: 0 0 10px ${color}55;
    position: relative;
    overflow: hidden;
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    box-sizing: border-box;
  ">
    <!-- ✅ Вращающиеся лучи (солнце) ПОД изображением -->
    <div style="
      position: absolute;
      width: 300%;
      height: 300%;
      border-radius: 100%;
      top: -125%;
      background: 
        repeating-conic-gradient(
          from 0deg,
          ${color}44 0deg 10deg,
          transparent 10deg 20deg
        );
      animation: spin 8s linear infinite;
      z-index: 0;
      opacity: 0.8;
      transform-origin: center;
    "></div>

    <!-- 🖼 Изображение (по центру) -->
    <div style="
      position: relative;
      z-index: 1;
      width: 84px;
      height: 84px;
    ">
      <img
        src="${item.image}"
        alt="${item.name}"
        style="
          width: 100%;
          height: 100%;
          object-fit: contain;
          image-rendering: pixelated;
        "
      />
    </div>

    <!-- 📄 Информация под изображением -->
    <div style="
      position: relative;
      background: rgba(0,0,0,0.5);
      border-radius: 6px;
      padding: 4px 8px;
      z-index: 1;
      margin-top: 8px;
      text-align: center;
      width: 100%;
      max-width: 200px;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    ">
      <strong style="
        color: ${color};
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      ">${item.name}</strong>

      <div style="
        font-size: 10px;
        color: #ccc;
      ">
        ${item.type || 'item'} •
        <span style="color: ${color}; text-transform: uppercase;">
          ${item.rarity}
        </span>
      </div>

      <div style="
        margin-top: 4px;
        font-size: 10px;
        line-height: 1.2;
        color: #ddd;
        max-height: 36px;
        overflow: hidden;
      ">
        ${item.description || 'Нет описания'}
      </div>

      ${statsHTML}

      ${(item.quantity !== '?' && item.quantity > 0) || item.quantity === '?' ? `
        <div style="
          margin-top: 4px;
          font-size: 11px;
          color: #c8b400;
        ">
          📦 ${item.quantity}
        </div>
      ` : ''}
    </div>
  </div>
`;
};

const inventory = computed(() => {
  return props.player?.inventory.bag || [];
});

const dragIndex = ref<number | null>(null);
const dragTargetIndex = ref<number | null>(null);

// --- Drag Start ---
const onDragStart = (e: DragEvent, index: number) => {
  dragIndex.value = index;
  e.dataTransfer?.setData('text/plain', index.toString());
  // Важно: разрешить drop
  e.dataTransfer!.effectAllowed = 'move';
};

// --- Drag Over ---
const onDragOver = (e: DragEvent, index: number) => {
  dragTargetIndex.value = index;
  e.dataTransfer!.dropEffect = 'move';
};

// --- Drag Leave ---
const onDragLeave = () => {
  dragTargetIndex.value = null;
};

// --- Drop — как раньше ---
const onDrop = (e: DragEvent, targetIndex: number) => {
  e.preventDefault();
  handleDrop(targetIndex);
};

// --- Drag End — сработает, если отпустили мимо ---
const onDragEnd = (e: DragEvent) => {
  const from = dragIndex.value;
  if (from === null) return;

  // Если drop уже обработан — выходим
  if (dragTargetIndex.value !== null) {
    dragIndex.value = null;
    dragTargetIndex.value = null;
    return;
  }

  // Ищем ближайшую ячейку
  const closestIndex = findClosestCell(e.clientX, e.clientY);
  if (closestIndex !== null) {
    handleDrop(closestIndex);
  }

  // Сбрасываем
  dragIndex.value = null;
  dragTargetIndex.value = null;
};

// --- Общая логика перемещения ---
const handleDrop = (targetIndex: number) => {
  const from = dragIndex.value;
  if (from === null || from === targetIndex) return;

  const items = inventory.value;
  const dragged = items[from];
  const target = items[targetIndex];

  if (
    dragged.image &&
    dragged.image === target.image &&
    typeof dragged.quantity === 'number' &&
    typeof target.quantity === 'number'
  ) {
    target.quantity += dragged.quantity;
    items[from] = { ...dragged, quantity: 0, image: null };
  } else {
    [items[from], items[targetIndex]] = [target, dragged];
  }
};

// --- Поиск ближайшей ячейки ---
const findClosestCell = (clientX: number, clientY: number): number | null => {
  const cells = document.querySelectorAll('.inventory-cell');
  let minDistance = Infinity;
  let closestIndex = -1;

  cells.forEach((cell, index) => {
    const rect = cell.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const distance = Math.hypot(center.x - clientX, center.y - clientY);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex === -1 ? null : closestIndex;
};

// --- Остальные функции ---
const getRarityGradient = (rarity?: string): string => {
  const gradients: Record<string, string> = {
    common: 'radial-gradient(circle at center, #c0c0c0, #808080)',
    rare: 'radial-gradient(circle at center, #7FFF00, #006400)',
    unique: 'radial-gradient(circle at center, #1E90FF, #00008B)',
    mythic: 'radial-gradient(circle at center, #EE82EE, #4B0082)',
    legendary: 'radial-gradient(circle at center, #FFD700, #8B6508)',
  };
  return gradients[rarity || ''] || 'none';
};

const getRarityColor = (rarity?: string): string => {
  const colors: Record<string, string> = {
    common: '#c0c0c0',
    rare: '#7FFF00',
    unique: '#1E90FF',
    mythic: '#EE82EE',
    legendary: '#FFD700',
  };
  return colors[rarity || ''] || '#ccc';
};

const filledSlots = computed(() => {
  return inventory.value.filter((item) => item?.image).length;
});
</script>

<style scoped lang="scss">
@use './Inventory.scss';
</style>
