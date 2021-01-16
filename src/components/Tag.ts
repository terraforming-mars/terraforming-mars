import Vue from 'vue';
import {Tags} from '../cards/Tags';

export const Tag = Vue.component('tag', {
  props: {
    tag: {
      type: String as () => Tags,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  methods: {
    getClasses: function(): string {
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
  template: '<div :class="getClasses()" />',
});
