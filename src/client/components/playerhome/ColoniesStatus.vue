<template>
  <div v-if="game.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
    <a name="colonies" class="player_home_anchor"></a>
    <dynamic-title title="Colonies" :color="thisPlayer.color"/>
    <div class="colonies-fleets-cont">
      <div class="colonies-player-fleets" v-for="colonyPlayer in playerView.players" :key="colonyPlayer.color">
        <div :class="'colonies-fleet colonies-fleet-'+ colonyPlayer.color" v-for="idx in getFleetsCountRange(colonyPlayer)" :key="idx"></div>
      </div>
    </div>
    <div class="player_home_colony_cont">
      <div class="player_home_colony" v-for="colony in game.colonies" :key="colony.name">
        <colony :colony="colony"></colony>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Colony from '@/client/components/colonies/Colony.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';

export default Vue.extend({
  name: 'colonies-status',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
  },
  computed: {
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    game(): GameModel {
      return this.playerView.game;
    },
    cardsInHandCount(): number {
      const playerView = this.playerView;
      return playerView.cardsInHand.length + playerView.preludeCardsInHand.length + playerView.ceoCardsInHand.length;
    },
  },

  components: {
    DynamicTitle,
    Colony,
  },
  methods: {
    getFleetsCountRange(player: PublicPlayerModel): Array<number> {
      const fleetsRange: Array<number> = [];
      for (let i = 0; i < player.fleetSize - player.tradesThisGeneration; i++) {
        fleetsRange.push(i);
      }
      return fleetsRange;
    },
  },
});

</script>
