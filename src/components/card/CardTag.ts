import Vue from 'vue';
import {Tags} from '../../cards/Tags';

export const CardTag = Vue.component('CardTag', {
  props: {
    index: {
      type: Number,
      required: true,
      validator: (i) => i < 4,
    },
    type: {
      type: String,
      required: true,
      validator: (type: Tags) => Object.values(Tags).includes(type),
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['card-tag'];
      classes.push(`tag-${this.type.toLocaleLowerCase()}`);

      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()" />
    `,
});
