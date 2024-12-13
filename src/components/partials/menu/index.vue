<template>
  <nav class="menu">
    <ul class="menu-list">
      <li class="menu-list__item" v-for="item in items" :key="item.title">
        <RouterLink :to="item.to">{{ item.title }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const items = [
  {
    title: 'New Game',
    to: '/create_character',
  },
  {
    title: 'Continue',
    to: '/offline_game',
  },
  {
    title: 'Multiplayer',
    to: '/auth',
  },
  {
    title: 'Settings',
    to: '/settings',
  },
  {
    title: 'About',
    to: '/about',
  },
];
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100px;

  &-list {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    list-style-type: none;
    padding: 0;

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      background: violet;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      min-width: 120px;

      &:hover {
        background: rgba(238, 130, 238, 0.784);
      }

      a {
        font-size: 32px;
        color: white;
      }
    }
  }
}
</style>
