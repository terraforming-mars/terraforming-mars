import Vue from 'vue';
import {ActionLabel} from './ActionLabel';
import {range} from '../../utils/utils';
import {Button} from '../common/Button';
import {mainAppSettings} from '../App';
import {PlayerModel} from '../../models/PlayerModel';
import {PlayerTimer} from './PlayerTimer';

const isPinned = (root: any, playerIndex: number): boolean => {
  return (root as any).getVisibilityState('pinned_player_' + playerIndex);
};
const showPlayerData = (root: any, playerIndex: number) => {
  (root as any).setVisibilityState('pinned_player_' + playerIndex, true);
};
export const hidePlayerData = (root: typeof mainAppSettings.methods, playerIndex: number) => {
  root.setVisibilityState('pinned_player_' + playerIndex, false);
};

export const PlayerStatus = Vue.component('player-status', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    activePlayer: {
      type: Object as () => PlayerModel,
    },
    firstForGen: {
      type: Boolean,
    },
    actionLabel: {
      type: String,
    },
    playerIndex: {
      type: Number,
    },
  },
  components: {
    Button,
    PlayerTimer,
  },
  methods: {
    togglePlayerDetails: function() {
      // for active player => scroll to cards UI
      if (this.player.color === this.activePlayer.color) {
        const el: HTMLElement = document.getElementsByClassName(
          'preferences_icon--cards',
        )[0] as HTMLElement;
        el.click();

        return;
      }
      // any other player show cards container and hide all other
      this.pinPlayer();
    },
    showLabel: function(): boolean {
      return this.actionLabel !== ActionLabel.NONE;
    },
    getLabelClasses: function(): string {
      const classes: Array<string> = [];
      const baseClass = 'player-action-status';
      classes.push(baseClass);
      if (this.actionLabel === ActionLabel.PASSED) {
        classes.push(`${baseClass}--passed`);
      } else if (this.actionLabel === ActionLabel.ACTIVE) {
        classes.push(`${baseClass}--active`);
      }
      return classes.join(' ');
    },
    getPlayerNameClasses: function(): string {
      const classes: Array<string> = [];
      const baseClass = 'player-name';
      classes.push(baseClass);
      if (this.player.id === this.activePlayer.id) {
        classes.push(`${baseClass}--inactive`);
      }
      return classes.join(' ');
    },
    getNrPlayedCards: function(): number {
      return (this.player.corporationCard !== undefined ? 1 : 0) + this.player.playedCards.length;
    },
    pinPlayer: function() {
      let hiddenPlayersIndexes: Array<Number> = [];
      const playerPinned = isPinned(this.$root, this.playerIndex);

      // if player is already pinned, add to hidden players (toggle)
      hiddenPlayersIndexes = range(this.activePlayer.players.length - 1);
      if (!playerPinned) {
        showPlayerData(this.$root, this.playerIndex);
        hiddenPlayersIndexes = hiddenPlayersIndexes.filter(
          (index) => index !== this.playerIndex,
        );
      }
      for (let i = 0; i < hiddenPlayersIndexes.length; i++) {
        if (hiddenPlayersIndexes.includes(i)) {
          hidePlayerData(this.$root as unknown as typeof mainAppSettings.methods, i);
        }
      }
    },
    buttonLabel: function(): string {
      return isPinned(this.$root, this.playerIndex) ? 'hide' : 'show';
    },
  },
  template: `
        <div class="player-status">
            <div class="player-status-left">
                <div class="top-row">
                    <div class="player-view-status" />
                    <div :class="getPlayerNameClasses()" v-on:click.prevent="togglePlayerDetails()" >{{ player.name }}</div>
                    <div class="icon-first-player-offset icon-first-player" v-if="firstForGen && activePlayer.players.length > 1">1st</div>
                </div>
                <div v-if="player.corporationCard !== undefined" :title="player.corporationCard.name" class="player-corp">{{ player.corporationCard.name }}</div>
                <div v-if="showLabel()" :class="getLabelClasses()">{{ actionLabel }}</div>
            </div>
            <div class="player-status-right">
                <div class="icons-and-count">
                    <div class="played-cards-icons">
                        <div class="played-cards-arrow" />
                        <div class="played-cards-icon" />
                    </div>
                    <div class="played-cards-count">{{ getNrPlayedCards() }}</div>
                </div> 
                <Button size="tiny" :onClick="togglePlayerDetails" :title="buttonLabel()" />
            </div>
            <div class="player-status-timer" v-if="player.gameOptions.showTimers"><player-timer :timer="player.timer"/></div>
        </div>
    `,
});
