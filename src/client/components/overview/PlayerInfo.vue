<script lang="ts">
import Vue from 'vue';
import {ViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import PlayerResources from '@/client/components/overview/PlayerResources.vue';
import PlayerTags from '@/client/components/overview/PlayerTags.vue';
import PlayerStatus from '@/client/components/overview/PlayerStatus.vue';
import {playerColorClass} from '@/utils/utils';
import {mainAppSettings} from '@/client/components/App';
import {range} from '@/utils/utils';
import {PlayerMixin} from '@/client/mixins/PlayerMixin';
import Button from '@/client/components/common/Button.vue';

const isPinned = (root: any, playerIndex: number): boolean => {
  return (root as any).getVisibilityState('pinned_player_' + playerIndex);
};
const showPlayerData = (root: any, playerIndex: number) => {
  (root as any).setVisibilityState('pinned_player_' + playerIndex, true);
};
export default Vue.extend({
  name: 'PlayerInfo',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
    },
    playerView: {
      type: Object as () => ViewModel,
    },
    firstForGen: {
      type: Boolean,
      default: false,
    },
    actionLabel: {
      type: String,
      default: '',
    },
    playerIndex: {
      type: Number,
    },
    hideZeroTags: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Button,
    PlayerResources,
    PlayerTags,
    'player-status': PlayerStatus,
  },
  mixins: [PlayerMixin],
  methods: {
    getClasses(): string {
      const classes = ['player-info'];
      classes.push(playerColorClass(this.player.color, 'bg_transparent'));
      return classes.join(' ');
    },
    getPlayerStatusAndResClasses(): string {
      const classes = ['player-status-and-res'];
      return classes.join(' ');
    },
    pinPlayer() {
      let hiddenPlayersIndexes: Array<Number> = [];
      const playerPinned = isPinned(this.$root, this.playerIndex);

      // if player is already pinned, add to hidden players (toggle)
      hiddenPlayersIndexes = range(this.playerView.players.length - 1);
      if (!playerPinned) {
        showPlayerData(this.$root, this.playerIndex);
        hiddenPlayersIndexes = hiddenPlayersIndexes.filter(
          (index) => index !== this.playerIndex,
        );
      }
      for (let i = 0; i < hiddenPlayersIndexes.length; i++) {
        if (hiddenPlayersIndexes.includes(i)) {
          // TODO find a better way to share methods with this.$root for type safety
          (this.$root as unknown as typeof mainAppSettings.methods).setVisibilityState('pinned_player_' + i, false);
        }
      }
    },
    buttonLabel(): string {
      return isPinned(this.$root, this.playerIndex) ? 'hide' : 'show';
    },
    togglePlayerDetails() {
      // for the player viewing this page => scroll to cards UI
      if (this.player.color === this.playerView.thisPlayer?.color) {
        const el: HTMLElement = document.getElementsByClassName(
          'sidebar_icon--cards',
        )[0] as HTMLElement;
        el.click();

        return;
      }
      // any other player show cards container and hide all other
      this.pinPlayer();
    },
    getNrPlayedCards(): number {
      return this.player.playedCards.length;
    },
    getAvailableBlueActionCount(): number {
      return this.player.availableBlueCardActionCount;
    },
  },
});
</script>

<template>
      <div :class="getClasses()">
        <div :class="getPlayerStatusAndResClasses()">
        <div class="player-status">
          <div class="player-info-details">
            <div class="player-info-name">{{ player.name }}</div>
            <div class="icon-first-player" v-if="firstForGen && playerView.players.length > 1">1st</div>
            <div class="player-info-corp" v-if="player.corporationCard !== undefined" :title="player.corporationCard.name">{{ player.corporationCard.name }}</div>
          </div>
          <player-status :timer="player.timer" :showTimers="playerView.game.gameOptions.showTimers" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel" />
        </div>
          <PlayerResources :player="player" v-trim-whitespace />
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
            <Button class="played-cards-button" size="tiny" @click="togglePlayerDetails" :title="buttonLabel()" />
          </div>
          <div class="tag-display player-board-blue-action-counter tooltip tooltip-top" data-tooltip="The number of available actions on active cards">
            <div class="tag-count tag-action-card">
              <div class="blue-stripe"></div>
              <div class="red-arrow"></div>
            </div>
            <span class="tag-count-display">{{ getAvailableBlueActionCount() }}</span>
          </div>
        </div>
        <PlayerTags :player="player" :playerView="playerView" :hideZeroTags="hideZeroTags" />
      </div>
</template>
