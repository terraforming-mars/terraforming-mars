import Vue from 'vue';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItem} from '../../cards/render/CardRenderItem';

export const CardProductionBoxComponent = Vue.component('CardProductionBoxComponent', {
  props: {
    rows: {
      type: Array as () => Array<Array<CardRenderItem>>,
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
    CardRenderSymbolComponent,
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-production-box'];
      return classes.join(' ');
    },
    getComponentType: function(rowItem: CardRenderSymbol | CardRenderItem): string {
      if (rowItem instanceof CardRenderSymbol) {
        return 'symbol';
      } else if (rowItem instanceof CardRenderItem) {
        return 'item';
      }
      return '';
    },
  },
  template: `
        <div :class="getClasses()">
            <div class="card-production-box-row" v-for="(rowData, index) in rows" :key="index">
                <div v-for="(rowItem, rowIndex) in rowData" class="card-production-box-row-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="getComponentType(rowItem) === 'item'" :item="rowItem"/>
                    <CardRenderSymbolComponent v-else-if="getComponentType(rowItem) === 'symbol'" :item="rowItem" />
                    <div v-else>n/a</div>
                </div>
            </div>
        </div>
    `,
});
