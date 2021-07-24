<template>
        <CardRenderItemComponent v-if="isItem()" :item="componentData"/>
        <CardRenderSymbolComponent v-else-if="isSymbol()" :item="componentData" />
        <CardProductionBoxComponent v-else-if="isProduction(componentData)" :rows="componentData.rows" />
        <CardRenderEffectBoxComponent v-else-if="isEffect()" :effectData="componentData" />
        <CardRenderTileComponent v-else-if="isTile()" :item="componentData" />
        <CardDescription v-else-if="isDescription()" :item="componentData" />
        <CardRenderCorpBoxComponent v-else-if="isCorpBox(componentData)" :rows="componentData.rows" :label="corpBoxLabel()" />
        <div v-else>n/a</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {isIDescription} from '../../cards/render/ICardRenderDescription';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderProductionBox, ItemType} from '../../cards/render/CardRenderer';
import {CardRenderTile} from '../../cards/render/CardRenderer';
import CardRenderItemComponent from './CardRenderItemComponent.vue';
import CardProductionBoxComponent from './CardProductionBoxComponent.vue';
import CardRenderEffectBoxComponent from './CardRenderEffectBoxComponent.vue';
import CardRenderCorpBoxComponent from './CardRenderCorpBoxComponent.vue';
import CardRenderTileComponent from './CardRenderTileComponent.vue';
import CardDescription from './CardDescription.vue';
import CardRenderSymbolComponent from './CardRenderSymbolComponent.vue';
import {CardRenderEffect, CardRenderCorpBoxEffect, CardRenderCorpBoxAction} from '../../cards/render/CardRenderer';

export default Vue.extend({
  name: 'CardRowComponent',
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
    isProduction: function(item: ItemType): item is CardRenderProductionBox {
      return item instanceof CardRenderProductionBox;
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
    isCorpBox: function(item: ItemType): item is CardRenderCorpBoxEffect | CardRenderCorpBoxAction {
      return item instanceof CardRenderCorpBoxEffect || item instanceof CardRenderCorpBoxAction;
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
});

</script>
