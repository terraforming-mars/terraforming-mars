<template>
  <div :class="klass" :title="$t(description)" data-test="tile"/>
</template>

<script lang="ts">

import Vue from 'vue';
import {SpaceType} from '@/common/boards/SpaceType';
import {TileType} from '@/common/TileType';
import {SpaceHighlight} from '@/common/models/SpaceModel';
import {TileView} from '@/client/components/board/TileView';

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

const descriptions: Record<TileType, string> = {
  [TileType.MOHOLE_AREA]: 'Mohole Area',
  [TileType.COMMERCIAL_DISTRICT]: 'Commercial District: 1 VP per adjacent city tile',
  [TileType.ECOLOGICAL_ZONE]: 'Ecological Zone',
  [TileType.INDUSTRIAL_CENTER]: 'Industrial Center',
  [TileType.LAVA_FLOWS]: 'Lava Flows',
  [TileType.CAPITAL]: 'Capital',
  [TileType.MINING_AREA]: 'Mining Area',
  [TileType.MINING_RIGHTS]: 'Mining Rights',
  [TileType.NATURAL_PRESERVE]: 'Natural Preserve',
  [TileType.NUCLEAR_ZONE]: 'Nuclear Zone',
  [TileType.RESTRICTED_AREA]: 'Restricted Area',
  [TileType.GREAT_DAM]: 'Great Dam',
  [TileType.MAGNETIC_FIELD_GENERATORS]: 'Magnetic field generators',
  [TileType.DEIMOS_DOWN]: 'Deimos Down',
  [TileType.CITY]: 'City: 1 VP per adjacent greenery',
  [TileType.GREENERY]: 'Greenery: 1 VP',
  [TileType.OCEAN]: 'Ocean: grants 2M€ when players put tiles next to it',
  [TileType.BIOFERTILIZER_FACILITY]: 'Biofertilizer Facility',
  [TileType.METALLIC_ASTEROID]: 'Metallic Asteroid',
  [TileType.SOLAR_FARM]: 'Solar Farm',
  [TileType.OCEAN_CITY]: 'Ocean City: counts as an ocean and a city.',
  [TileType.OCEAN_FARM]: 'Ocean Farm',
  [TileType.OCEAN_SANCTUARY]: 'Ocean Sanctuary',
  [TileType.DUST_STORM_MILD]: 'Mild Dust Storm: lose 1 production when placing next to it. Pay 8M€ to place over it.',
  [TileType.DUST_STORM_SEVERE]: 'Severe Dust Storm: lose 2 production when placing next to it. Pay 16M€ to place over it.',
  [TileType.EROSION_MILD]: 'Mild Erosion: lose 1 production when placing next to it. Pay 8M€ to place over it.',
  [TileType.EROSION_SEVERE]: 'Severe Erosion: lose 2 production when placing next to it. Pay 16M€ to place over it.',
  [TileType.MINING_STEEL_BONUS]: 'Mining: steel bonus',
  [TileType.MINING_TITANIUM_BONUS]: 'Mining: titanium bonus',
  [TileType.MOON_MINE]: 'Moon Mine: 1 VP per adjacent road',
  [TileType.MOON_HABITAT]: 'Moon Colony: 1 VP per adjacent road',
  [TileType.MOON_ROAD]: 'Moon Road: 1 VP',
  [TileType.LUNA_TRADE_STATION]: 'Luna Trade Station',
  [TileType.LUNA_MINING_HUB]: 'Luna Mining Hub',
  [TileType.LUNA_TRAIN_STATION]: 'Luna Train Station: 2 VP per adjacent road',
  [TileType.LUNAR_MINE_URBANIZATION]: 'Luna Mine Urbanization: counts as both a colony and a mine tile.',

  [TileType.WETLANDS]: 'Wetlands: counts as an ocean and a greenery. Does not count toward 9 oceans.',
  [TileType.RED_CITY]: 'Red City: 1 VP per empty adjacent area. No greeneries may be placed next to it.',
  [TileType.MARTIAN_NATURE_WONDERS]: 'Martian Nature Wonders',
};
export default Vue.extend({
  name: 'board-space-tile',
  props: {
    tileType: {
      type: Number as () => TileType | undefined,
    },
    aresExtension: {
      type: Boolean,
    },
    tileView: {
      type: String as () => TileView,
      default: 'show',
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
    description(): string {
      if (this.tileType === undefined) return '';
      if (this.tileType === TileType.CITY && this.spaceType === SpaceType.COLONY) return 'City in space.';
      return descriptions[this.tileType];
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
          if (this.highlight !== 'volcanic') {
            // Custom for Arabia Terra's space Tikhonarov.
            css += ' board-space-type-cove';
          } else {
            css += ' board-space-type-volcanic-cove';
          }
        } else if (!this.restricted) {
          css += ` board-space-type-land`;

          if (this.highlight) {
            css += ` board-space-type-land-${this.highlight}`;
          }
        }
      }
      if (this.tileView !== 'show') {
        css += ' board-hidden-tile';
      }
      return css;
    },
  },
});

</script>
