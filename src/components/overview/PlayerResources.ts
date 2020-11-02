import Vue from "vue";
import { PlayerModel } from "../../models/PlayerModel";
import { PlayerResource } from "./PlayerResource";
import { Resources } from "../../Resources";

export const PlayerResources = Vue.component("player-resources", {
    props: {
        player: {
            type: Object as () => PlayerModel
        }
    },
    data: function () {
        return {
            resources: Resources
        };
    },
    methods: {
    },
    components: {
        "player-resource": PlayerResource,
    },
    template: `
        <div class="resource_items_cont">
            <player-resource :type="resources.MEGACREDITS" :count="player.megaCredits" :production="player.megaCreditProduction"></player-resource>
            <player-resource :type="resources.STEEL" :count="player.steel" :production="player.steelProduction"></player-resource>
            <player-resource :type="resources.TITANIUM" :count="player.titanium" :production="player.titaniumProduction"></player-resource>
            <player-resource :type="resources.PLANTS" :count="player.plants" :production="player.plantProduction"></player-resource>
            <player-resource :type="resources.ENERGY" :count="player.energy" :production="player.energyProduction"></player-resource>
            <player-resource :type="resources.HEAT" :count="player.heat" :production="player.heatProduction"></player-resource>
        </div>
    `,
});
