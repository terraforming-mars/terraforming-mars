<template>
      <div :class="getClasses()">
        <div class="card-effect-box-row">
            <div v-if="effectData.delimiter !== undefined && effectData.cause !== undefined" class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in effectData.cause" class="card-effect-box-item" :key="rowIndex">
                  <CardRenderItemComponent v-if="isItem(rowItem)" :item="rowItem"/>
                  <CardRenderSymbolComponent v-else-if="isSymbol(rowItem)" :item="rowItem" />
                  <CardProductionBoxComponent v-else-if="isProductionBox(rowItem)" :rows="rowItem.rows" />
                  <CardRenderTileComponent v-if="isTile(rowItem)" :item="rowItem"/>
                </div>
            </div>
            <CardRenderSymbolComponent v-if="effectData.delimiter !== undefined" :item="effectData.delimiter" />
            <div class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in effectData.effect" class="card-effect-box-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="isItem(rowItem)" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="isSymbol(rowItem)" :item="rowItem" />
                    <CardProductionBoxComponent v-else-if="isProductionBox(rowItem)" :rows="rowItem.rows" />
                    <CardRenderTileComponent v-else-if="isTile(rowItem)" :item="rowItem"/>
                </div>
            </div>
        </div>
        <CardDescription v-if="hasDescription()" :item="effectData.description" />
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRenderItemComponent from '@/components/card/CardRenderItemComponent.vue';
import CardRenderSymbolComponent from '@/components/card/CardRenderSymbolComponent.vue';
import {ItemType, CardRenderEffect, CardRenderProductionBox, CardRenderTile} from '@/cards/render/CardRenderer';
import CardProductionBoxComponent from '@/components/card/CardProductionBoxComponent.vue';
import CardRenderTileComponent from '@/components/card/CardRenderTileComponent.vue';
import {CardRenderSymbol} from '@/cards/render/CardRenderSymbol';
import {CardRenderItem} from '@/cards/render/CardRenderItem';

import CardDescription from '@/components/card/CardDescription.vue';

export default Vue.extend({
  name: 'CardRenderEffectBoxComponent',
  props: {
    effectData: {
      type: Object as () => CardRenderEffect,
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
    isItem(rowItem: ItemType): rowItem is CardRenderItem {
      return rowItem instanceof CardRenderItem;
    },
    isSymbol(rowItem: ItemType): rowItem is CardRenderSymbol {
      return rowItem instanceof CardRenderSymbol;
    },
    isProductionBox(rowItem: ItemType): rowItem is CardRenderProductionBox {
      return rowItem instanceof CardRenderProductionBox;
    },
    isTile(rowItem: ItemType): rowItem is CardRenderTile {
      return rowItem instanceof CardRenderTile;
    },
    hasDescription(): boolean {
      return this.effectData.description !== undefined;
    },
  },
});

</script>

