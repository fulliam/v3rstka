<template>
  <ClickParent
    ref="clickParent"
    :duration="
      Object.keys(animations.decorations.explosion.lightning).length * 100
    "
    @dot="shakeDungeon"
  >
    <Animation :path="currentSkillAnimation" />
  </ClickParent>

  <div class="skillbar">
    <button @click="handleActivate($event, Skill.FireExplosion)">
      FireExplosion
    </button>
    <button @click="handleActivate($event, Skill.LightningExplosion)">
      LightningExplosion
    </button>
    <button @click="handleActivate($event, Skill.GroundSmoke)">
      GroundSmoke
    </button>
    <button @click="handleActivate($event, Skill.LightningCycle)">
      LightningCycle
    </button>
    <button @click="handleActivate($event, Skill.LightningLinear)">
      LightningLinear
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ClickParent from '@/components/partials/clickparent/index.vue';
import Animation from '@/components/templates/animation/index.vue';
import animations from '@/animations.json';
import { Position } from '@/types';

const clickParent = ref<InstanceType<typeof ClickParent> | null>(null);

enum Skill {
  FireExplosion = animations.decorations.explosion.fire as any,
  LightningExplosion = animations.decorations.explosion.lightning as any,
  GroundSmoke = animations.decorations.effects.groundSmoke as any,
  LightningCycle = animations.decorations.lightning.cycle as any,
  LightningLinear = animations.decorations.lightning.linear as any,
}

const currentSkillAnimation = ref<Skill | any>(null);
const handleActivate = (event: MouseEvent, skill: Skill) => {
  currentSkillAnimation.value = skill;
  clickParent.value?.activate(event);
};

const shaked = ref<boolean>(false);
const shakeDungeon = (position: Position, duration: number) => {
  shaked.value = true;
  setTimeout(() => {
    shaked.value = false;
  }, duration);
};
</script>

<style scoped lang="scss">
.skillbar {
  position: absolute;
  top: 10%;
  right: 10%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1001;
}
</style>
