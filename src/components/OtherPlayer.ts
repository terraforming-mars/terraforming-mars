
import Vue from "vue";

import { PlayerResources } from "./PlayerResources";

export const OtherPlayer = Vue.component("other-player", {
    props: ["player"],
    components: {
        "player-resources": PlayerResources
    },
    methods: {
        toggleVisible: function () {
            (this.$root as any).otherPlayersVisibility[this.player.id] = !(this.$root as any).otherPlayersVisibility[this.player.id];
            this.$forceUpdate();
        },
        isVisible: function () {
            return (this.$root as any).otherPlayersVisibility[this.player.id] === true;
        }
    },
    template: `
        <div>
            <h3 :style="'color:' + player.color" v-on:click="toggleVisible()">{{player.name}}</h3>
            <div v-show="isVisible()">
                <div class="player_home_block">
                    Cards In Hand: {{player.cardsInHandNbr}}
                </div>

                <div class="player_home_block">
                    <player-resources :player="player"></player-resources>
                </div>

                <div v-if="player.playedCards.length > 0" class="player_home_block">
                    <h4>Played Cards</h4>
                    <div>
                        <div v-for="card in player.playedCards" :key="card.name" class="cardbox">
                            <card :card="card.name" :resources="card.resources"></card>
                        </div>
                    </div>
                </div> 

                <div v-if="player.corporationCard !== undefined" class="player_home_block">
                    <card :card="player.corporationCard" :resources="player.corporationCardResources"></card>
                </div>
            </div>
        </div>
    `
});
