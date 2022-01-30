<template>
    <tr>
      <td>{{icon}}</td>
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
    Rewards,
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
