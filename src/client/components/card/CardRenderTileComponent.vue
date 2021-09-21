<template>
    <div :class="getTiles()"><div :class="getSymbols()"></div></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderTile} from '@/cards/render/CardRenderer';
import {generateClassString} from '@/utils/utils';
import {TileType} from '@/TileType';

interface Classes {
  // The tile div is used to display a full tile. If distinct version
  // of the tile appears for Ares it uses aresTile, otherwise it ses tile.
  tile?: string;
  aresTile?: string;

  // symbol is used for the inner div, and only used when the renderer isn't
  // going to show a whole tile, just a symbol on top of a tile template.
  symbol?: string;
}
const TILE_CLASSES: Map<TileType, Classes> = new Map([
  [TileType.BIOFERTILIZER_FACILITY, {
    aresTile: 'card-tile-biofertilizer-facility',
  }],
  [TileType.CAPITAL, {
    tile: 'card-tile-capital',
    aresTile: 'card-tile-capital-ares',
  }],
  [TileType.COMMERCIAL_DISTRICT, {
    aresTile: 'card-tile-commercial-district-ares',
    symbol: 'card-tile-symbol-commercial-district',
  }],
  [TileType.DEIMOS_DOWN, {
    symbol: 'card-tile-symbol-deimos-down',
  }],
  [TileType.GREAT_DAM, {
    symbol: 'card-tile-symbol-great-dam',
  }],
  [TileType.ECOLOGICAL_ZONE, {
    aresTile: 'card-tile-ecological-zone-ares',
    symbol: 'card-tile-symbol-ecological-zone',
  }],
  [TileType.INDUSTRIAL_CENTER, {
    aresTile: 'card-tile-industrial-center-ares',
    symbol: 'card-tile-symbol-industrial-center',
  }],
  [TileType.LAVA_FLOWS, {
    aresTile: 'card-tile-lava-flows-ares',
    symbol: 'card-tile-symbol-lava-flows',
  }],
  [TileType.LUNA_TRADE_STATION, {
    symbol: 'card-tile-symbol-luna-trade-station',
  }],
  [TileType.LUNA_MINING_HUB, {
    symbol: 'card-tile-symbol-luna-mining-hub',
  }],
  [TileType.LUNA_TRAIN_STATION, {
    symbol: 'card-tile-symbol-luna-train-station',
  }],
  [TileType.LUNAR_MINE_URBANIZATION, {
    symbol: 'card-tile-symbol-lunar-mine-urbanization',
  }],
  [TileType.MAGNETIC_FIELD_GENERATORS, {
    symbol: 'card-tile-symbol-magnetic-field-generators',
  }],
  [TileType.METALLIC_ASTEROID, {
    aresTile: 'card-tile-metallic-asteroid',
  }],
  [TileType.MINING_AREA, {
    symbol: 'card-tile-symbol-mining',
  }],
  [TileType.MINING_RIGHTS, {
    symbol: 'card-tile-symbol-mining',
  }],
  [TileType.MINING_STEEL_BONUS, {
    tile: 'card-tile-mining-steel',
  }],
  [TileType.MINING_TITANIUM_BONUS, {
    tile: 'card-tile-mining-titanium',
  }],
  [TileType.MOHOLE_AREA, {
    aresTile: 'card-tile-mohole-area-ares',
    symbol: 'card-tile-symbol-mohole-area',
  }],
  [TileType.MOON_MINE, {
    tile: 'card-tile-lunar-mine',
  }],
  [TileType.MOON_COLONY, {
    tile: 'card-tile-lunar-colony',
  }],
  [TileType.MOON_ROAD, {
    tile: 'card-tile-lunar-road',
  }],
  [TileType.NATURAL_PRESERVE, {
    aresTile: 'card-tile-natural-preserve-ares',
    symbol: 'card-tile-symbol-natural-preserve',
  }],
  [TileType.NUCLEAR_ZONE, {
    aresTile: 'card-tile-nuclear-zone-ares',
    symbol: 'card-tile-symbol-nuclear-zone',
  }],
  [TileType.OCEAN_CITY, {
    tile: 'card-tile-ocean-city',
  }],
  [TileType.OCEAN_FARM, {
    tile: 'card-tile-ocean-farm',
  }],
  [TileType.OCEAN_SANCTUARY, {
    tile: 'card-tile-ocean-sanctuary',
  }],

  [TileType.RESTRICTED_AREA, {
    aresTile: 'card-tile-restricted-area-ares',
    symbol: 'card-tile-symbol-restricted-area',
  }],
  [TileType.SOLAR_FARM, {
    tile: 'card-tile-solar-farm',
  }],
]);

export default Vue.extend({
  name: 'CardRenderTileComponent',
  props: {
    item: {
      type: Object as () => CardRenderTile,
      required: true,
    },
  },
  methods: {
    getTiles(): string {
      const classes: string[] = ['card-tile'];
      if (this.item.hasSymbol) {
        classes.push('card-tile-canvas');
      }
      const symbolClass = TILE_CLASSES.get(this.item.tile);
      if (this.item.isAres && symbolClass?.aresTile !== undefined) {
        classes.push(symbolClass.aresTile);
      } else if (symbolClass?.tile !== undefined) {
        classes.push(symbolClass.tile);
      }
      return generateClassString(classes);
    },
    // Symbols for tiles go on top of the tile canvas
    getSymbols(): string {
      const classes: string[] = [];
      if (this.item.hasSymbol) {
        const symbolClass = TILE_CLASSES.get(this.item.tile);
        if (symbolClass?.symbol !== undefined) {
          classes.push('card-tile-symbol');
          classes.push(symbolClass.symbol);
        }
      }
      return generateClassString(classes);
    },
  },
});

</script>

