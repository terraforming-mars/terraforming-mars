<template>
  <div class="card-nr-outer"><span class="card-nr-inner" v-if="showCardNumber">{{ number }}</span></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'CardNumber',
  props: {
    number: {
      type: String,
      required: true,
    },
  },
  computed: {
    showCardNumber(): boolean {
      return PreferencesManager.INSTANCE.values().show_card_number;
    },
  },
});

</script>

