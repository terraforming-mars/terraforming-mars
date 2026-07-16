<template>
  <div class="player_home_block--underground-tokens">
    <div class="underground-tokens">
      <underground-token
      v-for="(token, idx) in underworldData.tokens"
      :token="token"
      :key="idx"
      location="player-home"
      ></underground-token>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ClaimedToken, UnderworldPlayerData} from '@/common/underworld/UnderworldPlayerData';

export default Vue.extend({
  name: 'UndergroundTokens',
  components: {
    UndergroundToken: () => import('./UndergroundToken.vue'),
  },
  props: {
    underworldData: {
      type: Object as () => UnderworldPlayerData,
    },
  },
  methods: {
    border(token: ClaimedToken): string {
      return token.active ? 'underground-token-border' : '';
    },
  },
});
</script>
