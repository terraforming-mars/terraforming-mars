<template>
      <div class="log-container">
        <div class="log-generations">
          <h2 :class="getTitleClasses()">
              <span v-i18n>Game log</span>
          </h2>
          <div class="log-gen-title"  v-i18n>Gen: </div>
          <div class="log-gen-numbers">
            <div v-for="n in getGenerationsRange()" :key="n" :class="getClassesGenIndicator(n)" v-on:click.prevent="selectGeneration(n)">
              {{ n }}
            </div>
          </div>
          <span class="label-additional" v-if="players.length === 1"><span :class="lastGenerationClass" v-i18n>of {{this.lastSoloGeneration}}</span></span>
        </div>
        <div class="panel log-panel">
          <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
              <log-message-component v-for="(message, index) in messages" :key="index" :message="message" :players="players" v-on:click="messageClicked(message)"></log-message-component>
            </ul>
          </div>
          <div class='debugid'>(debugid {{step}})</div>
        </div>
        <div class="card-panel" v-if="cardNames.length + globalEventNames.length + colonyNames.length > 0">
          <AppButton size="big" type="close" :disableOnServerBusy="false" @click="hideMe" align="right"/>
          <div id="log_panel_card" class="cardbox" v-for="cardName in cardNames.elements" :key="cardName">
            <Card :card="{name: cardName, resources: getResourcesOnCard(cardName)}"/>
          </div>
          <div id="log_panel_card" class="cardbox" v-for="globalEventName in globalEventNames.elements" :key="globalEventName">
            <global-event :globalEventName="globalEventName" type="prior" :showIcons="false"></global-event>
          </div>
          <div id="log_panel_card" class="cardbox" v-for="colonyName in colonyNames.elements" :key="colonyName">
            <colony :colony="getColony(colonyName)"></colony>
          </div>
        </div>
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {paths} from '@/common/app/paths';
import {statusCode} from '@/common/http/statusCode';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageData} from '@/common/logs/LogMessageData';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';
import {playerColorClass} from '@/common/utils/utils';
import {Color} from '@/common/Color';
import {SoundManager} from '@/client/utils/SoundManager';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import LogMessageComponent from '@/client/components/LogMessageComponent.vue';
import {ParticipantId} from '@/common/Types';
import {ColonyName} from '@/common/colonies/ColonyName';
import Colony from '@/client/components/colonies/Colony.vue';
import {ColonyModel} from '@/common/models/ColonyModel';

let logRequest: XMLHttpRequest | undefined;

class ToggleSet<T> {
  public elements: Array<T> = [];
  public toggle(item: T) {
    const index = this.elements.indexOf(item);
    if (index === -1) {
      this.elements.push(item);
    } else {
      this.elements.splice(index, 1);
    }
  }

  public get length() {
    return this.elements.length;
  }

  public clear() {
    return this.elements = [];
  }
}

type LogPanelModel = {
  // temporary storage used when showing cards on the log line.
  cardNames: ToggleSet<CardName>,
  globalEventNames: ToggleSet<GlobalEventName>,
  colonyNames: ToggleSet<ColonyName>,
  messages: Array<LogMessage>,
  selectedGeneration: number,
};

export default Vue.extend({
  name: 'log-panel',
  props: {
    id: {
      type: String as () => ParticipantId,
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
  data(): LogPanelModel {
    return {
      cardNames: new ToggleSet(),
      globalEventNames: new ToggleSet(),
      colonyNames: new ToggleSet(),
      messages: [],
      selectedGeneration: this.generation,
    };
  },
  components: {
    AppButton,
    Card,
    Colony,
    GlobalEvent,
    LogMessageComponent,
  },
  methods: {
    scrollToEnd() {
      const scrollablePanel = document.getElementById('logpanel-scrollable');
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
      }
    },
    messageClicked(message: LogMessage) {
      // TODO(kberg): add global event here, too.
      const datas = message.data;
      datas.forEach((data: LogMessageData) => {
        if (data.value === undefined) {
          return;
        }
        if (data.type === LogMessageDataType.CARD) {
          this.cardNames.toggle(data.value as CardName);
        } else if (data.type === LogMessageDataType.GLOBAL_EVENT) {
          this.globalEventNames.toggle(data.value as GlobalEventName);
        } else if (data.type === LogMessageDataType.COLONY) {
          this.colonyNames.toggle(data.value as ColonyName);
        }
      });
    },
    hideMe() {
      this.cardNames.clear();
      this.globalEventNames.clear();
      this.colonyNames.clear();
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

      xhr.open('GET', `${paths.API_GAME_LOGS}?id=${this.id}&generation=${generation}`);
      xhr.onerror = () => {
        console.error('error updating messages, unable to reach server');
      };
      xhr.onload = () => {
        if (xhr.status === statusCode.ok) {
          messages.splice(0, messages.length);
          messages.push(...xhr.response);
          if (getPreferences().enable_sounds && window.location.search.includes('experimental=1') ) {
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
    // TODO(kberg): getColony could have the actual game colony by changing this component's properties.
    getColony(colonyName: ColonyName): ColonyModel {
      return {
        colonies: [],
        isActive: false,
        name: colonyName,
        trackPosition: 0,
        visitor: undefined,
      };
    },
    getResourcesOnCard(cardName: CardName) {
      for (const player of this.players) {
        const foundCard = player.tableau.find((card) => card.name === cardName);
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
