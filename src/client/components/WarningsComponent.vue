<template>
  <div v-if="warnings !== undefined">
    <div v-for="(warning, idx) in (warnings || [])" :key="idx" class="card-warning">
      {{ $t(descriptions[warning]) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Warning} from '@/common/cards/Warning';

const descriptions: Record<Warning, string> = {
  'maxtemp': 'Note: the temperature is already at its goal.',
  'maxoxygen': 'Note: the oxygen level is already at its goal.',
  'maxoceans': 'Note: all oceans are already on the board.',
  'maxvenus': 'Note: Venus scale is already at its goal.',
  'maxHabitatRate': 'Note: Moon habitat rate is already at its goal.',
  'maxMiningRate': 'Note: Moon mining rate is already at its goal.',
  'maxLogisticsRate': 'Note: Moon logistics rate is already at its goal.',
  'decreaseOwnProduction': 'Warning: you are the only player that can lose production.',
  'removeOwnPlants': 'Warning: this will remove your own plants',
  'buildOnLuna': 'You will only be able to build the colony on Luna.',
  'preludeFizzle': 'This prelude is not playable, so you will discard it and gain 15 M€.',
  'underworldMustExcavateEnergy': 'You will be limited to excavating a space that gives 1 energy production.',
  'deckTooSmall': 'There are not enough cards to complete this action. You will draw fewer cards than expected.',
};

export default Vue.extend({
  name: 'WarningsComponent',
  props: {
    warnings: {
      type: Array as () => Array<Warning>,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    descriptions(): typeof descriptions {
      return descriptions;
    },
  },
});
</script>
