<template>
<div class="reward">
  <div :class="outerClass">
    <div :class="getClass" />
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {Reward} from '@/common/pathfinders/Reward';

export default Vue.extend({
  name: 'PlanetaryTrackReward',
  props: {
    reward: {
      type: String as () => Reward,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
  },
  computed: {
    getClass(): string {
      switch (this.reward) {
      case '3mc':
        return 'reward-3mc';
      case '6mc':
        return 'reward-6mc';
      case 'any_resource':
        return 'std-wild-resource';
      case 'card':
        return 'card';
      case 'city':
        return 'tag-city-count tag-size-big';
      case 'delegate':
        return 'delegate';
      case 'energy':
      case 'energy_production':
        return 'resource_icon resource_icon--energy';
      case 'floater':
        return 'floater';
      case 'greenery':
        return 'greenery';
      case 'heat':
      case 'heat_production':
        return 'resource_icon resource_icon--heat';
      case 'moon_mine':
        return 'card-play-moon-mine--S';
      case 'moon_road':
        return 'card-play-moon-road--S';
      case 'ocean':
        return 'ocean';
      case 'plant':
      case 'plant_production':
        return 'resource_icon resource_icon--plants';
      case 'resource':
        return 'std-wild-resource';
      case 'steel':
      case 'steel_production':
        return 'resource_icon resource_icon--steel';
      case 'titanium':
      case 'titanium_production':
        return 'resource_icon resource_icon--titanium';
      case 'tr':
        return 'tag-tr tag-size-big';
      case 'venus_scale':
        return 'venus-scale';
      default:
        return '';
      }
    },
    outerClass(): string {
      switch (this.reward) {
      case '1vp':
        return 'card-points vp1';
      case '2vp':
        return 'card-points vp2';
      case '3mc':
        return 'reward-3mc';
      case '6mc':
        return 'reward-6mc';
      case 'energy_production':
      case 'heat_production':
      case 'plant_production':
      case 'steel_production':
      case 'titanium_production':
        return 'card-production-box';
      default:
        return '';
      }
    },
  },
  components: {
  },
  data() {
    return {
    };
  },
});

</script>

