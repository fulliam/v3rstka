<template>
  <div
    class="pixel-editor"
    tabindex="0"
    @keydown="handleKeyDown"
    @keyup="handleKeyUp"
  >
    <!-- Header with glassmorphism -->
    <header class="header glass-panel">
      <div class="header-left">
        <button
          class="mobile-menu-toggle glass-button"
          @click="showMobileMenu = !showMobileMenu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <h1 class="title">Pixel Art Studio</h1>
        <div class="canvas-info">
          {{ canvasWidth }}×{{ canvasHeight }} | Frame {{ currentFrame + 1 }}/{{
            frames.length
          }}
          <span class="layer-info">| {{ layers[currentLayer]?.name }}</span>
        </div>
      </div>

      <div class="header-center">
        <div class="history-controls">
          <button
            :disabled="!canUndo"
            class="glass-button glass-button-small"
            title="Undo (⌘Z)"
            @click="undo"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon"
            >
              <path
                d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
              />
            </svg>
          </button>
          <button
            :disabled="!canRedo"
            class="glass-button glass-button-small"
            title="Redo (⌘⇧Z)"
            @click="redo"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon"
            >
              <path
                d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="header-right">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="importImage"
        />
        <input
          ref="projectFileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="loadProject"
        />
        <button
          class="glass-button glass-button-small"
          @click="$refs.fileInput.click()"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
            />
          </svg>
          <span class="btn-text">Import</span>
        </button>
        <button
          class="glass-button glass-button-small"
          @click="$refs.projectFileInput.click()"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
          </svg>
          <span class="btn-text">Load</span>
        </button>
        <button
          class="glass-button glass-button-small"
          @click="saveProject"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"
            />
          </svg>
          <span class="btn-text">Save</span>
        </button>
        <button
          class="glass-button glass-button-primary"
          @click="exportPNG"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon-small"
          >
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
            />
          </svg>
          <span class="btn-text">Export</span>
        </button>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="showMobileMenu"
      class="mobile-menu-overlay"
      @click="showMobileMenu = false"
    >
      <div
        class="mobile-menu glass-panel-enhanced"
        @click.stop
      >
        <div class="mobile-menu-header">
          <h3>Tools & Options</h3>
          <button
            class="close-btn glass-button"
            @click="showMobileMenu = false"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon"
            >
              <path
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
        </div>
        <div class="mobile-menu-content">
          <!-- Mobile color palette -->
          <div class="mobile-section">
            <h4>Colors</h4>
            <div class="mobile-color-section">
              <div class="mobile-current-colors">
                <div class="color-display">
                  <div
                    class="primary-color"
                    :style="{ backgroundColor: primaryColor }"
                    @click="showCustomColorPicker = true"
                  ></div>
                  <div
                    class="secondary-color"
                    :style="{ backgroundColor: secondaryColor }"
                  ></div>
                </div>
                <div class="color-values">
                  <div class="color-value">
                    {{ primaryColor.toUpperCase() }}
                  </div>
                </div>
              </div>

              <div class="mobile-palette-grid">
                <div
                  v-for="color in colorPalette"
                  :key="color"
                  :class="['palette-color', { active: primaryColor === color }]"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color, 'primary')"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-container">
      <!-- Left Sidebar - Color Palette with Enhanced Glassmorphism -->
      <aside
        class="sidebar sidebar-left glass-panel-enhanced"
        :class="{ collapsed: leftSidebarCollapsed }"
      >
        <button
          class="sidebar-toggle glass-button"
          @click="leftSidebarCollapsed = !leftSidebarCollapsed"
        >
          <svg
            v-if="!leftSidebarCollapsed"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        <div
          v-if="!leftSidebarCollapsed"
          class="sidebar-content"
        >
          <div class="panel glass-panel-inner">
            <h3 class="panel-title">
              Color Palette
              <button
                class="expand-btn glass-button"
                @click="expandedPalette = !expandedPalette"
              >
                <svg
                  v-if="!expandedPalette"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon-small"
                >
                  <path
                    d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                  />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon-small"
                >
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
              </button>
            </h3>

            <div class="color-section">
              <div class="current-colors">
                <div class="color-display-enhanced">
                  <div
                    class="primary-color-enhanced"
                    :style="{ backgroundColor: primaryColor }"
                    title="Primary Color (Left Click)"
                    @click="showCustomColorPicker = true"
                  ></div>
                  <div
                    class="secondary-color-enhanced"
                    :style="{ backgroundColor: secondaryColor }"
                    title="Secondary Color (Right Click)"
                  ></div>
                </div>
                <div class="color-values-enhanced">
                  <div class="color-value primary">
                    {{ primaryColor.toUpperCase() }}
                  </div>
                  <div class="color-value secondary">
                    {{ secondaryColor.toUpperCase() }}
                  </div>
                </div>
              </div>

              <div
                class="palette-container"
                :class="{ expanded: expandedPalette }"
              >
                <div class="palette-grid-enhanced">
                  <div
                    v-for="color in expandedPalette
                      ? extendedColorPalette
                      : colorPalette"
                    :key="color"
                    :class="[
                      'palette-color-enhanced',
                      {
                        active: primaryColor === color,
                        secondary: secondaryColor === color,
                      },
                    ]"
                    :style="{ backgroundColor: color }"
                    :title="color"
                    @click="selectColor(color, 'primary')"
                    @contextmenu.prevent="selectColor(color, 'secondary')"
                  ></div>
                </div>
              </div>

              <div class="palette-actions">
                <button
                  class="glass-button glass-button-small"
                  @click="showCustomColorPicker = true"
                >
                  Custom Color
                </button>
                <button
                  class="glass-button glass-button-small"
                  @click="clearPalette"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Canvas Area -->
      <main class="canvas-container">
        <div class="canvas-toolbar glass-panel">
          <div class="zoom-controls">
            <button
              class="glass-button glass-button-small"
              title="Zoom Out (-)"
              @click="zoomOut"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                class="icon-small"
              >
                <path d="M19,13H5V11H19V13Z" />
              </svg>
            </button>
            <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
            <button
              class="glass-button glass-button-small"
              title="Zoom In (+)"
              @click="zoomIn"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                class="icon-small"
              >
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
            </button>
            <button
              class="glass-button glass-button-small"
              title="Reset Zoom (0)"
              @click="resetZoom"
            >
              Reset
            </button>
            <button
              class="glass-button glass-button-small"
              title="Fit to Screen"
              @click="fitToScreen"
            >
              Fit
            </button>
          </div>
          <div class="canvas-controls">
            <button
              class="glass-button glass-button-small"
              @click="centerCanvas"
            >
              Center
            </button>
            <button
              class="glass-button glass-button-danger glass-button-small"
              @click="clearCanvas"
            >
              Clear
            </button>
            <button
              class="glass-button glass-button-small mobile-hidden"
              @click="resizeCanvas"
            >
              Resize
            </button>
          </div>
        </div>

        <div
          ref="canvasWrapper"
          class="canvas-wrapper"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @mouseleave="handleCanvasMouseLeave"
          @wheel="handleWheel"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            ref="canvasInner"
            class="canvas-container-inner"
            :style="{
              transform: `translateX(${panX}px) translateY(${panY}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }"
          >
            <!-- Enhanced Grid Background -->
            <canvas
              ref="gridCanvas"
              :width="canvasWidth * pixelSize"
              :height="canvasHeight * pixelSize"
              class="grid-canvas"
            ></canvas>

            <!-- Layer Canvases -->
            <canvas
              v-for="(layer, index) in layers"
              :key="layer.id"
              :ref="(el) => (layerCanvasRefs[index] = el)"
              :width="canvasWidth * pixelSize"
              :height="canvasHeight * pixelSize"
              :style="{
                opacity: layer.visible ? layer.opacity : 0,
                zIndex: index + 1,
              }"
              class="layer-canvas"
            ></canvas>

            <!-- Drawing Canvas -->
            <canvas
              ref="drawingCanvas"
              :width="canvasWidth * pixelSize"
              :height="canvasHeight * pixelSize"
              :style="{
                cursor: getCursor(),
                zIndex: layers.length + 1,
              }"
              class="drawing-canvas"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @contextmenu.prevent
            ></canvas>

            <!-- Enhanced Brush Size Indicator -->
            <div
              v-if="
                showBrushIndicator &&
                (currentTool === 'pencil' || currentTool === 'eraser')
              "
              class="brush-indicator"
              :style="{
                left: (brushIndicatorX - panX) / zoom + 'px',
                top: (brushIndicatorY - panY) / zoom + 'px',
                width: brushSize * pixelSize + 'px',
                height: brushSize * pixelSize + 'px',
                transform: 'translate(-50%, -50%)',
                border:
                  currentTool === 'eraser'
                    ? '2px dashed rgba(255, 107, 107, 0.8)'
                    : '2px solid rgba(0, 122, 204, 0.8)',
                backgroundColor:
                  currentTool === 'eraser'
                    ? 'rgba(255, 107, 107, 0.1)'
                    : 'rgba(0, 122, 204, 0.1)',
              }"
            ></div>
          </div>
        </div>
      </main>

      <!-- Right Sidebar - Layers & Frames with Enhanced Glassmorphism -->
      <aside
        class="sidebar sidebar-right glass-panel-enhanced"
        :class="{ collapsed: rightSidebarCollapsed }"
      >
        <button
          class="sidebar-toggle right glass-button"
          @click="rightSidebarCollapsed = !rightSidebarCollapsed"
        >
          <svg
            v-if="!rightSidebarCollapsed"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div
          v-if="!rightSidebarCollapsed"
          class="sidebar-content"
        >
          <div class="panel glass-panel-inner">
            <h3 class="panel-title">Frames</h3>
            <div class="frame-controls">
              <button
                class="glass-button glass-button-small"
                title="Add Frame (⌘⇧N)"
                @click="addFrame"
              >
                Add
              </button>
              <button
                class="glass-button glass-button-small"
                @click="duplicateFrame"
              >
                Duplicate
              </button>
              <button
                class="glass-button glass-button-danger glass-button-small"
                :disabled="frames.length <= 1"
                @click="deleteFrame"
              >
                Delete
              </button>
            </div>
            <div class="frame-list">
              <div
                v-for="(frame, index) in frames"
                :key="frame.id"
                :class="[
                  'frame-item-enhanced',
                  { active: currentFrame === index },
                ]"
                @click="switchToFrame(index)"
              >
                <span class="frame-label">Frame {{ index + 1 }}</span>
                <canvas
                  :ref="(el) => (framePreviewRefs[index] = el)"
                  class="frame-preview-enhanced"
                  :width="32"
                  :height="32"
                ></canvas>
              </div>
            </div>
            <div class="animation-controls">
              <button
                class="glass-button glass-button-small"
                @click="toggleAnimation"
              >
                {{ isAnimating ? 'Stop' : 'Play' }}
              </button>
              <label class="fps-control">
                FPS:
                <input
                  v-model.number="animationFPS"
                  type="range"
                  min="1"
                  max="30"
                  class="fps-slider glass-slider"
                />
                {{ animationFPS }}
              </label>
            </div>
          </div>

          <div class="panel glass-panel-inner">
            <h3 class="panel-title">Layers</h3>
            <div class="layer-controls">
              <button
                class="glass-button glass-button-small"
                title="Add Layer (⌘⇧L)"
                @click="addLayer"
              >
                Add
              </button>
              <button
                class="glass-button glass-button-small"
                @click="duplicateLayer"
              >
                Duplicate
              </button>
              <button
                class="glass-button glass-button-danger glass-button-small"
                :disabled="layers.length <= 1"
                @click="deleteLayer"
              >
                Delete
              </button>
              <button
                class="glass-button glass-button-small"
                :disabled="currentLayer >= layers.length - 1"
                @click="moveLayerUp"
              >
                ↑
              </button>
              <button
                class="glass-button glass-button-small"
                :disabled="currentLayer <= 0"
                @click="moveLayerDown"
              >
                ↓
              </button>
            </div>
            <div class="layer-list">
              <div
                v-for="(layer, index) in layers.slice().reverse()"
                :key="layer.id"
                :class="[
                  'layer-item-redesigned',
                  {
                    active: currentLayer === layers.length - 1 - index,
                    visible: layer.visible,
                  },
                ]"
                @click="selectLayer(layers.length - 1 - index)"
              >
                <!-- Layer Preview Thumbnail -->
                <div class="layer-preview-container">
                  <canvas
                    :ref="
                      (el) => (layerPreviewRefs[layers.length - 1 - index] = el)
                    "
                    class="layer-preview-canvas"
                    :width="32"
                    :height="32"
                  ></canvas>
                  <div
                    v-if="!layer.visible"
                    class="layer-preview-overlay"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="icon-tiny"
                    >
                      <path
                        d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Layer Info -->
                <div class="layer-info-container">
                  <div class="layer-header-redesigned">
                    <button
                      class="visibility-btn-redesigned glass-button-icon"
                      :class="{ visible: layer.visible }"
                      :title="layer.visible ? 'Hide Layer' : 'Show Layer'"
                      @click.stop="
                        toggleLayerVisibility(layers.length - 1 - index)
                      "
                    >
                      <svg
                        v-if="layer.visible"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="icon-tiny"
                      >
                        <path
                          d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
                        />
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="icon-tiny"
                      >
                        <path
                          d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"
                        />
                      </svg>
                    </button>

                    <input
                      v-model="layer.name"
                      class="layer-name-input-redesigned glass-input"
                      :placeholder="`Layer ${layers.length - index}`"
                      @click.stop
                      @blur="saveHistory"
                    />

                    <div class="layer-opacity-display">
                      {{ Math.round(layer.opacity * 100) }}%
                    </div>
                  </div>

                  <div
                    class="layer-footer-redesigned"
                    @click.stop
                  >
                    <input
                      type="range"
                      :value="layer.opacity"
                      min="0"
                      max="1"
                      step="0.05"
                      class="opacity-slider-redesigned glass-slider"
                      @input="
                        updateLayerOpacity(layers.length - 1 - index, $event)
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Compact Floating Tool Panel -->
    <div
      class="floating-tool-panel-compact glass-panel-enhanced"
      :class="{ expanded: toolPanelExpanded }"
    >
      <div
        class="tool-panel-toggle-compact"
        @click="toolPanelExpanded = !toolPanelExpanded"
      >
        <div class="tool-toggle-content">
          <svg
            v-if="!toolPanelExpanded"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
          <span class="current-tool-indicator">
            {{ currentTool.charAt(0).toUpperCase() + currentTool.slice(1) }}
          </span>
        </div>
      </div>

      <div
        v-if="toolPanelExpanded"
        class="tool-panel-content-compact"
      >
        <div class="tool-grid-compact">
          <!-- Pencil Tool -->
          <button
            :class="[
              'tool-btn-compact',
              'glass-button-tool',
              { active: currentTool === 'pencil' },
            ]"
            title="Pencil Tool (P)"
            @click="selectTool('pencil')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="tool-icon-compact"
            >
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>

          <!-- Eraser Tool -->
          <button
            :class="[
              'tool-btn-compact',
              'glass-button-tool',
              { active: currentTool === 'eraser' },
            ]"
            title="Eraser Tool (E)"
            @click="selectTool('eraser')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="tool-icon-compact"
            >
              <path
                d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-6.36-6.36-3.54 3.36z"
              />
            </svg>
          </button>

          <!-- Fill Tool -->
          <button
            :class="[
              'tool-btn-compact',
              'glass-button-tool',
              { active: currentTool === 'fill' },
            ]"
            title="Fill Tool (F)"
            @click="selectTool('fill')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="tool-icon-compact"
            >
              <path d="M19,11H5V13H19V11Z" />
            </svg>
          </button>

          <!-- Color Picker Tool -->
          <button
            :class="[
              'tool-btn-compact',
              'glass-button-tool',
              { active: currentTool === 'picker' },
            ]"
            title="Color Picker (I)"
            @click="selectTool('picker')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="tool-icon-compact"
            >
              <path
                d="M2.5,4.27L3.91,2.86L8.5,7.45L7.09,8.86L2.5,4.27M16,12.15L11.85,8L20.07,2.42L21.5,3.85L16,12.15M8.3,8.3L4.27,12.33C3.5,13.1 3.5,14.34 4.27,15.11L8.89,19.73C9.66,20.5 10.9,20.5 11.67,19.73L15.7,15.7L8.3,8.3Z"
              />
            </svg>
          </button>

          <!-- Hand Tool -->
          <button
            :class="[
              'tool-btn-compact',
              'glass-button-tool',
              { active: currentTool === 'hand' },
            ]"
            title="Hand Tool (H)"
            @click="selectTool('hand')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="tool-icon-compact"
            >
              <path
                d="M13,6V8H9V6H13M9,10H13V14H11V12H9V10M15,4H7V6H15V4M15,8H7V10H15V8M7,12V14H15V12H7Z"
              />
            </svg>
          </button>
        </div>

        <!-- Compact Brush Size Control -->
        <div
          v-if="currentTool === 'pencil' || currentTool === 'eraser'"
          class="brush-controls-compact"
        >
          <div class="brush-size-compact">
            <span class="brush-label-compact">Size: {{ brushSize }}</span>
            <input
              v-model.number="brushSize"
              type="range"
              min="1"
              max="20"
              class="brush-slider-compact glass-slider"
            />
            <div class="brush-preview-compact">
              <div
                class="brush-preview-square-compact"
                :style="{
                  width: Math.max(4, brushSize * 2) + 'px',
                  height: Math.max(4, brushSize * 2) + 'px',
                  backgroundColor:
                    currentTool === 'eraser' ? 'transparent' : primaryColor,
                  border:
                    currentTool === 'eraser'
                      ? '1px dashed rgba(255, 107, 107, 0.8)'
                      : '1px solid rgba(255, 255, 255, 0.3)',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Color Picker Modal -->
    <div
      v-if="showCustomColorPicker"
      class="color-picker-overlay"
      @click="showCustomColorPicker = false"
    >
      <div
        class="custom-color-picker glass-panel-enhanced"
        @click.stop
      >
        <div class="color-picker-header">
          <h3>Color Picker</h3>
          <button
            class="close-btn glass-button"
            @click="showCustomColorPicker = false"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon"
            >
              <path
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
        </div>

        <div class="color-picker-content">
          <!-- HSV Color Picker -->
          <div class="hsv-picker">
            <div
              ref="hsvPicker"
              class="hue-saturation-picker"
              :style="{ backgroundColor: `hsl(${hsvColor.h}, 100%, 50%)` }"
              @mousedown="startHSVPicking"
              @mousemove="updateHSVPicking"
              @mouseup="stopHSVPicking"
            >
              <div class="saturation-overlay"></div>
              <div class="value-overlay"></div>
              <div
                class="hsv-cursor"
                :style="{
                  left: hsvColor.s * 200 + 'px',
                  top: (1 - hsvColor.v) * 200 + 'px',
                }"
              ></div>
            </div>

            <div class="hue-slider-container">
              <input
                v-model.number="hsvColor.h"
                type="range"
                min="0"
                max="360"
                class="hue-slider glass-slider"
                @input="updateColorFromHSV"
              />
            </div>
          </div>

          <!-- Color Preview and Values -->
          <div class="color-preview-section">
            <div
              class="color-preview-large"
              :style="{ backgroundColor: currentPickerColor }"
            ></div>
            <div class="color-inputs-section">
              <div class="color-input-group">
                <label>Hex</label>
                <input
                  v-model="hexInput"
                  type="text"
                  class="color-input-field glass-input"
                  placeholder="#000000"
                  @input="updateColorFromHex"
                />
              </div>
              <div class="color-input-group">
                <label>RGB</label>
                <div class="rgb-inputs">
                  <input
                    v-model.number="rgbColor.r"
                    type="number"
                    min="0"
                    max="255"
                    class="color-input-field glass-input"
                    @input="updateColorFromRGB"
                  />
                  <input
                    v-model.number="rgbColor.g"
                    type="number"
                    min="0"
                    max="255"
                    class="color-input-field glass-input"
                    @input="updateColorFromRGB"
                  />
                  <input
                    v-model.number="rgbColor.b"
                    type="number"
                    min="0"
                    max="255"
                    class="color-input-field glass-input"
                    @input="updateColorFromRGB"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Color Picker Actions -->
          <div class="color-picker-actions">
            <button
              class="glass-button"
              @click="addCurrentColorToPalette"
            >
              Add to Palette
            </button>
            <button
              class="glass-button glass-button-primary"
              @click="applyPickerColor"
            >
              Apply Color
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts Help -->
    <div
      v-if="showShortcuts"
      class="shortcuts-overlay"
      @click="showShortcuts = false"
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
          @click="showShortcuts = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}

interface Frame {
  id: number;
  layers: Layer[];
}

interface Tool {
  name: string;
  shortcut: string;
}

interface HistoryState {
  layers: Layer[];
  currentLayer: number;
  currentFrame: number;
}

interface HSVColor {
  h: number;
  s: number;
  v: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Reactive state
const gridCanvas = ref<HTMLCanvasElement>();
const drawingCanvas = ref<HTMLCanvasElement>();
const canvasWrapper = ref<HTMLDivElement>();
const canvasInner = ref<HTMLDivElement>();
const layerCanvasRefs = ref<HTMLCanvasElement[]>([]);
const layerPreviewRefs = ref<HTMLCanvasElement[]>([]);
const framePreviewRefs = ref<HTMLCanvasElement[]>([]);
const fileInput = ref<HTMLInputElement>();
const projectFileInput = ref<HTMLInputElement>();
const hsvPicker = ref<HTMLDivElement>();

// Canvas properties - Fixed: Default zoom to 1 (100%)
const canvasWidth = ref(32);
const canvasHeight = ref(32);
const pixelSize = ref(16);
const zoom = ref(1); // Fixed: Set to 1 for 100% default zoom
const panX = ref(0);
const panY = ref(0);

// UI state
const leftSidebarCollapsed = ref(false);
const rightSidebarCollapsed = ref(false);
const expandedPalette = ref(false);
const showCustomColorPicker = ref(false);
const showShortcuts = ref(false);
const showMobileMenu = ref(false);
const toolPanelExpanded = ref(true);

// Tool state
const currentTool = ref('pencil');
const brushSize = ref(1);
const primaryColor = ref('#000000');
const secondaryColor = ref('#ffffff');

// Custom Color Picker State
const currentPickerColor = ref('#000000');
const hexInput = ref('#000000');
const hsvColor = ref<HSVColor>({ h: 0, s: 0, v: 0 });
const rgbColor = ref<RGBColor>({ r: 0, g: 0, b: 0 });
const isHSVPicking = ref(false);

// Brush indicator
const showBrushIndicator = ref(false);
const brushIndicatorX = ref(0);
const brushIndicatorY = ref(0);

// Pan state
const isPanning = ref(false);
const panStartX = ref(0);
const panStartY = ref(0);
const tempHandTool = ref(false);

// Touch state
const lastTouchDistance = ref(0);
const touchStartPanX = ref(0);
const touchStartPanY = ref(0);

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
  '#808080',
  '#800000',
]);

const extendedColorPalette = ref([
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#808080',
  '#800000',
  '#008000',
  '#000080',
  '#808000',
  '#800080',
  '#008080',
  '#c0c0c0',
  '#ffa500',
  '#a52a2a',
  '#dda0dd',
  '#98fb98',
  '#f0e68c',
  '#dda0dd',
  '#87ceeb',
  '#ffd700',
  '#ff69b4',
  '#cd5c5c',
  '#4b0082',
  '#f0f8ff',
  '#faebd7',
  '#00ffff',
  '#7fffd4',
  '#f0ffff',
  '#f5f5dc',
  '#ffe4c4',
  '#000000',
  '#ffebcd',
  '#0000ff',
  '#8a2be2',
  '#a52a2a',
  '#deb887',
]);

const tools: Tool[] = [
  { name: 'pencil', shortcut: 'P' },
  { name: 'eraser', shortcut: 'E' },
  { name: 'fill', shortcut: 'F' },
  { name: 'picker', shortcut: 'I' },
  { name: 'hand', shortcut: 'H' },
];

// Drawing state
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);

// Layer system
const layers = ref<Layer[]>([]);
const currentLayer = ref(0);

// Frame system
const frames = ref<Frame[]>([]);
const currentFrame = ref(0);
const isAnimating = ref(false);
const animationFPS = ref(8);
let animationInterval: number | null = null;

// History system
const history = ref<HistoryState[]>([]);
const historyIndex = ref(-1);
const maxHistorySize = 50;

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

let layerId = 0;
let frameId = 0;
let drawingContext: CanvasRenderingContext2D | null = null;
let gridContext: CanvasRenderingContext2D | null = null;

// Performance optimization
let drawingQueue: Array<() => void> = [];
let isProcessingQueue = false;

// Responsive breakpoints
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
});

// Initialize
onMounted(() => {
  initializeEditor();
  setupEventListeners();
  // Fixed: Ensure canvas is properly centered on load
  setTimeout(() => {
    centerCanvas();
  }, 100);
  handleResize();
  initializeColorPicker();

  // Add resize listener
  window.addEventListener('resize', handleResize);
});

function handleResize() {
  if (isMobile.value) {
    leftSidebarCollapsed.value = true;
    rightSidebarCollapsed.value = true;
    toolPanelExpanded.value = false;
  }

  nextTick(() => {
    centerCanvas();
  });
}

function initializeEditor() {
  if (gridCanvas.value) {
    gridContext = gridCanvas.value.getContext('2d');
    if (gridContext) {
      gridContext.imageSmoothingEnabled = false;
      drawEnhancedGrid();
    }
  }

  if (drawingCanvas.value) {
    drawingContext = drawingCanvas.value.getContext('2d');
    if (drawingContext) {
      drawingContext.imageSmoothingEnabled = false;
    }
  }

  // Create initial layer
  createInitialLayer();

  // Create initial frame
  const initialFrame: Frame = {
    id: frameId++,
    layers: [...layers.value],
  };
  frames.value = [initialFrame];

  saveHistory();
  updateFramePreviews();
  updateLayerPreviews();
}

function createInitialLayer() {
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = canvasWidth.value * pixelSize.value;
  layerCanvas.height = canvasHeight.value * pixelSize.value;
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

function setupEventListeners() {
  nextTick(() => {
    const editor = document.querySelector('.pixel-editor') as HTMLElement;
    if (editor) {
      editor.focus();
    }
  });

  // Handle mouse move for brush indicator
  if (drawingCanvas.value) {
    drawingCanvas.value.addEventListener('mousemove', updateBrushIndicator);
    drawingCanvas.value.addEventListener(
      'mouseenter',
      () => (showBrushIndicator.value = true)
    );
    drawingCanvas.value.addEventListener(
      'mouseleave',
      () => (showBrushIndicator.value = false)
    );
  }
}

// Initialize Color Picker
function initializeColorPicker() {
  updateColorPickerFromHex(primaryColor.value);
}

// Custom Color Picker Functions
function updateColorPickerFromHex(hex: string) {
  hexInput.value = hex;
  currentPickerColor.value = hex;
  const rgb = hexToRgb(hex);
  rgbColor.value = { r: rgb.r, g: rgb.g, b: rgb.b };
  hsvColor.value = rgbToHsv(rgb.r, rgb.g, rgb.b);
}

function updateColorFromHSV() {
  const rgb = hsvToRgb(hsvColor.value.h, hsvColor.value.s, hsvColor.value.v);
  rgbColor.value = rgb;
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  hexInput.value = hex;
  currentPickerColor.value = hex;
}

function updateColorFromHex() {
  if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
    currentPickerColor.value = hexInput.value;
    const rgb = hexToRgb(hexInput.value);
    rgbColor.value = rgb;
    hsvColor.value = rgbToHsv(rgb.r, rgb.g, rgb.b);
  }
}

function updateColorFromRGB() {
  const hex = rgbToHex(rgbColor.value.r, rgbColor.value.g, rgbColor.value.b);
  hexInput.value = hex;
  currentPickerColor.value = hex;
  hsvColor.value = rgbToHsv(
    rgbColor.value.r,
    rgbColor.value.g,
    rgbColor.value.b
  );
}

function startHSVPicking(event: MouseEvent) {
  isHSVPicking.value = true;
  updateHSVFromMouse(event);
}

function updateHSVPicking(event: MouseEvent) {
  if (isHSVPicking.value) {
    updateHSVFromMouse(event);
  }
}

function stopHSVPicking() {
  isHSVPicking.value = false;
}

function updateHSVFromMouse(event: MouseEvent) {
  if (!hsvPicker.value) return;

  const rect = hsvPicker.value.getBoundingClientRect();
  const x = Math.max(0, Math.min(200, event.clientX - rect.left));
  const y = Math.max(0, Math.min(200, event.clientY - rect.top));

  hsvColor.value.s = x / 200;
  hsvColor.value.v = 1 - y / 200;

  updateColorFromHSV();
}

function applyPickerColor() {
  primaryColor.value = currentPickerColor.value;
  showCustomColorPicker.value = false;
}

function addCurrentColorToPalette() {
  if (!colorPalette.value.includes(currentPickerColor.value)) {
    colorPalette.value.push(currentPickerColor.value);
  }
}

// HSV/RGB conversion functions
function rgbToHsv(r: number, g: number, b: number): HSVColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = max === 0 ? 0 : diff / max;
  let v = max;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, v };
}

function hsvToRgb(h: number, s: number, v: number): RGBColor {
  h /= 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Enhanced keyboard shortcuts with better browser compatibility
function handleKeyDown(event: KeyboardEvent) {
  // Don't handle shortcuts when typing in inputs
  if (event.target instanceof HTMLInputElement && event.target.type === 'text')
    return;

  const key = event.key.toLowerCase();
  const ctrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
  const shift = event.shiftKey;
  const alt = event.altKey;

  // Prevent default browser shortcuts
  if (ctrl && (key === 'z' || key === 'y')) {
    event.preventDefault();
  }

  // Handle specific key combinations first
  if (ctrl && shift && key === 'z') {
    event.preventDefault();
    redo();
    return;
  }

  if (ctrl && key === 'z' && !shift) {
    event.preventDefault();
    undo();
    return;
  }

  if (ctrl && key === 'y' && !shift) {
    event.preventDefault();
    redo();
    return;
  }

  if (ctrl && key === 's') {
    event.preventDefault();
    saveProject();
    return;
  }

  // Handle space key for temporary hand tool
  if (key === ' ' && !ctrl && !shift && !alt) {
    event.preventDefault();
    if (!tempHandTool.value) {
      tempHandTool.value = true;
    }
    return;
  }

  // Handle other shortcuts
  if (!ctrl || (ctrl && !shift)) {
    switch (key) {
      case 'p':
        event.preventDefault();
        selectTool('pencil');
        break;
      case 'e':
        event.preventDefault();
        selectTool('eraser');
        break;
      case 'f':
        event.preventDefault();
        selectTool('fill');
        break;
      case 'i':
        event.preventDefault();
        selectTool('picker');
        break;
      case 'h':
        event.preventDefault();
        selectTool('hand');
        break;
      case '+':
      case '=':
        event.preventDefault();
        zoomIn();
        break;
      case '-':
        event.preventDefault();
        zoomOut();
        break;
      case '0':
        event.preventDefault();
        resetZoom();
        break;
      case '?':
        event.preventDefault();
        showShortcuts.value = !showShortcuts.value;
        break;
    }
  }

  // Handle Ctrl combinations
  if (ctrl && shift) {
    switch (key) {
      case 'l':
        event.preventDefault();
        addLayer();
        break;
      case 'n':
        event.preventDefault();
        addFrame();
        break;
    }
  }
}

// Handle keyup for space key
function handleKeyUp(event: KeyboardEvent) {
  if (event.key === ' ') {
    tempHandTool.value = false;
  }
}

// Tool selection
function selectTool(toolName: string) {
  currentTool.value = toolName;
  showMobileMenu.value = false;
}

// Enhanced canvas operations with touch support
function getPixelCoordinates(
  clientX: number,
  clientY: number
): { x: number; y: number } {
  if (!drawingCanvas.value || !canvasWrapper.value) return { x: 0, y: 0 };

  const canvasRect = drawingCanvas.value.getBoundingClientRect();
  const wrapperRect = canvasWrapper.value.getBoundingClientRect();

  // Fixed: Proper coordinate calculation accounting for pan and zoom
  const relativeX = clientX - canvasRect.left;
  const relativeY = clientY - canvasRect.top;

  // Convert to canvas coordinates accounting for zoom
  const canvasX = relativeX / zoom.value;
  const canvasY = relativeY / zoom.value;

  // Convert to pixel coordinates
  const x = Math.floor(canvasX / pixelSize.value);
  const y = Math.floor(canvasY / pixelSize.value);

  return {
    x: Math.max(0, Math.min(x, canvasWidth.value - 1)),
    y: Math.max(0, Math.min(y, canvasHeight.value - 1)),
  };
}

function updateBrushIndicator(event: MouseEvent) {
  if (!drawingCanvas.value || !canvasWrapper.value) return;

  const canvasRect = drawingCanvas.value.getBoundingClientRect();
  const wrapperRect = canvasWrapper.value.getBoundingClientRect();

  // Calculate position relative to canvas wrapper
  brushIndicatorX.value = event.clientX - wrapperRect.left;
  brushIndicatorY.value = event.clientY - wrapperRect.top;
}

// Enhanced canvas mouse handling with hand tool
function handleCanvasMouseDown(event: MouseEvent) {
  if (currentTool.value === 'hand' || tempHandTool.value) {
    startPan(event);
  }
}

function handleCanvasMouseMove(event: MouseEvent) {
  if (isPanning.value) {
    handlePan(event);
  }
}

function handleCanvasMouseUp(event: MouseEvent) {
  if (isPanning.value) {
    stopPan();
  }
}

function handleCanvasMouseLeave(event: MouseEvent) {
  if (isPanning.value) {
    stopPan();
  }
}

// Touch support
function handleTouchStart(event: TouchEvent) {
  event.preventDefault();

  if (event.touches.length === 1) {
    // Single touch - drawing or panning
    const touch = event.touches[0];
    if (currentTool.value === 'hand') {
      startPan({
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
      } as MouseEvent);
    } else {
      const { x, y } = getPixelCoordinates(touch.clientX, touch.clientY);
      startDrawing({
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
      } as MouseEvent);
    }
  } else if (event.touches.length === 2) {
    // Two finger touch - zoom
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    lastTouchDistance.value = distance;
    touchStartPanX.value = panX.value;
    touchStartPanY.value = panY.value;
  }
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault();

  if (event.touches.length === 1) {
    const touch = event.touches[0];
    if (isPanning.value) {
      handlePan({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent);
    } else if (isDrawing.value) {
      draw({
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
      } as MouseEvent);
    }
  } else if (event.touches.length === 2) {
    // Handle pinch zoom
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );

    if (lastTouchDistance.value > 0) {
      const scale = distance / lastTouchDistance.value;
      const newZoom = Math.max(0.1, Math.min(20, zoom.value * scale));
      zoom.value = newZoom;
    }

    lastTouchDistance.value = distance;
  }
}

function handleTouchEnd(event: TouchEvent) {
  event.preventDefault();

  if (event.touches.length === 0) {
    if (isPanning.value) {
      stopPan();
    }
    if (isDrawing.value) {
      stopDrawing();
    }
    lastTouchDistance.value = 0;
  }
}

function startDrawing(event: MouseEvent) {
  if (currentTool.value === 'hand' || tempHandTool.value || isPanning.value)
    return;

  const { x, y } = getPixelCoordinates(event.clientX, event.clientY);
  isDrawing.value = true;
  lastX.value = x;
  lastY.value = y;

  const color = event.button === 2 ? secondaryColor.value : primaryColor.value;

  if (currentTool.value === 'picker') {
    pickColor(x, y);
  } else if (currentTool.value === 'fill') {
    floodFill(x, y, color);
  } else {
    queueDrawOperation(() => drawPixel(x, y, color));
  }
}

function draw(event: MouseEvent) {
  if (
    !isDrawing.value ||
    currentTool.value === 'picker' ||
    currentTool.value === 'fill' ||
    currentTool.value === 'hand'
  )
    return;

  const { x, y } = getPixelCoordinates(event.clientX, event.clientY);
  const color = event.button === 2 ? secondaryColor.value : primaryColor.value;

  // Bresenham's line algorithm for drawing a smooth line
  bresenhamLine(lastX.value, lastY.value, x, y, color);

  lastX.value = x;
  lastY.value = y;
}

function stopDrawing() {
  if (isDrawing.value) {
    isDrawing.value = false;
    saveHistory();
    updateLayerPreviews();
  }
}

function bresenhamLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string
) {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    queueDrawOperation(() => drawPixel(x0, y0, color));

    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function drawPixel(x: number, y: number, color: string) {
  const currentLayerData = layers.value[currentLayer.value];
  if (!currentLayerData.context) return;

  const ctx = currentLayerData.context;

  if (currentTool.value === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
  }

  // Draw with brush size
  const halfBrush = Math.floor(brushSize.value / 2);
  for (let dx = -halfBrush; dx <= halfBrush; dx++) {
    for (let dy = -halfBrush; dy <= halfBrush; dy++) {
      const px = x + dx;
      const py = y + dy;
      if (
        px >= 0 &&
        px < canvasWidth.value &&
        py >= 0 &&
        py < canvasHeight.value
      ) {
        if (currentTool.value === 'eraser') {
          ctx.clearRect(
            px * pixelSize.value,
            py * pixelSize.value,
            pixelSize.value,
            pixelSize.value
          );
        } else {
          ctx.fillRect(
            px * pixelSize.value,
            py * pixelSize.value,
            pixelSize.value,
            pixelSize.value
          );
        }
      }
    }
  }

  updateLayerCanvas(currentLayer.value);
}

function queueDrawOperation(operation: () => void) {
  drawingQueue.push(operation);
  if (!isProcessingQueue) {
    processDrawingQueue();
  }
}

function processDrawingQueue() {
  isProcessingQueue = true;

  const processNext = () => {
    if (drawingQueue.length > 0) {
      const operation = drawingQueue.shift()!;
      operation();
      requestAnimationFrame(processNext);
    } else {
      isProcessingQueue = false;
    }
  };

  requestAnimationFrame(processNext);
}

function floodFill(startX: number, startY: number, color: string) {
  const currentLayerData = layers.value[currentLayer.value];
  if (!currentLayerData.context) return;

  const ctx = currentLayerData.context;
  const imageData = ctx.getImageData(
    0,
    0,
    currentLayerData.canvas!.width,
    currentLayerData.canvas!.height
  );
  const data = imageData.data;
  const targetColor = getPixelColor(
    data,
    startX * pixelSize.value,
    startY * pixelSize.value,
    currentLayerData.canvas!.width
  );
  const fillColor = hexToRgb(color);

  if (colorsEqual(targetColor, fillColor)) return;

  const stack = [{ x: startX, y: startY }];

  while (stack.length > 0) {
    const { x, y } = stack.pop()!;

    if (x < 0 || x >= canvasWidth.value || y < 0 || y >= canvasHeight.value)
      continue;

    const currentColor = getPixelColor(
      data,
      x * pixelSize.value,
      y * pixelSize.value,
      currentLayerData.canvas!.width
    );
    if (!colorsEqual(currentColor, targetColor)) continue;

    // Fill the pixel area
    for (let px = x * pixelSize.value; px < (x + 1) * pixelSize.value; px++) {
      for (let py = y * pixelSize.value; py < (y + 1) * pixelSize.value; py++) {
        const index = (py * currentLayerData.canvas!.width + px) * 4;
        data[index] = fillColor.r;
        data[index + 1] = fillColor.g;
        data[index + 2] = fillColor.b;
        data[index + 3] = 255;
      }
    }

    stack.push(
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 }
    );
  }

  ctx.putImageData(imageData, 0, 0);
  updateLayerCanvas(currentLayer.value);
}

function pickColor(x: number, y: number) {
  const currentLayerData = layers.value[currentLayer.value];
  if (!currentLayerData.context) return;

  const imageData = currentLayerData.context.getImageData(
    x * pixelSize.value,
    y * pixelSize.value,
    1,
    1
  );
  const data = imageData.data;
  const hex = rgbToHex(data[0], data[1], data[2]);
  primaryColor.value = hex;
  updateColorPickerFromHex(hex);
}

// Layer management
function addLayer() {
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = canvasWidth.value * pixelSize.value;
  layerCanvas.height = canvasHeight.value * pixelSize.value;
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
  saveHistory();
  updateLayerPreviews();
  nextTick(() => updateAllLayerCanvases());
}

function duplicateLayer() {
  const sourceLayer = layers.value[currentLayer.value];
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = canvasWidth.value * pixelSize.value;
  layerCanvas.height = canvasHeight.value * pixelSize.value;
  const layerContext = layerCanvas.getContext('2d')!;
  layerContext.imageSmoothingEnabled = false;

  // Copy the source layer content
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
  saveHistory();
  updateLayerPreviews();
  nextTick(() => updateAllLayerCanvases());
}

function deleteLayer() {
  if (layers.value.length > 1) {
    layers.value.splice(currentLayer.value, 1);
    currentLayer.value = Math.min(currentLayer.value, layers.value.length - 1);
    saveHistory();
    updateLayerPreviews();
    nextTick(() => updateAllLayerCanvases());
  }
}

function moveLayerUp() {
  if (currentLayer.value < layers.value.length - 1) {
    const layer = layers.value.splice(currentLayer.value, 1)[0];
    layers.value.splice(currentLayer.value + 1, 0, layer);
    currentLayer.value++;
    saveHistory();
    updateLayerPreviews();
    nextTick(() => updateAllLayerCanvases());
  }
}

function moveLayerDown() {
  if (currentLayer.value > 0) {
    const layer = layers.value.splice(currentLayer.value, 1)[0];
    layers.value.splice(currentLayer.value - 1, 0, layer);
    currentLayer.value--;
    saveHistory();
    updateLayerPreviews();
    nextTick(() => updateAllLayerCanvases());
  }
}

function selectLayer(layerIndex: number) {
  currentLayer.value = layerIndex;
}

// Fixed: Layer visibility toggle function
function toggleLayerVisibility(layerIndex: number) {
  if (layerIndex >= 0 && layerIndex < layers.value.length) {
    layers.value[layerIndex].visible = !layers.value[layerIndex].visible;
    updateLayerCanvas(layerIndex);
    updateLayerPreviews();
    saveHistory();
  }
}

// Fixed: Layer opacity update function
function updateLayerOpacity(layerIndex: number, event: Event) {
  if (layerIndex >= 0 && layerIndex < layers.value.length) {
    const target = event.target as HTMLInputElement;
    layers.value[layerIndex].opacity = parseFloat(target.value);
    updateLayerCanvas(layerIndex);
    updateLayerPreviews();
    saveHistory();
  }
}

function updateLayerCanvas(layerIndex: number) {
  nextTick(() => {
    const canvasElement = layerCanvasRefs.value[layerIndex];
    const layer = layers.value[layerIndex];

    if (canvasElement && layer.canvas) {
      const ctx = canvasElement.getContext('2d')!;
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(layer.canvas, 0, 0);
      ctx.globalAlpha = 1;
    }
  });
}

function updateAllLayerCanvases() {
  layers.value.forEach((_, index) => {
    updateLayerCanvas(index);
  });
}

// Frame management
function addFrame() {
  const newLayers = layers.value.map((layer) => {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = canvasWidth.value * pixelSize.value;
    layerCanvas.height = canvasHeight.value * pixelSize.value;
    const layerContext = layerCanvas.getContext('2d')!;
    layerContext.imageSmoothingEnabled = false;

    return {
      ...layer,
      id: layerId++,
      canvas: layerCanvas,
      context: layerContext,
    };
  });

  const newFrame: Frame = {
    id: frameId++,
    layers: newLayers,
  };

  frames.value.push(newFrame);
  currentFrame.value = frames.value.length - 1;
  layers.value = newLayers;
  saveHistory();
  nextTick(() => {
    updateAllLayerCanvases();
    updateFramePreviews();
    updateLayerPreviews();
  });
}

function duplicateFrame() {
  const currentFrameData = frames.value[currentFrame.value];
  const newLayers = currentFrameData.layers.map((layer) => {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = canvasWidth.value * pixelSize.value;
    layerCanvas.height = canvasHeight.value * pixelSize.value;
    const layerContext = layerCanvas.getContext('2d')!;
    layerContext.imageSmoothingEnabled = false;

    if (layer.canvas) {
      layerContext.drawImage(layer.canvas, 0, 0);
    }

    return {
      ...layer,
      id: layerId++,
      canvas: layerCanvas,
      context: layerContext,
    };
  });

  const newFrame: Frame = {
    id: frameId++,
    layers: newLayers,
  };

  frames.value.splice(currentFrame.value + 1, 0, newFrame);
  currentFrame.value++;
  layers.value = newLayers;
  saveHistory();
  nextTick(() => {
    updateAllLayerCanvases();
    updateFramePreviews();
    updateLayerPreviews();
  });
}

function deleteFrame() {
  if (frames.value.length > 1) {
    frames.value.splice(currentFrame.value, 1);
    currentFrame.value = Math.min(currentFrame.value, frames.value.length - 1);
    switchToFrame(currentFrame.value);
    saveHistory();
    updateFramePreviews();
    updateLayerPreviews();
  }
}

function switchToFrame(frameIndex: number) {
  currentFrame.value = frameIndex;
  layers.value = frames.value[frameIndex].layers;
  nextTick(() => updateAllLayerCanvases());
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
      switchToFrame(nextFrame);
    }, 1000 / animationFPS.value);
  }
}

// History system
function saveHistory() {
  // Remove any history after current index
  history.value = history.value.slice(0, historyIndex.value + 1);

  // Create deep copy of current state
  const state: HistoryState = {
    layers: layers.value.map((layer) => ({
      ...layer,
      canvas: cloneCanvas(layer.canvas),
      context: null, // Will be recreated when restored
    })),
    currentLayer: currentLayer.value,
    currentFrame: currentFrame.value,
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
  // Restore layers
  layers.value = state.layers.map((layer) => {
    const layerCanvas = cloneCanvas(layer.canvas);
    const layerContext = layerCanvas?.getContext('2d') || null;
    if (layerContext) {
      layerContext.imageSmoothingEnabled = false;
    }

    return {
      ...layer,
      canvas: layerCanvas,
      context: layerContext,
    };
  });

  currentLayer.value = state.currentLayer;
  currentFrame.value = state.currentFrame;

  // Update frame data
  frames.value[currentFrame.value].layers = layers.value;

  nextTick(() => {
    updateAllLayerCanvases();
    updateFramePreviews();
    updateLayerPreviews();
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

// Enhanced zoom and pan functions
function zoomIn() {
  const oldZoom = zoom.value;
  zoom.value = Math.min(zoom.value * 1.2, 20);

  // Maintain center point during zoom
  if (canvasWrapper.value) {
    const centerX = canvasWrapper.value.offsetWidth / 2;
    const centerY = canvasWrapper.value.offsetHeight / 2;

    const zoomRatio = zoom.value / oldZoom;
    panX.value = centerX - (centerX - panX.value) * zoomRatio;
    panY.value = centerY - (centerY - panY.value) * zoomRatio;
  }
}

function zoomOut() {
  const oldZoom = zoom.value;
  zoom.value = Math.max(zoom.value / 1.2, 0.1);

  // Maintain center point during zoom
  if (canvasWrapper.value) {
    const centerX = canvasWrapper.value.offsetWidth / 2;
    const centerY = canvasWrapper.value.offsetHeight / 2;

    const zoomRatio = zoom.value / oldZoom;
    panX.value = centerX - (centerX - panX.value) * zoomRatio;
    panY.value = centerY - (centerY - panY.value) * zoomRatio;
  }
}

function resetZoom() {
  zoom.value = 1;
  centerCanvas();
}

function fitToScreen() {
  if (!canvasWrapper.value) return;

  const wrapperWidth = canvasWrapper.value.offsetWidth;
  const wrapperHeight = canvasWrapper.value.offsetHeight;

  const contentWidth = canvasWidth.value * pixelSize.value;
  const contentHeight = canvasHeight.value * pixelSize.value;

  const zoomWidth = wrapperWidth / contentWidth;
  const zoomHeight = wrapperHeight / contentHeight;

  zoom.value = Math.min(zoomWidth, zoomHeight, 20);
  centerCanvas();
}

// Fixed: Enhanced canvas centering function
function centerCanvas() {
  if (!canvasWrapper.value || !canvasInner.value) return;

  const wrapperWidth = canvasWrapper.value.offsetWidth;
  const wrapperHeight = canvasWrapper.value.offsetHeight;
  const contentWidth = canvasWidth.value * pixelSize.value * zoom.value;
  const contentHeight = canvasHeight.value * pixelSize.value * zoom.value;

  // Calculate center position
  panX.value = (wrapperWidth - contentWidth) / 2;
  panY.value = (wrapperHeight - contentHeight) / 2;
}

function startPan(event: MouseEvent) {
  isPanning.value = true;
  panStartX.value = event.clientX - panX.value;
  panStartY.value = event.clientY - panY.value;
}

function handlePan(event: MouseEvent) {
  if (!isPanning.value) return;

  panX.value = event.clientX - panStartX.value;
  panY.value = event.clientY - panStartY.value;
}

function stopPan() {
  isPanning.value = false;
}

function handleWheel(event: WheelEvent) {
  event.preventDefault();

  const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1;
  const oldZoom = zoom.value;
  zoom.value = Math.max(0.1, Math.min(20, zoom.value + zoomAmount));

  // Zoom towards mouse position
  if (canvasWrapper.value) {
    const rect = canvasWrapper.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const zoomRatio = zoom.value / oldZoom;
    panX.value = mouseX - (mouseX - panX.value) * zoomRatio;
    panY.value = mouseY - (mouseY - panY.value) * zoomRatio;
  }
}

// Utility functions
function getCursor() {
  switch (currentTool.value) {
    case 'pencil':
      return 'crosshair';
    case 'eraser':
      return 'crosshair';
    case 'fill':
      return 'crosshair';
    case 'picker':
      return 'crosshair';
    case 'hand':
      return isPanning.value ? 'grabbing' : 'grab';
    default:
      return 'default';
  }
}

function clearCanvas() {
  const currentLayerData = layers.value[currentLayer.value];
  if (currentLayerData.context) {
    currentLayerData.context.clearRect(
      0,
      0,
      currentLayerData.canvas!.width,
      currentLayerData.canvas!.height
    );
    updateLayerCanvas(currentLayer.value);
    updateLayerPreviews();
    saveHistory();
  }
}

function resizeCanvas() {
  const newWidth = prompt('Enter new width:', canvasWidth.value.toString());
  const newHeight = prompt('Enter new height:', canvasHeight.value.toString());

  if (newWidth && newHeight) {
    canvasWidth.value = parseInt(newWidth);
    canvasHeight.value = parseInt(newHeight);
    resizeAllCanvases();
    saveHistory();
  }
}

function clearPalette() {
  colorPalette.value = [];
}

function selectColor(color: string, target: 'primary' | 'secondary') {
  if (target === 'primary') {
    primaryColor.value = color;
    updateColorPickerFromHex(color);
  } else {
    secondaryColor.value = color;
  }
  showMobileMenu.value = false;
}

// Color utility functions
function getPixelColor(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number
) {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3],
  };
}

function colorsEqual(c1: any, c2: any) {
  return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      }
    : { r: 0, g: 0, b: 0, a: 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Enhanced canvas rendering
function drawEnhancedGrid() {
  if (!gridContext) return;

  gridContext.clearRect(
    0,
    0,
    gridCanvas.value!.width,
    gridCanvas.value!.height
  );

  const gridColor = 'rgba(255, 255, 255, 0.1)';
  gridContext.strokeStyle = gridColor;
  gridContext.lineWidth = 0.5;

  for (let x = 0; x <= canvasWidth.value; x++) {
    gridContext.beginPath();
    gridContext.moveTo(x * pixelSize.value, 0);
    gridContext.lineTo(
      x * pixelSize.value,
      canvasHeight.value * pixelSize.value
    );
    gridContext.stroke();
  }

  for (let y = 0; y <= canvasHeight.value; y++) {
    gridContext.beginPath();
    gridContext.moveTo(0, y * pixelSize.value);
    gridContext.lineTo(
      canvasWidth.value * pixelSize.value,
      y * pixelSize.value
    );
    gridContext.stroke();
  }
}

function updateFramePreviews() {
  nextTick(() => {
    frames.value.forEach((frame, index) => {
      const previewCanvas = framePreviewRefs.value[index];
      if (previewCanvas) {
        const previewCtx = previewCanvas.getContext('2d')!;
        previewCtx.clearRect(0, 0, 32, 32);
        previewCtx.imageSmoothingEnabled = false;

        // Draw frame layers
        frame.layers.forEach((layer) => {
          if (layer.visible && layer.canvas) {
            previewCtx.globalAlpha = layer.opacity;
            previewCtx.drawImage(layer.canvas, 0, 0, 32, 32);
          }
        });
        previewCtx.globalAlpha = 1;
      }
    });
  });
}

function updateLayerPreviews() {
  nextTick(() => {
    layers.value.forEach((layer, index) => {
      const previewCanvas = layerPreviewRefs.value[index];
      if (previewCanvas) {
        const previewCtx = previewCanvas.getContext('2d')!;
        previewCtx.clearRect(0, 0, 32, 32);
        previewCtx.imageSmoothingEnabled = false;

        if (layer.visible && layer.canvas) {
          previewCtx.globalAlpha = layer.opacity;
          previewCtx.drawImage(layer.canvas, 0, 0, 32, 32);
          previewCtx.globalAlpha = 1;
        }
      }
    });
  });
}

// Image import
function importImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
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
    canvasWidth.value = newWidth;
    canvasHeight.value = newHeight;

    // Resize all canvases
    resizeAllCanvases();

    // Draw image on current layer
    const currentLayerData = layers.value[currentLayer.value];
    if (currentLayerData.context) {
      currentLayerData.context.drawImage(
        img,
        0,
        0,
        newWidth * pixelSize.value,
        newHeight * pixelSize.value
      );
      updateLayerCanvas(currentLayer.value);
      saveHistory();
      updateFramePreviews();
      updateLayerPreviews();
    }
  };

  img.src = URL.createObjectURL(file);
}

// Project save/load
function saveProject() {
  const data = {
    width: canvasWidth.value,
    height: canvasHeight.value,
    pixelSize: pixelSize.value,
    zoom: zoom.value,
    panX: panX.value,
    panY: panY.value,
    currentTool: currentTool.value,
    brushSize: brushSize.value,
    primaryColor: primaryColor.value,
    secondaryColor: secondaryColor.value,
    colorPalette: colorPalette.value,
    extendedColorPalette: extendedColorPalette.value,
    frames: frames.value.map((frame) => ({
      id: frame.id,
      layers: frame.layers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        visible: layer.visible,
        opacity: layer.opacity,
        data: layer.canvas?.toDataURL(),
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

function loadProject(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);

      // Restore canvas properties
      canvasWidth.value = data.width;
      canvasHeight.value = data.height;
      pixelSize.value = data.pixelSize;
      zoom.value = data.zoom;
      panX.value = data.panX;
      panY.value = data.panY;
      currentTool.value = data.currentTool;
      brushSize.value = data.brushSize;
      primaryColor.value = data.primaryColor;
      secondaryColor.value = data.secondaryColor;
      colorPalette.value = data.colorPalette;
      extendedColorPalette.value = data.extendedColorPalette;

      // Resize all canvases
      resizeAllCanvases();

      // Restore frames and layers
      frames.value = data.frames.map((frameData: any) => ({
        id: frameData.id,
        layers: frameData.layers.map((layerData: any) => {
          const layerCanvas = document.createElement('canvas');
          layerCanvas.width = canvasWidth.value * pixelSize.value;
          layerCanvas.height = canvasHeight.value * pixelSize.value;
          const layerContext = layerCanvas.getContext('2d')!;
          layerContext.imageSmoothingEnabled = false;

          const img = new Image();
          img.onload = () => {
            layerContext.drawImage(img, 0, 0);
          };
          img.src = layerData.data;

          return {
            id: layerData.id,
            name: layerData.name,
            visible: layerData.visible,
            opacity: layerData.opacity,
            canvas: layerCanvas,
            context: layerContext,
          };
        }),
      }));

      // Switch to first frame
      switchToFrame(0);

      // Update previews
      updateFramePreviews();
      updateLayerPreviews();

      // Save history
      saveHistory();
    } catch (error) {
      alert('Error loading project: ' + error);
    }
  };
  reader.readAsText(file);
}

function resizeAllCanvases() {
  const newWidth = canvasWidth.value * pixelSize.value;
  const newHeight = canvasHeight.value * pixelSize.value;

  // Resize grid canvas
  if (gridCanvas.value) {
    gridCanvas.value.width = newWidth;
    gridCanvas.value.height = newHeight;
    drawEnhancedGrid();
  }

  // Resize drawing canvas
  if (drawingCanvas.value) {
    drawingCanvas.value.width = newWidth;
    drawingCanvas.value.height = newHeight;
  }

  // Resize all layer canvases
  layers.value.forEach((layer) => {
    if (layer.canvas) {
      const oldCanvas = layer.canvas;
      const newCanvas = document.createElement('canvas');
      newCanvas.width = newWidth;
      newCanvas.height = newHeight;
      const newContext = newCanvas.getContext('2d')!;
      newContext.imageSmoothingEnabled = false;
      newContext.drawImage(oldCanvas, 0, 0);

      layer.canvas = newCanvas;
      layer.context = newContext;
    }
  });

  nextTick(() => updateAllLayerCanvases());
}

// Export functions
function exportPNG() {
  // Create a composite canvas
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvasWidth.value * pixelSize.value;
  exportCanvas.height = canvasHeight.value * pixelSize.value;
  const exportCtx = exportCanvas.getContext('2d')!;

  // Draw all visible layers
  layers.value.forEach((layer) => {
    if (layer.visible && layer.canvas) {
      exportCtx.globalAlpha = layer.opacity;
      exportCtx.drawImage(layer.canvas, 0, 0);
    }
  });

  const link = document.createElement('a');
  link.download = 'pixel-art.png';
  link.href = exportCanvas.toDataURL();
  link.click();
}

// Watchers
watch(currentFrame, () => {
  switchToFrame(currentFrame.value);
});

watch(animationFPS, () => {
  if (isAnimating.value) {
    toggleAnimation();
    toggleAnimation();
  }
});
</script>

<style scoped>
/* General Styles */
.pixel-editor {
  height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d30 100%);
  color: #cccccc;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  outline: none;
  overflow: hidden;
}

/* Enhanced Glass Panel Styles */
.glass-panel {
  background: rgba(45, 45, 48, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-panel-enhanced {
  background: rgba(45, 45, 48, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 16px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.glass-panel-inner {
  background: rgba(60, 60, 63, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
}

.glass-button {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  outline: none;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.glass-button:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.12);
}

.glass-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.glass-button-small {
  padding: 6px 12px;
  font-size: 12px;
}

.glass-button-primary {
  background: rgba(0, 122, 255, 0.8);
  border-color: rgba(0, 122, 255, 0.9);
}

.glass-button-primary:hover {
  background: rgba(0, 122, 255, 0.9);
  border-color: rgba(0, 122, 255, 1);
}

.glass-button-danger {
  background: rgba(255, 59, 48, 0.8);
  border-color: rgba(255, 59, 48, 0.9);
}

.glass-button-danger:hover {
  background: rgba(255, 59, 48, 0.9);
  border-color: rgba(255, 59, 48, 1);
}

.glass-button-tool {
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.glass-button-tool.active {
  background: rgba(0, 122, 255, 0.3);
  border-color: rgba(0, 122, 255, 0.5);
}

.glass-button-icon {
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.glass-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-input:focus {
  border-color: rgba(0, 122, 255, 0.6);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  background: rgba(255, 255, 255, 0.12);
}

.glass-slider {
  -webkit-appearance: none;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  outline: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.glass-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.glass-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

/* Header Styles */
.header {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-center {
  display: flex;
  align-items: center;
}

.history-controls {
  display: flex;
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.canvas-info {
  font-size: 13px;
  color: #999999;
  display: flex;
  align-items: center;
  gap: 8px;
}

.layer-info {
  font-style: italic;
  color: #777777;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-text {
  display: inline-block;
}

/* Mobile Menu Styles */
.mobile-menu-toggle {
  display: none;
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.mobile-menu {
  width: 90%;
  max-width: 400px;
  padding: 24px;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-section h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.mobile-color-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-current-colors {
  display: flex;
  align-items: center;
  gap: 20px;
}

.color-display {
  position: relative;
  width: 50px;
  height: 50px;
}

.primary-color {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.secondary-color {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-values {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

.color-value {
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 500;
  background: rgba(0, 122, 255, 0.15);
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.mobile-palette-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.palette-color {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.palette-color:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.palette-color.active {
  border: 2px solid #007aff;
  transform: scale(1.05);
}

/* Enhanced Sidebar Styles */
.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar.collapsed {
  width: 50px;
}

.sidebar-left {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-right {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: none;
}

.sidebar-toggle {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  padding: 8px;
  border-radius: 8px;
}

.sidebar-toggle.right {
  left: auto;
  right: 12px;
}

.sidebar-content {
  padding: 16px;
  padding-top: 60px;
}

/* Panel Styles */
.panel {
  margin-bottom: 16px;
}

.panel-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #999999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.5px;
}

.panel-title .expand-btn {
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

/* Enhanced Color Section Styles */
.color-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.current-colors {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-display-enhanced {
  position: relative;
  width: 60px;
  height: 60px;
}

.primary-color-enhanced {
  width: 48px;
  height: 48px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.primary-color-enhanced:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.secondary-color-enhanced {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-values-enhanced {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

.color-value {
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.color-value.primary {
  background: rgba(0, 122, 255, 0.15);
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.color-value.secondary {
  background: rgba(255, 149, 0, 0.15);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.palette-container {
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 200px;
}

.palette-container.expanded {
  max-height: 500px;
}

.palette-grid-enhanced {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.palette-color-enhanced {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.palette-color-enhanced:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.palette-color-enhanced.active {
  border: 2px solid #007aff;
  transform: scale(1.05);
}

.palette-color-enhanced.secondary {
  border: 2px solid #ff9500;
  transform: scale(1.05);
}

.palette-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* Canvas Styles */
.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d30 100%);
}

.canvas-toolbar {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-level {
  font-size: 13px;
  min-width: 50px;
  text-align: center;
  font-weight: 500;
  color: #cccccc;
}

.canvas-controls {
  display: flex;
  gap: 8px;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 25% 25%,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d30 100%);
  cursor: grab;
  position: relative;
}

.canvas-wrapper:active {
  cursor: grabbing;
}

.canvas-container-inner {
  position: relative;
  transform-origin: 0 0;
}

.grid-canvas,
.layer-canvas,
.drawing-canvas {
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.grid-canvas {
  z-index: 0;
}

.drawing-canvas {
  background: transparent;
}

.brush-indicator {
  position: absolute;
  border-radius: 2px;
  pointer-events: none;
  z-index: 100;
  transition: all 0.1s ease;
}

/* Enhanced Frame & Layer Styles */
.frame-controls,
.layer-controls {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.frame-list,
.layer-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 250px;
  overflow-y: auto;
}

.frame-item-enhanced {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.frame-item-enhanced:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.frame-item-enhanced.active {
  background: rgba(0, 122, 255, 0.2);
  border-color: rgba(0, 122, 255, 0.4);
}

.frame-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.frame-preview-enhanced {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  image-rendering: pixelated;
}

.layer-item-redesigned {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.layer-item-redesigned:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.layer-item-redesigned.active {
  background: rgba(0, 122, 255, 0.2);
  border-color: rgba(0, 122, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
}

.layer-preview-container {
  width: 36px;
  height: 36px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}

.layer-preview-canvas {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  image-rendering: pixelated;
}

.layer-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.layer-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-header-redesigned {
  display: flex;
  align-items: center;
  gap: 8px;
}

.visibility-btn-redesigned {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #999999;
}

.visibility-btn-redesigned:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.visibility-btn-redesigned.visible {
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  border-color: rgba(0, 122, 255, 0.3);
}

.layer-name-input-redesigned {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.layer-name-input-redesigned:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 122, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

.layer-opacity-display {
  font-size: 11px;
  color: #999999;
  min-width: 35px;
  text-align: right;
  font-weight: 500;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

.layer-footer-redesigned {
  display: flex;
  align-items: center;
  gap: 8px;
}

.opacity-slider-redesigned {
  flex: 1;
}

/* Animation Styles */
.animation-controls {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fps-control {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #cccccc;
}

.fps-slider {
  flex: 1;
}

/* Floating Tool Panel Styles */
.floating-tool-panel-compact {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-tool-panel-compact.expanded {
  width: auto;
}

.tool-panel-toggle-compact {
  cursor: pointer;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px 12px 0 0;
}

.tool-toggle-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-tool-indicator {
  font-size: 14px;
  font-weight: 600;
}

.tool-panel-content-compact {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 0 0 12px 12px;
}

.tool-grid-compact {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.tool-btn-compact {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 12px;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tool-btn-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.tool-btn-compact.active {
  background: #0e639c;
  border-color: #007acc;
}

.tool-icon-compact,
.icon {
  width: 16px;
  height: 16px;
}

.brush-controls-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brush-size-compact {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brush-label-compact {
  font-size: 12px;
  min-width: 40px;
  text-align: right;
}

.brush-slider-compact {
  flex: 1;
}

.brush-preview-compact {
  width: 30px;
  height: 30px;
  border: 1px solid #464647;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brush-preview-square-compact {
  border-radius: 2px;
}

/* Color Picker Styles */
.color-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.custom-color-picker {
  width: 90%;
  max-width: 500px;
  padding: 20px;
}

.color-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.color-picker-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hsv-picker {
  display: flex;
  gap: 16px;
}

.hue-saturation-picker {
  width: 200px;
  height: 200px;
  position: relative;
  cursor: crosshair;
}

.saturation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}

.value-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}

.hsv-cursor {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.hue-slider-container {
  width: 30px;
  display: flex;
  align-items: center;
}

.hue-slider {
  width: 100%;
  height: 200px;
  -webkit-appearance: slider-vertical;
}

.color-preview-section {
  display: flex;
  gap: 16px;
}

.color-preview-large {
  width: 80px;
  height: 80px;
  border: 1px solid #464647;
}

.color-inputs-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-input-group label {
  font-size: 12px;
  color: #969696;
}

.rgb-inputs {
  display: flex;
  gap: 8px;
}

.color-input-field {
  flex: 1;
  padding: 6px;
  border-radius: 2px;
  border: 1px solid #464647;
  background: #3c3c3c;
  color: #cccccc;
  font-size: 12px;
}

.color-picker-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Shortcut Styles */
.shortcuts-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shortcuts-panel {
  padding: 24px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.shortcuts-panel h3 {
  margin: 0 0 16px 0;
  color: #cccccc;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

kbd {
  background: #3c3c3c;
  border: 1px solid #464647;
  border-radius: 2px;
  padding: 2px 6px;
  font-size: 11px;
  min-width: 20px;
  text-align: center;
}

/* Icon Styles */
.icon-small {
  width: 14px;
  height: 14px;
}

.icon-tiny {
  width: 12px;
  height: 12px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .header-right {
    display: none;
  }

  .sidebar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .editor-container {
    flex-direction: column;
  }

  .canvas-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .floating-tool-panel-compact {
    bottom: 16px;
  }
}
</style>
