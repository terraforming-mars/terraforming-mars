
import Vue from "vue";

import { PlayerResources } from "./PlayerResources";

export const OtherPlayer = Vue.component("other-player", {
    props: ["player"],
    components: {
        "player-resources": PlayerResources
    },
    methods: {
        hideMe: function () {
            (this.$root as any).setOtherPlayerVisibility(this.player.id, false);
        },
        isVisible: function () {
            return (this.$root as any).getOtherPlayerVisibility(this.player.id);
        }
    },
    template: `
        <div> 
            <div v-show="isVisible()" class="other_player_cont menu">
                <button class="btn btn-sm btn-error other_player_close" v-on:click="hideMe()"><i class="icon icon-cross"></i></button>
                
                <h4>Player «{{ player.name }}» details</h4>
                
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
