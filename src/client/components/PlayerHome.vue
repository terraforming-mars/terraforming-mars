<template>
  <div id="player-home" :class="(game.turmoil ? 'with-turmoil': '')">
    <top-bar :playerView="playerView" />

    <div v-if="game.phase === 'end'">
      <div class="player_home_block">
        <DynamicTitle title="This game is over!" :color="thisPlayer.color"/>
        <a :href="'the-end?id='+ playerView.id" v-i18n>Go to game results</a>
      </div>
    </div>

    <sidebar v-trim-whitespace
      :acting_player="isPlayerActing(playerView)"
      :player_color="thisPlayer.color"
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
      :lastSoloGeneration = "game.lastSoloGeneration">
        <div class="deck-size">{{ game.deckSize }}</div>
    </sidebar>

    <div v-if="thisPlayer.tableau.length > 0">
      <div class="player_home_block">
        <a name="board" class="player_home_anchor"></a>
        <board
          :spaces="game.spaces"
          :expansions="game.gameOptions.expansions"
          :venusScaleLevel="game.venusScaleLevel"
          :boardName ="game.gameOptions.boardName"
          :oceans_count="game.oceans"
          :oxygen_level="game.oxygenLevel"
          :temperature="game.temperature"
          :altVenusBoard="game.gameOptions.altVenusBoard"
          :aresData="game.aresData"
          :tileView="tileView"
          @toggleTileView="cycleTileView()"
          id="shortkey-board"
        />

        <turmoil v-if="game.turmoil" :turmoil="game.turmoil"/>

        <MoonBoard v-if="game.gameOptions.expansions.moon" :model="game.moon" :tileView="tileView" id="shortkey-moonBoard"/>

        <PlanetaryTracks v-if="game.gameOptions.expansions.pathfinders" :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>

        <div v-if="playerView.players.length > 1" class="player_home_block--milestones-and-awards">
          <Milestones :milestones="game.milestones" />
          <Awards :awards="game.awards" />
        </div>
      </div>

      <players-overview class="player_home_block player_home_block--players nofloat" :playerView="playerView" v-trim-whitespace id="shortkey-playersoverview"/>

      <div class="player_home_block nofloat">
        <log-panel
          :id="playerView.id"
          :players="playerView.players"
          :generation="game.generation"
          :lastSoloGeneration="game.lastSoloGeneration"
          :color="thisPlayer.color"
          :step="game.step"></log-panel>
      </div>

      <div class="player_home_block player_home_block--actions nofloat">
        <a name="actions" class="player_home_anchor"></a>
        <dynamic-title title="Actions" :color="thisPlayer.color"/>
        <waiting-for v-if="game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="playerView.waitingFor"></waiting-for>
      </div>

      <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
        <dynamic-title title="Drafted cards" :color="thisPlayer.color" />
        <div v-for="card in playerView.draftedCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>

      <a name="cards" class="player_home_anchor"></a>
      <div class="player_home_block player_home_block--hand" v-if="cardsInHandCount > 0" id="shortkey-hand">
        <div class="hiding-card-button-row">
          <dynamic-title title="Cards In Hand" :color="thisPlayer.color"/>
          <div :class="getHideButtonClass('HAND')" v-on:click.prevent="toggle('HAND')">
            <div class="played-cards-count">{{cardsInHandCount.toString()}}</div>
            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('HAND')}}</div>
          </div>
          <div class="text-overview" v-i18n>[ toggle cards in hand ]</div>
        </div>
        <sortable-cards v-show="isVisible('HAND')" :playerId="playerView.id"
                        :cards="playerView.preludeCardsInHand
                                .concat(playerView.ceoCardsInHand)
                                .concat(playerView.cardsInHand)"/>
      </div>

      <div class="player_home_block player_home_block--cards">
        <div class="hiding-card-button-row">
          <dynamic-title title="Played Cards" :color="thisPlayer.color" />
          <div class="played-cards-filters">
            <div :class="getHideButtonClass('ACTIVE')" v-on:click.prevent="toggle('ACTIVE')">
              <div class="played-cards-count">{{getCardsByType(thisPlayer.tableau, [CardType.ACTIVE]).length.toString()}}</div>
              <div class="played-cards-selection" v-i18n>{{ getToggleLabel('ACTIVE')}}</div>
            </div>
            <div :class="getHideButtonClass('AUTOMATED')" v-on:click.prevent="toggle('AUTOMATED')">
              <div class="played-cards-count">{{getCardsByType(thisPlayer.tableau, [CardType.AUTOMATED, CardType.PRELUDE]).length.toString()}}</div>
              <div class="played-cards-selection" v-i18n>{{ getToggleLabel('AUTOMATED')}}</div>
            </div>
            <div :class="getHideButtonClass('EVENT')" v-on:click.prevent="toggle('EVENT')">
              <div class="played-cards-count">{{getCardsByType(thisPlayer.tableau, [CardType.EVENT]).length.toString()}}</div>
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
        <div v-show="isVisible('ACTIVE')" v-for="card in sortActiveCards(getCardsByType(thisPlayer.tableau, [CardType.ACTIVE, CardType.PRELUDE]).filter(isActive))" :key="card.name" class="cardbox">
            <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)" :cubeColor="thisPlayer.color"/>
        </div>

        <stacked-cards v-show="isVisible('AUTOMATED')" :cards="getCardsByType(thisPlayer.tableau, [CardType.AUTOMATED, CardType.PRELUDE]).filter(isNotActive)" ></stacked-cards>

        <stacked-cards v-show="isVisible('EVENT')" :cards="getCardsByType(thisPlayer.tableau, [CardType.EVENT])" ></stacked-cards>

      </div>

      <div v-if="thisPlayer.selfReplicatingRobotsCards.length > 0" class="player_home_block">
        <dynamic-title title="Self-replicating Robots cards" :color="thisPlayer.color"/>
        <div>
          <div v-for="card in thisPlayer.selfReplicatingRobotsCards" :key="card.name" class="cardbox">
            <Card :card="card"/>
          </div>
        </div>
      </div>

    </div>

    <div class="player_home_block player_home_block--setup nofloat"  v-if="thisPlayer.tableau.length === 0">
      <template v-if="isInitialDraftingPhase()">
        <div v-for="card in playerView.dealtCorporationCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>

        <div v-for="card in playerView.dealtPreludeCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>

        <div v-for="card in playerView.dealtCeoCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>

        <div v-for="card in playerView.dealtProjectCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </template>
      <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
        <dynamic-title title="Drafted Cards" :color="thisPlayer.color"/>
        <div v-for="card in playerView.draftedCards" :key="card.name" class="cardbox">
            <Card :card="card"/>
        </div>
      </div>

      <template v-if="playerView.pickedCorporationCard.length === 1">
        <dynamic-title title="Your selected cards:" :color="thisPlayer.color"/>
        <div>
          <div class="cardbox">
            <Card :card="playerView.pickedCorporationCard[0]"/>
          </div>
          <template v-if="game.gameOptions.expansions.prelude">
            <div v-for="card in playerView.preludeCardsInHand" :key="card.name" class="cardbox">
              <Card :card="card"/>
            </div>
          </template>
          <template v-if="game.gameOptions.expansions.ceo">
            <div v-for="card in playerView.ceoCardsInHand" :key="card.name" class="cardbox">
            <Card :card="card"/>
            </div>
          </template>
        </div>
        <div>
          <div v-for="card in playerView.cardsInHand" :key="card.name" class="cardbox">
            <Card :card="card"/>
          </div>
        </div>
      </template>

      <dynamic-title v-if="playerView.pickedCorporationCard.length === 0" title="Select initial cards:" :color="thisPlayer.color"/>
      <waiting-for v-if="game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="playerView.waitingFor"></waiting-for>

      <dynamic-title title="Game details" :color="thisPlayer.color"/>

      <div class="player_home_block" v-if="playerView.players.length > 1">
        <Milestones :showScores="false" :milestones="game.milestones" />
        <Awards :awards="game.awards" />
      </div>

      <div class="player_home_block player_home_block--turnorder nofloat" v-if="playerView.players.length>1">
        <dynamic-title title="Turn order" :color="thisPlayer.color"/>
        <div class="player_item" v-for="(p, idx) in playerView.players" :key="idx" v-trim-whitespace>
          <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
            <span class="player_number">{{ idx+1 }}.</span><span class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</span>
          </div>
          <div class="player_separator" v-if="idx !== playerView.players.length - 1">⟶</div>
        </div>
      </div>

      <details class="accordion board-accordion" open>
        <summary class="accordion-header">
          <div class="is-action">
            <i class="icon icon-arrow-right mr-1"></i>
            <span v-i18n>Board</span>
          </div>
        </summary>
        <div class="accordion-body">
          <board
            :spaces="game.spaces"
            :expansions="game.gameOptions.expansions"
            :venusScaleLevel="game.venusScaleLevel"
            :boardName ="game.gameOptions.boardName"
            :aresData="game.aresData"
            :altVenusBoard="game.gameOptions.altVenusBoard">
          </board>

          <turmoil v-if="game.turmoil" :turmoil="game.turmoil"></turmoil>

          <a name="moonBoard" class="player_home_anchor"></a>
          <MoonBoard v-if="game.gameOptions.expansions.moon" :model="game.moon" :tileView="tileView"></MoonBoard>
        </div>
      </details>
    </div>

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
          <colony :colony="colony" :active="colony.isActive"></colony>
        </div>
      </div>
    </div>
    <div v-if="game.spectatorId">
      <a :href="'/spectator?id=' +game.spectatorId" target="_blank" rel="noopener noreferrer" v-i18n>Spectator link</a>
    </div>
    <purge-warning :expectedPurgeTimeMs="playerView.game.expectedPurgeTimeMs"></purge-warning>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as raw_settings from '@/genfiles/settings.json';

