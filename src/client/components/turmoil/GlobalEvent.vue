<template>
  <div :class="getClass()">
    <div class="card-container">
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
import {IClientGlobalEvent} from '@/common/turmoil/IClientGlobalEvent';
import {CardComponent} from '@/common/cards/render/CardComponent';
import {getGlobalEvent} from '@/client/turmoil/ClientGlobalEventManifest';
import CardDescription from '@/client/components/card/CardDescription.vue';

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
    const globalEvent: IClientGlobalEvent | undefined = getGlobalEvent(this.globalEvent.name);
    if (globalEvent === undefined) {
      throw new Error(`Can't find card ${this.globalEvent.name}`);
    }

    return {
      renderData: globalEvent.renderData,
    };
  },
  methods: {
    getCardRenderer(): CardComponent | undefined {
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
