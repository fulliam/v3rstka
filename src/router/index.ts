import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authGuard } from '@/middlewares';
import Auth from '@/views/auth/index.vue';
import Game from '@/views/game/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
