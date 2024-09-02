import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'App',
  //   component: App
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
