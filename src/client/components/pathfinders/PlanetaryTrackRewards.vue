<template>
  <div class="rewards_cont">
    <span v-if="mostTags">!&nbsp;</span>
    <planetary-track-reward v-for="(reward, idx) in myReward" :reward="reward" :key="idx" :gameOptions="gameOptions"/>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {PlanetaryTrackSpace} from '@/common/pathfinders/PlanetaryTrack';
import PlanetaryTrackReward from './PlanetaryTrackReward.vue';
import {Reward} from '@/common/pathfinders/Reward';

export default defineComponent({
  name: 'PlanetaryTrackRewards',
  props: {
    rewards: {
      type: Object as () => PlanetaryTrackSpace,
      required: true,
    },
    type: {
      type: String as () => 'risingPlayer' | 'everyone',
      required: true,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
      required: true,
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
    myReward(): ReadonlyArray<Reward> {
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

