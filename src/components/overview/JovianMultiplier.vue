<template>
  <div class="player-jovian-multiplier">{{ amount }}</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'JovianMultiplier',
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {},
});
</script>

<style lang="less" scoped>
</style>
