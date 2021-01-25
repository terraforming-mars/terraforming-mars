import Vue from 'vue';

export const PlayerTagDiscount = Vue.component('PlayerTagDiscount', {
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['player-tag-discount'];
      return classes.join(' ');
    },
    getMegacreditsClasses: function(): string {
      const classes = ['megacredits-container'];
      return classes.join(' ');
    },
    getAmount: function(): number {
      return this.amount * -1;
    },
  },
  template: `
    <div :class="getClasses()">
      <div class="megacredits-container">
        <div class="megacredits">{{ getAmount() }}</div>
      </div>
    </div>
  `,
});
