import Vue from 'vue';

import {Board} from './Board';
import {Card} from './card/Card';
import {Milestone} from './Milestone';
import {Award} from './Award';
import {PlayersOverview} from './overview/PlayersOverview';
import {WaitingFor} from './WaitingFor';
import {Preferences} from './Preferences';
import {PlayerModel} from '../models/PlayerModel';
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

const dialogPolyfill = require('dialog-polyfill');

import * as raw_settings from '../../assets/settings.json';

export interface PlayerHomeModel {
  hide_active_cards: string;
  hide_automated_cards: string;
  hide_event_cards: string;
}

export const PlayerHome = Vue.component('player-home', {
  data: function(): PlayerHomeModel {
    return {
      hide_active_cards: PreferencesManager.loadValue('hide_active_cards'),
      hide_automated_cards: PreferencesManager.loadValue('hide_automated_cards'),
      hide_event_cards: PreferencesManager.loadValue('hide_event_cards'),
    };
  },
  watch: {
    hide_active_cards: function() {
      PreferencesManager.saveValue('hide_active_cards', this.hide_active_cards);
    },
    hide_automated_cards: function() {
      PreferencesManager.saveValue('hide_automated_cards', this.hide_automated_cards);
    },
    hide_event_cards: function() {
      PreferencesManager.saveValue('hide_event_cards', this.hide_event_cards);
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
    'award': Award,
    'preferences': Preferences,
    'colony': Colony,
    'log-panel': LogPanel,
    'turmoil': Turmoil,
    'Button': Button,
    'sortable-cards': SortableCards,
    'top-bar': TopBar,
  },
  mixins: [PlayerMixin],
  methods: {
    navigatePage: function(event: KeyboardEvent) {
      const inputSource = event.target as Element;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        let id: string | undefined = undefined;
        switch (event.code) {
        case KeyboardNavigation.GAMEBOARD:
          id = 'shortkey-board';
          break;
        case KeyboardNavigation.PLAYERSOVERVIEW:
          id = 'shortkey-playersoverview';
          break;
        case KeyboardNavigation.HAND:
          id = 'shortkey-hand';
          break;
        case KeyboardNavigation.COLONIES:
          id = 'shortkey-colonies';
          break;
        }
        if (id === undefined) {
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          event.preventDefault();
          const scrollingSpeed = PreferencesManager.loadValue('smooth_scrolling') === '1' ? 'smooth' : 'auto';
          el.scrollIntoView({block: 'center', inline: 'center', behavior: scrollingSpeed});
        }
      }
    },
    getPlayerCssForTurnOrder: (
      player: PlayerModel,
      highlightActive: boolean,
    ): string => {
      const classes = ['highlighter_box'];

      if (highlightActive) {
        if (
          player.needsToDraft ||
                    (player.needsToDraft === undefined && player.isActive)
        ) {
          classes.push('player_is_active');
        }
        classes.push(playerColorClass(player.color, 'bg'));
      }
      return classes.join(' ');
    },
    getFleetsCountRange: function(player: PlayerModel): Array<number> {
      const fleetsRange: Array<number> = [];
      for (let i = 0; i < player.fleetSize - player.tradesThisTurn; i++) {
        fleetsRange.push(i);
      }
      return fleetsRange;
    },
    getGenerationText: function(): string {
      if (this.player.players.length === 1) {
        const MAX_GEN = this.player.preludeExtension ? 12 : 14;
        let retText =
                    'generation ' + this.player.generation + ' of ' + MAX_GEN;
        if (MAX_GEN === this.player.generation) {
          retText =
                        '<span class=\'last-generation blink-animation\'>' +
                        retText +
                        '</span>';
        }

        return retText;
      }

      return 'generation ' + this.player.generation;
    },
    toggleActiveCardsHiding() {
      this.hide_active_cards = this.isActiveCardShown() ? '1': '';
    },
    toggleAutomatedCardsHiding() {
      this.hide_automated_cards = this.isAutomatedCardShown() ? '1': '';
    },
    toggleEventCardsHiding() {
      this.hide_event_cards = this.isEventCardShown() ? '1': '';
    },
    isActiveCardShown(): boolean {
      return this.hide_active_cards !== '1';
    },
    isAutomatedCardShown(): boolean {
      return this.hide_automated_cards !== '1';
    },
    isEventCardShown(): boolean {
      return this.hide_event_cards !== '1';
    },
    getToggleLabel: function(hideType: string): string {
      if (hideType === 'ACTIVE') {
        return (this.isActiveCardShown() ? 'Hide' : 'Show') + ' active cards';
      } else if (hideType === 'AUTOMATED') {
        return (this.isAutomatedCardShown() ? 'Hide' : 'Show') + ' automated cards';
      } else if (hideType === 'EVENT') {
        return (this.isEventCardShown() ? 'Hide' : 'Show') + ' event cards';
      } else {
        return '';
      }
    },
    getHideButtonClass: function(hideType: string): string {
      const prefix = 'hiding-card-button ';
      if (hideType === 'ACTIVE') {
        return prefix + (this.isActiveCardShown() ? 'active' : 'active-transparent');
      } else if (hideType === 'AUTOMATED') {
        return prefix + (this.isAutomatedCardShown() ? 'automated' : 'automated-transparent');
      } else if (hideType === 'EVENT') {
        return prefix + (this.isEventCardShown() ? 'event' : 'event-transparent');
      } else {
        return '';
      }
    },
  },
  mounted: function() {
    dialogPolyfill.default.registerDialog(
      document.getElementById('dialog-default'),
    );
  },
  template: `
        <div v-on:keydown="navigatePage" tabindex="0" id="player-home" :class="'shortkey-no-outline'+(player.turmoil ? ' with-turmoil': '')">
            <section>
                <dialog id="dialog-default">
                    <form method="dialog">
                        <p class="title" v-i18n>Error with input</p>
                        <p id="dialog-default-message"></p>
                        <menu class="dialog-menu centered-content">
                            <button class="btn btn-lg btn-primary">OK</button>
                        </menu>
                    </form>
                </dialog>
            </section>

            <top-bar :player="player" />

            <div v-if="player.phase === 'end'">
                <div class="player_home_block">
                    <dynamic-title title="This game is over!" :color="player.color"/>
                    <a :href="'/the-end?id='+ player.id" v-i18n>Go to game results</a>
                </div>
            </div>

            <preferences v-trim-whitespace
              :player_color="player.color"
              :generation="player.generation"
              :coloniesCount="player.colonies.length"
              :temperature = "player.temperature"
              :oxygen = "player.oxygenLevel"
              :oceans = "player.oceans"
              :venus = "player.venusScaleLevel"
              :venusNextExtension = "player.venusNextExtension"
              :turmoilExtension = "player.turmoilExtension"
              :turmoil = "player.turmoil">
                <div class="deck-size">{{ player.deckSize }}</div>
            </preferences>

            <div v-if="player.corporationCard">

                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board
                        :spaces="player.spaces"
                        :venusNextExtension="player.venusNextExtension"
                        :venusScaleLevel="player.venusScaleLevel"
                        :boardName ="player.boardName"
                        :oceans_count="player.oceans"
                        :oxygen_level="player.oxygenLevel"
                        :temperature="player.temperature"
                        :shouldNotify="true"
                        :aresExtension="player.aresExtension"
                        :aresData="player.aresData" 
                        id="shortkey-board"></board>

                    <turmoil v-if="player.turmoil" :turmoil="player.turmoil"></turmoil>

                    <div v-if="player.players.length > 1" class="player_home_block--milestones-and-awards">
                        <milestone :milestones_list="player.milestones" />
                        <award :awards_list="player.awards" />
                    </div>
                </div>

                <players-overview class="player_home_block player_home_block--players nofloat:" :player="player" v-trim-whitespace id="shortkey-playersoverview"/>

                <div class="player_home_block player_home_block--log player_home_block--hide_log nofloat">
                    <dynamic-title v-if="player.players.length > 1" title="Game log" :color="player.color" :withAdditional="true" :additional="'generation ' + player.generation"/>
                    <h2 v-else :class="'player_color_'+ player.color">
                        <span v-i18n>Game log</span>
                        <span class="label-additional" v-html="getGenerationText()"></span>
                    </h2>
                    <log-panel :id="player.id" :players="player.players"></log-panel>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <dynamic-title title="Actions" :color="player.color"/>
                    <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                    <dynamic-title title="Drafted cards" :color="player.color" />
                    <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                        <Card :card="card"/>
                    </div>
                </div>

                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length > 0" id="shortkey-hand">
                    <dynamic-title title="Cards In Hand" :color="player.color" :withAdditional="true" :additional="player.cardsInHandNbr.toString()" />
                    <sortable-cards :playerId="player.id" :cards="player.cardsInHand" />
                </div>

                <div class="player_home_block player_home_block--cards"">
                    <dynamic-title title="Played Cards" :color="player.color" :withAdditional="true" :additional="getPlayerCardsPlayed(player, true).toString()" />
                    <div class="hiding-card-button-row">
                        <div :class="getHideButtonClass('ACTIVE')" v-on:click.prevent="toggleActiveCardsHiding()">
                          <span v-i18n>{{ getToggleLabel('ACTIVE')}}</span> 
                          <span>{{'&nbsp;('+getCardsByType(player.playedCards, [getActiveCardType()]).length.toString()+')' }}</span>
                        </div>
                        <div :class="getHideButtonClass('AUTOMATED')" v-on:click.prevent="toggleAutomatedCardsHiding()">
                          <span v-i18n>{{ getToggleLabel('AUTOMATED')}}</span>
                          <span>{{'&nbsp;('+getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()]).length.toString()+')' }}</span>
                        </div>
                        <div :class="getHideButtonClass('EVENT')" v-on:click.prevent="toggleEventCardsHiding()">
                          <span v-i18n>{{ getToggleLabel('EVENT')}}</span> 
                          <span>{{'&nbsp;('+getCardsByType(player.playedCards, [getEventCardType()]).length.toString()+')' }}</span>
                        </div>
                    </div>
                    <div v-if="player.corporationCard !== undefined" class="cardbox">
                        <Card :card="player.corporationCard" :actionUsed="isCardActivated(player.corporationCard, player)"/>
                    </div>
                    <div v-show="isActiveCardShown()" v-for="card in getCardsByType(player.playedCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                        <Card :card="card" :actionUsed="isCardActivated(card, player)"/> 
                    </div>

                    <stacked-cards v-show="isAutomatedCardShown()" class="player_home_block--non_blue_cards" :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>
                    
                    <stacked-cards v-show="isEventCardShown()" class="player_home_block--non_blue_cards" :cards="getCardsByType(player.playedCards, [getEventCardType()])" ></stacked-cards>
                    
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

                <div v-for="card in player.dealtCorporationCards" :key="card.name" class="cardbox" v-if="player.initialDraft">
                    <Card :card="card"/>
                </div>

                <div v-for="card in player.dealtPreludeCards" :key="card.name" class="cardbox" v-if="player.initialDraft">
                    <Card :card="card"/>
                </div>

                <div v-for="card in player.dealtProjectCards" :key="card.name" class="cardbox" v-if="player.initialDraft">
                    <Card :card="card"/>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                    <dynamic-title title="Drafted Cards" :color="player.color"/>
                    <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                        <Card :card="card"/>
                    </div>
                </div>

                <dynamic-title title="Select initial cards:" :color="player.color"/>
                <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>

                <dynamic-title title="Game details" :color="player.color"/>


                <div class="player_home_block" v-if="player.players.length > 1">
                    <milestone :milestones_list="player.milestones" />
                    <award :awards_list="player.awards" />
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
                        <board :spaces="player.spaces" :venusNextExtension="player.venusNextExtension" :venusScaleLevel="player.venusScaleLevel" :boardName ="player.boardName"></board>
                        <turmoil v-if="player.turmoil" :turmoil="player.turmoil"></turmoil>
                    </div>
                </details>
            </div>

            <div v-if="player.colonies.length > 0" class="player_home_block" ref="colonies" id="shortkey-colonies">
                <a name="colonies" class="player_home_anchor"></a>
                <dynamic-title title="Colonies" :color="player.color"/>
                <div class="colonies-fleets-cont" v-if="player.corporationCard">
                    <div class="colonies-player-fleets" v-for="colonyPlayer in player.players">
                        <div :class="'colonies-fleet colonies-fleet-'+ colonyPlayer.color" v-for="idx in getFleetsCountRange(colonyPlayer)"></div>
                    </div>
                </div>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in player.colonies" :key="colony.name">
                        <colony :colony="colony"></colony>
                    </div>
                </div>
            </div>
        </div>
    `,
});
