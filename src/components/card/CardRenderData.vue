<template>
  <div class="card-rows">
    <CardRowData v-for="(cardData, i) in renderData.rows" :rowData="cardData" :key="i" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderer} from '@/cards/render/CardRenderer';
import CardRowData from '@/components/card/CardRowData.vue';

export default Vue.extend({
  name: 'CardRenderData',
  props: {
    renderData: {
      type: Object as () => CardRenderer,
      required: true,
    },
  },
  components: {
    CardRowData,
  },
});

</script>

