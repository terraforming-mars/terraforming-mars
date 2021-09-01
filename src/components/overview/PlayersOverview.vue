<script lang="ts">
import Vue from 'vue';
import PlayerInfo from './PlayerInfo.vue';
import OverviewSettings from './OverviewSettings.vue';
import OtherPlayer from '../OtherPlayer.vue';
import {PlayerViewModel, PublicPlayerModel} from '../../models/PlayerModel';
import {ActionLabel} from './ActionLabel';
import {Phase} from '../../Phase';
import {Color} from '../../Color';

const SHOW_NEXT_LABEL_MIN = 2;

export const getCurrentPlayerIndex = (
  currentPlayerColor: Color,
  players: Array<PublicPlayerModel>,
): number => {
  let currentPlayerIndex: number = 0;
  players.forEach((p: PublicPlayerModel, index: number) => {
    if (p.color === currentPlayerColor) {
      currentPlayerIndex = index;
    }
  });
  return currentPlayerIndex;
};

export default Vue.extend({
  name: 'PlayersOverview',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
  },
  computed: {
    players(): Array<PublicPlayerModel> {
      return this.playerView.players;
    },
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
  },
  components: {
    'player-info': PlayerInfo,
    'overview-settings': OverviewSettings,
    'other-player': OtherPlayer,
  },
  data() {
    return {};
  },
  methods: {
    hasPlayers(): boolean {
      return this.players.length > 0;
    },
    getIsFirstForGen(player: PublicPlayerModel): boolean {
      return getCurrentPlayerIndex(player.color, this.players) === 0;
    },
    getPlayersInOrder(): Array<PublicPlayerModel> {
      const players = this.players;
      let result: Array<PublicPlayerModel> = [];
      let currentPlayerOffset: number = 0;
      const currentPlayerIndex: number = getCurrentPlayerIndex(
        this.thisPlayer.color,
        this.players,
      );

      // shift the array by putting the player on focus at the tail
      currentPlayerOffset = currentPlayerIndex + 1;
      result = players
        .slice(currentPlayerOffset)
        .concat(players.slice(0, currentPlayerOffset));
      // return all but the focused user
      return result.slice(0, -1);
    },
    getActionLabel(player: PublicPlayerModel): string {
      if (this.playerView.game.phase === Phase.DRAFTING) {
        if (player.needsToDraft) {
          return ActionLabel.DRAFTING;
        } else {
          return ActionLabel.NONE;
        }
      } else if (this.playerView.game.phase === Phase.RESEARCH) {
        if (player.needsToResearch) {
          return ActionLabel.RESEARCHING;
        } else {
          return ActionLabel.NONE;
        }
      }
      if (this.playerView.game.passedPlayers.includes(player.color)) {
        return ActionLabel.PASSED;
      }
      if (player.isActive) return ActionLabel.ACTIVE;
      const notPassedPlayers = this.players.filter(
        (p: PublicPlayerModel) => !this.playerView.game.passedPlayers.includes(p.color),
      );

      const currentPlayerIndex: number = getCurrentPlayerIndex(
        player.color,
        notPassedPlayers,
      );
      const prevPlayerIndex =
                currentPlayerIndex === 0 ?
                  notPassedPlayers.length - 1 :
                  currentPlayerIndex - 1;
      const isNext = notPassedPlayers[prevPlayerIndex].isActive;

      if (isNext && this.players.length > SHOW_NEXT_LABEL_MIN) {
        return ActionLabel.NEXT;
      }

      return ActionLabel.NONE;
    },
  },
});
</script>

<template>
        <div class="players-overview" v-if="hasPlayers()">
            <overview-settings />
            <div class="other_player" v-if="players.length > 1">
                <div v-for="(otherPlayer, index) in getPlayersInOrder()" :key="otherPlayer.id">
                    <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer" :playerIndex="index"/>
                </div>
            </div>
            <player-info v-for="(p, index) in getPlayersInOrder()"
              :player="p"
              :key="p.id"
              :playerView="player"
              :firstForGen="getIsFirstForGen(p)"
              :actionLabel="getActionLabel(p)"
              :playerIndex="index"/>
            <div v-if="player.players.length > 1" class="player-divider" />
            <player-info
              :player="thisPlayer"
              :key="thisPlayer.id"
              :playerView="player"
              :firstForGen="getIsFirstForGen(thisPlayer)"
              :actionLabel="getActionLabel(thisPlayer)"
              :playerIndex="-1"/>
        </div>
</template>