import Board from '@/client/components/Board.vue';
import Card from '@/client/components/card/Card.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import Colony from '@/client/components/colonies/Colony.vue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import Turmoil from '@/client/components/turmoil/Turmoil.vue';
import {playerColorClass} from '@/common/utils/utils';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import SortableCards from '@/client/components/SortableCards.vue';
import TopBar from '@/client/components/TopBar.vue';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {KeyboardNavigation} from '@/client/components/KeyboardNavigation';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import {Phase} from '@/common/Phase';
import StackedCards from '@/client/components/StackedCards.vue';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {CardType} from '@/common/cards/CardType';
import {nextTileView, TileView} from './board/TileView';
import {getCardsByType, isCardActivated} from '@/client/utils/CardUtils';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';

import {CardModel} from '@/common/models/CardModel';
import {getCardOrThrow} from '../cards/ClientCardManifest';

export interface PlayerHomeModel {
  showHand: boolean;
  showActiveCards: boolean;
  showAutomatedCards: boolean;
  showEventCards: boolean;
  tileView: TileView;
}

class TerraformedAlertDialog {
  static shouldAlert = true;
}

export default Vue.extend({
  name: 'player-home',
  data(): PlayerHomeModel {
    const preferences = getPreferences();
    return {
      showHand: !preferences.hide_hand,
      showActiveCards: !preferences.hide_active_cards,
      showAutomatedCards: !preferences.hide_automated_cards,
      showEventCards: !preferences.hide_event_cards,
      tileView: 'show',
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
    },
    settings: {
      type: Object as () => typeof raw_settings,
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
    'board': Board,
    DynamicTitle,
    Card,
    'players-overview': PlayersOverview,
    'waiting-for': WaitingFor,
    Milestones,
    Awards,
    'sidebar': Sidebar,
    'colony': Colony,
    'log-panel': LogPanel,
    'turmoil': Turmoil,
    'sortable-cards': SortableCards,
    'top-bar': TopBar,
    MoonBoard,
    PlanetaryTracks,
    'stacked-cards': StackedCards,
    PurgeWarning,
  },
  methods: {
    navigatePage(event: KeyboardEvent) {
      const ids: Partial<Record<string, string>> = {
        [KeyboardNavigation.GAMEBOARD]: 'shortkey-board',
        [KeyboardNavigation.PLAYERSOVERVIEW]: 'shortkey-playersoverview',
        [KeyboardNavigation.HAND]: 'shortkey-hand',
        [KeyboardNavigation.COLONIES]: 'shortkey-colonies',
      };
      if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      const inputSource = event.target as Node;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        const id = ids[event.code];
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            event.preventDefault();
            el.scrollIntoView({block: 'center', inline: 'center', behavior: 'auto'});
          }
        }
      }
    },
    isPlayerActing(playerView: PlayerViewModel) : boolean {
      return playerView.players.length > 1 && playerView.waitingFor !== undefined;
    },
    getPlayerCssForTurnOrder: (
      player: PublicPlayerModel,
      highlightActive: boolean,
    ): string => {
      const classes = ['highlighter_box'];
      if (highlightActive) {
        if (player.needsToDraft || (player.needsToDraft === undefined && player.isActive)) {
          classes.push('player_is_active');
        }
        classes.push(playerColorClass(player.color, 'bg'));
      }
      return classes.join(' ');
    },
    getFleetsCountRange(player: PublicPlayerModel): Array<number> {
      const fleetsRange = [];
      for (let i = 0; i < player.fleetSize - player.tradesThisGeneration; i++) {
        fleetsRange.push(i);
      }
      return fleetsRange;
    },
    toggle(type: string): void {
      switch (type) {
      case 'HAND':
        this.showHand = !this.showHand;
        break;
      case 'ACTIVE':
        this.showActiveCards = !this.showActiveCards;
        break;
      case 'AUTOMATED':
        this.showAutomatedCards = !this.showAutomatedCards;
        break;
      case 'EVENT':
        this.showEventCards = !this.showEventCards;
        break;
      }
    },
    cycleTileView(): void {
      this.tileView = nextTileView(this.tileView);
    },
    isVisible(type: string): boolean {
      switch (type) {
      case 'HAND':
        return this.showHand;
      case 'ACTIVE':
        return this.showActiveCards;
      case 'AUTOMATED':
        return this.showAutomatedCards;
      case 'EVENT':
        return this.showEventCards;
      }
      return false;
    },
    isInitialDraftingPhase(): boolean {
      return (this.game.phase === Phase.INITIALDRAFTING) && this.game.gameOptions.initialDraftVariant;
    },
    getToggleLabel(hideType: string): string {
      if (hideType === 'HAND') {
        return (this.showHand ? '✔' : '');
      } else if (hideType === 'ACTIVE') {
        return (this.showActiveCards? '✔' : '');
      } else if (hideType === 'AUTOMATED') {
        return (this.showAutomatedCards ? '✔' : '');
      } else if (hideType === 'EVENT') {
        return (this.showEventCards ? '✔' : '');
      } else {
        return '';
      }
    },
    getHideButtonClass(hideType: string): string {
      const prefix = 'hiding-card-button ';
      if (hideType === 'HAND') {
        return prefix + (this.showHand ? 'hand-toggle' : 'hand-toggle-transparent');
      } else if (hideType === 'ACTIVE') {
        return prefix + (this.showActiveCards ? 'active' : 'active-transparent');
      } else if (hideType === 'AUTOMATED') {
        return prefix + (this.showAutomatedCards ? 'automated' : 'automated-transparent');
      } else if (hideType === 'EVENT') {
        return prefix + (this.showEventCards ? 'event' : 'event-transparent');
      } else {
        return '';
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
  destroyed() {
    window.removeEventListener('keydown', this.navigatePage);
  },
  mounted() {
    window.addEventListener('keydown', this.navigatePage);
    if (this.game.isTerraformed && TerraformedAlertDialog.shouldAlert && getPreferences().show_alerts) {
      alert('Mars is Terraformed!');
      // Avoids repeated calls.
      TerraformedAlertDialog.shouldAlert = false;
    }
  },
});

</script>
