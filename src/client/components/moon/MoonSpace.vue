<template>
  <div :class="mainClass" :data_space_id="space.id" :title="verboseTitle">
    <div :class="tileClass" data-test="tile"/>
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <bonus v-if="space.tileType === undefined || hideTiles" :bonus="space.bonus" />
    <div
      v-if="space.color !== undefined && !hideTiles"
      class="board-cube"
      :class="`board-cube--${space.color}`"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {SpaceModel} from '@/models/SpaceModel';
import {TileType} from '@/TileType';
import Bonus from '@/client/components/Bonus.vue';

const tileTypeToCssClass = new Map<TileType, string>([
  [TileType.MOON_ROAD, 'road'],
  [TileType.MOON_COLONY, 'colony'],
  [TileType.MOON_MINE, 'mine'],
  [TileType.LUNA_TRADE_STATION, 'luna-trade-station'],
  [TileType.LUNA_MINING_HUB, 'luna-mining-hub'],
  [TileType.LUNA_TRAIN_STATION, 'luna-train-station'],
  [TileType.LUNAR_MINE_URBANIZATION, 'lunar-mine-urbanization'],
]);

export default Vue.extend({
  name: 'MoonSpace',
  props: {
    space: {
      type: Object as () => SpaceModel,
    },
    text: {
      type: String,
    },
    is_selectable: {
      type: Boolean,
    },
    hideTiles: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Bonus,
  },
  computed: {
    verboseTitle(): string {
      // TODO - Add i18n for this title
      let ret = '';
      if (this.space.tileType === TileType.LUNA_TRADE_STATION) {
        ret = 'Luna Trade Station';
      } else if (this.space.tileType === TileType.LUNA_MINING_HUB) {
        ret = 'Luna Mining Hub';
      } else if (this.space.tileType === TileType.LUNA_TRAIN_STATION) {
        ret = 'Luna Train Station';
      }
      return this.$t(ret);
    },
    mainClass(): string {
      let css = 'board-space moon-space-' + this.space.id.toString();

      if (this.is_selectable) {
        css += ' board-space-selectable';
      }

      if (this.space.spaceType === 'lunar_mine') {
        css += ' moon-space-type-mine';
      } else {
        css += ' moon-space-type-other';
      }

      return css;
    },
    tileClass(): string {
      let css = 'board-space';
      const tileType = this.space.tileType;

      if (tileType !== undefined) {
        switch (this.space.tileType) {
        case TileType.MOON_COLONY:
          css += ' board-space-tile--colony';
          break;
        case TileType.MOON_ROAD:
          css += ' board-space-tile--road';
          break;
        case TileType.MOON_MINE:
          css += ' board-space-tile--mine';
          break;
        default:
          const cssClass = tileTypeToCssClass.get(tileType);
          css += ' board-space-tile--' + cssClass;
        }
      }

      if (this.hideTiles) {
        css += ' board-hidden-tile';
      }

      return css;
    },
  },
});
</script>
