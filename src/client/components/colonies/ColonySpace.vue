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

import {defineComponent} from '@/client/vue3-compat';

import {ColonyName} from '@/common/colonies/ColonyName';
import {ColonyMetadata} from '@/common/colonies/ColonyMetadata';
import BuildBenefit from './BuildBenefit.vue';
import {Color} from '@/common/Color';

export default defineComponent({
  components: {BuildBenefit},
  name: 'ColonyRow',
  props: {
    idx: {
      type: Number,
      required: true,
    },
    metadata: {
      type: Object as () => ColonyMetadata,
      required: true,
    },
    player: {
      type: String as () => Color | undefined,
      default: undefined,
    },
    marker: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ColonyName(): typeof ColonyName {
      return ColonyName;
    },
  },
});
</script>
