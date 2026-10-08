<template>
  <div class="tag-count tooltip tooltip-bottom" :class="classes" :data-tooltip="$t(tag)" ></div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
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
      required: true,
    },
    type: {
      type: String,
    },
  },
  computed: {
    classes(): Array<string> {
      const classes = [`tag-${this.tag}`];
      if (this.size !== undefined) {
        classes.push(`tag-size-${this.size}`);
      }
      if (this.type !== undefined) {
        classes.push(`tag-type-${this.type}`);
      }
      return classes;
    },
  },
});
</script>
