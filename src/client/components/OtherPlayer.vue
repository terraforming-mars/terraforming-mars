<script lang="ts">

import Vue from 'vue';

import StackedCards from '@/client/components/StackedCards.vue';
import {PlayerMixin} from '@/client/mixins/PlayerMixin';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {mainAppSettings} from '@/client/components/App';
import Card from '@/client/components/card/Card.vue';
import Button from '@/client/components/common/Button.vue';

export default Vue.extend({
  name: 'OtherPlayer',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
    },
    playerIndex: {
      type: Number,
    },
  },
  components: {
    Button,
    'stacked-cards': StackedCards,
    Card,
  },
  methods: {
    ...PlayerMixin.methods,
    hideMe() {
      // TODO find a better way to share methods with this.$root for type safety
      (this.$root as unknown as typeof mainAppSettings.methods).setVisibilityState('pinned_player_' + this.playerIndex, false);
    },
    isVisible() {
      return (this.$root as unknown as typeof mainAppSettings.methods).getVisibilityState(
        'pinned_player_' + this.playerIndex,
      );
    },
  },
});
</script>
<template>
  <div v-show="isVisible()" class="other_player_cont menu">
      <Button size="big" type="close" @click="hideMe" :disableOnServerBusy="false" align="right" />
      <div v-if="player.playedCards.length > 0 || player.corporationCard !== undefined" class="player_home_block">
          <span class="player_name" :class="'player_bg_color_' + player.color"> {{ player.name }} played cards </span>
          <div>
              <div v-if="player.corporationCard !== undefined" class="cardbox">
                  <Card :card="player.corporationCard" :actionUsed="isCardActivated(player.corporationCard, player)"/>
              </div>
              <div v-for="card in sortActiveCards(getCardsByType(player.playedCards, [getActiveCardType()]))" :key="card.name" class="cardbox">
                  <Card :card="card" :actionUsed="isCardActivated(card, player)"/>
              </div>
              <stacked-cards :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" :player="player"></stacked-cards>
              <stacked-cards :cards="getCardsByType(player.playedCards, [getEventCardType()])" :player="player"></stacked-cards>
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
</template>
