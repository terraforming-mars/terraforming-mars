<template>
  <div :class="klass" :title="$t(title)" data-test="tile"/>
</template>

<script lang="ts">

import Vue from 'vue';
import {SpaceType} from '@/common/boards/SpaceType';
import {TileType} from '@/common/TileType';
import {SpaceHighlight} from '@/common/models/SpaceModel';

const tileTypeToCssClass = new Map<TileType, string>([
  [TileType.COMMERCIAL_DISTRICT, 'commercial_district'],
  [TileType.ECOLOGICAL_ZONE, 'ecological_zone'],
  [TileType.INDUSTRIAL_CENTER, 'industrial_center'],
  [TileType.LAVA_FLOWS, 'lava_flows'],
  [TileType.MINING_AREA, 'mining_area'],
  [TileType.MINING_RIGHTS, 'mining_rights'],
  [TileType.CAPITAL, 'capital'],
  [TileType.MOHOLE_AREA, 'mohole_area'],
  [TileType.NATURAL_PRESERVE, 'natural_preserve'],
  [TileType.NUCLEAR_ZONE, 'nuclear_zone'],
  [TileType.RESTRICTED_AREA, 'restricted_area'],
  [TileType.DEIMOS_DOWN, 'deimos_down'],
  [TileType.GREAT_DAM, 'great_dam'],
  [TileType.MAGNETIC_FIELD_GENERATORS, 'magnetic_field_generators'],
  [TileType.BIOFERTILIZER_FACILITY, 'biofertilizer-facility'],
  [TileType.METALLIC_ASTEROID, 'metallic-asteroid'],
  [TileType.SOLAR_FARM, 'solar-farm'],
  [TileType.OCEAN_CITY, 'ocean-city'],
  [TileType.OCEAN_FARM, 'ocean-farm'],
  [TileType.OCEAN_SANCTUARY, 'ocean-sanctuary'],
  [TileType.DUST_STORM_MILD, 'dust-storm-mild'],
  [TileType.DUST_STORM_SEVERE, 'dust-storm-severe'],
  [TileType.EROSION_MILD, 'erosion-mild'],
  [TileType.EROSION_SEVERE, 'erosion-severe'],
  [TileType.MINING_STEEL_BONUS, 'mining-steel'],
  [TileType.MINING_TITANIUM_BONUS, 'mining-titanium'],
  [TileType.WETLANDS, 'wetlands'],
  [TileType.RED_CITY, 'red-city'],
  [TileType.MARTIAN_NATURE_WONDERS, 'martian-nature-wonders'],
]);

const tileTypeToCssClassAresOverride = new Map<TileType, string>([
  [TileType.COMMERCIAL_DISTRICT, 'commercial-district-ares'],
  [TileType.ECOLOGICAL_ZONE, 'ecological-zone-ares'],
  [TileType.INDUSTRIAL_CENTER, 'industrial-center-ares'],
  [TileType.LAVA_FLOWS, 'lava-flows-ares'],
  [TileType.CAPITAL, 'capital-ares'],
  [TileType.MOHOLE_AREA, 'mohole-area-ares'],
  [TileType.NATURAL_PRESERVE, 'natural-preserve-ares'],
  [TileType.NUCLEAR_ZONE, 'nuclear-zone-ares'],
  [TileType.RESTRICTED_AREA, 'restricted-area-ares'],
]);

