<template>
   <li v-on:click.prevent="$emit('click')" v-html="messageToHTML(message)"></li>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardType} from '@/common/cards/CardType';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageData, LogMessageDataAttrs} from '@/common/logs/LogMessageData';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {tileTypeToString} from '@/common/TileType';
import {Log} from '@/common/logs/Log';
import {getCard} from '@/client/cards/ClientCardManifest';
import {ClientCard} from '@/common/cards/ClientCard';

const cardTypeToCss: Record<CardType, string | undefined> = {
  event: 'background-color-events',
  corporation: 'background-color-global-event',
  active: 'background-color-active',
  automated: 'background-color-automated',
  prelude: 'background-color-prelude',
  ceo: 'background-color-ceo',
  standard_project: 'background-color-standard-project',
  standard_action: 'background-color-standard-project',
  proxy: undefined,
};

export default Vue.extend({
  name: 'LogMessageComponent',
  props: {
    message: {
      type: Object as () => LogMessage,
    },
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
  },
  methods: {
    cardToHtml(card: ClientCard, attrs: LogMessageDataAttrs | undefined) {
      const suffixFreeCardName = card.name.split(':')[0];
      const className = cardTypeToCss[card.type];

      if (className === undefined) {
        return suffixFreeCardName;
      }
      let tagHTML = '';
      if (attrs?.tags === true) {
        tagHTML = '&nbsp;' + (card.tags.map((tag) => `<div class="log-tag tag-${tag}"></div>`).join(' '));
      }

      let costHTML = '';
      if (attrs?.cost === true) {
        costHTML = `<span>&nbsp;<div class="log-resource-megacredits">${card.cost}</div></span>`;
      }
      return '<span class="log-card '+ className + '">' + this.$t(suffixFreeCardName) + tagHTML + costHTML +'</span>';
    },
    messageDataToHTML(data: LogMessageData): string {
      if (data.type === undefined || data.value === undefined) {
        return '';
      }

      switch (data.type) {
      case LogMessageDataType.PLAYER:
        for (const player of this.players) {
          if (data.value === player.color) {
            return '<span class="log-player player_bg_color_'+player.color+'">'+player.name+'</span>';
          }
        }
        break;

      case LogMessageDataType.CARD:
        const card = getCard(data.value);
        if (card !== undefined) {
          return this.cardToHtml(card, data.attrs);
        } else {
          console.log(`Cannot render ${data.value}`);
        }
        break;

      case LogMessageDataType.GLOBAL_EVENT:
        return '<span class="log-card background-color-global-event">' + this.$t(data.value) + '</span>';

      case LogMessageDataType.TILE_TYPE:
        return this.$t(tileTypeToString[data.value]);

      case LogMessageDataType.COLONY:
        return '<span class="log-card background-color-colony">' + this.$t(data.value) + '</span>';

      default:
        if (data.type !== LogMessageDataType.RAW_STRING) {
          return this.$t(data.value);
        }
      }
      return data.value.toString();
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
        if (message.message !== undefined) {
          message.message = this.$t(message.message);
          return logEntryBullet + Log.applyData(message, this.messageDataToHTML);
        }
      } catch (err) {
        console.log(err);
        return this.safeMessage(message);
      }
      return '';
    },
  },
});
</script>
