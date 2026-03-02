<template>
    <tr>
      <td><div class="track-icon">{{icon}}</div></td>
      <td v-for="idx in range" :key="idx" :class="getClass(idx)">
        <planetary-track-rewards :type="type" v-if="idx <= rewards.spaces.length && rewards.spaces[idx] !== undefined" :rewards="rewards.spaces[idx]" :gameOptions="gameOptions" />
      </td>
    </tr>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import {range} from '@/common/utils/utils';
import {PlanetaryTrack as Track} from '@/common/pathfinders/PlanetaryTrack';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import PlanetaryTrackRewards from './PlanetaryTrackRewards.vue';

export default defineComponent({
  name: 'PlanetaryTrack',
  props: {
    val: {
      type: Number,
      required: true,
    },
    type: {
      type: String as () => 'risingPlayer' | 'everyone' | 'mostTags',
      required: true,
    },
    rewards: {
      type: Object as () => Track,
      required: true,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
      required: true,
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
