<template>
  <div class='board-space-bonuses'>
    <i v-for="(spaceBonus, idx) in bonus" :key="idx" :class="getClass(idx + 1, spaceBonus)" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
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
  [SpaceBonus.RESTRICTED]: '', // RESTRICTED is just a that a space is empty, not an actual bonus.
};

export default Vue.extend({
  name: 'bonus',
  props: {
    bonus: {
      type: Array as () => Array<SpaceBonus>,
    },
  },
  methods: {
    getClass(idx: number, bonus: SpaceBonus): string {
      return `board-space-bonus board-space-bonus--${css[bonus]} board-space-bonus-pos--${idx}`;
    },
  },
});

</script>

