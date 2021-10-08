<template>
    <div class="card-extra-content-container">
      <div v-if="lifeFound(card)" class="little-green-men" />
      <div v-if="isMiningTileOnMetal(card,'steel')" class="mined-metal mined-steel" />
      <div v-if="isMiningTileOnMetal(card,'titanium')" class="mined-metal mined-titanium" />
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardModel} from '@/models/CardModel';
import {CardName} from '@/CardName';
import {Resources} from '@/Resources';

export default Vue.extend({
  name: 'CardExtraContent',
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  methods: {
    lifeFound(card: CardModel): boolean {
      return card.name === CardName.SEARCH_FOR_LIFE && card.resources !== undefined && card.resources > 0;
    },
    isMiningTileOnMetal(card: CardModel, metal: Resources): boolean {
      return card.bonusResource?.includes(metal) === true;
    },
    miningTileOnTitanium(card: CardModel): boolean {
      return card.name === CardName.SEARCH_FOR_LIFE && card.resources !== undefined && card.resources > 0;
    },
  },
});

</script>

