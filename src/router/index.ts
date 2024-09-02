import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Auth from '@/views/auth/index.vue';
import Game from '@/views/game/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
