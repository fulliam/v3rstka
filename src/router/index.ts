import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authGuard } from '@/router/middlewares';
import MainMenu from '@/views/main/index.vue';
import CreateCharacter from '@/views/char/create/index.vue';
import OfflineGame from '@/views/game/offline/index.vue';
import Auth from '@/views/auth/index.vue';
import OnlineGame from '@/views/game/online/index.vue';
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
    component: OfflineGame,
  },
  {
    path: '/online_game',
    name: 'OnlineGame',
    component: OnlineGame,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
