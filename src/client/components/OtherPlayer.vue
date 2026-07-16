<template>
  <div v-show="isVisible()">
    <div :class="'player_translucent_bg_color_' + player.color" class="other_player_header">
      <div class="player_name">{{ player.name }} <span v-i18n>played cards</span></div>
      <AppButton size="big" type="close" @click="hideMe" :disableOnServerBusy="false" align="right" />
    </div>
    <div class="other_player_cont menu">
        <div v-if="player.tableau.length > 0" class="player_home_block">
            <div>
                <div v-for="card in getCardsByType(player.tableau, [CardType.CORPORATION])" :key="card.name" class="cardbox">
                    <Card :card="card" :actionUsed="isCardActivated(card, player)" :cubeColor="player.color"/>
                </div>
                <div v-for="card in getCardsByType(player.tableau, [CardType.CEO])" :key="card.name" class="cardbox">
                    <Card :card="card" :actionUsed="isCardActivated(card, player)" :cubeColor="player.color"/>
                </div>

                <div v-for="card in sortActiveCards(getCardsByType(player.tableau, [CardType.ACTIVE]))" :key="card.name" class="cardbox">
                    <Card :card="card" :actionUsed="isCardActivated(card, player)" :cubeColor="player.color"/>
                </div>
                <stacked-cards :cards="getCardsByType(player.tableau, [CardType.AUTOMATED, CardType.PRELUDE])" :player="player"></stacked-cards>
                <stacked-cards :cards="getCardsByType(player.tableau, [CardType.EVENT])" :player="player"></stacked-cards>
            </div>
        </div>
        <div v-if="player.selfReplicatingRobotsCards.length > 0" class="player_home_block">
            <span v-i18n>Self-replicating Robots cards</span>
            <div>
                <div v-for="card in player.selfReplicatingRobotsCards" :key="card.name" class="cardbox">
                    <Card :card="card" />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

import StackedCards from '@/client/components/StackedCards.vue';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {vueRoot} from '@/client/components/vueRoot';
import Card from '@/client/components/card/Card.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {CardType} from '@/common/cards/CardType';
import {getCardsByType, isCardActivated} from '@/client/utils/CardUtils';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';

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
    AppButton,
    'stacked-cards': StackedCards,
    Card,
  },
  methods: {
    hideMe() {
      vueRoot(this).setVisibilityState('pinned_player_' + this.playerIndex, false);
    },
    isVisible() {
      return vueRoot(this).getVisibilityState(
        'pinned_player_' + this.playerIndex,
      );
    },
  },
  computed: {
    CardType(): typeof CardType {
      return CardType;
    },
    getCardsByType(): typeof getCardsByType {
      return getCardsByType;
    },
    isCardActivated(): typeof isCardActivated {
      return isCardActivated;
    },
    sortActiveCards(): typeof sortActiveCards {
      return sortActiveCards;
    },
  },
});
</script>
