<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/auth">Auth</RouterLink>
      </li>
      <li>
        <RouterLink to="/game">Game</RouterLink>
      </li>
    </ul>

    <button class="logout" @click="logout">Logout</button>
  </nav>

  <RouterView />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const { logout } = useAuthStore();
</script>

<style lang="scss">
nav {
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
  background: #1e1e1e;
  backdrop-filter: blur(2px);
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

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
