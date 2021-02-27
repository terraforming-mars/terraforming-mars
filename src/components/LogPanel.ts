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
      cards: [] as Array<string>,
      messages: [] as Array<LogMessage>,
      selectedGeneration: this.generation,
    };
  },
  components: {
    Card,
  },
  methods: {
    scrollToEnd: function() {
      const scrollablePanel = document.getElementById('logpanel-scrollable');
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
      }
    },
    parseCardType: function(cardType: CardType, cardNameString: string) {
      cardNameString = $t(cardNameString);
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
    parseData: function(data: LogMessageData) {
      const translatableMessageDataTypes = [
        LogMessageDataType.STRING,
        LogMessageDataType.STANDARD_PROJECT,
        LogMessageDataType.MILESTONE,
        LogMessageDataType.AWARD,
        LogMessageDataType.COLONY,
        LogMessageDataType.PARTY,
        LogMessageDataType.TILE_TYPE,
      ];
      if (data.type !== undefined && data.value !== undefined) {
        if (data.type === LogMessageDataType.PLAYER) {
          for (const player of this.players) {
            if (data.value === player.color || data.value === player.id) {
              return '<span class="log-player player_bg_color_'+player.color+'">'+player.name+'</span>';
            }
          }
        } else if (data.type === LogMessageDataType.CARD) {
          const cardName = data.value as CardName;
          for (const player of this.players) {
            if (player.corporationCard !== undefined && cardName === player.corporationCard.name) {
              return '<span class="log-card background-color-corporation">' + $t(cardName) + '</span>';
            } else {
              const cards = player.playedCards.concat(player.selfReplicatingRobotsCards);
              for (const card of cards) {
                if (cardName === card.name && card.cardType !== undefined) {
                  return this.parseCardType(card.cardType, data.value);
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
          if (card && card.cardType) return this.parseCardType(card.cardType, data.value);
        } else if (data.type === LogMessageDataType.TILE_TYPE) {
          const tileType: TileType = +data.value;
          return $t(TileType.toString(tileType));
        } else if (translatableMessageDataTypes.includes(data.type)) {
          return $t(data.value);
        } else {
          return data.value;
        }
      }
      return '';
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
    parseMessage: function(message: LogMessage) {
      try {
        const logEntryBullet = (this.isNewGeneration(message.type)) ? '' : `<span title="${new Date(message.timestamp).toLocaleString()}">&#x1f551;</span>`;
        if (message.type !== undefined && message.message !== undefined) {
          message.message = $t(message.message);
          return logEntryBullet+message.message.replace(/\$\{([0-9]{1})\}/gi, (_match, idx) => {
            return this.parseData(message.data[idx]);
          });
        }
      } catch (err) {
        return this.safeMessage(message);
      }
      return '';
    },
    isNewGeneration: function(type: LogMessageType) {
      return (type === LogMessageType.NEW_GENERATION);
    },
    cardClicked: function(message: LogMessage) {
      const datas = message.data;
      datas.forEach((data: LogMessageData) => {
        if (data.type !== undefined && data.value !== undefined) {
          if (data.type === LogMessageDataType.CARD) {
            const card_name = data.value;
            const index = this.cards.indexOf(card_name);
            if (index === -1) {
              this.cards.push(card_name);
            } else {
              this.cards.splice(index, 1);
            }
          }
        }
      });
    },
    hideMe: function() {
      this.cards = [];
    },
    getCrossHtml: function() {
      return '<i class=\'icon icon-cross\' />';
    },
    selectGeneration: function(gen: number): void {
      this.selectedGeneration = gen;
    },
    getMessagesForGeneration: function(generation: number) {
      let foundStart = false;
      const newMessages: Array<LogMessage> = [];
      for (const message of this.messages) {
        if (message.message === 'Generation ${0}') {
          const value = Number(message.data[0]?.value);
          if (value === generation) {
            foundStart = true;
          } else if (value === generation + 1) {
            break;
          }
        }
        if (foundStart === true) {
          newMessages.push(message);
        }
      }
      return newMessages;
    },
    getMessages: function() {
      // return all messages for current generation
      if (this.selectedGeneration === this.generation) {
        this.$nextTick(this.scrollToEnd);
        return this.messages;
      }
      // limit to selected generation
      return this.getMessagesForGeneration(this.selectedGeneration);
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
      for (const message of this.messages) {
        if (message.message === 'Generation ${0}') {
          generations.push(Number(message.data[0]?.value));
        }
      }
      return generations;
    },
    getTitleClasses: function(): string {
      const classes = ['log-title'];
      classes.push(playerColorClass(this.color.toLowerCase(), 'shadow'));
      return classes.join(' ');
    },
    getGenerationText: function(): string {
      let retText = '';
      if (this.players.length === 1) {
        retText += 'of ' + this.lastSoloGeneration;
        if (this.lastSoloGeneration === this.generation) {
          retText = '<span class=\'last-generation blink-animation\'>' + retText + '</span>';
        }
      }

      return retText;
    },
  },
  mounted: function() {
    fetch(`/api/game/logs?id=${this.id}`)
      .then((response) => response.json())
      .then((messages) => {
        this.messages.splice(0, this.messages.length, ...messages);
      })
      .catch((error) => {
        console.error('error updating messages', error);
      });
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
          <span class="label-additional" v-html="getGenerationText()"></span>
        </div>
        <div class="panel log-panel">
          <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
              <li v-for="message in getMessages()" v-on:click.prevent="cardClicked(message)" v-html="parseMessage(message)"></li>
            </ul>
          </div>
        </div>
        <div class="card-panel" v-if="cards.length > 0">
          <Button size="big" type="close" :disableOnServerBusy="false" :onClick="hideMe" align="right"/>
          <div id="log_panel_card" class="cardbox" v-for="(card, index) in cards" :key="index">
            <Card :card="{name: card}"/>
          </div>
        </div>
      </div>
    `,
});

