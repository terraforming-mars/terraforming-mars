<template>
  <div :class="gameBoardClassName">
    <div class="hide-tile-button-container">
      <div class="hide-tile-button" @click="$emit('toggleTileView')" data-test="hide-tiles-button" v-i18n>
        {{ tileView }} tiles
      </div>
    </div>
    <div class="board-outer-spaces" id="colony_spaces">
      <board-space :v-if="hasSpace(SpaceName.GANYMEDE_COLONY)" :space="getSpace(SpaceName.GANYMEDE_COLONY)"
        text="Ganymede Colony" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.PHOBOS_SPACE_HAVEN)" :space="getSpace(SpaceName.PHOBOS_SPACE_HAVEN)"
        text="Phobos Space Haven" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.STANFORD_TORUS)" :space="getSpace(SpaceName.STANFORD_TORUS)"
        text="Stanford Torus" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.LUNA_METROPOLIS)" :space="getSpace(SpaceName.LUNA_METROPOLIS)"
        text="Luna Metropolis" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.DAWN_CITY)" :space="getSpace(SpaceName.DAWN_CITY)" text="Dawn City"
        :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.STRATOPOLIS)" :space="getSpace(SpaceName.STRATOPOLIS)" text="Stratopolis"
        :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.MAXWELL_BASE)" :space="getSpace(SpaceName.MAXWELL_BASE)"
        text="Maxwell Base" :tileView="tileView"></board-space>
      <!-- <board-space :space="getSpace('74')" text="Martian Transhipment Station" :tileView="tileView"></board-space> -->
      <board-space :v-if="hasSpace(SpaceName.CERES_SPACEPORT)" :space="getSpace(SpaceName.CERES_SPACEPORT)"
        text="Ceres Spaceport" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.DYSON_SCREENS)" :space="getSpace(SpaceName.DYSON_SCREENS)"
        text="Dyson Screens" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.LUNAR_EMBASSY)" :space="getSpace(SpaceName.LUNAR_EMBASSY)"
        text="Lunar Embassy" :tileView="tileView"></board-space>
      <board-space :v-if="hasSpace(SpaceName.VENERA_BASE)" :space="getSpace(SpaceName.VENERA_BASE)" text="Venera Base"
        :tileView="tileView"></board-space>
    </div>

    <div class="global-numbers">
      <div class="global-numbers-temperature">
        <div :class="getScaleCSS(lvl, game.temperature)"
          v-for="(lvl, idx) in GLOBAL_PARAMETER_VALUES[GlobalParameter.TEMPERATURE]" :key="idx">{{ lvl.strValue }}</div>
      </div>

      <div class="global-numbers-oxygen">
        <div :class="getScaleCSS(lvl, game.oceans)"
          v-for="(lvl, idx) in GLOBAL_PARAMETER_VALUES[GlobalParameter.OXYGEN]" :key="idx">{{ lvl.strValue }}</div>
      </div>

      <div class="global-numbers-venus" v-if="game.gameOptions.expansions.venus">
        <div :class="getScaleCSS(lvl, game.venusScaleLevel)"
          v-for="(lvl, idx) in GLOBAL_PARAMETER_VALUES[GlobalParameter.VENUS]" :key="idx">{{ lvl.strValue }}</div>
      </div>

      <div class="global-numbers-oceans">
        <span v-if="game.oceans === constants.MAX_OCEAN_TILES">
          <img width="26" src="assets/misc/circle-checkmark.png" class="board-ocean-checkmark" :alt="$t('Completed!')">
        </span>
        <span v-else>
          {{game.oceans}}/{{constants.MAX_OCEAN_TILES}}
        </span>
      </div>

      <div v-if="aresData !== undefined">
        <div v-if="aresData.hazardData.erosionOceanCount.available">
          <div class="global-ares-erosions-icon"></div>
          <div class="global-ares-erosions-val">{{aresData.hazardData.erosionOceanCount.threshold}}</div>
        </div>
        <div v-if="aresData.hazardData.removeDustStormsOceanCount.available">
          <div class="global-ares-remove-dust-storms-icon"></div>
          <div class="global-ares-remove-dust-storms-val">{{aresData.hazardData.removeDustStormsOceanCount.threshold}}
          </div>
        </div>
        <div v-if="aresData.hazardData.severeErosionTemperature.available">
          <div class="global-ares-severe-erosions"
            :class="'global-ares-severe-erosions-'+aresData.hazardData.severeErosionTemperature.threshold"></div>
        </div>
        <div v-if="aresData.hazardData.severeDustStormOxygen.available">
          <div class="global-ares-severe-dust-storms"
            :class="'global-ares-severe-dust-storms-'+aresData.hazardData.severeDustStormOxygen.threshold"></div>
        </div>
      </div>

      <div v-if="game.gameOptions.altVenusBoard" class="global-alt-venus">
        <div class="std-wild-resource p18"></div>
        <div class="std-wild-resource p20"></div>
        <div class="std-wild-resource p22"></div>
        <div class="std-wild-resource p24"></div>
        <div class="std-wild-resource p26"></div>
        <div class="std-wild-resource p28"></div>
        <div class="std-wild-resource p30"></div>
        <div class="wild-resource p30b"></div>
      </div>
    </div>

    <div class="board" id="main_board">
      <board-space v-for="curSpace in getAllSpacesOnMars()" :key="curSpace.id" :space="curSpace"
        :aresExtension="game.gameOptions.expansions.ares" :tileView="tileView" data-test="board-space" />

      <svg id="board_legend" height="550" width="630" class="board-legend">
        <g v-for="(key, idx) of LEGENDS[boardName]" :key="idx"
          :transform="`translate(${key.position[0]}, ${key.position[1]})`">
          <text class="board-caption">
            <tspan y="0">{{key.text[0]}}</tspan>
            <tspan :x="key.secondRowX || 0" y="1.1em">{{key.text[1]}}</tspan>
          </text>
          <template v-if="key.line !== undefined">
            <line :x1="key.line.from[0]" :y1="key.line.from[1]" :x2="key.line.to[0]" :y2="key.line.to[1]"
              class="board-line"></line>
            <circle :cx="key.line.to[0]" :cy="key.line.to[1]" r="2" class="board-caption board_caption--black" />
          </template>
        </g>

        <g v-for="feature in FEATURES[boardName]" :key="feature.id" :id="feature.id"
          :transform="`translate(${feature.transform[0]}, ${feature.transform[1]})`">

          <!-- Renders the feature name and handles the optional dx offset on the main <text> element -->
          <text class="board-caption" :dx="feature.nameSegments[ 0 ].dx">
            <tspan v-for="(segment, index) in feature.nameSegments" :key="index" :dy="segment.dy" :x="segment.x">
              {{ segment.text }}
            </tspan>
          </text>

          <!-- Renders the connecting line if 'feature.line' data exists -->
          <line v-if="feature.line" :x1="feature.line.x1" :y1="feature.line.y1" :x2="feature.line.x2"
            :y2="feature.line.y2" class="board-line" />

          <!-- Renders the marker dot if 'feature.marker' data exists -->
          <text v-if="feature.marker" :x="feature.marker.x" :y="feature.marker.y"
            class="board-caption board_caption--black">●</text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as constants from '@/common/constants';
