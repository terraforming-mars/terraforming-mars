<template>
  <div class="player_home_block--underground-tokens">
    <div v-for="(token, idx) in underworldData.tokens" :key="idx">
        <div class="underground-token-background" :class="border(token)"></div>
        <div :class="'underground-token-resource underground-token--' + token.token"></div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ClaimedToken, UnderworldPlayerData} from '@/common/underworld/UnderworldPlayerData';

export default Vue.extend({
  name: 'UndergroundTokens',
  props: {
    underworldData: {
      type: Object as () => UnderworldPlayerData,
    },
  },
  methods: {
    border(token: ClaimedToken): string {
      return token.active ? 'underworld-token-border' : '';
    },
  },
});
</script>
