<template>
  <div :class="tiles"><div v-if="symbols.length > 0" :class="symbols"></div></div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {ICardRenderTile} from '@/common/cards/render/Types';
import {TileType} from '@/common/TileType';

type Classes = {
  tile?: string;
  aresTile?: string;
  symbol?: string;
}

const TILE_CLASSES: Record<TileType, Classes> = {
  [TileType.BIOFERTILIZER_FACILITY]: {
    aresTile: 'card-tile-biofertilizer-facility',
  },
  [TileType.CAPITAL]: {
    tile: 'card-tile-capital',
    aresTile: 'card-tile-capital-ares',
  },
  [TileType.COMMERCIAL_DISTRICT]: {
    aresTile: 'card-tile-commercial-district-ares',
    symbol: 'card-tile-symbol-commercial-district',
  },
  [TileType.DEIMOS_DOWN]: {
    aresTile: 'card-tile-deimos-down-ares',
    symbol: 'card-tile-symbol-deimos-down',
  },
  [TileType.GREAT_DAM]: {
    aresTile: 'card-tile-great-dam-ares',
    symbol: 'card-tile-symbol-great-dam',
  },
  [TileType.ECOLOGICAL_ZONE]: {
    aresTile: 'card-tile-ecological-zone-ares',
    symbol: 'card-tile-symbol-ecological-zone',
  },
  [TileType.INDUSTRIAL_CENTER]: {
    aresTile: 'card-tile-industrial-center-ares',
    symbol: 'card-tile-symbol-industrial-center',
  },
  [TileType.LAVA_FLOWS]: {
    aresTile: 'card-tile-lava-flows-ares',
    symbol: 'card-tile-symbol-lava-flows',
  },
  [TileType.LUNA_TRADE_STATION]: {
    symbol: 'card-tile-symbol-luna-trade-station',
  },
  [TileType.LUNA_MINING_HUB]: {
    symbol: 'card-tile-symbol-luna-mining-hub',
  },
  [TileType.LUNA_TRAIN_STATION]: {
    symbol: 'card-tile-symbol-luna-train-station',
  },
  [TileType.LUNAR_MINE_URBANIZATION]: {
    symbol: 'card-tile-symbol-lunar-mine-urbanization',
  },
  [TileType.MAGNETIC_FIELD_GENERATORS]: {
    aresTile: 'card-tile-magnetic-field-generators-ares',
    symbol: 'card-tile-symbol-magnetic-field-generators',
  },
  [TileType.METALLIC_ASTEROID]: {
    aresTile: 'card-tile-metallic-asteroid',
  },
  [TileType.MINING_AREA]: {
    symbol: 'card-tile-symbol-mining',
  },
  [TileType.MINING_RIGHTS]: {
    symbol: 'card-tile-symbol-mining',
  },
  [TileType.MINING_STEEL_BONUS]: {
    tile: 'card-tile-mining-steel',
  },
  [TileType.MINING_TITANIUM_BONUS]: {
    tile: 'card-tile-mining-titanium',
  },
  [TileType.MOHOLE_AREA]: {
    aresTile: 'card-tile-mohole-area-ares',
    symbol: 'card-tile-symbol-mohole-area',
  },
  [TileType.MOON_MINE]: {
    tile: 'card-tile-lunar-mine',
  },
  [TileType.MOON_HABITAT]: {
    tile: 'card-tile-lunar-habitat',
  },
  [TileType.MOON_ROAD]: {
    tile: 'card-tile-lunar-road',
  },
  [TileType.NATURAL_PRESERVE]: {
    aresTile: 'card-tile-natural-preserve-ares',
    symbol: 'card-tile-symbol-natural-preserve',
  },
  [TileType.NUCLEAR_ZONE]: {
    aresTile: 'card-tile-nuclear-zone-ares',
    symbol: 'card-tile-symbol-nuclear-zone',
  },
  [TileType.OCEAN_CITY]: {
    tile: 'card-tile-ocean-city',
  },
  [TileType.OCEAN_FARM]: {
    tile: 'card-tile-ocean-farm',
  },
  [TileType.OCEAN_SANCTUARY]: {
    tile: 'card-tile-ocean-sanctuary',
  },
  [TileType.RESTRICTED_AREA]: {
    aresTile: 'card-tile-restricted-area-ares',
    symbol: 'card-tile-symbol-restricted-area',
  },
  [TileType.SOLAR_FARM]: {
    tile: 'card-tile-solar-farm',
  },
  [TileType.WETLANDS]: {
    tile: 'card-tile-wetlands',
  },
  [TileType.CRASHLANDING]: {
    tile: 'card-tile-crashlanding',
  },
  [TileType.MAN_MADE_VOLCANO]: {
    tile: 'card-tile-man-made-volcano',
  },
  [TileType.GREENERY]: {},
  [TileType.OCEAN]: {},
  [TileType.CITY]: {},
  [TileType.DUST_STORM_MILD]: {},
  [TileType.DUST_STORM_SEVERE]: {},
  [TileType.EROSION_MILD]: {},
  [TileType.EROSION_SEVERE]: {},
  [TileType.RED_CITY]: {},
  [TileType.MARTIAN_NATURE_WONDERS]: {},
  [TileType.MARS_NOMADS]: {},
  [TileType.REY_SKYWALKER]: {},
  [TileType.NEW_HOLLAND]: {
    tile: 'card-tile-new-holland',
  },
};

const props = defineProps<{
  item: ICardRenderTile;
}>();

const tiles = computed<ReadonlyArray<string>>(() => {
  const classes: string[] = ['card-tile'];
  if (props.item.hasSymbol) {
    classes.push('card-tile-canvas');
  }
  const symbolClass = TILE_CLASSES[props.item.tile];
  if (props.item.isAres && symbolClass.aresTile !== undefined) {
    classes.push(symbolClass.aresTile);
  } else if (symbolClass.tile !== undefined) {
    classes.push(symbolClass.tile);
  }
  return classes;
});

const symbols = computed<ReadonlyArray<string>>(() => {
  if (props.item.hasSymbol) {
    const symbolClass = TILE_CLASSES[props.item.tile];
    if (symbolClass.symbol !== undefined) {
      return ['card-tile-symbol', symbolClass.symbol];
    }
  }
  return [];
});
</script>
