import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authGuard } from '@/middlewares';
import Auth from '@/views/auth/index.vue';
import Game from '@/views/game/index.vue';
import CreateChar from '@/views/char/create/index.vue';
import Tmp from '@/views/char/tmp/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/create_char',
    name: 'CreateChar',
    component: CreateChar,
    meta: { requiresAuth: true },
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    meta: { requiresAuth: true },
  },
  {
    path: '/tmp',
    name: 'tmp',
    component: Tmp,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
