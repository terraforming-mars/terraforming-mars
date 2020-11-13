import Vue from 'vue';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderProductionBox} from '../../cards/render/CardRenderer';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardProductionBoxComponent} from './CardProductionBoxComponent';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';

export const CardRowComponent = Vue.component('CardRowComponent', {
  props: {
    data: {
      type: Object as () => CardRenderItem | CardRenderProductionBox | CardRenderSymbol,
      required: true,
    },
  },
  components: {
    CardRenderSymbolComponent,
    CardRenderItemComponent,
    CardProductionBoxComponent,
  },
  methods: {
    isItem: function(): boolean {
      return this.data instanceof CardRenderItem;
    },
    isSymbol: function(): boolean {
      return this.data instanceof CardRenderSymbol;
    },
    isProduction: function(): boolean {
      return this.data instanceof CardRenderProductionBox;
    },
  },
  template: ` 
        <CardRenderItemComponent v-if="isItem()" :item="data"/>
        <CardRenderSymbolComponent v-else-if="isSymbol()" :item="data" />
        <CardProductionBoxComponent v-else-if="isProduction()" :data="data.rows" />
        <div v-else>n/a</div>
    `,
});
