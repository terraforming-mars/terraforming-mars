<template>
  <div :class="getClasses()" />
</template>

<script lang="ts">

import Vue from 'vue';
import {Tag} from '@/common/cards/Tag';

export default Vue.extend({
  name: 'Tag',
  props: {
    tag: {
      type: String as () => Tag,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  methods: {
    getClasses(): string {
      const classes = ['tag-count'];
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
