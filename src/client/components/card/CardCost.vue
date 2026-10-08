<template>
  <div>
    <div class="card-cost" :class="{'visibility-hidden': amount === undefined}">{{ amount }}</div>
    <template v-if="displayTwoCosts">
      <div class="card-cost-transition"></div>
      <div class="card-old-cost">{{ newCost }}</div>
    </template>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {getPreferences} from '@/client/utils/PreferencesManager';

export default defineComponent({
  name: 'CardCost',
  props: {
    amount: {
      type: Number as () => number | undefined,
      default: undefined,
    },
    newCost: {
      type: Number as () => number | undefined,
      default: undefined,
    },
  },
  computed: {
    displayTwoCosts(): boolean {
      const hideDiscount = getPreferences().hide_discount_on_cards;
      return this.newCost !== undefined && this.newCost !== this.amount && !hideDiscount;
    },
  },
});

</script>

