import Vue from 'vue';

export const CardCost = Vue.component('CardCost', {
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['card-cost'];
      if (this.amount === undefined) {
        classes.push('visibility-hidden');
      }
      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()">{{ amount === null ? 0 : amount }}</div>
    `,
});
