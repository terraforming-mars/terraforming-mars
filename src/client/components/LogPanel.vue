<template>
      <div class="log-container">
        <div class="log-generations">
          <h2 :class="getTitleClasses()">
              <span v-i18n>Game log</span>
          </h2>
          <div class="log-gen-title">Gen: </div>
          <div class="log-gen-numbers">
            <div v-for="n in getGenerationsRange()" :key="n" :class="getClassesGenIndicator(n)" v-on:click.prevent="selectGeneration(n)">
              {{ n }}
            </div>
          </div>
          <span class="label-additional" v-if="players.length === 1"><span :class="lastGenerationClass">of {{this.lastSoloGeneration}}</span></span>
        </div>
        <div class="panel log-panel">
          <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
              <li v-for="(message, index) in messages" :key="index" v-on:click.prevent="messageClicked(message)" v-html="messageToHTML(message)"></li>
            </ul>
          </div>
          <div class='debugid'>(debugid {{step}})</div>
        </div>
        <div class="card-panel" v-if="cards.length > 0 || globalEventNames.length > 0">
          <Button size="big" type="close" :disableOnServerBusy="false" @click="hideMe" align="right"/>
          <div id="log_panel_card" class="cardbox" v-for="card in cards" :key="card">
            <Card :card="{name: card, resources: getResourcesOnCard(card)}"/>
          </div>
          <div id="log_panel_card" class="cardbox" v-for="globalEventName in globalEventNames" :key="globalEventName">
            <global-event :globalEvent="getGlobalEvent(globalEventName)" type="prior" :showIcons="false"></global-event>
          </div>
        </div>
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardType} from '@/common/cards/CardType';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageData} from '@/common/logs/LogMessageData';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';
import {TileType} from '@/common/TileType';
import {playerColorClass} from '@/common/utils/utils';
import {Color} from '@/common/Color';
import {SoundManager} from '@/client/utils/SoundManager';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import GlobalEvent from '@/client/components/GlobalEvent.vue';
import {getGlobalEventByName} from '@/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventModel} from '@/common/models/TurmoilModel';
import {PartyName} from '@/common/turmoil/PartyName';
import Button from '@/client/components/common/Button.vue';
import {Log} from '@/common/logs/Log';
import {getCard} from '@/client/cards/ClientCardManifest';

let logRequest: XMLHttpRequest | undefined;

export default Vue.extend({
  name: 'log-panel',
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
      type: Array as () => Array<PublicPlayerModel>,
    },
    color: {
      type: String as () => Color,
    },
    step: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      // temporary storage used when showing cards on the log line.
      cards: [] as Array<CardName>,
      globalEventNames: [] as Array<GlobalEventName>,

      messages: [] as Array<LogMessage>,
      selectedGeneration: this.generation,
    };
  },
  components: {
    Button,
    Card,
    GlobalEvent,
  },
  methods: {
    scrollToEnd() {
      const scrollablePanel = document.getElementById('logpanel-scrollable');
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
      }
    },
    cardToHtml(cardType: CardType, cardName: string) {
      const cardNameString = this.$t(cardName);
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
    messageDataToHTML(data: LogMessageData): string {
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
            return '<span class="log-card background-color-global-event">' + this.$t(cardName) + '</span>';
          } else {
            const robotCards = player.playedCards.concat(player.selfReplicatingRobotsCards);
            for (const robotCard of robotCards) {
              if (cardName === robotCard.name && robotCard.cardType !== undefined) {
                return this.cardToHtml(robotCard.cardType, cardName);
              }
            }
          }
        }
        const card = getCard(cardName);
        if (card && card.card.cardType) {
          return this.cardToHtml(card.card.cardType, data.value);
        }
        break;

      case LogMessageDataType.GLOBAL_EVENT:
        const globalEventName = data.value as GlobalEventName;
        return '<span class="log-card background-color-global-event">' + this.$t(globalEventName) + '</span>';

      case LogMessageDataType.TILE_TYPE:
        const tileType: TileType = +data.value;
        return this.$t(TileType.toString(tileType));

      default:
        if (translatableMessageDataTypes.includes(data.type)) {
          return this.$t(data.value);
        }
      }
      return data.value;
    },
    // Called in the event that a bad log message comes down. Does its best to return something.
    safeMessage(message: LogMessage) {
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
        return `BUG: Unparseable message: ${message.message} ${String(err)}`;
      }
    },
    messageToHTML(message: LogMessage) {
      try {
        let logEntryBullet = '';

        if (message.type !== LogMessageType.NEW_GENERATION) {
          const when = new Date(message.timestamp).toLocaleString();
          // clock or speaking.
          const icon = message.playerId === undefined ? '&#x1f551;' : '&#x1f4ac;';
          logEntryBullet = `<span title="${when}">${icon}</span>`;
        }
        if (message.type !== undefined && message.message !== undefined) {
          message.message = this.$t(message.message);
          return logEntryBullet + Log.applyData(message, this.messageDataToHTML);
        }
      } catch (err) {
        return this.safeMessage(message);
      }
      return '';
    },
    messageClicked(message: LogMessage) {
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
    hideMe() {
      this.cards = [];
      this.globalEventNames = [];
    },
    getCrossHtml() {
      return '<i class=\'icon icon-cross\' />';
    },
    selectGeneration(gen: number): void {
      if (gen !== this.selectedGeneration) {
        this.getLogsForGeneration(gen);
      }
      this.selectedGeneration = gen;
    },
    getLogsForGeneration(generation: number): void {
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
    getClassesGenIndicator(gen: number): string {
      const classes = ['log-gen-indicator'];
      if (gen === this.selectedGeneration) {
        classes.push('log-gen-indicator--selected');
      }
      return classes.join(' ');
    },
    getGenerationsRange(): Array<number> {
      const generations: Array<number> = [];
      for (let i = 1; i <= this.generation; i++) {
        generations.push(i);
      }
      return generations;
    },
    getTitleClasses(): string {
      const classes = ['log-title'];
      classes.push(playerColorClass(this.color.toLowerCase(), 'shadow'));
      return classes.join(' ');
    },
    lastGenerationClass(): string {
      return this.lastSoloGeneration === this.generation ? 'last-generation blink-animation' : '';
    },
    getGlobalEvent(globalEventName: GlobalEventName): GlobalEventModel {
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
    getResourcesOnCard(cardName: CardName) {
      for (const player of this.players) {
        const foundCard = player.playedCards.find((card) => card.name === cardName);
        if (foundCard !== undefined) return foundCard.resources;
      }

      return undefined;
    },
  },
  mounted() {
    this.getLogsForGeneration(this.generation);
  },
});

</script>

