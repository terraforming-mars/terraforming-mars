
import Vue from "vue";

import { PlayerResources } from "./PlayerResources";

export const OtherPlayer = Vue.component("other-player", {
    props: ["player"],
    components: {
        "player-resources": PlayerResources
    },
    data: function () {
        return {
            displayed: false
        };
    },
    methods: {
        toggleDisplayed: function () {
            this.displayed = !this.displayed;
        }
    },
    template: `
        <div>
            <h3 :style="'color:' + player.color" v-on:click="toggleDisplayed()">{{player.name}}</h3>
            <div v-if="displayed === true">
                <div>Terraform Rating: {{player.terraformRating}}</div>
                <div>Corporation: {{player.corporationCard || "None selected yet"}}</div>
                <h4 v-if="player.playedCards.length > 0">Played Cards</h4>
                <div v-if="player.playedCards.length > 0">
                    <div v-for="card in getEventCards()" :key="card">
                        <card :card="card.name" :animals="card.animals" :fighterResources="card.fighterResources" :microbes="card.microbes" :scienceResources="card.scienceResources"></card>
                    </div>
                </div>
                <player-resources :player="player"></player-resources>
            </div>
        </div>
    `
});
