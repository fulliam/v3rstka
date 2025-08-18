<template>
  <header class="app-header glass-panel">
    <div class="header-section">
      <div class="logo-section">
        <div class="app-logo">
          <Logo class="logo-icon" />
          <span class="app-title">Pixel Art Editor</span>
        </div>
      </div>

      <div class="header-controls">
        <!-- File Operations -->
        <div class="control-group">
          <button
            class="glass-button"
            title="New Project (⌘N)"
            @click="$emit('newProject')"
          >
            <File class="icon" />
            New
          </button>

          <button
            class="glass-button"
            title="Import Image"
          >
            <File class="icon" />
            Import
            <input
              type="file"
              accept="image/*"
              style="display: none"
              @change="$emit('importImage', $event)"
            />
          </button>

          <button
            class="glass-button"
            title="Load Project"
          >
            <File class="icon" />
            Load
            <input
              type="file"
              accept=".json"
              style="display: none"
              @change="$emit('loadProject', $event)"
            />
          </button>

          <button
            class="glass-button"
            title="Save Project (⌘S)"
            @click="$emit('saveProject')"
          >
            <Save class="icon" />
            Save
          </button>

          <button
            class="glass-button glass-button-primary"
            title="Export PNG"
            @click="$emit('exportPNG')"
          >
            <File class="icon" />
            Export
          </button>
        </div>

        <!-- Edit Operations -->
        <div class="control-group">
          <button
            :disabled="!canUndo"
            class="glass-button"
            title="Undo (⌘Z)"
            @click="$emit('undo')"
          >
            <Undo class="icon" />
          </button>

          <button
            :disabled="!canRedo"
            class="glass-button"
            title="Redo (⌘⇧Z)"
            @click="$emit('redo')"
          >
            <Redo class="icon" />
          </button>
        </div>

        <!-- Canvas Operations -->
        <div class="control-group">
          <button
            class="glass-button glass-button-danger"
            title="Clear Canvas"
            @click="$emit('clearCanvas')"
          >
            <Trash class="icon" />
            Clear
          </button>

          <button
            class="glass-button"
            title="Resize Canvas"
            @click="$emit('resizeCanvas')"
          >
            <Resize class="icon" />
            Resize
          </button>
        </div>

        <!-- Help -->
        <div class="control-group">
          <button
            class="glass-button"
            title="Keyboard Shortcuts (?)"
            @click="$emit('toggleShortcuts')"
          >
            <Question class="icon" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  Logo,
  File,
  Save,
  Undo,
  Redo,
  Trash,
  Resize,
  Question,
} from '../../icons';

interface Props {
  canUndo: boolean;
  canRedo: boolean;
}

defineProps<Props>();

defineEmits<{
  newProject: [];
  importImage: [event: Event];
  loadProject: [event: Event];
  saveProject: [];
  exportPNG: [];
  undo: [];
  redo: [];
  clearCanvas: [];
  resizeCanvas: [];
  toggleShortcuts: [];
}>();
</script>

<style scoped lang="scss">
@use './AppHeader.scss';
</style>
