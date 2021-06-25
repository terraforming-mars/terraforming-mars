import Vue from 'vue';
import {SpaceModel} from '../../models/SpaceModel';
import {TileType} from '../../TileType';
import {$t} from '../../directives/i18n';
import Bonus from '../Bonus.vue';

const tileTypeToCssClass = new Map<TileType, string>([
  [TileType.MOON_ROAD, 'road'],
  [TileType.MOON_COLONY, 'colony'],
  [TileType.MOON_MINE, 'mine'],
  [TileType.LUNA_TRADE_STATION, 'luna-trade-station'],
  [TileType.LUNA_MINING_HUB, 'luna-mining-hub'],
  [TileType.LUNA_TRAIN_STATION, 'luna-train-station'],
  [TileType.LUNAR_MINE_URBANIZATION, 'lunar-mine-urbanization'],
]);

export const MoonSpace = Vue.component('moon-space', {
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
  },
  data: function() {
    return {};
  },
  components: {
    'bonus': Bonus,
  },
  methods: {
    getVerboseTitle: function(tileType: TileType | undefined): string {
      let ret: string = '';
      if (tileType === TileType.LUNA_TRADE_STATION) {
        ret = 'Luna Trade Station';
      } else if (tileType === TileType.LUNA_MINING_HUB) {
        ret = 'Luna Mining Hub';
      } else if (tileType === TileType.LUNA_TRAIN_STATION) {
        ret = 'Luna Train Station';
      }
      return $t(ret);
    },
    getMainClass: function(): string {
      let css = 'board-space moon-space-' + this.space.id.toString();
      if (this.is_selectable) {
        css += ' board-space-selectable';
      }
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
      } else {
        if (this.space.spaceType === 'lunar_mine') {
          css += ' moon-space-type-mine';
        } else {
          css += ' moon-space-type-other';
        }
      }

      return css;
    },
  },
  template: `
        <div :class="getMainClass()" :data_space_id="space.id" :title="getVerboseTitle(space.tileType)">
            <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
            <bonus :bonus="space.bonus" v-if="space.tileType === undefined"></bonus>
            <div :class="'board-cube board-cube--'+space.color" v-if="space.color !== undefined"></div>
        </div>
    `,
});
