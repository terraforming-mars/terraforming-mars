<template>
  <div class="resource_items_cont">
    <player-resource
      :type="resources.MEGACREDITS"
      :count="player.megaCredits"
      :production="player.megaCreditProduction"
      :resourceProtection="player.protectedResources.megacredits"
      :productionProtection="player.protectedProduction.megacredits"/>
    <player-resource
      :type="resources.STEEL"
      :count="player.steel"
      :production="player.steelProduction"
      :value="player.steelValue"
      :resourceProtection="player.protectedResources.steel"
      :productionProtection="player.protectedProduction.steel"/>
    <!-- TODO LUNA TRADE FEDERATION -->
    <player-resource
      :type="resources.TITANIUM"
      :count="player.titanium"
      :production="player.titaniumProduction"
      :value="player.titaniumValue"
      :resourceProtection="player.protectedResources.titanium"
      :productionProtection="player.protectedProduction.titanium"/>
    <player-resource
      :type="resources.PLANTS"
      :count="player.plants"
      :production="player.plantProduction"
      :resourceProtection="player.protectedResources.plants"
      :productionProtection="player.protectedProduction.plants"/>
    <player-resource
      :type="resources.ENERGY"
      :count="player.energy"
      :production="player.energyProduction"
      :resourceProtection="player.protectedResources.energy"
      :productionProtection="player.protectedProduction.energy"/>
    <player-resource
      :type="resources.HEAT"
      :count="player.heat"
      :production="player.heatProduction"
      :value="canUseHeatAsMegaCredits() ? 1 : 0"
      :resourceProtection="player.protectedResources.heat"
      :productionProtection="player.protectedProduction.heat"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {CardName} from '@/common/cards/CardName';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import PlayerResource from '@/client/components/overview/PlayerResource.vue';
import {Resources} from '@/common/Resources';

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
    // TODO LUNA TRADE FEDERATION
    canUseHeatAsMegaCredits(): boolean {
      return this.player.tableau.some((card) => card.name === CardName.HELION);
    },
  },
  components: {
    'player-resource': PlayerResource,
  },
});
</script>
