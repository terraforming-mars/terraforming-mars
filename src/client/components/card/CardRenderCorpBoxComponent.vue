<template>
      <div :class="getClasses()">
          <div class="card-corporation-label">{{ label }}</div>
          <div v-for="(rowData, index) in rows[0]" :key="index">
            <CardRenderItemComponent v-if="rowData.is === 'item'" :item="rowData" />
            <CardRenderSymbolComponent v-else-if="rowData.is === 'symbol'" :item="rowData" />
            <CardRenderEffectBoxComponent v-if="rowData.is === 'effect'" :effectData="rowData" />
          </div>
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {CardRenderItem} from '@/cards/render/CardRenderItem';
import {ICardRenderEffect, ICardRenderSymbol} from '@/cards/render/Types';

export default Vue.extend({
  name: 'CardRenderCorpBoxComponent',
  props: {
    rows: {
      type: Array as () => Array<ICardRenderEffect | CardRenderItem | ICardRenderSymbol>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  components: {
    CardRenderSymbolComponent,
    CardRenderItemComponent,
    CardRenderEffectBoxComponent,
  },
  methods: {
    getClasses(): string {
      const classes: Array<string> = ['card-corporation-box'];
      return classes.join(' ');
    },
  },
});

</script>

