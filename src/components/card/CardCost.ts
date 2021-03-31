import Vue from 'vue';
import {PreferencesManager} from './../PreferencesManager';

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
      const hideDiscount = PreferencesManager.loadBooleanValue('hide_discount_on_cards');
      return this.newCost !== undefined && this.newCost !== this.amount && !hideDiscount;
    },
  },
  template: `
    <div>
        <div :class="getClasses()">{{ amount === null ? 0 : amount }}</div>
        <template v-if="displayTwoCosts()">
          <div class="card-cost-transition"></div>
          <div class="card-old-cost">{{ newCost }}</div>
        </template>
    </div>
    `,
});
