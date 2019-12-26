
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
                <div class="player_home_block">
                    Cards In Hand: {{player.cardsInHandNbr}}
                </div>

                <div class="player_home_block">
                    <player-resources :player="player"></player-resources>
                </div>

                <div v-if="player.playedCards.length > 0" class="player_home_block">
                    <h4>Played Cards</h4>
                    <div>
                        <div class="cardbox" v-for="card in getEventCards()" :key="card">
                            <card :card="card.name" :resources="card.resources"></card>
                        </div>
                    </div>
                </div> 

                <div v-if="player.corporationCard !== undefined" class="player_home_block">
                    <card :card="getCorporationCard()"></card>
                </div>
            </div>
        </div>
    `
});
