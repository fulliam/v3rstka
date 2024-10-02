<template>
  <div class="json-viewer">
    <ul>
      <li v-for="(value, key) in jsonData" :key="key">
        <strong>{{ key }}:</strong>
        <div v-if="isObject(value)">
          <JsonView :jsonData="value" />
        </div>
        <div v-else>
          <span>{{ value }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  jsonData: {
    type: Object,
    required: true,
  },
});

const isObject = (val: unknown): boolean => {
  return val !== null && typeof val === 'object';
};
</script>

<style scoped>
.json-viewer ul {
  list-style: none;
  padding-left: 20px;
}

.json-viewer li {
  margin-bottom: 5px;
  font-family: monospace;
  display: flex;
}

strong {
  color: #007bff;
}

span {
  color: #b9b9b9;
}
</style>
