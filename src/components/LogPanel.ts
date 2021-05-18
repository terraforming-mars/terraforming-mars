import Vue from 'vue';
import {CardType} from '../cards/CardType';
import {LogMessage} from '../LogMessage';
import {LogMessageType} from '../LogMessageType';
import {LogMessageData} from '../LogMessageData';
import {LogMessageDataType} from '../LogMessageDataType';
import {PlayerModel} from '../models/PlayerModel';
import {Card} from './card/Card';
import {$t} from '../directives/i18n';
import {CardFinder} from './../CardFinder';
import {ICard} from '../cards/ICard';
import {CardName} from '../CardName';
import {TileType} from '../TileType';
import {playerColorClass} from '../utils/utils';
import {Color} from '../Color';
import {SoundManager} from './SoundManager';
import {PreferencesManager} from './PreferencesManager';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {GlobalEvent} from './GlobalEvent';
import {getGlobalEventByName} from '../turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventModel} from '../models/TurmoilModel';
import {PartyName} from '../turmoil/parties/PartyName';

let logRequest: XMLHttpRequest | undefined;

export const LogPanel = Vue.component('log-panel', {
  props: {
    id: {
      type: String,
    },
    generation: {
      type: Number,
    },
    lastSoloGeneration: {
      type: Number,
    },
    players: {
      type: Array as () => Array<PlayerModel>,
    },
    color: {
      type: String as () => Color,
    },
  },
  data: function() {
    return {
      // temporary storage used when showing cards on the log line.
      cards: [] as Array<CardName>,
      globalEventNames: [] as Array<GlobalEventName>,

      messages: [] as Array<LogMessage>,
      selectedGeneration: this.generation,
    };
  },
  components: {
    Card,
    GlobalEvent,
  },
  methods: {
    scrollToEnd: function() {
      const scrollablePanel = document.getElementById('logpanel-scrollable');
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
      }
    },
    cardToHtml: function(cardType: CardType, cardName: string) {
      const cardNameString = $t(cardName);
      const suffixFreeCardName = cardNameString.split(':')[0];
      let className: string | undefined;
      if (cardType === CardType.EVENT) {
        className = 'background-color-events';
      } else if (cardType === CardType.ACTIVE) {
        className = 'background-color-active';
      } else if (cardType === CardType.AUTOMATED) {
        className = 'background-color-automated';
      } else if (cardType === CardType.PRELUDE) {
        className = 'background-color-prelude';
      } else if (cardType === CardType.STANDARD_PROJECT || cardType === CardType.STANDARD_ACTION) {
        className = 'background-color-standard-project';
      }

      if (className === undefined) {
        return suffixFreeCardName;
      }
      return '<span class="log-card '+ className + '">' + suffixFreeCardName + '</span>';
    },
    messageDataToHTML: function(data: LogMessageData): string {
      const translatableMessageDataTypes = [
        LogMessageDataType.STRING,
        LogMessageDataType.STANDARD_PROJECT,
        LogMessageDataType.MILESTONE,
        LogMessageDataType.AWARD,
        LogMessageDataType.COLONY,
        LogMessageDataType.PARTY,
        LogMessageDataType.TILE_TYPE,
        LogMessageDataType.GLOBAL_EVENT,
      ];
      if (data.type === undefined || data.value === undefined) {
        return '';
      }

      switch (data.type) {
      case LogMessageDataType.PLAYER:
        for (const player of this.players) {
          if (data.value === player.color || data.value === player.id) {
            return '<span class="log-player player_bg_color_'+player.color+'">'+player.name+'</span>';
          }
        }
        break;

      case LogMessageDataType.CARD:
        const cardName = data.value as CardName;
        for (const player of this.players) {
          if (player.corporationCard !== undefined && cardName === player.corporationCard.name) {
            return '<span class="log-card background-color-global-event">' + $t(cardName) + '</span>';
          } else {
            const robotCards = player.playedCards.concat(player.selfReplicatingRobotsCards);
            for (const robotCard of robotCards) {
              if (cardName === robotCard.name && robotCard.cardType !== undefined) {
                return this.cardToHtml(robotCard.cardType, cardName);
              }
            }
          }
        }
        const card = new CardFinder().getCardByName<ICard>(cardName, (manifest) => [
          manifest.projectCards,
          manifest.preludeCards,
          manifest.standardProjects,
          manifest.standardActions,
        ]);
        if (card && card.cardType) {
          return this.cardToHtml(card.cardType, data.value);
        }
        break;

      case LogMessageDataType.GLOBAL_EVENT:
        const globalEventName = data.value as GlobalEventName;
        return '<span class="log-card background-color-global-event">' + $t(globalEventName) + '</span>';

      case LogMessageDataType.TILE_TYPE:
        const tileType: TileType = +data.value;
        return $t(TileType.toString(tileType));

      default:
        if (translatableMessageDataTypes.includes(data.type)) {
          return $t(data.value);
        }
      }
      return data.value;
    },
    // Called in the event that a bad log message comes down. Does its best to return something.
    safeMessage: function(message: LogMessage) {
      try {
        if (message === undefined) {
          return 'undefined';
        }
        if (message.data === undefined) {
          return `BUG: Unparseable message: ${message.message}`;
        }
        const data = message.data.map((datum) => {
          return (datum === undefined) ?
            'undefined' :
            ('(' + datum.type + ') ' + datum.value);
        });
        return `BUG: Unparseable message: ${message.message}, (${data.join(', ')})`;
      } catch (err) {
        return `BUG: Unparseable message: ${message.message} ${err.toString()}`;
      }
    },
    messageToHTML: function(message: LogMessage) {
      try {
        let logEntryBullet = '';

        if (message.type !== LogMessageType.NEW_GENERATION) {
          const when = new Date(message.timestamp).toLocaleString();
          // clock or speaking.
          const icon = message.playerId === undefined ? '&#x1f551;' : '&#x1f4ac;';
          logEntryBullet = `<span title="${when}">${icon}</span>`;
        }
        if (message.type !== undefined && message.message !== undefined) {
          message.message = $t(message.message);
          return logEntryBullet + message.message.replace(/\$\{([0-9]{1})\}/gi, (_match, idx) => {
            return this.messageDataToHTML(message.data[idx]);
          });
        }
      } catch (err) {
        return this.safeMessage(message);
      }
      return '';
    },
    messageClicked: function(message: LogMessage) {
      // TODO(kberg): add global event here, too.
      const datas = message.data;
      datas.forEach((data: LogMessageData) => {
        if (data.value === undefined) {
          return;
        }
        if (data.type === LogMessageDataType.CARD) {
          const cardName = data.value as CardName;
          const index = this.cards.indexOf(cardName);
          if (index === -1) {
            this.cards.push(cardName);
          } else {
            this.cards.splice(index, 1);
          }
        }
        if (data.type === LogMessageDataType.GLOBAL_EVENT) {
          const globalEventName = data.value as GlobalEventName;
          const index = this.globalEventNames.indexOf(globalEventName);
          if (index === -1) {
            this.globalEventNames.push(globalEventName);
          } else {
            this.globalEventNames.splice(index, 1);
          }
        }
      });
    },
    hideMe: function() {
      this.cards = [];
      this.globalEventNames = [];
    },
    getCrossHtml: function() {
      return '<i class=\'icon icon-cross\' />';
    },
    selectGeneration: function(gen: number): void {
      if (gen !== this.selectedGeneration) {
        this.getLogsForGeneration(gen);
      }
      this.selectedGeneration = gen;
    },
    getLogsForGeneration: function(generation: number): void {
      const messages = this.messages;
      // abort any pending requests
      if (logRequest !== undefined) {
        logRequest.abort();
        logRequest = undefined;
      }

      const xhr = new XMLHttpRequest();
      logRequest = xhr;
      xhr.open('GET', `/api/game/logs?id=${this.id}&generation=${generation}`);
      xhr.onerror = () => {
        console.error('error updating messages, unable to reach server');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          messages.splice(0, messages.length);
          messages.push(...xhr.response);
          if (PreferencesManager.loadBoolean('enable_sounds') && window.location.search.includes('experimental=1') ) {
            SoundManager.newLog();
          }
          if (generation === this.generation) {
            this.$nextTick(this.scrollToEnd);
          }
        } else {
          console.error(`error updating messages, response code ${xhr.status}`);
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    },
    getClassesGenIndicator: function(gen: number): string {
      const classes = ['log-gen-indicator'];
      if (gen === this.selectedGeneration) {
        classes.push('log-gen-indicator--selected');
      }
      return classes.join(' ');
    },
    getGenerationsRange: function(): Array<number> {
      const generations: Array<number> = [];
      for (let i = 1; i <= this.generation; i++) {
        generations.push(i);
      }
      return generations;
    },
    getTitleClasses: function(): string {
      const classes = ['log-title'];
      classes.push(playerColorClass(this.color.toLowerCase(), 'shadow'));
      return classes.join(' ');
    },
    lastGenerationClass: function(): string {
      return this.lastSoloGeneration === this.generation ? 'last-generation blink-animation' : '';
    },
    getGlobalEvent: function(globalEventName: GlobalEventName): GlobalEventModel {
      const globalEvent = getGlobalEventByName(globalEventName);
      if (globalEvent) {
        return {
          name: globalEvent.name,
          description: globalEvent.description,
          revealed: globalEvent.revealedDelegate,
          current: globalEvent.currentDelegate,
        };
      }
      return {
        name: globalEventName,
        description: 'global event not found',
        revealed: PartyName.GREENS,
        current: PartyName.GREENS,
      };
    },
  },
  mounted: function() {
    this.getLogsForGeneration(this.generation);
  },
  template: `
      <div class="log-container">
        <div class="log-generations">
          <h2 :class="getTitleClasses()">
              <span v-i18n>Game log</span>
          </h2>
          <div class="log-gen-title">Gen: </div>
          <div class="log-gen-numbers">
            <div v-for="n in getGenerationsRange()" :class="getClassesGenIndicator(n)" v-on:click.prevent="selectGeneration(n)">
              {{ n }}
            </div>
          </div>
          <span class="label-additional" v-if="players.length === 1"><span :class="lastGenerationClass">of {{this.lastSoloGeneration}}</span></span>
        </div>
        <div class="panel log-panel">
          <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
              <li v-for="message in messages" v-on:click.prevent="messageClicked(message)" v-html="messageToHTML(message)"></li>
            </ul>
          </div>
        </div>
        <div class="card-panel" v-if="cards.length > 0 || globalEventNames.length > 0">
          <Button size="big" type="close" :disableOnServerBusy="false" :onClick="hideMe" align="right"/>
          <div id="log_panel_card" class="cardbox" v-for="(card, index) in cards" :key="card">
            <Card :card="{name: card}"/>
          </div>
          <div id="log_panel_card" class="cardbox" v-for="(globalEventName, index) in globalEventNames" :key="globalEventName">
            <global-event :globalEvent="getGlobalEvent(globalEventName)" type="prior"></global-event>
          </div>
        </div>
      </div>
    `,
});

