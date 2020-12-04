import Vue from 'vue';
import {CardRenderTile} from '../../cards/render/CardRenderer';
import {generateClassString} from '../../utils/utils';
import {TileType} from '../../TileType';

export const CardRenderTileComponent = Vue.component('CardRenderTileComponent', {
  props: {
    item: {
      type: Object as () => CardRenderTile,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes: string[] = ['card-tile'];
      const type: TileType = this.item.tile;
      if (this.item.hasSymbol) {
        classes.push('card-tile-canvass');
      }
      if (type === TileType.BIOFERTILIZER_FACILITY) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--biofertilizer_facility');
      } else if (type === TileType.CAPITAL) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--capital_ares');
        } else {
          classes.push('card-tile-capital');
        }
      } else if (type === TileType.ECOLOGICAL_ZONE) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--ecological_zone_ares');
          // normal eco zone uses symbol (see getHtml)
        }
      } else if (type === TileType.COMMERCIAL_DISTRICT) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--commercial_district_ares');
          // normal commercial district uses symbol (see getHtml)
        }
      }

      return generateClassString(classes);
    },
    // Symbols for tiles go on top of the tile canvas
    getHtml: function(): string {
      const classes: string[] = [];
      const type: TileType = this.item.tile;
      if (this.item.hasSymbol) {
        classes.push('card-tile-symbol');
        if (type === TileType.COMMERCIAL_DISTRICT) {
          classes.push('card-tile-symbol-commercial-district');
        } else if (type === TileType.DEIMOS_DOWN) {
          classes.push('card-tile-symbol-deimos-down');
        } else if (type === TileType.ECOLOGICAL_ZONE) {
          classes.push('card-tile-symbol-ecological-zone');
        }
      }
      return '<div class="' + generateClassString(classes) + '"/></div>';
    },
  },
  template: `
    <div :class="getClasses()" v-html="getHtml()"></div>
  `,
});
