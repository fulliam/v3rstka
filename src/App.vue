<template>
  <nav class="nav">
    <ul>
      <li>
        <RouterLink to="/">Main menu</RouterLink>
      </li>
      <li>
        <RouterLink to="/create_character">Create character</RouterLink>
      </li>
      <li>
        <RouterLink to="/offline_game">Offline</RouterLink>
      </li>
      <li>
        <RouterLink to="/tmp">Tmp</RouterLink>
      </li>
      <li>
        <RouterLink to="/items">Items</RouterLink>
      </li>
      <li>
        <RouterLink to="/auth">Auth</RouterLink>
      </li>
      <li>
        <RouterLink to="/online_game">Onlinee</RouterLink>
      </li>
    </ul>

    <Button type="danger" class="logout" label="Logout" :action="logout" />
    <!-- <Button type="primary" class="logout" label="Respawn" :action="setSpawnPoint" /> -->
  </nav>

  <Toast />

  <RouterView />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
// import { useDungeonStore } from './stores/dungeon';
import '@/declares/eve';

// const { setSpawnPoint } = useDungeonStore();
const { logout } = useAuthStore();
</script>

<style lang="scss">
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
