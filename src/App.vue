<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/auth">Auth</RouterLink>
      </li>
      <li>
        <RouterLink to="/create_char">Create char</RouterLink>
      </li>
      <li>
        <RouterLink to="/tmp">Tmp</RouterLink>
      </li>
      <li>
        <RouterLink to="/game">Game</RouterLink>
      </li>
    </ul>

    <Button type="primary" class="logout" label="Logout" :action="logout" />
  </nav>

  <Toast />

  <RouterView />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import '@/utils/eve';

const { logout } = useAuthStore();
</script>

<style lang="scss">
nav {
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
  z-index: 999;

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
