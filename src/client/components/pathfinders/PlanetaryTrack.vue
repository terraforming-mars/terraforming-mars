<template>
    <tr :class="getRowClass(type)">
      <td v-for="idx in range" :key="idx" :class="getClass(idx)">
        <Rewards :type="type" v-if="idx <= rewards.spaces.length && rewards.spaces[idx] !== undefined" :rewards="rewards.spaces[idx]" :gameOptions="gameOptions" />
      </td>
    </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import Rewards from '@/client/components/pathfinders/Rewards.vue';
import {range} from '@/utils/utils';
import {PlanetaryTrack as Track} from '@/pathfinders/PlanetaryTrack';
import {GameOptionsModel} from '@/models/GameOptionsModel';

const transitions = new Map([
  ['venus', 15],
  ['earth', 17],
  ['mars', 18],
  ['jovian', 18],
  ['moon', 10],
]);

export default Vue.extend({
  name: 'PlanetaryTrack',
  props: {
    val: {
      type: Number,
    },
    type: String as () => 'risingPlayer' | 'everyone' | 'mostTags' | 'middle',
    rewards: {
      type: Object as () => Track,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
    trackName: {
      type: String,
    },
  },
  data() {
    return {
      range: range(23),
    };
  },
  components: {
    Rewards,
  },
  methods: {
    getClass(idx: number): String {
      if (this.type === 'middle') {
        const colorClass = (transitions.get(this.trackName) ?? 30) > idx ? 'shadow-step' : 'light-step';
        console.log(this.trackName, transitions.get(this.trackName), idx, colorClass);
        if (idx === this.val) {
          return `step-highlight track-tag-${this.trackName}`;
        } else {
          const stepClass = this.hasReward(idx) ? 'step-reward' : 'step-empty';
          return `${stepClass} ${colorClass}`;
        }
      } else return '';
    },
    getRowClass(type: string): String {
      if (type==='middle') {
        return 'middle-row';
      } else return '';
    },
    hasReward(idx: number): Boolean {
      const space = this.rewards.spaces[idx];
      return space !== undefined && space.everyone.length + space.risingPlayer.length + space.mostTags.length > 0;
    },
  },
  computed: {
    icon(): string {
      switch (this.type) {
      case 'risingPlayer': return '^';
      case 'everyone': return '*';
      case 'mostTags': return '!';
      default: return '';
      }
    },
  },
});
</script>
