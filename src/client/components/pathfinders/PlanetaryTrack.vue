<template>
    <tr>
      <td><div :class="iconClass"></div></td>
      <td v-for="idx in range" :key="idx" :class="getClass(idx)">
        <PlanetaryTrackRewards :type="type" v-if="idx <= rewards.spaces.length && rewards.spaces[idx] !== undefined" :rewards="rewards.spaces[idx]" :gameOptions="gameOptions" />
      </td>
    </tr>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
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
    iconClass(): string {
      switch (this.type) {
      case 'risingPlayer': return 'track-icon track-icon--rising-player';
      case 'everyone': return 'track-icon track-icon--everyone';
      default: return '';
      }
    },
  },
});
</script>
