<template>
  <div v-if="space !== undefined" :class="getMainClass()" :data_space_id="space.id">
    <board-space-tile
      :space="space"
      :aresExtension="aresExtension"
      :tileView="tileView"
    ></board-space-tile>
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <bonus :bonus="space.bonus" v-if="showBonus"></bonus>
    <template v-if="tileView === 'coords'">
      <div class="board-space-coords">({{ space.y }}, {{ space.x }}) ({{ space.id }})</div>
    </template>
    <template v-if="tileView === 'show'">
      <div :class="playerColorCss" v-if="space.color !== undefined"></div>
      <template v-if="space.gagarin !== undefined">
        <div v-if="space.gagarin === 0" class='gagarin'></div>
        <div v-else class='gagarin visited'></div>
      </template>
      <template v-if="space.cathedral === true">
        <div class='board-cube--cathedral'></div>
      </template>
      <template v-if="space.nomads === true">
        <div class='board-cube--nomad'></div>
      </template>
      <template v-if="space.undergroundResources !== undefined">
        <underground-resources
          :space="space"
          :tileView="tileView"
        ></underground-resources>
      </template>
    </template>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Bonus from '@/client/components/Bonus.vue';
import BoardSpaceTile from '@/client/components/board/BoardSpaceTile.vue';
import UndergroundResources from '@/client/components/board/UndergroundResources.vue';
import {TileView} from '@/client/components/board/TileView';
import {SpaceModel} from '@/common/models/SpaceModel';
import {getPreferences} from '../utils/PreferencesManager';

export default Vue.extend({
  name: 'board-space',
  props: {
    space: {
      type: Object as () => SpaceModel | undefined,
    },
    text: {
      type: String,
    },
    aresExtension: {
      type: Boolean,
    },
    tileView: {
      type: String as () => TileView,
    },
  },
  data() {
    return {};
  },
  components: {
    'bonus': Bonus,
    'board-space-tile': BoardSpaceTile,
    'underground-resources': UndergroundResources,
  },
  methods: {
    getMainClass(): string {
      let css = 'board-space board-space-' + this.space?.id.toString();
      css += ' board-space-selectable';
      return css;
    },
  },
  computed: {
    showBonus(): boolean {
      return this.space?.tileType === undefined || this.tileView === 'hide';
    },
    playerColorCss(): string {
      if (this.space?.color === undefined) {
        return '';
      }
      const css = 'board-cube board-cube--' + this.space.color;
      return getPreferences().symbol_overlay ? css + ' overlay' : css;
    },
  },
});

</script>

