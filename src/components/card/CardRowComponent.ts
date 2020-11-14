import Vue from 'vue';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderProductionBox} from '../../cards/render/CardRenderer';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardProductionBoxComponent} from './CardProductionBoxComponent';

export const CardRowComponent = Vue.component('CardRowComponent', {
  props: {
    data: {
      type: Object as () => CardRenderItem,
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
    CardProductionBoxComponent,
  },
  methods: {
    isItem: function(): boolean {
      return this.data instanceof CardRenderItem;
    },

    isProduction: function(): boolean {
      return this.data instanceof CardRenderProductionBox;
    },
  },
  template: ` 
        <CardRenderItemComponent v-if="isItem()" :item="data"/>
        <CardProductionBoxComponent v-else-if="isProduction()" :rows="data.rows" />
        <div v-else>n/a</div>
    `,
});
