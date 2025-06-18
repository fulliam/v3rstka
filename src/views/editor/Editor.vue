<template>
  <div
    id="app"
    class="pixel-editor"
  >
    <!-- Header -->
    <AppHeader
      :canUndo="canUndo"
      :canRedo="canRedo"
      @newProject="newProject"
      @importImage="importImage"
      @loadProject="loadProject"
      @saveProject="saveProject"
      @exportPNG="exportPNG"
      @undo="undo"
      @redo="redo"
      @clearCanvas="clearCanvas"
      @resizeCanvas="resizeCanvas"
      @toggleShortcuts="showShortcuts = !showShortcuts"
    />

    <div class="editor-layout">
      <!-- Left Sidebar - Color Palette -->
      <ColorPalette
        :collapsed="leftSidebarCollapsed"
        :primaryColor="primaryColor"
        :secondaryColor="secondaryColor"
        :colorPalette="colorPalette"
        :extendedColorPalette="extendedColorPalette"
        @toggleCollapsed="leftSidebarCollapsed = !leftSidebarCollapsed"
        @selectColor="selectColor"
        @clearPalette="clearPalette"
        @showColorPicker="showCustomColorPicker = true"
        @swapColors="swapColors"
      />

      <!-- Main Canvas Area -->
      <CanvasArea
        ref="canvasAreaRef"
        :layers="layers"
        :currentLayer="currentLayer"
        :currentFrame="currentFrame"
        :canvasWidth="canvasWidth"
        :canvasHeight="canvasHeight"
        :pixelSize="pixelSize"
        :zoom="zoom"
        :panX="panX"
        :panY="panY"
        :currentTool="currentTool"
        :brushSize="brushSize"
        :primaryColor="primaryColor"
        :secondaryColor="secondaryColor"
        :isPanning="isPanning"
        :tempHandTool="tempHandTool"
        :showGrid="showGrid"
        @updateZoom="updateZoom"
        @updatePan="updatePan"
        @updateIsPanning="updateIsPanning"
        @saveHistory="saveHistory"
        @toggleGrid="toggleGrid"
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @resetZoom="resetZoom"
        @fitToScreen="fitToScreen"
        @centerCanvas="centerCanvas"
        @pickColor="pickColor"
        @canvasChanged="handleCanvasChanged"
      />

      <!-- Right Sidebar - Layers & Frames -->
      <LayersFrames
        ref="layersFramesRef"
        :collapsed="rightSidebarCollapsed"
        :frames="frames"
        :currentFrame="currentFrame"
        :layers="layers"
        :currentLayer="currentLayer"
        :isAnimating="isAnimating"
        :animationFPS="animationFPS"
        @toggleCollapsed="rightSidebarCollapsed = !rightSidebarCollapsed"
        @addFrame="addFrame"
        @duplicateFrame="duplicateFrame"
        @deleteFrame="deleteFrame"
        @switchFrame="switchFrame"
        @toggleAnimation="toggleAnimation"
        @updateFps="animationFPS = $event"
        @addLayer="addLayer"
        @duplicateLayer="duplicateLayer"
        @deleteLayer="deleteLayer"
        @moveLayerUp="moveLayerUp"
        @moveLayerDown="moveLayerDown"
        @selectLayer="selectLayer"
        @toggleLayerVisibility="toggleLayerVisibility"
        @updateLayerOpacity="updateLayerOpacity"
        @updateLayerName="updateLayerName"
      />
    </div>

    <!-- Floating Tool Panel -->
    <ToolPanel
      :expanded="toolPanelExpanded"
      :currentTool="currentTool"
      :brushSize="brushSize"
      :primaryColor="primaryColor"
      @toggleExpanded="toolPanelExpanded = !toolPanelExpanded"
      @selectTool="selectTool"
      @updateBrushSize="brushSize = $event"
    />

    <!-- Mobile Menu -->
    <MobileMenu
      v-if="showMobileMenu"
      :primaryColor="primaryColor"
      :secondaryColor="secondaryColor"
      :colorPalette="colorPalette"
      @close="showMobileMenu = false"
      @selectColor="selectColor"
      @showColorPicker="showCustomColorPicker = true"
    />

    <!-- Custom Color Picker -->
    <ColorPicker
      v-if="showCustomColorPicker"
      :currentColor="currentPickerColor"
      @close="showCustomColorPicker = false"
      @applyColor="applyPickerColor"
      @addToPalette="addCurrentColorToPalette"
      @updateColor="currentPickerColor = $event"
    />

    <!-- Shortcuts Help -->
    <ShortcutsHelp
      v-if="showShortcuts"
      @close="showShortcuts = false"
    />

    <!-- Mobile Menu Button -->
    <button
      v-if="isMobile"
      class="mobile-menu-btn glass-button"
      @click="showMobileMenu = true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        class="icon"
      >
        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import AppHeader from './components/app-header/AppHeader.vue';
