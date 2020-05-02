
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
        },
        toggleVisible: function() {
            (this.$root as any).setVisibilityState("other_player_"+this.player.id,  !(this.isVisible()));
        },
        buttonTitle: function() {
            return ( this.isVisible() ? "Hide Cards" : "Show Cards" )
        }
    },
    template: `
        <div> 
            <div class="other_player_cont menu">
                <button class="btn btn-lg btn-error other_player_close" v-on:click="toggleVisible()"> {{buttonTitle()}}  </button> 
                <div class="player_home_block">
                    <span class="player_name" :class="'player_bg_color_' + player.color"> {{ player.name }} : {{player.cardsInHandNbr}} cards in hand </span>
                </div>

                <div class="tag-display tags_item_cont tag-display-tags" v-if="player.tags.length > 0">
                    <div v-for="tag in player.tags">
                        <tag-count v-if="tag.count > 0" :tag="tag.tag" :count="tag.count"> </tag-count>
                    </div>
                </div>

                <div v-if="player.showOtherPlayersVP" class="tag-display tags_item_cont" :class="player.tags.length > 0 ? 'tag-display-vp': ''">
                    <div>
                        <div class="tag-display">
                            <div class="tag-count icon-vp">{{player.victoryPointsBreakdown.total}}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="nofloat"></div>

                <div class="player_home_block">
                    <player-resources :player="player"></player-resources>
                </div>

                <div v-show="isVisible()" v-if="player.playedCards.length > 0 || player.corporationCard !== undefined" class="player_home_block">
                    <span class="player_name" :class="'player_bg_color_' + player.color"> {{ player.name }} played cards </span>
                    <div>
                        <div v-if="player.corporationCard !== undefined" class="cardbox">
                            <card :card="player.corporationCard" :resources="player.corporationCardResources"></card>
                        </div>
                        <div v-for="card in getCardsByType(player.playedCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <card :card="card.name" :resources="card.resources" :player="player"></card>
                        </div>

                        <stacked-cards :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>
                        <stacked-cards :cards="getCardsByType(player.playedCards, [getEventCardType()])" ></stacked-cards>                    


                    </div>
                </div> 


            </div>
        </div>
    `
});
