<template>
  <div id="player-home" :class="(game.turmoil ? 'with-turmoil': '')">
    <TopBar :playerView="playerView" />

    <div v-if="game.phase === 'end'">
      <div class="player_home_block">
        <DynamicTitle title="This game is over!" :color="thisPlayer.color"/>
        <a :href="'the-end?id='+ playerView.id" v-i18n>Go to game results</a>
      </div>
    </div>

    <Sidebar v-trim-whitespace
      :actingPlayer="isPlayerActing(playerView)"
      :playerColor="thisPlayer.color"
      :generation="game.generation"
      :coloniesCount="game.colonies.length"
      :temperature = "game.temperature"
      :oxygen = "game.oxygenLevel"
      :oceans = "game.oceans"
      :venus = "game.venusScaleLevel"
      :turmoil = "game.turmoil"
      :moonData="game.moon"
      :gameOptions = "game.gameOptions"
      :playerNumber = "playerView.players.length"
      :isTerraformed="playerView.game.isTerraformed"
      :lastSoloGeneration = "game.lastSoloGeneration"
      :deckSize = "game.deckSize"
      :discardPileSize = "game.discardPileSize"/>

    <div v-if="thisPlayer.tableau.length > 0">
      <div class="player_home_block">
        <GameBoardView
          :game="game"
          :tileView="tileView"
          :players="playerView.players"
          @toggleTileView="cycleTileView()"
        />
      </div>

    <a class="hotkey-target"></a>
    <PlayersOverview class="player_home_block player_home_block--players nofloat" :playerView="playerView" v-trim-whitespace id="shortkey-playersoverview"/>

      <a class="hotkey-target"></a>
      <div class="player_home_block nofloat">
        <LogPanel :viewModel="playerView" :color="thisPlayer.color" :step="game.step"/>
      </div>

      <a class="hotkey-target"></a>
      <div class="player_home_block player_home_block--actions nofloat">
        <a name="actions" class="player_home_anchor"></a>
        <DynamicTitle title="Actions" :color="thisPlayer.color"/>
        <WaitingFor v-if="game.phase !== 'end'" :playerView="playerView" :waitingfor="playerView.waitingFor"/>
      </div>

      <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
        <DynamicTitle title="Drafted cards" :color="thisPlayer.color" />
        <div v-for="card in playerView.draftedCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>

      <a name="cards" class="player_home_anchor"></a>
      <div class="player_home_block player_home_block--hand" v-if="cardsInHandCount > 0" id="shortkey-hand">
        <div class="hiding-card-button-row">
          <DynamicTitle title="Cards In Hand" :color="thisPlayer.color"/>
          <div :class="getHideButtonClass('HAND')" @click.prevent="toggle('HAND')">
            <div class="played-cards-count">{{cardsInHandCount.toString()}}</div>
            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('HAND')}}</div>
          </div>
          <div class="text-overview" v-i18n>[ toggle cards in hand ]</div>
        </div>
        <SortableCards v-show="isVisible('HAND')" :playerId="playerView.id" :cards="allCardsInHand"/>
      </div>

      <div class="player_home_block player_home_block--cards">
        <div class="hiding-card-button-row">
          <DynamicTitle title="Played Cards" :color="thisPlayer.color" />
          <div class="played-cards-filters">
            <div :class="getHideButtonClass('ACTIVE')" @click.prevent="toggle('ACTIVE')">
              <div class="played-cards-count">{{ activeTableauCount }}</div>
              <div class="played-cards-selection" v-i18n>{{ getToggleLabel('ACTIVE')}}</div>
            </div>
            <div :class="getHideButtonClass('AUTOMATED')" @click.prevent="toggle('AUTOMATED')">
              <div class="played-cards-count">{{ automatedTableauCount }}</div>
              <div class="played-cards-selection" v-i18n>{{ getToggleLabel('AUTOMATED')}}</div>
            </div>
            <div :class="getHideButtonClass('EVENT')" @click.prevent="toggle('EVENT')">
              <div class="played-cards-count">{{ eventTableauCount }}</div>
              <div class="played-cards-selection" v-i18n>{{ getToggleLabel('EVENT')}}</div>
            </div>
          </div>
          <div class="text-overview" v-i18n>[ toggle cards filters ]</div>
        </div>
        <div v-for="card in getCardsByType(thisPlayer.tableau, [CardType.CORPORATION])" :key="card.name" class="cardbox">
            <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)" :cubeColor="thisPlayer.color"/>
        </div>
        <div v-for="card in getCardsByType(thisPlayer.tableau, [CardType.CEO])" :key="card.name" class="cardbox">
            <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)" :cubeColor="thisPlayer.color"/>
        </div>
        <div v-show="isVisible('ACTIVE')" v-for="card in activeTableauCards" :key="card.name" class="cardbox">
            <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)" :cubeColor="thisPlayer.color"/>
        </div>

        <StackedCards v-show="isVisible('AUTOMATED')" :cards="automatedTableauCards" />

        <StackedCards v-show="isVisible('EVENT')" :cards="eventTableauCards" />

      </div>

      <div v-if="thisPlayer.selfReplicatingRobotsCards.length > 0" class="player_home_block">
        <DynamicTitle title="Self-replicating Robots cards" :color="thisPlayer.color"/>
        <div>
          <div v-for="card in thisPlayer.selfReplicatingRobotsCards" :key="card.name" class="cardbox">
            <Card :card="card"/>
          </div>
        </div>
      </div>
    </div>

    <div v-if="thisPlayer.underworldData.tokens.length > 0">
      <DynamicTitle title="Claimed Underground Resource Tokens" :color="thisPlayer.color"/>
      <UndergroundTokens :underworldData="thisPlayer.underworldData"/>
    </div>

    <template v-if="thisPlayer.tableau.length === 0">
      <PlayerSetupView :playerView="playerView" :tileView="tileView"/>
    </template>

    <div v-if="game.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
      <a name="colonies" class="player_home_anchor hotkey-target"></a>
      <DynamicTitle title="Colonies" :color="thisPlayer.color"/>
      <div class="colonies-fleets-cont">
        <div class="colonies-player-fleets" v-for="colonyPlayer in playerView.players" :key="colonyPlayer.color">
          <div :class="'colonies-fleet colonies-fleet-'+ colonyPlayer.color" v-for="idx in getFleetsCountRange(colonyPlayer)" :key="idx"></div>
        </div>
      </div>
      <div class="player_home_colony_cont">
        <div class="player_home_colony" v-for="colony in game.colonies" :key="colony.name">
          <Colony :colony="colony" :active="colony.isActive"/>
        </div>
      </div>
    </div>

    <div v-if="game.spectatorId">
      <a :href="'/spectator?id=' +game.spectatorId" target="_blank" rel="noopener noreferrer" v-i18n>Spectator link</a>
    </div>
    <PurgeWarning :expectedPurgeTimeMs="game.expectedPurgeTimeMs"/>
    <KeyboardShortcuts v-show="keyboardShortcutOpened" @close="keyboardShortcutOpened = false"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import Card from '@/client/components/card/Card.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import Colony from '@/client/components/colonies/Colony.vue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import GameBoardView from '@/client/components/GameBoardView.vue';
