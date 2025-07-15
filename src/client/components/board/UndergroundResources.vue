<template>
  <div>
    <div class="underground-token-background"></div>
    <div :class='resourceClass'></div>
  </div>
</template>

<script lang="ts">

import {UndergroundResourceToken} from '@/common/underworld/UndergroundResourceToken';
import Vue from 'vue';

export default Vue.extend({
  name: 'underground-resources',
  props: {
    token: {
      type: String as () => UndergroundResourceToken,
    },
  },
  computed: {
    resourceClass(): string {
      return 'underground-token-resource underground-token--' + this.token;
    },
  },
});

</script>
