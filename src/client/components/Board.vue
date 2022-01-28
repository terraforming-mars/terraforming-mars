<template>
    <div :class="getGameBoardClassName()">
        <div class="hide-tile-button-container">
          <div class="hide-tile-button" @click="$emit('toggleHideTiles')" data-test="hide-tiles-button">
            <!-- TODO - Add i18n for this button -->
            {{ hideTiles ? 'show' : 'hide' }} tiles
          </div>
        </div>
        <div class="board-outer-spaces">
            <board-space :space="getSpaceById('01')" text="Ganymede Colony"></board-space>
            <board-space :space="getSpaceById('02')" text="Phobos Space Haven"></board-space>
            <board-space :space="getSpaceById('69')" text="Stanford Torus"></board-space>
            <template v-if="venusNextExtension">
              <board-space :space="getSpaceById('70')" text="Luna Metropolis"></board-space>
              <board-space :space="getSpaceById('71')" text="Dawn City"></board-space>
              <board-space :space="getSpaceById('72')" text="Stratopolis"></board-space>
              <board-space :space="getSpaceById('73')" text="Maxwell Base"></board-space>
            </template>
            <template v-if="pathfindersExpansion">
              <!-- <board-space :space="getSpaceById('74')" text="Martian Transhipment Station"></board-space> -->
              <board-space :space="getSpaceById('75')" text="Ceres Spaceport"></board-space>
              <board-space :space="getSpaceById('76')" text="Dyson Screens"></board-space>
              <board-space :space="getSpaceById('77')" text="Lunar Embassy"></board-space>
              <board-space :space="getSpaceById('78')" text="Venera Base"></board-space>
            </template>
        </div>

        <div class="global-numbers">
            <div class="global-numbers-temperature">
                <div :class="getScaleCSS(lvl)" v-for="(lvl, idx) in getValuesForParameter('temperature')" :key="idx">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-oxygen">
                <div :class="getScaleCSS(lvl)" v-for="(lvl, idx) in getValuesForParameter('oxygen')" :key="idx">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-venus" v-if="venusNextExtension">
                <div :class="getScaleCSS(lvl)" v-for="(lvl, idx) in getValuesForParameter('venus')" :key="idx">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-oceans">
              <span v-if="this.oceans_count === this.constants.MAX_OCEAN_TILES">
                <img width="26" src="/assets/misc/circle-checkmark.png" class="board-ocean-checkmark" :alt="$t('Completed!')">
              </span>
              <span v-else>
                {{this.oceans_count}}/{{this.constants.MAX_OCEAN_TILES}}
              </span>
            </div>

            <div v-if="aresExtension && aresData !== undefined">
                <div v-if="aresData.hazardData.erosionOceanCount.available">
                    <div class="global-ares-erosions-icon"></div>
                    <div class="global-ares-erosions-val">{{aresData.hazardData.erosionOceanCount.threshold}}</div>
                </div>
                <div v-if="aresData.hazardData.removeDustStormsOceanCount.available">
                    <div class="global-ares-remove-dust-storms-icon"></div>
                    <div class="global-ares-remove-dust-storms-val">{{aresData.hazardData.removeDustStormsOceanCount.threshold}}</div>
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

            <div v-if="altVenusBoard" class="global-alt-venus">
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
            <board-space
              v-for="curSpace in getAllSpacesOnMars()"
              :key="curSpace.id"
              :space="curSpace"
              :is_selectable="true"
              :aresExtension="aresExtension"
              :hideTiles="hideTiles"
              data-test="board-space"
            />

            <svg id="board_legend" height="550" width="630" class="board-legend">
                <g v-if="boardName === 'tharsis'" id="ascraeus_mons" transform="translate(95, 192)">
                    <text class="board-caption">
                        <tspan dy="15">Ascraeus</tspan>
                        <tspan x="12" dy="12">Mons</tspan>
                    </text>
                    <line x1="38" y1="20" x2="88" y2="26" class="board-line"></line>
                    <text x="86" y="29" class="board-caption board_caption--black">●</text>
                </g>

                <g v-if="boardName === 'tharsis'" id="pavonis_mons" transform="translate(90, 230)">
                    <text class="board-caption">
                        <tspan dy="15">Pavonis</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                    <line x1="35" y1="25" x2="72" y2="30" class="board-line" />
                    <text x="66" y="33" class="board-caption board_caption--black">●</text>
                </g>


                <g v-if="boardName === 'tharsis'" id="arsia_mons" transform="translate(77, 275)">
                    <text class="board-caption">
                        <tspan dy="15">Arsia</tspan>
                        <tspan x="-2" dy="12">Mons</tspan>
                    </text>
                    <line x1="25" y1="20" x2="49" y2="26" class="board-line" />
                    <text x="47" y="29" class="board-caption board_caption--black">●</text>
                </g>

                <g v-if="boardName === 'tharsis'" id="tharsis_tholus" transform="translate(85, 175)">
                    <text class="board-caption" dx="47">
                        <tspan dy="-7">Tharsis</tspan>
                        <tspan dy="12" x="48">Tholus</tspan>
                    </text>
                    <line y1="-3" x2="160" y2="2" class="board-line" x1="90"></line>
                    <text x="158" y="5" class="board-caption board_caption--black">&#x25cf;</text>
                </g>

                <g v-if="boardName === 'tharsis'" id="noctis_city" transform="translate(85, 320)">
                    <text class="board-caption">
                        <tspan dy="15">Noctis</tspan>
                        <tspan x="7" dy="12">City</tspan>
                    </text>
                    <line x1="30" y1="20" x2="140" y2="-20" class="board-line"></line>
                    <text x="136" y="-18" class="board-caption board_caption--black">&#x25cf;</text>
                </g>

                <g v-if="boardName === 'elysium'" id="elysium_mons" transform="translate(110, 190)">
                    <text class="board-caption">
                        <tspan dy="15">Elysium</tspan>
                        <tspan x="8" dy="12">Mons</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'elysium'" id="hecatus_tholus"  transform="translate(130, 150)">
                    <text class="board-caption">
                        <tspan dy="15">Hecatus</tspan>
                        <tspan x="3" dy="12">Tholus</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'elysium'" id="arsia_mons" transform="translate(545, 272)">
                    <text class="board-caption">
                        <tspan dy="15">Arsia</tspan>
                        <tspan x="0" dy="12">Mons</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'elysium'" id="olympus_mons" transform="translate(505, 190)">
                    <text class="board-caption">
                        <tspan x="-5" dy="15">Olympus</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'arabia terra'" id="tikhonarov" transform="translate(487, 185)">
                    <text class="board-caption">
                        <tspan>Tikhonarov</tspan>
                    </text>
                    <line x1="15" y1="5" x2="3" y2="20" class="board-line"></line>
                    <text x="1" y="22" class="board-caption board_caption--black">&#x25cf;</text>
                </g>
                <g v-if="boardName === 'arabia terra'" id="ladon" transform="translate(286, 496)">
                    <text class="board-caption">
                        <tspan>Ladon</tspan>
                    </text>
                    <line x1="20" y1="-12" x2="17" y2="-70" class="board-line"></line>
                    <text x="14" y="-68" class="board-caption board_caption--black">&#x25cf;</text>
                </g>
                <g v-if="boardName === 'arabia terra'" id="flaugergues" transform="translate(480, 405)">
                    <text class="board-caption">
                        <tspan>Flaugergues</tspan>
                    </text>
                    <line x1="0" y1="2" x2="-15" y2="10" class="board-line"></line>
                    <text x="-17" y="12" class="board-caption board_caption--black">&#x25cf;</text>
                </g>
                <g v-if="boardName === 'arabia terra'" id="charybdis" transform="translate(455, 450)">
                    <text class="board-caption">
                        <tspan>Charybdis</tspan>
                    </text>
                    <line x1="0" y1="2" x2="-15" y2="10" class="board-line"></line>
                    <text x="-17" y="12" class="board-caption board_caption--black">&#x25cf;</text>
                </g>

            </svg>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as constants from '@/constants';
