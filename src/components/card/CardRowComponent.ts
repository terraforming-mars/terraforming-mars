import Vue from 'vue';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {isIDescription} from '../../cards/render/ICardRenderDescription';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderProductionBox} from '../../cards/render/CardRenderer';
import {CardRenderTile} from '../../cards/render/CardRenderer';
import {CardRenderItemComponent} from './CardRenderItemComponent';
import {CardProductionBoxComponent} from './CardProductionBoxComponent';
import {CardRenderEffectBoxComponent} from './CardRenderEffectBoxComponent';
import {CardRenderCorpBoxComponent} from './CardRenderCorpBoxComponent';
import {CardRenderTileComponent} from './CardRenderTileComponent';
import CardDescription from './CardDescription.vue';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';
import {CardRenderEffect, CardRenderCorpBoxEffect, CardRenderCorpBoxAction} from '../../cards/render/CardRenderer';

export const CardRowComponent = Vue.component('CardRowComponent', {
  props: {
    componentData: {
      type: Object as () => CardRenderItem | CardRenderProductionBox | CardRenderSymbol | CardRenderEffect | CardRenderTile | CardRenderCorpBoxEffect | CardRenderCorpBoxAction,
      required: true,
    },
  },
  components: {
    CardRenderSymbolComponent,
    CardRenderItemComponent,
    CardProductionBoxComponent,
    CardRenderEffectBoxComponent,
    CardRenderCorpBoxComponent,
    CardRenderTileComponent,
    CardDescription,
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
    isDescription: function(): boolean {
      return typeof this.componentData === 'string' || this.componentData instanceof String || isIDescription(this.componentData);
    },
    isTile: function(): boolean {
      return this.componentData instanceof CardRenderTile;
    },
    isCorpBox: function(): boolean {
      return this.componentData instanceof CardRenderCorpBoxEffect || this.componentData instanceof CardRenderCorpBoxAction;
    },
    corpBoxLabel: function(): string {
      if (this.componentData instanceof CardRenderCorpBoxEffect) {
        return 'effect';
      } else if (this.componentData instanceof CardRenderCorpBoxAction) {
        return 'action';
      }
      return 'n/a';
    },

  },
  template: ` 
        <CardRenderItemComponent v-if="isItem()" :item="componentData"/>
        <CardRenderSymbolComponent v-else-if="isSymbol()" :item="componentData" />
        <CardProductionBoxComponent v-else-if="isProduction()" :rows="componentData.rows" />
        <CardRenderEffectBoxComponent v-else-if="isEffect()" :effectData="componentData" />
        <CardRenderTileComponent v-else-if="isTile()" :item="componentData" />
        <CardDescription v-else-if="isDescription()" :item="componentData" />
        <CardRenderCorpBoxComponent v-else-if="isCorpBox()" :rows="componentData.rows" :label="corpBoxLabel()" />
        <div v-else>n/a</div>
    `,
});
