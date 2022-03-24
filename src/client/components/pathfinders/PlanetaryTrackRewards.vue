<template>
  <div class="rewards_cont">
    <span v-if="mostTags">!&nbsp;</span>
    <planetary-track-reward v-for="(reward, idx) in myReward" :reward="reward" :key="idx" :gameOptions="gameOptions"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {PlanetaryTrackSpace} from '@/common/pathfinders/PlanetaryTrack';
import PlanetaryTrackReward from './PlanetaryTrackReward.vue';
import {Reward} from '@/common/pathfinders/Reward';

export default Vue.extend({
  name: 'PlanetaryTrackRewards',
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
    PlanetaryTrackReward,
  },
  data() {
    return {
    };
  },
  computed: {
    myReward(): Array<Reward> {
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

