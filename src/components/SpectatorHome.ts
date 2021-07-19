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
import {SpectatorViewModel} from '../../src/models/SpectatorModel';
import TopBar from './TopBar.vue';
import {PreferencesManager} from './PreferencesManager';
import {KeyboardNavigation} from '../../src/KeyboardNavigation';
import MoonBoard from './moon/MoonBoard.vue';
import {Phase} from '../../src/Phase';
import StackedCards from './StackedCards.vue';

import * as raw_settings from '../genfiles/settings.json';
export interface SpectatorHomeModel {
  showActiveCards: boolean;
  showAutomatedCards: boolean;
  showEventCards: boolean;
}

class TerraformedAlertDialog {
  static shouldAlert = true;
}

export const SpectatorHome = Vue.component('spectator-home', {
  data: function(): SpectatorHomeModel {
    return {
      showActiveCards: !PreferencesManager.loadBoolean('hide_active_cards'),
      showAutomatedCards: !PreferencesManager.loadBoolean('hide_automated_cards'),
      showEventCards: !PreferencesManager.loadBoolean('hide_event_cards'),
    };
  },
  // props: {
  //     settings: {
  //       type: Object as () => typeof raw_settings,
  //     },
  //   },
  //   components: {
  //   },
  //   methods: {
  //   },
  //   mounted: function() {
  //     // TODO load this spectator with XHR
  //     fetch('/api/spectator' + window.location.search)
  //       .then((response) => response.json())
  //       .then((json) => {
  //         this.$data.spectator = json;
  //       })
  //       .catch(() => {
  //         alert('error pulling information for spectator');
  //       });
  //   },
  //   template: `<div id="spectator-home">
  //     <template v-if="spectator !== undefined">
  //       Generation: {{spectator.generation}}
  //     </template>
  //   </div>`,
  // });


  // watch: {
  // hide_active_cards: function() {
  //   PreferencesManager.save('hide_active_cards', !this.showActiveCards);
  // },
  // hide_automated_cards: function() {
  //   PreferencesManager.save('hide_automated_cards', !this.showAutomatedCards);
  // },
  // hide_event_cards: function() {
  //   PreferencesManager.save('hide_event_cards', !this.showEventCards);
  // },
  // },
  props: {
    spectatorView: {
      type: Object as () => SpectatorViewModel,
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
      return (this.spectatorView.game.phase === Phase.INITIALDRAFTING) && this.spectatorView.game.gameOptions.initialDraftVariant;
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
    if (this.spectatorView.game.isTerraformed && TerraformedAlertDialog.shouldAlert && PreferencesManager.load('show_alerts') === '1') {
      alert('Mars is Terraformed!');
      // Avoids repeated calls.
      TerraformedAlertDialog.shouldAlert = false;
    };
  },
  template: `
        <div id="spectator-home" :class="(spectatorView.game.turmoil ? 'with-turmoil': '')">
            <top-bar :playerView="playerView" />

            <div v-if="spectatorView.game.phase === 'end'">
                <div class="player_home_block">
                    <dynamic-title title="This game is over!" :color="player.me.color"/>
                    <a :href="'/the-end?id='+ player.id" v-i18n>Go to game results</a>
                </div>
            </div>

            <sidebar v-trim-whitespace
              :acting_player="isPlayerActing(player)"
              :player_color="playerView.me.color"
              :generation="spectatorView.game.generation"
              :coloniesCount="spectatorView.game.colonies.length"
              :temperature = "spectatorView.game.temperature"
              :oxygen = "spectatorView.game.oxygenLevel"
              :oceans = "spectatorView.game.oceans"
              :venus = "spectatorView.game.venusScaleLevel"
              :turmoil = "spectatorView.game.turmoil"
              :moonData="spectatorView.game.moon"
              :gameOptions = "spectatorView.game.gameOptions"
              :playerNumber = "playerView.players.length"
              :lastSoloGeneration = "spectatorView.game.lastSoloGeneration">
                <div class="deck-size">{{ spectatorView.game.deckSize }}</div>
            </sidebar>

            <div v-if="player.me.private.corporationCard">
                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board
                        :spaces="spectatorView.game.spaces"
                        :venusNextExtension="spectatorView.game.gameOptions.venusNextExtension"
                        :venusScaleLevel="spectatorView.game.venusScaleLevel"
                        :boardName ="spectatorView.game.gameOptions.boardName"
                        :oceans_count="spectatorView.game.oceans"
                        :oxygen_level="spectatorView.game.oxygenLevel"
                        :temperature="spectatorView.game.temperature"
                        :aresExtension="spectatorView.game.gameOptions.aresExtension"
                        :aresData="spectatorView.game.aresData"
                        id="shortkey-board"></board>

                    <turmoil v-if="spectatorView.game.turmoil" :turmoil="spectatorView.game.turmoil"></turmoil>

                    <MoonBoard v-if="spectatorView.game.gameOptions.moonExpansion" :model="spectatorView.game.moon"></MoonBoard>

                    <div v-if="playerView.players.length > 1" class="player_home_block--milestones-and-awards">
                        <Milestone :milestones_list="spectatorView.game.milestones" />
                        <Award :awards_list="spectatorView.game.awards" />
                    </div>
                </div>

                <players-overview class="player_home_block player_home_block--players nofloat:" :playerView="playerView" v-trim-whitespace id="shortkey-playersoverview"/>

                <div class="player_home_block nofloat">
                    <log-panel :id="player.id" :players="playerView.players" :generation="spectatorView.game.generation" :lastSoloGeneration="spectatorView.game.lastSoloGeneration" :color="player.color"></log-panel>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <dynamic-title title="Actions" :color="player.color"/>
                    <waiting-for v-if="spectatorView.game.phase !== 'end'" :players="playerView.players" :playerView="playerView" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>
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

            <div v-if="spectatorView.game.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
                <a name="colonies" class="player_home_anchor"></a>
                <dynamic-title title="Colonies" :color="player.color"/>
                <div class="colonies-fleets-cont" v-if="player.corporationCard">
                    <div class="colonies-player-fleets" v-for="colonyPlayer in playerView.players">
                        <div :class="'colonies-fleet colonies-fleet-'+ colonyPlayer.color" v-for="idx in getFleetsCountRange(colonyPlayer)"></div>
                    </div>
                </div>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in spectatorView.game.colonies" :key="colony.name">
                        <colony :colony="colony"></colony>
                    </div>
                </div>
            </div>
        </div>
    `,
});