import BoardSpace from '@/client/components/BoardSpace.vue';
import {AresData} from '@/common/ares/AresData';
import {SpaceModel} from '@/common/models/SpaceModel';
import {SpaceType} from '@/common/boards/SpaceType';
import {SpaceId} from '@/common/Types';
import {TileView} from '@/client/components/board/TileView';
import {BoardName} from '@/common/boards/BoardName';
import {LEGENDS} from '@/client/components/Legends';
import {SpaceName} from '@/common/boards/SpaceName';
import {GameModel} from '@/common/models/GameModel';
import {GlobalParameter} from '@/common/GlobalParameter';

type GlobalParamLevel = {
  value: number,
  strValue: string,
};

const GLOBAL_PARAMETER_STEPS = {
  [GlobalParameter.TEMPERATURE]: {start: constants.MIN_TEMPERATURE, end: constants.MAX_TEMPERATURE, step: 2},
  [GlobalParameter.OXYGEN]: {start: constants.MIN_OXYGEN_LEVEL, end: constants.MAX_OXYGEN_LEVEL, step: 1},
  [GlobalParameter.VENUS]: {start: constants.MIN_VENUS_SCALE, end: constants.MAX_VENUS_SCALE, step: 2},
} as const;

function getValuesForParameter(targetParameter: keyof typeof GLOBAL_PARAMETER_STEPS): ReadonlyArray<GlobalParamLevel> {
  const values = [];
  const entries = GLOBAL_PARAMETER_STEPS[targetParameter];
  for (let value = entries.end; value >= entries.start; value -= entries.step) {
    const prefix = (targetParameter === GlobalParameter.TEMPERATURE && value > 0) ? '+' : '';
    const strValue = prefix + value.toString();
    values.push({value, strValue});
  }
  return values;
}

