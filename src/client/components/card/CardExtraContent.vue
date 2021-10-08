<template>
    <div class="card-extra-content-container">
      <div v-if="lifeFound()" class="little-green-men" />
      <div v-if="isMiningTileOnSteel()" class="mined-metal mined-steel" />
      <div v-if="isMiningTileOnTitanium()" class="mined-metal mined-titanium" />
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
      type: Object as () => CardModel,
      required: true,
    },
  },
  methods: {
    isMiningTileOnSteel() {
      return this.card.bonusResource?.includes(Resources.STEEL);
    },
    isMiningTileOnTitanium() {
      return this.card.bonusResource?.includes(Resources.TITANIUM);
    },
    lifeFound() {
      return this.card.name === CardName.SEARCH_FOR_LIFE && this.card.resources !== undefined && this.card.resources > 0;
    },
  },
});

</script>

