<template>
  <div :class="getClasses()"><span v-i18n>{{ title }}</span><span v-if="withAdditional" class="label-additional">{{ additional }}</span></div>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import {playerColorClass} from '@/common/utils/utils';
import {Color} from '@/common/Color';

export default defineComponent({
  name: 'DynamicTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String as () => Color,
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
