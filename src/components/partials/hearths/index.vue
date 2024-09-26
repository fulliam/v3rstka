<template>
  <div class="heart-wrapper">
    <div
      v-for="(heart, index) in hearts"
      :key="index"
      class="heart"
      :class="getHeartClass(heart.fill)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  hearts: {
    fill: number;
  }[];
}>();

const getHeartClass = (fill: number) => {
  if (fill <= 0) return 'heart-0';
  if (fill <= 10) return 'heart-10';
  if (fill <= 20) return 'heart-20';
  if (fill <= 30) return 'heart-30';
  if (fill <= 40) return 'heart-40';
  if (fill <= 50) return 'heart-50';
  if (fill <= 60) return 'heart-60';
  if (fill <= 70) return 'heart-70';
  if (fill <= 80) return 'heart-80';
  if (fill <= 90) return 'heart-90';
  return 'heart-100';
};
</script>

<style scoped lang="scss">
$heart-width: 162px;
$heart-background: var(--color-heart-background, #000);
$heart-fill: var(--color-heart-fill, #f30000);

$transition-duration: 2s;
$transition-timing-function: forwards;

.heart-wrapper {
  text-align: center;
  display: flex;
  gap: 10px;
  transform: scale(0.4);
}

.heart {
  display: inline-block;
  width: 79px;
  height: 74px;
  position: relative;
}

$border:
  78px 132px #000000,
  84px 126px #000000,
  90px 120px #000000,
  96px 114px #000000,
  102px 108px #000000,
  108px 102px #000000,
  108px 96px #000000,
  114px 90px #000000,
  114px 84px #000000,
  114px 78px #000000,
  108px 72px #000000,
  102px 66px #000000,
  90px 66px #000000,
  96px 66px #000000,
  84px 72px #000000,
  78px 78px #000000,
  72px 72px #000000,
  66px 66px #000000,
  60px 66px #000000,
  54px 66px #000000,
  48px 72px #000000,
  42px 84px #000000,
  42px 78px #000000,
  42px 90px #000000,
  48px 96px #000000,
  48px 102px #000000,
  54px 108px #000000,
  60px 114px #000000,
  66px 120px #000000,
  72px 126px #000000;

$shine:
  54px 72px #fff,
  48px 78px #fff;

$line0: 78px 126px $heart-background;

$line1:
  84px 120px $heart-background,
  78px 120px $heart-background,
  72px 120px $heart-background;

$line2:
  90px 114px $heart-background,
  84px 114px $heart-background,
  78px 114px $heart-background,
  72px 114px $heart-background,
  66px 114px $heart-background;

$line3:
  96px 108px $heart-background,
  90px 108px $heart-background,
  84px 108px $heart-background,
  78px 108px $heart-background,
  72px 108px $heart-background,
  66px 108px $heart-background,
  60px 108px $heart-background;

$line4:
  102px 102px $heart-background,
  96px 102px $heart-background,
  90px 102px $heart-background,
  78px 102px $heart-background,
  84px 102px $heart-background,
  72px 102px $heart-background,
  66px 102px $heart-background,
  60px 102px $heart-background,
  54px 102px $heart-background;

$line5:
  102px 96px $heart-background,
  90px 96px $heart-background,
  96px 96px $heart-background,
  84px 96px $heart-background,
  54px 96px $heart-background,
  60px 96px $heart-background,
  66px 96px $heart-background,
  72px 96px $heart-background,
  78px 96px $heart-background;

$line6:
  108px 90px $heart-background,
  102px 90px $heart-background,
  96px 90px $heart-background,
  90px 90px $heart-background,
  84px 90px $heart-background,
  78px 90px $heart-background,
  72px 90px $heart-background,
  66px 90px $heart-background,
  60px 90px $heart-background,
  54px 90px $heart-background,
  48px 90px $heart-background;

$line7:
  108px 84px $heart-background,
  102px 84px $heart-background,
  96px 84px $heart-background,
  90px 84px $heart-background,
  84px 84px $heart-background,
  78px 84px $heart-background,
  72px 84px $heart-background,
  66px 84px $heart-background,
  60px 84px $heart-background,
  54px 84px $heart-background,
  48px 84px $heart-background;

$line8:
  108px 78px $heart-background,
  102px 78px $heart-background,
  96px 78px $heart-background,
  90px 78px $heart-background,
  84px 78px $heart-background,
  72px 78px $heart-background,
  66px 78px $heart-background,
  60px 78px $heart-background,
  54px 78px $heart-background;

$line9:
  102px 72px $heart-background,
  96px 72px $heart-background,
  90px 72px $heart-background,
  66px 72px $heart-background,
  60px 72px $heart-background;

// Heart fill
$line0_: 78px 126px $heart-fill;

$line1_:
  84px 120px $heart-fill,
  78px 120px $heart-fill,
  72px 120px $heart-fill;

$line2_:
  90px 114px $heart-fill,
  84px 114px $heart-fill,
  78px 114px $heart-fill,
  72px 114px $heart-fill,
  66px 114px $heart-fill;

$line3_:
  96px 108px $heart-fill,
  90px 108px $heart-fill,
  84px 108px $heart-fill,
  78px 108px $heart-fill,
  72px 108px $heart-fill,
  66px 108px $heart-fill,
  60px 108px $heart-fill;

$line4_:
  102px 102px $heart-fill,
  96px 102px $heart-fill,
  90px 102px $heart-fill,
  78px 102px $heart-fill,
  84px 102px $heart-fill,
  72px 102px $heart-fill,
  66px 102px $heart-fill,
  60px 102px $heart-fill,
  54px 102px $heart-fill;

$line5_:
  102px 96px $heart-fill,
  90px 96px $heart-fill,
  96px 96px $heart-fill,
  84px 96px $heart-fill,
  54px 96px $heart-fill,
  60px 96px $heart-fill,
  66px 96px $heart-fill,
  72px 96px $heart-fill,
  78px 96px $heart-fill;

$line6_:
  108px 90px $heart-fill,
  102px 90px $heart-fill,
  96px 90px $heart-fill,
  90px 90px $heart-fill,
  84px 90px $heart-fill,
  78px 90px $heart-fill,
  72px 90px $heart-fill,
  66px 90px $heart-fill,
  60px 90px $heart-fill,
  54px 90px $heart-fill,
  48px 90px $heart-fill;

$line7_:
  108px 84px $heart-fill,
  102px 84px $heart-fill,
  96px 84px $heart-fill,
  90px 84px $heart-fill,
  84px 84px $heart-fill,
  78px 84px $heart-fill,
  72px 84px $heart-fill,
  66px 84px $heart-fill,
  60px 84px $heart-fill,
  54px 84px $heart-fill,
  48px 84px $heart-fill;

$line8_:
  108px 78px $heart-fill,
  102px 78px $heart-fill,
  96px 78px $heart-fill,
  90px 78px $heart-fill,
  84px 78px $heart-fill,
  72px 78px $heart-fill,
  66px 78px $heart-fill,
  60px 78px $heart-fill,
  54px 78px $heart-fill;

$line9_:
  102px 72px $heart-fill,
  96px 72px $heart-fill,
  90px 72px $heart-fill,
  66px 72px $heart-fill,
  60px 72px $heart-fill;

.heart:after {
  content: '';
  position: absolute;
  top: -65px;
  left: -42px;
  width: 6px;
  height: 6px;
  background: transparent;
}

.heart-100:after {
  animation: $transition-duration fill-100 $transition-timing-function;
}

.heart-95:after {
  animation: $transition-duration fill-95 $transition-timing-function;
}

.heart-90:after {
  animation: $transition-duration fill-90 $transition-timing-function;
}

.heart-80:after {
  animation: $transition-duration fill-80 $transition-timing-function;
}

.heart-70:after {
  animation: $transition-duration fill-70 $transition-timing-function;
}

.heart-60:after {
  animation: $transition-duration fill-60 $transition-timing-function;
}

.heart-50:after {
  animation: $transition-duration fill-50 $transition-timing-function;
}

.heart-40:after {
  animation: $transition-duration fill-40 $transition-timing-function;
}

.heart-30:after {
  animation: $transition-duration fill-30 $transition-timing-function;
}

.heart-20:after {
  animation: $transition-duration fill-20 $transition-timing-function;
}

.heart-10:after {
  animation: $transition-duration fill-10 $transition-timing-function;
}

.heart-0:after {
  animation: $transition-duration fill-0 $transition-timing-function;
}

@keyframes fill-100 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  60% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  70% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7, $line8, $line9, $border, $line0_;
  }

  80% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8, $line9, $border, $line0_;
  }

  90% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8_, $line9, $border, $line0_;
  }

  95% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8_, $line9_, $border, $line0_;
  }

  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8_, $line9_, $border, $line0_;
  }
}

