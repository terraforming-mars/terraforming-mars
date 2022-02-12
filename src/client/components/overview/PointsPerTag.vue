<template>
  <div :class="classes()">{{ amount }}</div>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'PointsPerTag',
  props: {
    amount: {
      type: String,
    },
  },
  methods: {
    classes() {
      return this.amount.length === 1 ?
        'points-per-tag' :
        'points-per-tag points-per-tag--S';
    },
  },
});
</script>
