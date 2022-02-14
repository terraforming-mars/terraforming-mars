<template>
    <tr>
      <td>{{icon}}</td>
      <td v-for="idx in range" :key="idx" :class="getClass(idx)">
        <planetary-track-rewards :type="type" v-if="idx <= rewards.spaces.length && rewards.spaces[idx] !== undefined" :rewards="rewards.spaces[idx]" :gameOptions="gameOptions" />
      </td>
    </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import {range} from '@/common/utils/utils';
import {PlanetaryTrack as Track} from '@/common/pathfinders/PlanetaryTrack';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import PlanetaryTrackRewards from './PlanetaryTrackRewards.vue';

export default Vue.extend({
  name: 'PlanetaryTrack',
  props: {
    val: {
      type: Number,
    },
    type: String as () => 'risingPlayer' | 'everyone' | 'mostTags',
    rewards: {
      type: Object as () => Track,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
  },
  data() {
    return {
      range: range(23),
    };
  },
  components: {
    PlanetaryTrackRewards,
  },
  methods: {
    getClass(idx: number): String {
      return (idx === this.val) ? 'highlight' : '';
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
