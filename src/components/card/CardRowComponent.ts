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
    componentData: {
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
      return this.componentData instanceof CardRenderItem;
    },
    isSymbol: function(): boolean {
      return this.componentData instanceof CardRenderSymbol;
    },
    isProduction: function(): boolean {
      return this.componentData instanceof CardRenderProductionBox;
    },
    isEffect: function(): boolean {
      return this.componentData instanceof CardRenderEffect;
    },
  },
  template: ` 
        <CardRenderItemComponent v-if="isItem()" :item="componentData"/>
        <CardRenderSymbolComponent v-else-if="isSymbol()" :item="componentData" />
        <CardProductionBoxComponent v-else-if="isProduction()" :rows="componentData.rows" />
        <CardRenderEffectBoxComponent v-else-if="isEffect()" :effectData="componentData" />
        <div v-else>n/a</div>
    `,
});
