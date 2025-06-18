import { ref, computed, type Ref, nextTick } from 'vue';
import type { Layer, HistoryState } from '../types';

interface HistoryManagementProps {
  layers: Ref<Layer[]>;
  currentLayer: Ref<number>;
  currentFrame: Ref<number>;
}

export function useHistoryManagement(props: HistoryManagementProps) {
  const history = ref<HistoryState[]>([]);
  const historyIndex = ref(-1);
  const maxHistorySize = 50;

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  function saveHistory() {
    // Remove any history after current index
    history.value = history.value.slice(0, historyIndex.value + 1);

    // Create deep copy of current state
    const state: HistoryState = {
      layers: props.layers.value.map((layer) => ({
        ...layer,
        canvas: cloneCanvas(layer.canvas),
        context: null, // Will be recreated when restored
      })),
      currentLayer: props.currentLayer.value,
      currentFrame: props.currentFrame.value,
    };

    history.value.push(state);
    historyIndex.value = history.value.length - 1;

    // Limit history size
    if (history.value.length > maxHistorySize) {
      history.value.shift();
      historyIndex.value--;
    }
  }

  function undo() {
    if (canUndo.value) {
      historyIndex.value--;
      restoreHistoryState(history.value[historyIndex.value]);
    }
  }

  function redo() {
    if (canRedo.value) {
      historyIndex.value++;
      restoreHistoryState(history.value[historyIndex.value]);
    }
  }

  function restoreHistoryState(state: HistoryState) {
    // Create new layer instances with restored canvas data
    const restoredLayers = state.layers.map((historyLayer) => {
      // Find the corresponding current layer or create a new one
      const currentLayer = props.layers.value.find(
        (l) => l.id === historyLayer.id
      ) || {
        id: historyLayer.id,
        name: historyLayer.name,
        visible: historyLayer.visible,
        opacity: historyLayer.opacity,
        canvas: null,
        context: null,
      };

      // Clone the canvas from history
      const restoredCanvas = cloneCanvas(historyLayer.canvas);
      const restoredContext = restoredCanvas?.getContext('2d') || null;
      if (restoredContext) {
        restoredContext.imageSmoothingEnabled = false;
      }

      return {
        ...currentLayer,
        name: historyLayer.name,
        visible: historyLayer.visible,
        opacity: historyLayer.opacity,
        canvas: restoredCanvas,
        context: restoredContext,
      };
    });

    // Replace the entire layers array
    props.layers.value.length = 0;
    props.layers.value.push(...restoredLayers);

    // Update current layer
    props.currentLayer.value = Math.min(
      state.currentLayer,
      props.layers.value.length - 1
    );

    // Force Vue reactivity
    nextTick(() => {
      // Trigger a reactive update
      props.layers.value = [...props.layers.value];
    });
  }

  function cloneCanvas(
    sourceCanvas: HTMLCanvasElement | null
  ): HTMLCanvasElement | null {
    if (!sourceCanvas) return null;

    const clonedCanvas = document.createElement('canvas');
    clonedCanvas.width = sourceCanvas.width;
    clonedCanvas.height = sourceCanvas.height;
    const clonedContext = clonedCanvas.getContext('2d')!;
    clonedContext.imageSmoothingEnabled = false;
    clonedContext.drawImage(sourceCanvas, 0, 0);

    return clonedCanvas;
  }

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    saveHistory,
  };
}
