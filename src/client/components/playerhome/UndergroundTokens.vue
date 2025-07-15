<template>
  <div class="player_home_block--underground-tokens">
    <div v-for="(token, idx) in underworldData.tokens" :key="idx">
        <div class="underground-token-background" :class="border(idx)"></div>
        <div :class="'underground-token-resource underground-token--' + token"></div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {UnderworldPlayerData} from '@/common/underworld/UnderworldPlayerData';

export default Vue.extend({
  name: 'UndergroundTokens',
  props: {
    underworldData: {
      type: Object as () => UnderworldPlayerData,
    },
  },
  methods: {
    border(idx: number): string {
      return idx === this.activeIdx ? 'underworld-token-border' : '';
    },
  },
  computed: {
    activeIdx(): number {
      const tokens = this.underworldData.tokens;
      let idx: number = tokens.length - 1;
      while (idx >= 0) {
        if (tokens[idx] === this.underworldData.activeBonus) {
          return idx;
        }
        idx--;
      }
      return -1;
    },
  },
});
</script>
