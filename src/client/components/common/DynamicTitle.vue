<template>
  <div :class="getClasses()"><span v-i18n>{{ title }}</span><span v-if="withAdditional" class="label-additional">{{ additional }}</span></div>
</template>

<script lang="ts">
import Vue from 'vue';
import {playerColorClass} from '@/common/utils/utils';

export default Vue.extend({
  name: 'DynamicTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    withAdditional: {
      type: Boolean,
      default: false,
    },
    additional: {
      type: [String, Number],
      default: '',
    },
  },
  methods: {
    getClasses(): string {
      return [
        playerColorClass(this.color, 'shadow'),
        'dynamic-title',
      ].join(' ');
    },
  },
});
</script>
