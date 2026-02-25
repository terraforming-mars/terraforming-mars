<template>
        <div class="card-row">
            <CardRowComponent v-for="(componentData, i) in rowData" :componentData="componentData" :key="i" />
        </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import CardRowComponent from '@/client/components/card/CardRowComponent.vue';
import {ItemType} from '@/common/cards/render/Types';

export default defineComponent({
  name: 'CardRowData',
  props: {
    rowData: {
      type: Array as () => Array<ItemType>,
      required: true,
    },
  },
  components: {
    CardRowComponent,
  },
});

</script>