import PlayerSetupView from '@/client/components/PlayerSetupView.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import SortableCards from '@/client/components/SortableCards.vue';
import TopBar from '@/client/components/TopBar.vue';
import StackedCards from '@/client/components/StackedCards.vue';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';
import UndergroundTokens from '@/client/components/underworld/UndergroundTokens.vue';
import KeyboardShortcuts from '@/client/components/KeyboardShortcuts.vue';
import {getPreferences, Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {CardType} from '@/common/cards/CardType';
import {getCardsByType, isCardActivated} from '@/client/utils/CardUtils';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';
import {CardModel} from '@/common/models/CardModel';
import {getCardOrThrow} from '../cards/ClientCardManifest';
import {HomeMixin} from '@/client/mixins/HomeMixin';

type PlayerHomeModel = {
  showHand: boolean;
  showActiveCards: boolean;
  showAutomatedCards: boolean;
  showEventCards: boolean;
}

type ToggleableCardType = 'HAND' | 'ACTIVE' | 'AUTOMATED' | 'EVENT';

const typeToDataModel: Record<ToggleableCardType, {key: keyof PlayerHomeModel, preference: keyof Preferences}> = {
  HAND: {key: 'showHand', preference: 'hide_hand'},
  ACTIVE: {key: 'showActiveCards', preference: 'hide_active_cards'},
  AUTOMATED: {key: 'showAutomatedCards', preference: 'hide_automated_cards'},
  EVENT: {key: 'showEventCards', preference: 'hide_event_cards'},
} as const;

export default defineComponent({
  name: 'PlayerHome',
  mixins: [HomeMixin],
  data(): PlayerHomeModel {
    const preferences = getPreferences();
    return {
      showHand: !preferences.hide_hand,
      showActiveCards: !preferences.hide_active_cards,
      showAutomatedCards: !preferences.hide_automated_cards,
      showEventCards: !preferences.hide_event_cards,
    };
  },
  watch: {
    showHand: function hide_hand() {
      PreferencesManager.INSTANCE.set('hide_hand', !this.showHand);
    },
    showActiveCards: function toggle_active_cards() {
      PreferencesManager.INSTANCE.set('hide_active_cards', !this.showActiveCards);
    },
    showAutomatedCards: function toggle_automated_cards() {
      PreferencesManager.INSTANCE.set('hide_automated_cards', !this.showAutomatedCards);
    },
    showEventCards: function toggle_event_cards() {
      PreferencesManager.INSTANCE.set('hide_event_cards', !this.showEventCards);
    },
  },
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
  },
  computed: {
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    game(): GameModel {
      return this.playerView.game;
    },
    CardType(): typeof CardType {
      return CardType;
    },
    cardsInHandCount(): number {
      const playerView = this.playerView;
      return playerView.cardsInHand.length + playerView.preludeCardsInHand.length + playerView.ceoCardsInHand.length;
    },
    allCardsInHand(): Array<CardModel> {
      const playerView = this.playerView;
      return playerView.preludeCardsInHand
        .concat(playerView.ceoCardsInHand)
        .concat(playerView.cardsInHand);
    },
    activeTableauCount(): number {
      return getCardsByType(this.thisPlayer.tableau, [CardType.ACTIVE]).length;
    },
    automatedTableauCount(): number {
      return getCardsByType(this.thisPlayer.tableau, [CardType.AUTOMATED, CardType.PRELUDE]).length;
    },
    eventTableauCount(): number {
      return getCardsByType(this.thisPlayer.tableau, [CardType.EVENT]).length;
    },
    activeTableauCards(): Array<CardModel> {
      const cards = getCardsByType(this.thisPlayer.tableau, [CardType.ACTIVE, CardType.PRELUDE]);
      return [...sortActiveCards(cards.filter((c) => this.isActive(c)))];
    },
    automatedTableauCards(): Array<CardModel> {
      const cards = getCardsByType(this.thisPlayer.tableau, [CardType.AUTOMATED, CardType.PRELUDE]);
      return cards.filter((c) => this.isNotActive(c));
    },
    eventTableauCards(): Array<CardModel> {
      return [...getCardsByType(this.thisPlayer.tableau, [CardType.EVENT])];
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

  components: {
    DynamicTitle,
    Card,
    PlayersOverview,
    WaitingFor,
    Sidebar,
    Colony,
    LogPanel,
    SortableCards,
    TopBar,
    GameBoardView,
    PlayerSetupView,
    StackedCards,
    PurgeWarning,
    UndergroundTokens,
    KeyboardShortcuts,
  },
  methods: {
    isPlayerActing(playerView: PlayerViewModel) : boolean {
      return playerView.players.length > 1 && playerView.waitingFor !== undefined && !playerView.waitingFor.optional;
    },
    getFleetsCountRange(player: PublicPlayerModel): Array<number> {
      const fleetsRange = [];
      for (let i = 0; i < player.fleetSize - player.tradesThisGeneration; i++) {
        fleetsRange.push(i);
      }
      return fleetsRange;
    },
    toggle(type: ToggleableCardType): void {
      this[typeToDataModel[type].key] = !this[typeToDataModel[type].key];
    },
    isVisible(type: ToggleableCardType): boolean {
      return this[typeToDataModel[type].key];
    },
    getToggleLabel(hideType: ToggleableCardType): string {
      const val = this[typeToDataModel[hideType].key];
      return val ? '✔' : '';
    },
    getHideButtonClass(hideType: ToggleableCardType): string {
      const prefix = 'hiding-card-button ';
      switch (hideType) {
      case 'HAND':
        return prefix + (this.showHand ? 'hand-toggle' : 'hand-toggle-transparent');
      case 'ACTIVE':
        return prefix + (this.showActiveCards ? 'active' : 'active-transparent');
      case 'AUTOMATED':
        return prefix + (this.showAutomatedCards ? 'automated' : 'automated-transparent');
      case 'EVENT':
        return prefix + (this.showEventCards ? 'event' : 'event-transparent');
      }
    },
    isActive(cardModel: CardModel): boolean {
      const card = getCardOrThrow(cardModel.name);
      return card.type === CardType.ACTIVE || card.hasAction;
    },
    isNotActive(cardModel: CardModel): boolean {
      return !getCardOrThrow(cardModel.name).hasAction;
    },
  },
});

</script>
