<template>
  <div :class="klass">
    <div class="card-container global-event-container">
      <div class="card-content-wrapper" v-i18n>
        <CardParty class="card-party--revealed" :party="revealed" />
        <CardParty class="card-party--current" :party="current" />
        <div class="global-event-title"><span class="global-event-name">{{globalEventName}}</span></div>
        <div class="card-content global-event-card-content">
          <CardRenderData v-if="renderData !== undefined" :renderData="renderData" />
          <CardDescription :item='description' />
        </div>
      </div>
    </div>
    <span v-if="showDistance" class="global-event-distance" i18-n>{{ this.type }}</span>
    <slot/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRenderData from '@/client/components/card/CardRenderData.vue';
import CardParty from '@/client/components/card/CardParty.vue';
import {IClientGlobalEvent} from '@/common/turmoil/IClientGlobalEvent';
import {getGlobalEvent} from '@/client/turmoil/ClientGlobalEventManifest';
import CardDescription from '@/client/components/card/CardDescription.vue';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {ICardRenderRoot} from '@/common/cards/render/Types';
import {PartyName} from '@/common/turmoil/PartyName';

export type RenderType = 'coming' | 'current' | 'distant';

type DataModel = {
  renderData: ICardRenderRoot;
  description: string;
  revealed: PartyName;
  current: PartyName;
};

export default Vue.extend({
  name: 'global-event',
  components: {
    CardRenderData,
    CardParty,
    CardDescription,
  },
  props: {
    globalEventName: {
      type: String as () => GlobalEventName,
    },
    type: {
      type: String as () => RenderType,
    },
    showDistance: {
      type: Boolean,
      default: false,
    },
  },
  data(): DataModel {
    const globalEvent: IClientGlobalEvent | undefined = getGlobalEvent(this.globalEventName);
    if (globalEvent === undefined) {
      throw new Error(`Can't find card ${this.globalEventName}`);
    }

    return {
      renderData: globalEvent.renderData,
      revealed: globalEvent.revealedDelegate,
      current: globalEvent.currentDelegate,
      description: globalEvent.description,
    };
  },
  computed: {
    klass(): string {
      const common = 'global-event global-event--' + this.type;
      if (this.showDistance) {
        return common + ' global-event--show-distance';
      }
      return common;
    },
  },
});

</script>
