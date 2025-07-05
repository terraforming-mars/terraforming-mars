<template>
  <CardRenderItemComponent v-if="isItem(componentData)" :item="componentData"/>
  <CardRenderSymbolComponent v-else-if="isSymbol(componentData)" :item="componentData" />
  <CardProductionBoxComponent v-else-if="isProduction(componentData)" :rows="componentData.rows" />
  <CardRenderEffectBoxComponent v-else-if="isEffect(componentData)" :effectData="componentData" />
  <CardRenderTileComponent v-else-if="isTile(componentData)" :item="componentData" />
  <CardDescription v-else-if="isDescription(componentData)" :item="componentData" />
  <CardRenderCorpBoxComponent v-else-if="isCorpBox(componentData)" :rows="componentData.rows" :label="corpBoxLabel()" />
  <div v-else>n/a</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {isIDescription} from '@/common/cards/render/ICardRenderDescription';
import {
  ICardRenderCorpBoxAction,
  ICardRenderCorpBoxEffect,
  ICardRenderCorpBoxEffectAction,
  isICardRenderCorpBoxAction,
  isICardRenderCorpBoxEffect,
  isICardRenderCorpBoxEffectAction,
  isICardRenderEffect,
  isICardRenderItem,
  isICardRenderProductionBox,
  isICardRenderSymbol,
  isICardRenderTile,
  ItemType,
} from '@/common/cards/render/Types';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardProductionBoxComponent from '@/client/components/card/CardProductionBoxComponent.vue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';
import CardRenderCorpBoxComponent from '@/client/components/card/CardRenderCorpBoxComponent.vue';
import CardRenderTileComponent from '@/client/components/card/CardRenderTileComponent.vue';
import CardDescription from '@/client/components/card/CardDescription.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';

export default Vue.extend({
  name: 'CardRowComponent',
  props: {
    componentData: {
      type: Object as () => ItemType,
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
    isItem: isICardRenderItem,
    isSymbol: isICardRenderSymbol,
    isEffect: isICardRenderEffect,
    isDescription(componentData: ItemType): boolean {
      return typeof componentData === 'string' || componentData instanceof String || isIDescription(this.componentData);
    },
    isTile: isICardRenderTile,
    isProduction: isICardRenderProductionBox,
    isCorpBoxEffect: isICardRenderCorpBoxEffect,
    isCorpBoxAction: isICardRenderCorpBoxAction,
    isCorpBoxEffectAction: isICardRenderCorpBoxEffectAction,
    isCorpBox(item: ItemType): item is ICardRenderCorpBoxEffect | ICardRenderCorpBoxAction | ICardRenderCorpBoxEffectAction {
      return this.isCorpBoxEffect(item) || this.isCorpBoxAction(item) || this.isCorpBoxEffectAction(item);
    },
    corpBoxLabel(): string {
      if (this.isCorpBoxEffect(this.componentData)) {
        return 'effect';
      } else if (this.isCorpBoxAction(this.componentData)) {
        return 'action';
      } else if (this.isCorpBoxEffectAction(this.componentData)) {
        return 'effect/action'
      }
      return 'n/a';
    },

  },
});

</script>
