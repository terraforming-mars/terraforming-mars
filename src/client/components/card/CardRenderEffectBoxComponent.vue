<template>
      <div :class="getClasses()">
        <div class="card-effect-box-row">
            <div v-if="delimiter !== undefined && cause !== undefined" class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in cause" class="card-effect-box-item" :key="rowIndex">
                  <CardRenderItemComponent v-if="isItem(rowItem)" :item="(rowItem as ICardRenderItem)"/>
                  <CardRenderSymbolComponent v-else-if="isSymbol(rowItem)" :item="(rowItem as ICardRenderSymbol)" />
                  <CardProductionBoxComponent v-else-if="isProductionBox(rowItem)" :rows="(rowItem as ICardRenderProductionBox).rows" />
                  <CardRenderTileComponent v-if="isTile(rowItem)" :item="(rowItem as ICardRenderTile)"/>
                </div>
            </div>
            <CardRenderSymbolComponent v-if="delimiter !== undefined" :item="(delimiter as ICardRenderSymbol)" />
            <div class="card-effect-box-content">
                <div v-for="(rowItem, rowIndex) in effect" class="card-effect-box-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="isItem(rowItem)" :item="(rowItem as ICardRenderItem)"/>
                    <CardRenderSymbolComponent v-else-if="isSymbol(rowItem)" :item="(rowItem as ICardRenderSymbol)" />
                    <CardProductionBoxComponent v-else-if="isProductionBox(rowItem)" :rows="(rowItem as ICardRenderProductionBox).rows" />
                    <CardRenderTileComponent v-else-if="isTile(rowItem)" :item="(rowItem as ICardRenderTile)"/>
                </div>
            </div>
        </div>
        <CardDescription v-if="description" :item="description" />
      </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {ICardRenderEffect, ICardRenderItem, ICardRenderProductionBox, ICardRenderSymbol, ICardRenderTile, isICardRenderItem, isICardRenderProductionBox} from '@/common/cards/render/Types';
import CardProductionBoxComponent from '@/client/components/card/CardProductionBoxComponent.vue';
import CardRenderTileComponent from '@/client/components/card/CardRenderTileComponent.vue';
import {isICardRenderSymbol, isICardRenderTile, ItemType} from '@/common/cards/render/Types';
import CardDescription from '@/client/components/card/CardDescription.vue';

const props = defineProps<{
  effectData: ICardRenderEffect;
}>();

function getClasses(): string {
  return 'card-effect-box';
}

const isItem = isICardRenderItem;
const isSymbol = isICardRenderSymbol;
const isProductionBox = isICardRenderProductionBox;
const isTile = isICardRenderTile;

const cause = computed<Array<ItemType> | undefined>(() => {
  return props.effectData.rows[0];
});

const delimiter = computed<ItemType>(() => {
  if (cause.value?.length === 0) {
    return undefined;
  }
  return props.effectData.rows[1][0];
});

const effect = computed<Array<ItemType>>(() => {
  return props.effectData.rows[2];
});

const description = computed<ItemType>(() => {
  return props.effectData.rows[2].slice(-1)[0];
});
</script>
