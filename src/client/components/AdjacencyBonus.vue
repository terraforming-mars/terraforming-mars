<template>
  <div :class="positionClass">
    <i v-for="(adjacencyBonus, idx) in bonus" :key="idx" :class="getClass(adjacencyBonus)"></i>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {SpaceBonus} from '@/common/boards/SpaceBonus';

export type AdjacencyBonusTypes = SpaceBonus | 'lose2mc' | '2mc';

const css: Record<AdjacencyBonusTypes, string> = {
  [SpaceBonus.TITANIUM]: 'titanium',
  [SpaceBonus.STEEL]: 'steel',
  [SpaceBonus.PLANT]: 'plant',
  [SpaceBonus.DRAW_CARD]: 'card',
  [SpaceBonus.HEAT]: 'heat',
  [SpaceBonus.OCEAN]: '',
  [SpaceBonus.MEGACREDITS]: 'megacredit',
  [SpaceBonus.ANIMAL]: 'animal',
  [SpaceBonus.MICROBE]: 'microbe',
  [SpaceBonus.ENERGY]: 'energy',
  [SpaceBonus.DATA]: '',
  [SpaceBonus.SCIENCE]: '',
  [SpaceBonus.ENERGY_PRODUCTION]: '',
  [SpaceBonus.TEMPERATURE]: '',
  [SpaceBonus.ASTEROID]: 'asteroid',
  [SpaceBonus.DELEGATE]: '',
  [SpaceBonus.COLONY]: '',
  [SpaceBonus._RESTRICTED]: '', // RESTRICTED is just a that a space is empty, not an actual bonus.
  [SpaceBonus.TEMPERATURE_4MC]: '',
  ['lose2mc']: 'lose2mc', // For rendering the tile bonus on the Nuclear Zone tile in Ares
  ['2mc']: '2mc', // For rendering two megacredit bonuses as a single 2mc icon.
};

const props = defineProps<{
  bonus: Array<AdjacencyBonusTypes>;
}>();

const positionClass = computed(() => {
  const modifier = props.bonus.includes('lose2mc') ? ' lose2mc' : '';
  return `adjacency-bonuses width--${props.bonus.length}${modifier}`;
});
function getClass(bonus: AdjacencyBonusTypes): string {
  return `adjacency-bonus board-space-bonus--${css[bonus]}`;
}
</script>

<style scoped lang="less">
.adjacency-bonuses {
  position: absolute;
  display: flex;
  border: 1px solid @adjacency-bonus;

  &.lose2mc {
    border-color: @adjacency-cost;
  }

  &.width--1 {
    margin: 7px 0 0 14px;
  }


  &.width--2 {
    margin: 7px 0 0 6px;
  }
}

.adjacency-bonus {
  pointer-events: none;
  width: 16px;
  height: 16px;
  border-radius: 1px;

  // A card is portrait, so keep it 16px tall but narrower than it is square.
  &.board-space-bonus--card {
    width: 11px;
    height: 16px;
    background-size: auto 16px;
  }
}
</style>