export default Vue.extend({
  name: 'board-space-tile',
  props: {
    tileType: {
      type: Number as () => TileType | undefined,
    },
    aresExtension: {
      type: Boolean,
    },
    hideTiles: {
      type: Boolean,
      default: false,
    },
    spaceType: {
      type: String as () => SpaceType,
    },
    highlight: {
      type: String as () => SpaceHighlight,
      required: false,
    },
    restricted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    title(): string {
      switch (this.tileType) {
      case TileType.MOHOLE_AREA:
        return 'Mohole Area';
      case TileType.COMMERCIAL_DISTRICT:
        return 'Commercial District: 1 VP per adjacent city tile';
      case TileType.ECOLOGICAL_ZONE:
        return 'Ecological Zone';
      case TileType.INDUSTRIAL_CENTER:
        return 'Industrial Center';
      case TileType.LAVA_FLOWS:
        return 'Lava Flows';
      case TileType.CAPITAL:
        return 'Capital';
      case TileType.MINING_AREA:
        return 'Mining Area';
      case TileType.MINING_RIGHTS:
        return 'Mining Rights';
      case TileType.NATURAL_PRESERVE:
        return 'Natural Preserve';
      case TileType.NUCLEAR_ZONE:
        return 'Nuclear Zone';
      case TileType.RESTRICTED_AREA:
        return 'Restricted Area';
      case TileType.GREAT_DAM:
        return 'Great Dam';
      case TileType.MAGNETIC_FIELD_GENERATORS:
        return 'Magnetic field generators';
      case TileType.DEIMOS_DOWN:
        return 'Deimos Down';
      case TileType.CITY:
        if (this.spaceType === SpaceType.COLONY) {
          return 'City in space.';
        } else {
          return 'City: 1 VP per adjacent greenery';
        }
      case TileType.GREENERY:
        return 'Greenery: 1 VP';
      case TileType.BIOFERTILIZER_FACILITY:
        return 'Biofertilizer Facility';
      case TileType.METALLIC_ASTEROID:
        return 'Metallic Asteroid';
      case TileType.SOLAR_FARM:
        return 'Solar Farm';
      case TileType.OCEAN_CITY:
        return 'Ocean City. Counts as an ocean and a city.';
      case TileType.OCEAN_FARM:
        return 'Ocean Farm';
      case TileType.OCEAN_SANCTUARY:
        return 'Ocean Sanctuary';
      case TileType.DUST_STORM_MILD:
        return 'Mild Dust Storm';
      case TileType.DUST_STORM_SEVERE:
        return 'Severe Dust Storm';
      case TileType.EROSION_MILD:
        return 'Mild Erosion';
      case TileType.EROSION_SEVERE:
        return 'Severe Erosion';
      case TileType.MINING_STEEL_BONUS:
        return 'Mining: steel bonus';
      case TileType.MINING_TITANIUM_BONUS:
        return 'Mining: titanium bonus';
      case TileType.MOON_MINE:
        return 'Moon Mine: 1 VP per adjacent road';
      case TileType.MOON_COLONY:
        return 'Moon Colony: 1 VP per adjacent road';
      case TileType.MOON_ROAD:
        return 'Moon Road: 1 VP';
      case TileType.LUNA_TRADE_STATION:
        return 'Luna Trade Station';
      case TileType.LUNA_MINING_HUB:
        return 'Luna Mining Hub';
      case TileType.LUNA_TRAIN_STATION:
        return 'Luna Train Station. 2 VP per adjacent road';
      case TileType.LUNAR_MINE_URBANIZATION:
        return 'Luna Mine Urbanization. Counts as both a colony and a mine tile.';

      case TileType.WETLANDS:
        return 'Wetlands. Counts as an ocean and a greenery. Does not count toward 9 oceans.';
      case TileType.RED_CITY:
        return 'Red City. 1 VP per empty adjacent area. No greeneries may be placed next to it.';
      case TileType.MARTIAN_NATURE_WONDERS:
        return 'Martian Nature Wonders';
      default:
        return '';
      }
    },
    klass(): string {
      let css = 'board-space';
      if (this.tileType !== undefined) {
        switch (this.tileType) {
        case TileType.OCEAN:
          css += ' board-space-tile--ocean';
          break;
        case TileType.CITY:
          css += ' board-space-tile--city';
          break;
        case TileType.GREENERY:
          css += ' board-space-tile--greenery';
          break;
        default:
          let cssClass = tileTypeToCssClass.get(this.tileType);
          if (this.aresExtension && tileTypeToCssClassAresOverride.has(this.tileType)) {
            cssClass = tileTypeToCssClassAresOverride.get(this.tileType);
          }
          css += ' board-space-tile--' + cssClass;
        }
      } else {
        if (this.spaceType === SpaceType.OCEAN) {
          css += ' board-space-type-ocean';
        } else if (this.spaceType === SpaceType.COVE) {
          css += ' board-space-type-cove';
        } else if (!this.restricted) {
          css += ` board-space-type-land`;

          if (this.highlight) {
            css += ` board-space-type-land-${this.highlight}`;
          }
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
