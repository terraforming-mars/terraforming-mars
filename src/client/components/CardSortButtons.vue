<template>
  <div class="card-sort-buttons">
    <span v-i18n>Sort by:</span>
    <button v-for="option in sortOptions" :key="option.key" class="btn btn-tiny" :data-test="'sort-by-' + option.key" @click="$emit('update:sortOrder', sortOrderClicked(sortOrder, option.key))">
      <span v-i18n>{{ option.label }}</span>
      <span v-if="sortOrder?.key === option.key" class="sort-arrow">{{ sortOrder.reversed ? '▲' : '▼' }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {SortOrder, sortOrderClicked, SORT_OPTIONS} from '@/client/utils/SortOrder';

export default defineComponent({
  name: 'CardSortButtons',
  props: {
    sortOrder: {
      type: Object as () => SortOrder | undefined,
      required: false,
    },
  },
  emits: ['update:sortOrder'],
  computed: {
    sortOptions(): typeof SORT_OPTIONS {
      return SORT_OPTIONS;
    },
  },
  methods: {
    sortOrderClicked,
  },
});
</script>
