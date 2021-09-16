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
import {CardRenderItem} from '@/cards/render/CardRenderItem';
import {isIDescription} from '@/cards/render/ICardRenderDescription';
import {CardRenderSymbol} from '@/cards/render/CardRenderSymbol';
import {CardRenderProductionBox, ItemType} from '@/cards/render/CardRenderer';
import {CardRenderTile} from '@/cards/render/CardRenderer';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardProductionBoxComponent from '@/client/components/card/CardProductionBoxComponent.vue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';
import CardRenderCorpBoxComponent from '@/client/components/card/CardRenderCorpBoxComponent.vue';
import CardRenderTileComponent from '@/client/components/card/CardRenderTileComponent.vue';
import CardDescription from '@/client/components/card/CardDescription.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {CardRenderEffect, CardRenderCorpBoxEffect, CardRenderCorpBoxAction} from '@/cards/render/CardRenderer';

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
    isItem(): boolean {
      return this.componentData instanceof CardRenderItem;
    },
    isSymbol(): boolean {
      return this.componentData instanceof CardRenderSymbol;
    },
    isProduction(item: ItemType): item is CardRenderProductionBox {
      return item instanceof CardRenderProductionBox;
    },
    isEffect(): boolean {
      return this.componentData instanceof CardRenderEffect;
    },
    isDescription(): boolean {
      return typeof this.componentData === 'string' || this.componentData instanceof String || isIDescription(this.componentData);
    },
    isTile(): boolean {
      return this.componentData instanceof CardRenderTile;
    },
    isCorpBox(item: ItemType): item is CardRenderCorpBoxEffect | CardRenderCorpBoxAction {
      return item instanceof CardRenderCorpBoxEffect || item instanceof CardRenderCorpBoxAction;
    },
    corpBoxLabel(): string {
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
