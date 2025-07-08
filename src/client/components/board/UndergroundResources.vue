<template>
  <div>
    <template v-if="this.space.undergroundResources !== undefined">
      <div class="underground-token-background"></div>
      <div :class='resourceClass'></div>
    </template>
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
  },
});

</script>
