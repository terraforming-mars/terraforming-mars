<template>
  <div class="card-resources-counter">
      <span class="card-resources-counter-number"> {{ amount }}</span>
      <span class="card-resource" :class="cssClass"></span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardResource} from '@/common/CardResource';
import {cardResourceCSS} from '../common/cardResources';

export default Vue.extend({
  name: 'CardResourceCounter',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String as () => CardResource,
      required: true,
    },
  },
  computed: {
    cssClass(): string {
      return cardResourceCSS[this.type];
    },
  },
});

</script>