@keyframes fill-95 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  60% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  70% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7, $line8, $line9, $border, $line0_;
  }

  80% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8, $line9, $border, $line0_;
  }

  90% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8_, $line9, $border, $line0_;
  }

  95%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8_, $line9_, $border, $line0_;
  }
}

@keyframes fill-90 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  60% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  70% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7, $line8, $line9, $border, $line0_;
  }

  80% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8, $line9, $border, $line0_;
  }

  90%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8_, $line9, $border, $line0_;
  }
}

@keyframes fill-80 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  60% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  70% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7, $line8, $line9, $border, $line0_;
  }

  80%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7_, $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-70 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  60% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  70%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6_,
      $line7, $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-60 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  60%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5_, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-50 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }

  50%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4_, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-40 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  40%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3_, $line4, $line5, $line6,
      $line7, $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-30 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  30%,
  100% {
    box-shadow: $shine, $line1_, $line2_, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-20 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }

  20%,
  100% {
    box-shadow: $shine, $line1_, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-10 {
  0% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
  10%,
  100% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0_;
  }
}

@keyframes fill-0 {
  0%,
  100% {
    box-shadow: $shine, $line1, $line2, $line3, $line4, $line5, $line6, $line7,
      $line8, $line9, $border, $line0;
  }
}
</style>
