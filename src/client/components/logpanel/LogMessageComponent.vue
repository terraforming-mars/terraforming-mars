<template>
   <li v-if="message !== undefined && message.data !== undefined && message.message !== undefined" v-on:click.prevent="$emit('click')">
    <span v-if="message.type !== LogMessageType.NEW_GENERATION" :title="when" v-html="icon"></span>
    <template v-for="(data, idx) of entries">
      <span class="log-plain-text" v-if="typeof(data) === 'string'" v-bind:key="idx">{{ data }}</span>
      <span v-else v-bind:key="idx">
        <span v-if="data.type === undefined || data.value === undefined"></span>
        <span v-else-if="data.type === LogMessageDataType.PLAYER" class="log-player" :class="'player_bg_color_' + data.value"> {{ getPlayerName(data.value) }} </span>
        <span v-else-if="data.type === LogMessageDataType.CARD" v-html="cardToHtml(data)"></span>
        <span v-else-if="data.type === LogMessageDataType.GLOBAL_EVENT" class="log-card background-color-global-event" v-i18n>
          {{data.value}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.TILE_TYPE" v-i18n>
          {{tileTypeToString[data.value]}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.COLONY" class="log-card background-color-colony" v-i18n>
          {{data.value}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.UNDERGROUND_TOKEN" class="log-excavation-token" v-i18n>
          {{undergroundResourceTokenDescription[data.value]}}
        </span>
        <span v-else-if="data.type === LogMessageDataType.SPACE" class="log-space-id" v-on:click.prevent="$emit('spaceClicked', data.value)">
            <svg width="20" height="14" viewBox="0 0 28 37">
              <circle cx="14" cy="19" r="16" stroke="black" stroke-width="1" transform="translate(0, 2)" :fill="isMoonSpace(data.value) ? 'gray' : '#b7410e'" />
            </svg>
            {{ getSpaceName(data.value) }}
        </span>
        <span v-else-if="data.type === LogMessageDataType.RAW_STRING">{{ data.value }}</span>
        <span v-else v-i18n>{{ data.value }}</span>
      </span>
    </template>
   </li>
</template>

<script lang="ts">

import Vue from 'vue';
import {Color} from '@/common/Color';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageData} from '@/common/logs/LogMessageData';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {ViewModel} from '@/common/models/PlayerModel';
import {tileTypeToString} from '@/common/TileType';
import {Log} from '@/common/logs/Log';
import {getCard} from '@/client/cards/ClientCardManifest';
import {undergroundResourceTokenDescription} from '@/common/underworld/UndergroundResourceToken';
import {isMoonSpace, getSpaceName} from '@/common/boards/spaces';

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
    viewModel: {
      type: Object as () => ViewModel,
    },
  },
  methods: {
    cardToHtml(data: LogMessageData & {type: LogMessageDataType.CARD, value: CardName}) {
      const card = getCard(data.value);
      if (card === undefined) {
        return '';
      }

      const attrs = data.attrs;
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
    getPlayerName(color: Color) {
      const player = this.viewModel.players.find((player) => player.color === color);
      return player?.name ?? color;
    },
  },
  computed: {
    entries() {
      if (this.message === undefined) {
        return [];
      }
      const e = {
        message: this.$t(this.message.message),
        data: this.message.data,
      };
      return Log.parse(e);
    },
    when() {
      return new Date(this.message.timestamp).toLocaleString();
    },
    icon() {
      return this.message.playerId === undefined ? '&#x1f551;' : '&#x1f4ac;';
    },

    LogMessageType(): typeof LogMessageType {
      return LogMessageType;
    },
    LogMessageDataType(): typeof LogMessageDataType {
      return LogMessageDataType;
    },
    getSpaceName(): typeof getSpaceName {
      return getSpaceName;
    },
    isMoonSpace(): typeof isMoonSpace {
      return isMoonSpace;
    },
    undergroundResourceTokenDescription(): typeof undergroundResourceTokenDescription {
      return undergroundResourceTokenDescription;
    },
    tileTypeToString(): typeof tileTypeToString {
      return tileTypeToString;
    },
  },
});
</script>
