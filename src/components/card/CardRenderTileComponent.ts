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
        classes.push('card-tile-canvas');
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
      } else if (type === TileType.INDUSTRIAL_CENTER) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--industrial_center_ares');
          // normal industrial uses symbol (see getHtml)
        }
      } else if (type === TileType.METALLIC_ASTEROID) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--metallic_asteroid');
      } else if (type === TileType.MINING_STEEL_BONUS) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--mining_steel');
      } else if (type === TileType.MINING_TITANIUM_BONUS) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--mining_titanium');
      } else if (type === TileType.MOHOLE_AREA) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--mohole_area_ares');
        }
      } else if (type === TileType.LAVA_FLOWS) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--lava_flows_ares');
        }
      } else if (type === TileType.SOLAR_FARM) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--solar_farm');
      } else if (type === TileType.RESTRICTED_AREA) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--restricted_area_ares');
        }
      } else if (type === TileType.NATURAL_PRESERVE) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--natural_preserve_ares');
        }
      } else if (type === TileType.NUCLEAR_ZONE) {
        if (this.item.isAres) {
          classes.push('card-tile-ares');
          classes.push('board-space-tile--nuclear_zone_ares');
        }
      } else if (type === TileType.OCEAN_CITY) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--ocean_city');
      } else if (type === TileType.OCEAN_FARM) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--ocean_farm');
      } else if (type === TileType.OCEAN_SANCTUARY) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--ocean_sanctuary');
      } else if (type === TileType.MOON_MINE) {
        // TODO(kberg): add the secondary tag.
        classes.push('card-tile-lunar-mine');
      } else if (type === TileType.MOON_COLONY) {
        classes.push('card-tile-lunar-colony');
      } else if (type === TileType.MOON_ROAD) {
        classes.push('card-tile-lunar-road');
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
        } else if (type === TileType.GREAT_DAM) {
          classes.push('card-tile-symbol-great-dam');
        } else if (type === TileType.ECOLOGICAL_ZONE) {
          classes.push('card-tile-symbol-ecological-zone');
        } else if (type === TileType.INDUSTRIAL_CENTER) {
          classes.push('card-tile-symbol-industrial-center');
        } else if (type === TileType.MAGNETIC_FIELD_GENERATORS) {
          classes.push('card-tile-symbol-magnetic-field-generators');
        } else if (type === TileType.MINING_AREA || type === TileType.MINING_RIGHTS) {
          classes.push('card-tile-symbol-mining');
        } else if (type === TileType.MOHOLE_AREA) {
          classes.push('card-tile-symbol-mohole-area');
        } else if (type === TileType.LAVA_FLOWS) {
          classes.push('card-tile-symbol-lava-flows');
        } else if (type === TileType.RESTRICTED_AREA) {
          classes.push('card-tile-symbol-restricted-area');
        } else if (type === TileType.NATURAL_PRESERVE) {
          classes.push('card-tile-symbol-natural-preserve');
        } else if (type === TileType.NUCLEAR_ZONE) {
          classes.push('card-tile-symbol-nuclear-zone');
        } else if (type === TileType.LUNA_TRADE_STATION) {
          classes.push('card-tile-symbol-luna-trade-station');
        } else if (type === TileType.LUNA_MINING_HUB) {
          classes.push('card-tile-symbol-luna-mining-hub');
        } else if (type === TileType.LUNA_TRAIN_STATION) {
          classes.push('card-tile-symbol-luna-train-station');
        } else if (type === TileType.LUNAR_MINE_URBANIZATION) {
          classes.push('card-tile-symbol-lunar-mine-urbanization');
        }
      }
      return '<div class="' + generateClassString(classes) + '"/></div>';
    },
  },
  template: `
    <div :class="getClasses()" v-html="getHtml()"></div>
  `,
});
