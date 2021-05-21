import Vue from 'vue';
import {PlayerModel} from '../../models/PlayerModel';
import {PlayerResources} from './PlayerResources';
import {PlayerTags} from './PlayerTags';
import {PlayerStatus} from './PlayerStatus';
import {playerColorClass} from '../../utils/utils';
import {mainAppSettings} from '../App';
import {range} from '../../utils/utils';
import {PlayerMixin} from '../PlayerMixin';

const isPinned = (root: any, playerIndex: number): boolean => {
  return (root as any).getVisibilityState('pinned_player_' + playerIndex);
};
const showPlayerData = (root: any, playerIndex: number) => {
  (root as any).setVisibilityState('pinned_player_' + playerIndex, true);
};
export const hidePlayerData = (root: typeof mainAppSettings.methods, playerIndex: number) => {
  root.setVisibilityState('pinned_player_' + playerIndex, false);
};
export const PlayerInfo = Vue.component('player-info', {
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
    hideZeroTags: {
      type: Boolean,
    },
  },
  components: {
    'player-resources': PlayerResources,
    'player-tags': PlayerTags,
    'player-status': PlayerStatus,
  },
  mixins: [PlayerMixin],
  methods: {
    getClasses: function(): string {
      const classes = ['player-info'];
      classes.push(playerColorClass(this.player.color, 'bg_transparent'));
      return classes.join(' ');
    },
    getPlayerStatusAndResClasses: function(): string {
      const classes = ['player-status-and-res'];
      return classes.join(' ');
    },
    getIsActivePlayer: function(): boolean {
      return this.player.color === this.activePlayer.color;
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
    togglePlayerDetails: function() {
      // for active player => scroll to cards UI
      if (this.player.color === this.activePlayer.color) {
        const el: HTMLElement = document.getElementsByClassName(
          'sidebar_icon--cards',
        )[0] as HTMLElement;
        el.click();

        return;
      }
      // any other player show cards container and hide all other
      this.pinPlayer();
    },
    getNrPlayedCards: function(): number {
      return this.player.playedCards.length;
    },
    getAvailableBlueActionCount: function(): number {
      return this.player.availableBlueCardActionCount;
    },
  },
  template: `
      <div :class="getClasses()">
        <div :class="getPlayerStatusAndResClasses()">
        <div class="player-status">
          <div class="player-info-details">
            <div class="player-info-name">{{ player.name }}</div>
            <div class="icon-first-player" v-if="firstForGen && activePlayer.players.length > 1">1st</div>
            <div class="player-info-corp" v-if="player.corporationCard !== undefined" :title="player.corporationCard.name">{{ player.corporationCard.name }}</div>
          </div>
          <player-status :player="player" :activePlayer="activePlayer" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel" :playerIndex="playerIndex"/>
        </div>
          <player-resources :player="player" v-trim-whitespace />
          <div class="player-played-cards">
            <div class="player-played-cards-top">
              <div class="played-cards-elements">
                <div class="played-cards-icon hiding-card-button active"></div>
                <div class="played-cards-icon hiding-card-button automated"></div>
                <div class="played-cards-icon hiding-card-button event"></div>
                <div class="played-cards-count">
                  {{
                    getNrPlayedCards()
                  }}
                </div>
              </div>
            </div>
            <Button class="played-cards-button" size="tiny" :onClick="togglePlayerDetails" :title="buttonLabel()" />
          </div>
          <div class="tag-display player-board-blue-action-counter tooltip tooltip-top" data-tooltip="The number of available actions on active cards">
            <div class="tag-count tag-action-card">
              <div class="blue-stripe"></div>
              <div class="red-arrow"></div>
            </div>
            <span class="tag-count-display">{{ getAvailableBlueActionCount() }}</span>
          </div>
        </div>
        <player-tags :player="player" v-trim-whitespace :isActivePlayer="getIsActivePlayer()" :hideZeroTags="hideZeroTags" />
      </div>
    `,
});
