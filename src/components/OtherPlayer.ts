
import Vue from "vue";

import { PlayerResources } from "./PlayerResources";

import { StackedCards } from './StackedCards';
import { PlayerMixin } from "./PlayerMixin";
import { TagCount } from './TagCount';


export const OtherPlayer = Vue.component("other-player", {
    props: ["player"],
    components: {
        "player-resources": PlayerResources,
        "stacked-cards": StackedCards,
        "tag-count": TagCount
    },
    mixins: [PlayerMixin],
    methods: {
        hideMe: function () {
            (this.$root as any).setVisibilityState("other_player_"+this.player.id, false);
        },
        isVisible: function () {
            return (this.$root as any).getVisibilityState("other_player_"+this.player.id);
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

                <div class="tag-display tags_item_cont tag-display-tags" v-if="player.tags.length > 0">
                    <div v-for="tag in player.tags">
                        <tag-count v-if="tag.count > 0" :tag="tag.tag" :count="tag.count"> </tag-count>
                    </div>
                </div>

                <div v-if="player.showOtherPlayersVP" class="tag-display tags_item_cont" :class="player.tags.length > 0 ? 'tag-display-vp': ''">
                    <div>
                        <div class="tag-display">
                            <div class="tag-count icon-vp"></div>
                            <span class="tag-count-display">{{player.victoryPointsBreakdown.total}}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="nofloat"></div>

                <div class="player_home_block">
                    <player-resources :player="player"></player-resources>
                </div>

                <div v-if="player.playedCards.length > 0 || player.corporationCard !== undefined" class="player_home_block">
                    <h4>Played Cards</h4>
                    <div>
                        <div v-if="player.corporationCard !== undefined" class="cardbox">
                            <card :card="player.corporationCard" :resources="player.corporationCardResources"></card>
                        </div>
                        <div v-for="card in getCardsByType(player.playedCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <card :card="card.name" :resources="card.resources" :player="player"></card>
                        </div>

                        <stacked-cards :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>


                    </div>
                </div> 


            </div>
        </div>
    `
});
