<template>
  <div :class="getClasses()" :data-tooltip="$t(tag)" />
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {Tag} from '@/common/cards/Tag';

export default defineComponent({
  name: 'Tag',
  props: {
    tag: {
      type: String as () => Tag,
      required: true,
    },
    size: {
      type: String,
      default: undefined,
    },
    type: {
      // e.g. main or secondary
      type: String,
      default: undefined,
    },
  },
  methods: {
    getClasses(): string {
      const classes = ['tag-count', 'tooltip', 'tooltip-bottom'];
      classes.push(`tag-${this.tag}`);
      if (this.size !== undefined) {
        classes.push(`tag-size-${this.size}`);
      }
      if (this.type !== undefined) {
        classes.push(`tag-type-${this.type}`);
      }
      return classes.join(' ');
    },
  },
});
</script>
