import { ref, type Ref } from 'vue';
import type { Layer } from '../types';

interface CanvasOperationsProps {
  canvasAreaRef: Ref<any>;
  zoom: Ref<number>;
  panX: Ref<number>;
  panY: Ref<number>;
  isPanning: Ref<boolean>;
  tempHandTool: Ref<boolean>;
  currentTool: Ref<string>;
  brushSize: Ref<number>;
  primaryColor: Ref<string>;
  secondaryColor: Ref<string>;
  canvasWidth: Ref<number>;
  canvasHeight: Ref<number>;
  pixelSize: Ref<number>;
  showGrid: Ref<boolean>;
  layers: Ref<Layer[]>;
  currentLayer: Ref<number>;
}

export function useCanvasOperations(props: CanvasOperationsProps) {
  const panStartX = ref(0);
  const panStartY = ref(0);
  const lastTouchDistance = ref(0);
  const touchStartPanX = ref(0);
  const touchStartPanY = ref(0);

  function centerCanvas() {
    if (
      !props.canvasAreaRef.value?.canvasWrapper ||
      !props.canvasAreaRef.value?.canvasInner
    )
      return;

    const wrapperWidth = props.canvasAreaRef.value.canvasWrapper.offsetWidth;
    const wrapperHeight = props.canvasAreaRef.value.canvasWrapper.offsetHeight;
    const contentWidth =
      props.canvasWidth.value * props.pixelSize.value * props.zoom.value;
    const contentHeight =
      props.canvasHeight.value * props.pixelSize.value * props.zoom.value;

    props.panX.value = (wrapperWidth - contentWidth) / 2;
    props.panY.value = (wrapperHeight - contentHeight) / 2;
  }

  function zoomIn() {
    const oldZoom = props.zoom.value;
    props.zoom.value = Math.min(props.zoom.value * 1.2, 20);

    if (props.canvasAreaRef.value?.canvasWrapper) {
      const centerX = props.canvasAreaRef.value.canvasWrapper.offsetWidth / 2;
      const centerY = props.canvasAreaRef.value.canvasWrapper.offsetHeight / 2;

      const zoomRatio = props.zoom.value / oldZoom;
      props.panX.value = centerX - (centerX - props.panX.value) * zoomRatio;
      props.panY.value = centerY - (centerY - props.panY.value) * zoomRatio;
    }
  }

  function zoomOut() {
    const oldZoom = props.zoom.value;
    props.zoom.value = Math.max(props.zoom.value / 1.2, 0.1);

    if (props.canvasAreaRef.value?.canvasWrapper) {
      const centerX = props.canvasAreaRef.value.canvasWrapper.offsetWidth / 2;
      const centerY = props.canvasAreaRef.value.canvasWrapper.offsetHeight / 2;

      const zoomRatio = props.zoom.value / oldZoom;
      props.panX.value = centerX - (centerX - props.panX.value) * zoomRatio;
      props.panY.value = centerY - (centerY - props.panY.value) * zoomRatio;
    }
  }

  function resetZoom() {
    props.zoom.value = 1;
    centerCanvas();
  }

  function fitToScreen() {
    if (!props.canvasAreaRef.value?.canvasWrapper) return;

    const wrapperWidth = props.canvasAreaRef.value.canvasWrapper.offsetWidth;
    const wrapperHeight = props.canvasAreaRef.value.canvasWrapper.offsetHeight;

    const contentWidth = props.canvasWidth.value * props.pixelSize.value;
    const contentHeight = props.canvasHeight.value * props.pixelSize.value;

    const zoomWidth = (wrapperWidth - 100) / contentWidth;
    const zoomHeight = (wrapperHeight - 100) / contentHeight;

    props.zoom.value = Math.min(zoomWidth, zoomHeight, 20);
    centerCanvas();
  }

  function toggleGrid() {
    props.showGrid.value = !props.showGrid.value;
  }

  function clearCanvas() {
    const currentLayerCanvas =
      props.layers.value[props.currentLayer.value]?.canvas;
    if (currentLayerCanvas) {
      const ctx = currentLayerCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          currentLayerCanvas.width,
          currentLayerCanvas.height
        );
      }
    }
  }

  function resizeCanvas() {
    const newWidth = prompt(
      'Enter new width:',
      props.canvasWidth.value.toString()
    );
    const newHeight = prompt(
      'Enter new height:',
      props.canvasHeight.value.toString()
    );

    if (newWidth && newHeight) {
      const width = Number.parseInt(newWidth);
      const height = Number.parseInt(newHeight);

      if (width > 0 && height > 0 && width <= 512 && height <= 512) {
        props.canvasWidth.value = width;
        props.canvasHeight.value = height;
      } else {
        alert('Please enter valid dimensions (1-512)');
      }
    }
  }

  return {
    centerCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    toggleGrid,
    clearCanvas,
    resizeCanvas,
  };
}
