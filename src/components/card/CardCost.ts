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
      }
      return classes.join(' ');
    },
    displayTwoCosts: function(): boolean {
      return this.newCost !== undefined && this.newCost !== this.amount;
    },
  },
  template: `
    <div>
        <div :class="getClasses()">{{ newCost !== undefined ? newCost : (amount === null ? 0 : amount) }}</div>
        <div :class="'card-old-cost'" v-if="displayTwoCosts()">{{amount}}</div>
    </div>
    `,
});
