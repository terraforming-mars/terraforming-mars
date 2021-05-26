import Vue from 'vue';
import {CardName} from '../../CardName';
import {PlayerModel} from '../../models/PlayerModel';
import {PlayerResource} from './PlayerResource';
import {Resources} from '../../Resources';

export const PlayerResources = Vue.component('player-resources', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
  },
  data: function() {
    return {
      resources: Resources,
    };
  },
  methods: {
    canUseHeatAsMegaCredits: function(): boolean {
      return this.player.corporationCard?.name === CardName.HELION;
    },
  },
  components: {
    'player-resource': PlayerResource,
  },
  template: `
        <div class="resource_items_cont">
            <player-resource :type="resources.MEGACREDITS" :count="player.megaCredits" :production="player.megaCreditProduction"></player-resource>
            <player-resource :type="resources.STEEL" :count="player.steel" :production="player.steelProduction" :steelValue="player.steelValue"></player-resource>
            <player-resource :type="resources.TITANIUM" :count="player.titanium" :production="player.titaniumProduction" :titaniumValue="player.titaniumValue"></player-resource>
            <player-resource :type="resources.PLANTS" :count="player.plants" :production="player.plantProduction" :plantsAreProtected="player.plantsAreProtected"></player-resource>
            <player-resource :type="resources.ENERGY" :count="player.energy" :production="player.energyProduction"></player-resource>
            <player-resource :type="resources.HEAT" :count="player.heat" :production="player.heatProduction" :canUseHeatAsMegaCredits="canUseHeatAsMegaCredits()"></player-resource>
        </div>
    `,
});
