<template>
  <div class="card-rows">
    <CardRowData v-for="(cardData, i) in renderData.rows" :rowData="cardData" :key="i" />
  </div>
</template>

<script setup lang="ts">
import {ICardRenderRoot} from '@/common/cards/render/Types';
import CardRowData from '@/client/components/card/CardRowData.vue';

defineProps<{
  renderData: ICardRenderRoot;
}>();
</script>
