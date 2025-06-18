import { ref } from 'vue';
import type { Layer } from '../types';

export function useLayerManagement() {
  const layers = ref<Layer[]>([]);
  const currentLayer = ref(0);
  let layerId = 0;

  function createInitialLayer() {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = 32 * 16; // Default canvas size
    layerCanvas.height = 32 * 16;
    const layerContext = layerCanvas.getContext('2d')!;
    layerContext.imageSmoothingEnabled = false;

    const initialLayer: Layer = {
      id: layerId++,
      name: 'Layer 1',
      visible: true,
      opacity: 1,
      canvas: layerCanvas,
      context: layerContext,
    };

    layers.value = [initialLayer];
  }

  function addLayer() {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = layers.value[0]?.canvas?.width || 32 * 16;
    layerCanvas.height = layers.value[0]?.canvas?.height || 32 * 16;
    const layerContext = layerCanvas.getContext('2d')!;
    layerContext.imageSmoothingEnabled = false;

    const newLayer: Layer = {
      id: layerId++,
      name: `Layer ${layers.value.length + 1}`,
      visible: true,
      opacity: 1,
      canvas: layerCanvas,
      context: layerContext,
    };

    layers.value.push(newLayer);
    currentLayer.value = layers.value.length - 1;
  }

  function duplicateLayer() {
    const sourceLayer = layers.value[currentLayer.value];
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = sourceLayer.canvas?.width || 32 * 16;
    layerCanvas.height = sourceLayer.canvas?.height || 32 * 16;
    const layerContext = layerCanvas.getContext('2d')!;
    layerContext.imageSmoothingEnabled = false;

    if (sourceLayer.canvas) {
      layerContext.drawImage(sourceLayer.canvas, 0, 0);
    }

    const newLayer: Layer = {
      id: layerId++,
      name: `${sourceLayer.name} Copy`,
      visible: true,
      opacity: sourceLayer.opacity,
      canvas: layerCanvas,
      context: layerContext,
    };

    layers.value.splice(currentLayer.value + 1, 0, newLayer);
    currentLayer.value++;
  }

  function deleteLayer() {
    if (layers.value.length > 1) {
      layers.value.splice(currentLayer.value, 1);
      currentLayer.value = Math.min(
        currentLayer.value,
        layers.value.length - 1
      );
    }
  }

  function moveLayerUp() {
    if (currentLayer.value < layers.value.length - 1) {
      const layer = layers.value.splice(currentLayer.value, 1)[0];
      layers.value.splice(currentLayer.value + 1, 0, layer);
      currentLayer.value++;
    }
  }

  function moveLayerDown() {
    if (currentLayer.value > 0) {
      const layer = layers.value.splice(currentLayer.value, 1)[0];
      layers.value.splice(currentLayer.value - 1, 0, layer);
      currentLayer.value--;
    }
  }

  function selectLayer(layerIndex: number) {
    currentLayer.value = layerIndex;
  }

  function toggleLayerVisibility(layerIndex: number) {
    if (layerIndex >= 0 && layerIndex < layers.value.length) {
      layers.value[layerIndex].visible = !layers.value[layerIndex].visible;
    }
  }

  function updateLayerOpacity(layerIndex: number, event: Event) {
    if (layerIndex >= 0 && layerIndex < layers.value.length) {
      const target = event.target as HTMLInputElement;
      layers.value[layerIndex].opacity = Number.parseFloat(target.value);
    }
  }

  function updateLayerName(layerIndex: number, name: string) {
    if (layerIndex >= 0 && layerIndex < layers.value.length) {
      layers.value[layerIndex].name = name;
    }
  }

  function resizeLayerCanvases(
    width: number,
    height: number,
    pixelSize: number
  ) {
    layers.value.forEach((layer) => {
      if (layer.canvas && layer.context) {
        // Save current content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = layer.canvas.width;
        tempCanvas.height = layer.canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(layer.canvas, 0, 0);

        // Resize canvas
        layer.canvas.width = width * pixelSize;
        layer.canvas.height = height * pixelSize;

        // Restore content
        layer.context.imageSmoothingEnabled = false;
        layer.context.drawImage(tempCanvas, 0, 0);
      }
    });
  }

  // Initialize with first layer
  createInitialLayer();

  return {
    layers,
    currentLayer,
    addLayer,
    duplicateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    selectLayer,
    toggleLayerVisibility,
    updateLayerOpacity,
    updateLayerName,
    resizeLayerCanvases,
  };
}
