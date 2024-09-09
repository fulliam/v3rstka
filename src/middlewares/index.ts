import { useAuthStore } from '@/stores/auth';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

export function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
}
