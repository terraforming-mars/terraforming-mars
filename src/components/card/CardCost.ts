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
      return classes.join(' ');
    },
    displayTwoCosts: function(): boolean {
      return this.newCost !== undefined && this.newCost !== this.amount;
    },
  },
  template: `
    <div v-if="amount !== undefined">
        <div :class="getClasses()">{{ newCost !== undefined ? newCost : (amount === null ? 0 : amount) }}</div>
        <div :class="'card-old-cost'" v-if="displayTwoCosts()">{{amount}}</div>
    </div>
    `,
});
