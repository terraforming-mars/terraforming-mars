<template>
  <div class="player_home_block--underground-tokens">
    <div v-for="(token, idx) in underworldData.tokens" :key="idx">
      <claimed-token :token="token"></claimed-token>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {UnderworldPlayerData} from '@/common/underworld/UnderworldPlayerData';
import ClaimedToken from '@/client/components/underworld/ClaimedToken.vue';
export default Vue.extend({
  name: 'UndergroundTokens',
  props: {
    underworldData: {
      type: Object as () => UnderworldPlayerData,
    },
  },
  components: {
    ClaimedToken,
  },
});
</script>
