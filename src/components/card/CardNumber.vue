<template>
  <div class="card-nr-outer"><span class="card-nr-inner" v-if="showCardNumber()">{{ number }}</span></div>
</template>

<script lang="ts">
import Vue from 'vue';
import {PreferencesManager} from '../PreferencesManager';

export default Vue.extend({
  name: 'CardNumber',
  props: {
    number: {
      type: String,
      required: true,
    },
  },
  methods: {
    showCardNumber: function(): boolean {
      return PreferencesManager.load('show_card_number') === '1';
    },
  },
});
</script>

<style lang="less" scoped>
</style>
