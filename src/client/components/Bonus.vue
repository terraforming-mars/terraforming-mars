<template>
  <div class='board-space-bonuses'>
    <i v-for="(spaceBonus, idx) in bonus" :key="idx" :class="getClass(idx + 1, spaceBonus)" />
  </div>
</template>

<script setup lang="ts">

import {SpaceBonus} from '@/common/boards/SpaceBonus';

const css: Record<SpaceBonus, string> = {
  [SpaceBonus.TITANIUM]: 'titanium',
  [SpaceBonus.STEEL]: 'steel',
  [SpaceBonus.PLANT]: 'plant',
  [SpaceBonus.DRAW_CARD]: 'card',
  [SpaceBonus.HEAT]: 'heat',
  [SpaceBonus.OCEAN]: 'bonusocean',
  [SpaceBonus.MEGACREDITS]: '', // Only used for Ares
  [SpaceBonus.ANIMAL]: 'animal',
  [SpaceBonus.MICROBE]: 'microbe',
  [SpaceBonus.ENERGY]: 'energy',
  [SpaceBonus.DATA]: 'data',
  [SpaceBonus.SCIENCE]: 'science',
  [SpaceBonus.ENERGY_PRODUCTION]: 'energy-production',
  [SpaceBonus.TEMPERATURE]: 'bonustemperature',
  [SpaceBonus.ASTEROID]: 'asteroid',
  [SpaceBonus.DELEGATE]: 'delegate',
  [SpaceBonus.COLONY]: 'colony',
  [SpaceBonus._RESTRICTED]: '', // RESTRICTED is just a that a space is empty, not an actual bonus.
  [SpaceBonus.TEMPERATURE_4MC]: 'bonustemperature4mc',
};

const props = defineProps<{
  bonus: Array<SpaceBonus>;
}>();

function getClass(idx: number, bonus: SpaceBonus): string {
  const doubleWideBonuses = [
    SpaceBonus.OCEAN,
    SpaceBonus.TEMPERATURE,
    SpaceBonus.TEMPERATURE_4MC,
    SpaceBonus.COLONY,
  ];
  // If only one bonus is present, center it.
  // Except: some bonuses occupy 2 spaces.
  let position: string | number = idx;
  if (props.bonus.length === 1 && !doubleWideBonuses.includes(bonus)) {
    position = 'only';
  }
  return `board-space-bonus board-space-bonus--${css[bonus]} board-space-bonus-pos--${position}`;
}
</script>
