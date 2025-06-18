<template>
  <section class="items">
    <div
      v-for="(animation, animationIndex) in animations.items"
      :key="animationIndex"
      class="items-wrapper"
    >
      <div
        v-for="(item, index) in Object.keys(animation).length"
        :key="index"
        class="item"
      >
        <Animation
          :path="animation"
          :enable="false"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Animation from '@/components/templates/animation/index.vue';
import animations from '@/animations.json';

// const getRarityClass = (rarity: string) => {
//   return rarity ? rarity : 'common';
// };
</script>

<style scoped lang="scss">
@use 'sass:color';

.items {
  margin: 20px;
  padding: 20px;
  background-color: #6262625f;
  border-radius: 10px;
}

.loupe {
  display: flex;
  justify-content: center;
  align-self: center;
  width: 100%;
  height: 500px;
}

.items-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, 60px);
  margin: 5px;

  .item {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: #5bcbac2b,
      $background-color: #5bcbac2b,
      $background-color-hover: color.adjust(#5bcbac2b, $lightness: 10%)
    );
  }

  .common {
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: #5bcbac2b,
      $background-color: #5bcbac2b,
      $background: radial-gradient(
          circle at center,
          rgba(192, 192, 192, 0.85),
          rgba(128, 128, 128, 0.6)
        )
    );
  }

  .rare {
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: #5bcbac2b,
      $background-color: #5bcbac2b,
      $background: radial-gradient(
          circle at center,
          rgba(127, 255, 0, 0.85),
          rgba(0, 100, 0, 0.6)
        )
    );
  }

  .unique {
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: #5bcbac2b,
      $background-color: #5bcbac2b,
      $background: radial-gradient(
          circle at center,
          rgba(30, 144, 255, 0.85),
          rgba(0, 0, 139, 0.6)
        )
    );
  }

  .mythic {
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: #5bcbac2b,
      $background-color: #5bcbac2b,
      $background: radial-gradient(
          circle at center,
          rgba(238, 130, 238, 0.85),
          rgba(75, 0, 130, 0.6)
        )
    );
  }

  .legendary {
    @include pixel-box(
      $corner-size: 2,
      $border-size: 2px,
      $border-color: #5bcbac2b,
      $background-color: #5bcbac2b,
      $background: radial-gradient(
          circle at center,
          rgba(255, 215, 0, 0.85),
          rgba(139, 101, 8, 0.6)
        )
    );
  }
}
</style>
