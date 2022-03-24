<template>
  <div>
    <div :class="getClasses()">{{ amount === null ? 0 : amount }}</div>
    <template v-if="displayTwoCosts()">
      <div class="card-cost-transition"></div>
      <div class="card-old-cost">{{ newCost }}</div>
    </template>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {getPreferences} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'CardCost',
  props: {
    amount: {
      type: Number as () => number | undefined,
    },
    newCost: {
      type: Number as () => number | undefined,
    },
  },
  methods: {
    getClasses(): string {
      const classes = ['card-cost'];
      if (this.amount === undefined) {
        classes.push('visibility-hidden');
      }
      return classes.join(' ');
    },
    displayTwoCosts(): boolean {
      const hideDiscount = getPreferences().hide_discount_on_cards;
      return this.newCost !== undefined && this.newCost !== this.amount && !hideDiscount;
    },
  },
});

</script>

