import Vue from 'vue';

export const CardCost = Vue.component('CardCost', {
  props: {
    amount: {
      type: Number as () => number | undefined,
    },
    newCost: {
      type: Number as () => number | undefined,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['card-cost'];
      if (this.amount === undefined) {
        classes.push('visibility-hidden');
      } else if (this.newCost !== undefined && this.newCost !== this.amount) {
        classes.push('reduced-cost');
      }
      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()">{{ newCost !== undefined ? newCost : (amount === null ? 0 : amount) }}</div>
    `,
});
