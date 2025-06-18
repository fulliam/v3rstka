import { ref } from 'vue';

export function usePixelEditor() {
  // Canvas properties
  const canvasWidth = ref(32);
  const canvasHeight = ref(32);
  const pixelSize = ref(16);
  const zoom = ref(8);
  const panX = ref(0);
  const panY = ref(0);

  // Tools and colors
  const currentTool = ref('pencil');
  const brushSize = ref(1);
  const primaryColor = ref('#000000');
  const secondaryColor = ref('#ffffff');
  const currentPickerColor = ref('#000000');

  // Color palettes
  const colorPalette = ref([
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#800000',
    '#008000',
    '#000080',
    '#808000',
    '#800080',
    '#008080',
    '#c0c0c0',
    '#808080',
  ]);

  const extendedColorPalette = ref([
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
    '#00d2d3',
    '#ff9f43',
    '#10ac84',
    '#ee5a24',
    '#0abde3',
    '#3867d6',
    '#8854d0',
    '#a55eea',
    '#26de81',
    '#fd79a8',
    '#fdcb6e',
    '#6c5ce7',
    '#fd79a8',
    '#fdcb6e',
    '#e17055',
    '#74b9ff',
    '#0984e3',
    '#6c5ce7',
    '#a29bfe',
    '#fd79a8',
    '#fdcb6e',
    '#e17055',
    '#00b894',
    '#00cec9',
  ]);

  // UI state
  const leftSidebarCollapsed = ref(false);
  const rightSidebarCollapsed = ref(false);
  const toolPanelExpanded = ref(false);
  const showGrid = ref(true);
  const showCustomColorPicker = ref(false);
  const showMobileMenu = ref(false);
  const showShortcuts = ref(false);
  const isPanning = ref(false);
  const tempHandTool = ref(false);
  const isMobile = ref(window.innerWidth <= 768);

  return {
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
  };
}
