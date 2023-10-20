<template>
  <div :class="getMainClass()" :data_space_id="space.id">
    <board-space-tile
      :space="space"
      :aresExtension="aresExtension"
      :tileView="tileView"
    ></board-space-tile>
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <bonus :bonus="space.bonus" v-if="showBonus"></bonus>
    <div :class="'board-cube board-cube--'+space.color" v-if="space.color !== undefined && tileView === 'show'"></div>
    <template v-if="tileView === 'coords'">
      <div class="board-space-coords">({{ space.y }}, {{ space.x }}) ({{ space.id }})</div>
    </template>
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
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Bonus from '@/client/components/Bonus.vue';
import BoardSpaceTile from '@/client/components/board/BoardSpaceTile.vue';
import {TileView} from '@/client/components/board/TileView';
import {SpaceModel} from '@/common/models/SpaceModel';

export default Vue.extend({
  name: 'board-space',
  props: {
    space: {
      type: Object as () => SpaceModel,
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
  },
  methods: {
    getMainClass(): string {
      let css = 'board-space board-space-' + this.space.id.toString();
      css += ' board-space-selectable';
      return css;
    },
  },
  computed: {
    showBonus(): boolean {
      return this.space.tileType === undefined || this.tileView === 'hide';
    },
  },
});

</script>

