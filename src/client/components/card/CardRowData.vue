<template>
        <div class="card-row">
            <CardRowComponent v-for="(componentData, i) in rowData" :componentData="componentData" :key="i" />
        </div>
</template>

<script setup lang="ts">
import CardRowComponent from '@/client/components/card/CardRowComponent.vue';
import {ItemType} from '@/common/cards/render/Types';

defineProps<{
  rowData: Array<ItemType>;
}>();
</script>
