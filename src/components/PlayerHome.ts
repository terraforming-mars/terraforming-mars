import Vue from 'vue';

import {Board} from './Board';
import {Card} from './card/Card';
import {Milestone} from './Milestone';
import Award from './Award.vue';
import {PlayersOverview} from './overview/PlayersOverview';
import {WaitingFor} from './WaitingFor';
import {Sidebar} from './Sidebar';
import {PlayerModel, PublicPlayerModel} from '../models/PlayerModel';
import {Colony} from './Colony';
import {LogPanel} from './LogPanel';
import {PlayerMixin} from './PlayerMixin';
import {Turmoil} from './Turmoil';
import {playerColorClass} from '../utils/utils';
import {DynamicTitle} from './common/DynamicTitle';
import {Button} from './common/Button';
import {SortableCards} from './SortableCards';
import {TopBar} from './TopBar';
import {PreferencesManager} from './PreferencesManager';
import {KeyboardNavigation} from '../../src/KeyboardNavigation';
import {MoonBoard} from './moon/MoonBoard';
import {Phase} from '../../src/Phase';

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
    player: {
      type: Object as () => PlayerModel,
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
    'milestone': Milestone,
    Award,
    'sidebar': Sidebar,
    'colony': Colony,
    'log-panel': LogPanel,
    'turmoil': Turmoil,
    'Button': Button,
    'sortable-cards': SortableCards,
    'top-bar': TopBar,
    'moonboard': MoonBoard,
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
    isPlayerActing: function(player: PlayerModel) : boolean {
      return player.players.length > 1 && player.waitingFor !== undefined;
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
      return (this.player.game.phase === Phase.INITIALDRAFTING) && this.player.game.gameOptions.initialDraftVariant;
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
    if (this.player.game.isTerraformed && TerraformedAlertDialog.shouldAlert && PreferencesManager.load('show_alerts') === '1') {
      alert('Mars is Terraformed!');
      // Avoids repeated calls.
      TerraformedAlertDialog.shouldAlert = false;
    };
  },
  template: `
        <div id="player-home" :class="(player.game.turmoil ? 'with-turmoil': '')">
            <top-bar :player="player" />

            <div v-if="player.game.phase === 'end'">
                <div class="player_home_block">
                    <dynamic-title title="This game is over!" :color="player.color"/>
                    <a :href="'/the-end?id='+ player.id" v-i18n>Go to game results</a>
                </div>
            </div>

            <sidebar v-trim-whitespace
              :acting_player="isPlayerActing(player)"
              :player_color="player.color"
              :generation="player.game.generation"
              :coloniesCount="player.game.colonies.length"
              :temperature = "player.game.temperature"
              :oxygen = "player.game.oxygenLevel"
              :oceans = "player.game.oceans"
              :venus = "player.game.venusScaleLevel"
              :turmoil = "player.game.turmoil"
              :moonData="player.game.moon"
              :gameOptions = "player.game.gameOptions"
              :playerNumber = "player.players.length"
              :lastSoloGeneration = "player.game.lastSoloGeneration">
                <div class="deck-size">{{ player.game.deckSize }}</div>
            </sidebar>

            <div v-if="player.corporationCard">

                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board
                        :spaces="player.game.spaces"
                        :venusNextExtension="player.game.gameOptions.venusNextExtension"
                        :venusScaleLevel="player.game.venusScaleLevel"
                        :boardName ="player.game.gameOptions.boardName"
                        :oceans_count="player.game.oceans"
                        :oxygen_level="player.game.oxygenLevel"
                        :temperature="player.game.temperature"
                        :aresExtension="player.game.gameOptions.aresExtension"
                        :aresData="player.game.aresData"
                        id="shortkey-board"></board>

                    <turmoil v-if="player.game.turmoil" :turmoil="player.game.turmoil"></turmoil>

                    <moonboard v-if="player.game.gameOptions.moonExpansion" :model="player.game.moon"></moonboard>

                    <div v-if="player.players.length > 1" class="player_home_block--milestones-and-awards">
                        <milestone :milestones_list="player.game.milestones" />
                        <Award :awards_list="player.game.awards" />
                    </div>
                </div>

                <players-overview class="player_home_block player_home_block--players nofloat:" :player="player" v-trim-whitespace id="shortkey-playersoverview"/>

                <div class="player_home_block nofloat">
                    <log-panel :id="player.id" :players="player.players" :generation="player.game.generation" :lastSoloGeneration="player.game.lastSoloGeneration" :color="player.color"></log-panel>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <dynamic-title title="Actions" :color="player.color"/>
                    <waiting-for v-if="player.game.phase !== 'end'" :players="player.players" :player="player" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                    <dynamic-title title="Drafted cards" :color="player.color" />
                    <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                        <Card :card="card"/>
                    </div>
                </div>

                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length + player.preludeCardsInHand.length > 0" id="shortkey-hand">
                    <dynamic-title title="Cards In Hand" :color="player.color" :withAdditional="true" :additional="(player.cardsInHandNbr + player.preludeCardsInHand.length).toString()" />
                    <sortable-cards :playerId="player.id" :cards="player.preludeCardsInHand.concat(player.cardsInHand)" />
                </div>

                <div class="player_home_block player_home_block--cards"">
                    <div class="hiding-card-button-row">
                        <dynamic-title title="Played Cards" :color="player.color" />
                        <div class="played-cards-filters">
                          <div :class="getHideButtonClass('ACTIVE')" v-on:click.prevent="toggle('ACTIVE')">
                            <div class="played-cards-count">{{getCardsByType(player.playedCards, [getActiveCardType()]).length.toString()}}</div>
                            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('ACTIVE')}}</div>
                          </div>
                          <div :class="getHideButtonClass('AUTOMATED')" v-on:click.prevent="toggle('AUTOMATED')">
                            <div class="played-cards-count">{{getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()]).length.toString()}}</div>
                            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('AUTOMATED')}}</div>
                          </div>
                          <div :class="getHideButtonClass('EVENT')" v-on:click.prevent="toggle('EVENT')">
                            <div class="played-cards-count">{{getCardsByType(player.playedCards, [getEventCardType()]).length.toString()}}</div>
                            <div class="played-cards-selection" v-i18n>{{ getToggleLabel('EVENT')}}</div>
                          </div>
                        </div>
                        <div class="text-overview">[ toggle cards filters ]</div>
                    </div>
                    <div v-if="player.corporationCard !== undefined" class="cardbox">
                        <Card :card="player.corporationCard" :actionUsed="isCardActivated(player.corporationCard, player)"/>
                    </div>
                    <div v-show="isVisible('ACTIVE')" v-for="card in sortActiveCards(getCardsByType(player.playedCards, [getActiveCardType()]))" :key="card.name" class="cardbox">
                        <Card :card="card" :actionUsed="isCardActivated(card, player)"/>
                    </div>

                    <stacked-cards v-show="isVisible('AUTOMATED')" :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>

                    <stacked-cards v-show="isVisible('EVENT')" :cards="getCardsByType(player.playedCards, [getEventCardType()])" ></stacked-cards>

                </div>

                <div v-if="player.selfReplicatingRobotsCards.length > 0" class="player_home_block">
                    <dynamic-title title="Self-Replicating Robots cards" :color="player.color"/>
                    <div>
                        <div v-for="card in getCardsByType(player.selfReplicatingRobotsCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <Card :card="card"/>
                        </div>
                    </div>
                </div>

            </div>

            <div class="player_home_block player_home_block--setup nofloat"  v-if="!player.corporationCard">

                <div v-for="card in player.dealtCorporationCards" :key="card.name" class="cardbox" v-if="isInitialDraftingPhase()">
                    <Card :card="card"/>
                </div>

                <div v-for="card in player.dealtPreludeCards" :key="card.name" class="cardbox" v-if="isInitialDraftingPhase()">
                    <Card :card="card"/>
                </div>

                <div v-for="card in player.dealtProjectCards" :key="card.name" class="cardbox" v-if="isInitialDraftingPhase()">
                    <Card :card="card"/>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                    <dynamic-title title="Drafted Cards" :color="player.color"/>
                    <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                        <Card :card="card"/>
                    </div>
                </div>

                <template v-if="player.pickedCorporationCard.length === 1">
                  <dynamic-title title="Your selected cards:" :color="player.color"/>
                  <div>
                    <div class="cardbox">
                      <Card :card="player.pickedCorporationCard[0]"/>
                    </div>
                    <div v-if="player.game.gameOptions.preludeExtension" v-for="card in player.preludeCardsInHand" :key="card.name" class="cardbox">
                      <Card :card="card"/>
                    </div>
                  </div>
                  <div>
                    <div v-for="card in player.cardsInHand" :key="card.name" class="cardbox">
                      <Card :card="card"/>
                    </div>
                  </div>
                </template>

                <dynamic-title v-if="player.pickedCorporationCard.length === 0" title="Select initial cards:" :color="player.color"/>
                <waiting-for v-if="player.game.phase !== 'end'" :players="player.players" :player="player" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>

                <dynamic-title title="Game details" :color="player.color"/>

                <div class="player_home_block" v-if="player.players.length > 1">
                    <milestone :show_scores="false" :milestones_list="player.game.milestones" />
                    <Award :show_scores="false" :awards_list="player.game.awards" />
                </div>

                <div class="player_home_block player_home_block--turnorder nofloat" v-if="player.players.length>1">
                    <dynamic-title title="Turn order" :color="player.color"/>
                    <div class="player_item" v-for="(p, idx) in player.players" v-trim-whitespace>
                        <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
                            <span class="player_number">{{ idx+1 }}.</span><span class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</span>
                        </div>
                        <div class="player_separator" v-if="idx !== player.players.length - 1">⟶</div>
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
                          :spaces="player.game.spaces"
                          :venusNextExtension="player.game.gameOptions.venusNextExtension"
                          :venusScaleLevel="player.game.venusScaleLevel"
                          :boardName ="player.game.gameOptions.boardName"
                          :aresExtension="player.game.gameOptions.aresExtension"
                          :aresData="player.game.aresData">
                        </board>

                        <turmoil v-if="player.game.turmoil" :turmoil="player.game.turmoil"></turmoil>

                        <moonboard v-if="player.game.gameOptions.moonExpansion" :model="player.game.moon"></moonboard>

                    </div>
                </details>
            </div>

            <div v-if="player.game.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
                <a name="colonies" class="player_home_anchor"></a>
                <dynamic-title title="Colonies" :color="player.color"/>
                <div class="colonies-fleets-cont" v-if="player.corporationCard">
                    <div class="colonies-player-fleets" v-for="colonyPlayer in player.players">
                        <div :class="'colonies-fleet colonies-fleet-'+ colonyPlayer.color" v-for="idx in getFleetsCountRange(colonyPlayer)"></div>
                    </div>
                </div>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in player.game.colonies" :key="colony.name">
                        <colony :colony="colony"></colony>
                    </div>
                </div>
            </div>
        </div>
    `,
});
