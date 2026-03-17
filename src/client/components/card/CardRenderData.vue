<template>
  <div class="card-rows">
    <CardRowData v-for="(cardData, i) in renderData.rows" :rowData="cardData" :key="i" />
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {ICardRenderRoot} from '@/common/cards/render/Types';
import CardRowData from '@/client/components/card/CardRowData.vue';

export default defineComponent({
  name: 'CardRenderData',
  props: {
    renderData: {
      type: Object as () => ICardRenderRoot,
      required: true,
    },
  },
  components: {
    CardRowData,
  },
});

</script>

