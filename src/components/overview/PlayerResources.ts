import Vue from "vue";
import { PlayerResource } from "./PlayerResource";

export const PlayerResources = Vue.component("player-resources", {
    props: ["player"],
    data: function () {
        return {};
    },
    components: {
        "player-resource": PlayerResource,
    },
    template: `
        <div class="resource_items_cont">
            <player-resource type="megacredits" prod_label="" :count="player.megaCredits" :production="player.megaCreditProduction"></player-resource>
            <player-resource type="steel" prod_label="" :count="player.steel" :production="player.steelProduction"></player-resource>
            <player-resource type="titanium" prod_label="" :count="player.titanium" :production="player.titaniumProduction"></player-resource>
            <player-resource type="plants" prod_label="" :count="player.plants" :production="player.plantProduction"></player-resource>
            <player-resource type="energy" prod_label="" :count="player.energy" :production="player.energyProduction"></player-resource>
            <player-resource type="heat" prod_label="" :count="player.heat" :production="player.heatProduction"></player-resource>
        </div>
    `,
});
