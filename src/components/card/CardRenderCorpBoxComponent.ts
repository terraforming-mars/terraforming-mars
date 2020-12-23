import Vue from 'vue';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardRenderEffectBoxComponent} from './CardRenderEffectBoxComponent';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {CardRenderEffect} from '../../cards/render/CardRenderer';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';

export const CardRenderCorpBoxComponent = Vue.component('CardRenderCorpBoxComponent', {
  props: {
    rows: {
      type: Array as () => Array<CardRenderEffect | CardRenderItem | CardRenderSymbol>,
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
    getClasses: function(): string {
      const classes: Array<string> = ['card-corporation-box'];
      return classes.join(' ');
    },
    getComponentType: function(rowItem: CardRenderEffect | CardRenderItem | CardRenderSymbol): string {
      if (rowItem instanceof CardRenderSymbol) {
        return 'symbol';
      } else if (rowItem instanceof CardRenderEffect) {
        return 'effect';
      } else if (rowItem instanceof CardRenderItem) {
        return 'item';
      }
      return '';
    },
  },
  template: `
      <div :class="getClasses()">
          <div class="card-corporation-label">{{ label }}</div>
          <div v-for="(rowData, index) in rows[0]" :key="index">
            <CardRenderItemComponent v-if="getComponentType(rowData) === 'item'" :item="rowData" />
            <CardRenderSymbolComponent v-else-if="getComponentType(rowData) === 'symbol'" :item="rowData" />
            <CardRenderEffectBoxComponent v-if="getComponentType(rowData) === 'effect'" :effectData="rowData" />
          </div>
      </div>
    `,
});
