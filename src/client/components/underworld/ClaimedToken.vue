<template>
  <div>
    <div class="underground-token-background" :class="border"></div>
    <div :class="'underground-token-resource underground-token--' + token"></div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ClaimedToken} from '@/common/underworld/UnderworldPlayerData';

export default Vue.extend({
  name: 'ClaimedToken',
  props: {
    token: {
      type: Object as () => ClaimedToken,
    },
  },
  computed: {
    border(): string {
      return this.token.active ? 'underworld-token-border' : '';
    },
  },
});
</script>
