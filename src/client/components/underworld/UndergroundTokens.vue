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

import {defineComponent} from '@/client/vue3-compat';
import {ClaimedToken, UnderworldPlayerData} from '@/common/underworld/UnderworldPlayerData';
import UndergroundToken from './UndergroundToken.vue';

export default defineComponent({
  name: 'UndergroundTokens',
  components: {
    UndergroundToken,
  },
  props: {
    underworldData: {
      type: Object as () => UnderworldPlayerData,
      required: true,
    },
  },
  methods: {
    border(token: ClaimedToken): string {
      return token.active ? 'underground-token-border' : '';
    },
  },
});
</script>
