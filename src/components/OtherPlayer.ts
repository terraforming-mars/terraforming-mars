
import Vue from "vue";

import { PlayerResources } from "./PlayerResources";
import { CardType } from '../cards/CardType';
import { StackedCards } from './StackedCards';
import { PlayerMixin } from "./PlayerMixin";

export const OtherPlayer = Vue.component("other-player", {
    props: ["player"],
    components: {
        "player-resources": PlayerResources,
        "stacked-cards": StackedCards
    },
    mixins: [PlayerMixin],
    methods: {
        hideMe: function () {
            (this.$root as any).setOtherPlayerVisibility(this.player.id, false);
        },
        isVisible: function () {
            return (this.$root as any).getOtherPlayerVisibility(this.player.id);
        },
        getEventCount: function() {
            let count: number = 0;
            for (let index = 0; index < this.player.playedCards.length; index++) {
                if (this.player.playedCards[index].cardType === CardType.EVENT) {
                    count++;
                } 
            }
            return count;
        }
    },
    template: `
        <div> 
            <div v-show="isVisible()" class="other_player_cont menu">
                <button class="btn btn-sm btn-error other_player_close" v-on:click="hideMe()"><i class="icon icon-cross"></i></button>
                
                <h4>Player «{{ player.name }}» details</h4>
                
                <div class="player_home_block">
                    Cards In Hand: {{player.cardsInHandNbr}} - Event cards played: {{ getEventCount() }}
                </div>

                <div class="player_home_block">
                    <player-resources :player="player"></player-resources>
                </div>

                <div v-if="player.playedCards.length > 0 || player.corporationCard !== undefined" class="player_home_block">
                    <h4>Played Cards</h4>
                    <div>
                        <div v-if="player.corporationCard !== undefined" class="cardbox">
                            <card :card="player.corporationCard" :resources="player.corporationCardResources"></card>
                        </div>
                        <div v-for="card in getCardsByType(player.playedCards, ['blue'])" :key="card.name" class="cardbox">
                            <card :card="card.name" :resources="card.resources"></card>
                        </div>

                        <stacked-cards :cards="getCardsByType(player.playedCards, ['green', 'pink'])" ></stacked-cards>

                    </div>
                </div> 


            </div>
        </div>
    `
});
