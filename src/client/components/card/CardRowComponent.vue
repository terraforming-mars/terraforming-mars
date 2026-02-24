<template>
  <CardRenderItemComponent v-if="isItem(componentData)" :item="(componentData as any)"/>
  <CardRenderSymbolComponent v-else-if="isSymbol(componentData)" :item="(componentData as any)" />
  <CardProductionBoxComponent v-else-if="isProduction(componentData)" :rows="(componentData as any).rows" />
  <CardRenderEffectBoxComponent v-else-if="isEffect(componentData)" :effectData="(componentData as any)" />
  <CardRenderTileComponent v-else-if="isTile(componentData)" :item="(componentData as any)" />
  <CardDescription v-else-if="isDescription(componentData)" :item="componentData" />
  <CardRenderCorpBoxComponent v-else-if="isCorpBox(componentData)" :rows="(componentData as any).rows" :label="corpBoxLabel()" />
  <div v-else>n/a</div>
</template>

<script setup lang="ts">
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

const props = defineProps<{
  componentData: ItemType;
}>();

const isItem = isICardRenderItem;
const isSymbol = isICardRenderSymbol;
const isEffect = isICardRenderEffect;
const isProduction = isICardRenderProductionBox;
const isTile = isICardRenderTile;

function isDescription(componentData: ItemType): boolean {
  return typeof componentData === 'string' || componentData instanceof String || isIDescription(props.componentData);
}

function isCorpBox(item: ItemType): item is ICardRenderCorpBoxEffect | ICardRenderCorpBoxAction | ICardRenderCorpBoxEffectAction {
  return isICardRenderCorpBoxEffect(item) || isICardRenderCorpBoxAction(item) || isICardRenderCorpBoxEffectAction(item);
}

function corpBoxLabel(): string {
  if (isICardRenderCorpBoxEffect(props.componentData)) {
    return 'effect';
  } else if (isICardRenderCorpBoxAction(props.componentData)) {
    return 'action';
  } else if (isICardRenderCorpBoxEffectAction(props.componentData)) {
    return 'effect/action';
  }
  return 'n/a';
}
</script>
