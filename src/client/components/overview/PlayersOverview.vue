<script lang="ts">
import Vue from 'vue';
import PlayerInfo from '@/client/components/overview/PlayerInfo.vue';
import OverviewSettings from '@/client/components/overview/OverviewSettings.vue';
import OtherPlayer from '@/client/components/OtherPlayer.vue';
import {ViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {ActionLabel} from '@/client/components/overview/ActionLabel';
import {Phase} from '@/Phase';
import {Color} from '@/Color';

const SHOW_NEXT_LABEL_MIN = 2;

export const playerIndex = (
  color: Color,
  players: Array<PublicPlayerModel>,
): number => {
  for (let idx = 0; idx < players.length; idx++) {
    if (players[idx].color === color) {
      return idx;
    }
  }
  return -1;
};

export default Vue.extend({
  name: 'PlayersOverview',
  props: {
    playerView: {
      type: Object as () => ViewModel,
    },
  },
  computed: {
    players(): Array<PublicPlayerModel> {
      return this.playerView.players;
    },
    thisPlayer(): PublicPlayerModel | undefined {
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
      return playerIndex(player.color, this.players) === 0;
    },
    getPlayersInOrder(): Array<PublicPlayerModel> {
      const players = this.players;
      if (this.thisPlayer === undefined) {
        return players;
      }

      let result: Array<PublicPlayerModel> = [];
      let currentPlayerOffset: number = 0;
      const currentPlayerIndex: number = playerIndex(
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

      const currentPlayerIndex: number = playerIndex(
        player.color,
        notPassedPlayers,
      );

      if (currentPlayerIndex === -1) {
        return ActionLabel.NONE;
      }

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
                    <other-player v-if="thisPlayer !== undefined && otherPlayer.id !== thisPlayer.id" :player="otherPlayer" :playerIndex="index"/>
                </div>
            </div>
            <player-info v-for="(p, index) in getPlayersInOrder()"
              :player="p"
              :key="p.id"
              :playerView="playerView"
              :firstForGen="getIsFirstForGen(p)"
              :actionLabel="getActionLabel(p)"
              :playerIndex="index"/>
            <div v-if="playerView.players.length > 1 && thisPlayer !== undefined" class="player-divider" />
            <player-info
              v-if="thisPlayer !== undefined"
              :player="thisPlayer"
              :key="thisPlayer.id"
              :playerView="playerView"
              :firstForGen="getIsFirstForGen(thisPlayer)"
              :actionLabel="getActionLabel(thisPlayer)"
              :playerIndex="-1"/>
        </div>
</template>
