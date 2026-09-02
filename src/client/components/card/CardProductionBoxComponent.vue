<template>
        <div class="card-production-box">
            <div class="card-production-box-row" v-for="(rowData, index) in rows" :key="index">
                <div v-for="(rowItem, rowIndex) in rowData" class="card-production-box-row-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="isICardRenderItem(rowItem)" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="isICardRenderSymbol(rowItem)" :item="rowItem" />
                    <div v-else>n/a</div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {isICardRenderItem, isICardRenderSymbol, ItemType} from '@/common/cards/render/Types';

export default defineComponent({
  name: 'CardProductionBoxComponent',
  props: {
    rows: {
      type: Array as () => Array<Array<ItemType>>,
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
    CardRenderSymbolComponent,
  },
  methods: {
    isICardRenderItem: isICardRenderItem,
    isICardRenderSymbol: isICardRenderSymbol,
  },
});

</script>

