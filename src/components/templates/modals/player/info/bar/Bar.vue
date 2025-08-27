<!-- @/components/ui/ResourceBarIcon.vue -->
<template>
  <div
    class="resource-bar-icon"
    :style="{ gap: gap }"
  >
    <!-- Иконка -->
    <span
      v-if="icon"
      class="icon"
      :style="{ fontSize: iconSize }"
    >
      {{ icon }}
    </span>

    <!-- Метка (HP, MP, STA) -->
    <span
      class="label"
      :style="{ minWidth: labelWidth }"
    >
      {{ label }}
    </span>

    <!-- Шкала -->
    <div class="bar-track">
      <div
        class="bar-fill"
        :style="{
          width: percent + '%',
          backgroundColor: color,
          transition: smooth ? 'width 0.4s ease' : 'none',
        }"
      ></div>
    </div>

    <!-- Значение -->
    <span class="value">
      {{ formatNumber(current) }} / {{ formatNumber(max) }}
    </span>
  </div>
</template>

<script setup lang="ts">
// Определяем пропсы
const props = defineProps<{
  icon?: string; // иконка (эмодзи или символ)
  label: string; // текст: HP, MP, STA
  current: number; // текущее значение
  max: number; // максимальное значение
  color: string; // цвет заполнения
  smooth?: boolean; // плавная анимация
  iconSize?: string; // размер иконки (по умолчанию '18px')
  labelWidth?: string; // ширина метки (по умолчанию '30px')
  gap?: string; // отступы между элементами (по умолчанию '8px')
}>();

// Теперь используем props.current и props.max
const percent = computed(() => {
  return Math.max(0, Math.min(100, (props.current / props.max) * 100));
});

// Форматирование чисел
function formatNumber(value: number): number {
  return Math.floor(value);
}
</script>

<style scoped lang="scss">
@use './Bar.scss';
</style>
