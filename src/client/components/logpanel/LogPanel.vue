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
    <card-panel :message="selectedMessage" :players="players" v-on:hide="selectedMessage = undefined"></card-panel>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {paths} from '@/common/app/paths';
import {statusCode} from '@/common/http/statusCode';
import {LogMessage} from '@/common/logs/LogMessage';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {playerColorClass} from '@/common/utils/utils';
import {Color} from '@/common/Color';
import {SoundManager} from '@/client/utils/SoundManager';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {ParticipantId} from '@/common/Types';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import CardPanel from '@/client/components/logpanel/CardPanel.vue';

let logRequest: XMLHttpRequest | undefined;

type LogPanelModel = {
  messages: Array<LogMessage>,
  selectedGeneration: number,
  selectedMessage: LogMessage | undefined,
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
      messages: [],
      selectedGeneration: this.generation,
      selectedMessage: undefined,
    };
  },
  components: {
    LogMessageComponent,
    CardPanel,
  },
  methods: {
    messageClicked(message: LogMessage) {
      this.selectedMessage = message;
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
    scrollToEnd() {
      const scrollablePanel = document.getElementById('logpanel-scrollable');
      if (scrollablePanel !== null) {
        scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
      }
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
  },
  mounted() {
    this.getLogsForGeneration(this.generation);
  },
});

</script>
