<template>
  <nav>
    <ul>
      <li>
        <RouterLink to='/'>Auth</RouterLink>
      </li>
      <li>
        <RouterLink to='/game'>Game</RouterLink>
      </li>
    </ul>
  </nav>

  <RouterView />
</template>

<style lang="scss">
nav {
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
  background: #1e1e1e;
  backdrop-filter: blur(2px);
  width: 100%;

  ul {
    list-style: none;
    display: flex;
    gap: 10px;
  }
}
</style>