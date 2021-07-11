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
import CardRenderItemComponent from './CardRenderItemComponent.vue';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {ItemType, CardRenderEffect, CardRenderProductionBox, CardRenderTile} from '../../cards/render/CardRenderer';
import CardProductionBoxComponent from './CardProductionBoxComponent.vue';
import {CardRenderTileComponent} from './CardRenderTileComponent';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItem} from '../../cards/render/CardRenderItem';

import CardDescription from './CardDescription.vue';

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
    getClasses: function(): string {
      return 'card-effect-box';
    },
    isItem: function(rowItem: ItemType): rowItem is CardRenderItem {
      return rowItem instanceof CardRenderItem;
    },
    isSymbol: function(rowItem: ItemType): rowItem is CardRenderSymbol {
      return rowItem instanceof CardRenderSymbol;
    },
    isProductionBox: function(rowItem: ItemType): rowItem is CardRenderProductionBox {
      return rowItem instanceof CardRenderProductionBox;
    },
    isTile: function(rowItem: ItemType): rowItem is CardRenderTile {
      return rowItem instanceof CardRenderTile;
    },
    hasDescription: function(): boolean {
      return this.effectData.description !== undefined;
    },
  },
});

</script>

