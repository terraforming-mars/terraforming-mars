<template>
      <div :class="getClasses()">
        <div class="player-status-and-res">
        <div class="player-status">
          <div class="player-info-details">
            <div class="player-info-name" @click="togglePlayerDetails">{{ playerSymbol + player.name }}</div>
            <span @click="togglePlayerDetails" v-for="(corporationName, index) in getCorporationName()" :key="index" v-i18n>
              <div class="player-info-corp" :title="$t(corporationName)">
                {{ corporationName }}
              </div>
            </span>
          </div>
          <div>
            <div class="icon-first-player" v-if="firstForGen && playerView.players.length > 1" v-i18n>1st</div>
            <player-status :timer="player.timer" :showTimer="playerView.game.gameOptions.showTimers" :liveTimer="playerView.game.phase !== Phase.END" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel"/>
          </div>
        </div>
          <PlayerResources :player="player" v-trim-whitespace />
          <div class="player-played-cards">
            <div class="player-played-cards-top">
              <div class="played-cards-elements">
                <div class="played-cards-icon hiding-card-button active"></div>
                <div class="played-cards-icon hiding-card-button automated"></div>
                <div class="played-cards-icon hiding-card-button event"></div>
                <div class="played-cards-count">{{numberOfPlayedCards()}}</div>
              </div>
            </div>
            <AppButton class="played-cards-button" size="tiny" @click="togglePlayerDetails" :title="buttonLabel()" />
          </div>
          <div class="tag-display player-board-blue-action-counter" :class="tooltipCss" :data-tooltip="$t('The number of available actions on active cards')">
            <div class="tag-count tag-action-card">
              <div class="blue-stripe"></div>
              <div class="red-arrow"></div>
            </div>
            <span class="tag-count-display">{{ availableBlueActionCount() }}</span>
          </div>
        </div>
        <PlayerTags :player="player" :playerView="playerView" :hideZeroTags="hideZeroTags" :isTopBar="isTopBar" />
        <PlayerAlliedParty :player="player"/>
      </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import PlayerResources from '@/client/components/overview/PlayerResources.vue';
import PlayerTags from '@/client/components/overview/PlayerTags.vue';
import PlayerAlliedParty from '@/client/components/overview/PlayerAlliedParty.vue';
import PlayerStatus from '@/client/components/overview/PlayerStatus.vue';
import {playerColorClass} from '@/common/utils/utils';
import {vueRoot} from '@/client/components/vueRoot';
import {range} from '@/common/utils/utils';
import AppButton from '@/client/components/common/AppButton.vue';
import {CardType} from '@/common/cards/CardType';
import {getCard} from '@/client/cards/ClientCardManifest';
import {Phase} from '@/common/Phase';
import {ActionLabel} from './ActionLabel';
import {playerSymbol} from '@/client/utils/playerSymbol';

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
      type: String as () => ActionLabel,
      default: '',
    },
    playerIndex: {
      type: Number,
    },
    hideZeroTags: {
      type: Boolean,
      default: false,
    },
    isTopBar: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AppButton,
    PlayerResources,
    PlayerTags,
    PlayerAlliedParty,
    'player-status': PlayerStatus,
  },
  computed: {
    tooltipCss(): string {
      return 'tooltip tooltip-' + (this.isTopBar ? 'bottom' : 'top');
    },
    playerSymbol(): string {
      return playerSymbol(this.player.color, ' ');
    },
    Phase(): typeof Phase {
      return Phase;
    },
  },
  methods: {
    isPinned(playerIndex: number): boolean {
      return vueRoot(this).getVisibilityState('pinned_player_' + playerIndex);
    },
    pin(playerIndex: number) {
      return vueRoot(this).setVisibilityState('pinned_player_' + playerIndex, true);
    },
    unpin(playerIndex: number) {
      return vueRoot(this).setVisibilityState('pinned_player_' + playerIndex, false);
    },
    pinPlayer() {
      let hiddenPlayersIndexes = [];
      const playerPinned = this.isPinned(this.playerIndex);

      // if player is already pinned, add to hidden players (toggle)
      hiddenPlayersIndexes = range(this.playerView.players.length - 1);
      if (!playerPinned) {
        this.pin(this.playerIndex);
        hiddenPlayersIndexes = hiddenPlayersIndexes.filter(
          (index) => index !== this.playerIndex,
        );
      }
      for (let i = 0; i < hiddenPlayersIndexes.length; i++) {
        if (hiddenPlayersIndexes.includes(i)) {
          this.unpin(i);
        }
      }
    },
    buttonLabel(): string {
      return this.isPinned(this.playerIndex) ? 'hide' : 'show';
    },
    togglePlayerDetails() {
      // for the player viewing this page => scroll to cards UI
      if (this.player.color === this.playerView.thisPlayer?.color) {
        const el = document.getElementsByClassName(
          'sidebar_icon--cards',
        )[0] as HTMLElement;
        el.click();

        return;
      }
      // any other player show cards container and hide all other
      this.pinPlayer();
    },
    getClasses(): string {
      return `player-info ${playerColorClass(this.player.color, 'bg_transparent')}`;
    },
    numberOfPlayedCards(): number {
      return this.player.tableau.length;
    },
    availableBlueActionCount(): number {
      return this.player.availableBlueCardActionCount;
    },
    getCorporationName(): string[] {
      const cards = this.player.tableau;
      const corporationCards = cards
        .filter((card) => getCard(card.name)?.type === CardType.CORPORATION)
        .map((card) => card.name);
      return corporationCards.length === 0 ? [''] : corporationCards;
    },
  },
});
</script>
