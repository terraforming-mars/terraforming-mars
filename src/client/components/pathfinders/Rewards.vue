<template>
  <div class="rewards_cont">
    <span v-if="mostTags">!&nbsp;</span>
    <Reward v-for="(reward, idx) in myReward" :reward="reward" :key="idx" :gameOptions="gameOptions"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/models/GameOptionsModel';
import {PlanetaryTrackSpace} from '@/pathfinders/PlanetaryTrack';
import Reward from './Reward.vue';
import {Reward as R} from '@/pathfinders/Reward'; // UGH.

export default Vue.extend({
  name: 'Rewards',
  props: {
    rewards: {
      type: Object as () => PlanetaryTrackSpace,
    },
    type: {
      type: String as () => 'risingPlayer' | 'everyone',
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
  },
  components: {
    Reward,
  },
  data() {
    return {
    };
  },
  computed: {
    myReward(): Array<R> {
      switch (this.type) {
      case 'risingPlayer':
        return this.rewards.risingPlayer;
      case 'everyone':
        return this.rewards.everyone.concat(this.rewards.mostTags);
      // case 'mostTags': There is no most tags track in this view.
      //   return this.rewards.mostTags;
      default:
        return [];
      }
    },
    mostTags(): boolean {
      return this.type === 'everyone' && this.rewards.mostTags.length > 0;
    },
  },
});

</script>

