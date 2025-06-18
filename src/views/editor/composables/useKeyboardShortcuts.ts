import type { Ref } from 'vue';

interface KeyboardShortcutsProps {
  currentTool: Ref<string>;
  tempHandTool: Ref<boolean>;
  showShortcuts: Ref<boolean>;
  selectTool: (tool: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  addLayer: () => void;
  addFrame: () => void;
}

export function useKeyboardShortcuts(props: KeyboardShortcutsProps) {
  function handleKeyDown(event: KeyboardEvent) {
    // Don't handle shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === 'text'
    )
      return;

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;

    // Prevent default browser shortcuts
    if (ctrl && (key === 'z' || key === 'y')) {
      event.preventDefault();
    }

    // Handle specific key combinations first
    if (ctrl && shift && key === 'z') {
      event.preventDefault();
      props.redo();
      return;
    }

    if (ctrl && key === 'z' && !shift) {
      event.preventDefault();
      props.undo();
      return;
    }

    if (ctrl && key === 'y' && !shift) {
      event.preventDefault();
      props.redo();
      return;
    }

    if (ctrl && key === 's') {
      event.preventDefault();
      props.saveProject();
      return;
    }

    // Handle space key for temporary hand tool
    if (key === ' ' && !ctrl && !shift) {
      event.preventDefault();
      if (!props.tempHandTool.value) {
        props.tempHandTool.value = true;
      }
      return;
    }

    // Handle other shortcuts
    if (!ctrl || (ctrl && !shift)) {
      switch (key) {
        case 'p':
          event.preventDefault();
          props.selectTool('pencil');
          break;
        case 'e':
          event.preventDefault();
          props.selectTool('eraser');
          break;
        case 'f':
          event.preventDefault();
          props.selectTool('fill');
          break;
        case 'i':
          event.preventDefault();
          props.selectTool('picker');
          break;
        case 'h':
          event.preventDefault();
          props.selectTool('hand');
          break;
        case '+':
        case '=':
          event.preventDefault();
          props.zoomIn();
          break;
        case '-':
          event.preventDefault();
          props.zoomOut();
          break;
        case '0':
          event.preventDefault();
          props.resetZoom();
          break;
        case '?':
          event.preventDefault();
          props.showShortcuts.value = !props.showShortcuts.value;
          break;
      }
    }

    // Handle Ctrl combinations
    if (ctrl && shift) {
      switch (key) {
        case 'l':
          event.preventDefault();
          props.addLayer();
          break;
        case 'n':
          event.preventDefault();
          props.addFrame();
          break;
      }
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === ' ') {
      props.tempHandTool.value = false;
    }
  }

  return {
    handleKeyDown,
    handleKeyUp,
  };
}
