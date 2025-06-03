<template>
  <div>
    <build-benefit v-if="idx <= 2" :metadata="metadata" :idx="idx"></build-benefit>
    <div v-if="player !== undefined" class="occupied-colony-space">
      <div :class="`board-cube colony-cube board-cube--${player}`"></div>
    </div>
    <div v-if="marker" class="colony-track-marker"></div>
  </div>
</template>
<script lang="ts">

import Vue from 'vue';

import {ColonyName} from '@/common/colonies/ColonyName';
import {IColonyMetadata} from '@/common/colonies/IColonyMetadata';
import BuildBenefit from './BuildBenefit.vue';
import {Color} from '@/common/Color';

export default Vue.extend({
  components: {BuildBenefit},
  name: 'ColonyRow',
  props: {
    idx: {
      type: Number,
    },
    metadata: {
      type: Object as () => IColonyMetadata,
      required: true,
    },
    player: {
      type: String as () => Color | undefined,
    },
    marker: {
      type: Boolean,
    },
  },
  computed: {
    ColonyName(): typeof ColonyName {
      return ColonyName;
    },
  },
});
</script>
