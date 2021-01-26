import Vue from 'vue';

export const JovianMultiplier = Vue.component('JovianMultiplier', {
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['player-jovian-multiplier'];
      return classes.join(' ');
    },
  },
  template: `
    <div :class="getClasses()">{{ amount }}</div>
  `,
});
