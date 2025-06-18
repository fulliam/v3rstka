import { ref, type Ref, nextTick } from 'vue';
import type { Frame, Layer } from '../types';

interface FrameManagementProps {
  layers: Ref<Layer[]>;
  currentLayer: Ref<number>;
}

export function useFrameManagement(props: FrameManagementProps) {
  const frames = ref<Frame[]>([]);
  const currentFrame = ref(0);
  const isAnimating = ref(false);
  const animationFPS = ref(8);
  let frameId = 0;
  let animationInterval: NodeJS.Timeout | null = null;

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

  function cloneLayer(layer: Layer): Layer {
    const clonedCanvas = cloneCanvas(layer.canvas);
    const clonedContext = clonedCanvas?.getContext('2d') || null;
    if (clonedContext) {
      clonedContext.imageSmoothingEnabled = false;
    }

    return {
      ...layer,
      id: Date.now() + Math.random(),
      canvas: clonedCanvas,
      context: clonedContext,
    };
  }

  function saveCurrentLayersToFrame() {
    if (frames.value[currentFrame.value]) {
      frames.value[currentFrame.value].layers = props.layers.value.map(
        (layer) => cloneLayer(layer)
      );
    }
  }

  function loadLayersFromFrame(frameIndex: number) {
    if (frameIndex >= 0 && frameIndex < frames.value.length) {
      const targetFrame = frames.value[frameIndex];
      const newLayers = targetFrame.layers.map((layer) => cloneLayer(layer));

      // Replace layers array
      props.layers.value.length = 0;
      props.layers.value.push(...newLayers);

      // Force reactivity
      nextTick(() => {
        props.layers.value = [...props.layers.value];
      });
    }
  }

  function createInitialFrame() {
    const initialFrame: Frame = {
      id: frameId++,
      layers: props.layers.value.map((layer) => cloneLayer(layer)),
    };
    frames.value = [initialFrame];
  }

  function addFrame() {
    // Save current state to current frame
    saveCurrentLayersToFrame();

    // Create new frame with empty layers of same structure
    const newLayers = props.layers.value.map((layer) => {
      const layerCanvas = document.createElement('canvas');
      layerCanvas.width = layer.canvas?.width || 32 * 16;
      layerCanvas.height = layer.canvas?.height || 32 * 16;
      const layerContext = layerCanvas.getContext('2d')!;
      layerContext.imageSmoothingEnabled = false;

      return {
        ...layer,
        id: Date.now() + Math.random(),
        canvas: layerCanvas,
        context: layerContext,
      };
    });

    const newFrame: Frame = {
      id: frameId++,
      layers: newLayers,
    };

    frames.value.push(newFrame);
    switchFrame(frames.value.length - 1);
  }

  function duplicateFrame() {
    // Save current state to current frame
    saveCurrentLayersToFrame();

    const currentFrameData = frames.value[currentFrame.value];
    const newLayers = currentFrameData.layers.map((layer) => cloneLayer(layer));

    const newFrame: Frame = {
      id: frameId++,
      layers: newLayers,
    };

    frames.value.splice(currentFrame.value + 1, 0, newFrame);
    switchFrame(currentFrame.value + 1);
  }

  function deleteFrame() {
    if (frames.value.length > 1) {
      frames.value.splice(currentFrame.value, 1);
      const newIndex = Math.min(currentFrame.value, frames.value.length - 1);
      switchFrame(newIndex);
    }
  }

  function switchFrame(frameIndex: number) {
    if (
      frameIndex >= 0 &&
      frameIndex < frames.value.length &&
      frameIndex !== currentFrame.value
    ) {
      // Save current layers to current frame before switching
      saveCurrentLayersToFrame();

      // Switch to new frame
      currentFrame.value = frameIndex;

      // Load layers from target frame
      loadLayersFromFrame(frameIndex);

      // Update current layer if it's out of bounds
      if (props.currentLayer.value >= props.layers.value.length) {
        props.currentLayer.value = Math.max(0, props.layers.value.length - 1);
      }
    }
  }

  function toggleAnimation() {
    if (isAnimating.value) {
      if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
      isAnimating.value = false;
    } else {
      isAnimating.value = true;
      animationInterval = setInterval(() => {
        const nextFrame = (currentFrame.value + 1) % frames.value.length;
        switchFrame(nextFrame);
      }, 1000 / animationFPS.value);
    }
  }

  // Initialize with first frame
  if (props.layers.value.length > 0) {
    createInitialFrame();
  }

  return {
    frames,
    currentFrame,
    isAnimating,
    animationFPS,
    addFrame,
    duplicateFrame,
    deleteFrame,
    switchFrame,
    toggleAnimation,
    saveCurrentLayersToFrame,
  };
}
