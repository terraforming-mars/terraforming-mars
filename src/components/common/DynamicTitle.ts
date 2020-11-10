import Vue from 'vue';
import {playerColorClass} from '../../utils/utils';

export const DynamicTitle = Vue.component('dynamic-title', {
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
    getClasses: function(): string {
      return [
        playerColorClass(this.color, 'shadow'),
        'dynamic-title',
      ].join(' ');
    },
  },

  template: `
        <div :class="getClasses()"><span v-i18n>{{ title }}</span><span v-if="withAdditional" class="label-additional">{{ additional }}</span></div>
    `,
});
