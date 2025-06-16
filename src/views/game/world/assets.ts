// import { decorations } from '@/assets/decorations/decorations';
import animations from '@/animations.json';

export const actsData = {
  ActI: [
    [
      // Сцена 1
      { src: animations.bg.forest.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.forest.bg, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.trees, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.8 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.9 },
      { src: animations.bg.forest.lianas, parallaxSpeed: 0.9 },
    ],
    [
      // Сцена 2
      { src: animations.bg.forest.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.forest.bg, parallaxSpeed: 0.4 },
      {
        src: animations.bg.forest.fireflys,
        class: 'firefly-animation',
        parallaxSpeed: 1,
      },
      { src: animations.bg.forest.trees, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.8 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.9 },
      { src: animations.bg.forest.lianas, parallaxSpeed: 0.9 },
    ],
    [
      // Сцена 3
      { src: animations.bg.forest.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.forest.bg, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.trees, parallaxSpeed: 0.6 },
      {
        src: animations.bg.forest.fireflys,
        class: 'firefly-animation',
        parallaxSpeed: 1,
      },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.8 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.9 },
      { src: animations.bg.forest.lianas, parallaxSpeed: 0.9 },
    ],
    [
      // Сцена 4
      { src: animations.bg.forest.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.forest.bg, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.trees, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.8 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.9 },
      { src: animations.bg.forest.lianas, parallaxSpeed: 0.9 },
      {
        src: animations.bg.cemetery.tree,
        style: { position: 'relative', left: '-25%' },
        parallaxSpeed: 0.9,
      },
      {
        src: animations.bg.forest.fireflys,
        class: 'firefly-animation',
        parallaxSpeed: 1,
      },
      {
        src: animations.bg.forest.fireflys,
        class: 'firefly-animation',
        parallaxSpeed: 1,
      },
      {
        src: animations.bg.forest.fireflys,
        class: 'firefly-animation',
        parallaxSpeed: 1,
      },
    ],
  ],
  ActII: [
    [
      // Сцена 1
      { src: animations.bg.ruin.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.4 },
      { src: animations.bg.cemetery.trees, parallaxSpeed: 0.5 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.wall, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.ground, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 2
      { src: animations.bg.ruin.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.4 },
      { src: animations.bg.cemetery.trees, parallaxSpeed: 0.5 },
      { src: animations.bg.cemetery.trees, parallaxSpeed: 0.5 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.wall, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.ground, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 3
      { src: animations.bg.ruin.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.4 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.wall, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.ground, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 4
      { src: animations.bg.ruin.sky, parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.trees, parallaxSpeed: 0.5 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.wall, parallaxSpeed: 0.8 },
      { src: animations.bg.cemetery.ground, parallaxSpeed: 0.8 },
    ],
  ],
  ActIII: [
    [
      // Сцена 1
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.trees, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 2
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.trees, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 3
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.ruin.trees, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 4
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.ruin.trees, parallaxSpeed: 0.4 },
      { src: animations.bg.forest.grasses, parallaxSpeed: 0.6 },
      { src: animations.bg.forest.road, parallaxSpeed: 0.8 },
      {
        src: animations.bg.ruin.statue,
        style: { position: 'relative', top: '25%', left: '-40%' },
        parallaxSpeed: 0.8,
      },
    ],
  ],
  ActIV: [
    [
      // Сцена 1
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.graves, parallaxSpeed: 0.4 },
      {
        src: animations.bg.forest.grasses,
        style: { position: 'relative', top: '10%' },
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.ruins2,
        style: { position: 'relative', top: '-85%' },
        parallaxSpeed: 0.8,
      },
    ],
    [
      // Сцена 2
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.graves, parallaxSpeed: 0.4 },
      {
        src: animations.bg.forest.grasses,
        style: { position: 'relative', top: '10%' },
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.ruins2,
        style: { position: 'relative', top: '-85%' },
        parallaxSpeed: 0.8,
      },
    ],
    [
      // Сцена 3
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.graves, parallaxSpeed: 0.4 },
      {
        src: animations.bg.forest.grasses,
        style: { position: 'relative', top: '10%' },
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.ruins2,
        style: { position: 'relative', top: '-85%' },
        parallaxSpeed: 0.8,
      },
    ],
    [
      // Сцена 4
      { class: 'cemetery-sky', parallaxSpeed: 0.2 },
      { src: animations.bg.cemetery.graves, parallaxSpeed: 0.4 },
      {
        src: animations.bg.forest.grasses,
        style: { position: 'relative', top: '10%' },
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.ruins2,
        style: { position: 'relative', top: '-85%' },
        parallaxSpeed: 0.8,
      },
      {
        src: animations.bg.ruin.statue,
        style: { position: 'relative', top: '-175%', left: '-90%' },
        parallaxSpeed: 0.8,
      },
    ],
  ],
  ActV: [
    [
      // Сцена 1
      { src: animations.bg.castle.bg, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.windows, parallaxSpeed: 0.4 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.6 },
      { src: animations.bg.castle.floor, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 2
      { src: animations.bg.castle.bg, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.windows, parallaxSpeed: 0.4 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.6 },
      { src: animations.bg.castle.floor, parallaxSpeed: 0.8 },
    ],
    [
      // Сцена 3
      { src: animations.bg.castle.bg, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.windows, parallaxSpeed: 0.4 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.6 },
      { src: animations.bg.castle.floor, parallaxSpeed: 0.8 },
      { src: animations.bg.castle.candeliar, parallaxSpeed: 0.8 },
      {
        src: animations.bg.castle.candeliar,
        style: { position: 'relative', top: '60%', left: '-30%' },
        parallaxSpeed: 0.8,
      },
    ],
    [
      // Сцена 4
      { src: animations.bg.castle.bg, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.mountains, parallaxSpeed: 0.2 },
      { src: animations.bg.castle.windows, parallaxSpeed: 0.4 },
      { src: animations.bg.castle.columns, parallaxSpeed: 0.6 },
      { src: animations.bg.castle.floor, parallaxSpeed: 0.8 },
      { src: animations.bg.castle.candeliar, parallaxSpeed: 0.8 },
      {
        src: animations.bg.castle.dragon,
        style: { position: 'relative', top: '27%' },
        parallaxSpeed: 0.8,
      },
      {
        src: animations.bg.castle.candeliar,
        style: { position: 'relative', top: '-40%', right: '20%' },
        parallaxSpeed: 0.8,
      },
    ],
  ],
  ActVI: [
    [
      // Сцена 1
      { src: animations.bg.cave.cave7, parallaxSpeed: 0.1 },
      { src: animations.bg.cave.cave6, parallaxSpeed: 0.2 },
      {
        src: animations.bg.cave.cave6,
        style: { position: 'absolute', left: '15%' },
        parallaxSpeed: 0.3,
      },
      { src: animations.bg.cave.cave5, parallaxSpeed: 0.4 },
      { src: animations.bg.cave.cave4, parallaxSpeed: 0.5 },
      { src: animations.bg.cave.cave3, parallaxSpeed: 0.6 },
      {
        src: animations.bg.cave.cave1,
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.grass,
        style: { position: 'absolute', top: '38%' },
        parallaxSpeed: 0.8,
      },
      {
        src: animations.bg.cave.cave1,
        style: { rotate: '-180deg' },
        parallaxSpeed: -0.9,
      },
    ],
    [
      // Сцена 1
      { src: animations.bg.cave.cave7, parallaxSpeed: 0.1 },
      {
        src: animations.bg.cave.cave6,
        style: { position: 'absolute', left: '15%' },
        parallaxSpeed: 0.2,
      },
      { src: animations.bg.cave.cave6, parallaxSpeed: 0.3 },
      { src: animations.bg.cave.cave5, parallaxSpeed: 0.4 },
      { src: animations.bg.cave.cave4, parallaxSpeed: 0.5 },
      { src: animations.bg.cave.cave3, parallaxSpeed: 0.6 },
      {
        src: animations.bg.cave.cave1,
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.grass,
        style: { position: 'absolute', top: '38%' },
        parallaxSpeed: 0.8,
      },
      {
        src: animations.bg.cave.cave1,
        style: { rotate: '-180deg' },
        parallaxSpeed: -0.9,
      },
    ],
    [
      // Сцена 1
      { src: animations.bg.cave.cave7, parallaxSpeed: 0.1 },
      { src: animations.bg.cave.cave6, parallaxSpeed: 0.2 },
      {
        src: animations.bg.cave.cave6,
        style: { position: 'absolute', left: '15%' },
        parallaxSpeed: 0.3,
      },
      { src: animations.bg.cave.cave5, parallaxSpeed: 0.4 },
      { src: animations.bg.cave.cave4, parallaxSpeed: 0.5 },
      { src: animations.bg.cave.cave3, parallaxSpeed: 0.6 },
      {
        src: animations.bg.cave.cave1,
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.grass,
        style: { position: 'absolute', top: '38%' },
        parallaxSpeed: 0.8,
      },
      {
        src: animations.bg.cave.cave1,
        style: { rotate: '-180deg' },
        parallaxSpeed: -0.9,
      },
    ],
    [
      // Сцена 1
      { src: animations.bg.cave.cave7, parallaxSpeed: 0.1 },
      {
        src: animations.bg.cave.cave6,
        style: { position: 'absolute', left: '15%' },
        parallaxSpeed: 0.2,
      },
      { src: animations.bg.cave.cave6, parallaxSpeed: 0.3 },
      { src: animations.bg.cave.cave5, parallaxSpeed: 0.4 },
      { src: animations.bg.cave.cave4, parallaxSpeed: 0.5 },
      { src: animations.bg.cave.cave3, parallaxSpeed: 0.6 },
      {
        src: animations.bg.cave.cave1,
        parallaxSpeed: 0.7,
      },
      {
        src: animations.bg.ruin.grass,
        style: { position: 'absolute', top: '38%' },
        parallaxSpeed: 0.8,
      },
      {
        src: animations.bg.cave.cave1,
        style: { rotate: '-180deg' },
        parallaxSpeed: -0.9,
      },
    ],
  ],
};
