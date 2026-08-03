<template>
  <div :class="klass">
    <div class="card-container global-event-container">
      <div class="card-content-wrapper" v-i18n>
        <CardParty class="card-party--revealed" :party="revealed" />
        <CardParty class="card-party--current" :party="current" />
        <div ref="title" class="global-event-title">{{globalEventName}}</div>
        <div class="card-content global-event-card-content">
          <CardRenderData v-if="renderData !== undefined" :renderData="renderData" />
          <CardDescription :item='description' />
        </div>
      </div>
    </div>
    <span v-if="showDistance" class="global-event-distance" v-i18n>{{ type }}</span>
    <slot></slot>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import CardRenderData from '@/client/components/card/CardRenderData.vue';
import CardParty from '@/client/components/card/CardParty.vue';
import {IClientGlobalEvent} from '@/common/turmoil/IClientGlobalEvent';
import {getGlobalEvent} from '@/client/turmoil/ClientGlobalEventManifest';
import CardDescription from '@/client/components/card/CardDescription.vue';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {ICardRenderRoot} from '@/common/cards/render/Types';
import {PartyName} from '@/common/turmoil/PartyName';
import {fitTextWhenReady} from '@/client/utils/textFit';

export type RenderType = 'coming' | 'current' | 'distant' | 'prior';

type DataModel = {
  renderData: ICardRenderRoot;
  description: string;
  revealed: PartyName;
  current: PartyName;
};

type Refs = {
  title: HTMLElement | undefined;
};

export default defineComponent({
  name: 'GlobalEvent',
  components: {
    CardRenderData,
    CardParty,
    CardDescription,
  },
  mounted() {
    this.fitTitle();
  },
  watch: {
    // Turmoil.vue renders each distant/coming/current slot without a :key, so as the game
    // proceeds the same component instance can get a new globalEventName without remounting.
    globalEventName() {
      this.fitTitle();
    },
  },
  props: {
    globalEventName: {
      type: String as () => GlobalEventName,
      required: true,
    },
    type: {
      type: String as () => RenderType,
      required: true,
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
  methods: {
    fitTitle(): void {
      fitTextWhenReady(this.typedRefs.title, 'global-event-title');
    },
  },
  computed: {
    klass(): string {
      const common = 'global-event global-event--' + this.type;
      if (this.showDistance) {
        return common + ' global-event--show-distance';
      }
      return common;
    },
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
    },
  },
});

</script>
