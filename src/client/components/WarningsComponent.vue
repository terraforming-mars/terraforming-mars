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
  'pass': 'You will not take any more actions this generation.',
  'undoBestEffort': 'Undo is best effort only. Please do not report any bugs if it is broken.',
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
  'deckTooSmall': 'There are not enough cards to complete this action. You will draw fewer cards than expected.',
  'cannotAffordBoardOfDirectors': 'Warning: you do not have the 12 M€ required to act on a prelude.',
  'marsIsTerraformed': 'Note: all global parameters are at their goals.',
  'ineffectiveDoubleDown': 'Behavior in this card will apply to Double Down, and so have no effect.',
  'unusableEventsForAstraMechanica': 'Astra Mechanica does not apply to events that return cards to a player\'s hand.',
  'noMatchingCards': 'No cards gain the reward of this action.',
  'noEffect': 'This action will have no effect.',
  'selfTarget': 'Note: This action will target you.',
  'pharmacyUnion': 'Note: playing a card with a microbe tag will cause you to lose 4 M€ (or as much as possible).',
  'kaguyaTech': 'Warning: Your only greeneries are special tiles.',
  'underworldtokendiscard': 'Warning: You will have to discard an underworld resource token you rely on.',
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
