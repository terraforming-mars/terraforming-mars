<template>
  <div :class="wrapper">
    <div class="underground-token-background" :class="style + ' ' + border"></div>
    <div :class="style + ' ' + tokenClass"></div>
    <div :class="shelter"></div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {ClaimedToken} from '@/common/underworld/UnderworldPlayerData';

export default defineComponent({
  name: 'UndergroundToken',
  props: {
    token: {
      type: Object as () => ClaimedToken,
      required: true,
    },
    location: {
      type: String as () => 'board' | 'player-home' | 'tag-count',
      required: true,
    },
  },
  computed: {
    wrapper(): string {
      return 'underground-token-wrapper--' + this.location;
    },
    border(): string {
      return this.token.active ? 'underground-token-border' : '';
    },
    style(): string {
      return 'underground-token-style--' + this.location;
    },
    tokenClass(): string {
      return 'underground-token--' + this.token.token;
    },
    shelter(): string {
      return this.token.shelter ? 'underground-token-shelter' : '';
    },
  },
});
</script>
