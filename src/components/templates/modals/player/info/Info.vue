<template>
  <div class="modal-card">
    <div class="grid-2-col">
      <div>
        <div class="modal-card__header">
          <!-- Animated Character -->
          <div class="character-animation">
            <Animation
              :path="
                animations.char.ally[character as CharacterName][
                  action as ActionName
                ]
              "
              :enable="true"
              :index="0"
            />
          </div>

          <!-- Name & Level -->
          <div class="name-level">
            <h2 class="modal-card__title">{{ player.info.character }}</h2>
            <span class="modal-card__subtitle">
              Lv. {{ player.info.level }}
            </span>
          </div>
        </div>

        <!-- HP / MP / STA Bars (Horizontal with Icons) -->
        <div class="modal-card__content resource-bars">
          <!-- HP Bar -->
          <ResourceBarIcon
            label="HP"
            icon="❤️"
            :current="player.state.health.current"
            :max="player.state.health.max"
            color="#ff4444"
          />
          <!-- MP Bar -->
          <ResourceBarIcon
            label="MP"
            icon="✨"
            :current="player.state.mana.current"
            :max="player.state.mana.max"
            color="#4488ff"
          />
          <!-- STA Bar -->
          <ResourceBarIcon
            label="STA"
            icon="🏃"
            :current="player.state.stamina.current"
            :max="player.state.stamina.max"
            color="#ffaa00"
          />
        </div>

        <!-- EXP Bar -->
        <div class="modal-card__content exp-bar">
          <div class="exp-label">EXP</div>
          <div class="bar">
            <div
              class="fill"
              :style="{
                width: expPercent + '%',
                backgroundColor: '#5bcbac',
              }"
            ></div>
          </div>
          <div class="exp-value">
            {{ Math.floor(player.info.experience) }} /
            {{ Math.floor(player.info.levelUpExperience) }}
          </div>
        </div>
      </div>

      <div class="grid-2-col">
        <div class="modal-card__content">
          <h3 class="section-title">Parameters</h3>
          <div class="params-grid">
            <div
              v-for="(value, key) in player.stats.params"
              :key="key"
              class="param-item"
            >
              <span class="icon">{{ getParamIcon(key) }}</span>
              <span class="label">{{ formatParamName(key) }}</span>
              <span class="value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="modal-card__content">
          <h3 class="section-title">Combat Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="icon">⚔️</span>
              <span class="label">ATK</span>
              <span class="value">{{ player.stats.damage.physic }}</span>
            </div>
            <div class="stat-item">
              <span class="icon">🔮</span>
              <span class="label">M.ATK</span>
              <span class="value">{{ player.stats.damage.magic }}</span>
            </div>
            <div class="stat-item">
              <div class="icon">👟</div>
              <span class="label">SPD</span>
              <span class="value">
                {{ player.stats.speed.walking }}/{{
                  player.stats.speed.running
                }}
              </span>
            </div>
            <div class="stat-item">
              <span class="icon">🎯</span>
              <span class="label">CRIT</span>
              <span class="value">
                {{ formatPercent(player.stats.crit.chance) }}%
              </span>
            </div>
            <div class="stat-item">
              <div class="icon">🛡️</div>
              <span class="label">DEF</span>
              <span class="value">{{ player.state.armor }}</span>
            </div>
            <div class="stat-item">
              <div class="icon">⚡</div>
              <span class="label">AS</span>
              <span class="value">
                {{ player.stats.attackSpeed.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-if="false">
      <!-- Unallocated Points -->
      <div
        v-if="player.stats.statPoints || player.stats.skillPoints"
        class="modal-card__content"
      >
        <h3 class="section-title">Unspent Points</h3>
        <div class="points-grid">
          <div
            v-if="player.stats.statPoints"
            class="point stat"
          >
            🎯 +{{ player.stats.statPoints }} Stat Points
          </div>
          <div
            v-if="player.stats.skillPoints"
            class="point skill"
          >
            ⚔️ +{{ player.stats.skillPoints }} Skill Points
          </div>
        </div>
      </div>

      <!-- Inventory -->
      <div
        v-if="player.inventory.inventory.length"
        class="modal-card__content"
      >
        <h3 class="section-title">Inventory</h3>
        <div class="item-count">
          🎒 {{ player.inventory.inventory.length }} items
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Animation from '@/components/templates/animation/index.vue';
import type { Player } from '@/types';
import { ResourceBarIcon } from './bar';
import animations from '@/animations.json';

type CharacterName = 'knight' | 'mage' | 'archer' | string;
type ActionName = 'idle' | 'walk' | 'attack' | string;

const props = defineProps<{
  player: Player;
}>();

const character = computed((): CharacterName => {
  return props.player.info.character.toLowerCase() as CharacterName;
});

const action = computed((): ActionName => {
  return 'idle';
});

const expPercent = computed(() => {
  return (
    (props.player.info.experience / props.player.info.levelUpExperience) * 100
  );
});

function formatParamName(key: string): string {
  const map: Record<string, string> = {
    strength: 'Strength',
    agility: 'Agility',
    intelligence: 'Intelligence',
    stamina: 'Stamina',
    luck: 'Luck',
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(1);
}

function getParamIcon(key: string): string {
  const icons: Record<string, string> = {
    strength: '💪',
    agility: '🤸',
    intelligence: '🧠',
    stamina: '🔋',
    luck: '🍀',
  };
  return icons[key] || '⚡';
}
</script>

<style scoped lang="scss">
@use './Info.scss';
</style>
