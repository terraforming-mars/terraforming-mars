<template>
    <tr  :class="getRowClass(type)">
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
      if (this.type==="middle") {
        if (idx === this.val) {
          return `step-highlight track-tag-${this.trackName}`
        }
        return 'step-empty'
      }
      else return "";
    },
    getRowClass(type: string): String {
      if (type==="middle") {
        return 'middle-row'
      }
      else return "";
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
