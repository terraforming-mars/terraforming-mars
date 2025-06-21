<template>
    <div :class="outerClass">
        <Tag :tag="tag" :size="size" :type="type"/>
        <span :class="innerClass">{{ count }}</span>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Tag from '@/client/components/Tag.vue';
import {Tag as CardTag} from '@/common/cards/Tag';
import {SpecialTags} from '@/client/cards/SpecialTags';

export default Vue.extend({
  name: 'tag-count',
  props: {
    tag: {
      type: String as () => CardTag|SpecialTags|'escape',
    },
    count: {
      type: Number as () => Number | String,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
    showWhenZero: {
      // When true, show even if the value is zero.
      required: false,
      default: false,
    },
  },
  components: {
    Tag,
  },
  computed: {
    outerClass(): string {
      const classes = ['tag-display'];
      if (this.count === 0 && this.showWhenZero === false) {
        classes.push('tag-no-show');
      }
      return classes.join(' ');
    },
    innerClass(): string {
      const classes = ['tag-count-display'];
      if (this.count === 0 && this.showWhenZero === false) {
        classes.push('tag-count-no-show');
      }

      return classes.join(' ');
    },
  },
});
</script>

