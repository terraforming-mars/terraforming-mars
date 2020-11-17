import Vue from 'vue';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderProductionBox} from '../../cards/render/CardRenderer';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardProductionBoxComponent} from './CardProductionBoxComponent';
import {CardRenderEffectBoxComponent} from './CardRenderEffectBoxComponent';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {CardRenderEffect} from '../../cards/render/CardRenderer';

export const CardRowComponent = Vue.component('CardRowComponent', {
  props: {
    data: {
      type: Object as () => CardRenderItem | CardRenderProductionBox | CardRenderSymbol | CardRenderEffect,
      required: true,
    },
  },
  components: {
    CardRenderSymbolComponent,
    CardRenderItemComponent,
    CardProductionBoxComponent,
    CardRenderEffectBoxComponent,
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
    isEffect: function(): boolean {
      return this.data instanceof CardRenderEffect;
    },
  },
  template: ` 
        <CardRenderItemComponent v-if="isItem()" :item="data"/>
        <CardRenderSymbolComponent v-else-if="isSymbol()" :item="data" />
        <CardProductionBoxComponent v-else-if="isProduction()" :rows="data.rows" />
        <CardRenderEffectBoxComponent v-else-if="isEffect()" :data="data" />
        <div v-else>n/a</div>
    `,
});
