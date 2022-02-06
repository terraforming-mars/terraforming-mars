<template>
  <div :class="getMainClass()" :data_space_id="space.id">
    <div :class="getTileClass()" :title="getVerboseTitle(space.tileType)" data-test="tile"/>
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <bonus :bonus="space.bonus" v-if="showBonus"></bonus>
    <bonus :bonus="space.bonus" v-if="showBonus"></bonus>
    <div :class="'board-cube board-cube--'+space.color" v-if="space.color !== undefined && !hideTiles"></div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Bonus from '@/client/components/Bonus.vue';
import {SpaceModel} from '@/common/models/SpaceModel';
import {SpaceType} from '@/common/boards/SpaceType';
import {TileType} from '@/common/TileType';

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
  name: 'board-space',
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
    aresExtension: {
      type: Boolean,
    },
    hideTiles: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  components: {
    'bonus': Bonus,
  },
  methods: {
    getVerboseTitle(tileType: TileType | undefined): string {
      let ret: string = '';
      if (tileType === TileType.MOHOLE_AREA) {
        ret = 'Mohole Area';
      } else if (tileType === TileType.COMMERCIAL_DISTRICT) {
        ret = 'Commercial District: 1 VP per adjacent city tile';
      } else if (tileType === TileType.ECOLOGICAL_ZONE) {
        ret = 'Ecological Zone';
      } else if (tileType === TileType.INDUSTRIAL_CENTER) {
        ret = 'Industrial Center';
      } else if (tileType === TileType.LAVA_FLOWS) {
        ret = 'Lava Flows';
      } else if (tileType === TileType.CAPITAL) {
        ret = 'Capital';
      } else if (tileType === TileType.MINING_AREA) {
        ret = 'Mining Area';
      } else if (tileType === TileType.MINING_RIGHTS) {
        ret = 'Mining Rights';
      } else if (tileType === TileType.NATURAL_PRESERVE) {
        ret = 'Natural Preserve';
      } else if (tileType === TileType.NUCLEAR_ZONE) {
        ret = 'Nuclear Zone';
      } else if (tileType === TileType.RESTRICTED_AREA) {
        ret = 'Restricted Area';
      } else if (tileType === TileType.GREAT_DAM) {
        ret = 'Great Dam';
      } else if (tileType === TileType.MAGNETIC_FIELD_GENERATORS) {
        ret = 'Magnetic field generators';
      } else if (tileType === TileType.DEIMOS_DOWN) {
        ret = 'Deimos Down';
      } else if (tileType === TileType.CITY) {
        ret = 'City: 1 VP per adjacent greenery';
      } else if (tileType === TileType.GREENERY) {
        ret = 'Greenery: 1 VP';
      } else if (tileType === TileType.BIOFERTILIZER_FACILITY) {
        ret = 'Biofertilizer Facility';
      } else if (tileType === TileType.METALLIC_ASTEROID) {
        ret = 'Metallic Asteroid';
      } else if (tileType === TileType.SOLAR_FARM) {
        ret = 'Solar Farm';
      } else if (tileType === TileType.OCEAN_CITY) {
        ret = 'Ocean City';
      } else if (tileType === TileType.OCEAN_FARM) {
        ret = 'Ocean Farm';
      } else if (tileType === TileType.OCEAN_SANCTUARY) {
        ret = 'Ocean Sanctuary';
      } else if (tileType === TileType.DUST_STORM_MILD) {
        ret = 'Mild Dust Storm';
      } else if (tileType === TileType.DUST_STORM_SEVERE) {
        ret = 'Severe Dust Storm';
      } else if (tileType === TileType.EROSION_MILD) {
        ret = 'Mild Erosion';
      } else if (tileType === TileType.EROSION_SEVERE) {
        ret = 'Severe Erosion';
      } else if (tileType === TileType.MINING_STEEL_BONUS) {
        ret = 'Mining: steel bonus';
      } else if (tileType === TileType.MINING_TITANIUM_BONUS) {
        ret = 'Mining: titanium bonus';
      }
      return this.$t(ret);
    },
    getMainClass(): string {
      let css = 'board-space board-space-' + this.space.id.toString();
      if (this.is_selectable) {
        css += ' board-space-selectable';
      }
      return css;
    },
    getTileClass(): string {
      let css = 'board-space';
      const tileType = this.space.tileType;
      if (tileType !== undefined) {
        switch (this.space.tileType) {
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
          let cssClass = tileTypeToCssClass.get(tileType);
          if (this.aresExtension && tileTypeToCssClassAresOverride.has(tileType)) {
            cssClass = tileTypeToCssClassAresOverride.get(tileType);
          }
          css += ' board-space-tile--' + cssClass;
        }
      } else {
        if (this.space.spaceType === SpaceType.OCEAN) {
          css += ' board-space-type-ocean';
        } else if (this.space.spaceType === SpaceType.COVE) {
          css += ' board-space-type-cove';
        } else {
          css += ` board-space-type-land`;

          const highlight = this.space.highlight;
          if (highlight) {
            css += ` board-space-type-land-${highlight}`;
          }
        }
      }
      if (this.hideTiles) {
        css += ' board-hidden-tile';
      }
      return css;
    },
  },
  computed: {
    showBonus() {
      return this.space.tileType === undefined || this.hideTiles;
    },
  },
});

</script>

