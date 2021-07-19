import Vue from 'vue';
import {PlayerInfo} from './PlayerInfo';
import {OverviewSettings} from './OverviewSettings';
import {OtherPlayer} from '../OtherPlayer';
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

export const PlayersOverview = Vue.component('players-overview', {
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
  },
  components: {
    'player-info': PlayerInfo,
    'overview-settings': OverviewSettings,
    'other-player': OtherPlayer,
  },
  data: function() {
    return {};
  },
  methods: {
    hasPlayers: function(): boolean {
      return this.playerView.players.length > 0;
    },
    getIsFirstForGen: function(player: PublicPlayerModel): boolean {
      return getCurrentPlayerIndex(player.color, this.playerView.players) === 0;
    },
    getPlayersInOrder: function(): Array<PublicPlayerModel> {
      const players = this.playerView.players;
      let result: Array<PublicPlayerModel> = [];
      let currentPlayerOffset: number = 0;
      const currentPlayerIndex: number = getCurrentPlayerIndex(
        this.playerView.me.color,
        this.playerView.players,
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
      const notPassedPlayers = this.playerView.players.filter(
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

      if (isNext && this.playerView.players.length > SHOW_NEXT_LABEL_MIN) {
        return ActionLabel.NEXT;
      }

      return ActionLabel.NONE;
    },
  },
  template: `
        <div class="players-overview" v-if="hasPlayers()">
            <overview-settings />
            <div class="other_player" v-if="playerView.players.length > 1">
                <div v-for="(otherPlayer, index) in getPlayersInOrder()" :key="otherPlayer.id">
                    <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer" :playerIndex="index"/>
                </div>
            </div>
            <player-info v-for="(p, index) in getPlayersInOrder()"
              :playerView="playerView"
              :player="p"
              :key="p.id"
              :firstForGen="getIsFirstForGen(p)"
              :actionLabel="getActionLabel(p)"
              :playerIndex="index"/>
            <div v-if="playerView.players.length > 1" class="player-divider" />
            <player-info
              :player="playerView.me"
              :playerView="playerView"
              :key="playerView.players.length - 1"
              :firstForGen="getIsFirstForGen(player)"
              :actionLabel="getActionLabel(player)"
              :playerIndex="-1"/>
        </div>
    `,
});
