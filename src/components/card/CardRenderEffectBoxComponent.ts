import Vue from 'vue';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {CardRenderEffect, CardRenderProductionBox} from '../../cards/render/CardRenderer';
import {CardProductionBoxComponent} from './CardProductionBoxComponent';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardDescription} from './CardDescription';

export const CardRenderEffectBoxComponent = Vue.component('CardRenderEffectBoxComponent', {
  props: {
    data: {
      type: Object as () => CardRenderEffect,
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
    CardRenderSymbolComponent,
    CardProductionBoxComponent,
    CardDescription,
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-effect-box'];
      return classes.join(' ');
    },
    getComponentType: function(rowItem: CardRenderSymbol | CardRenderItem): string {
      if (rowItem instanceof CardRenderSymbol) {
        return 'symbol';
      } else if (rowItem instanceof CardRenderProductionBox) {
        return 'production';
      } else if (rowItem instanceof CardRenderItem) {
        return 'item';
      }
      return '';
    },
  },
  template: `
      <div :class="getClasses()">
        <div class="card-effect-box-row">
            <div v-if="data.delimiter !== undefined" class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in data.cause" class="card-effect-box-item" :key="rowIndex">
                  <CardRenderItemComponent v-if="getComponentType(rowItem) === 'item'" :item="rowItem"/>
                  <CardRenderSymbolComponent v-else-if="getComponentType(rowItem) === 'symbol'" :item="rowItem" />
                </div>
            </div>
            <CardRenderSymbolComponent v-if="data.delimiter !== undefined" :item="data.delimiter" />
            <div class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in data.effect" class="card-effect-box-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="getComponentType(rowItem) === 'item'" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="getComponentType(rowItem) === 'symbol'" :item="rowItem" />
                    <CardProductionBoxComponent v-else-if="getComponentType(rowItem) === 'production'" :rows="rowItem.rows" />
                </div>
            </div>
        </div>
        <CardDescription :text="data.description" />
      </div>
    `,
});
