import Vue from 'vue';

import Board from './Board.vue';
import {Card} from './card/Card';
import Milestone from './Milestone.vue';
import Award from './Award.vue';
import {PlayersOverview} from './overview/PlayersOverview';
import WaitingFor from './WaitingFor.vue';
import Sidebar from './Sidebar.vue';
import {PlayerViewModel, PublicPlayerModel} from '../models/PlayerModel';
import Colony from './Colony.vue';
import LogPanel from './LogPanel.vue';
import {PlayerMixin} from './PlayerMixin';
import Turmoil from './Turmoil.vue';
import {playerColorClass} from '../utils/utils';
import {DynamicTitle} from './common/DynamicTitle';
import Button from './common/Button.vue';
import {SortableCards} from './SortableCards';
import TopBar from './TopBar.vue';
import {PreferencesManager} from './PreferencesManager';
import {KeyboardNavigation} from '../../src/KeyboardNavigation';
import MoonBoard from './moon/MoonBoard.vue';
import {Phase} from '../../src/Phase';
import StackedCards from './StackedCards.vue';

import * as raw_settings from '../genfiles/settings.json';

export interface PlayerHomeModel {
  showActiveCards: boolean;
  showAutomatedCards: boolean;
  showEventCards: boolean;
}

class TerraformedAlertDialog {
  static shouldAlert = true;
}

