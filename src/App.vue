<template>
  <Modal />

  <nav
    v-show="false"
    class="nav"
  >
    <ul>
      <li
        v-for="item in navItems"
        :key="item.to"
      >
        <RouterLink :to="item.to">{{ item.label }}</RouterLink>
      </li>
    </ul>
    <Button
      type="danger"
      class="logout"
      label="Logout"
      :action="logout"
    />
    <!-- <Button type="primary" class="logout" label="Respawn" :action="setSpawnPoint" /> -->
  </nav>

  <Toast />

  <RouterView />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import eve from 'eve';
window.eve = eve;

const { logout } = useAuthStore();

const navItems = [
  { to: '/', label: 'Main menu' },
  { to: '/create_character', label: 'Create character' },
  { to: '/offline_game', label: 'Offline' },
  { to: '/tmp', label: 'Tmp' },
  { to: '/items', label: 'Items' },
  { to: '/auth', label: 'Auth' },
  { to: '/online_game', label: 'Online' },
  { to: '/settings', label: 'Settings' },
  { to: '/world', label: 'World' },
  { to: '/editor', label: 'Editor' },
];
</script>

<style scoped lang="scss">
.nav {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  background: #50b0952b;
  backdrop-filter: blur(2px);
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 9999;

  ul {
    list-style: none;
    display: flex;
    gap: 10px;
  }
}

.logout {
  margin-right: 30px;
}
</style>
