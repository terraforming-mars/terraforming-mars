<template>
  <div class="player-tag-discount">
    <div class="megacredits-container">
      <div class="megacredits">{{ getAmount() }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PlayerTagDiscount',
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {
    getAmount(): number {
      return this.amount * -1;
    },
  },
});
</script>
