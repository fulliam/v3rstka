<template>
  <canvas
    ref="canvas"
    class="model-viewer"
  ></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Ссылка на canvas
const canvas = ref<HTMLCanvasElement | null>(null);
const props = defineProps<{ modelUrl: string }>();
onMounted(() => {
  if (!canvas.value) return;

  // Сцена, камера и рендерер
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true, // Прозрачный фон
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Настройка камеры
  camera.position.set(0, 1, 5);

  // Свет
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Загрузка модели
  const objLoader = new OBJLoader();
  objLoader.load(
    props.modelUrl, // Замените на путь к вашей .obj модели
    (object) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Добавляем базовый материал, если его нет
          child.material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.5,
            roughness: 0.5,
          });
        }
      });

      // Масштаб и позиционирование модели
      object.scale.set(1, 1, 1); // Измените масштаб по необходимости
      object.position.set(0, 0, 0);
      scene.add(object);
    },
    (xhr) => {
      console.log(`Загрузка модели: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
      console.error('Ошибка загрузки модели:', error);
    }
  );

  // Анимация
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  // Обновление размера окна
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  // Очистка при размонтировании
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
  });
});
</script>

<style scoped>
.model-viewer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
