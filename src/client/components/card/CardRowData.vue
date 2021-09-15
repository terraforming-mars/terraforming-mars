<template>
        <div class="card-row">
            <CardRowComponent v-for="(componentData, i) in rowData" :componentData="componentData" :key="i" />
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRowComponent from '@/client/components/card/CardRowComponent.vue';

export default Vue.extend({
  name: 'CardRowData',
  props: {
    rowData: {
      type: Array,
      required: true,
    },
  },
  components: {
    CardRowComponent,
  },
});

</script>

