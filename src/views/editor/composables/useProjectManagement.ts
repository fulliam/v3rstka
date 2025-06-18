import type { Ref } from 'vue';
import type { Layer, Frame } from '../types';

interface ProjectManagementProps {
  canvasWidth: Ref<number>;
  canvasHeight: Ref<number>;
  pixelSize: Ref<number>;
  zoom: Ref<number>;
  panX: Ref<number>;
  panY: Ref<number>;
  currentTool: Ref<string>;
  brushSize: Ref<number>;
  primaryColor: Ref<string>;
  secondaryColor: Ref<string>;
  colorPalette: Ref<string[]>;
  extendedColorPalette: Ref<string[]>;
  frames: Ref<Frame[]>;
  layers: Ref<Layer[]>;
  currentLayer: Ref<number>;
  resizeLayerCanvases: (
    width: number,
    height: number,
    pixelSize: number
  ) => void;
  updatePreviews: () => void;
  saveCurrentLayersToFrame?: () => void;
}

export function useProjectManagement(props: ProjectManagementProps) {
  function importImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Smart dimension calculation
        const maxSize = 128;
        let newWidth = img.width;
        let newHeight = img.height;

        // Scale down if too large
        if (newWidth > maxSize || newHeight > maxSize) {
          const ratio = Math.min(maxSize / newWidth, maxSize / newHeight);
          newWidth = Math.floor(newWidth * ratio);
          newHeight = Math.floor(newHeight * ratio);
        }

        // Update canvas dimensions
        props.canvasWidth.value = newWidth;
        props.canvasHeight.value = newHeight;

        // Resize all layer canvases
        props.resizeLayerCanvases(newWidth, newHeight, props.pixelSize.value);

        // Wait for canvases to be resized
        setTimeout(() => {
          const currentLayerCanvas =
            props.layers.value[props.currentLayer.value]?.canvas;
          if (currentLayerCanvas) {
            const ctx = currentLayerCanvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = false;

              // Clear the canvas
              ctx.clearRect(
                0,
                0,
                currentLayerCanvas.width,
                currentLayerCanvas.height
              );

              // Create temporary canvas for pixel processing
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = newWidth;
              tempCanvas.height = newHeight;
              const tempCtx = tempCanvas.getContext('2d')!;
              tempCtx.imageSmoothingEnabled = false;

              // Draw scaled image to temp canvas
              tempCtx.drawImage(img, 0, 0, newWidth, newHeight);

              // Get pixel data
              const imageData = tempCtx.getImageData(0, 0, newWidth, newHeight);
              const data = imageData.data;

              // Draw each pixel as a block
              for (let y = 0; y < newHeight; y++) {
                for (let x = 0; x < newWidth; x++) {
                  const pixelIndex = (y * newWidth + x) * 4;
                  const r = data[pixelIndex];
                  const g = data[pixelIndex + 1];
                  const b = data[pixelIndex + 2];
                  const a = data[pixelIndex + 3];

                  if (a > 128) {
                    // Only draw non-transparent pixels
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                    ctx.fillRect(
                      x * props.pixelSize.value,
                      y * props.pixelSize.value,
                      props.pixelSize.value,
                      props.pixelSize.value
                    );
                  }
                }
              }

              // Update layer reference
              props.layers.value[props.currentLayer.value].canvas =
                currentLayerCanvas;

              // Save to current frame if available
              if (props.saveCurrentLayersToFrame) {
                props.saveCurrentLayersToFrame();
              }

              // Force reactivity update
              props.layers.value = [...props.layers.value];

              // Update previews
              setTimeout(() => {
                props.updatePreviews();
              }, 50);

              console.log(
                'Image imported successfully:',
                newWidth,
                'x',
                newHeight
              );
            }
          }
        }, 100);
      } catch (error) {
        console.error('Error importing image:', error);
        alert('Error importing image. Please try again.');
      }
    };

    img.onerror = () => {
      console.error('Failed to load image');
      alert('Failed to load image. Please check the file format.');
    };

    img.src = URL.createObjectURL(file);
  }

  function loadProject(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Restore canvas properties
        props.canvasWidth.value = data.width || 32;
        props.canvasHeight.value = data.height || 32;
        props.pixelSize.value = data.pixelSize || 16;
        props.zoom.value = data.zoom || 1;
        props.panX.value = data.panX || 0;
        props.panY.value = data.panY || 0;
        props.currentTool.value = data.currentTool || 'pencil';
        props.brushSize.value = data.brushSize || 1;
        props.primaryColor.value = data.primaryColor || '#000000';
        props.secondaryColor.value = data.secondaryColor || '#ffffff';
        props.colorPalette.value = data.colorPalette || [];
        props.extendedColorPalette.value = data.extendedColorPalette || [];

        // Restore frames and layers if available
        if (data.frames && data.frames.length > 0) {
          const loadedFrames = data.frames.map((frameData: any) => ({
            id: frameData.id,
            layers: frameData.layers.map((layerData: any) => {
              const canvas = document.createElement('canvas');
              canvas.width = props.canvasWidth.value * props.pixelSize.value;
              canvas.height = props.canvasHeight.value * props.pixelSize.value;
              const ctx = canvas.getContext('2d')!;
              ctx.imageSmoothingEnabled = false;

              // Load layer image data if available
              if (layerData.data) {
                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, 0, 0);
                  props.updatePreviews();
                };
                img.src = layerData.data;
              }

              return {
                id: layerData.id || Date.now() + Math.random(),
                name: layerData.name || 'Layer',
                visible:
                  layerData.visible !== undefined ? layerData.visible : true,
                opacity:
                  layerData.opacity !== undefined ? layerData.opacity : 1,
                canvas,
                context: ctx,
              };
            }),
          }));

          props.frames.value = loadedFrames;

          // Load first frame layers
          if (loadedFrames[0]) {
            props.layers.value = loadedFrames[0].layers.map((layer: Layer) => ({
              ...layer,
              id: Date.now() + Math.random(),
              canvas: layer.canvas,
              context: layer.context,
            }));
          }
        }

        // Update previews after a delay
        setTimeout(() => {
          props.updatePreviews();
        }, 200);

        console.log('Project loaded successfully');
      } catch (error) {
        console.error('Error loading project:', error);
        alert('Error loading project: ' + error);
      }
    };
    reader.readAsText(file);
  }

  function saveProject() {
    // Save current layers to current frame before saving
    if (props.saveCurrentLayersToFrame) {
      props.saveCurrentLayersToFrame();
    }

    const data = {
      width: props.canvasWidth.value,
      height: props.canvasHeight.value,
      pixelSize: props.pixelSize.value,
      zoom: props.zoom.value,
      panX: props.panX.value,
      panY: props.panY.value,
      currentTool: props.currentTool.value,
      brushSize: props.brushSize.value,
      primaryColor: props.primaryColor.value,
      secondaryColor: props.secondaryColor.value,
      colorPalette: props.colorPalette.value,
      extendedColorPalette: props.extendedColorPalette.value,
      frames: props.frames.value.map((frame) => ({
        id: frame.id,
        layers: frame.layers.map((layer) => ({
          id: layer.id,
          name: layer.name,
          visible: layer.visible,
          opacity: layer.opacity,
          data: layer.canvas?.toDataURL() || '',
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.download = 'pixel-art.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  function exportPNG() {
    // Create a composite canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = props.canvasWidth.value * props.pixelSize.value;
    exportCanvas.height = props.canvasHeight.value * props.pixelSize.value;
    const exportCtx = exportCanvas.getContext('2d');

    if (!exportCtx) {
      console.error('Failed to get 2d context for export canvas');
      return;
    }

    exportCtx.imageSmoothingEnabled = false;

    // Draw all visible layers
    props.layers.value.forEach((layer) => {
      if (layer.visible && layer.canvas) {
        exportCtx.globalAlpha = layer.opacity;
        exportCtx.drawImage(layer.canvas, 0, 0);
      }
    });

    exportCtx.globalAlpha = 1;

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }

  return {
    importImage,
    loadProject,
    saveProject,
    exportPNG,
  };
}