const GLOBAL_PARAMETER_VALUES = {
  [GlobalParameter.TEMPERATURE]: getValuesForParameter(GlobalParameter.TEMPERATURE),
  [GlobalParameter.OXYGEN]: getValuesForParameter(GlobalParameter.OXYGEN),
  [GlobalParameter.VENUS]: getValuesForParameter(GlobalParameter.VENUS),
} as const;

type Feature = {
  id: string,
  nameSegments: Array<{text: string, x?: number, dx?: number, dy?: number}>,
  transform: [number, number],
  line?: {x1: number, y1: number, x2: number, y2: number},
  marker?: {x: number, y: number},
};

const FEATURES: Partial<Record<BoardName, Array<Feature>>> = {
  [BoardName.THARSIS]: [
    {
      id: 'ascraeus_mons',
      nameSegments: [
        {text: 'Ascraeus', dy: 15},
        {text: 'Mons', x: 12, dy: 12},
      ],
      transform: [95, 192],
      line: {x1: 38, y1: 20, x2: 88, y2: 26},
      marker: {x: 86, y: 29},
    },
    {
      id: 'pavonis_mons',
      nameSegments: [
        {text: 'Pavonis', dy: 15},
        {text: 'Mons', x: 4, dy: 12},
      ],
      transform: [90, 230],
      line: {x1: 35, y1: 25, x2: 72, y2: 30},
      marker: {x: 66, y: 33},
    },
    {
      id: 'arsia_mons',
      nameSegments: [
        {text: 'Arsia', dy: 15},
        {text: 'Mons', x: -2, dy: 12},
      ],
      transform: [77, 275],
      line: {x1: 25, y1: 20, x2: 49, y2: 26},
      marker: {x: 47, y: 29},
    },
    {
      id: 'tharsis_tholus',
      nameSegments: [
        {text: 'Tharsis', dy: -7},
        {text: 'Tholus', x: 48, dy: 12},
      ],
      transform: [85, 175],
      line: {x1: 90, y1: -3, x2: 160, y2: 2},
      marker: {x: 158, y: 5},
    },
    {
      id: 'noctis_city',
      nameSegments: [
        {text: 'Noctis', dy: 15},
        {text: 'City', x: 7, dy: 12},
      ],
      transform: [85, 320],
      line: {x1: 30, y1: 20, x2: 140, y2: -20},
      marker: {x: 136, y: -18},
    },
  ],
  [BoardName.ELYSIUM]: [
    {
      id: 'elysium_mons',
      nameSegments: [
        {text: 'Elysium', dy: 15},
        {text: 'Mons', x: 8, dy: 12},
      ],
      transform: [110, 190],
    },
    {
      id: 'hecatus_tholus',
      nameSegments: [
        {text: 'Hecatus', dy: 15},
        {text: 'Tholus', x: 3, dy: 12},
      ],
      transform: [130, 150],
    },
    {
      id: 'arsia_mons',
      nameSegments: [
        {text: 'Arsia', dy: 15},
        {text: 'Mons', x: 0, dy: 12},
      ],
      transform: [545, 272],
    },
    {
      id: 'olympus_mons',
      nameSegments: [
        {text: 'Olympus', x: -5, dy: 15},
        {text: 'Mons', x: 4, dy: 12},
      ],
      transform: [505, 190],
    },
  ],
  [BoardName.VASTITAS_BOREALIS_NOVUS]: [
    {
      id: 'hectates_tholius_vastitas_borealis_novus',
      nameSegments: [
        {text: 'Hectates', dy: 15},
        {text: 'Tholius', x: 5, dy: 12},
      ],
      transform: [270, 70],
    },
    {
      id: 'elysium_mons_vastitas_borealis_novus',
      nameSegments: [
        {text: 'Elysium', x: -5, dy: 15},
        {text: 'Mons', x: 4, dy: 12},
      ],
      transform: [480, 145],
    },
    {
      id: 'alba_mons_vastitas_borealis_novus',
      nameSegments: [
        {text: 'Alba', x: 0, dy: 15},
        {text: 'Mons', x: -1, dy: 12},
      ],
      transform: [105, 230],
    },
    {
      id: 'viking_2_vastitas_borealis_novus',
      nameSegments: [{text: 'Viking 2', x: -5, dy: 15}],
      transform: [530, 235],
    },
    {
      id: 'uranius_tholus_vastitas_borealis_novus',
      nameSegments: [
        {text: 'Uranius', x: 0, dy: 0},
        {text: 'Tholus', x: 2, dy: 12},
      ],
      transform: [115, 370],
    },
    {
      id: 'viking_1_vastitas_borealis_novus',
      nameSegments: [{text: 'Viking 1', x: -5, dy: 15}],
      transform: [164, 445],
    },
  ],
  [BoardName.ARABIA_TERRA]: [
    {
      id: 'tikhonarov',
      nameSegments: [{text: 'Tikhonarov'}],
      transform: [487, 185],
      line: {x1: 15, y1: 5, x2: 3, y2: 20},
      marker: {x: 1, y: 22},
    },
    {
      id: 'ladon',
      nameSegments: [{text: 'Ladon'}],
      transform: [286, 496],
      line: {x1: 20, y1: -12, x2: 17, y2: -70},
      marker: {x: 14, y: -68},
    },
    {
      id: 'flaugergues',
      nameSegments: [{text: 'Flaugergues'}],
      transform: [480, 405],
      line: {x1: 0, y1: 2, x2: -15, y2: 10},
      marker: {x: -17, y: 12},
    },
    {
      id: 'charybdis',
      nameSegments: [{text: 'Charybdis'}],
      transform: [455, 450],
      line: {x1: 0, y1: 2, x2: -15, y2: 10},
      marker: {x: -17, y: 12},
    },
  ],
  [BoardName.AMAZONIS]: [
    {
      id: 'albor_tholus',
      nameSegments: [
        {text: 'Albor', dy: -7},
        {text: 'Tholus', x: 48, dy: 12},
      ],
      transform: [85, 175],
      line: {x1: 90, y1: -3, x2: 160, y2: 2},
      marker: {x: 158, y: 5},
    },
    {
      id: 'anseris_mons',
      nameSegments: [
        {text: 'Anseris'},
        {text: 'Mons', x: 5, dy: 12},
      ],
      transform: [525, 330],
      line: {x1: 6, y1: -4, x2: -90, y2: -27},
      marker: {x: -95, y: -25},
    },
    {
      id: 'pindus_mons',
      nameSegments: [
        {text: 'Pindus'},
        {text: 'Mons', x: 5, dy: 12},
      ],
      transform: [500, 370],
      line: {x1: 6, y1: -4, x2: -90, y2: -27},
      marker: {x: -95, y: -25},
    },
    {
      id: 'ulysses_tholus',
      nameSegments: [
        {text: 'Ulysses'},
        {text: 'Tholus', x: 10, dy: 12},
      ],
      transform: [325, 496],
      line: {x1: 20, y1: -1, x2: 4, y2: -109},
      marker: {x: 1, y: -107},
    },
  ],
  [BoardName.VASTITAS_BOREALIS]: [
    {
      id: 'elysium_mons_vastitas_borealis',
      nameSegments: [
        {text: 'Elysium', dy: 15},
        {text: 'Mons', x: 5, dy: 12},
      ],
      transform: [410, 70],
    },
    {
      id: 'alba_fossae',
      nameSegments: [
        {text: 'Alba', dy: 15},
        {text: 'Fossae', x: 5, dy: 12},
      ],
      transform: [350, 70],
      line: {x1: 20, y1: 30, x2: 41, y2: 82},
      marker: {x: 39, y: 85},
    },
    {
      id: 'ceranius_fossae',
      nameSegments: [
        {text: 'Ceranius', dy: 15},
        {text: 'Fossae', x: 9, dy: 12},
      ],
      transform: [80, 230],
      line: {x1: 35, y1: 25, x2: 72, y2: 30},
      marker: {x: 66, y: 33},
    },
    {
      id: 'alba_mons',
      nameSegments: [
        {text: 'Alba', dy: 15},
        {text: 'Mons', x: 9, dy: 12},
      ],
      transform: [105, 200],
      line: {x1: 35, y1: 25, x2: 94, y2: 31},
      marker: {x: 92, y: 34},
    },
  ],
  [BoardName.TERRA_CIMMERIA]: [
    {
      id: 'albor_tholus',
      nameSegments: [
        {text: 'Albor', dy: 15},
        {text: 'Tholus', x: 5, dy: 12},
      ],
      transform: [260, 70],
      line: {x1: 38, y1: 26, x2: 63, y2: 38},
      marker: {x: 61, y: 41},
    },
    {
      id: 'apollinaris_mons',
      nameSegments: [
        {text: 'Apollinaris'},
        {text: 'Mons', x: 10, dy: 12},
      ],
      transform: [500, 210],
      line: {x1: 15, y1: 5, x2: -35, y2: 30},
      marker: {x: -40, y: 33},
    },
    {
      id: 'hadriacus_mons',
      nameSegments: [
        {text: 'Hadriacus', dy: 15},
        {text: 'Mons', x: 24, dy: 12},
      ],
      transform: [78, 320],
    },
    {
      id: 'tyrrhenus_mons',
      nameSegments: [
        {text: 'Tyrrhenus', dy: 15},
        {text: 'Mons', x: 9, dy: 12},
      ],
      transform: [80, 230],
      line: {x1: 35, y1: 25, x2: 72, y2: 30},
      marker: {x: 66, y: 33},
    },
  ],
};
export default Vue.extend({
  name: 'board',
  props: {
    game: {
      type: Object as () => GameModel,
      required: true,
    },
    tileView: {
      type: String as () => TileView,
      default: 'show',
    },
  },
  components: {
    BoardSpace,
  },
  data() {
    return {
      constants,
      spaceMap: new Map<string, SpaceModel>(this.game.spaces.map((s) => [s.id, s])),
    };
  },
  methods: {
    getAllSpacesOnMars(): Array<SpaceModel> {
      const spaces = this.game.spaces.filter((s) => s.spaceType !== SpaceType.COLONY);
      spaces.sort(
        (space1: SpaceModel, space2: SpaceModel) => {
          return parseInt(space1.id) - parseInt(space2.id);
        },
      );
      return spaces;
    },
    hasSpace(spaceId: SpaceId): boolean {
      return this.spaceMap.has(spaceId);
    },
    getSpace(spaceId: SpaceId): SpaceModel {
      const space = this.spaceMap.get(spaceId);
      if (space === undefined) {
        // For some reason Vue still calls getSpace when hasSpace is false. I thought it didn't.
        // Returning undefined as SpaceModel satisfies the type checker, but the value isn't
        // used.
        return undefined as unknown as SpaceModel;
      }
      return space;
    },
    getScaleCSS(paramLevel: GlobalParamLevel, value: number): string {
      let css = 'global-numbers-value val-' + value;
      if (value === paramLevel.value) {
        css += ' val-is-active';
      }
      return css;
    },
  },
  computed: {
    BoardName(): typeof BoardName {
      return BoardName;
    },
    LEGENDS(): typeof LEGENDS {
      return LEGENDS;
    },
    SpaceName(): typeof SpaceName {
      return SpaceName;
    },
    GlobalParameter(): typeof GlobalParameter {
      return GlobalParameter;
    },
    GLOBAL_PARAMETER_VALUES(): typeof GLOBAL_PARAMETER_VALUES {
      return GLOBAL_PARAMETER_VALUES;
    },
    FEATURES(): typeof FEATURES {
      return FEATURES;
    },

    aresData(): AresData | undefined {
      return this.game.aresData;
    },
    boardName(): BoardName {
      return this.game.gameOptions.boardName;
    },
    gameBoardClassName(): string {
      return this.game.gameOptions.expansions.venus ? 'board-cont board-with-venus' : 'board-cont board-without-venus';
    },
  },
});
</script>