export const PlayerHome = Vue.component('player-home', {
  data: function(): PlayerHomeModel {
    return {
      showActiveCards: !PreferencesManager.loadBoolean('hide_active_cards'),
      showAutomatedCards: !PreferencesManager.loadBoolean('hide_automated_cards'),
      showEventCards: !PreferencesManager.loadBoolean('hide_event_cards'),
    };
  },
  watch: {
    hide_active_cards: function() {
      PreferencesManager.save('hide_active_cards', !this.showActiveCards);
    },
    hide_automated_cards: function() {
      PreferencesManager.save('hide_automated_cards', !this.showAutomatedCards);
    },
    hide_event_cards: function() {
      PreferencesManager.save('hide_event_cards', !this.showEventCards);
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
  components: {
    'board': Board,
    'dynamic-title': DynamicTitle,
    Card,
    'players-overview': PlayersOverview,
    'waiting-for': WaitingFor,
    Milestone,
    Award,
    'sidebar': Sidebar,
    'colony': Colony,
    'log-panel': LogPanel,
    'turmoil': Turmoil,
    Button,
    'sortable-cards': SortableCards,
    'top-bar': TopBar,
    MoonBoard,
    'stacked-cards': StackedCards,
  },
  mixins: [PlayerMixin],
  methods: {
    navigatePage: function(event: KeyboardEvent) {
      const inputSource = event.target as Element;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        let idSuffix: string | undefined = undefined;
        switch (event.code) {
        case KeyboardNavigation.GAMEBOARD:
          idSuffix = 'board';
          break;
        case KeyboardNavigation.PLAYERSOVERVIEW:
          idSuffix = 'playersoverview';
          break;
        case KeyboardNavigation.HAND:
          idSuffix = 'hand';
          break;
        case KeyboardNavigation.COLONIES:
          idSuffix = 'colonies';
          break;
        default:
          return;
        }
        const el = document.getElementById('shortkey-' + idSuffix);
        if (el) {
          event.preventDefault();
          el.scrollIntoView({block: 'center', inline: 'center', behavior: 'auto'});
        }
      }
    },
    isPlayerActing: function(playerView: PlayerViewModel) : boolean {
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
    getFleetsCountRange: function(player: PublicPlayerModel): Array<number> {
      const fleetsRange: Array<number> = [];
      for (let i = 0; i < player.fleetSize - player.tradesThisGeneration; i++) {
        fleetsRange.push(i);
      }
      return fleetsRange;
    },
    toggle(type: string): void {
      switch (type) {
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
    isVisible(type: string): boolean {
      switch (type) {
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
      return (this.playerView.game.phase === Phase.INITIALDRAFTING) && this.playerView.game.gameOptions.initialDraftVariant;
    },
    getToggleLabel: function(hideType: string): string {
      if (hideType === 'ACTIVE') {
        return (this.showActiveCards? '✔' : '');
      } else if (hideType === 'AUTOMATED') {
        return (this.showAutomatedCards ? '✔' : '');
      } else if (hideType === 'EVENT') {
        return (this.showEventCards ? '✔' : '');
      } else {
        return '';
      }
    },
    getHideButtonClass: function(hideType: string): string {
      const prefix = 'hiding-card-button ';
      if (hideType === 'ACTIVE') {
        return prefix + (this.showActiveCards ? 'active' : 'active-transparent');
      } else if (hideType === 'AUTOMATED') {
        return prefix + (this.showAutomatedCards ? 'automated' : 'automated-transparent');
      } else if (hideType === 'EVENT') {
        return prefix + (this.showEventCards ? 'event' : 'event-transparent');
      } else {
        return '';
      }
    },
  },
  destroyed: function() {
    window.removeEventListener('keydown', this.navigatePage);
  },
  mounted: function() {
    window.addEventListener('keydown', this.navigatePage);
    if (this.playerView.game.isTerraformed && TerraformedAlertDialog.shouldAlert && PreferencesManager.load('show_alerts') === '1') {
      alert('Mars is Terraformed!');
      // Avoids repeated calls.
      TerraformedAlertDialog.shouldAlert = false;
    };
  },
  template: `
        <div id="player-home" :class="(playerView.game.turmoil ? 'with-turmoil': '')">
            <top-bar :playerView="playerView" />

            <div v-if="playerView.game.phase === 'end'">
                <div class="player_home_block">
                    <dynamic-title title="This game is over!" :color="playerView.me.color"/>
                    <a :href="'/the-end?id='+ playerView.me.id" v-i18n>Go to game results</a>
                </div>
            </div>

            <sidebar v-trim-whitespace
              :acting_player="isPlayerActing(playerView)"
              :player_color="playerView.me.color"
              :generation="playerView.game.generation"
              :coloniesCount="playerView.game.colonies.length"
              :temperature = "playerView.game.temperature"
              :oxygen = "playerView.game.oxygenLevel"
              :oceans = "playerView.game.oceans"
              :venus = "playerView.game.venusScaleLevel"
              :turmoil = "playerView.game.turmoil"
              :moonData="playerView.game.moon"
              :gameOptions = "playerView.game.gameOptions"
              :playerNumber = "playerView.players.length"
              :lastSoloGeneration = "playerView.game.lastSoloGeneration">
                <div class="deck-size">{{ playerView.game.deckSize }}</div>
            </sidebar>

            <div v-if="playerView.me.corporationCard">
                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board
                        :spaces="playerView.game.spaces"
                        :venusNextExtension="playerView.game.gameOptions.venusNextExtension"
                        :venusScaleLevel="playerView.game.venusScaleLevel"
                        :boardName ="playerView.game.gameOptions.boardName"
                        :oceans_count="playerView.game.oceans"
                        :oxygen_level="playerView.game.oxygenLevel"
                        :temperature="playerView.game.temperature"
                        :aresExtension="playerView.game.gameOptions.aresExtension"
                        :aresData="playerView.game.aresData"
                        id="shortkey-board"></board>

                    <turmoil v-if="playerView.game.turmoil" :turmoil="playerView.game.turmoil"></turmoil>

                    <MoonBoard v-if="playerView.game.gameOptions.moonExpansion" :model="playerView.game.moon"></MoonBoard>

                    <div v-if="playerView.players.length > 1" class="player_home_block--milestones-and-awards">
                        <Milestone :milestones_list="playerView.game.milestones" />
                        <Award :awards_list="playerView.game.awards" />
                    </div>
                </div>

                <players-overview class="player_home_block player_home_block--players nofloat:" :playerView="playerView" v-trim-whitespace id="shortkey-playersoverview"/>

                <div class="player_home_block nofloat">
                    <log-panel :id="playerView.me.id" :players="playerView.players" :generation="playerView.game.generation" :lastSoloGeneration="playerView.game.lastSoloGeneration" :color="playerView.me.color"></log-panel>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <dynamic-title title="Actions" :color="playerView.me.color"/>
                    <waiting-for v-if="playerView.game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="playerView.waitingFor"></waiting-for>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
                    <dynamic-title title="Drafted cards" :color="playerView.me.color" />
                    <div v-for="card in playerView.private.draftedCards" :key="card.name" class="cardbox">
                        <Card :card="card"/>
                    </div>
                </div>

                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="playerView.cardsInHand.length + playerView.preludeCardsInHand.length > 0" id="shortkey-hand">
                    <dynamic-title title="Cards In Hand" :color="playerView.me.color" :withAdditional="true" :additional="(playerView.me.cardsInHandNbr + playerView.private.preludeCardsInHand.length).toString()" />
                    <sortable-cards :playerId="playerView.me.id" :cards="playerView.private.preludeCardsInHand.concat(playerView.private.cardsInHand)" />
                </div>

                <div class="player_home_block player_home_block--cards"">
                    <div class="hiding-card-button-row">
                        <dynamic-title title="Played Cards" :color="playerView.me.color" />
                        <div class="played-cards-filters">
                          <div :class="getHideButtonClass('ACTIVE')" v-on:click.prevent="toggle('ACTIVE')">
                            <div class="played-cards-count">{{getCardsByType(playerView.me.playedCards, [getActiveCardType()]).length.toString()}}</div>
                            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('ACTIVE')}}</div>
                          </div>
                          <div :class="getHideButtonClass('AUTOMATED')" v-on:click.prevent="toggle('AUTOMATED')">
                            <div class="played-cards-count">{{getCardsByType(playerView.me.playedCards, [getAutomatedCardType(), getPreludeCardType()]).length.toString()}}</div>
                            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('AUTOMATED')}}</div>
                          </div>
                          <div :class="getHideButtonClass('EVENT')" v-on:click.prevent="toggle('EVENT')">
                            <div class="played-cards-count">{{getCardsByType(playerView.me.playedCards, [getEventCardType()]).length.toString()}}</div>
                            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('EVENT')}}</div>
                          </div>
                        </div>
                        <div class="text-overview">[ toggle cards filters ]</div>
                    </div>
                    <div v-if="playerView.me.corporationCard !== undefined" class="cardbox">
                        <Card :card="playerView.me.corporationCard" :actionUsed="isCardActivated(playerView.me.corporationCard, player)"/>
                    </div>
                    <div v-show="isVisible('ACTIVE')" v-for="card in sortActiveCards(getCardsByType(playerView.me.playedCards, [getActiveCardType()]))" :key="card.name" class="cardbox">
                        <Card :card="card" :actionUsed="isCardActivated(card, player)"/>
                    </div>

                    <stacked-cards v-show="isVisible('AUTOMATED')" :cards="getCardsByType(playerView.me.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>

                    <stacked-cards v-show="isVisible('EVENT')" :cards="getCardsByType(playerView.me.playedCards, [getEventCardType()])" ></stacked-cards>

                </div>

                <div v-if="playerView.me.selfReplicatingRobotsCards.length > 0" class="player_home_block">
                    <dynamic-title title="Self-Replicating Robots cards" :color="playerView.me.color"/>
                    <div>
                        <div v-for="card in getCardsByType(playerView.me.selfReplicatingRobotsCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <Card :card="card"/>
                        </div>
                    </div>
                </div>

            </div>

            <div class="player_home_block player_home_block--setup nofloat"  v-if="!playerView.me.corporationCard">

                <div v-for="card in playerView.private.dealtCorporationCards" :key="card.name" class="cardbox" v-if="isInitialDraftingPhase()">
                    <Card :card="card"/>
                </div>

                <div v-for="card in playerView.private.dealtPreludeCards" :key="card.name" class="cardbox" v-if="isInitialDraftingPhase()">
                    <Card :card="card"/>
                </div>

                <div v-for="card in playerView.private.dealtProjectCards" :key="card.name" class="cardbox" v-if="isInitialDraftingPhase()">
                    <Card :card="card"/>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="playerView.private.draftedCards.length > 0">
                    <dynamic-title title="Drafted Cards" :color="playerView.me.color"/>
                    <div v-for="card in playerView.private.draftedCards" :key="card.name" class="cardbox">
                        <Card :card="card"/>
                    </div>
                </div>

                <template v-if="playerView.private.pickedCorporationCard.length === 1">
                  <dynamic-title title="Your selected cards:" :color="playerView.me.color"/>
                  <div>
                    <div class="cardbox">
                      <Card :card="playerView.private.pickedCorporationCard[0]"/>
                    </div>
                    <div v-if="playerView.game.gameOptions.preludeExtension" v-for="card in playerView.private.preludeCardsInHand" :key="card.name" class="cardbox">
                      <Card :card="card"/>
                    </div>
                  </div>
                  <div>
                    <div v-for="card in playerView.private.cardsInHand" :key="card.name" class="cardbox">
                      <Card :card="card"/>
                    </div>
                  </div>
                </template>

                <dynamic-title v-if="playerView.private.pickedCorporationCard.length === 0" title="Select initial cards:" :color="playerView.me.color"/>
                <waiting-for v-if="playerView.game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="playerView.waitingFor"></waiting-for>

                <dynamic-title title="Game details" :color="playerView.me.color"/>

                <div class="player_home_block" v-if="playerView.players.length > 1">
                    <Milestone :show_scores="false" :milestones_list="playerView.game.milestones" />
                    <Award :show_scores="false" :awards_list="playerView.game.awards" />
                </div>

                <div class="player_home_block player_home_block--turnorder nofloat" v-if="playerView.players.length>1">
                    <dynamic-title title="Turn order" :color="playerView.me.color"/>
                    <div class="player_item" v-for="(p, idx) in playerView.players" v-trim-whitespace>
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
                          :spaces="playerView.game.spaces"
                          :venusNextExtension="playerView.game.gameOptions.venusNextExtension"
                          :venusScaleLevel="playerView.game.venusScaleLevel"
                          :boardName ="playerView.game.gameOptions.boardName"
                          :aresExtension="playerView.game.gameOptions.aresExtension"
                          :aresData="playerView.game.aresData">
                        </board>

                        <turmoil v-if="playerView.game.turmoil" :turmoil="playerView.game.turmoil"></turmoil>

                        <MoonBoard v-if="playerView.game.gameOptions.moonExpansion" :model="playerView.game.moon"></MoonBoard>

                    </div>
                </details>
            </div>

            <div v-if="playerView.game.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
                <a name="colonies" class="player_home_anchor"></a>
                <dynamic-title title="Colonies" :color="playerView.me.color"/>
                <div class="colonies-fleets-cont" v-if="playerView.me.corporationCard">
                    <div class="colonies-player-fleets" v-for="colonyPlayer in playerView.players">
                        <div :class="'colonies-fleet colonies-fleet-'+ colonyplayerView.me.color" v-for="idx in getFleetsCountRange(colonyPlayer)"></div>
                    </div>
                </div>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in playerView.game.colonies" :key="colony.name">
                        <colony :colony="colony"></colony>
                    </div>
                </div>
            </div>
        </div>
    `,
});
