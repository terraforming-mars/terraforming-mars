import Vue from 'vue';

export const PlayerTagDiscount = Vue.component('PlayerTagDiscount', {
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {
    getAmount: function(): number {
      return this.amount * -1;
    },
  },
  template: `
    <div class="player-tag-discount">
      <div class="megacredits-container">
        <div class="megacredits">{{ getAmount() }}</div>
      </div>
    </div>
  `,
});
