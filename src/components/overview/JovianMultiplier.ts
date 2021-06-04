import Vue from 'vue';

export const JovianMultiplier = Vue.component('JovianMultiplier', {
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {
    // keep
  },
  template: `
    <div class="player-jovian-multiplier">{{ amount }}</div>
  `,
});
