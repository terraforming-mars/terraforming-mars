<template>
  <div class="resource_items_cont">
    <player-resource :type="resources.MEGACREDITS" :count="player.megaCredits" :production="player.megaCreditProduction"></player-resource>
    <player-resource :type="resources.STEEL" :count="player.steel" :production="player.steelProduction" :steelValue="player.steelValue"></player-resource>
    <player-resource :type="resources.TITANIUM" :count="player.titanium" :production="player.titaniumProduction" :titaniumValue="player.titaniumValue"></player-resource>
    <player-resource :type="resources.PLANTS" :count="player.plants" :production="player.plantProduction" :plantsAreProtected="player.plantsAreProtected"></player-resource>
    <player-resource :type="resources.ENERGY" :count="player.energy" :production="player.energyProduction"></player-resource>
    <player-resource :type="resources.HEAT" :count="player.heat" :production="player.heatProduction" :canUseHeatAsMegaCredits="canUseHeatAsMegaCredits()"></player-resource>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {CardName} from '@/CardName';
import {PublicPlayerModel} from '@/models/PlayerModel';
import PlayerResource from '@/client/components/overview/PlayerResource.vue';
import {Resources} from '@/Resources';

export default Vue.extend({
  name: 'PlayerResources',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
    },
  },
  data() {
    return {
      resources: Resources,
    };
  },
  methods: {
    canUseHeatAsMegaCredits(): boolean {
      return this.player.corporationCard?.name === CardName.HELION;
    },
  },
  components: {
    'player-resource': PlayerResource,
  },
});
</script>
