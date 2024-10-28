<template>
  <div class="controller">
    <empty><i></i></empty>
    <button><i>w</i></button>
    <empty><i></i></empty><br />
    <button><i>a</i></button>
    <button><i>s</i></button>
    <button><i>d</i></button><br />
  </div>
</template>

<style scoped lang="scss">
.controller {
  position: absolute;
  top: 0;
  left: 0;
}

empty {
  width: 80px;
  height: 80px;
  padding: 4px;
  position: relative;
  display: inline-block;
}

button {
  cursor: pointer;
  padding: 8px 15px;
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background: linear-gradient(180deg, #282828, #202020);
  box-shadow:
    inset -8px 0 8px rgba(0, 0, 0, 0.15),
    inset 0 -8px 8px rgba(0, 0, 0, 0.25),
    0 0 0 2px rgba(0, 0, 0, 0.75),
    10px 20px 25px rgba(0, 0, 0, 0.4);
  margin: 8px 4px;
  overflow: hidden;
  transition: transform 0.1s ease;
}

button:active {
  transform: scale(0.95);
}

button::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 4px;
  bottom: 14px;
  right: 12px;
  border-radius: 10px;
  background: linear-gradient(90deg, #232323, #4a4a4a);
  box-shadow:
    -10px -10px 10px rgba(225, 225, 225, 0.25),
    10px 5px 10px rgba(0, 0, 0, 0.15);
  border-left: 1px solid #0004;
  border-bottom: 1px solid #0004;
  border-top: 1px solid #0009;
}

button i {
  position: relative;
  color: #fff;
  font-style: normal;
  text-transform: uppercase;
  font-size: 2em;
}

button:last-child {
  width: 100%;
}
</style>