import ColorPalette from './components/color-palette/ColorPalette.vue';
import CanvasArea from './components/canvas-area/CanvasArea.vue';
import LayersFrames from './components/layer-frames/LayersFrames.vue';
import ToolPanel from './components/tool-panel/ToolPanel.vue';
import MobileMenu from './components/mobile-menu/MobileMenu.vue';
import ColorPicker from './components/color-picker/ColorPicker.vue';
import ShortcutsHelp from './components/shortcuts-help/ShortcutsHelp.vue';

import { usePixelEditor } from './composables/usePixelEditor';
import { useCanvasOperations } from './composables/useCanvasOperations';
import { useLayerManagement } from './composables/useLayerManagement';
import { useFrameManagement } from './composables/useFrameManagement';
import { useColorManagement } from './composables/useColorManagement';
import { useHistoryManagement } from './composables/useHistoryManagement';
import { useProjectManagement } from './composables/useProjectManagement';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';

// Main editor state
const {
  // Canvas properties
  canvasWidth,
  canvasHeight,
  pixelSize,
  zoom,
  panX,
  panY,

  // Tools and colors
  currentTool,
  brushSize,
  primaryColor,
  secondaryColor,
  currentPickerColor,
  colorPalette,
  extendedColorPalette,

  // UI state
  leftSidebarCollapsed,
  rightSidebarCollapsed,
  toolPanelExpanded,
  showGrid,
  showCustomColorPicker,
  showMobileMenu,
  showShortcuts,
  isPanning,
  tempHandTool,
  isMobile,
} = usePixelEditor();

// Canvas area reference
const canvasAreaRef = ref(null);
const layersFramesRef = ref(null);

// Layer management
const {
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
} = useLayerManagement();

// Frame management
const {
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
} = useFrameManagement({ layers, currentLayer });

// Canvas operations
const {
  centerCanvas,
  zoomIn,
  zoomOut,
  resetZoom,
  fitToScreen,
  clearCanvas,
  resizeCanvas,
  toggleGrid,
} = useCanvasOperations({
  canvasAreaRef,
  zoom,
  panX,
  panY,
  isPanning,
  tempHandTool,
  currentTool,
  brushSize,
  primaryColor,
  secondaryColor,
  canvasWidth,
  canvasHeight,
  pixelSize,
  showGrid,
  layers,
  currentLayer,
});

// Color management
const {
  selectColor,
  clearPalette,
  applyPickerColor,
  addCurrentColorToPalette,
  swapColors,
} = useColorManagement({
  primaryColor,
  secondaryColor,
  currentPickerColor,
  colorPalette,
  showCustomColorPicker,
  showMobileMenu,
});

// History management
const { canUndo, canRedo, undo, redo, saveHistory } = useHistoryManagement({
  layers,
  currentLayer,
  currentFrame,
});

