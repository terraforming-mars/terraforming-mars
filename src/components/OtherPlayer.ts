
import Vue from "vue";

import { CardModel } from "../models/CardModel";
import { getProjectCardByName } from "./Card";
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
        getEventCards: function () {
            return this.player.playedCards.map((card: CardModel) => {
                return getProjectCardByName(card.name);
            });
        },
        getCorporationCard: function () {
                return this.player.corporationCard;
        },
        toggleDisplayed: function () {
            this.displayed = !this.displayed;
        }
    },
    template: `
        <div>
            <h3 :style="'color:' + player.color" v-on:click="toggleDisplayed()">{{player.name}}</h3>
            <div v-if="displayed === true">
                <div>Terraform Rating: {{player.terraformRating}}</div>
                <div v-if="player.corporationCard !== undefined">
                    <card :card="getCorporationCard()"></card>
                </div>
                <h4 v-if="player.playedCards.length > 0">Played Cards</h4>
                <div v-if="player.playedCards.length > 0">
                    <div class="cardbox" v-for="card in getEventCards()" :key="card">
                        <card hideCost="true" :card="card.name" :resources="card.resources"></card>
                    </div>
                </div>
                <player-resources :player="player"></player-resources>
            </div>
        </div>
    `
});
