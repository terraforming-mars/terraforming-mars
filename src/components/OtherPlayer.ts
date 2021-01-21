import Vue from 'vue';

import {StackedCards} from './StackedCards';
import {PlayerMixin} from './PlayerMixin';
import {PlayerModel} from '../models/PlayerModel';
import {hidePlayerData} from './overview/PlayerStatus';
import {mainAppSettings} from './App';
import {Card} from './card/Card';

export const OtherPlayer = Vue.component('other-player', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    playerIndex: {
      type: Number,
    },
  },
  components: {
    'stacked-cards': StackedCards,
    Card,
  },
  mixins: [PlayerMixin],
  methods: {
    hideMe: function() {
      hidePlayerData(this.$root as unknown as typeof mainAppSettings.methods, this.playerIndex);
    },
    isVisible: function() {
      return (this.$root as unknown as typeof mainAppSettings.methods).getVisibilityState(
        'pinned_player_' + this.playerIndex,
      );
    },
  },
  template: `<div>
            <div v-show="isVisible()" class="other_player_cont menu">
                <Button size="big" type="close" :onClick="hideMe" :disableOnServerBusy="false" align="right" />
                <div v-if="player.playedCards.length > 0 || player.corporationCard !== undefined" class="player_home_block">
                    <span class="player_name" :class="'player_bg_color_' + player.color"> {{ player.name }} played cards </span>
                    <div>
                        <div v-if="player.corporationCard !== undefined" class="cardbox">
                            <Card :card="player.corporationCard" :actionUsed="isCardActivated(player.corporationCard, player)"/>
                        </div>
                        <div v-for="card in sortActiveCards(getCardsByType(player.playedCards, [getActiveCardType()]))" :key="card.name" class="cardbox">
                            <Card :card="card" :actionUsed="isCardActivated(card, player)"/>
                        </div>

                        <stacked-cards class="player_home_block--non_blue_cards" :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" :player="player"></stacked-cards>
                        <stacked-cards class="player_home_block--non_blue_cards" :cards="getCardsByType(player.playedCards, [getEventCardType()])" :player="player"></stacked-cards>
                    </div>
                </div>
                <div v-if="player.selfReplicatingRobotsCards.length > 0" class="player_home_block">
                    <span> Self-Replicating Robots cards </span>
                    <div>
                        <div v-for="card in getCardsByType(player.selfReplicatingRobotsCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <Card :card="card" />
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
});
