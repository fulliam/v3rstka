<template>
  <canvas
    ref="canvas"
    class="particle-field"
  ></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';

const canvas = ref<HTMLCanvasElement | null>(null);

function applyAtOffset(
  arr: Float32Array,
  step: number,
  fn: (offset: number) => void
) {
  for (let offset = 0; offset < arr.length; offset += step) {
    fn(offset);
  }
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomiseVector(
  v: THREE.Vector3,
  min: number,
  max: number
): THREE.Vector3 {
  v.set(
    randomBetween(min, max),
    randomBetween(min, max),
    randomBetween(min, max)
  );
  return v;
}

function inverseLerp(start: number, end: number, value: number): number {
  return (value - start) / (end - start);
}

function quarticEaseInOut(t: number): number {
  return t < 0.5 ? 8 * t ** 4 : 1 - 8 * (--t) ** 4;
}

function makeRandomTimeout(fn: () => void, min: number, max: number) {
  let started = 0;
  let ends = 0;
  return {
    schedule() {
      const triggerIn = randomBetween(min, max);
      started = Date.now();
      ends = started + triggerIn;
      setTimeout(fn, triggerIn);
    },
    progress() {
      return inverseLerp(started, ends, Date.now());
    },
  };
}

onMounted(() => {
  if (!canvas.value) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000);

  const updateFns: Array<() => void> = [];

  const numberOfPixels = 20000;
  const colors = new Float32Array(numberOfPixels * 3);
  const positions = new Float32Array(numberOfPixels * 3);

  applyAtOffset(colors, 3, (offset) => {
    colors[offset] = Math.random(); // R
    colors[offset + 1] = Math.random(); // G
    colors[offset + 2] = Math.random(); // B
  });

  applyAtOffset(positions, 3, (offset) => {
    positions[offset] = randomBetween(-500, 500); // X
    positions[offset + 1] = randomBetween(-500, 500); // Y
    positions[offset + 2] = randomBetween(-500, 500); // Z
  });

  const clusterGeometry = new THREE.BufferGeometry();
  clusterGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );
  clusterGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pixelMaterial = new THREE.PointsMaterial({
    size: 5,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });

  const pixelPoints = new THREE.Points(clusterGeometry, pixelMaterial);
  scene.add(pixelPoints);

  // Камера и анимация
  let lookAtTarget = randomiseVector(new THREE.Vector3(), -100, 100);
  let lookAtInitial = randomiseVector(new THREE.Vector3(), -100, 100);
  const lookAtCurrent = new THREE.Vector3();

  let positionTarget = randomiseVector(new THREE.Vector3(), -300, 300);
  let positionInitial = randomiseVector(new THREE.Vector3(), -300, 300);
  const positionCurrent = new THREE.Vector3();

  const cameraMover = makeRandomTimeout(
    () => {
      lookAtInitial = lookAtTarget;
      lookAtTarget = randomiseVector(new THREE.Vector3(), -100, 100);

      positionInitial = positionTarget;
      positionTarget = randomiseVector(new THREE.Vector3(), -300, 300);

      cameraMover.schedule();
    },
    5000,
    10000
  );

  cameraMover.schedule();

  updateFns.push(() => {
    const tweenDistance = quarticEaseInOut(cameraMover.progress());
    lookAtCurrent.copy(lookAtInitial).lerp(lookAtTarget, tweenDistance);
    camera.lookAt(lookAtCurrent);

    positionCurrent.copy(positionInitial).lerp(positionTarget, tweenDistance);
    camera.position.copy(positionCurrent);
  });

  const render = () => {
    requestAnimationFrame(render);
    updateFns.forEach((fn) => fn());
    renderer.render(scene, camera);
  };
  render();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style lang="scss">
.particle-field {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
