<template>
  <div>
    <template v-if="this.space.undergroundResources !== undefined">
      <div class="underground-token-background"></div>
      <div :class='resourceClass'></div>
    </template>
    <div v-if="this.space.excavator !== undefined" :class='excavatorClass'></div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {SpaceModel} from '@/common/models/SpaceModel';
import {TileView} from './TileView';

export default Vue.extend({
  name: 'underground-resources',
  props: {
    space: {
      type: Object as () => SpaceModel,
    },
    tileView: {
      type: String as () => TileView,
    },

  },
  computed: {
    resourceClass(): string {
      return 'underground-token-resource underground-token--' + this.space.undergroundResources;
    },
    excavatorClass(): string {
      return ' underground-excavator underground-excavator--' + this.space.excavator;
    },
  },
});

</script>
