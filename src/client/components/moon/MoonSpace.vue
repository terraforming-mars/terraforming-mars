<template>
  <div :class="mainClass" :data_space_id="space.id">
    <board-space-tile
      :space="space"
      :aresExtension="false"
      :tileView="tileView"
    ></board-space-tile>
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <bonus v-if="space.tileType === undefined || tileView === 'hide'" :bonus="space.bonus" />
    <template v-if="tileView === 'coords'">
      <div class="board-space-coords">({{ space.y }}, {{ space.x }}) ({{ space.id }})</div>
    </template>
    <div
      v-if="space.color !== undefined && tileView === 'show'"
      class="board-cube"
      :class="`board-cube--${space.color}`"
    />
    <div
      v-if="space.coOwner !== undefined && tileView === 'show'"
      class="board-cube-coOwner"
      :class="`board-cube--${space.coOwner}`"
    />

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {SpaceModel} from '@/common/models/SpaceModel';
import Bonus from '@/client/components/Bonus.vue';
import {TileView} from '../board/TileView';
import BoardSpaceTile from '@/client/components/board/BoardSpaceTile.vue';

export default Vue.extend({
  name: 'MoonSpace',
  props: {
    space: {
      type: Object as () => SpaceModel,
    },
    text: {
      type: String,
      required: false,
    },
    tileView: {
      type: String as () => TileView,
      default: 'show',
    },
  },
  components: {
    Bonus,
    'board-space-tile': BoardSpaceTile,
  },
  computed: {
    mainClass(): string {
      let css = 'board-space moon-space-' + this.space.id.toString();
      css += ' board-space-selectable';

      if (this.space.spaceType === 'lunar_mine') {
        css += ' moon-space-type-mine';
      } else {
        css += ' moon-space-type-other';
      }

      return css;
    },
  },
});
</script>
