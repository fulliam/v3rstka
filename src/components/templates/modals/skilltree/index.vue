<template>
  <div class="tree-wrapper">
    <div
      v-for="(section, secIndex) in tree"
      :key="`sec-${secIndex}`"
      :class="`sec-${secIndex + 1}`"
    >
      <div
        v-for="(route, routeIndex) in section.routes"
        :key="`route-${routeIndex}`"
        class="route line-1"
      >
        <div
          class="line-wrapper"
          v-for="(frame, frameIndex) in route.frames"
          :key="`frame-${frameIndex}`"
        >
          <div class="frame" :class="{ active: frame.active }">
            <img :src="frame.img.src" :alt="frame.img.alt" />
            <span>{{ frame.title }}</span>
          </div>

          <div v-if="frameIndex < route.frames.length - 1" class="line-wrapper">
            <div class="line" :style="{ width: route.lineWidth + 'px' }"></div>
            <div class="angle-right"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="speechBox" class="speech-box">
      <div class="speech-img">
        <img :src="speechBox.img.src" :alt="speechBox.img.alt" />
      </div>
      <div class="speech-text">
        <h4>{{ speechBox.title }}</h4>
        <p>{{ speechBox.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Frame {
  img: { src: string; alt: string };
  title: string;
  active?: boolean;
}

interface Route {
  frames: Frame[];
  lineWrapper?: boolean;
  lineWidth?: number;
}

interface Section {
  routes: Route[];
}

interface SpeechBox {
  img: { src: string; alt: string };
  title: string;
  text: string;
}

defineProps<{
  tree: Section[];
  speechBox?: SpeechBox;
}>();
</script>

<style scoped lang="scss">
$c-bg: #3d3d3d;
$c-active: rgba(#cd6e3f, 0.5);
$c-inactive: #bbb;
$c-bg-light: rgba(#cd6e3f, 0.35);
$c-bg-dark: rgba(#fff, 0.9);
$c-border: rgba(#cd6e3f, 0.5);
$c-shadow: 1px 1px #cd6e3f;

.tree-wrapper {
  margin: 0 auto;
  position: relative;
  padding: 50px;
}

.frame {
  width: 52px;
  height: 52px;
  background: $c-bg-light;
  position: relative;
  margin: 35px;
  cursor: pointer;
  display: inline-block;
  @include pixel-box(
    $corner-size: 2,
    $border-size: 5px,
    $background-color: $c-border,
    $background-color-hover: $c-border
  );

  &:after {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: $c-bg-light;
    z-index: -1;
    border-radius: 25px;
  }

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    max-width: 100%;
    transform: translate(-50%, -50%);
  }

  &.active {
    background: $c-active;

    &:after {
      background: $c-bg-dark;
    }
  }

  span {
    width: calc(100% + 20px);
    margin-left: -10px;
    text-align: center;
    position: absolute;
    bottom: -60px;
    font-weight: bold;
    text-shadow: $c-shadow;
  }
}

.line-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

.route {
  display: flex;
}

.line {
  background: $c-inactive;
  height: 10px;
}

.angle-right {
  border-style: solid;
  border-width: 10px 0 10px 20px;
  border-color: transparent transparent transparent $c-inactive;
}

.speech-box {
  background: $c-bg;
  border: 5px solid #cd6e3f;
  width: 1100px;
  height: 160px;
  border-radius: 40px;
  padding: 10px 20px;
  position: absolute;
  top: 600px;
  display: flex;
  margin: 0 auto 50px auto;
  left: 0;
  right: 0;

  .speech-img {
    padding: 15px;
  }

  .speech-text {
    color: $c-bg-dark;
    font-size: 20px;
  }
}
</style>