import BoardSpace from '@/client/components/BoardSpace.vue';
import {IAresData} from '@/ares/IAresData';
import {SpaceModel} from '@/models/SpaceModel';
import {SpaceType} from '@/SpaceType';
import {SpaceId} from '@/boards/ISpace';

class GlobalParamLevel {
  constructor(public value: number, public isActive: boolean, public strValue: string) {
  }
}

export default Vue.extend({
  name: 'board',
  props: {
    spaces: {
      type: Array as () => Array<SpaceModel>,
    },
    venusNextExtension: {
      type: Boolean,
    },
    venusScaleLevel: {
      type: Number,
    },
    altVenusBoard: {
      type: Boolean,
    },
    boardName: {
      type: String,
    },
    oceans_count: {
      type: Number,
    },
    oxygen_level: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    aresExtension: {
      type: Boolean,
    },
    pathfindersExpansion: {
      type: Boolean,
    },
    aresData: {
      type: Object as () => IAresData | undefined,
    },
    hideTiles: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BoardSpace,
  },
  data() {
    return {
      constants,
    };
  },
  methods: {
    getAllSpacesOnMars(): Array<SpaceModel> {
      const boardSpaces: Array<SpaceModel> = [...this.spaces];
      boardSpaces.sort(
        (space1: SpaceModel, space2: SpaceModel) => {
          return parseInt(space1.id) - parseInt(space2.id);
        },
      );
      return boardSpaces.filter((s: SpaceModel) => {
        return s.spaceType !== SpaceType.COLONY;
      });
    },
    getSpaceById(spaceId: SpaceId): SpaceModel {
      for (const space of this.spaces) {
        if (space.id === spaceId) {
          return space;
        }
      }
      throw 'Board space not found by id \'' + spaceId + '\'';
    },
    getValuesForParameter(targetParameter: string): Array<GlobalParamLevel> {
      const values: Array<GlobalParamLevel> = [];
      let startValue: number;
      let endValue: number;
      let step: number;
      let curValue: number;
      let strValue: string;

      switch (targetParameter) {
      case 'oxygen':
        startValue = constants.MIN_OXYGEN_LEVEL;
        endValue = constants.MAX_OXYGEN_LEVEL;
        step = 1;
        curValue = this.oxygen_level;
        break;
      case 'temperature':
        startValue = constants.MIN_TEMPERATURE;
        endValue = constants.MAX_TEMPERATURE;
        step = 2;
        curValue = this.temperature;
        break;
      case 'venus':
        startValue = constants.MIN_VENUS_SCALE;
        endValue = constants.MAX_VENUS_SCALE;
        step = 2;
        curValue = this.venusScaleLevel;
        break;
      default:
        throw 'Wrong parameter to get values from';
      }

      for (let value: number = endValue; value >= startValue; value -= step) {
        strValue = (targetParameter === 'temperature' && value > 0) ? '+'+value : value.toString();
        values.push(
          new GlobalParamLevel(value, value === curValue, strValue),
        );
      }
      return values;
    },
    getScaleCSS(paramLevel: GlobalParamLevel): string {
      let css = 'global-numbers-value val-' + paramLevel.value + ' ';
      if (paramLevel.isActive) {
        css += 'val-is-active';
      }
      return css;
    },
    oceansValue() {
      const oceans_count = this.oceans_count || 0;
      const leftover = constants.MAX_OCEAN_TILES - oceans_count;
      if (leftover === 0) {
        return '<img width="26" src="/assets/misc/circle-checkmark.png" class="board-ocean-checkmark" :alt="$t(\'Completed!\')">';
      } else {
        return `${oceans_count}/${constants.MAX_OCEAN_TILES}`;
      }
    },
    getGameBoardClassName(): string {
      return this.venusNextExtension ? 'board-cont board-with-venus' : 'board-cont board-without-venus';
    },
  },
});
</script>
