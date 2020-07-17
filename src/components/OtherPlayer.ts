
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
                <button class="btn btn-lg btn-error other_player_close" v-on:click="hideMe()"><i class="icon icon-cross"></i></button> 
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

                <div v-if="player.playedCards.length > 0 || player.corporationCard !== undefined" class="player_home_block">
                    <span class="player_name" :class="'player_bg_color_' + player.color"> {{ player.name }} played cards </span>
                    <div>
                        <div v-if="player.corporationCard !== undefined" class="cardbox">
                            <card :card="player.corporationCard" :player="player"></card>
                        </div>
                        <div v-for="card in getCardsByType(player.playedCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <card :card="card" :player="player"></card>
                        </div>

                        <stacked-cards :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" :player="player"></stacked-cards>
                        <stacked-cards :cards="getCardsByType(player.playedCards, [getEventCardType()])" :player="player"></stacked-cards>
                    </div>
                </div>

                <div v-if="player.selfReplicatingRobotsCards.length > 0" class="player_home_block">
                    <span> Self-Replicating Robots cards </span>
                    <div>
                        <div v-for="card in getCardsByType(player.selfReplicatingRobotsCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <card :card="card" :player="player"></card>
                        </div>
                    </div>
                </div>                

            </div>
        </div>
    `
});
