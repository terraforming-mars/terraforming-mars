<template>
      <div :class="getClasses()">
        <div class="card-effect-box-row">
            <div v-if="delimiter !== undefined && cause !== undefined" class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in cause" class="card-effect-box-item" :key="rowIndex">
                  <CardRenderItemComponent v-if="isItem(rowItem)" :item="rowItem"/>
                  <CardRenderSymbolComponent v-else-if="isSymbol(rowItem)" :item="rowItem" />
                  <CardProductionBoxComponent v-else-if="isProductionBox(rowItem)" :rows="rowItem.rows" />
                  <CardRenderTileComponent v-if="isTile(rowItem)" :item="rowItem"/>
                </div>
            </div>
            <CardRenderSymbolComponent v-if="delimiter !== undefined" :item="delimiter" />
            <div class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in effect" class="card-effect-box-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="isItem(rowItem)" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="isSymbol(rowItem)" :item="rowItem" />
                    <CardProductionBoxComponent v-else-if="isProductionBox(rowItem)" :rows="rowItem.rows" />
                    <CardRenderTileComponent v-else-if="isTile(rowItem)" :item="rowItem"/>
                </div>
            </div>
        </div>
        <CardDescription v-if="description" :item="description" />
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {ICardRenderEffect, isICardRenderItem, isICardRenderProductionBox} from '@/common/cards/render/Types';
import CardProductionBoxComponent from '@/client/components/card/CardProductionBoxComponent.vue';
import CardRenderTileComponent from '@/client/components/card/CardRenderTileComponent.vue';
import {isICardRenderSymbol, isICardRenderTile, ItemType} from '@/common/cards/render/Types';

import CardDescription from '@/client/components/card/CardDescription.vue';

export default Vue.extend({
  name: 'CardRenderEffectBoxComponent',
  props: {
    effectData: {
      type: Object as () => ICardRenderEffect,
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
    CardRenderSymbolComponent,
    CardProductionBoxComponent,
    CardRenderTileComponent,
    CardDescription,
  },
  methods: {
    getClasses(): string {
      return 'card-effect-box';
    },
    isItem: isICardRenderItem,
    isSymbol: isICardRenderSymbol,
    isProductionBox: isICardRenderProductionBox,
    isTile: isICardRenderTile,
  },
  computed: {
    cause(): Array<ItemType> | undefined {
      return this.effectData.rows[0];
    },
    delimiter(): ItemType {
      if (this.cause?.length === 0) {
        return undefined;
      }
      return this.effectData.rows[1][0];
    },
    effect(): Array<ItemType> {
      return this.effectData.rows[2];
    },
    description(): ItemType {
      return this.effectData.rows[2].slice(-1)[0];
    },
  },
});
</script>

