<template>
  <div :class="getClass()">
    <div v-if="showIcons() === false">
      <div class="event-party event-party--revealed" :class="partyNameClass(globalEvent.revealed)" v-i18n>{{ globalEvent.revealed }}</div>
      <div class="event-party event-party--current" :class="partyNameClass(globalEvent.current)" v-i18n>{{ globalEvent.current }}</div>
      <div class="event-content"><div class="event-text" v-i18n>{{ globalEvent.description }}</div></div>
    </div>
    <div v-else class="card-container">
      <div class="card-content-wrapper" v-i18n>
        <div class="card-content global-event-card-content">
          <div class="card-title"><span :class="eventNameStyle">{{globalEvent.name}}</span></div>
          <CardParty class="card-party--revealed" :party="globalEvent.revealed" />
          <CardParty class="card-party--current" :party="globalEvent.current" />
          <CardRenderData v-if="renderData !== undefined" :renderData="renderData" />
          <CardDescription :item='globalEvent.description' />
        </div>
     </div>
    </div>
    <slot/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GlobalEventModel} from '@/common/models/TurmoilModel';
import CardRenderData from '@/client/components/card/CardRenderData.vue';
import CardParty from '@/client/components/card/CardParty.vue';
import {IGlobalEvent} from '@/turmoil/globalEvents/IGlobalEvent';
import {CardRenderer} from '@/cards/render/CardRenderer';
import {getGlobalEventByName} from '@/turmoil/globalEvents/GlobalEventDealer';
import CardDescription from '@/client/components/card/CardDescription.vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'global-event',
  components: {
    CardRenderData,
    CardParty,
    CardDescription,
  },
  props: {
    globalEvent: {
      type: Object as () => GlobalEventModel,
    },
    type: {
      type: String,
    },
  },
  data() {
    const globalEvent: IGlobalEvent | undefined = getGlobalEventByName(this.globalEvent.name);
    if (globalEvent === undefined) {
      throw new Error(`Can't find card ${this.globalEvent.name}`);
    }

    return {
      renderData: globalEvent.renderData,
    };
  },
  methods: {
    getCardRenderer(): CardRenderer | undefined {
      return this.renderData;
    },
    partyNameClass(partyName: string): string {
      if (partyName === undefined) {
        return '';
      }
      return 'event-party--' + partyName.toLowerCase().split(' ').join('_');
    },
    getClass(): string {
      const common = 'global-event';
      switch (this.type) {
      case 'coming':
        return common + ' global-event--coming';
      case 'current':
        return common + ' global-event--current';
      default:
        return common;
      }
    },
    showIcons(): boolean {
      return PreferencesManager.loadBoolean('experimental_ui');
    },
  },
  computed: {
    eventNameStyle(): string {
      if (this.globalEvent.name.length > 24) {
        return 'global-event-name--narrow';
      }
      return '';
    },
  },
});

</script>
