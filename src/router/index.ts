import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authGuard } from '@/router/middlewares';
import MainMenu from '@/views/main/index.vue';
import CreateCharacter from '@/views/char/create/index.vue';
import Auth from '@/views/auth/index.vue';
import Tmp from '@/views/tmp/index.vue';
import Items from '@/views/items/index.vue';
import Settings from '@/views/settings/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu,
  },
  {
    path: '/create_character',
    name: 'CreateCharacter',
    component: CreateCharacter,
    // meta: { requiresAuth: true },
  },
  {
    path: '/offline_game',
    name: 'OfflineGame',
    component: () => import('@/views/game/top-view/offline/index.vue'),
  },
  {
    path: '/online_game',
    name: 'OnlineGame',
    component: () => import('@/views/game/top-view/online/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/items',
    name: 'Items',
    component: Items,
  },
  {
    path: '/tmp',
    name: 'tmp',
    component: Tmp,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/world',
    name: 'SideView',
    component: () => import('@/views/game/side-view/Index.vue'),
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/editor/Editor.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'MainMenu' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
