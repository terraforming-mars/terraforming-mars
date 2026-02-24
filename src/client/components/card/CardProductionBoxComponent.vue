<template>
        <div :class="getClasses()">
            <div class="card-production-box-row" v-for="(rowData, index) in rows" :key="index">
                <div v-for="(rowItem, rowIndex) in rowData" class="card-production-box-row-item" :key="rowIndex">
                    <CardRenderItemComponent v-if="rowItem && typeof rowItem === 'object' && rowItem.is === 'item'" :item="(rowItem as any)"/>
                    <CardRenderSymbolComponent v-else-if="rowItem && typeof rowItem === 'object' && rowItem.is === 'symbol'" :item="(rowItem as any)" />
                    <div v-else>n/a</div>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {ItemType} from '@/common/cards/render/Types';

defineProps<{
  rows: Array<Array<ItemType>>;
}>();

function getClasses(): string {
  const classes: Array<string> = ['card-production-box'];
  return classes.join(' ');
}
</script>
