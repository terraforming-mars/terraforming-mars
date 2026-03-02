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

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {ItemType} from '@/common/cards/render/Types';

export default defineComponent({
  name: 'CardRenderCorpBoxComponent',
  props: {
    rows: {
      type: Array as () => Array<Array<ItemType>>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  components: {
    CardRenderSymbolComponent,
    CardRenderItemComponent,
    CardRenderEffectBoxComponent,
  },
  methods: {
    getClasses(): string {
      const classes: Array<string> = ['card-corporation-box'];
      return classes.join(' ');
    },
  },
});

</script>

