<template>
      <div :class="getClasses()">
          <div class="card-corporation-label">{{ label }}</div>
          <div v-for="(rowData, index) in rows[0]" :key="index">
            <CardRenderItemComponent v-if="rowData && typeof rowData === 'object' && rowData.is === 'item'" :item="(rowData as any)" />
            <CardRenderSymbolComponent v-else-if="rowData && typeof rowData === 'object' && rowData.is === 'symbol'" :item="(rowData as any)" />
            <CardRenderEffectBoxComponent v-if="rowData && typeof rowData === 'object' && rowData.is === 'effect'" :effectData="(rowData as any)" />
          </div>
      </div>
</template>

<script setup lang="ts">
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {ItemType} from '@/common/cards/render/Types';

defineProps<{
  rows: Array<Array<ItemType>>;
  label: string;
}>();

function getClasses(): string {
  const classes: Array<string> = ['card-corporation-box'];
  return classes.join(' ');
}
</script>