// Project management
const { importImage, loadProject, saveProject, exportPNG } =
  useProjectManagement({
    canvasWidth,
    canvasHeight,
    pixelSize,
    zoom,
    panX,
    panY,
    currentTool,
    brushSize,
    primaryColor,
    secondaryColor,
    colorPalette,
    extendedColorPalette,
    frames,
    layers,
    currentLayer,
    resizeLayerCanvases,
    updatePreviews: () => updatePreviews(),
    saveCurrentLayersToFrame,
  });

// Tool selection
const selectTool = (tool: string) => {
  currentTool.value = tool;
};

// Pan update
const updatePan = (panData: { x: number; y: number }) => {
  panX.value = panData.x;
  panY.value = panData.y;
};

// Zoom update
const updateZoom = (newZoom: number) => {
  zoom.value = newZoom;
};

// IsPanning update
const updateIsPanning = (newIsPanning: boolean) => {
  isPanning.value = newIsPanning;
};

// Pick color from canvas
const pickColor = (color: string) => {
  primaryColor.value = color;
  currentPickerColor.value = color;
};

// Handle canvas changes
const handleCanvasChanged = () => {
  // Save current layers to frame when canvas changes
  saveCurrentLayersToFrame();
  // Update previews
  updatePreviews();
};

// Keyboard shortcuts
const { handleKeyDown, handleKeyUp } = useKeyboardShortcuts({
  currentTool,
  tempHandTool,
  showShortcuts,
  selectTool,
  zoomIn,
  zoomOut,
  resetZoom,
  undo,
  redo,
  saveProject,
  addLayer,
  addFrame,
});

// New project
const newProject = () => {
  if (confirm('Create new project? This will clear current work.')) {
    // Reset to default state
    canvasWidth.value = 32;
    canvasHeight.value = 32;
    zoom.value = 8;
    panX.value = 0;
    panY.value = 0;
    currentTool.value = 'pencil';
    brushSize.value = 1;
    primaryColor.value = '#000000';
    secondaryColor.value = '#ffffff';

    // Clear layers and create new one
    layers.value = [];
    addLayer();

    centerCanvas();
  }
};

// Update layer and frame previews
const updatePreviews = () => {
  nextTick(() => {
    if (layersFramesRef.value) {
      // Update layer previews
      layers.value.forEach((layer, index) => {
        const previewCanvas = layersFramesRef.value.layerPreviewRefs[index];
        if (previewCanvas && layer.canvas) {
          const ctx = previewCanvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 32, 32);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
              layer.canvas,
              0,
              0,
              layer.canvas.width,
              layer.canvas.height,
              0,
              0,
              32,
              32
            );
          }
        }
      });

      // Update frame previews
      frames.value.forEach((frame, index) => {
        const previewCanvas = layersFramesRef.value.framePreviewRefs[index];
        if (previewCanvas) {
          const ctx = previewCanvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 32, 32);
            ctx.imageSmoothingEnabled = false;

            // Composite all visible layers
            frame.layers.forEach((layer) => {
              if (layer.visible && layer.canvas) {
                ctx.globalAlpha = layer.opacity;
                ctx.drawImage(
                  layer.canvas,
                  0,
                  0,
                  layer.canvas.width,
                  layer.canvas.height,
                  0,
                  0,
                  32,
                  32
                );
              }
            });
            ctx.globalAlpha = 1;
          }
        }
      });
    }
  });
};

// Watch for canvas size changes to resize layer canvases
watch(
  [canvasWidth, canvasHeight, pixelSize],
  () => {
    resizeLayerCanvases(canvasWidth.value, canvasHeight.value, pixelSize.value);
  },
  { immediate: false }
);

// Watch for changes to update previews
watch([layers, frames], updatePreviews, { deep: true });

// Initialize history after layers are created
watch(
  layers,
  () => {
    if (layers.value.length > 0) {
      // Initialize history with first state
      setTimeout(() => {
        saveHistory();
      }, 100);
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Center canvas on mount
  setTimeout(() => {
    centerCanvas();
    updatePreviews();
  }, 100);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
});
</script>

<style scoped lang="scss">
@use './Editor.scss';
</style>
