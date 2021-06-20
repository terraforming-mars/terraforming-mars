import Vue from 'vue';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {CardRenderEffect, CardRenderProductionBox, CardRenderTile} from '../../cards/render/CardRenderer';
import {CardProductionBoxComponent} from './CardProductionBoxComponent';
import {CardRenderTileComponent} from './CardRenderTileComponent';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItem} from '../../cards/render/CardRenderItem';

import CardDescription from './CardDescription.vue';

export const CardRenderEffectBoxComponent = Vue.component('CardRenderEffectBoxComponent', {
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
      const classes: Array<string> = ['card-effect-box'];
      return classes.join(' ');
    },
    getComponentType: function(rowItem: CardRenderSymbol | CardRenderItem | CardRenderTile): string {
      if (rowItem instanceof CardRenderSymbol) {
        return 'symbol';
      } else if (rowItem instanceof CardRenderProductionBox) {
        return 'production';
      } else if (rowItem instanceof CardRenderItem) {
        return 'item';
      } else if (rowItem instanceof CardRenderTile) {
        return 'tile';
      }
      return '';
    },
    hasDescription: function(): boolean {
      return this.effectData.description !== undefined;
    },
  },
  // TODO (chosta): add cardCauseEffectComponent to reduce repetition
  template: `
      <div :class="getClasses()">
        <div class="card-effect-box-row">
            <div v-if="effectData.delimiter !== undefined" class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in effectData.cause" class="card-effect-box-item" :key="rowIndex"> 
                  <CardRenderItemComponent v-if="getComponentType(rowItem) === 'item'" :item="rowItem"/>
                  <CardRenderSymbolComponent v-else-if="getComponentType(rowItem) === 'symbol'" :item="rowItem" />
                  <CardProductionBoxComponent v-else-if="getComponentType(rowItem) === 'production'" :rows="rowItem.rows" />
                  <CardRenderTileComponent v-if="getComponentType(rowItem) === 'tile'" :item="rowItem"/>
                </div>
            </div>
            <CardRenderSymbolComponent v-if="effectData.delimiter !== undefined" :item="effectData.delimiter" />
            <div class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in effectData.effect" class="card-effect-box-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="getComponentType(rowItem) === 'item'" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="getComponentType(rowItem) === 'symbol'" :item="rowItem" />
                    <CardProductionBoxComponent v-else-if="getComponentType(rowItem) === 'production'" :rows="rowItem.rows" />
                    <CardRenderTileComponent v-if="getComponentType(rowItem) === 'tile'" :item="rowItem"/>
                </div>
            </div>
        </div>
        <CardDescription v-if="hasDescription()" :item="effectData.description" />
      </div>
    `,
});
