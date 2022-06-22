<template>
        <div :class="getClasses()">
            <div class="card-production-box-row" v-for="(rowData, index) in rows" :key="index">
                <div v-for="(rowItem, rowIndex) in rowData" class="card-production-box-row-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="rowItem.is === 'item'" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="rowItem.is === 'symbol'" :item="rowItem" />
                    <div v-else>n/a</div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {ICardRenderItem} from '@/common/cards/render/Types';

export default Vue.extend({
  name: 'CardProductionBoxComponent',
  props: {
    rows: {
      type: Array as () => Array<Array<ICardRenderItem>>,
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
    CardRenderSymbolComponent,
  },
  methods: {
    getClasses(): string {
      const classes: Array<string> = ['card-production-box'];
      return classes.join(' ');
    },
  },
});

</script>

