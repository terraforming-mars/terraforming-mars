<template>
    <div :class="getClasses()">
        <Tag :tag="tag" :size="size" :type="type"/>
        <span :class="getCountClasses()">{{ getCount() }}</span>
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
      type: Number,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
    hideCount: {
      required: false,
      type: Boolean,
    },
  },
  components: {
    Tag,
  },
  methods: {
    getClasses(): string {
      const classes = ['tag-display'];
      if (this.count === 0 && this.tag !== 'escape') {
        classes.push('tag-no-show');
      }
      return classes.join(' ');
    },
    getCountClasses(): string {
      const classes = ['tag-count-display'];
      if (this.count === 0 && this.tag !== 'escape') {
        classes.push('tag-count-no-show');
      }

      return classes.join(' ');
    },
    getCount(): number | string {
      return this.hideCount === true ? '?' : this.count;
    },
  },
});
</script>

