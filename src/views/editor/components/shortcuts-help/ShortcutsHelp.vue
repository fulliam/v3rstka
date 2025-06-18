<template>
  <div
    class="shortcuts-overlay"
    @click="$emit('close')"
  >
    <div
      class="shortcuts-panel glass-panel-enhanced"
      @click.stop
    >
      <h3>Keyboard Shortcuts</h3>
      <div class="shortcuts-grid">
        <div class="shortcut-item">
          <kbd>P</kbd>
          <span>Pencil Tool</span>
        </div>
        <div class="shortcut-item">
          <kbd>E</kbd>
          <span>Eraser Tool</span>
        </div>
        <div class="shortcut-item">
          <kbd>F</kbd>
          <span>Fill Tool</span>
        </div>
        <div class="shortcut-item">
          <kbd>I</kbd>
          <span>Color Picker</span>
        </div>
        <div class="shortcut-item">
          <kbd>H</kbd>
          <span>Hand Tool</span>
        </div>
        <div class="shortcut-item">
          <kbd>⌘Z</kbd>
          <span>Undo</span>
        </div>
        <div class="shortcut-item">
          <kbd>⌘⇧Z</kbd>
          <span>Redo</span>
        </div>
        <div class="shortcut-item">
          <kbd>+</kbd>
          <span>Zoom In</span>
        </div>
        <div class="shortcut-item">
          <kbd>-</kbd>
          <span>Zoom Out</span>
        </div>
        <div class="shortcut-item">
          <kbd>0</kbd>
          <span>Reset Zoom</span>
        </div>
        <div class="shortcut-item">
          <kbd>Space</kbd>
          <span>Temporary Hand Tool</span>
        </div>
        <div class="shortcut-item">
          <kbd>?</kbd>
          <span>Show Shortcuts</span>
        </div>
      </div>
      <button
        class="glass-button glass-button-primary"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  close: [];
}>();
</script>

<style scoped lang="scss">
@use './ShortcutsHelp.scss';
</style>
